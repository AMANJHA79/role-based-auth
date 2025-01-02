const Image= require('../models/image');
const { uploadToCloudinary } = require('../helpers/cloudinary-helper');
const fs= require('fs');
const cloudinary= require('../config/cloudinary');


const uploadImageController= async (req, res) => {
    try{

        // Check if file is missing
        if(!req.file){
            return res.status(400).json({
                success: false, 
                message: 'No image uploaded. Please try again!'});
        }

        // Check if user information is available
        if (!req.userInfo || !req.userInfo.userId) {
            return res.status(403).json({
                success: false,
                message: 'User not authenticated. Please log in.'
            });
        }

        //upload to cloudinary

        const { url , publicId}= await uploadToCloudinary(req.file.path);
        
        // create a new image in the database
        const newImage= new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });
        
        await newImage.save();

        // delete from local storage
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error('Error deleting file:', err.message);
        }
        
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully!',
            image: newImage
        })

    }
    catch(error){
        console.error('Error in uploadImageController:', error.message);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }

}


const fetchImageController = async (req,res)=>{
    try{

        //pagination 
        const page= parseInt(req.query.page) || 1;
        const limit= parseInt(req.query.limit) || 10;
        const skip= (page - 1) * limit;

        //sorting

        const sort= req.query.sort || '-createdAt';
        const sortOrder=req.query.sortOrder ==='asc' ? 1:-1;
        const totalImages= await Image.countDocuments();
        const totalPages= Math.ceil(totalImages / limit);

        const sortObj={};
        sortObj[sort]=sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);


        if (images){
            res.status(200).json({
                success: true,
                message: 'Images fetched successfully',
                currentPage: page,
                totalPages,
                totalImages,
                images
                
            });
        }

    }
    catch(error){
        console.error('Error in fetchImageController:', error.message);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

const deleteImageController = async (req, res) => {
    try {
        const imageId = req.params.id;

        // Check if user information is available
        if (!req.userInfo || !req.userInfo.userId) {
            return res.status(403).json({
                success: false,
                message: 'User not authenticated. Please log in.'
            });
        }

        const userId = req.userInfo.userId;

        // Use findById to get a single image document
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Check if image is uploaded by the current user
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this image' });
        }

        // Delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Delete the image from the database
        await Image.findByIdAndDelete(imageId);

        res.status(200).json({ success: true, message: 'Image deleted successfully' });

    } catch (error) {
        console.error('Error in deleteImageController:', error.message);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

module.exports= {
    uploadImageController,
    fetchImageController,
    deleteImageController
}


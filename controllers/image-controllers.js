const Image= require('../models/image');
const { uploadToCloudinary } = require('../helpers/cloudinary-helper');
const fs= require('fs');


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
        fs.unlinkSync(req.file.path);
        
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully!',
            image: newImage
        })

    }
    catch(error){
        console.error('Error in uploadImageController:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }

}


const fetchImageController = async (req,res)=>{
    try{
        const images= await Image.find({});
        if(images.length >0){
            res.status(200).json({
                success: true,
                Total_images: images.length,
                message: 'Images fetched successfully',
                images
            });
        }

    }
    catch(error){
        console.error('Error in fetchImageController:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}



module.exports= {
    uploadImageController,
    fetchImageController
}
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try {
        console.log('Uploading to Cloudinary:', filePath);
        const result = await cloudinary.uploader.upload(filePath);
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Error uploading to cloudinary');
    }
};

module.exports = {
    uploadToCloudinary
};
const express = require('express');
const isAuth = require('../middleware/auth-middleware'); // Import the isAuth middleware
const isAdmin = require('../middleware/isAdmin'); // Import the isAdmin middleware
const uploadMiddleware = require('../middleware/upload-middleware');
const { uploadImageController , fetchImageController , deleteImageController }= require('../controllers/image-controllers');




const router=express.Router();


//upload the image

router.post(
    '/upload',
    isAuth,
    isAdmin,
    uploadMiddleware.single('image') ,
    uploadImageController
);


router.get('/get',isAuth,fetchImageController)

router.delete('/delete/:id', isAuth , isAdmin ,deleteImageController)

module.exports=router;
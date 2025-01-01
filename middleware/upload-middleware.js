const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 
            file.fieldname +'-'+Date.now() + path.extname(file.originalname)
         );
    }
});

//file filter function
const filefilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }
    else{
        cb(null, false);
        return cb(new Error('Only images are allowed'));
    }
}


// Initialize Multer
module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: filefilter 
    
})
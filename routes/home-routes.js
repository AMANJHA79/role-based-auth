const express = require('express');
const isAuth = require('../middleware/auth-middleware');


const HomeRouter= express.Router();
HomeRouter.post('/welcome', isAuth ,(req, res) => {
    const { userName,userId,role}=req.userInfo;
    res.json({
        message: 'Welcome to my Protected home page !',
        user:{
            id: userId,
            name: userName,
            role: role
        }
    })

});

module.exports = HomeRouter;




const express = require('express');
const { RegisterUser, loginUser ,changePassword} = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware')


const authRoutes = express.Router();


authRoutes.post('/register', RegisterUser);
authRoutes.post('/login', loginUser );
authRoutes.post('/change-password', authMiddleware , changePassword );

module.exports = authRoutes;
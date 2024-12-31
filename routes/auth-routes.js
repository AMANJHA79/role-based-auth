const express = require('express');
const { RegisterUser, loginUser } = require('../controllers/user-controller');


const authRoutes = express.Router();


authRoutes.post('/register', RegisterUser);
authRoutes.post('/login', loginUser );

module.exports = authRoutes;
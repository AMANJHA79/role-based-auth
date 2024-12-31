const express = require('express');
const isAuth = require('../middleware/auth-middleware'); // Import the isAuth middleware
const isAdmin = require('../middleware/isAdmin'); // Import the isAdmin middleware

const adminRouter = express.Router();

adminRouter.post('/admin', isAuth, isAdmin, (req, res) => {
    res.send('Welcome to the Admin Page');
});

module.exports = adminRouter;
const express = require('express');

const isAdmin = async (req, res, next) => {
    try {
        console.log(req.userInfo);
        if (req.userInfo && req.userInfo.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized Access' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = isAdmin;
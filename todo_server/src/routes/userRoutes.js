const express = require('express');
const userController = require('./userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Registration route
router.post('/register',userController.registerUser);

// Login route
router.post('/login', userController.loginUser);


// Get all user route
router.get('/', authMiddleware,userController.getAllUser);

module.exports = router;

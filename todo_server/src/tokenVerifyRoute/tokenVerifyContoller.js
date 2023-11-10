const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
// import User from "../models/User"

// Registration route handler
exports.tokenVerify = async (req, res) => {
  const token = req.headers.authorization; // Assuming the token is in the Authorization header

  try {
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify and decode the token
    jwt.verify(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Token is valid, you can access the decoded information if needed.
      res.status(200).json({ message: 'Token is valid' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

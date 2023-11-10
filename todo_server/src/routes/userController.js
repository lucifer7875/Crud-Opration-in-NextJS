const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { serialize } = require('cookie')


// Registration route handler
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if the user with the same email already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = await User.create({ name, email, password: hashedPassword });

//        res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user ID using the first 3 letters of the name and a number
    const userId = await generateUniqueUserId(name);

    // Create a new user with the generated userId
    const newUser = await User.create({ userId, name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Function to generate a unique user ID
async function generateUniqueUserId(name) {
  const prefix = name.substring(0, 3).toUpperCase(); // Take the first 3 letters and make them uppercase
  let userId;
  let isUnique = false;

  // Generate a unique user ID by appending a number
  let count = 1;
  while (!isUnique) {
    userId = prefix + count.toString().padStart(4, '0'); // You can change the padding to match your needs
    // Check if the generated userId is unique in the database
    const existingUser = await User.findOne({ where: { userId } });
    if (!existingUser) {
      isUnique = true;
    } else {
      count++;
    }
  }

  return userId;
}


// Login route handler
exports.loginUser = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: '1h', // You can adjust the expiration time
    });
 // Set the JWT token as a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get All route handler

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json({ message: 'Record fetched successfully', users });
  } catch ({ message }) {
    throw new Error(message);
  }
}





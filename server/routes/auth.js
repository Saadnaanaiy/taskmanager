import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists by email
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists!' });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '30d',
    });

    // Return success message with token and user ID
    return res.status(200).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding user.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: 'Wrong credentials!' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '30d',
    });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Login successful!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error logging in.' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }

    return res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Error fetching profile.' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, email },
      { new: true, select: '-password' },
    );

    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      message: 'Profile updated!',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Error updating profile.' });
  }
});

// Delete profile
router.delete('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized!' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    await User.findByIdAndDelete(decoded.id);

    return res
      .status(200)
      .json({
        success: true,
        id: decoded.id,
        message: 'Account deleted successfully!',
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Error deleting profile.' });
  }
});

export default router;

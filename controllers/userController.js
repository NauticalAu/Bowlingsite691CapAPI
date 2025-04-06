const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const register = async (req, res) => {
  console.log('📥 Register body:', req.body);
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(fullName, email, hashedPassword);
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  console.log('🔑 Login body:', req.body);
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid password' });

    req.session.userId = user.user_id;
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.session.userId;
  const { fullName, email } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const updatedUser = await User.updateUser(userId, fullName, email);
    res.json({ message: 'Profile updated', profile: updatedUser });
  } catch (err) {
    console.error('🔥 Error updating profile:', err);
    res.status(500).json({ error: 'Update failed' });
  }
};

const changePassword = async (req, res) => {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;
  
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const user = await User.findUserById(userId);
      const match = await bcrypt.compare(currentPassword, user.password_hash);
  
      if (!match) {
        return res.status(403).json({ error: 'Current password is incorrect' });
      }
  
      const newHash = await bcrypt.hash(newPassword, 10);
      const updated = await User.updatePassword(userId, newHash);
      res.json({ message: '✅ Password updated' });
    } catch (err) {
      console.error('🔥 Password update error:', err);
      res.status(500).json({ error: 'Failed to update password' });
    }
  };

module.exports = {
  register,
  login,
  updateProfile,
  changePassword
};
// This code defines a userController for managing user registration and login.
// It uses bcrypt for password hashing and comparison.
// The register function hashes the password and creates a new user in the database.
// The login function checks if the user exists and verifies the password.
// If successful, it sets the user ID in the session.
// The updateProfile function updates the user's profile information.
// It checks if the user is logged in before attempting to update the profile.
// All functions include error handling and return appropriate responses.
// The code uses async/await syntax for handling asynchronous operations.
// The bcrypt library is used for secure password hashing.
// The controller functions are exported for use in the main server file.
// The code assumes that a session management system is in place to track user sessions.
// The controller interacts with a user model to perform database operations.
// The code also includes logging statements to help with debugging.
// The controller functions are modular and can be easily extended or modified.
// The controller is designed to be used with an Express.js application.    
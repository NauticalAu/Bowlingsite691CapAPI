const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerRules, loginRules, validate } = require('../validators/userValidator');

// Register route (with validation + logging)
router.post(
  '/register',
  registerRules,                // 1) run validation checks
  validate,                     // 2) bail out with 400 + errors if invalid
  (req, res, next) => {         // 3) your existing log middleware
    console.log('📩 /api/users/register hit!');
    next();
  },
  userController.register       // 4) actual controller
);

// Login route (with validation)
router.post(
  '/login',
  loginRules,                   // 1) ensure email/password shape
  validate,                     // 2) return 400 if invalid
  userController.login          // 3) then call your login handler
);

// Session check route
router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({ message: 'You are logged in', userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// Basic health check
router.get('/test', (req, res) => {
  res.send('✅ Route working');
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); 
    res.json({ message: 'Logged out successfully' });
  });
});

// Profile update
router.put('/profile', userController.updateProfile);

// Password change
router.put('/change-password', userController.changePassword);

module.exports = router;


// // This code sets up a route for user registration.
// // It uses Express.js to create a router.
// // The router handles POST requests to the /register endpoint.
// // It logs the request and then calls the register function from the userController.
// // The router also handles POST requests to the /login endpoint.
// // It calls the login function from the userController.
// // Additionally, it includes a session check route to verify if a user is logged in.
// // The /test endpoint is a basic health check.
// // Finally, it includes a logout route that destroys the session and clears the session cookie.
// // The router is exported for use in the main server file.


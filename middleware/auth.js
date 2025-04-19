// middleware/auth.js
module.exports = function authenticate(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Please log in.' });
  };
  
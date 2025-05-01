// validators/userValidator.js
const { body, validationResult } = require('express-validator');

exports.registerRules = [
  body('fullName')
    .isLength({ min: 2 })
    .withMessage('fullName must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];

exports.loginRules = [
  body('email')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

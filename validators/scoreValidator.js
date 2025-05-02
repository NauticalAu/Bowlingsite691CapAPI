// validators/scoreValidator.js
const { body, validationResult } = require('express-validator');

exports.createScoreRules = [
  body('gameId')
    .isInt({ gt: 0 })
    .withMessage('gameId must be a positive integer'),
  body('frameNumber')
    .isInt({ min: 1, max: 10 })
    .withMessage('frameNumber must be between 1 and 10'),
  body('firstRoll')
    .isInt({ min: 0, max: 10 })
    .withMessage('firstRoll must be between 0 and 10'),
  body('secondRoll')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('secondRoll must be between 0 and 10'),
  body('bonusRoll')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('bonusRoll must be between 0 and 10'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return all validation errors in a consistent format
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

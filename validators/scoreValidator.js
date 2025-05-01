// validators/scoreValidator.js
const { body, validationResult } = require('express-validator');

exports.createScoreRules = [
  body('game_id')
    .isInt({ gt: 0 })
    .withMessage('game_id must be a positive integer'),
  body('frame')
    .isInt({ min: 1, max: 10 })
    .withMessage('frame must be between 1 and 10'),
  body('roll')
    .isInt({ min: 1, max: 2 })
    .withMessage('roll must be 1 or 2'),
  body('pins')
    .isInt({ min: 0, max: 10 })
    .withMessage('pins must be between 0 and 10'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // send back all validation errors
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// src/routes/alleyRoutes.js
const express = require('express');
const router  = express.Router();
const logger  = require('../config/logger');
const {
  getAlleysByZip,       // renamed in controller to handle GET /api/alleys?zip=…
  getAlleyByPlaceId     // handles GET /api/alleys/:placeId
} = require('../controllers/alleyController');

// GET /api/alleys?zip=#####
router.get(
  '/',
  (req, res, next) => {
    logger.info(`🎳 Alley search by ZIP: ${req.query.zip}`);
    next();
  },
  getAlleysByZip
);

// GET /api/alleys/:placeId
router.get(
  '/:placeId',
  (req, res, next) => {
    logger.info(`🎳 Fetch alley details for placeId: ${req.params.placeId}`);
    next();
  },
  getAlleyByPlaceId
);

module.exports = router;

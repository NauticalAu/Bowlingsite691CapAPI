// src/routes/alleyRoutes.js
const express = require('express');
const router  = express.Router();
const logger  = require('../config/logger');
const {
  searchByZip,
  getAlleyByPlaceId
} = require('../controllers/alleyController');

// GET /api/alleys/search?zip=#####  
router.get(
  '/search',
  (req, res, next) => {
    logger.info(`🎳 Alley search by ZIP: ${req.query.zip}`);
    next();
  },
  searchByZip
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

const express = require('express');
const router = express.Router();
const alleyController = require('../controllers/alleyController');

// ✅ General before specific
router.get('/', alleyController.getAlleysByZip);         // handles ?zip=62016

router.get('/:id', alleyController.getAlleyById);        // must be last

module.exports = router;

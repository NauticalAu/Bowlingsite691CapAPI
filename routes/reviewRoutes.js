const express = require('express');
const router  = express.Router({ mergeParams: true });
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/reviewController');

// list and add reviews keyed by Google place_id
router.get('/', ctrl.listByPlace);
router.post('/', auth, ctrl.addReview);

module.exports = router;
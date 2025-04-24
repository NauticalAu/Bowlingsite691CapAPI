const reviewService = require('../services/reviewService');

// GET /api/places/:placeId/reviews
exports.listByPlace = async (req, res) => {
  const reviews = await reviewService.getByPlace(req.params.placeId);
  res.json(reviews);
};

// POST /api/places/:placeId/reviews
exports.addReview = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { rating, content } = req.body;
  const newRev = await reviewService.create(
    req.params.placeId, userId, rating, content
  );
  res.status(201).json(newRev);
};
const axios        = require('axios');
const alleyService = require('../services/alleyService');

// Handles GET /api/alleys/search?zip=#####
exports.searchByZip = async (req, res) => {
  const zip = req.query.zip;
  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code' });
  }

  try {
    const alleys = await alleyService.findByZip(zip);
    return res.json({ alleys });
  } catch (err) {
    console.error('Error fetching alleys by zip:', err);
    return res.status(500).json({ error: 'Failed to load alleys' });
  }
};

// Handles GET /api/alleys/:placeId
exports.getAlleyByPlaceId = async (req, res) => {
  const placeId = req.params.placeId;

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key:      process.env.GOOGLE_API_KEY,   // ← use your actual env var
          fields:   'name,formatted_address,formatted_phone_number,website,opening_hours,rating'
        }
      }
    );

    const data = response.data;
    if (data.status !== 'OK' || !data.result) {
      console.error('Places API error:', data.status, data.error_message);
      return res
        .status(404)
        .json({ error: data.error_message || 'Place not found', status: data.status });
    }

    const r = data.result;
    return res.json({
      place_id:    placeId,
      name:        r.name,
      address:     r.formatted_address,
      phone:       r.formatted_phone_number,
      website_url: r.website || null,
      open_hours:  r.opening_hours?.weekday_text || [],
      rating:      r.rating || null
    });
  } catch (err) {
    console.error('❌ Failed to fetch place details:', err);
    return res.status(500).json({ error: 'Failed to load alley details' });
  }
};

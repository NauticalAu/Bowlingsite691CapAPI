// src/controllers/alleyController.js
const axios = require('axios');

// GET /api/alleys?zip=xxxxx
exports.getAlleysByZip = async (req, res) => {
  const zip = req.query.zip;
  if (!zip) {
    return res.status(400).json({ error: 'Zip code is required' });
  }
  try {
    const alleys = await require('../services/alleyService').findByZip(zip);
    res.json({ alleys });
  } catch (err) {
    console.error('Error fetching alleys by zip:', err);
    res.status(500).json({ error: 'Failed to load alleys' });
  }
};

// GET /api/alleys/:placeId
exports.getAlleyByPlaceId = async (req, res) => {
  const placeId = req.params.placeId;
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_PLACES_API_KEY,
          fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating'
        }
      }
    );

    const data = response.data;
    if (data.status !== 'OK' || !data.result) {
      return res
        .status(404)
        .json({ error: data.error_message || 'Place not found', status: data.status });
    }

    const r = data.result;
    res.json({
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
    res.status(500).json({ error: 'Failed to load alley details' });
  }
};

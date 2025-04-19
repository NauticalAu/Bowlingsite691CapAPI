// routes/alleyRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Make sure this is called somewhere in your app

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/search', async (req, res) => {
  const { zip } = req.query;

  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code' });
  }

  try {
    const googleRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `bowling alley near ${zip}`,
          key: GOOGLE_API_KEY
        }
      }
    );

    const results = googleRes.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      location: place.geometry?.location,
      place_id: place.place_id
    }));

    res.json({ alleys: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with the Google API' });
  }
});

module.exports = router;

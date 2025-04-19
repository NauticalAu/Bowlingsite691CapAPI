const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// GET /api/alleys/search?zip=90210
router.get('/search', async (req, res) => {
  const { zip } = req.query;

  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code' });
  }

  try {
    // Step 1: Geocode the ZIP to get lat/lng
    const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: zip,
        key: GOOGLE_API_KEY
      }
    });

    const geoData = geoRes.data;
    if (!geoData.results.length) {
      return res.status(404).json({ error: 'Could not find location for zip code' });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // Step 2: Nearby Search for bowling alleys
    const placesRes = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 15000, // 15km radius (~9 miles)
        keyword: 'bowling alley',
        key: GOOGLE_API_KEY
      }
    });

    const results = placesRes.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      location: place.geometry?.location,
      place_id: place.place_id
    }));

    res.json({ alleys: results });

  } catch (err) {
    console.error('Google API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong with the Google API' });
  }
});

module.exports = router;
// This code defines a route for searching bowling alleys by ZIP code using the Google Places API.
// It first geocodes the ZIP code to get latitude and longitude, then performs a nearby search for bowling alleys within a 15km radius.
// The results are returned in JSON format, including the name, address, rating, and location of each alley.
// The code uses the axios library to make HTTP requests to the Google API and handles errors appropriately.    
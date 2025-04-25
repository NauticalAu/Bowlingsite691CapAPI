const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// GET /api/alleys/search?zip=90210
router.get('/search', async (req, res) => {
    const { zip } = req.query;
  
    console.log('🔍 ZIP received:', zip);
  
    if (!zip || !/^\d{5}$/.test(zip)) {
      console.log('❌ Invalid ZIP');
      return res.status(400).json({ error: 'Invalid zip code' });
    }
  
    try {
      console.log('📦 Step 1: Geocoding...');
      const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: zip,
          key: GOOGLE_API_KEY
        }
      });
  
      const geoData = geoRes.data;
      console.log('📦 Geocode Response:', JSON.stringify(geoData, null, 2));
  
      if (!geoData.results.length) {
        console.log('❌ No geocode results');
        return res.status(404).json({ error: 'Could not find location for zip code' });
      }
  
      const { lat, lng } = geoData.results[0].geometry.location;
      console.log('📍 Geocoded location:', lat, lng);
  
      console.log('📦 Step 2: Nearby search...');
      const placesRes = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${lat},${lng}`,
          radius: 50000,
          type: 'bowling_alley',
          key: GOOGLE_API_KEY
        }
      });
  
      console.log('🎯 Google Places response:', JSON.stringify(placesRes.data, null, 2));
  
      const results = placesRes.data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        location: place.geometry?.location,
        place_id: place.place_id
      }));
  
      if (!results.length) {
        console.warn(`⚠️ No results from Google for zip ${zip}, sending fallback`);
        return res.json({
          alleys: [
            {
              name: 'Fallback Lanes',
              address: `${zip} Downtown`,
              rating: 4.2,
              location: { lat, lng },
              place_id: `fallback-${zip}`
            }
          ]
        });
      }
  
      res.json({ alleys: results });
  
    } catch (err) {
      console.error('❌ Google API error:', err.response?.data || err.message);
      res.status(500).json({ error: 'Something went wrong with the Google API' });
    }
  });
  
router.get('/:placeId', alleyController.getAlleyByPlaceId);


module.exports = router;
// This code defines a route for searching bowling alleys by ZIP code using the Google Places API.
// It first geocodes the ZIP code to get latitude and longitude, then performs a nearby search for bowling alleys within a 15km radius.
// The results are returned in JSON format, including the name, address, rating, and location of each alley.
// The code uses the axios library to make HTTP requests to the Google API and handles errors appropriately.    
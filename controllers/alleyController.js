// src/controllers/alleyController.js
const axios = require('axios');

// GET /api/alleys?zip=#####
// — geocode the ZIP, then nearbySearch for bowling alleys
exports.searchByZip = async (req, res) => {
  const zip = req.query.zip;
  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid zip code' });
  }

  try {
    // 1️⃣ Geocode ZIP → {lat,lng}
    const geo = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address: zip, key: process.env.GOOGLE_PLACES_API_KEY }
    });
    if (!geo.data.results?.length) {
      return res.status(404).json({ error: 'Could not find location for zip code' });
    }
    const { lat, lng } = geo.data.results[0].geometry.location;

    // 2️⃣ Nearby search for bowling_alley
    const places = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 50000,
        type: 'bowling_alley',
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    const results = places.data.results.map(p => ({
      name:     p.name,
      address:  p.vicinity,
      rating:   p.rating,
      location: p.geometry?.location,
      place_id: p.place_id
    }));

    // fallback if Google returns nothing
    if (!results.length) {
      return res.json({
        alleys: [{
          name:       'Fallback Lanes',
          address:    `${zip} area`,
          rating:     4.2,
          location:   { lat, lng },
          place_id:   `fallback-${zip}`
        }]
      });
    }

    res.json({ alleys: results });
  } catch (err) {
    console.error('❌ Google API error in searchByZip:', err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong with the Google API' });
  }
};

// GET /api/alleys/:placeId
// — simple Place Details lookup
exports.getAlleyByPlaceId = async (req, res) => {
  const placeId = req.params.placeId;
  try {
    const r = (await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key:      process.env.GOOGLE_PLACES_API_KEY,
          fields:   'name,formatted_address,formatted_phone_number,website,opening_hours,rating'
        }
      }
    )).data;

    if (r.status !== 'OK' || !r.result) {
      console.error('Places API error:', r.status, r.error_message);
      return res
        .status(404)
        .json({ error: r.error_message || 'Place not found', status: r.status });
    }

    const p = r.result;
    res.json({
      place_id:    placeId,
      name:        p.name,
      address:     p.formatted_address,
      phone:       p.formatted_phone_number,
      website_url: p.website || null,
      open_hours:  p.opening_hours?.weekday_text || [],
      rating:      p.rating || null
    });
  } catch (err) {
    console.error('❌ Failed to fetch place details:', err);
    res.status(500).json({ error: 'Failed to load alley details' });
  }
};

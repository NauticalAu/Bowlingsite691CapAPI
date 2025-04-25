const alleyService = require('../services/alleyService');

exports.getAlleyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const alley = await alleyService.getById(id);

    if (!alley) {
      return res.status(404).json({ error: 'Alley not found' });
    }

    res.json(alley);
  } catch (err) {
    console.error('Error fetching alley:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAlleysByZip = async (req, res) => {
    const zip = req.query.zip;
  
    if (!zip) {
      return res.status(400).json({ error: 'Zip code is required' });
    }
  
    try {
      const alleys = await alleyService.findByZip(zip);
      res.json({ alleys });
    } catch (err) {
      console.error('Error fetching alleys by zip:', err);
      res.status(500).json({ error: 'Failed to load alleys' });
    }
  };

  const axios = require('axios');

  exports.getAlleyByPlaceId = async (req, res) => {
    const placeId = req.params.placeId;
    try {
      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: process.env.GOOGLE_PLACES_API_KEY,
            fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating'
          }
        }
      );
      const r = data.result;
      res.json({
        place_id:     placeId,
        name:         r.name,
        address:      r.formatted_address,
        phone:        r.formatted_phone_number,
        website_url:  r.website,
        open_hours:   r.opening_hours?.weekday_text,
        rating:       r.rating
      });
    } catch (err) {
      console.error('❌ Failed to fetch place details:', err);
      res.status(500).json({ error: 'Failed to load alley details' });
    }
  };
    
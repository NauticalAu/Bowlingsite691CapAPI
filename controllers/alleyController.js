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
  
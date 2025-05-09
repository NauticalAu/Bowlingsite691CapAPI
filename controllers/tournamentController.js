const tournamentService = require('../services/tournamentService');

exports.getAllTournaments = async (req, res) => {
  const result = await tournamentService.getAll();
  res.json(result);
};

exports.getTournamentById = async (req, res) => {
  const result = await tournamentService.getById(req.params.id);
  res.json(result);
};

exports.createTournament = async (req, res) => {
  const organizer_id = req.session.userId;
  const { name, description, start_date, end_date, alley_id } = req.body;
  try {
    const result = await tournamentService.create({
      name,
      description,
      start_date,
      end_date,
      alley_id,
      organizer_id
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('❌ Failed to create tournament:', err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
};

exports.joinTournament = async (req, res) => {
  const userId = req.session.userId;
  const tournamentId = req.params.id;

  try {
    const result = await tournamentService.join(tournamentId, userId);
    res.json(result);
  } catch (err) {
    console.error('Error joining tournament:', err);
    res.status(500).json({ error: 'Failed to join tournament' });
  }
};

exports.getParticipants = async (req, res) => {
    try {
      const participants = await tournamentService.getParticipants(req.params.id);
      res.json(participants);
    } catch (err) {
      console.error('Error fetching participants:', err);
      res.status(500).json({ error: 'Failed to load participants' });
    }
  };

  exports.leaveTournament = async (req, res) => {
    const userId = req.session.userId;
    const tournamentId = req.params.id;
  
    try {
      const result = await tournamentService.leave(tournamentId, userId);
      res.json(result);
    } catch (err) {
      console.error('Error leaving tournament:', err);
      res.status(500).json({ error: 'Failed to leave tournament' });
    }
  };

exports.getTournamentsByAlleyId = async (req, res) => {
    try {
      const results = await tournamentService.getByAlleyId(req.params.alleyId);
      res.json(results);
    } catch (err) {
      console.error('Error getting tournaments by alley:', err);
      res.status(500).json({ error: 'Failed to load tournaments for alley' });
    }
  };

exports.deleteTournament = async (req, res) => {
    try {
      await tournamentService.delete(req.params.id);
      res.json({ message: 'Tournament deleted' });
    } catch (err) {
      console.error('❌ Failed to delete tournament:', err);
      res.status(500).json({ error: 'Failed to delete tournament' });
    }
  };

// Update a tournament
exports.updateTournament = async (req, res) => {
  try {
    const id      = req.params.id;
    const changes = req.body; // e.g. { name, description, start_date, end_date, bowling_alley_id }

    const updated = await tournamentService.update(id, changes);
    if (!updated) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update tournament:', err);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
};  
  
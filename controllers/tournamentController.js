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
  const result = await tournamentService.create(req.body);
  res.status(201).json(result);
};

exports.joinTournament = async (req, res) => {
  const result = await tournamentService.join(req.params.id, req.body.userId);
  res.json(result);
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
  const result = await tournamentService.leave(req.params.id, req.body.userId);
  res.json(result);
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
  
const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const tournamentService    = require('../services/tournamentService');
const authenticate         = require('../middleware/auth');

// List & create
router.get('/', tournamentController.getAllTournaments);
router.post('/', tournamentController.createTournament);

// Join & leave
router.post('/:id/join', authenticate, tournamentController.joinTournament);
router.delete('/:id/leave', tournamentController.leaveTournament);

// Participants
router.get('/:id/participants', async (req, res) => {
  try {
    const participants = await tournamentService.getParticipants(req.params.id);
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load participants' });
  }
});

// By alley
router.get('/alley/:alleyId', tournamentController.getTournamentsByAlleyId);

// Fetch, update, delete a single tournament
router.get('/:id', tournamentController.getTournamentById);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;

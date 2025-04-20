const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const tournamentService = require('../services/tournamentService'); // ✅ required
const authenticate = require('../middleware/auth');

router.get('/', tournamentController.getAllTournaments);
router.post('/', tournamentController.createTournament);
router.post('/:id/join', authenticate, tournamentController.joinTournament);
router.delete('/:id/leave', tournamentController.leaveTournament);

router.get('/:id/participants', async (req, res) => {
  try {
    const participants = await tournamentService.getParticipants(req.params.id);
    res.json(participants);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ error: 'Failed to load participants' });
  }
});

router.get('/:id', tournamentController.getTournamentById);
router.delete('/:id', tournamentController.deleteTournament);
router.get('/alley/:alleyId', tournamentController.getTournamentsByAlleyId);

module.exports = router;

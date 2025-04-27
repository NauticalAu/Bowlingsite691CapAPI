// src/routes/tournamentRoutes.js
const express              = require('express');
const router               = express.Router();
const authenticate         = require('../middleware/auth');
const tournamentController = require('../controllers/tournamentController');

// List all & create new
router
  .route('/')
  .get(tournamentController.getAllTournaments)
  .post(authenticate, tournamentController.createTournament);

// Join & leave a tournament
router
  .post('/:id/join', authenticate, tournamentController.joinTournament)
  .delete('/:id/leave', authenticate, tournamentController.leaveTournament);

// List participants
router.get('/:id/participants', authenticate, tournamentController.getParticipants);

// Tournaments by alley
router.get('/alley/:alleyId', tournamentController.getTournamentsByAlleyId);

// Fetch / update / delete one tournament
router
  .route('/:id')
  .get(tournamentController.getTournamentById)
  .put(authenticate, tournamentController.updateTournament)
  .delete(authenticate, tournamentController.deleteTournament);

module.exports = router;

// routes/leagueRoutes.js
const express = require('express');
const router = express.Router();
const leaguesController = require('../controllers/leaguesController');

router.post('/create', leaguesController.createLeague);
router.post('/join', leaguesController.joinLeague);
router.get('/', leaguesController.getLeagues);
router.get('/:id/standings', leaguesController.getLeagueStandings);


module.exports = router;

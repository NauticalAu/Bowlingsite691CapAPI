// controllers/leaguesController.js
const LeagueModel = require('../models/leagueModel');

exports.createLeague = async (req, res) => {
  const { name, description, createdBy } = req.body;
  try {
    const league = await LeagueModel.createLeague(name, description, createdBy);
    res.status(201).json(league);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create league' });
  }
};

exports.joinLeague = async (req, res) => {
  const { leagueId, userId } = req.body;
  try {
    const member = await LeagueModel.joinLeague(leagueId, userId);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join league' });
  }
};

exports.getLeagues = async (_req, res) => {
  try {
    const leagues = await LeagueModel.getAllLeagues();
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
};

exports.getLeagueStandings = async (req, res) => {
    const leagueId = req.params.id;
    try {
      const standings = await LeagueModel.getStandingsByLeagueId(leagueId);
      res.json(standings);
    } catch (error) {
      console.error('❌ Error fetching standings:', error);
      res.status(500).json({ error: 'Failed to fetch standings' });
    }
  };

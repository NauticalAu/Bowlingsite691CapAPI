// server.js
require('dotenv').config();               // Load .env first
const express     = require('express');
const session     = require('express-session');
const cors        = require('cors');
const morgan      = require('morgan');
const logger      = require('./config/logger');
const db          = require('./config/db');

const app   = express();
const PORT  = process.env.PORT || 8080;

// ── HTTP Request Logging ──────────────────────────────────────────────────────
// Use morgan, streaming into our Winston logger
app.use(morgan('combined', { stream: logger.stream }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://bowling-site691-cap-ui.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ── Body Parser ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── Session ───────────────────────────────────────────────────────────────────
app.set('trust proxy', 1); // for secure cookies behind proxy
app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET || 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // only over HTTPS
    httpOnly: true,    // no client-side JS access
    sameSite: 'none'   // allow cross-site (if you need it)
  }
}));

// ── Health & Test Endpoints ───────────────────────────────────────────────────
app.post('/ping', (req, res) => {
  logger.info('📡 /ping received');
  res.send('pong');
});
app.get('/', (req, res) => {
  res.send('BowlingSite API Running');
});

// ── Mount Routes ──────────────────────────────────────────────────────────────
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/games',      require('./routes/gameRoutes'));
app.use('/api/profile',    require('./routes/profileRoute'));
app.use('/api/leagues',    require('./routes/leagueRoutes'));
app.use('/api/tournaments',require('./routes/tournamentRoutes'));
app.use('/api/alleys',     require('./routes/alleyRoutes'));
app.use('/api/leaderboard',require('./routes/leaderboardRoutes'));
app.use('/api/blog',       require('./routes/blogRoutes'));
app.use('/api/favorites',  require('./routes/favoriteRoutes'));
app.use('/api/places/:placeId/reviews', require('./routes/reviewRoutes'));

// ── Error Handling ────────────────────────────────────────────────────────────
// Any thrown error goes here
app.use((err, req, res, next) => {
  logger.error(`🔥 Unhandled Error: ${err.stack || err}`);
  res.status(500).send('Something broke!');
});

// 404 for anything not matched above
app.use((req, res) => {
  logger.warn(`❓ Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
db.connect()
  .then(() => logger.info('PostgreSQL connected'))
  .catch(err => logger.error(`PostgreSQL connection error: ${err}`)); 
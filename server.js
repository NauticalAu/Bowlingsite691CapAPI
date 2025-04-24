const db = require('./config/db');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🌐 Log every incoming request
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url}`);
  next();
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://bowling-site691-cap-ui.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());

  app.set('trust proxy', 1); // Trust first proxy for secure cookies

  app.use(session({
    name: 'connect.sid', 
    secret: process.env.SESSION_SECRET || 'super-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        // ✅ Required for HTTPS
      httpOnly: true,      // ✅ Best practice: prevents JS access
      sameSite: 'none'     // ✅ Allows cross-site cookies
    }
  }));
  

// 🧪 Test route to confirm the server is receiving POST requests
app.post('/ping', (req, res) => {
  console.log('📡 /ping received');
  res.send('pong');
});

// 🌍 Root test route
app.get('/', (req, res) => res.send('BowlingSite API Running'));

// ✅ Register routes BEFORE starting the server
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

const profileRoutes = require('./routes/profileRoute');
app.use('/api/profile', profileRoutes);

const leagueRoutes = require('./routes/leagueRoutes'); 
app.use('/api/leagues', leagueRoutes);                 

const tournamentRoutes = require('./routes/tournamentRoutes');
app.use('/api/tournaments', tournamentRoutes);

const alleyRoutes = require('./routes/alleyRoutes');
app.use('/api/alleys', alleyRoutes);

const leaderboardRoutes = require('./routes/leaderboardRoutes');
app.use('/api/leaderboard', leaderboardRoutes);

const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog', blogRoutes);

const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/places/:placeId/reviews', reviewRoutes);


// 🛑 Catch-all error handler
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err);
  res.status(500).send('Something broke!');
});

// 🧯 Catch-all route for undefined paths
app.use((req, res) => {
  console.warn(`❓ Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// ✅ Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

# Bowlingsite691CapAPI
API for Capstone Bowling Site

## Live Demo
- **API**: https://bowling-api.onrender.com

## Project Overview
The Bowling Hub API provides backend services for user authentication, score tracking, league management, alley search, and event handling.

## Features
- **User Authentication**: Secure registration and login (session-based).  
- **Score Management**: Submit, store, and retrieve bowling scores.  
- **League Standings**: Manage leagues and track rankings.  
- **Alley Locator**: Search for nearby bowling alleys.  
- **Event Management**: Create and join tournaments.  
- **Stretch Features**: User reviews and ratings for alleys.

## Tech Stack
- **Backend Framework:** Express.js v4.x  
- **Runtime:** Node.js ≥14.x, npm ≥6.x  
- **Database:** PostgreSQL (hosted on Neon)  
- **Authentication:** express-session (cookie-based)  
- **API Documentation:**  
  - Swagger UI: https://bowling-api.onrender.com/api/docs  
  - Postman Collection: `docs/BowlingSite.postman_collection.json`

| Variable         | Description                                    |
| ---------------- | ---------------------------------------------- |
| `PORT`           | Port for Express (default: 8080)               |
| `DATABASE_URL`   | PostgreSQL connection string                   |
| `SESSION_SECRET` | Secret for express-session cookies             |
| `CORS_ORIGINS`   | Comma-separated allowed origins (e.g. your UI) |

## API Endpoints

POST   /api/users/register       # Register a new user
POST   /api/users/login          # Log in
GET    /api/users/me             # Check current session
POST   /api/games/start          # Start a new game
POST   /api/games/score          # Submit a frame’s score
GET    /api/games/summary        # Retrieve all games’ summaries
DELETE /api/games                # Delete all games for the authenticated user

### Other routes:
### /api/profile, /api/leagues, /api/tournaments,
### /api/alleys, /api/leaderboard, /api/blog,
### /api/favorites, /api/places/:placeId/reviews


## Development Workflow
Follow Agile sprints and track backlog in GitHub Projects:

Sprint Backlog (API)

Tech Tasks (UI)

Related Repositories
UI Repo: https://github.com/NauticalAu/BowlingSite691CapUI

## Environment Variables

Copy and fill in your own values:

```bash
cp .env.example .env

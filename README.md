# Bowlingsite691CapAPI
APi for Capstone Bowling Site

## Live Demo
- **API**: https://bowling-api.onrender.com  

## Project Overview
The Bowling Hub API provides backend services for user authentication, score tracking, league management, alley search, and event handling.

## Features
- **User Authentication**: Secure registration and login without JWT.
- **Score Management**: Submit, store, and retrieve bowling scores.
- **League Standings**: Manage leagues and track rankings.
- **Alley Locator**: Search for nearby bowling alleys.
- **Event Management**: Create and join tournaments.
- **Stretch Features**: User reviews and ratings for alleys.

## Tech Stack
- **Backend Framework:** Express.js v4.x
- **Node.js:** ≥14.x, **npm:** ≥6.x  
- **Database**: PostgreSQL
- **Authentication**: Session-based authentication
- **API Documentation**: (Swagger/Postman collection)

## Development Workflow
Follow Agile sprints based on the Service Backlog.

Track tasks in the GitHub Projects section.
https://github.com/users/SpicyNine11/projects/3 
https://github.com/users/SpicyNine11/projects/5

UI Repo - https://github.com/SpicyNine11/BowlingSite691CapUI

POST	/users/register	Register a new user
POST	/users/login	User login
POST	/games/start	Start a new game
POST	/games/score	Submit score
GET	/games/summary	Retrieve score summary
GET	/leaderboard	Get top scores

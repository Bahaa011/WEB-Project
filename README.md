
# Speed Hub - Speedrun Platform

Speed Hub is a website designed for the speedrunning community, where users can share and track their speedrun records across multiple games. It supports features like leaderboard tracking, video proof submissions, user registrations, and more. The platform is designed to provide an organized and comprehensive system for the speedrunning community to record, verify, and compare their achievements.

## Features

- **User Registration and Authentication**: Users can create accounts, log in, and manage their profile.
- **Leaderboard System**: A global leaderboard system that tracks speedrun times across multiple games, versions, and categories.
- **Record Submission**: Users can submit their speedrun records, including details such as time, version, categories, and a video proof URL.
- **Category and Version Filtering**: Filter speedruns based on game categories, versions, or user preferences.
- **Comments and Interaction**: Users can interact with others by commenting on records to provide feedback or share tips.

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Usage](#usage)

## Installation

Follow these steps to set up your own instance of Speed Hub:

### Prerequisites

- Node.js (v16 or higher)
- MySQL or MariaDB
- npm (Node Package Manager)

### Dependencies

- bcrypt
- dotenv
- express
- express-validator
- express-session
- mysql2
- body-parser
- moment
- multer
- ejs
- path

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Bahaa011/WEB-Project.git
   ```

2. Navigate to the project folder:

   ```bash
   cd WEB-Project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Setup

### Configuration

- **Environment Variables**: Configure environment variables for use (e.g., `DB_HOST`, `JWT_SECRET_KEY`).
- **Authentication**: The site uses JWT tokens for secure authentication. Ensure you set up the appropriate JWT secret in your environment file.
  
### Example `.env` File:

```env
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

## Usage

Once the application is set up, you can access it in your browser at `http://localhost:3000`.

### Available Endpoints

- **GET /records**: Fetch all records.
- **POST /records**: Submit a new speedrun record.
- **GET /records/:id**: Fetch a specific record by its ID.
- **GET /users/:id**: Fetch a user’s profile.
- **GET /records/:id/filter**: Fetch the leaderboard, filtered by game, version, or category.
- **GET /games/search?q=** : Search for a game by its name
- **GET /users/search?q=** : Search for a user by their username
- **POST /login**: User login.
- **POST /register**: User registration.

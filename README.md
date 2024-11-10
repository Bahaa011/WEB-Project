
# Speed Hub - Speedrun Records Platform

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

# Dependencies for Speedrun Hub Project

The following dependencies are required to run the Speedrun Hub project:

### 1. **bcrypt** 
   - Version: ^5.1.1
   - Description: A library for hashing passwords securely.

### 2. **dotenv** 
   - Version: ^16.4.5
   - Description: Loads environment variables from a `.env` file into `process.env`.

### 3. **express** 
   - Version: ^4.21.1
   - Description: Fast, unopinionated, minimalist web framework for Node.js.

### 4. **express-validator** 
   - Version: ^7.2.0
   - Description: Middleware for validating and sanitizing input in Express.js.

### 5. **jsonwebtoken** 
   - Version: ^9.0.2
   - Description: A library for creating and verifying JSON Web Tokens (JWT).

### 6. **mysql2** 
   - Version: ^3.11.3
   - Description: MySQL client for Node.js with promise support.


### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/speed-hub.git
   ```

2. Navigate to the project folder:

   ```bash
   cd speed-hub
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Setup

### Configuration

- **Environment Variables**: Configure environment variables for production use (e.g., `DATABASE_URL`, `JWT_SECRET`).
- **Authentication**: The site uses JWT tokens for secure authentication. Ensure you set up the appropriate JWT secret in your environment file.
  
### Example `.env` File:

```env
DATABASE_URL=mysql://username:password@localhost:3306/speedhub
JWT_SECRET=your_jwt_secret
```

## Usage

Once the application is set up, you can access it in your browser at `http://localhost:3000`.

### Available Endpoints

- **GET /records**: Fetch all records.
- **POST /records**: Submit a new speedrun record.
- **GET /records/:id**: Fetch a specific record by its ID.
- **GET /users/:id**: Fetch a user’s profile.
- **GET /leaderboard**: Fetch the leaderboard, filtered by game, version, or category.
- **POST /login**: User login.
- **POST /register**: User registration.

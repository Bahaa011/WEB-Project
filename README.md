
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
4. [API Documentation](#api-documentation)

## Installation

Follow these steps to set up your own instance of Speed Hub:

### Prerequisites

- Node.js (v16 or higher)
- MySQL or MariaDB
- npm (Node Package Manager)

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

- ## User Endpoints

### 1. Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: User registered successfully.
  - `400 Bad Request`: Invalid input.
  - `409 Conflict`: Username or email already exists.

### 2. User Login
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: Login successful, returns a JWT token.
  - `401 Unauthorized`: Invalid credentials.

### 3. Get User Details
- **URL**: `/api/users/:userId`
- **Method**: `GET`
- **Params**: 
  - `userId` (path parameter): ID of the user.
- **Response**:
  - `200 OK`: User details returned.
  - `404 Not Found`: User not found.

### 4. Update User Details
- **URL**: `/api/users/:userId`
- **Method**: `PUT`
- **Params**:
  - `userId` (path parameter): ID of the user.
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: User details updated successfully.
  - `400 Bad Request`: Invalid input.
  - `404 Not Found`: User not found.

---

## Record Endpoints

### 1. Create Record
- **URL**: `/api/records`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userId": "integer",
    "gameId": "integer",
    "versionId": "integer",
    "recordTime": "decimal",
    "videoUrl": "string",
    "notes": "string"
  }
  ```
- **Response**:
  - `201 Created`: Record created successfully.
  - `400 Bad Request`: Invalid input.

### 2. Get All Records
- **URL**: `/api/records`
- **Method**: `GET`
- **Response**:
  - `200 OK`: List of all records.

### 3. Get Record by ID
- **URL**: `/api/records/:recordId`
- **Method**: `GET`
- **Params**: 
  - `recordId` (path parameter): ID of the record.
- **Response**:
  - `200 OK`: Record details.
  - `404 Not Found`: Record not found.

---

## Game Endpoints

### 1. Create Game
- **URL**: `/api/games`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string",
    "icon": "string (URL)",
    "releaseDate": "date",
    "rules": "string",
    "developer": "string"
  }
  ```
- **Response**:
  - `201 Created`: Game created successfully.
  - `400 Bad Request`: Invalid input.

### 2. Get All Games
- **URL**: `/api/games`
- **Method**: `GET`
- **Response**:
  - `200 OK`: List of all games.

### 3. Get Game by ID
- **URL**: `/api/games/:gameId`
- **Method**: `GET`
- **Params**:
  - `gameId` (path parameter): ID of the game.
- **Response**:
  - `200 OK`: Game details.
  - `404 Not Found`: Game not found.

---

## Category Endpoints

### 1. Get Category by ID
- **URL**: `/api/categories/:categoryId`
- **Method**: `GET`
- **Params**:
  - `categoryId` (path parameter): ID of the category.
- **Response**:
  - `200 OK`: Category details.
  - `404 Not Found`: Category not found.

---

## Authentication Endpoints

### 1. User Authentication (Login)
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `200 OK`: JWT token returned.

### 2. User Authentication (Register)
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - `201 Created`: User successfully registered.




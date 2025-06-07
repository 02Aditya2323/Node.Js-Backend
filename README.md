# Node.js Backend with MongoDB

A RESTful API backend built with Node.js and MongoDB.

## Features

- Express.js server setup
- MongoDB integration with Mongoose
- RESTful API endpoints for user management
- Middleware for request logging
- JSON data handling

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running locally
4. Start the server:
   ```bash
   node index.js
   ```

## API Endpoints

- GET `/users` - Get all users (HTML response)
- GET `/api/users` - Get all users (JSON response)
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PATCH `/api/users/:id` - Update user (to be implemented) 
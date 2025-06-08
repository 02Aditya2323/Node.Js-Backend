# Node.js Backend with MongoDB

A RESTful API backend built with Node.js and MongoDB using MVC architecture.

## Features

- Express.js server setup
- MongoDB integration with Mongoose
- RESTful API endpoints for user management
- Middleware for request logging
- JSON data handling
- MVC (Model-View-Controller) Architecture

## Implementation Steps for MVC architecture:

step 1 => created models(user.js) and exported scehma there
 
 s2: handled the routes i.e. rest apis in router(user.js) wherein we made (/users) as our general i.e.(/)  and connected it to index.js via app.use("/user",userRouter);

 s3: did connections with mongo via connections.js and then exported the function connectMongodb to index.js and passed the url parameter there..

 s4: connected the middleware plugins (middleware/index.js).......where in index.js we put our logappending middlewareinside a function with dynamic file name as input of This function and then exported it and in main(index.js)=>we used the function and gave filename as inputto it
        the other simple plugins remain unchanged

 s5: finally the controllers i.e. the functioning/operations of each route; we added it in controllers(user.js)........so here we created functions which performs the actual operations for the routes(in controllers/user.js) and then passed those functions to particular routes ......so basically when request comes on those routes; the function gets calle dform controllers and gets executed..
 

## Project Structure

```
project/
├── index.js              # Main application file
├── routes/              # Route definitions
│   └── user.js         # User routes
├── models/             # Database models
│   └── user.js        # User model
├── controllers/        # Business logic
│   └── user.js        # User controller
├── middlewares/        # Custom middlewares
│   └── index.js       # Middleware definitions
└── connections/        # Database connections
    └── index.js       # MongoDB connection
```

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

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PATCH `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user 
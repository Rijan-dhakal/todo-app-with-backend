# Todo Backend Application

A full-stack todo application with user authentication and email verification built with Node.js, Express, and MongoDB.

## Features

- User registration and login with email verification
- OTP-based verification (15-minute expiration)
- JWT authentication with secure cookies
- CRUD operations for todos
- Real-time todo management
- Automatic cleanup of unverified users

## Missing Features

- Forgot password functionality
- Change password feature
- User profile management
- Password reset

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email service
- bcryptjs for password hashing
- Vanilla JavaScript frontend

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/Rijan-dhakal/todo-app-with-backend.git
   cd Todo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Setup environment variables
   ```bash
   cp env.sample .env
   ```
   Edit `.env` with your configuration values.

4. Start the server
   ```bash
   npm run dev
   ```

5. Access the app at `http://localhost:3001/`

## API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/otp         # OTP verification
```

### Todos
```
GET    /api/todos          # Get user todos
POST   /api/todos          # Create todo
PATCH  /api/todos/:id      # Update todo
DELETE /api/todos/:id      # Delete todo
```

## How it Works

1. User registers with email/username/password
2. System sends OTP to email
3. User verifies OTP within 15 minutes
4. User can manage their todos after verification
5. Unverified users are automatically deleted after OTP expiration

## Configuration

- MongoDB: Set up local MongoDB or use MongoDB Atlas
- Email: Configure Gmail with app password for OTP delivery
- Environment: Copy `env.sample` to `.env` and fill in values



# Yomi - Blogging API

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║             ██╗   ██╗ ██████╗ ███╗   ███╗██╗               ║
║             ╚██╗ ██╔╝██╔═══██╗████╗ ████║██║               ║
║              ╚████╔╝ ██║   ██║██╔████╔██║██║               ║
║               ╚██╔╝  ██║   ██║██║╚██╔╝██║██║               ║
║                ██║   ╚██████╔╝██║ ╚═╝ ██║██║               ║
║                ╚═╝    ╚═════╝ ╚═╝     ╚═╝╚═╝               ║
║                                                            ║
║                   REST API for Blogging                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

A production-ready REST API for a blogging platform built with Node.js, Express, and MongoDB. Features comprehensive authentication, authorization, and content management capabilities.

## Overview

Yomi is a full-featured blogging API that provides secure user authentication, post management, and advanced querying capabilities. Built with modern best practices including JWT authentication, rate limiting, and comprehensive error handling.

## Features

- **User Authentication**
  - Secure user registration with password hashing (bcrypt)
  - JWT-based authentication with 7-day token expiration
  - Protected routes with middleware authentication

- **Post Management**
  - Create, read, update, and delete blog posts
  - Authorization checks (users can only modify their own posts)
  - Tag support for content categorization
  - Rich content support with title and body

- **Advanced Querying**
  - Pagination with customizable page size
  - Tag-based filtering
  - Full-text search across title and content
  - Sorting options (newest first by default)
  - Author population with user details

- **Security & Performance**
  - Rate limiting (100 requests/15min general, 10 requests/15min auth)
  - Helmet.js for security headers
  - CORS enabled
  - Input validation and sanitization
  - Comprehensive error handling

- **Developer Experience**
  - Structured error responses with error codes
  - REST API design principles
  - Comprehensive test suite (Jest + Supertest)
  - Request logging (Morgan)
  - Hot reload development mode (Nodemon)

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcryptjs, express-rate-limit
- **Testing:** Jest, Supertest
- **Development:** Nodemon, Morgan

## Installation

**Requirements:**

- Node.js v18+
- MongoDB v6+
- npm or yarn

**Setup:**

```bash
# Clone the repository
git clone <repository-url>
cd yomi

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Edit .env with your MongoDB URI and JWT secret
```

**Environment Variables:**

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/yomi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Quick Start

```bash
# Start MongoDB (if running locally)
mongod

# Start the development server
npm run dev

# The API will be available at http://localhost:3000
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "",
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-02-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "",
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-02-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Post Endpoints

#### Get All Posts

```http
GET /api/posts?page=1&limit=10&sort=-createdAt&tag=javascript&q=search
```

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of posts per page (default: 10)
- `sort` (optional): Sort order (default: -createdAt)
- `tag` (optional): Filter by tag (comma-separated for multiple)
- `q` (optional): Search query (searches title and content)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with Node.js",
      "content": "Node.js is a powerful JavaScript runtime...",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "tags": ["javascript", "nodejs", "tutorial"],
      "published": true,
      "createdAt": "2026-02-15T10:30:00.000Z",
      "updatedAt": "2026-02-15T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 42
}
```

#### Get Post by ID

```http
GET /api/posts/:id
```

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with Node.js",
  "content": "Node.js is a powerful JavaScript runtime...",
  "author": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "tags": ["javascript", "nodejs", "tutorial"],
  "published": true,
  "createdAt": "2026-02-15T10:30:00.000Z",
  "updatedAt": "2026-02-15T10:30:00.000Z"
}
```

#### Create Post (Protected)

```http
POST /api/posts
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "tags": ["personal", "first-post"]
}
```

**Response (201 Created):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "author": "507f1f77bcf86cd799439012",
  "tags": ["personal", "first-post"],
  "published": true,
  "createdAt": "2026-02-15T10:30:00.000Z",
  "updatedAt": "2026-02-15T10:30:00.000Z"
}
```

#### Update Post (Protected)

```http
PUT /api/posts/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  "content": "Updated content...",
  "author": "507f1f77bcf86cd799439012",
  "tags": ["personal", "first-post"],
  "published": true,
  "createdAt": "2026-02-15T10:30:00.000Z",
  "updatedAt": "2026-02-15T11:45:00.000Z"
}
```

#### Delete Post (Protected)

```http
DELETE /api/posts/:id
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**

```json
{
  "status": "success"
}
```

### User Endpoints

#### Get User's Posts

```http
GET /api/users/:id/posts
```

**Response (200 OK):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My First Blog Post",
    "content": "This is the content...",
    "author": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "tags": ["personal"],
    "published": true,
    "createdAt": "2026-02-15T10:30:00.000Z",
    "updatedAt": "2026-02-15T10:30:00.000Z"
  }
]
```

## Usage Examples

### Complete Workflow Example

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Save the token from the response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Create a blog post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to REST APIs",
    "content": "REST APIs are a fundamental part of modern web development...",
    "tags": ["api", "rest", "tutorial"]
  }'

# 3. Get all posts with pagination
curl "http://localhost:3000/api/posts?page=1&limit=5"

# 4. Search posts
curl "http://localhost:3000/api/posts?q=REST"

# 5. Filter by tag
curl "http://localhost:3000/api/posts?tag=tutorial"

# 6. Update a post (use the post ID from create response)
curl -X PUT http://localhost:3000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated: Introduction to REST APIs",
    "content": "REST APIs are essential..."
  }'

# 7. Get user's posts
curl "http://localhost:3000/api/users/507f1f77bcf86cd799439012/posts"

# 8. Delete a post
curl -X DELETE http://localhost:3000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

## Error Handling

The API returns structured error responses with appropriate HTTP status codes and error codes.

### Error Response Format

```json
{
  "success": false,
  "message": "Error message description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Status Code | Error Code          | Description                           |
| ----------- | ------------------- | ------------------------------------- |
| 400         | MISSING_FIELDS      | Required fields are missing           |
| 400         | VALIDATION_ERROR    | Input validation failed               |
| 400         | INVALID_ID          | Invalid MongoDB ObjectId format       |
| 401         | INVALID_CREDENTIALS | Email or password is incorrect        |
| 401         | INVALID_TOKEN       | JWT token is invalid                  |
| 401         | TOKEN_EXPIRED       | JWT token has expired                 |
| 403         | NOT_AUTHORIZED      | User lacks permission for this action |
| 404         | POST_NOT_FOUND      | Requested post doesn't exist          |
| 409         | DUPLICATE_FIELD     | Unique field already exists           |
| 500         | INTERNAL_ERROR      | Server error occurred                 |

### Error Examples

**Missing Required Fields:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john"}'
```

Response (400):

```json
{
  "success": false,
  "message": "Please provide all required fields",
  "code": "MISSING_FIELDS"
}
```

**Invalid Credentials:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

Response (401):

```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Unauthorized Access:**

```bash
curl -X DELETE http://localhost:3000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer invalid-token"
```

Response (401):

```json
{
  "success": false,
  "message": "Please authenticate."
}
```

**Forbidden Action:**

```bash
# Trying to update another user's post
curl -X PUT http://localhost:3000/api/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $DIFFERENT_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hacked"}'
```

Response (403):

```json
{
  "success": false,
  "message": "Not authorized",
  "code": "NOT_AUTHORIZED"
}
```

**Duplicate Email:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane",
    "email": "existing@example.com",
    "password": "password123"
  }'
```

Response (409):

```json
{
  "success": false,
  "message": "email already exists",
  "code": "DUPLICATE_FIELD"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Endpoints:** 100 requests per 15 minutes
- **Authentication Endpoints:** 10 requests per 15 minutes

When rate limit is exceeded:

```json
{
  "error": "Too many requests, please try again later."
}
```

## Project Structure

```
yomi/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── postController.js  # Post CRUD logic
│   │   └── userController.js  # User-related logic
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── Post.js            # Post schema & model
│   │   └── User.js            # User schema & model
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── posts.js           # Post routes
│   │   └── users.js           # User routes
│   ├── utils/
│   │   └── apiError.js        # Custom error class
│   └── server.js              # App entry point
├── tests/
│   ├── auth.test.js           # Auth endpoint tests
│   ├── authMiddleware.test.js # Auth middleware tests
│   ├── posts.test.js          # Post endpoint tests
│   └── setup.js               # Test configuration
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore
├── jest.config.js             # Jest configuration
├── package.json
└── README.md
```

## Testing

The project includes a comprehensive test suite covering authentication, authorization, and CRUD operations.

**Run Tests:**

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

**Test Coverage:**

- ✅ User registration (validation, duplicate prevention)
- ✅ User login (credentials validation)
- ✅ JWT authentication middleware
- ✅ Post creation (authenticated)
- ✅ Post retrieval (pagination, filtering, search, sorting)
- ✅ Post updates (authorization checks)
- ✅ Post deletion (authorization checks)
- ✅ User's posts retrieval

**Example Test Output:**

```
 PASS  tests/auth.test.js
  Auth Endpoints
    POST /api/auth/register
      ✓ should register a new user (156 ms)
      ✓ should return 409 for duplicate email (45 ms)
      ✓ should return 400 for missing fields (12 ms)
    POST /api/auth/login
      ✓ should login with correct credentials (89 ms)
      ✓ should return 401 for wrong password (78 ms)

 PASS  tests/posts.test.js
  Post Endpoints
    GET /api/posts
      ✓ should get all posts (34 ms)
      ✓ should support pagination (28 ms)
      ✓ should support sorting (31 ms)
      ✓ should support tag filtering (29 ms)
      ✓ should support search (33 ms)
    POST /api/posts
      ✓ should create a post (authenticated) (67 ms)
      ✓ should return 401 for unauthenticated (15 ms)

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
```

## Development

**Start Development Server:**

```bash
npm run dev
```

This starts the server with Nodemon for hot reloading on file changes.

**Development Features:**

- Auto-restart on file changes (Nodemon)
- Request logging (Morgan in 'dev' format)
- Detailed error messages
- CORS enabled for frontend development

## Production Deployment

**Preparation:**

1. Set environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yomi
JWT_SECRET=<strong-random-secret>
```

2. Install production dependencies:

```bash
npm ci --production
```

3. Start the server:

```bash
npm start
```

**Production Considerations:**

- Use a strong JWT secret (32+ characters)
- Enable MongoDB authentication
- Use HTTPS (configure reverse proxy like Nginx)
- Consider increasing rate limits based on usage
- Set up proper logging and monitoring
- Use environment-specific MongoDB databases
- Enable database backups
- Consider using PM2 for process management

**Database Indexes:**
The application automatically creates indexes for:

- User: `username`, `email` (unique)
- Post: `author`, `tags`, `createdAt`

## Security Best Practices

The API implements several security measures:

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Passwords never returned in API responses

2. **JWT Security**
   - Tokens expire after 7 days
   - Secret key stored in environment variables
   - Token validation on protected routes

3. **Rate Limiting**
   - Prevents brute force attacks
   - Different limits for auth vs general endpoints

4. **HTTP Security Headers**
   - Helmet.js middleware for security headers
   - XSS protection
   - Content Security Policy

5. **Input Validation**
   - Mongoose schema validation
   - Email format validation
   - Required field checks

6. **Authorization**
   - Users can only modify their own content
   - Proper error messages without leaking information

## API Best Practices

- REST-compliant URL structure
- Proper HTTP status codes
- Consistent error response format
- Pagination for list endpoints
- Population of related data
- Sorting and filtering support
- Search functionality
- Clean separation of concerns
- Middleware-based authentication

## Troubleshooting

**MongoDB Connection Failed:**

```
Error: MongoDB connection failed
```

Solution: Verify MongoDB is running and MONGODB_URI is correct

**JWT Token Invalid:**

```
Error: Invalid token
```

Solution: Check if token is properly formatted in Authorization header as "Bearer <token>"

**Cannot Create Post:**

```
Error: Please authenticate
```

Solution: Include valid JWT token in Authorization header

**Port Already in Use:**

```
Error: Port 3000 is already in use

Solution: Change PORT in .env or stop the process using port 3000

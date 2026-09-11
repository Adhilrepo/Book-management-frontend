# Backend API Contract

This document specifies the exact API endpoints and response formats expected by the frontend authentication system.

## Base URL

```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error - 400/422):**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Book Endpoints

All book endpoints require authentication. Include token in header:

```
Authorization: Bearer {token}
```

### 1. Get All Books

**Endpoint:** `GET /books`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "year": 1925,
      "rating": 4.5,
      "image": "https://example.com/gatsby.jpg",
      "description": "A novel of wealth and love in the Jazz Age.",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "1984",
      "author": "George Orwell",
      "category": "Dystopian",
      "year": 1949,
      "rating": 4.2,
      "image": "https://example.com/1984.jpg",
      "description": "A totalitarian surveillance state.",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Get Book by ID

**Endpoint:** `GET /books/:id`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "year": 1925,
    "rating": 4.5,
    "image": "https://example.com/gatsby.jpg",
    "description": "A novel of wealth and love in the Jazz Age.",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Book not found"
}
```

### 3. Create Book (Admin Only)

**Endpoint:** `POST /books`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**

```json
{
  "title": "The Catcher in the Rye",
  "author": "J.D. Salinger",
  "category": "Fiction",
  "year": 1951,
  "rating": 3.8,
  "image": "https://example.com/catcher.jpg",
  "description": "A story about teenage alienation."
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "category": "Fiction",
    "year": 1951,
    "rating": 3.8,
    "image": "https://example.com/catcher.jpg",
    "description": "A story about teenage alienation.",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 401 Unauthorized):**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Response (Error - 403 Forbidden):**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 4. Update Book (Admin Only)

**Endpoint:** `PUT /books/:id`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "category": "Updated Category",
  "year": 2024,
  "rating": 4.0,
  "image": "https://example.com/updated.jpg",
  "description": "Updated description"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated Title",
    "author": "Updated Author",
    "category": "Updated Category",
    "year": 2024,
    "rating": 4.0,
    "image": "https://example.com/updated.jpg",
    "description": "Updated description",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

**Response (Error - 403 Forbidden):**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 5. Delete Book (Admin Only)

**Endpoint:** `DELETE /books/:id`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "year": 1925,
    "rating": 4.5,
    "image": "https://example.com/gatsby.jpg",
    "description": "A novel of wealth and love in the Jazz Age.",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 403 Forbidden):**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

## Error Handling

### Common HTTP Status Codes

| Code | Meaning      | Example Response            |
| ---- | ------------ | --------------------------- |
| 200  | OK           | Successful GET, PUT, DELETE |
| 201  | Created      | Successful POST             |
| 400  | Bad Request  | Invalid input data          |
| 401  | Unauthorized | Missing/invalid token       |
| 403  | Forbidden    | User lacks required role    |
| 404  | Not Found    | Resource doesn't exist      |
| 500  | Server Error | Internal server error       |

### Error Response Format

All errors should follow this format:

```json
{
  "success": false,
  "message": "Human readable error message"
}
```

## Authentication Implementation

### JWT Token

- Token should be a valid JWT
- Include user ID and role in JWT payload
- Include `Authorization: Bearer {token}` in request headers
- Return token in login and register responses

### Middleware Requirements

- Validate JWT signature
- Check token expiration
- Extract user from token
- Verify admin role for admin endpoints

### Example JWT Payload

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "admin",
  "iat": 1704067200,
  "exp": 1704153600
}
```

## Important Notes

1. **User ID Field**: Frontend expects `_id` (MongoDB convention), not `id`
2. **Token Storage**: Frontend stores token in localStorage
3. **Token Persistence**: Token should persist across page reloads
4. **Role Values**: Only 'user' and 'admin' are recognized
5. **CORS**: Backend must allow requests from frontend URL
6. **Content-Type**: Ensure content-type headers are correct

## Testing the API

### Test with cURL

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"user"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Get Books (replace TOKEN with actual token):

```bash
curl -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer TOKEN"
```

Add Book (admin only):

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author","category":"Fiction","year":2024,"rating":4.0,"image":"https://example.com/book.jpg","description":"Test description"}'
```

---

This contract ensures compatibility between frontend and backend. Follow it exactly for proper integration.

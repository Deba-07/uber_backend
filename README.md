# Uber Backend — API Documentation

This document describes the user authentication endpoints available in this repository.

**Base URL (local)**: `http://localhost:3000`

**Mount path**: the routes are exposed under `/users` (e.g. `/users/register`).

---

**Quick Notes**:

- Passwords are hashed using `bcrypt` (salt rounds: 10).
- Successful responses for authentication endpoints include a JWT token and the created/found user object.
- Validation is performed with `express-validator` and returns a `400` with an `error` array on failure.

---

## POST /users/register

**Endpoint**: `POST /users/register`

**HTTP**: `POST`

### Description

Create a new user account. Validates input, hashes the password, saves the user, and returns a JWT token plus the created user object.

### Request

- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "email": "john.doe@example.com",
  "fullName": { "firstName": "John", "lastName": "Doe" },
  "password": "securePassword123"
}
```

Field rules:

- `email` (string, required): valid email
- `fullName.firstName` (string, required): min 3 chars
- `fullName.lastName` (string, optional): min 2 chars if provided
- `password` (string, required): min 6 chars

### Success Response (201 Created)

```json
{
  "token": "<jwt_token_here>",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

### Errors

- `400` — validation errors (returns `{ "error": [ ... ] }`)
- `400` — email already exists (message may vary)
- `500` — internal server error

### Example (cURL)

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","fullName":{"firstName":"John","lastName":"Doe"},"password":"securePassword123"}'
```

---

## POST /users/login

**Endpoint**: `POST /users/login`

**HTTP**: `POST`

### Description

Authenticate an existing user by `email` and `password`. Returns a JWT token and the user object on success.

### Request

- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Success Response (200 OK)

```json
{
  "token": "<jwt_token_here>",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null,
    "__v": 0
  }
}
```

### Errors

- `401` — authentication failed: `{ "message": "Invalid email or password" }`
- `400` — validation errors (returns `{ "error": [ ... ] }`)

### Example (cURL)

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"securePassword123"}'
```

---

## Status Codes Summary

- `201` — User created (register)
- `200` — Successful login
- `400` — Validation error
- `401` — Authentication failed
- `500` — Internal server error

---

## Local Setup (short)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` with (example):

```
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/yourdb
PORT=3000
```

3. Start server:

```bash
npm start
```

Server runs at `http://localhost:3000` by default.

---

If you'd like, I can convert this into an OpenAPI (Swagger) spec or add a Postman collection next. 3. Start server:

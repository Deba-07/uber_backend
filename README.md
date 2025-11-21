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

## GET /users/profile

**Endpoint**: `GET /users/profile`

**HTTP**: `GET`

### Description

Protected route. Returns the authenticated user's profile. The route requires a valid JWT provided either in a cookie named `token` or in the `Authorization: Bearer <token>` header. The middleware verifies the token and loads the user onto `req.user`.

### Request

- Headers: `Authorization: Bearer <token>` OR cookie `token` set
- Body: none

### Success Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": { "firstName": "John", "lastName": "Doe" },
  "email": "john.doe@example.com",
  "__v": 0
}
```

### Errors

- `401` — Unauthorized: no token provided, token invalid, token blacklisted, or user not found
- `500` — internal server error

### Example (cURL)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt_token_here>"
```

---

## GET /users/logout

**Endpoint**: `GET /users/logout`

**HTTP**: `GET`

### Description

Protected route. Logs the user out by clearing the `token` cookie and storing the token in a blacklist collection so it cannot be reused. The blacklist entries expire automatically (TTL) as configured in the model.

### Request

- Headers: `Authorization: Bearer <token>` OR cookie `token` set
- Body: none

### Success Response (200 OK)

```json
{ "message": "Logged out" }
```

### Errors

- `401` — Unauthorized: no token provided, token invalid, or token already blacklisted
- `500` — internal server error

### Example (cURL)

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt_token_here>"
```

---

## POST /captains/register

**Endpoint**: `POST /captains/register`

**HTTP**: `POST`

### Description

Register a new captain (driver). Validates the captain's personal details and vehicle information, hashes the password, stores the captain, and returns a JWT token and the created captain object.

### Request

- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "email": "captain.jane@example.com",
  "fullName": { "firstName": "Jane", "lastName": "Rider" },
  "password": "strongPassword123",
  "vehicle": {
    "color": "red",
    "plate": "AB12",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

Field rules (from `captain.routes` validation):

- `email` (string, required): valid email
- `fullName.firstName` (string, required): min 3 chars
- `fullName.lastName` (string, optional): min 3 chars if provided
- `password` (string, required): min 6 chars
- `vehicle.color` (string, required)
- `vehicle.plate` (string, required): min 4 chars
- `vehicle.capacity` (integer, required): min 1
- `vehicle.vehicleType` (string, required): one of `car`, `motorcycle`, `auto`

### Success Response (201 Created)

```json
{
  "token": "<jwt_token_here>",
  "captain": {
    "_id": "507f1f77bcf86cd799439022",
    "fullName": { "firstName": "Jane", "lastName": "Rider" },
    "email": "captain.jane@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "red",
      "plate": "AB12",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": { "lat": null, "lng": null },
    "__v": 0
  }
}
```

### Errors

- `400` — validation errors (returns an `errors` array from `express-validator`)
- `400` — captain already exists (controller returns `{ message: "Captain already exists" }`)
- `500` — internal server error

### Example (cURL)

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{"email":"captain.jane@example.com","fullName":{"firstName":"Jane","lastName":"Rider"},"password":"strongPassword123","vehicle":{"color":"red","plate":"AB12","capacity":4,"vehicleType":"car"}}'
```

---

## POST /captains/login

**Endpoint**: `POST /captains/login`

**HTTP**: `POST`

### Description

Authenticate a captain using `email` and `password`. Returns a JWT token and the captain object on success. The controller sets a `token` cookie as well.

### Request

- Headers: `Content-Type: application/json`
- Body (JSON):

```json
{
  "email": "captain.jane@example.com",
  "password": "strongPassword123"
}
```

### Success Response (200 OK)

```json
{
  "token": "<jwt_token_here>",
  "captain": {
    "_id": "507f1f77bcf86cd799439022",
    "fullName": { "firstName": "Jane", "lastName": "Rider" },
    "email": "captain.jane@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "red",
      "plate": "AB12",
      "capacity": 4,
      "vehicleType": "car"
    },
    "__v": 0
  }
}
```

### Errors

- `401` — invalid credentials: `{ "message": "Invalid email or password" }`
- `400` — validation errors (returns `{ "errors": [...] }`)

### Example (cURL)

```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{"email":"captain.jane@example.com","password":"strongPassword123"}'
```

---

## GET /captains/profile

**Endpoint**: `GET /captains/profile`

**HTTP**: `GET`

### Description

Protected route. Returns the authenticated captain's profile. Requires a valid JWT provided either in a cookie named `token` or in the `Authorization: Bearer <token>` header. The middleware verifies the token and loads the captain onto `req.captain`.

### Request

- Headers: `Authorization: Bearer <token>` OR cookie `token` set
- Body: none

### Success Response (200 OK)

```json
{
  "_id": "507f1f77bcf86cd799439022",
  "fullName": { "firstName": "Jane", "lastName": "Rider" },
  "email": "captain.jane@example.com",
  "status": "inactive",
  "vehicle": {
    "color": "red",
    "plate": "AB12",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": { "lat": null, "lng": null },
  "__v": 0
}
```

### Errors

- `401` — Unauthorized: no token provided, token invalid, token blacklisted, or captain not found
- `500` — internal server error

### Example (cURL)

```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer <jwt_token_here>"
```

---

## GET /captains/logout

**Endpoint**: `GET /captains/logout`

**HTTP**: `GET`

### Description

Protected route. Logs the captain out by clearing the `token` cookie and storing the token in the blacklist collection so it cannot be reused. The blacklist entries expire automatically (TTL) as configured in the model.

### Request

- Headers: `Authorization: Bearer <token>` OR cookie `token` set
- Body: none

### Success Response (200 OK)

```json
{ "message": "logged out" }
```

### Errors

- `401` — Unauthorized: no token provided, token invalid, or token already blacklisted
- `500` — internal server error

### Example (cURL)

```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer <jwt_token_here>"
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

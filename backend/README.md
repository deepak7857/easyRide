# Backend API Documentation

## `/users/register` Endpoint

### Description

Registers a new user by creating a user account with the provided information.

### HTTP Method

`POST`

### Request Body

The request body should be in JSON format and include the following fields:

- `fullname` (object):
  - `firstname` (string, required): User's first name (minimum 3 characters).
  - `lastname` (string, optional): User's last name (minimum 3 characters).
- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).

### Example Response

- `user` (object):
  - `fullname` (object).
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).
  - `email` (string): User's email address (must be a valid email).
  - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token

## Login User Endpoint
`/users/login`

### Description
Authenticates a user and returns a JWT token for authorized access.
### HTTP Method

`POST`
### Request Body
Authenticates a user and returns a JWT token for authorized access.

{
  "email": "string",    // valid email format
  "password": "string"  // minimum 6 characters
}
The request body should be in JSON format and include the following fields:

- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).
### Example Response

- `user` (object):
  - `fullname` (object).
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).
  - `email` (string): User's email address (must be a valid email).
  - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token
- `user` (object):

## Get User Profile Endpoint
`GET /users/profile`

### Description
Returns the profile information of the authenticated user.

### Authentication
Requires valid JWT token in Authorization header or cookie.

### Response Format
#### Success Response (200)
```json
{
  "user": {
    "fullName": {
      "firstName": "string",
      "lastName": "string"
    },
    "email": "string",
    "_id": "string"
  }
}
### Error Response
#### Unauthorized (401)
## `Logout Endpoint`
GET /users/logout

###Description
Logs out the user by invalidating their JWT token.

Authentication
Requires valid JWT token in Authorization header or cookie.
### success Response 
{
  "message": "User logged out successfully"
}
Response Format
Success Response (200)
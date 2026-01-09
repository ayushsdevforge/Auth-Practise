# API Endpoints for Postman Testing

Base URL: `http://localhost:5000/api/auth`

---

## 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- 400: "All fields are required"
- 400: "Invalid email format"
- 400: "Password must be at least 6 characters long"
- 400: "User already exists"

---

## 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400: "Email and password are required"
- 400: "Invalid credentials"

---

## 3. Forgot Password (Request OTP)
**POST** `/api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your email successfully"
}
```

**Error Responses:**
- 400: "Email is required"
- 400: "Invalid email format"
- 404: "User not found"
- 500: "Failed to send OTP email"

---

## 4. Reset Password (Verify OTP & Set New Password)
**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- 400: "All fields are required"
- 400: "Invalid email format"
- 400: "Password must be at least 6 characters long"
- 400: "No OTP request found. Please request a new OTP"
- 400: "OTP has expired. Please request a new one"
- 400: "Invalid OTP"
- 404: "User not found"

---

## Testing Flow in Postman

### 1. **Register a New User**
- Method: POST
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON): Name, Email, Password

### 2. **Login**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON): Email, Password
- Save the token from response

### 3. **Request Password Reset (Get OTP)**
- Method: POST
- URL: `http://localhost:5000/api/auth/forgot-password`
- Body (JSON): Email
- Check your email for the 6-digit OTP

### 4. **Reset Password with OTP**
- Method: POST
- URL: `http://localhost:5000/api/auth/reset-password`
- Body (JSON): Email, OTP, New Password

### 5. **Login with New Password**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON): Email, New Password

---

## Notes
- OTP expires in 10 minutes
- Make sure to configure `.env` file with email credentials before testing password reset
- All endpoints return JSON responses
- Server must be running on port specified in `.env` (default: 5000)

# Authentication Backend API

A secure authentication backend built with Node.js, Express, MongoDB, and JWT. Features user registration, login, and password reset functionality with OTP verification via email.

## Features

- ✅ User Registration with email validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ User Login
- ✅ Password Reset with OTP verification
- ✅ OTP sent via email (expires in 10 minutes)
- ✅ Input validation and error handling
- ✅ MongoDB database integration
- ✅ CORS enabled

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **dotenv** - Environment variable management

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account (for sending OTP emails)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd authentication-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MONGO_URL=mongodb://localhost:27017/your-database-name
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Setting up Gmail for sending emails:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
4. Use this App Password in your `.env` file as `EMAIL_PASSWORD`

## Running the Application

### Development Mode (with nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user and get JWT token |
| POST | `/forgot-password` | Request OTP for password reset |
| POST | `/reset-password` | Reset password with OTP |

### Detailed endpoint documentation available in [API_ENDPOINTS.md](API_ENDPOINTS.md)

## API Usage Examples

### 1. Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login User
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Request Password Reset (Get OTP)
```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 4. Reset Password with OTP
```bash
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

## Project Structure

```
authentication-backend/
├── controller/
│   └── authController.js      # Authentication logic
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── model/
│   └── userModel.js           # User schema
├── routes/
│   └── authRoute.js           # API routes
├── utils/
│   └── emailService.js        # Email sending utility
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── API_ENDPOINTS.md           # API documentation
├── package.json               # Dependencies
├── README.md                  # Project documentation
└── server.js                  # Entry point
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/authdb` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USER` | Email address for sending | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `your-app-password` |

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire in 1 hour
- OTP expires in 10 minutes
- Email and password validation
- Environment variables for sensitive data
- CORS enabled for cross-origin requests

## Testing with Postman

1. Import the endpoints from `API_ENDPOINTS.md`
2. Start the server
3. Test each endpoint in the following order:
   - Register a new user
   - Login to get JWT token
   - Request password reset (check email for OTP)
   - Reset password with received OTP
   - Login with new password

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Future Enhancements

- [ ] Email verification on registration
- [ ] Refresh token implementation
- [ ] Rate limiting for security
- [ ] User profile management
- [ ] Social authentication (Google, Facebook)
- [ ] Two-factor authentication (2FA)

## License

ISC

## Author

Your Name

## Support

For issues or questions, please open an issue in the repository.

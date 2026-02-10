# SmartBudget - Authentication & Accounts Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Security](#security)
7. [Implementation Guide](#implementation-guide)
8. [Testing](#testing)
9. [Error Handling](#error-handling)
10. [Troubleshooting](#troubleshooting)

---

## Overview

SmartBudget uses a **JWT (JSON Web Token) based authentication system** with the following stack:
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Frontend**: React (Vite)

### Key Features
- User registration with email/password
- Secure login with JWT token generation
- Protected routes using authentication middleware
- Password updates for authenticated users
- Session management via JWT tokens

---

## Architecture

### Tech Stack Components

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  - Registration Form                                 │
│  - Login Form                                        │
│  - Protected Dashboard                               │
│  - Auth Context/State Management                     │
└─────────────────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ (JWT in Authorization header)
                         ▼
┌─────────────────────────────────────────────────────┐
│              Backend API (Express)                   │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │  Routes (auth.routes.js)                  │     │
│  │  - POST /auth/register                    │     │
│  │  - POST /auth/login                       │     │
│  │  - GET /auth/me (protected)               │     │
│  │  - PUT /auth/password (protected)         │     │
│  └──────────────────────────────────────────┘     │
│                      │                              │
│  ┌──────────────────────────────────────────┐     │
│  │  Middleware (auth.middleware.js)          │     │
│  │  - requireAuth: JWT verification          │     │
│  └──────────────────────────────────────────┘     │
│                      │                              │
│  ┌──────────────────────────────────────────┐     │
│  │  Controllers (auth.controller.js)         │     │
│  │  - register(), login()                    │     │
│  │  - me(), updatePassword()                 │     │
│  └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
                         │
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL Database                     │
│  - User table (id, email, passwordHash, etc.)       │
└─────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### 1. User Registration

```
User submits registration form
         │
         ▼
Frontend sends POST to /auth/register
    { email, password }
         │
         ▼
Backend validates input
         │
         ▼
Check if email already exists
         │
         ▼
Hash password with bcrypt (10 rounds)
         │
         ▼
Create user in database (Prisma)
         │
         ▼
Generate JWT token (signToken)
    { sub: userId }
         │
         ▼
Return { token, user }
         │
         ▼
Frontend stores token (localStorage/state)
```

### 2. User Login

```
User submits login form
         │
         ▼
Frontend sends POST to /auth/login
    { email, password }
         │
         ▼
Backend validates input
         │
         ▼
Find user by email (Prisma)
         │
         ▼
Compare password with bcrypt
         │
         ▼
Generate JWT token (signToken)
    { sub: userId }
         │
         ▼
Return { token, user }
         │
         ▼
Frontend stores token
```

### 3. Accessing Protected Routes

```
User requests protected resource
         │
         ▼
Frontend sends request with header:
    Authorization: Bearer <token>
         │
         ▼
Backend middleware (requireAuth)
    extracts and verifies token
         │
         ▼
JWT verification (jwt.verify)
         │
         ▼
Attach user to req.user
    { userId: decoded.sub }
         │
         ▼
Route handler processes request
         │
         ▼
Return protected data
```

---

## API Endpoints

### Base URL
```
Development: http://localhost:8080
Production: TBD (Render deployment)
```

### Public Endpoints (No Authentication Required)

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Success Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "createdAt": "2026-02-05T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `409 Conflict`: Email already in use
- `500 Internal Server Error`: Registration failed

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "createdAt": "2026-02-05T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Login failed

### Protected Endpoints (Authentication Required)

All protected endpoints require the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

#### 3. Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "email": "student@example.com",
  "createdAt": "2026-02-05T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: No token provided or invalid token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### 4. Update Password
```http
PUT /auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200 OK):**
```json
{
  "ok": true
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or password too short (< 8 chars)
- `401 Unauthorized`: No token or incorrect current password
- `404 Not Found`: User not found
- `500 Internal Server Error`: Password update failed

---

## Database Schema

### Prisma Schema (`server/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  // Relations (future)
  expenses     Expense[]
  budgets      Budget[]
}

// Future models
model Expense {
  id        Int      @id @default(autoincrement())
  userId    Int
  amount    Decimal
  category  String
  date      DateTime
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}

model Budget {
  id        Int      @id @default(autoincrement())
  userId    Int
  category  String
  limit     Decimal
  period    String   // 'weekly' or 'monthly'
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

### Database Setup Commands

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Environment Variables (`server/.env`)

```env
PORT=8080
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=1h

DATABASE_URL="postgresql://smartbudget:smartbudget_pw@localhost:5432/smartbudget"
```

---

## Security

### Password Security
- **Hashing Algorithm**: bcrypt with 10 salt rounds
- **Minimum Password Length**: 8 characters (enforced on password update)
- **Best Practice**: Passwords are never stored in plain text
- **Password Comparison**: Uses `bcrypt.compare()` for timing-attack resistance

### JWT Security
- **Signing Algorithm**: HS256 (HMAC with SHA-256)
- **Token Expiration**: 1 hour (configurable via `JWT_EXPIRES_IN`)
- **Secret Key**: Stored in environment variable (never committed to Git)
- **Token Payload**: Contains only `sub` (user ID), no sensitive data
- **Token Verification**: Performed on every protected route access

### Best Practices Implemented
1. ✅ Passwords hashed with bcrypt
2. ✅ JWT tokens with expiration
3. ✅ Environment variables for secrets
4. ✅ Input validation on all endpoints
5. ✅ Proper HTTP status codes
6. ✅ Error messages don't leak sensitive info
7. ✅ Middleware-based authentication
8. ✅ Database queries use Prisma (SQL injection protection)

### Security Recommendations
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Implement CORS properly in production
- [ ] Add refresh token mechanism
- [ ] Implement password strength requirements
- [ ] Add email verification
- [ ] Enable HTTPS in production
- [ ] Add logging and monitoring
- [ ] Implement account lockout after failed attempts

---

## Implementation Guide

### Backend Setup

#### 1. Install Dependencies
```bash
cd server
npm install express bcrypt jsonwebtoken @prisma/client dotenv
npm install --save-dev prisma nodemon
```

#### 2. Project Structure
```
server/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js    # Business logic
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification
│   ├── routes/
│   │   └── auth.routes.js        # Route definitions
│   ├── db/
│   │   └── prisma.js             # Prisma client
│   └── index.js                  # Express app setup
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── .env                          # Environment variables
├── .env.example                  # Template for .env
└── package.json
```

#### 3. Authentication Middleware (`src/middleware/auth.middleware.js`)

```javascript
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret);

    // Attach user info to request
    req.user = { userId: decoded.sub };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
}
```

#### 4. Express App Setup (`src/index.js`)

```javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd client
npm install axios
```

#### 2. API Service (`src/services/api.js`)

```javascript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 3. Auth Service (`src/services/authService.js`)

```javascript
import api from "./api";

export const authService = {
  async register(email, password) {
    const response = await api.post("/auth/register", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await api.put("/auth/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
```

#### 4. Auth Context (`src/context/AuthContext.jsx`)

```javascript
import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getToken();
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (email, password) => {
    const data = await authService.register(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

#### 5. Protected Route Component (`src/components/ProtectedRoute.jsx`)

```javascript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

#### 6. Login Component Example (`src/pages/Login.jsx`)

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to SmartBudget</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

---

## Testing

### Manual Testing Checklist

#### Registration Flow
- [ ] Register with valid email and password
- [ ] Try to register with existing email (should get 409)
- [ ] Try to register without email (should get 400)
- [ ] Try to register without password (should get 400)
- [ ] Verify token is returned
- [ ] Verify user is created in database

#### Login Flow
- [ ] Login with valid credentials
- [ ] Try to login with wrong password (should get 401)
- [ ] Try to login with non-existent email (should get 401)
- [ ] Verify token is returned
- [ ] Verify token is different from registration token

#### Protected Routes
- [ ] Access /auth/me without token (should get 401)
- [ ] Access /auth/me with valid token (should get user data)
- [ ] Access /auth/me with expired token (should get 401)
- [ ] Access /auth/me with invalid token (should get 401)

#### Password Update
- [ ] Update password with correct current password
- [ ] Try to update with wrong current password (should get 401)
- [ ] Try to update with password < 8 chars (should get 400)
- [ ] Verify can login with new password
- [ ] Verify cannot login with old password

### Using Postman/Thunder Client

#### 1. Register User
```
POST http://localhost:8080/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. Login User
```
POST http://localhost:8080/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Copy the token from response
```

#### 3. Get Current User
```
GET http://localhost:8080/auth/me
Headers:
Authorization: Bearer <paste_token_here>
```

#### 4. Update Password
```
PUT http://localhost:8080/auth/password
Headers:
Authorization: Bearer <paste_token_here>
Body (JSON):
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

### Automated Testing (Future)

Consider adding:
- Jest + Supertest for API testing
- React Testing Library for component testing
- Cypress/Playwright for E2E testing

---

## Error Handling

### Backend Error Responses

All errors follow this format:
```json
{
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Code | Status | Usage |
|------|--------|-------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Authentication failed/missing |
| 404 | Not Found | User not found |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Unexpected server error |

### Frontend Error Handling Best Practices

```javascript
try {
  const data = await authService.login(email, password);
  // Success handling
} catch (error) {
  // Check if it's an API error
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data.message;
    
    if (status === 401) {
      setError("Invalid credentials");
    } else if (status === 409) {
      setError("Email already in use");
    } else {
      setError(message || "Something went wrong");
    }
  } else if (error.request) {
    // Request made but no response
    setError("Cannot connect to server");
  } else {
    // Other errors
    setError("An unexpected error occurred");
  }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "me is not defined" Error
**Problem**: Function not imported in routes file

**Solution**:
```javascript
// auth.routes.js
import { register, login, me, updatePassword } from "../controllers/auth.controller.js";
```

#### 2. "JWT_SECRET not configured" Error
**Problem**: Missing environment variable

**Solution**:
- Check `.env` file exists in `server/` directory
- Verify `JWT_SECRET=your_secret_key` is present
- Restart server after adding `.env`

#### 3. "Cannot connect to database" Error
**Problem**: PostgreSQL not running or wrong credentials

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection string in .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Test connection with Prisma
npx prisma db push
```

#### 4. "Token expired" Error
**Problem**: JWT token exceeded expiration time (1 hour default)

**Solution**:
- User needs to login again
- Or extend `JWT_EXPIRES_IN` in `.env` (e.g., "7d" for 7 days)

#### 5. Password comparison fails
**Problem**: Mismatch between JWT claim and controller access

**Solution**:
Ensure consistency:
```javascript
// In signToken
jwt.sign({ sub: userId }, ...)

// In middleware
req.user = { userId: decoded.sub }

// In controller
const userId = req.user.userId
```

#### 6. CORS errors in frontend
**Problem**: Browser blocks cross-origin requests

**Solution**:
```javascript
// server/src/index.js
import cors from "cors";

app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));
```

#### 7. "Cannot find module" errors
**Problem**: Missing dependencies

**Solution**:
```bash
cd server
npm install

cd ../client
npm install
```

---

## Deployment Considerations

### Backend (Render)

1. **Environment Variables**:
   - Set `JWT_SECRET` to a strong random value
   - Set `DATABASE_URL` to production database
   - Set `NODE_ENV=production`

2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

4. **Database Migrations**:
```bash
# Add to package.json
"scripts": {
  "postinstall": "npx prisma generate && npx prisma migrate deploy"
}
```

### Frontend (Vercel/Netlify)

1. **Environment Variables**:
```env
VITE_API_URL=https://your-backend.render.com
```

2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

### Production Security Checklist

- [ ] Use strong, unique JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags (if using cookies)
- [ ] Implement rate limiting
- [ ] Enable CORS with specific origins
- [ ] Add request logging
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## Future Enhancements

### Planned Features

1. **Refresh Tokens**
   - Implement refresh token rotation
   - Extend session without re-login

2. **Email Verification**
   - Send verification email on registration
   - Verify email before account activation

3. **Password Reset**
   - Forgot password flow
   - Email-based reset link

4. **Multi-Factor Authentication (MFA)**
   - TOTP-based 2FA
   - SMS verification

5. **OAuth Integration**
   - Google Sign-In
   - GitHub OAuth
   - Microsoft OAuth

6. **Account Management**
   - Profile updates
   - Account deletion
   - Export user data (GDPR compliance)

7. **Session Management**
   - View active sessions
   - Revoke specific sessions
   - Force logout from all devices

---

## Resources

### Documentation
- [JWT.io](https://jwt.io/) - JWT documentation and debugger
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [Prisma](https://www.prisma.io/docs) - ORM documentation
- [Express](https://expressjs.com/) - Web framework

### Best Practices
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL management
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI

---

## Support

For questions or issues:
1. Check this documentation
2. Review the [SmartBudget GitHub Repository](https://github.com/CaitlinMEvans/SmartBudget)

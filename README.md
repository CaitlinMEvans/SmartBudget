# Quote
"If today you are a little better than you were yesterday, then that is enough!" - David A. Bednar
"Through determination and resilience, what once seemed impossible becomes inevitable."
# SmartBudget

**Student Expense Tracking and Financial Planner**

> "If today you are a little better than you were yesterday, then that is enough!" - David A. Bednar  
> "Through determination and resilience, what once seemed impossible becomes inevitable."

SmartBudget is a web application designed to help students track expenses, manage budgets, and better understand their spending habits. The app focuses on simplicity, clarity, and real-world usefulness, allowing users to record daily expenses, organize them into categories, set weekly or monthly budgets, and view spending summaries through a clean dashboard.

This project is being developed as part of **CSE 499 – Senior Project** using an Agile, sprint-based approach.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Status](#project-status)
- [Team](#team)
- [License](#license)

---

## Problem Statement

Students often juggle tuition, rent, food, transportation, and personal expenses with limited income. Because expenses accumulate quietly, it's easy to lose track of spending and overshoot budgets without realizing it.

Most existing financial tools are either too complex or not tailored for student needs. SmartBudget aims to provide a **simple, student-friendly solution** that helps users stay aware of where their money is going and make more informed financial decisions.

---

## Core Features

- ✅ Secure user authentication (register, login, logout)
- ✅ JWT-based session management
- ✅ Add, edit, and delete expenses
- ✅ Categorize expenses (e.g., food, rent, transport)
- ✅ Set weekly or monthly budgets
- ✅ Dashboard summary showing spending vs. budget
- ✅ Filter expenses by category and date

### Planned Enhancements

- Visual charts (spending by category)
- Export expense history (CSV)
- Savings goal tracking
- Dark mode / light mode
- Accessibility and performance improvements

> Final enhancement scope will be determined during sprint planning.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: CSS Modules / Tailwind CSS (TBD)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Hosting**: Local development / Production TBD

### DevOps
- **Version Control**: Git & GitHub
- **Project Management**: Trello (Agile/Scrum)
- **Package Manager**: npm
- **Development**: Concurrent frontend/backend with concurrently

---

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CaitlinMEvans/SmartBudget.git
   cd SmartBudget
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   Follow the detailed guide: [ Database Setup Guide](docs/DATABASE_SETUP.md)
   
   Quick version:
   ```bash
   # Create database and user in PostgreSQL
   # Then in server directory:
   cd server
   cp .env.example .env
   # Edit .env with your database credentials
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

5. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

6. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

---

##  Documentation

### For Developers

| Document | Description |
|----------|-------------|
| [ Authentication & Accounts](docs/AUTH_ACCOUNTS.md) | Complete guide to JWT authentication, user registration, login, and account management |
| [ Database Setup](docs/DATABASE_SETUP.md) | PostgreSQL and Prisma setup, schema management, and migrations |
| [ API Reference](docs/API_REFERENCE.md) | Complete REST API documentation with endpoints, requests, and responses |
| [ Deployment Guide](docs/DEPLOYMENT.md) | Production deployment instructions (Coming Soon) |

### Quick Links

- **Getting Started**: You're reading it! Check the [Quick Start](#quick-start) section above
- **Authentication**: See [Auth Documentation](docs/AUTH_ACCOUNTS.md) for login/register implementation
- **Database**: See [Database Documentation](docs/DATABASE_SETUP.md) for schema and migrations
- **API Endpoints**: See [API Reference](docs/API_REFERENCE.md) for all available endpoints

---

## Project Structure

```
SmartBudget/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Login, Dashboard, etc.)
│   │   ├── context/          # React Context (Auth, etc.)
│   │   ├── services/         # API services
│   │   └── App.jsx           # Main app component
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Express middleware (auth, etc.)
│   │   ├── routes/           # API routes
│   │   ├── db/               # Database connection
│   │   └── index.js          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration history
│   ├── .env                  # Environment variables (not in Git)
│   └── package.json
│
├── docs/                      # Documentation
│   ├── AUTH_ACCOUNTS.md      # Authentication guide
│   └──  DATABASE_SETUP.md     # Database setup guide
<!-- │   ├── API_REFERENCE.md      # API documentation -->
<!-- │   └── DEPLOYMENT.md         # Deployment guide -->
│
├── node_modules/             # Root dependencies
├── package.json              # Root package (concurrently)
└── README.md                 # This file
```

---

## Authentication Quick Reference

SmartBudget uses **JWT-based authentication** for secure user sessions.

### How It Works

1. User registers or logs in
2. Server generates JWT token
3. Frontend stores token in localStorage
4. Protected routes require token in `Authorization: Bearer <token>` header

### Available Auth Endpoints

```bash
POST /auth/register         # Create new account
POST /auth/login            # Login to existing account
GET  /auth/me               # Get current user (protected)
PUT  /auth/password         # Update password (protected)
```

For complete authentication documentation, see [Auth & Accounts Guide](docs/AUTH_ACCOUNTS.md).

---
### Development Workflow

1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "Add feature"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Create Pull Request on GitHub

---

## Scripts

```bash
# Root directory
npm run dev              # Start both client and server
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend

# Client directory (cd client)
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Server directory (cd server)
npm run dev              # Start Express with nodemon
npm start                # Start Express (production)
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run new migration
```

---

## Troubleshooting

### Common Issues

**Cannot connect to database**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `server/.env`
- See [Database Setup Guide](docs/DATABASE_SETUP.md)

**JWT/Authentication errors**
- Check JWT_SECRET in `server/.env`
- Ensure token is being sent in Authorization header
- See [Auth Documentation](docs/AUTH_ACCOUNTS.md)

**Port already in use**
- Backend (8080): Change PORT in `server/.env`
- Frontend (5173): Vite will auto-increment port

For more troubleshooting, see individual documentation files.
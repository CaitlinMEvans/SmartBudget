# Database Setup Guide

Complete guide for setting up PostgreSQL with Prisma for SmartBudget.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [PostgreSQL Installation](#postgresql-installation)
3. [Database & User Setup](#database--user-setup)
4. [Prisma Setup](#prisma-setup)
5. [Schema Management](#schema-management)
6. [Migrations](#migrations)
7. [Verification](#verification)
8. [Common Operations](#common-operations)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **PostgreSQL** (v14 or higher)
  - Includes `psql` command-line tool
  - Includes PostgreSQL service
- **pgAdmin** (optional but recommended for GUI management)
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation Links

- PostgreSQL: https://www.postgresql.org/download/
- pgAdmin: https://www.pgadmin.org/download/
- Node.js: https://nodejs.org/

---

## PostgreSQL Installation

### Windows

1. Download installer from https://www.postgresql.org/download/windows/
2. Run installer and follow wizard
3. Remember the password you set for the `postgres` superuser
4. Default port: 5432 (keep default)
5. Verify installation:
   ```bash
   psql --version
   ```

### macOS

Using Homebrew:
```bash
brew install postgresql@14
brew services start postgresql@14
```

Using Postgres.app:
1. Download from https://postgresapp.com/
2. Move to Applications folder
3. Click to start PostgreSQL

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Database & User Setup

You can use either **pgAdmin (GUI)** or **psql (Command Line)**.

### Option A: Using pgAdmin (Recommended for Beginners)

#### 1. Create Role (User)

1. Open pgAdmin
2. Navigate to **Servers** → Right-click your server → **Connect**
3. Navigate to **Login/Group Roles**
4. Right-click → **Create** → **Login/Group Role**

**General Tab:**
- Name: `smartbudget`

**Definition Tab:**
- Password: `smartbudget_pw`

**Privileges Tab** - Enable:
- ✅ Can login
- ✅ Create databases
- ✅ Create roles (optional)

5. Click **Save**

#### 2. Create Database

1. Navigate to **Databases**
2. Right-click → **Create** → **Database**

**General Tab:**
- Database: `smartbudget`
- Owner: `smartbudget`

3. Click **Save**

The database will use the default schema: `public`

---

### Option B: Using psql Command Line

#### 1. Connect to PostgreSQL

```bash
# Linux/macOS
sudo -u postgres psql

# Windows (if psql is in PATH)
psql -U postgres
```

#### 2. Create User and Database

```sql
-- Create user
CREATE USER smartbudget WITH PASSWORD 'smartbudget_pw';

-- Grant privileges
ALTER USER smartbudget CREATEDB;

-- Create database
CREATE DATABASE smartbudget OWNER smartbudget;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE smartbudget TO smartbudget;

-- Exit
\q
```

#### 3. Verify Connection

```bash
psql -U smartbudget -d smartbudget -h localhost
```

If successful, you'll see:
```
smartbudget=>
```

---

## Prisma Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@prisma/client` - Prisma Client for querying
- `prisma` - Prisma CLI (dev dependency)

### 3. Configure Environment Variables

Create `server/.env` file:

```env
# Server Configuration
PORT=8080

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h

# Database Configuration
DATABASE_URL="postgresql://smartbudget:smartbudget_pw@localhost:5432/smartbudget"
```

**Important Notes:**
- Replace `smartbudget_pw` with your actual password if different
- Never commit `.env` to Git (it's in `.gitignore`)
- Use a strong JWT_SECRET in production

### 4. Environment Variables Explained

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
              ↓          ↓         ↓      ↓        ↓
postgresql://smartbudget:smartbudget_pw@localhost:5432/smartbudget
```

- **USER**: Database user (`smartbudget`)
- **PASSWORD**: User's password (`smartbudget_pw`)
- **HOST**: Database server (`localhost` for local dev)
- **PORT**: PostgreSQL port (default: `5432`)
- **DATABASE**: Database name (`smartbudget`)

---

## Schema Management

### Current Prisma Schema

Location: `server/prisma/schema.prisma`

```prisma
// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Prisma Client generator
generator client {
  provider = "prisma-client-js"
}

// User model
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  expenses     Expense[]
  budgets      Budget[]
}

// Expense model
model Expense {
  id          Int      @id @default(autoincrement())
  userId      Int
  amount      Decimal  @db.Decimal(10, 2)
  category    String
  description String?
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([date])
}

// Budget model
model Budget {
  id        Int      @id @default(autoincrement())
  userId    Int
  category  String
  limit     Decimal  @db.Decimal(10, 2)
  period    String   // 'weekly' or 'monthly'
  startDate DateTime
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

### Understanding the Schema

**User Model:**
- Stores user authentication data
- `passwordHash`: Never stores plain text passwords
- Relations: One user has many expenses and budgets

**Expense Model:**
- Tracks individual expenses
- `amount`: Decimal for precise money values
- `category`: Food, Rent, Transport, etc.
- Foreign key: `userId` links to User

**Budget Model:**
- Sets spending limits per category
- `period`: Weekly or monthly budgets
- Foreign key: `userId` links to User

---

## Migrations

Migrations track and apply database schema changes.

### Initial Migration

Run this once to create all tables:

```bash
cd server
npx prisma migrate dev --name init
```

This will:
1. Read `schema.prisma`
2. Generate SQL to create tables
3. Create `prisma/migrations/` folder
4. Apply migration to database
5. Generate Prisma Client

### Generate Prisma Client

After any schema change:

```bash
npx prisma generate
```

This updates the Prisma Client with your latest schema.

---

## Adding New Tables/Models

### Workflow

1. **Edit Schema** (`prisma/schema.prisma`)
2. **Create Migration**
3. **Generate Client**
4. **Use in Code**

### Example: Adding a Category Model

#### Step 1: Edit Schema

Add to `schema.prisma`:

```prisma
model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  icon      String?
  color     String?
  createdAt DateTime @default(now())
}
```

#### Step 2: Create Migration

```bash
npx prisma migrate dev --name add_category_model
```

Name your migration descriptively:
- `add_category_model`
- `add_expense_indexes`
- `update_budget_fields`

#### Step 3: Generate Client

```bash
npx prisma generate
```

#### Step 4: Use in Code

```javascript
// In your controller
import { prisma } from "../db/prisma.js";

// Create category
const category = await prisma.category.create({
  data: {
    name: "Food",
    icon: "🍔",
    color: "#FF6B6B"
  }
});

// Find categories
const categories = await prisma.category.findMany();
```

---

## Verification

### Option 1: Prisma Studio (Easiest)

Open database GUI:

```bash
cd server
npx prisma studio
```

- Opens at http://localhost:5555
- Visual interface for all tables
- View, add, edit, delete records
- No SQL knowledge required

### Option 2: pgAdmin

1. Open pgAdmin
2. Navigate to **Servers** → Your Server → **Databases** → `smartbudget`
3. Expand **Schemas** → `public` → **Tables**

You should see:
- `User`
- `Expense`
- `Budget`
- `_prisma_migrations` (Prisma's internal table)

**View Data:**
- Right-click table → **View/Edit Data** → **All Rows**

**Run Queries:**
- Right-click database → **Query Tool**

```sql
-- View all users
SELECT * FROM public."User" ORDER BY id ASC;

-- View all expenses
SELECT * FROM public."Expense" ORDER BY id ASC;

-- View with user data
SELECT e.*, u.email 
FROM public."Expense" e
JOIN public."User" u ON e."userId" = u.id;
```

### Option 3: psql Command Line

```bash
psql -U smartbudget -d smartbudget -h localhost
```

```sql
-- List tables
\dt

-- Describe User table
\d "User"

-- Query users
SELECT * FROM "User";

-- Exit
\q
```

**Note:** Prisma creates tables with capitalized names, so use quotes: `"User"`, `"Expense"`, `"Budget"`

---

## Common Operations

### Reset Database

**Warning:** This deletes ALL data!

```bash
npx prisma migrate reset
```

This will:
1. Drop database
2. Create database
3. Run all migrations
4. Seed data (if seed script exists)

### View Migration Status

```bash
npx prisma migrate status
```

Shows which migrations are applied.

### Push Schema Without Migration

For development/prototyping only:

```bash
npx prisma db push
```

**Use Cases:**
- Quick prototyping
- Development environment only
- DO NOT use in production

### Seed Database

Create `prisma/seed.js`:

```javascript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      passwordHash,
    },
  });

  console.log("Created test user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Error:** `P1001: Can't reach database server`

**Solutions:**

1. Check PostgreSQL is running:
   ```bash
   # Windows
   services.msc  # Look for "postgresql-x64-14"
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify DATABASE_URL in `.env`
3. Test connection:
   ```bash
   psql -U smartbudget -d smartbudget -h localhost
   ```

### Issue: "Authentication failed"

**Error:** `P1000: Authentication failed`

**Solutions:**

1. Check password in DATABASE_URL matches database password
2. Ensure user exists:
   ```sql
   -- In psql as postgres user
   \du
   ```
3. Verify user has correct permissions

### Issue: "Relation does not exist"

**Error:** `relation "User" does not exist`

**Solutions:**

1. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

2. Check migration status:
   ```bash
   npx prisma migrate status
   ```

3. Reset if needed:
   ```bash
   npx prisma migrate reset
   ```

### Issue: "Environment variable not found"

**Error:** `Environment variable not found: DATABASE_URL`

**Solutions:**

1. Ensure `.env` file exists in `server/` directory
2. Check `.env` contains:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. Restart your development server

### Issue: "Port 5432 already in use"

**Solutions:**

1. Another PostgreSQL instance is running
2. Check running processes:
   ```bash
   # macOS/Linux
   lsof -i :5432
   
   # Windows
   netstat -ano | findstr :5432
   ```
3. Stop conflicting service or change port

### Issue: Tables not showing in pgAdmin

**Solutions:**

1. Right-click **Tables** → **Refresh**
2. Check you're looking at the `public` schema
3. Run `\dt` in psql to verify tables exist

### Issue: "Prisma Client not generated"

**Error:** `Cannot find module '@prisma/client'`

**Solutions:**

```bash
npx prisma generate
```

---

## Team Workflow

### For New Team Members

1. **Clone repository**
   ```bash
   git clone https://github.com/CaitlinMEvans/SmartBudget.git
   cd SmartBudget/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create local database** (follow [Database & User Setup](#database--user-setup))

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Verify setup**
   ```bash
   npx prisma studio
   ```

### When Adding New Tables

1. **Update schema** (`prisma/schema.prisma`)
2. **Create migration**
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```
3. **Generate client**
   ```bash
   npx prisma generate
   ```
4. **Commit changes**
   ```bash
   git add prisma/
   git commit -m "Add new table: TableName"
   git push
   ```

### When Pulling Schema Changes

```bash
git pull
npm install  # In case of package changes
npx prisma migrate dev  # Apply new migrations
npx prisma generate  # Update client
```

---

## Production Considerations

### Environment Variables

Use strong credentials:

```env
DATABASE_URL="postgresql://prod_user:STRONG_PASSWORD@db.example.com:5432/smartbudget_prod"
```

### Migrations

Use deploy command in production:

```bash
npx prisma migrate deploy
```

**Never use** `prisma migrate dev` in production!

### Connection Pooling

For production, consider using:
- PgBouncer
- Prisma Data Proxy
- Connection pooling in hosting platform

### Backups

Set up automated backups:

```bash
# PostgreSQL backup
pg_dump -U smartbudget smartbudget > backup.sql

# Restore
psql -U smartbudget smartbudget < backup.sql
```

---

## Resources

### Official Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pgAdmin Docs](https://www.pgadmin.org/docs/)

### Useful Commands Reference

```bash
# Prisma
npx prisma init               # Initialize Prisma
npx prisma generate          # Generate client
npx prisma migrate dev       # Create and apply migration
npx prisma migrate deploy    # Apply migrations (production)
npx prisma migrate reset     # Reset database
npx prisma studio            # Open database GUI
npx prisma db push           # Push schema without migration
npx prisma db seed           # Run seed script

# PostgreSQL
psql -U user -d database     # Connect to database
\l                           # List databases
\c database                  # Connect to database
\dt                          # List tables
\d "Table"                   # Describe table
\du                          # List users
\q                           # Quit
```

---

## Support

For database-related issues:

1. Check this documentation
2. Review [Prisma Documentation](https://www.prisma.io/docs)
3. Check [PostgreSQL Documentation](https://www.postgresql.org/docs/)

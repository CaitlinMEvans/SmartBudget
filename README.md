# Quote
"If today you are a little better than you were yesterday, then that is enough!" - David A. Bednar
"Through determination and resilience, what once seemed impossible becomes inevitable."
# SmartBudget  
**Student Expense Tracking and Financial Planner**

SmartBudget is a web application designed to help students track expenses, manage budgets, and better understand their spending habits. The app focuses on simplicity, clarity, and real-world usefulness, allowing users to record daily expenses, organize them into categories, set weekly or monthly budgets, and view spending summaries through a clean dashboard.

This project is being developed as part of **CSE 499 – Senior Project** using an Agile, sprint-based approach.

---

## Problem Statement

Students often juggle tuition, rent, food, transportation, and personal expenses with limited income. Because expenses accumulate quietly, it’s easy to lose track of spending and overshoot budgets without realizing it.

Most existing financial tools are either too complex or not tailored for student needs. SmartBudget aims to provide a **simple, student-friendly solution** that helps users stay aware of where their money is going and make more informed financial decisions.

---

## Core Features

- Secure user authentication (register, login, logout)
- Add, edit, and delete expenses
- Categorize expenses (e.g., food, rent, transport)
- Set weekly or monthly budgets
- Dashboard summary showing spending vs. budget
- Filter expenses by category and date

---

## Planned Enhancements

- Visual charts (spending by category)
- Export expense history (CSV)
- Savings goal tracking
- Dark mode / light mode
- Accessibility and performance improvements

> Final enhancement scope will be determined during sprint planning.

---

## Project Architecture

SmartBudget follows a **client–server web architecture**:

- **Frontend:** React (Vite)
- **Backend:** Node.js with Express (REST API)
- **Database:** PostgreSQL or MongoDB (TBD by team)
- **Authentication:** JWT-based authentication
- **Deployment:**
  - Frontend: Vercel or Netlify
  - Backend: Render
- **Version Control:** GitHub
- **Project Management:** Trello + Agile sprints

---

## Repository Structure

```text
smartbudget/
├── client/        # React frontend (Vite)
├── server/        # Express backend (to be implemented)
├── README.md
└── .gitignore
# Postgres + Prisma DB Setup and Usage

## Prerequisites

- Install PostgreSQL locally (includes `psql` + service)
- Install pgAdmin (optional but recommended)
- Node.js installed (project already uses it)

---

## 1) Create the Local Postgres Role + Database (pgAdmin)

### A) Create Role (User)

In pgAdmin:

1. Navigate to **Login/Group Roles** → **Create** → **Login/Group Role**
2. **General** tab:
   - Name: `smartbudget`
3. **Definition** tab:
   - Password: `smartbudget_pw`
4. **Privileges** tab - Turn on:
   - Can login
   - Create databases (recommended)
   - Create roles (optional)
5. Click **Save**

### B) Create Database

1. Navigate to **Databases** → **Create** → **Database**
2. **General** tab:
   - Name: `smartbudget`
   - Owner: `smartbudget`
3. Click **Save**

Everything will live under the default schema: `public`.

---

## 2) Server Environment Variables

Create `server/.env` (or copy from `.env.example` if provided):
```env
PORT=8080
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=1h

DATABASE_URL="postgresql://smartbudget:smartbudget_pw@localhost:5432/smartbudget"
```

---

## 3) Install Dependencies + Initialize Prisma

From `/server`:
```bash
npm install
npx prisma generate
```

---

## 4) Run Migrations (Creates Tables in Postgres)

From `/server`:
```bash
npx prisma migrate dev --name init
```

**What this does:**
- Reads `prisma/schema.prisma`
- Creates/updates tables in `smartbudget` DB (schema `public`)
- Creates the Prisma migration history table

---

## 5) Add a New Domain/Table (Prisma Model)

### A) Add Model to Prisma Schema

Open: `server/prisma/schema.prisma`

Add your model under the others. Example:
```prisma
model Expense {
  id          Int      @id @default(autoincrement())
  userId      Int
  amount      Decimal
  category    String
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}
```

### B) Create/Apply Migration for Your Change

From `/server`:
```bash
npx prisma migrate dev --name add_expense
npx prisma generate
```

**Rules:**
- Every schema change requires a new migration
- Name migrations clearly: `add_expense`, `add_budget_tables`, `expense_indexes`, etc.

---

## 6) Verify Everything is Working (Prisma + pgAdmin)

### A) Prisma Studio (Quickest Sanity Check)

From `/server`:
```bash
npx prisma studio
```

- Opens a browser UI (usually http://localhost:5555)
- You should see your models listed (`User`, `Expense`, etc.)
- You should be able to view records, add a record, etc.
- If you register a user through the app and it's wired correctly, you'll see a new `User` row appear here.

### B) pgAdmin Verification

In pgAdmin:

1. Navigate to **Servers** → your server → **Databases** → `smartbudget`
2. **Schemas** → `public` → **Tables**

Your tables should appear:
- `"User"`
- `"Expense"`
- etc.

**To check contents:**

Right-click a table → **View/Edit Data** → **All Rows**

Or run a query:
```sql
SELECT * FROM public."User" ORDER BY id ASC;
SELECT * FROM public."Expense" ORDER BY id ASC;
```

---

## 7) Typical Workflow for Each Teammate

1. Pull latest repo
2. Create local Postgres role + DB (Section 1)
3. Add `server/.env` (Section 2)
4. Install dependencies:
```bash
   cd server
   npm install
```
5. Apply existing migrations:
```bash
   npx prisma migrate dev
   npx prisma generate
```

**When adding your own tables:**

1. Edit `prisma/schema.prisma`
2. Run:
```bash
   npx prisma migrate dev --name <your_change>
   npx prisma generate
```
3. Verify in:
   - `npx prisma studio`
   - pgAdmin tables + query tool

---

## Common Gotchas

- **Wrong DB creds** → you'll see Prisma error `P1000` (auth failed). Re-check `.env` `DATABASE_URL`.
- **DB not running** → `P1001` (can't reach server). Start Postgres service.
- **Tables not showing in pgAdmin** → refresh the schema/tables node (right-click → **Refresh**).
- **Quoting table names:** Prisma often creates `"User"` with capitalization. In SQL, use:
```sql
  SELECT * FROM public."User";
```
  not `public.user`.
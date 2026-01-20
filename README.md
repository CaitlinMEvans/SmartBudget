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
import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./auth/RequireAuth";

// Import pages that render the components
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions";
import BudgetsPage from "./pages/Budgets";

function App() {
  return (
    <>
      <TopNav />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/transactions"
          element={
            <RequireAuth>
              <TransactionsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/budgets"
          element={
            <RequireAuth>
              <BudgetsPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;

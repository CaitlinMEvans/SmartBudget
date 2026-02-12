import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./auth/RequireAuth";
import Expenses from "./pages/Expense";
import Categories from "./pages/Category";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import AddBudget from "./pages/AddBudget";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/budget" 
          element={
            <RequireAuth>
              <Budget />
            </RequireAuth>
          }
        />

        <Route 
          path="/budget/add" 
          element={
            <RequireAuth>
              <AddBudget />
            </RequireAuth>
          } 
        />     
        {/* Example protected route */}

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/expenses"
          element={
            <RequireAuth>
              <Expenses />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;

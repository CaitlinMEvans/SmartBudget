import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./auth/RequireAuth";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Example protected route */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Home />
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
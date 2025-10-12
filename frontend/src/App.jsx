import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import AddExpense from "./pages/addExpense.jsx";
import Balances from "./pages/balances.jsx";
import Login from "./pages/logIn.jsx";
import Signup from "./pages/signUp.jsx";
import { AuthContext } from "./context/authContext.jsx";
import Groups from "./pages/groups.jsx";
import GroupDetails from "./pages/groupDetails.jsx";
import AddGroupExpense from "./pages/addGroupExpense.jsx";
import CreateGroup from "./pages/createGroup.jsx";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="app">
      <nav className="nav ">
        <h1 className="brand">
          <Link to="/" className="brand-link">
            MoneyMate
          </Link>
        </h1>
        <div className="links">
          {!token ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/add" className="nav-link">
                Add Expense
              </Link>
              <Link to="/balances" className="nav-link">
                Balances
              </Link>
              <Link to="/groups" className="nav-link">
                Groups
              </Link>
              <button onClick={logout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!token ? <Signup /> : <Navigate to="/" replace />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            // from login response

            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/balances"
            element={
              <ProtectedRoute>
                <Balances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:id"
            element={
              <ProtectedRoute>
                <GroupDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:id/add"
            element={
              <ProtectedRoute>
                <AddGroupExpense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/groups/create"
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import React from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddExpense from "./pages/addExpense.jsx";
import Balances from "./pages/Balances.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/balances" element={<Balances />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

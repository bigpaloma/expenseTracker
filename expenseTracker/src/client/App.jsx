import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";
import Navbar from "./views/Navbar";
import Wallets from "./views/Wallets";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Wallets" element={<Wallets />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;

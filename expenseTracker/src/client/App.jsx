import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";
import Navbar from "./views/Navbar";
import Wallets from "./views/Wallets";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useSelector } from "react-redux";

function App() {

  const isAuth = Boolean(useSelector((state) => state.token))
  return (
    <>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/Wallets" element={isAuth ? <Wallets /> : <Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;

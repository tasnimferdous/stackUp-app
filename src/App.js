import React, { useEffect, useState } from "react";
import {BrowserRouter, Route, Routes, Navigate, useLocation} from "react-router-dom";

import Backlog from "./pages/Backlog";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import About from "./pages/About";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <BrowserRouter>
    <MainApp isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </BrowserRouter>
  );
}

function MainApp({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, [setIsAuthenticated]);

if (loading) {
  return <div>Loading...</div>;
}

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' ? (
        <Sidebar setIsAuthenticated = {setIsAuthenticated} >
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
            <Route path="/backlog" element={isAuthenticated ? <Backlog setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
            <Route path="/board" element={isAuthenticated ? <Board setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  );
}


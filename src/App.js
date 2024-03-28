import React from "react";
import { useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Header from "./components/Header"
import MainAccordion from "./components/MainAccordion";
import Backlog from "./pages/Backlog";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/about" element={<About />}/>
          <Route path="/backlog" element={<Backlog />}/>
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}


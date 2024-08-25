import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Backlog from "./pages/Backlog";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
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
          <Route path="/board" element={<Board />}/>
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
}


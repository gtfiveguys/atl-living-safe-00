import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hello from "./components/Hello/Hello";
import NavBar from "./components/Navbar/MyNavBar";
import GoogleMap from "./components/Map/GoogleMap";
import Dashboard from "./components/Dashboard/Dashboard";
import PopUp from "./components/PopUp/PopUp";
import Analytics from "./components/Analytics/Analytics";
import About from "./components/About/About";
import { useSelector } from "react-redux";

function App() {
  const [user, setUser] = useState(null);
  const togglePop = useSelector((state) => state.togglePop);

  return (
    <div style={{ height: "100%" }}>
      <NavBar user={user} setUser={setUser} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hello user={user} />} />
          <Route path="/map" element={<GoogleMap user={user} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
      {togglePop && <PopUp togglePop={togglePop} />}
    </div>
  );
}

export default App;

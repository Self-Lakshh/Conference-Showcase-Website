// App.tsx — Main Router & Entry Point

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import { NetworkLoader } from "./components/NetworkLoader";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

import { Home }       from "./pages/Home.tsx";
import { Conferences } from "./pages/Conferences.tsx";
import { Papers }      from "./pages/Papers.tsx";
import { Speakers }    from "./pages/Speakers.tsx";
import { Community }   from "./pages/Community.tsx";
import { Admin }       from "./pages/Admin.tsx";

const App: React.FC = () => {
  const { initStore, theme } = useStore();
  const [showLoader, setShowLoader] = useState(true);

  // Sync theme class on <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("light", theme === "light");
    html.classList.toggle("dark",  theme === "dark");
  }, [theme]);

  // Bootstrap store
  useEffect(() => { initStore(); }, [initStore]);

  return (
    <Router>
      {showLoader ? (
        <NetworkLoader onComplete={() => setShowLoader(false)} />
      ) : (
        <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--c-bg)" }}>

          {/* Aurora background */}
          <div className="aurora-container" aria-hidden="true">
            <div className="aurora-blob blob-1" />
            <div className="aurora-blob blob-2" />
            <div className="aurora-blob blob-3" />
            <div className="absolute inset-0 network-grid opacity-30 pointer-events-none" />
          </div>

          <NavBar />

          <main className="flex-grow">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/conferences" element={<Conferences />} />
              <Route path="/papers"      element={<Papers />} />
              <Route path="/speakers"    element={<Speakers />} />
              <Route path="/community"   element={<Community />} />
              <Route path="/admin"       element={<Admin />} />
              <Route path="*"            element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      )}
    </Router>
  );
};

export default App;

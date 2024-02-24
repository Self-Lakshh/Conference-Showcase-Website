// NavBar.tsx — Clean, modern GDG-style navigation

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import {
  Search, Bell, User, Menu, X, LogOut, Settings,
  BookOpen, Award, Calendar, Users, Sun, Moon
} from "lucide-react";

export const NavBar: React.FC = () => {
  const {
    currentUser, logout,
    searchQuery, setSearchQuery,
    notifications, readNotification,
    theme, setTheme
  } = useStore();

  const location  = useLocation();
  const navigate  = useNavigate();

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [notifOpen,  setNotifOpen]      = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const unread = notifications.filter(n => !n.read);

  const navLinks = [
    { name: "Conferences", path: "/conferences", icon: Calendar },
    { name: "Papers",      path: "/papers",       icon: BookOpen },
    { name: "Speakers",    path: "/speakers",     icon: Award },
    { name: "Communities", path: "/communities",  icon: Users },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!["/conferences", "/papers", "/speakers"].includes(location.pathname)) {
      navigate("/conferences");
    }
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className={`site-nav sticky top-0 z-40 w-full transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/logo.png"
              alt="Conference Website"
              className="h-9 w-9 rounded-xl object-contain group-hover:scale-105 transition-transform shadow-md"
              style={{ background: "linear-gradient(135deg,#4f6ef7,#7c5af5)", padding: "4px" }}
            />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-base tracking-tight" style={{ color: "var(--c-text)" }}>
                Conference Website
              </span>
              <p className="text-[9px] uppercase tracking-[0.18em] font-medium" style={{ color: "var(--c-accent)" }}>
                Discovery Portal
              </p>
            </div>
          </Link>

          {/* ── Search ── */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--c-text-3)" }} />
            <input
              type="text"
              placeholder="Search conferences, papers, speakers…"
              value={searchQuery}
              onChange={handleSearch}
              className="input-field w-full rounded-full py-1.5 pl-9 pr-4 text-sm"
            />
          </div>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-[#4f6ef7] bg-[rgba(79,110,247,0.08)]"
                      : "hover:bg-[var(--c-surface-2)]"
                  }`}
                  style={{ color: active ? "#4f6ef7" : "var(--c-text-2)" }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-[rgba(79,110,247,0.08)] -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-1">

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--c-surface-2)]"
              style={{ color: "var(--c-text-2)" }}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark"
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </button>

            {/* Mobile search shortcut */}
            <button
              onClick={() => navigate("/conferences")}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--c-surface-2)] md:hidden"
              style={{ color: "var(--c-text-2)" }}
            >
              <Search className="h-4 w-4" />
            </button>

            {currentUser ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="relative p-2 rounded-lg transition-colors hover:bg-[var(--c-surface-2)]"
                    style={{ color: "var(--c-text-2)" }}
                  >
                    <Bell className="h-4 w-4" />
                    {unread.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="glass absolute right-0 mt-2 w-80 rounded-xl p-4 shadow-xl z-50"
                      >
                        <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: "1px solid var(--c-border)" }}>
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--c-text)" }}>
                            Notifications
                          </span>
                          <span className="text-[10px] chip chip-accent">{unread.length} new</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-2">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-center py-4" style={{ color: "var(--c-text-3)" }}>Nothing new.</p>
                          ) : notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => readNotification(n.id)}
                              className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                n.read ? "opacity-50" : "border-l-2 border-[#06d6a0]"
                              }`}
                              style={{ background: "var(--c-surface-2)" }}
                            >
                              <div className="font-semibold" style={{ color: "var(--c-text)" }}>{n.title}</div>
                              <div className="mt-0.5 leading-relaxed" style={{ color: "var(--c-text-2)" }}>{n.message}</div>
                              <div className="mt-1 text-right text-[9px]" style={{ color: "var(--c-text-3)" }}>{n.date}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="rounded-full overflow-hidden h-8 w-8 border-2 transition-all hover:border-[#4f6ef7]"
                    style={{ borderColor: "var(--c-border-2)" }}
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="glass absolute right-0 mt-2 w-52 rounded-xl p-2 shadow-xl z-50"
                      >
                        <div className="px-3 py-2 mb-1" style={{ borderBottom: "1px solid var(--c-border)" }}>
                          <p className="text-xs font-semibold" style={{ color: "var(--c-text)" }}>{currentUser.name}</p>
                          <p className="text-[10px] truncate" style={{ color: "var(--c-text-3)" }}>{currentUser.email}</p>
                          <span className="mt-1.5 chip chip-accent text-[9px]">{currentUser.role}</span>
                        </div>
                        <div className="space-y-0.5">
                          <Link to="/community" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors hover:bg-[var(--c-surface-2)]"
                            style={{ color: "var(--c-text-2)" }}
                          >
                            <User className="h-3.5 w-3.5" /> My Dashboard
                          </Link>
                          {currentUser.role === "admin" && (
                            <Link to="/admin" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                              style={{ color: "#06d6a0", background: "rgba(6,214,160,0.08)" }}
                            >
                              <Settings className="h-3.5 w-3.5" /> Control Console
                            </Link>
                          )}
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors hover:bg-red-500/10"
                            style={{ color: "#ef4444" }}
                          >
                            <LogOut className="h-3.5 w-3.5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/community" className="btn-primary !py-1.5 !px-4 !text-xs ml-1">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--c-surface-2)] lg:hidden ml-1"
              style={{ color: "var(--c-text-2)" }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav-panel lg:hidden px-4 py-4 space-y-1"
            style={{ borderTop: "1px solid var(--c-border)" }}
          >
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-[rgba(79,110,247,0.08)] text-[#4f6ef7]" : "hover:bg-[var(--c-surface-2)]"
                  }`}
                  style={{ color: active ? "#4f6ef7" : "var(--c-text-2)" }}
                >
                  <Icon className="h-4 w-4" /> {link.name}
                </Link>
              );
            })}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={handleSearch}
                className="input-field w-full rounded-lg py-2 px-3 text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

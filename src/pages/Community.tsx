// Community.tsx - Personal Researcher Dashboard and Community Portal

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Bookmark, Ticket, Settings, Trash2, Mail, Lock, 
  Sparkles, Check, Clock, ChevronRight, Globe, Shield, Terminal
} from "lucide-react";
import confetti from "canvas-confetti";

export const Community: React.FC = () => {
  const { 
    currentUser, 
    login, 
    logout, 
    registrations, 
    bookmarks, 
    notifications, 
    readNotification,
    conferences,
    papers,
    speakers,
    toggleBook
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState("passes");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Artificial Intelligence", "Quantum Physics"]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoading(true);
    
    // Simulate login lag
    setTimeout(async () => {
      await login(emailInput);
      setLoading(false);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.75 },
        colors: ["#00E5FF", "#8A2BE2"]
      });
    }, 800);
  };

  const handleRemoveBookmark = async (type: "paper" | "conference" | "speaker", id: string) => {
    await toggleBook(type, id);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Auth Portal View
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl border-white/5 p-8 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-violet/5 blur-2xl" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center text-white shadow-lg mx-auto font-bold text-lg mb-4">
              CW
            </div>
            <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">Conference Website Portal</h1>
            <p className="text-[11px] text-slate-500 mt-1">Access your saved papers, conference passes, and publication logs.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Research Coordinate (Email)</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-white placeholder-slate-600 focus:border-brand-cyan focus:outline-none"
                />
                <Mail className="absolute right-3.5 top-3 h-4 w-4 text-slate-650" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Securing authorization...</span>
              ) : (
                <>
                  Enter Research Console <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-slate-600 font-mono">
            Any email will create a secure local profile session.
          </div>
        </motion.div>
      </div>
    );
  }

  // --- PROFILE DASHBOARD VIEW ---
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Headline card */}
      <div className="glass rounded-3xl border-white/5 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 relative">
        <div className="absolute top-0 right-0 h-full w-1/4 bg-radial-gradient from-brand-cyan/10 to-transparent blur-3xl" />
        
        <div className="flex items-center gap-4 z-10">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="h-16 w-16 rounded-full border border-white/15 object-cover"
          />
          <div>
            <span className="text-[9px] font-mono text-brand-cyan uppercase bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/10 capitalize">
              {currentUser.role} console active
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1.5 uppercase tracking-wide">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-450">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors z-10"
        >
          Close Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INTEREST SETTINGS & TABS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sub Navigation tabs */}
          <div className="glass rounded-2xl border-white/5 p-3 space-y-1 text-xs font-mono">
            {[
              { id: "passes", name: "Conference Passes", count: registrations.length, icon: Ticket },
              { id: "bookmarks", name: "Saved Resources", count: bookmarks.length, icon: Bookmark },
              { id: "notifications", name: "Bulletin & Logs", count: notifications.filter(n => !n.read).length, icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isSelected 
                      ? "bg-brand-cyan/10 text-brand-cyan font-semibold"
                      : "text-slate-455 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4.5 w-4.5" />
                    {tab.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/5 font-bold">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interests Checklist card */}
          <div className="glass rounded-2xl p-5 border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-cyan" /> Research coordinates
            </h3>
            <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
              We personalize recommendations based on these tags.
            </p>
            <div className="space-y-2">
              {[
                "Artificial Intelligence",
                "Quantum Physics",
                "Bioinformatics",
                "Astrophysics",
                "Cryptography",
                "Green Energy"
              ].map((interest) => {
                const checked = selectedInterests.includes(interest);
                return (
                  <label key={interest} className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      onChange={() => toggleInterest(interest)}
                      className="rounded border-white/10 bg-slate-950 text-brand-cyan focus:ring-brand-cyan"
                    />
                    <span>{interest}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL TABS (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* 1. Passes Tab */}
            {activeSubTab === "passes" && (
              <motion.div
                key="passes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {registrations.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl border-white/5">
                    <Ticket className="h-10 w-10 text-slate-650 mx-auto animate-pulse mb-3" />
                    <p className="text-xs text-slate-500 italic">You have no active registration passes. Go register for conferences!</p>
                  </div>
                ) : (
                  registrations.map((reg) => {
                    const conf = conferences.find(c => c.id === reg.conferenceId);
                    if (!conf) return null;
                    return (
                      <div 
                        key={reg.id}
                        className="glass rounded-2xl border-white/5 overflow-hidden flex flex-col md:flex-row"
                      >
                        {/* Ticket left detail */}
                        <div className="p-6 flex-grow border-r border-dashed border-white/10">
                          <span className="text-[8px] font-mono text-brand-cyan uppercase bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/10">
                            Admission Ticket Pass
                          </span>
                          <h3 className="text-sm font-extrabold text-white mt-3 uppercase tracking-wide">
                            {conf.title}
                          </h3>
                          <p className="text-xs text-slate-405 mt-2 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-brand-cyan" /> {conf.startDate} to {conf.endDate}
                          </p>
                          <p className="text-xs text-slate-405 mt-1 flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-brand-violet" /> {conf.venue}
                          </p>
                          <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-600 flex justify-between">
                            <span>REG DATE: {reg.registerDate}</span>
                            <span>PASS ID: {reg.id}</span>
                          </div>
                        </div>

                        {/* Ticket Right stub: mock QR code representation */}
                        <div className="p-6 md:w-48 bg-slate-950/40 flex flex-col items-center justify-center gap-2">
                          {/* SVG QR Code */}
                          <svg className="h-20 w-20 border border-white/10 p-1.5 rounded-lg bg-white">
                            <rect x="0" y="0" width="8" height="8" fill="#000" />
                            <rect x="0" y="12" width="8" height="8" fill="#000" />
                            <rect x="12" y="0" width="8" height="8" fill="#000" />
                            <rect x="4" y="4" width="4" height="4" fill="#000" />
                            <rect x="8" y="8" width="4" height="4" fill="#000" />
                            <rect x="12" y="12" width="4" height="4" fill="#000" />
                          </svg>
                          <span className="text-[10px] font-mono text-slate-450 tracking-wider text-center font-bold">
                            {reg.ticketCode}
                          </span>
                          <span className="text-[8px] font-mono text-brand-emerald text-center uppercase tracking-widest block font-bold">
                            Verified Pass
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* 2. Saved Bookmarks Tab */}
            {activeSubTab === "bookmarks" && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {bookmarks.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl border-white/5">
                    <Bookmark className="h-10 w-10 text-slate-650 mx-auto animate-pulse mb-3" />
                    <p className="text-xs text-slate-500 italic">No bookmarks saved yet. Star resources to build your discovery list!</p>
                  </div>
                ) : (
                  bookmarks.map((bmark) => {
                    let title = "";
                    let detail = "";
                    let link = "";
                    
                    if (bmark.type === "paper") {
                      const p = papers.find(item => item.id === bmark.itemId);
                      title = p?.title || "Paper";
                      detail = `Topic: ${p?.topics[0]} • Citations: ${p?.citationsCount}`;
                      link = `/papers?id=${bmark.itemId}`;
                    } else if (bmark.type === "conference") {
                      const c = conferences.find(item => item.id === bmark.itemId);
                      title = c?.title || "Conference";
                      detail = `Location: ${c?.location} • Date: ${c?.startDate}`;
                      link = `/conferences?id=${bmark.itemId}`;
                    } else {
                      const s = speakers.find(item => item.id === bmark.itemId);
                      title = s?.name || "Speaker";
                      detail = `${s?.title}`;
                      link = `/speakers?id=${bmark.itemId}`;
                    }

                    return (
                      <div 
                        key={bmark.id}
                        className="glass rounded-xl p-4 border-white/5 flex justify-between items-center gap-4 glass-hover"
                      >
                        <div>
                          <span className="text-[8px] font-mono text-brand-cyan uppercase bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/10">
                            {bmark.type} coordinate
                          </span>
                          <Link to={link} className="block text-xs font-bold text-white hover:text-brand-cyan transition-colors mt-2 uppercase">
                            {title}
                          </Link>
                          <p className="text-[10px] text-slate-500 mt-1 font-mono">{detail}</p>
                        </div>

                        <button
                          onClick={() => handleRemoveBookmark(bmark.type, bmark.itemId)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* 3. Notifications Tab */}
            {activeSubTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-10">No messages in logs feed.</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => readNotification(notif.id)}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        notif.read 
                          ? "bg-slate-950/20 border-white/5 text-slate-500" 
                          : "glass border-l-4 border-brand-emerald text-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide">{notif.title}</span>
                        <span className="text-[9px] font-mono text-slate-600">{notif.date}</span>
                      </div>
                      <p className="text-xs text-slate-405 mt-2 leading-relaxed">{notif.message}</p>
                      {!notif.read && (
                        <span className="text-[8px] font-mono text-brand-emerald block text-right mt-2 uppercase font-bold">
                          ● Mark Read
                        </span>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

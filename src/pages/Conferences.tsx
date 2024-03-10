// Conferences.tsx - Advanced Conferences Portal and Detail Workspace

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { 
  Calendar, MapPin, DollarSign, Users, Award, BookOpen, Download, 
  HelpCircle, MessageSquare, Image as ImageIcon, Video, ArrowLeft, 
  Map, Check, Clock, Search, ChevronRight, Bookmark, BookmarkCheck, Play, Compass
} from "lucide-react";
import confetti from "canvas-confetti";

export const Conferences: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const confId = searchParams.get("id");
  const topicFilter = searchParams.get("topic");

  const { 
    conferences, 
    speakers, 
    papers, 
    sponsors, 
    currentUser, 
    registrations, 
    bookmarks,
    toggleBook,
    registerForConf,
    searchQuery
  } = useStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTopic, setSelectedTopic] = useState<string>(topicFilter || "all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedReg, setSelectedReg] = useState<string>("all");
  const [ticketPurchased, setTicketPurchased] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  // Keep tab updated when opening new conference
  useEffect(() => {
    setActiveTab("overview");
    setTicketPurchased(false);
    setVideoPlaying(false);
  }, [confId]);

  // Synchronize topic state with query params
  useEffect(() => {
    if (topicFilter) {
      setSelectedTopic(topicFilter);
    }
  }, [topicFilter]);

  // Filtered Conferences
  const filteredConferences = conferences.filter((conf) => {
    const matchesSearch = searchQuery
      ? conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conf.venue.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesTopic = selectedTopic === "all"
      ? true
      : conf.tracks.some(t => t.toLowerCase().includes(selectedTopic.toLowerCase())) ||
        conf.description.toLowerCase().includes(selectedTopic.toLowerCase());

    const matchesStatus = selectedStatus === "all" ? true : conf.status === selectedStatus;
    const matchesReg = selectedReg === "all" ? true : conf.registrationStatus === selectedReg;

    return matchesSearch && matchesTopic && matchesStatus && matchesReg;
  });

  // Selected Conference Data
  const currentConf = conferences.find((c) => c.id === confId);

  // Registration Check
  const isRegistered = currentConf 
    ? registrations.some(r => r.conferenceId === currentConf.id) 
    : false;

  // Bookmark Check
  const isBookmarked = currentConf
    ? bookmarks.some(b => b.type === "conference" && b.itemId === currentConf.id)
    : false;

  const handleRegister = async () => {
    if (!currentConf || !currentUser) return;
    await registerForConf(currentConf.id);
    setTicketPurchased(true);
    
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00E5FF", "#8A2BE2", "#00FA9A"]
    });
  };

  const handleBookmark = async () => {
    if (!currentConf) return;
    await toggleBook("conference", currentConf.id);
  };

  // Get speaker objects for the current conference
  const confSpeakers = currentConf
    ? speakers.filter(s => currentConf.speakerIds.includes(s.id))
    : [];

  // Get papers for current conference
  const confPapers = currentConf
    ? papers.filter(p => currentConf.paperIds.includes(p.id))
    : [];

  // Get sponsors for current conference
  const confSponsors = currentConf
    ? sponsors.filter(s => currentConf.sponsorIds.includes(s.id))
    : [];

  // Directory View rendering
  if (!currentConf) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">GLOBAL CONFERENCES & SYMPOSIUMS</h1>
          <p className="text-xs text-slate-500 mt-2">Explore the world's most anticipated scientific meetups and workshops.</p>
        </div>

        {/* Filter Bar Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 glass p-5 rounded-2xl border-white/5">
          {/* Search Query info */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-550 uppercase">Active Search Query</span>
            <div className="relative text-xs py-2 px-3 border border-white/10 rounded-lg bg-slate-950/40 text-slate-350 italic truncate">
              {searchQuery || "All titles & details matching..."}
            </div>
          </div>
          {/* Topic Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-550 uppercase">Research Discipline</span>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSearchParams({}); // Clear active conference focus
              }}
              className="rounded-lg border border-white/10 bg-slate-950 text-xs py-2 px-3 focus:border-brand-cyan focus:outline-none"
            >
              <option value="all">All Topics</option>
              <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
              <option value="Quantum">Quantum Physics</option>
              <option value="Bioinformatics">Bioinformatics & Genomes</option>
              <option value="Astrophysics">Astrophysics</option>
              <option value="Cryptography">Cybersecurity & Cryptography</option>
              <option value="Green Energy">Climate Tech & Energy</option>
            </select>
          </div>
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-550 uppercase">Timeframe status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-950 text-xs py-2 px-3 focus:border-brand-cyan focus:outline-none"
            >
              <option value="all">Any Date</option>
              <option value="Upcoming">Upcoming Events</option>
              <option value="Ongoing">Active Right Now</option>
              <option value="Past">Past Archives</option>
            </select>
          </div>
          {/* Registration Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-550 uppercase">Ticket Availability</span>
            <select
              value={selectedReg}
              onChange={(e) => setSelectedReg(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-950 text-xs py-2 px-3 focus:border-brand-cyan focus:outline-none"
            >
              <option value="all">Any Status</option>
              <option value="Open">Open</option>
              <option value="Selling Fast">Selling Fast</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredConferences.length === 0 ? (
            <div className="col-span-3 text-center py-20 glass rounded-3xl border-white/5">
              <Compass className="h-10 w-10 text-slate-650 mx-auto animate-pulse mb-4" />
              <p className="text-sm font-semibold text-slate-400">No conferences match your criteria.</p>
              <button 
                onClick={() => { setSelectedTopic("all"); setSelectedStatus("all"); setSelectedReg("all"); }}
                className="text-xs text-brand-cyan mt-2 underline"
              >
                Reset Filter Settings
              </button>
            </div>
          ) : (
            filteredConferences.map((conf) => (
              <div 
                key={conf.id} 
                className="glass rounded-2xl border-white/5 overflow-hidden flex flex-col justify-between glass-hover group"
              >
                <div className="relative h-44">
                  <img src={conf.coverImage} alt={conf.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-80" />
                  <span className={`absolute top-4 right-4 text-[8px] font-mono font-bold px-2 py-0.5 rounded capitalize ${
                    conf.registrationStatus === "Closed" ? "bg-red-550/20 text-red-400 border border-red-500/20" : "bg-brand-emerald-dim text-brand-emerald border border-brand-emerald-border/20"
                  }`}>
                    {conf.registrationStatus}
                  </span>
                  <span className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-350 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-cyan" /> {conf.startDate}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white group-hover:text-brand-cyan transition-colors leading-snug line-clamp-2 uppercase">
                      {conf.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                      {conf.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-brand-cyan" /> {conf.location.split(",")[0]}</span>
                    <button 
                      onClick={() => setSearchParams({ id: conf.id })}
                      className="text-brand-cyan font-bold flex items-center gap-0.5 hover:underline"
                    >
                      Enter Workspace <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- DETAIL WORKSPACE VIEW ---
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={() => setSearchParams({})}
        className="inline-flex items-center gap-1.5 text-xs text-slate-450 hover:text-white transition-colors mb-6 font-mono"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Directory
      </button>

      {/* Conference Headline Banner */}
      <div className="glass rounded-3xl border-white/5 overflow-hidden mb-8 relative p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img src={currentConf.coverImage} alt="" className="h-full w-full object-cover blur-md scale-105" />
          <div className="absolute inset-0 bg-[#0B0F19]/90 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/70 to-[#0B0F19]/30" />
        </div>

        {/* Branding Info */}
        <div className="z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-brand-cyan mb-3">
            <span className="uppercase tracking-widest bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/20">{currentConf.status}</span>
            <span>•</span>
            <span>CODE: RS-{currentConf.id.toUpperCase()}</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight uppercase">
            {currentConf.title}
          </h1>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-cyan" /> {currentConf.venue}, {currentConf.location}
          </p>
        </div>

        {/* Sticky Call to Action Registration */}
        <div className="z-10 w-full md:w-auto glass p-4 rounded-2xl border-white/10 flex flex-col items-center gap-3">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-mono block">Pass Coordinate Fee</span>
            <span className="text-xl font-extrabold text-white font-mono">${currentConf.registrationFee}</span>
          </div>
          
          <div className="flex gap-2 w-full">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked 
                  ? "border-brand-violet/40 bg-brand-violet-dim text-brand-purple" 
                  : "border-white/15 hover:border-brand-cyan text-slate-350 hover:text-white"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
            </button>

            {currentUser ? (
              <button
                disabled={isRegistered || currentConf.registrationStatus === "Closed"}
                onClick={handleRegister}
                className={`flex-1 rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isRegistered 
                    ? "bg-brand-emerald-dim text-brand-emerald border border-brand-emerald-border/30 cursor-default"
                    : currentConf.registrationStatus === "Closed"
                    ? "bg-slate-900 border border-white/5 text-slate-550 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-violet to-brand-cyan text-white hover:brightness-110 shadow-lg shadow-brand-cyan/20"
                }`}
              >
                {isRegistered ? (
                  <>
                    <Check className="h-4 w-4" /> Registered
                  </>
                ) : currentConf.registrationStatus === "Closed" ? (
                  "Sold Out"
                ) : (
                  "Reserve Ticket"
                )}
              </button>
            ) : (
              <Link
                to="/community"
                className="flex-1 rounded-xl px-5 py-2 text-xs font-bold bg-slate-900 border border-white/10 text-brand-cyan text-center block"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6 text-xs font-mono">
        {[
          { id: "overview", name: "Overview Workspace", icon: Compass },
          { id: "scheduler", name: "Schedule & Tracks", icon: Calendar },
          { id: "speakers", name: "Featured Speakers", icon: Award },
          { id: "papers", name: "Scientific Publications", icon: BookOpen },
          { id: "resources", name: "Media, Gallery & Downloads", icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-colors ${
                isSelected 
                  ? "bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan font-semibold"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Workspace Area */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Detailed Description */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Conference Syllabus</h3>
                <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-line">
                  {currentConf.description}
                </p>
              </div>

              {/* Tracks listed */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Academic Domains & Tracks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentConf.tracks.map((track, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 text-xs flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                      <span className="text-slate-300 font-medium">{track}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-brand-cyan" /> Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {currentConf.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                      <h4 className="text-xs font-bold text-slate-200">{faq.question}</h4>
                      <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Venue & Location Map */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-brand-violet" /> Location coordinates
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-4">
                  Lat: {currentConf.coordinates.lat} / Lng: {currentConf.coordinates.lng}
                </p>
                {/* SVG Mock Map Constellation representation */}
                <div className="h-44 w-full bg-slate-950 rounded-xl relative border border-white/5 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 network-grid opacity-20" />
                  <div className="absolute h-8 w-8 rounded-full bg-brand-cyan/20 animate-ping" />
                  <div className="absolute h-4 w-4 rounded-full bg-brand-cyan border border-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[8px] font-mono text-slate-550 uppercase bg-slate-900 px-2 py-0.5 rounded">IC-Center Map Interface</span>
                </div>
                <div className="mt-4 text-xs text-slate-350 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-cyan" />
                  <div>
                    <strong className="text-white block text-xs">{currentConf.venue}</strong>
                    <span className="text-[10px] text-slate-450">{currentConf.location}</span>
                  </div>
                </div>
              </div>

              {/* Sponsor Grid */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-brand-emerald" /> Conference Sponsors
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {confSponsors.map((sp) => (
                    <a
                      key={sp.id}
                      href={sp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-white/5 bg-slate-950/20 hover:border-brand-cyan/30 text-center flex flex-col items-center justify-center transition-colors"
                    >
                      <span className="text-[10px] font-bold text-white uppercase">{sp.name.split(" ")[0]}</span>
                      <span className="text-[8px] text-brand-cyan font-mono mt-0.5 capitalize">{sp.tier} Sponsor</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule tab */}
        {activeTab === "scheduler" && (
          <div className="max-w-4xl glass rounded-2xl p-6 border-white/5">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Conference Program Tracks</h3>
            <div className="space-y-6">
              {currentConf.sessions.map((session, i) => (
                <div key={session.id} className="relative pl-6 border-l border-white/5 pb-4 last:pb-0">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-brand-cyan" />
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/10 capitalize">
                        {session.track}
                      </span>
                      <h4 className="text-xs md:text-sm font-extrabold text-white mt-2">
                        {session.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{session.description}</p>
                      
                      {/* Speaker coordinates inside schedule */}
                      <div className="mt-3 flex flex-wrap gap-3">
                        {session.speakerIds.map((sId) => {
                          const sp = speakers.find(s => s.id === sId);
                          if (!sp) return null;
                          return (
                            <Link 
                              key={sId} 
                              to={`/speakers?id=${sId}`} 
                              className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors"
                            >
                              <img src={sp.avatar} alt="" className="h-5 w-5 rounded-full border border-white/10" />
                              <span className="text-[10px] font-semibold">{sp.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 whitespace-nowrap pt-1">
                      <Clock className="h-3.5 w-3.5 text-brand-violet" />
                      <span>{session.startTime} - {session.endTime}</span>
                      <span className="text-slate-700">|</span>
                      <span>{session.room}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speakers tab */}
        {activeTab === "speakers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {confSpeakers.map((sp) => (
              <div key={sp.id} className="glass rounded-xl border-white/5 p-4 flex flex-col justify-between glass-hover group">
                <div className="flex items-center gap-3">
                  <img src={sp.avatar} alt={sp.name} className="h-10 w-10 rounded-full border border-white/10 object-cover" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{sp.name}</h4>
                    <p className="text-[9px] text-slate-500 truncate">{sp.title}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3.5 line-clamp-3 leading-relaxed">{sp.bio}</p>
                <Link
                  to={`/speakers?id=${sp.id}`}
                  className="mt-4 text-[10px] text-brand-cyan hover:underline font-semibold text-right block"
                >
                  View full coordinates →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Papers tab */}
        {activeTab === "papers" && (
          <div className="space-y-4 max-w-4xl">
            {confPapers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No publications indexed under this event directory yet.</p>
            ) : (
              confPapers.map((paper) => (
                <div key={paper.id} className="glass rounded-xl p-5 border-white/5 flex flex-col sm:flex-row justify-between gap-4 glass-hover">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {paper.topics.map((t, idx) => (
                        <span key={idx} className="text-[8px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-xs md:text-sm font-extrabold text-white tracking-wide uppercase">{paper.title}</h4>
                    <p className="text-[10px] text-slate-405 mt-2 line-clamp-2 leading-relaxed">{paper.abstract}</p>
                  </div>
                  
                  <div className="flex sm:flex-col justify-between items-end gap-2 text-right">
                    <span className="text-[10px] font-mono text-slate-500">
                      Citations: <strong className="text-brand-cyan">{paper.citationsCount}</strong>
                    </span>
                    <Link
                      to={`/papers?id=${paper.id}`}
                      className="rounded-full bg-slate-900 border border-white/10 px-4 py-1 text-[10px] font-semibold text-brand-cyan hover:bg-slate-800 transition-colors"
                    >
                      Explore Publication
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Media & Resources tab */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* Highlights Recording Player */}
            <div className="glass rounded-2xl p-6 border-white/5 max-w-3xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="h-4 w-4 text-brand-violet" /> Conference Recording Highlights
              </h3>
              
              {videoPlaying ? (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10 flex items-center justify-center">
                  {/* HTML5 video preview using mock sample source */}
                  <video 
                    src="https://www.w3schools.com/html/mov_bbb.mp4" 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div 
                  onClick={() => setVideoPlaying(true)}
                  className="relative rounded-xl overflow-hidden aspect-video bg-slate-950/80 cursor-pointer border border-white/5 flex flex-col justify-center items-center group transition-colors hover:border-brand-cyan/20"
                >
                  <div className="absolute inset-0 opacity-20 network-grid" />
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                  <span className="mt-3 text-xs font-semibold text-slate-350 tracking-wider">Play Event Highlight Reel</span>
                  <span className="text-[10px] text-slate-550 font-mono mt-1">Duration: 14m 22s</span>
                </div>
              )}
            </div>

            {/* Downloads grid */}
            <div className="glass rounded-2xl p-6 border-white/5 max-w-3xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="h-4 w-4 text-brand-cyan" /> Academic Resources & Documents
              </h3>
              <div className="space-y-3">
                {currentConf.resources.map((res, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/40">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-brand-cyan" />
                      <span className="text-xs font-medium text-slate-300">{res.name}</span>
                    </div>
                    <a
                      href="#download"
                      onClick={(e) => { e.preventDefault(); alert(`Downloading: ${res.name}`); }}
                      className="text-[10px] font-mono font-semibold text-brand-cyan flex items-center gap-1 hover:underline"
                    >
                      Download ({res.size}) <Download className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Lightbox Album Section */}
            <div className="glass rounded-2xl p-6 border-white/5 max-w-4xl">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-brand-emerald" /> Event Photo Gallery
              </h3>
              <p className="text-[10px] text-slate-500 mb-4">Captured snapshots representing sessions and speakers.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative rounded-lg overflow-hidden h-28 border border-white/5 group">
                    <img 
                      src={`https://images.unsplash.com/photo-${num === 1 ? "1540575467063-178a50c2df87" : num === 2 ? "1511578314322-379afb476865" : num === 3 ? "1515187029135-18ee286d815b" : "1531050117352-806137190a2e"}?q=80&w=250&auto=format&fit=crop`} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-[#0B0F19]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[9px] font-mono text-white px-2 py-0.5 bg-slate-950 rounded">Enlarge View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

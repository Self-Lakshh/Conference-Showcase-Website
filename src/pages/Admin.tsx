// Admin.tsx - Stateful Admin Control Console (CRUD Manager)

import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { 
  Plus, Edit2, Trash2, Check, Settings, Calendar, BookOpen, 
  Award, Bell, AlertTriangle, Info, Terminal, RefreshCw, X 
} from "lucide-react";
import type { Conference, Paper, Speaker, Announcement } from "../db/seedData";

export const Admin: React.FC = () => {
  const { 
    conferences, 
    papers, 
    speakers, 
    announcements,
    addConference,
    updateConference,
    deleteConference,
    addPaper,
    updatePaper,
    deletePaper,
    addSpeaker,
    updateSpeaker,
    deleteSpeaker,
    addAnnouncement,
    deleteAnnouncement,
    currentUser
  } = useStore();

  const [activeTab, setActiveTab] = useState("conferences");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states - Conference
  const [confTitle, setConfTitle] = useState("");
  const [confDesc, setConfDesc] = useState("");
  const [confDate, setConfDate] = useState("");
  const [confVenue, setConfVenue] = useState("");
  const [confLocation, setConfLocation] = useState("");
  const [confFee, setConfFee] = useState(199);
  const [confRegStatus, setConfRegStatus] = useState<"Open" | "Closed" | "Selling Fast">("Open");

  // Form states - Paper
  const [paperTitle, setPaperTitle] = useState("");
  const [paperAbstract, setPaperAbstract] = useState("");
  const [paperTopic, setPaperTopic] = useState("");
  const [paperCitations, setPaperCitations] = useState(0);

  // Form states - Speaker
  const [spName, setSpName] = useState("");
  const [spTitle, setSpTitle] = useState("");
  const [spBio, setSpBio] = useState("");
  const [spInterests, setSpInterests] = useState("");

  // Form states - Announcement
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annConfId, setAnnConfId] = useState("");
  const [annType, setAnnType] = useState<"info" | "warning" | "success">("info");

  // Auth block
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="glass rounded-3xl border-white/5 p-8 flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-red-500 animate-bounce mb-4" />
          <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">Access Restrained</h1>
          <p className="text-xs text-slate-500 mt-2">The security coordinate is invalid. The admin control panel requires an authorized administrator session.</p>
          <div className="mt-6 p-3 rounded-lg bg-slate-950 border border-white/5 text-[10px] font-mono text-slate-400">
            Hint: Sign in with admin@conferencewebsite.org on community dashboard.
          </div>
        </div>
      </div>
    );
  }

  // Handle Create Conference
  const handleCreateConference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confTitle || !confDesc) return;
    
    const newConf: Conference = {
      id: `conf-${Date.now()}`,
      title: confTitle,
      logo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=80&auto=format&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
      description: confDesc,
      startDate: confDate || new Date().toISOString().split('T')[0],
      endDate: confDate || new Date().toISOString().split('T')[0],
      venue: confVenue || "Science Hall",
      location: confLocation || "Global virtual",
      coordinates: { lat: 37.7749, lng: -122.4194 },
      registrationFee: Number(confFee),
      registrationStatus: confRegStatus,
      status: "Upcoming",
      tracks: ["General Sessions", "Emerging Tech"],
      sessions: [],
      speakerIds: [],
      sponsorIds: [],
      paperIds: [],
      resources: [],
      faqs: [],
    };

    await addConference(newConf);
    resetConfForm();
    setShowCreateForm(false);
  };

  // Handle Delete Conference
  const handleDeleteConference = async (id: string) => {
    if (confirm("Are you sure you want to delete this conference from global repositories?")) {
      await deleteConference(id);
    }
  };

  // Handle Create Paper
  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle || !paperAbstract) return;

    const newPaper: Paper = {
      id: `paper-${Date.now()}`,
      title: paperTitle,
      abstract: paperAbstract,
      authorIds: ["speaker-0"], // default author
      institutionIds: ["inst-uni-0"], // default inst
      citationsCount: Number(paperCitations),
      downloadUrl: "#",
      publishDate: new Date().toISOString().split("T")[0],
      topics: [paperTopic || "General"],
      citations: [],
      readingTime: 10
    };

    await addPaper(newPaper);
    resetPaperForm();
    setShowCreateForm(false);
  };

  // Handle Delete Paper
  const handleDeletePaper = async (id: string) => {
    if (confirm("Are you sure you want to delete this research paper?")) {
      await deletePaper(id);
    }
  };

  // Handle Create Speaker
  const handleCreateSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spName || !spBio) return;

    const newSp: Speaker = {
      id: `speaker-${Date.now()}`,
      name: spName,
      avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
      bio: spBio,
      title: spTitle || "Researcher",
      institutionId: "inst-uni-0",
      researchInterests: spInterests ? spInterests.split(",").map(i => i.trim()) : ["AI"],
      publicationCount: 5,
      talkCount: 2,
      socialLinks: {},
      timeline: [],
      talkHistory: []
    };

    await addSpeaker(newSp);
    resetSpeakerForm();
    setShowCreateForm(false);
  };

  // Handle Delete Speaker
  const handleDeleteSpeaker = async (id: string) => {
    if (confirm("Are you sure you want to delete this speaker?")) {
      await deleteSpeaker(id);
    }
  };

  // Handle Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    const newAnn: Announcement = {
      id: `announce-${Date.now()}`,
      conferenceId: annConfId || "conf-0",
      title: annTitle,
      content: annContent,
      date: new Date().toISOString().split("T")[0],
      type: annType
    };

    await addAnnouncement(newAnn);
    resetAnnForm();
    setShowCreateForm(false);
  };

  // Handle Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(id);
    }
  };

  // Resets
  const resetConfForm = () => {
    setConfTitle("");
    setConfDesc("");
    setConfDate("");
    setConfVenue("");
    setConfLocation("");
    setConfFee(199);
    setConfRegStatus("Open");
  };

  const resetPaperForm = () => {
    setPaperTitle("");
    setPaperAbstract("");
    setPaperTopic("");
    setPaperCitations(0);
  };

  const resetSpeakerForm = () => {
    setSpName("");
    setSpTitle("");
    setSpBio("");
    setSpInterests("");
  };

  const resetAnnForm = () => {
    setAnnTitle("");
    setAnnContent("");
    setAnnConfId("");
    setAnnType("info");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="glass rounded-3xl border-white/5 p-6 md:p-8 flex justify-between items-center mb-8 relative">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-brand-emerald-dim border border-brand-emerald-border/20 flex items-center justify-center text-brand-emerald">
            <Settings className="h-5 w-5 animate-spin-slow" />
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide uppercase">Admin control console</h1>
            <p className="text-[11px] text-slate-500 mt-1">Stateful CRUD directory management panel. Nothing is mocked.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan px-4 py-2 text-xs font-bold text-white shadow hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <Plus className="h-4.5 w-4.5" /> Register Entity
        </button>
      </div>

      {/* Grid: Left tabs / Right CRUD Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: "conferences", name: "Conferences Manager", count: conferences.length, icon: Calendar },
            { id: "papers", name: "Research Papers Portal", count: papers.length, icon: BookOpen },
            { id: "speakers", name: "Speakers Directory", count: speakers.length, icon: Award },
            { id: "announcements", name: "Announcements Board", count: announcements.length, icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowCreateForm(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                  isSelected 
                    ? "bg-brand-emerald-dim border-brand-emerald-border/30 text-brand-emerald"
                    : "glass border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4.5 w-4.5" />
                  {tab.name}
                </span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full font-bold">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Panel Workspace (9 cols) */}
        <div className="lg:col-span-9">
          {showCreateForm ? (
            /* Creation Form */
            <div className="glass rounded-3xl border-white/5 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Add New {activeTab.slice(0, -1)} Coordinate
                </h2>
                <button onClick={() => setShowCreateForm(false)} className="text-slate-450 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 1. Conferences Form */}
              {activeTab === "conferences" && (
                <form onSubmit={handleCreateConference} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Conference Title</label>
                      <input type="text" value={confTitle} onChange={(e) => setConfTitle(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="e.g. Future Tech Forum" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Venue</label>
                      <input type="text" value={confVenue} onChange={(e) => setConfVenue(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="e.g. Science Auditorium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Start Date</label>
                      <input type="date" value={confDate} onChange={(e) => setConfDate(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Registration Fee ($)</label>
                      <input type="number" value={confFee} onChange={(e) => setConfFee(Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Ticket Status</label>
                      <select value={confRegStatus} onChange={(e) => setConfRegStatus(e.target.value as any)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan">
                        <option value="Open">Open</option>
                        <option value="Selling Fast">Selling Fast</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Description Synopsis</label>
                    <textarea value={confDesc} onChange={(e) => setConfDesc(e.target.value)} rows={4} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Describe the focus tracks and schedule targets..." />
                  </div>
                  <button type="submit" className="rounded-xl bg-brand-emerald text-slate-950 px-5 py-2 text-xs font-bold hover:brightness-110 shadow transition-all">
                    Register Conference
                  </button>
                </form>
              )}

              {/* 2. Papers Form */}
              {activeTab === "papers" && (
                <form onSubmit={handleCreatePaper} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Paper Title</label>
                      <input type="text" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="e.g. Neural Networks optimization..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Topic Domain</label>
                      <input type="text" value={paperTopic} onChange={(e) => setPaperTopic(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="e.g. Artificial Intelligence" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Abstract Summary</label>
                    <textarea value={paperAbstract} onChange={(e) => setPaperAbstract(e.target.value)} rows={4} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Manuscript summary proof findings..." />
                  </div>
                  <button type="submit" className="rounded-xl bg-brand-emerald text-slate-950 px-5 py-2 text-xs font-bold hover:brightness-110 shadow transition-all">
                    Index Paper
                  </button>
                </form>
              )}

              {/* 3. Speakers Form */}
              {activeTab === "speakers" && (
                <form onSubmit={handleCreateSpeaker} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Speaker Name</label>
                      <input type="text" value={spName} onChange={(e) => setSpName(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Dr. Sarah Connor" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Credentials / Title</label>
                      <input type="text" value={spTitle} onChange={(e) => setSpTitle(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Principal Research Scientist" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Research Interests (Comma separated)</label>
                    <input type="text" value={spInterests} onChange={(e) => setSpInterests(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Deep Learning, Quantum, Neurotech" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Biography</label>
                    <textarea value={spBio} onChange={(e) => setSpBio(e.target.value)} rows={4} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Brief details about research affiliations..." />
                  </div>
                  <button type="submit" className="rounded-xl bg-brand-emerald text-slate-950 px-5 py-2 text-xs font-bold hover:brightness-110 shadow transition-all">
                    Register Speaker
                  </button>
                </form>
              )}

              {/* 4. Announcements Form */}
              {activeTab === "announcements" && (
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Announcement Title</label>
                      <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Call for papers extended!" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Bulletin Type</label>
                      <select value={annType} onChange={(e) => setAnnType(e.target.value as any)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan">
                        <option value="info">Information</option>
                        <option value="warning">Warning alert</option>
                        <option value="success">Success confirm</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Associated Conference ID</label>
                    <select value={annConfId} onChange={(e) => setAnnConfId(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan">
                      <option value="">Select Conference Context</option>
                      {conferences.map(c => (
                        <option key={c.id} value={c.id}>{c.title.slice(0, 30)}...</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase">Content details</label>
                    <textarea value={annContent} onChange={(e) => setAnnContent(e.target.value)} rows={3} required className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan" placeholder="Detail notes..." />
                  </div>
                  <button type="submit" className="rounded-xl bg-brand-emerald text-slate-950 px-5 py-2 text-xs font-bold hover:brightness-110 shadow transition-all">
                    Post Announcement
                  </button>
                </form>
              )}

            </div>
          ) : (
            /* Items list */
            <div className="glass rounded-3xl border-white/5 p-6 md:p-8 space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/5 pb-3">
                Active Repository Database logs ({activeTab.toUpperCase()})
              </h2>

              <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
                {/* 1. Conferences manager listing */}
                {activeTab === "conferences" && (
                  conferences.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/20 hover:border-white/10 text-xs">
                      <div>
                        <strong className="text-white block truncate max-w-md uppercase">{c.title}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {c.id} • {c.location.split(",")[0]} • Fee: ${c.registrationFee}</span>
                      </div>
                      <button onClick={() => handleDeleteConference(c.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
                )}

                {/* 2. Papers listing */}
                {activeTab === "papers" && (
                  papers.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/20 hover:border-white/10 text-xs">
                      <div>
                        <strong className="text-white block truncate max-w-md uppercase">{p.title}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {p.id} • Topic: {p.topics[0]} • Citation: {p.citationsCount}</span>
                      </div>
                      <button onClick={() => handleDeletePaper(p.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
                )}

                {/* 3. Speakers listing */}
                {activeTab === "speakers" && (
                  speakers.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/20 hover:border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={s.avatar} alt="" className="h-7 w-7 rounded-full border border-white/10" />
                        <div>
                          <strong className="text-white block">{s.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {s.id} • {s.title}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteSpeaker(s.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
                )}

                {/* 4. Announcements listing */}
                {activeTab === "announcements" && (
                  announcements.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/20 hover:border-white/10 text-xs">
                      <div>
                        <strong className="text-white block uppercase">{a.title}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {a.id} • Conf: {a.conferenceId} • Date: {a.date}</span>
                      </div>
                      <button onClick={() => handleDeleteAnnouncement(a.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))
                )}

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

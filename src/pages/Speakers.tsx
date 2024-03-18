// Speakers.tsx - Speakers Showcase & Professional Academic Directory

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { 
  Award, Globe, Calendar, Mail, FileText, Play, ArrowLeft, Search, 
  MapPin, GraduationCap, Link2, BookOpen, Clock
} from "lucide-react";

export const Speakers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSpeakerId = searchParams.get("id");

  const { 
    speakers, 
    institutions, 
    papers, 
    conferences,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [selectedSpeaker, setSelectedSpeaker] = useState<any | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  // Sync selected speaker with url param
  useEffect(() => {
    if (activeSpeakerId) {
      const sp = speakers.find(s => s.id === activeSpeakerId);
      if (sp) {
        setSelectedSpeaker(sp);
        setVideoOpen(false);
      }
    } else {
      setSelectedSpeaker(speakers[0] || null);
    }
  }, [activeSpeakerId, speakers]);

  // Filter speakers
  const filteredSpeakers = speakers.filter((sp) => {
    const matchesSearch = searchQuery
      ? sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.researchInterests.some(ri => ri.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sp.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  const getInstitution = (instId: string) => {
    return institutions.find(i => i.id === instId);
  };

  const getSpeakerPapers = (spId: string) => {
    return papers.filter(p => p.authorIds.includes(spId));
  };

  const getSpeakerConfs = (spId: string) => {
    return conferences.filter(c => c.speakerIds.includes(spId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">FEATURED ACADEMICS & SPEAKERS</h1>
          <p className="text-xs text-slate-500 mt-2">Discover world-class researchers, keynote experts, and global tech innovators.</p>
        </div>
        <div className="relative w-full md:w-64 pt-2">
          <input
            type="text"
            placeholder="Search speakers or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 py-1.5 pl-3 pr-8 text-xs text-white focus:border-brand-cyan focus:outline-none"
          />
          <Search className="absolute right-2.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* DUAL WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SCROLLING DIRECTORY (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pl-1">Speaker Directory</span>
          <div className="max-h-[650px] overflow-y-auto space-y-3 pr-1">
            {filteredSpeakers.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-10">No speakers found matching search.</p>
            ) : (
              filteredSpeakers.map((sp) => {
                const isActive = selectedSpeaker?.id === sp.id;
                const inst = getInstitution(sp.institutionId);
                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      setSelectedSpeaker(sp);
                      setSearchParams({ id: sp.id });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      isActive 
                        ? "bg-brand-navy-light border-brand-cyan" 
                        : "glass border-white/5 hover:border-brand-violet/30"
                    }`}
                  >
                    <img src={sp.avatar} alt="" className="h-10 w-10 rounded-full object-cover border border-white/10" />
                    <div className="min-w-0">
                      <h3 className="text-xs font-extrabold text-white truncate">{sp.name}</h3>
                      <p className="text-[9px] text-slate-500 truncate leading-tight mt-0.5">{sp.title}</p>
                      {inst && (
                        <span className="text-[8px] font-mono text-brand-cyan truncate block mt-1">{inst.name}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedSpeaker ? (
              <motion.div
                key={selectedSpeaker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-3xl border-white/5 p-6 md:p-8 space-y-8"
              >
                {/* Header Profile details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedSpeaker.avatar} 
                      alt={selectedSpeaker.name} 
                      className="h-16 w-16 rounded-2xl object-cover border border-white/10 shadow-lg"
                    />
                    <div>
                      <h2 className="text-lg md:text-2xl font-extrabold text-white uppercase tracking-wide">
                        {selectedSpeaker.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">
                        {selectedSpeaker.title}
                      </p>
                      {getInstitution(selectedSpeaker.institutionId) && (
                        <a 
                          href={getInstitution(selectedSpeaker.institutionId)?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-brand-cyan hover:underline font-mono mt-1 block"
                        >
                          {getInstitution(selectedSpeaker.institutionId)?.name} • {getInstitution(selectedSpeaker.institutionId)?.location}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <a href={selectedSpeaker.socialLinks.scholar} className="rounded-lg p-2 bg-slate-900 border border-white/5 hover:border-brand-cyan text-slate-350 hover:text-white transition-colors" title="Google Scholar">
                      <BookOpen className="h-4 w-4" />
                    </a>
                    <a href={selectedSpeaker.socialLinks.github} className="rounded-lg p-2 bg-slate-900 border border-white/5 hover:border-brand-cyan text-slate-350 hover:text-white transition-colors" title="GitHub">
                      <Link2 className="h-4 w-4" />
                    </a>
                    <a href={selectedSpeaker.socialLinks.linkedin} className="rounded-lg p-2 bg-slate-900 border border-white/5 hover:border-brand-cyan text-slate-350 hover:text-white transition-colors" title="LinkedIn">
                      <Award className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Biography</h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    {selectedSpeaker.bio}
                  </p>
                </div>

                {/* Grid details: research interests cloud & statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interests Cloud */}
                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Research Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpeaker.researchInterests.map((interest: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-3 py-1 rounded bg-slate-900 border border-white/5 text-slate-400">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Counter metrics */}
                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 flex justify-around items-center">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-550 font-mono block uppercase">Publications</span>
                      <strong className="text-2xl font-extrabold text-brand-cyan font-mono">{selectedSpeaker.publicationCount}</strong>
                    </div>
                    <div className="h-8 w-[1px] bg-white/5" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-550 font-mono block uppercase">Keynotes & Talks</span>
                      <strong className="text-2xl font-extrabold text-brand-violet font-mono">{selectedSpeaker.talkCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Timeline Academic milestones */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-brand-cyan" /> Academic Journey Timeline
                  </h3>
                  <div className="border-l border-white/5 pl-4 ml-2 space-y-4">
                    {selectedSpeaker.timeline.map((t: any, i: number) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-cyan" />
                        <span className="text-[10px] font-mono font-bold text-brand-cyan block">{t.year}</span>
                        <p className="text-xs text-slate-350 font-medium leading-relaxed mt-0.5">{t.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keynote Highlights video preview */}
                {selectedSpeaker.videoUrl && (
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Play className="h-4 w-4 text-red-500" /> Session Keynote Recording
                    </h3>
                    
                    {videoOpen ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/15">
                        <video src={selectedSpeaker.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div 
                        onClick={() => setVideoOpen(true)}
                        className="relative h-44 w-full rounded-xl overflow-hidden border border-white/5 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-brand-cyan/20 group"
                      >
                        <div className="absolute inset-0 network-grid opacity-10" />
                        <div className="h-10 w-10 rounded-full bg-brand-violet-dim border border-brand-violet/20 flex items-center justify-center text-brand-cyan shadow group-hover:scale-105 transition-transform">
                          <Play className="h-4.5 w-4.5 fill-brand-cyan" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 mt-2">Stream keynote: The Future of Neural Nets</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Talk Logs */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Recent Symposia Talks</h3>
                  <div className="space-y-3">
                    {selectedSpeaker.talkHistory.map((talk: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/20 text-xs">
                        <div>
                          <strong className="text-slate-300 font-semibold block">{talk.title}</strong>
                          <span className="text-[10px] text-slate-500">{talk.event}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{talk.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speaker's Published Papers listed */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Indexed Publications</h3>
                  <div className="space-y-2">
                    {getSpeakerPapers(selectedSpeaker.id).map((paper) => (
                      <Link 
                        key={paper.id} 
                        to={`/papers?id=${paper.id}`}
                        className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-slate-950/25 hover:border-brand-cyan/20 transition-all text-xs"
                      >
                        <span className="truncate max-w-lg font-medium text-slate-300 group-hover:text-brand-cyan uppercase">{paper.title}</span>
                        <span className="text-[10px] font-mono text-brand-cyan">Cite: {paper.citationsCount}</span>
                      </Link>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-center py-20 glass rounded-3xl border-white/5">
                <Award className="h-10 w-10 text-slate-650 mx-auto animate-pulse mb-3" />
                <p className="text-sm font-semibold text-slate-550">Select a speaker from directory list to explore their profile.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

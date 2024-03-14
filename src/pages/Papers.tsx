// Papers.tsx - Research Paper Discovery Engine & Citation Network

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import { 
  BookOpen, Search, Compass, Download, Bookmark, BookmarkCheck, 
  ExternalLink, Calendar, Users, Cpu, FileText, ArrowRight, CornerDownRight, Check
} from "lucide-react";
import { SafeLogo } from "../components/SafeLogo";

export const Papers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activePaperId = searchParams.get("id");

  const { 
    papers, 
    speakers, 
    institutions, 
    conferences,
    bookmarks,
    toggleBook,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("citations");
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Sync selected paper with url param
  useEffect(() => {
    if (activePaperId) {
      const p = papers.find(item => item.id === activePaperId);
      if (p) {
        setSelectedPaper(p);
        setIsDownloaded(false);
      }
    } else {
      setSelectedPaper(papers[0] || null);
    }
  }, [activePaperId, papers]);

  // Filters
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = searchQuery
      ? paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTopic = selectedTopic === "all"
      ? true
      : paper.topics.some(t => t.toLowerCase().includes(selectedTopic.toLowerCase()));

    return matchesSearch && matchesTopic;
  });

  // Sort logic
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    if (selectedSort === "citations") return b.citationsCount - a.citationsCount;
    if (selectedSort === "date") return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    return a.title.localeCompare(b.title);
  });

  // Bookmark checker
  const isBookmarked = selectedPaper
    ? bookmarks.some(b => b.type === "paper" && b.itemId === selectedPaper.id)
    : false;

  const handleBookmark = async () => {
    if (!selectedPaper) return;
    await toggleBook("paper", selectedPaper.id);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
    alert(`Downloading manuscript: ${selectedPaper?.title}`);
  };

  const getAuthors = (authorIds: string[]) => {
    return authorIds.map(id => speakers.find(s => s.id === id)).filter(Boolean);
  };

  const getInstitutions = (instIds: string[]) => {
    return instIds.map(id => institutions.find(i => i.id === id)).filter(Boolean);
  };

  // Get recommended papers (same topic, excluding active paper)
  const recommendations = selectedPaper
    ? papers
        .filter(p => p.id !== selectedPaper.id && p.topics.some(t => selectedPaper.topics.includes(t)))
        .slice(0, 3)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">RESEARCH PUBLICATION DISCOVERY</h1>
          <p className="text-xs text-slate-500 mt-2">Map citation vectors, discover co-author institutions, and explore manuscript archives.</p>
        </div>
        <div className="relative w-full md:w-64 pt-2">
          <input
            type="text"
            placeholder="Filter list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 py-1.5 pl-3 pr-8 text-xs text-white focus:border-brand-cyan focus:outline-none"
          />
          <Search className="absolute right-2.5 top-3.5 h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* 1. INTERACTIVE CONSTELLATION GRAPH SECTION */}
      <div className="mb-10">
        <KnowledgeGraph 
          papers={papers} 
          speakers={speakers} 
          onSelectPaper={(paper) => {
            setSelectedPaper(paper);
            setSearchParams({ id: paper.id });
          }} 
        />
      </div>

      {/* 2. DUAL COLUMN LAYOUT: DIRECTORY vs DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LIST DIRECTORY (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass rounded-2xl p-4 border-white/5 flex justify-between items-center gap-3 text-xs font-mono">
            
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-transparent text-slate-350 focus:outline-none focus:text-white"
            >
              <option value="all">All Disciplines</option>
              <option value="Artificial Intelligence">AI & Machine Learning</option>
              <option value="Quantum">Quantum Science</option>
              <option value="Bioinformatics">Bioinformatics</option>
              <option value="Astrophysics">Astrophysics</option>
              <option value="Cryptography">Cryptography</option>
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-slate-350 focus:outline-none focus:text-white"
            >
              <option value="citations">Most Cited</option>
              <option value="date">Publish Date</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>

          {/* Scrolling Publications */}
          <div className="max-h-[600px] overflow-y-auto space-y-3 pr-1">
            {sortedPapers.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-10">No publications indexed.</p>
            ) : (
              sortedPapers.map((paper) => {
                const isActive = selectedPaper?.id === paper.id;
                const authorsList = getAuthors(paper.authorIds);
                return (
                  <div
                    key={paper.id}
                    onClick={() => {
                      setSelectedPaper(paper);
                      setSearchParams({ id: paper.id });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive 
                        ? "bg-brand-navy-light border-brand-cyan" 
                        : "glass border-white/5 hover:border-brand-violet/30"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="text-[8px] font-mono text-brand-cyan bg-brand-cyan/15 px-2 py-0.5 rounded capitalize">
                        {paper.topics[0]}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Citations: {paper.citationsCount}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 uppercase">
                      {paper.title}
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-2 truncate">
                      By: {authorsList.map((a: any) => a.name).join(", ")}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE DETAIL CANVAS (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedPaper ? (
              <motion.div
                key={selectedPaper.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-3xl border-white/5 p-6 md:p-8 space-y-6"
              >
                {/* Meta details header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg bg-brand-violet-dim border border-brand-violet/20 flex items-center justify-center text-brand-purple">
                      <FileText className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <span className="text-[9px] font-mono text-brand-cyan tracking-wider uppercase block">Manuscript vector</span>
                      <span className="text-xs font-mono text-slate-400">INDEXED: {selectedPaper.id.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-lg border transition-colors ${
                        isBookmarked 
                          ? "border-brand-purple bg-brand-purple-dim text-brand-purple" 
                          : "border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="rounded-lg bg-gradient-to-r from-brand-violet to-brand-cyan px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow flex items-center gap-1.5"
                    >
                      {isDownloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Title and author affiliations */}
                <div>
                  <h2 className="text-sm md:text-lg font-extrabold text-white tracking-wide uppercase leading-snug">
                    {selectedPaper.title}
                  </h2>
                  
                  {/* Authors list */}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    {getAuthors(selectedPaper.authorIds).map((author: any) => (
                      <Link 
                        key={author.id} 
                        to={`/speakers?id=${author.id}`}
                        className="flex items-center gap-2 group"
                      >
                        <img src={author.avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-white/10 group-hover:border-brand-cyan" />
                        <div>
                          <span className="font-bold text-slate-200 group-hover:text-brand-cyan block leading-tight">{author.name}</span>
                          <span className="text-[9px] text-slate-500">{author.title.split("of")[0]}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Affiliated institutions */}
                  <div className="mt-4 flex flex-wrap gap-3 items-center text-[10px] text-slate-500">
                    <span className="font-mono">AFFILIATIONS:</span>
                    {getInstitutions(selectedPaper.institutionIds).map((inst: any) => (
                      <a 
                        key={inst.id} 
                        href={inst.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-brand-cyan transition-colors"
                      >
                        <SafeLogo src={inst.logo} name={inst.name} className="h-4.5 w-4.5" />
                        <span>{inst.name} ({inst.location})</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Abstract box */}
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 font-sans">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Abstract Synopsis</h3>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {selectedPaper.abstract}
                  </p>
                </div>

                {/* Network vectors (Cites / Cited By) */}
                <div className="border-t border-white/5 pt-5 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Citation References Network</h3>
                  <div className="space-y-2">
                    {selectedPaper.citations.map((citeId: string) => {
                      const citePaper = papers.find(p => p.id === citeId);
                      if (!citePaper) return null;
                      return (
                        <div 
                          key={citeId}
                          onClick={() => {
                            setSelectedPaper(citePaper);
                            setSearchParams({ id: citeId });
                          }}
                          className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-brand-cyan transition-colors group"
                        >
                          <CornerDownRight className="h-3.5 w-3.5 text-slate-650 group-hover:text-brand-cyan" />
                          <span className="truncate max-w-sm uppercase text-[11px] tracking-wide font-medium">{citePaper.title}</span>
                          <span className="text-[9px] font-mono text-slate-600">({citePaper.publishDate.split("-")[0]})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border-t border-white/5 pt-5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1">
                    <Compass className="h-4 w-4 text-brand-emerald animate-spin-slow" /> Recommended Discoveries
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          setSelectedPaper(rec);
                          setSearchParams({ id: rec.id });
                        }}
                        className="p-3 rounded-lg border border-white/5 bg-slate-950/20 cursor-pointer hover:border-brand-cyan/20 transition-all flex flex-col justify-between"
                      >
                        <h4 className="text-[10px] font-extrabold text-white leading-snug line-clamp-2 uppercase">
                          {rec.title}
                        </h4>
                        <span className="text-[8px] font-mono text-slate-500 mt-2 block">Citations: {rec.citationsCount}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-center py-20 glass rounded-3xl border-white/5 flex flex-col items-center justify-center">
                <BookOpen className="h-10 w-10 text-slate-650 animate-pulse mb-3" />
                <p className="text-sm font-semibold text-slate-550">Select a paper to explore the citation details.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

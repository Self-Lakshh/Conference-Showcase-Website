// Home.tsx — Premium Conference Website Homepage

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import {
  Brain, Cpu, Dna, Globe, Shield, Leaf, Zap, Atom, Compass, Radio,
  ArrowRight, Clock, ChevronRight, Sparkles, Flame,
  BookOpen, Users, CalendarDays, TrendingUp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SafeLogo } from "../components/SafeLogo";

/* ── Animation helpers ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.6, ease: "easeOut" as const, delay },
});

/* ── Icon Map ───────────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  Brain, Cpu, Dna, Globe, Shield, Leaf, Zap, Atom, Compass, Radio,
};

/* ── Section Header ─────────────────────────────────────────── */
const SectionHeader: React.FC<{ tag?: string; title: string; sub?: string; center?: boolean }> = ({
  tag, title, sub, center = false,
}) => (
  <div className={`mb-12 ${center ? "text-center max-w-xl mx-auto" : ""}`}>
    {tag && (
      <span className="chip chip-accent mb-3 inline-flex items-center gap-1.5">
        <Flame className="h-3 w-3" /> {tag}
      </span>
    )}
    <h2 className="heading-section text-2xl md:text-3xl" style={{ color: "var(--c-text)" }}>{title}</h2>
    {sub && <p className="mt-2 text-sm" style={{ color: "var(--c-text-3)" }}>{sub}</p>}
  </div>
);

/* ── Animated Count-Up ──────────────────────────────────────── */
const CountUp: React.FC<{ target: number; duration?: number }> = ({ target, duration = 1.4 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val}</span>;
};

/* ── Canvas Particle Network ────────────────────────────────── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const COLORS = ["#4f6ef7", "#7c5af5", "#06d6a0", "#f59e0b"];
    const COUNT  = 90;

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; };
    let pts: P[] = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      pts = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r:  Math.random() * 2 + 1,
        c:  COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Connect nearby points
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(79,110,247,${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw & move points
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + "bb";
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export const Home: React.FC = () => {
  const { conferences, papers, speakers, institutions, domains, testimonials, newsList } = useStore();
  const navigate    = useNavigate();
  const heroRef     = useRef<HTMLElement>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOp  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const trending   = conferences.slice(0, 3);
  const spotlight  = speakers.slice(0, 4);
  const recentNews = newsList.slice(0, 3);
  const marqueeBatch = [...institutions, ...institutions];

  return (
    <div className="relative pb-20 overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO — Video + Canvas Particle Network
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden"
      >
        {/* ── Looping background video ── */}
        <div className="hero-video-container">
          <video
            autoPlay muted loop playsInline
            aria-hidden="true"
            poster=""
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-network-of-illuminated-points-4894-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-particles-in-slow-motion-9099-large.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
        </div>

        {/* ── Canvas particle network overlay ── */}
        <ParticleCanvas />

        {/* ── Floating decorative orbs ── */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] h-32 w-32 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(79,110,247,0.25) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[25%] right-[10%] h-48 w-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(124,90,245,0.20) 0%, transparent 70%)",
            filter: "blur(28px)",
          }}
        />
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[15%] h-28 w-28 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,214,160,0.18) 0%, transparent 70%)",
            filter: "blur(22px)",
          }}
        />

        {/* ── Floating chip cards ── */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[28%] left-[6%] glass rounded-2xl p-3 hidden lg:flex items-center gap-2.5 pointer-events-none"
          style={{ maxWidth: 190 }}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#7c5af5] flex items-center justify-center shrink-0">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--c-text)" }}>AI Conference 2026</p>
            <p className="text-[10px]" style={{ color: "var(--c-text-3)" }}>San Francisco, CA</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[35%] right-[5%] glass rounded-2xl p-3 hidden lg:flex items-center gap-2.5 pointer-events-none"
          style={{ maxWidth: 190 }}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#4f6ef7] flex items-center justify-center shrink-0">
            <Atom className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--c-text)" }}>Quantum Physics Symposium</p>
            <p className="text-[10px]" style={{ color: "var(--c-text-3)" }}>1,200 attendees</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[28%] right-[8%] glass rounded-2xl p-3 hidden lg:flex items-center gap-2.5 pointer-events-none"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--c-text)" }}>32 New Papers Today</p>
            <p className="text-[10px]" style={{ color: "var(--c-text-3)" }}>↑ 18% vs last week</p>
          </div>
        </motion.div>

        {/* ── Hero content ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOp }}
          className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 chip chip-accent mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#06d6a0" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#06d6a0" }} />
            </span>
            Live · 12,000+ Researchers · 240+ Global Conferences
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="heading-display text-5xl sm:text-7xl md:text-[5.5rem] mb-6 tracking-tight"
          >
            Discover the Frontiers
            <br />
            <span className="relative inline-block">
              <span className="text-gradient-blue">of Global Research</span>
              {/* Underline accent */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full origin-left"
                style={{ background: "linear-gradient(to right, #4f6ef7, #7c5af5, transparent)" }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--c-text-2)" }}
          >
            An interconnected portal linking scientific publications, major tech conferences,
            global research groups, and pioneering speakers — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/conferences" className="btn-primary group">
              Explore Conferences
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/papers" className="btn-secondary">
              Browse Publications
            </Link>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-14 flex justify-center items-center gap-8 flex-wrap"
          >
            {[
              { val: conferences.length, label: "Events" },
              { val: papers.length,      label: "Papers" },
              { val: speakers.length,    label: "Speakers" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-heading font-extrabold text-gradient-blue">
                  <CountUp target={s.val} />+
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--c-text-3)" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 w-[1px]"
              style={{ background: "linear-gradient(to bottom, var(--c-accent), transparent)" }}
            />
            <span className="text-xs" style={{ color: "var(--c-text-3)" }}>Scroll to explore</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. STATISTICS CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 mb-28 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: CalendarDays, value: conferences.length, label: "Global Events",        sub: "Conferences & hackathons",       color: "#4f6ef7" },
            { icon: BookOpen,     value: papers.length,      label: "Research Papers",      sub: "Fully indexed citations",        color: "#7c5af5" },
            { icon: Users,        value: speakers.length,    label: "Expert Speakers",      sub: "World-class researchers",        color: "#06d6a0" },
            { icon: TrendingUp,   value: institutions.length, label: "Partner Institutions", sub: "MIT, Stanford, CERN & beyond",  color: "#f59e0b" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              className="stat-card group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <span className="text-3xl font-heading font-extrabold" style={{ color: stat.color }}>
                <CountUp target={stat.value} />+
              </span>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--c-text)" }}>{stat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--c-text-3)" }}>{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. RESEARCH DOMAINS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <SectionHeader
          tag="Disciplines"
          title="Research Knowledge Nodes"
          sub="Explore the platform by primary research discipline."
          center
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {domains.map((domain: any, i: number) => {
            const Icon = ICON_MAP[domain.icon] ?? Sparkles;
            const active = activeDomain === domain.id;
            return (
              <motion.div
                key={domain.id}
                {...fadeUp(i * 0.06)}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => {
                  setActiveDomain(active ? null : domain.id);
                  navigate(`/conferences?topic=${encodeURIComponent(domain.name)}`);
                }}
                className={`glass-card p-5 cursor-pointer ${active ? "ring-2 ring-[#4f6ef7]" : ""}`}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(79,110,247,0.15), rgba(124,90,245,0.10))",
                    border: "1px solid rgba(79,110,247,0.20)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#4f6ef7" }} />
                </motion.div>
                <h3 className="text-sm font-semibold mb-1 leading-tight" style={{ color: "var(--c-text)" }}>
                  {domain.name}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--c-text-3)" }}>
                  {domain.desc ?? "Frontier research exploration and collaborative publication channels."}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "#4f6ef7" }}>
                  <span>Explore</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. TRENDING CONFERENCES
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <div className="flex justify-between items-start mb-12">
          <SectionHeader
            tag="Trending"
            title="Featured Conferences"
            sub="Pioneering forums occurring across global convention centers."
          />
          <Link to="/conferences"
            className="flex items-center gap-1 text-sm font-medium hover:underline shrink-0 mt-1"
            style={{ color: "#4f6ef7" }}>
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map((conf, idx) => (
            <motion.div
              key={conf.id}
              {...fadeUp(idx * 0.12)}
              className="glass-card overflow-hidden flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={conf.coverImage}
                  alt={conf.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="card-image-overlay absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--c-bg) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
                <span className="tag tag-blue absolute top-3 right-3">{conf.registrationStatus}</span>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs"
                  style={{ color: "rgba(255,255,255,0.85)" }}>
                  <Clock className="h-3.5 w-3.5" style={{ color: "#4f6ef7" }} />
                  {conf.startDate}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-heading font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-[#4f6ef7] transition-colors"
                  style={{ color: "var(--c-text)" }}>
                  {conf.title}
                </h3>
                <p className="text-xs line-clamp-3 leading-relaxed flex-grow" style={{ color: "var(--c-text-3)" }}>
                  {conf.description}
                </p>
                <div className="mt-4 pt-4 flex justify-between items-center text-xs"
                  style={{ borderTop: "1px solid var(--c-border)", color: "var(--c-text-3)" }}>
                  <span>{conf.location}</span>
                  <Link to={`/conferences?id=${conf.id}`}
                    className="font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: "#4f6ef7" }}>
                    Details <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. CALL FOR PAPERS BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden p-8 md:p-14"
          style={{
            background: "linear-gradient(135deg, rgba(79,110,247,0.14) 0%, rgba(124,90,245,0.10) 50%, rgba(6,214,160,0.06) 100%)",
            border: "1px solid rgba(79,110,247,0.22)",
          }}
        >
          {/* Animated background glow */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(79,110,247,0.18) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,214,160,0.12) 0%, transparent 70%)" }}
          />

          <div className="relative max-w-xl">
            <span className="chip chip-accent mb-5 inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Submissions Open
            </span>
            <h2 className="heading-section text-2xl md:text-4xl mb-5" style={{ color: "var(--c-text)" }}>
              Share Your Research<br />with the World
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "var(--c-text-2)" }}>
              Submit papers, slides, and research directly to open conferences. Peer review consensus verifies manuscripts and indexes citations immediately on our global network.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/papers" className="btn-primary">
                Submit Manuscript <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#guidelines" className="btn-secondary">Author Guidelines</a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. SPEAKER SPOTLIGHT
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <div className="flex justify-between items-start mb-12">
          <SectionHeader
            title="Speaker Spotlight"
            sub="World-class coordinators, engineers, and scientists shaping disciplines."
          />
          <Link to="/speakers"
            className="flex items-center gap-1 text-sm font-medium hover:underline shrink-0 mt-1"
            style={{ color: "#4f6ef7" }}>
            All speakers <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {spotlight.map((speaker, idx) => (
            <motion.div
              key={speaker.id}
              {...fadeUp(idx * 0.09)}
              className="glass-card p-5 flex flex-col group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{ border: "2px solid var(--c-border-2)" }}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 bg-[#06d6a0]"
                    style={{ borderColor: "var(--c-surface)" }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate" style={{ color: "var(--c-text)" }}>
                    {speaker.name}
                  </h3>
                  <p className="text-xs truncate" style={{ color: "var(--c-text-3)" }}>{speaker.title}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed line-clamp-3 flex-grow" style={{ color: "var(--c-text-2)" }}>
                {speaker.bio}
              </p>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--c-border)" }}>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {speaker.researchInterests.slice(0, 2).map((interest: string, j: number) => (
                    <span key={j} className="tag">{interest}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs" style={{ color: "var(--c-text-3)" }}>
                  <span>Papers: <strong style={{ color: "#4f6ef7" }}>{speaker.publicationCount}</strong></span>
                  <Link to={`/speakers?id=${speaker.id}`} className="font-semibold hover:underline" style={{ color: "#4f6ef7" }}>
                    Profile →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. INNOVATION TIMELINE
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <SectionHeader
          title="Innovation Milestones"
          sub="Tracing technological evolution from foundational research to the future."
          center
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="timeline-line absolute left-4 top-2 bottom-2 w-[1px]" />
          <div className="pl-12 space-y-10">
            {[
              { year: "2020", title: "Quantum Supremacy Verified",     icon: Cpu,     color: "#4f6ef7",
                desc: "Superconducting quantum computers beat classical benchmarks on Gaussian boson sampling tasks." },
              { year: "2022", title: "AI-Powered Protein Folding",     icon: Brain,   color: "#7c5af5",
                desc: "AI models accurately predict protein shapes for hundreds of millions of genomic variants, unlocking new drug targets." },
              { year: "2024", title: "Hybrid Edge-6G Grid Deployments", icon: Radio,   color: "#06d6a0",
                desc: "First commercial test grids run decentralised consensus routing on sub-millisecond edge IoT configurations." },
              { year: "2026", title: "Quantum Teleportation Networks",  icon: Compass, color: "#f59e0b",
                desc: "Academic consortium maps secure zero-knowledge data channels between European university labs." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.14)} className="relative">
                <div className="absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full flex items-center justify-center"
                  style={{ background: "var(--c-bg)", border: `2px solid ${item.color}` }}>
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="glass-card p-5"
                  style={{ borderLeft: `3px solid ${item.color}` }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: item.color }}>{item.year}</span>
                  <h3 className="text-sm font-heading font-semibold mt-1 flex items-center gap-2"
                    style={{ color: "var(--c-text)" }}>
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    {item.title}
                  </h3>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--c-text-2)" }}>{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. RECENT NEWS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <div className="flex justify-between items-start mb-12">
          <SectionHeader
            title="Latest Dispatches"
            sub="Editorial findings and technological updates from the research front."
          />
          <Link to="/papers" className="flex items-center gap-1 text-sm font-medium hover:underline shrink-0 mt-1"
            style={{ color: "#4f6ef7" }}>
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentNews.map((news, idx) => (
            <motion.div key={news.id} {...fadeUp(idx * 0.10)} className="glass-card overflow-hidden flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img src={news.coverImage} alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="card-image-overlay absolute inset-0"
                  style={{ background: "linear-gradient(to top, var(--c-bg), transparent 60%)" }} />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="tag tag-blue self-start mb-3">{news.tags?.[0]}</span>
                <h3 className="text-sm font-heading font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-[#4f6ef7] transition-colors"
                  style={{ color: "var(--c-text)" }}>
                  {news.title}
                </h3>
                <p className="text-xs leading-relaxed line-clamp-3 flex-grow" style={{ color: "var(--c-text-3)" }}>
                  {news.excerpt}
                </p>
                <div className="mt-4 pt-4 flex justify-between text-xs"
                  style={{ borderTop: "1px solid var(--c-border)", color: "var(--c-text-3)" }}>
                  <span>{news.publishDate}</span>
                  <span>{news.readTime} min read</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-28">
        <SectionHeader
          title="What Researchers Say"
          sub="Voices from scientists, developers, and directors shaping the ecosystem."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, idx) => (
            <motion.div key={t.id} {...fadeUp(idx * 0.10)} className="glass-card p-6 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + j * 0.06, duration: 0.3 }}
                    className="text-[#f59e0b] text-base"
                  >★</motion.span>
                ))}
              </div>
              <p className="text-sm italic leading-relaxed flex-grow" style={{ color: "var(--c-text-2)" }}>
                "{t.comment}"
              </p>
              <div className="mt-5 flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--c-border)" }}>
                <img src={t.avatar} alt={t.user}
                  className="h-9 w-9 rounded-full object-cover"
                  style={{ border: "2px solid var(--c-border-2)" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>{t.user}</p>
                  <p className="text-xs" style={{ color: "var(--c-text-3)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. UNIVERSITY MARQUEE
      ══════════════════════════════════════════════════════ */}
      {institutions.length > 0 && (
        <section className="mb-20 py-10" style={{ borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)" }}>
          <motion.p
            {...fadeUp(0)}
            className="text-center text-xs uppercase tracking-[0.25em] font-semibold mb-8"
            style={{ color: "var(--c-text-3)" }}
          >
            Co-sponsored and backed by world-leading institutions
          </motion.p>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {marqueeBatch.map((inst, i) => (
                <div key={`${inst.id}-${i}`} className="marquee-item">
                  <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all hover:scale-105"
                    style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
                    <SafeLogo src={inst.logo} name={inst.name} className="h-5 w-5 rounded" />
                    <span className="text-sm font-medium whitespace-nowrap" style={{ color: "var(--c-text-2)" }}>
                      {inst.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          11. BOTTOM CTA
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeUp(0)} className="relative">
          {/* Glow behind CTA */}
          <div className="absolute inset-x-0 -top-16 h-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(79,110,247,0.12) 0%, transparent 70%)" }} />
          <h2 className="heading-display text-3xl md:text-4xl mb-4 relative" style={{ color: "var(--c-text)" }}>
            Ready to contribute?
          </h2>
          <p className="text-base mb-8 relative" style={{ color: "var(--c-text-2)" }}>
            Join thousands of researchers, speakers, and innovators advancing global knowledge.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
            <Link to="/community" className="btn-primary group">
              Create Account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/conferences" className="btn-secondary">Browse Events</Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

// Footer.tsx — Modern, clean footer with newsletter subscribe

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, MapPin, Mail, Sparkles, Code2, MessageCircle, Briefcase } from "lucide-react";
import confetti from "canvas-confetti";

export const Footer: React.FC = () => {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.9 }, colors: ["#4f6ef7", "#7c5af5", "#06d6a0"] });
  };

  const navGroups = [
    {
      title: "Explore",
      links: [
        { label: "Conferences",    to: "/conferences" },
        { label: "Publications",   to: "/papers" },
        { label: "Speakers",       to: "/speakers" },
        { label: "Communities",    to: "/communities" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "My Dashboard",   to: "/community" },
        { label: "Admin Console",  to: "/admin" },
        { label: "Developer API",  to: "#" },
        { label: "Open License",   to: "#" },
      ],
    },
  ];

  return (
    <footer className="site-footer pt-16 pb-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,110,247,0.06) 0%, transparent 70%)" }} />
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,90,245,0.05) 0%, transparent 70%)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="Conference Website"
                className="h-9 w-9 rounded-xl object-contain shadow-md"
                style={{ background: "linear-gradient(135deg,#4f6ef7,#7c5af5)", padding: "5px" }}
              />
              <span className="font-heading font-bold text-base" style={{ color: "var(--c-text)" }}>
                Conference Website
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--c-text-3)" }}>
              A global knowledge hub connecting researchers, speakers, and organizations at the frontier of science and technology.
            </p>
            <div className="space-y-2 text-xs" style={{ color: "var(--c-text-3)" }}>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4f6ef7" }} />
                <span>Global Distributed Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#7c5af5" }} />
                <span>contact@conferencewebsite.org</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Code2,          href: "#" },
                { icon: MessageCircle, href: "#" },
                { icon: Briefcase,     href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--c-surface-2)", color: "var(--c-text-2)", border: "1px solid var(--c-border)" }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map(group => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--c-text)" }}>
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:text-[#4f6ef7]"
                      style={{ color: "var(--c-text-3)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--c-text)" }}>
              Stay Updated
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--c-text-3)" }}>
              Weekly digest of top publications, conferences and innovation breakthroughs.
            </p>

            {subscribed ? (
              <div
                className="rounded-xl p-3 text-sm flex items-center gap-2"
                style={{ background: "rgba(6,214,160,0.08)", border: "1px solid rgba(6,214,160,0.25)", color: "#06d6a0" }}
              >
                <Sparkles className="h-4 w-4" />
                <span>You're subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field flex-1 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="btn-primary !px-3 !py-2 rounded-lg"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid var(--c-border)", color: "var(--c-text-3)" }}
        >
          <span>© {new Date().getFullYear()} Conference Website · Open-Source Academic Ecosystem</span>
          <span>Built with Vite · React · Tailwind · Firebase</span>
        </div>
      </div>
    </footer>
  );
};

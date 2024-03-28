// KnowledgeGraph.tsx - Interactive Research Network Constellation Map

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Compass, Award, ExternalLink, Zap } from "lucide-react";
import type { Paper, Speaker } from "../db/seedData";
import { useStore } from "../store/useStore";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  paper: Paper;
}

interface Link {
  source: string;
  target: string;
}

interface KnowledgeGraphProps {
  papers: Paper[];
  speakers: Speaker[];
  onSelectPaper: (paper: Paper) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ papers, speakers, onSelectPaper }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Initialize network elements
  useEffect(() => {
    if (!papers || papers.length === 0) return;

    // Use a subset of papers (e.g., 20 papers) to keep the graph readable and beautiful
    const subset = papers.slice(0, 22);

    const width = containerRef.current?.clientWidth || 800;
    const height = 450;

    // Generate nodes with initial spiral distribution
    const generatedNodes: Node[] = subset.map((paper, idx) => {
      const angle = idx * 0.75;
      const radius = 40 + idx * 10;
      return {
        id: paper.id,
        label: paper.title.slice(0, 25) + "...",
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 8 + (paper.citationsCount % 8),
        paper
      };
    });

    // Generate links based on citations inside the subset
    const generatedLinks: Link[] = [];
    const nodeIds = generatedNodes.map((n) => n.id);
    
    generatedNodes.forEach((node) => {
      node.paper.citations.forEach((citedId) => {
        if (nodeIds.includes(citedId)) {
          generatedLinks.push({
            source: node.id,
            target: citedId
          });
        }
      });
    });

    setNodes(generatedNodes);
    setLinks(generatedLinks);
  }, [papers]);

  // Physic simulation loop
  useEffect(() => {
    if (nodes.length === 0) return;

    let animId: number;
    const width = containerRef.current?.clientWidth || 800;
    const height = 450;

    const tick = () => {
      setNodes((currentNodes) => {
        const next = currentNodes.map((n) => ({ ...n }));
        
        // Simple force layout math
        // 1. Repulsion between all nodes
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = 80;
            
            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.05;
              next[i].vx -= dx * force;
              next[i].vy -= dy * force;
              next[j].vx += dx * force;
              next[j].vy += dy * force;
            }
          }
        }

        // 2. Attraction between connected nodes
        links.forEach((link) => {
          const sourceNode = next.find((n) => n.id === link.source);
          const targetNode = next.find((n) => n.id === link.target);
          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = dist * 0.002;
            
            sourceNode.vx += dx * force;
            sourceNode.vy += dy * force;
            targetNode.vx -= dx * force;
            targetNode.vy -= dy * force;
          }
        });

        // 3. Gravity center pull and velocity friction dampening
        next.forEach((node) => {
          const gravity = 0.01;
          node.vx += (width / 2 - node.x) * gravity;
          node.vy += (height / 2 - node.y) * gravity;

          node.x += node.vx;
          node.y += node.vy;

          // Friction
          node.vx *= 0.85;
          node.vy *= 0.85;

          // Boundary constraints
          node.x = Math.max(20, Math.min(width - 20, node.x));
          node.y = Math.max(20, Math.min(height - 20, node.y));
        });

        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [links, nodes.length]);

  const getConnectedLinks = (nodeId: string) => {
    return links.filter(l => l.source === nodeId || l.target === nodeId);
  };

  const getAuthorNames = (authorIds: string[]) => {
    return authorIds.map(id => speakers.find(s => s.id === id)?.name || "Unknown").join(", ");
  };

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl border border-white/5 bg-[#0A0D18] light:bg-[#FAF9F6] p-4 overflow-hidden select-none">
      
      {/* Background Constellation Lines */}
      <div className="absolute inset-0 network-grid opacity-30 pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-brand-cyan animate-spin-slow" />
            Interactive Publication Citation Network
          </h3>
          <p className="text-[10px] text-slate-550">
            Click nodes to analyze citations, view authors, and explore citation vectors. Dragging is fully simulated.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-cyan" /> Core Paper</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-violet" /> Citations</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="h-[450px] w-full relative">
        <svg className="absolute inset-0 h-full w-full">
          {/* Render Connections */}
          {links.map((link, idx) => {
            const src = nodes.find(n => n.id === link.source);
            const tgt = nodes.find(n => n.id === link.target);
            if (!src || !tgt) return null;

            const isHovered = hoveredNodeId === link.source || hoveredNodeId === link.target;
            const isSelected = selectedNode?.id === link.source || selectedNode?.id === link.target;

            return (
              <line
                key={`link-${idx}`}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={isHovered || isSelected ? "#00E5FF" : "rgba(255, 255, 255, 0.05)"}
                strokeWidth={isHovered || isSelected ? 1.5 : 0.8}
                strokeDasharray={isSelected ? "4,4" : undefined}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNode?.id === node.id;
            const isConnected = hoveredNodeId ? getConnectedLinks(hoveredNodeId).some(l => l.source === node.id || l.target === node.id) : false;

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  setSelectedNode(node);
                  onSelectPaper(node.paper);
                }}
              >
                {/* Node Outer Glow ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 6}
                    fill="none"
                    stroke={isSelected ? "#00E5FF" : "#8A2BE2"}
                    strokeWidth={1}
                    className="animate-pulse"
                  />
                )}
                {/* Core node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={isSelected ? "#00E5FF" : isConnected ? "#8A2BE2" : "rgba(21, 28, 44, 0.95)"}
                  stroke={isSelected ? "#ffffff" : isHovered ? "#00E5FF" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={1.5}
                />
                
                {/* Tiny inner hub dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={3}
                  fill={isSelected ? "#0B0F19" : "#00E5FF"}
                />

                {/* Node text label */}
                {(isHovered || isSelected) && (
                  <text
                    x={node.x}
                    y={node.y - node.radius - 8}
                    textAnchor="middle"
                    fill={theme === "dark" ? "#ffffff" : "#1C1C1E"}
                    fontSize="10"
                    fontFamily="Outfit, sans-serif"
                    fontWeight="600"
                    className="pointer-events-none drop-shadow-md bg-slate-950"
                  >
                    {node.paper.title.slice(0, 18)}...
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Panel Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-80 max-w-full glass rounded-xl p-4 z-20"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="text-[9px] font-mono uppercase bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="h-3 w-3" /> Core Node
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
              {selectedNode.paper.title}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              By: {getAuthorNames(selectedNode.paper.authorIds)}
            </p>
            <p className="text-[10px] text-slate-500 line-clamp-3 mt-2 leading-relaxed">
              {selectedNode.paper.abstract}
            </p>

            <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-3">
              <span className="text-[10px] text-slate-400 font-mono">
                Citations: <strong className="text-brand-cyan">{selectedNode.paper.citationsCount}</strong>
              </span>
              <button
                onClick={() => onSelectPaper(selectedNode.paper)}
                className="text-[10px] font-semibold text-brand-cyan flex items-center gap-1 hover:underline"
              >
                Open Discovery Detail <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

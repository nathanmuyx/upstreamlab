"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { frames } from "@/data/author-studio-frames";
import { cn } from "@/lib/utils";

const project = {
  name: "Dictation",
  client: "Maloney Anderson Legal",
  description:
    "Dictation platform with recording, trimming, and replace-from-cursor workflows. Three variant levels (Mild, Medium, Spicy) controlling UI complexity.",
  status: "In Progress",
  statusColor: "#F59E0B",
  techStack: [
    { name: "React", color: "#61DAFB", category: "Framework", description: "Component-based UI library for building interactive interfaces" },
    { name: "Next.js", color: "#FFFFFF", category: "Framework", description: "React framework with routing, SSR, and API routes" },
    { name: "TypeScript", color: "#3178C6", category: "Language", description: "Typed superset of JavaScript for safer, scalable code" },
    { name: "Tailwind CSS", color: "#06B6D4", category: "Styling", description: "Utility-first CSS framework for rapid UI development" },
    { name: "DM Sans", color: "#94A3B8", category: "Typography", description: "Primary typeface for headings, body text, and UI labels" },
    { name: "JetBrains Mono", color: "#94A3B8", category: "Typography", description: "Monospaced font for code snippets and technical values" },
  ],
};

// Collect unique colors from all frames
const allColors: Record<string, string> = {};
frames.forEach((f) => {
  if (f.specs?.colors) {
    Object.entries(f.specs.colors).forEach(([name, value]) => {
      if (value.startsWith("#") && !allColors[value.split(" ")[0]]) {
        allColors[value.split(" ")[0]] = name;
      }
    });
  }
});

// Design tokens from the root frame
const tokens = frames[0]?.specs?.tokens ?? {};

type Section = "overview" | "pages" | "colors" | "components" | "techstack";

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "pages",
    label: "Pages",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "colors",
    label: "Colors & Tokens",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    id: "components",
    label: "Components",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "techstack",
    label: "Tech Stack",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const componentFrames = frames.filter(
  (f) => f.tags?.some((t) => t === "Component" || t === "System")
);

function UpstreamLogo() {
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={18} height={20}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upO)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upO" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- Content Panels ---

function OverviewPanel() {
  const variants = [
    { name: "Mild", color: "#3B82F6", desc: "Basic recording with simple controls" },
    { name: "Medium", color: "#F59E0B", desc: "Adds trim and replace editing modes" },
    { name: "Spicy", color: "#EF4444", desc: "Full redesign with inline panels and gradients" },
  ];

  return (
    <div>
      <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#31AD52] mb-2.5">
        {project.client}
      </p>
      <h1 className="text-3xl font-extrabold tracking-[-1.5px] text-white mb-2">
        {project.name}
      </h1>
      <p className="text-[14px] text-slate-500 leading-relaxed mb-10 max-w-[600px]">
        {project.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Frames", value: frames.length, sub: "screens & states" },
          { label: "Colors", value: Object.keys(allColors).length, sub: "in the palette" },
          { label: "Technologies", value: project.techStack.length, sub: "in the stack" },
        ].map((stat) => (
          <div key={stat.label} className="relative px-5 py-5 rounded-xl bg-[#11111B] border border-[#1A1A28] overflow-hidden">
            <p className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
            <p className="text-[12px] text-slate-500 mt-1">{stat.label}</p>
            <p className="text-[10px] text-slate-700 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Variant system */}
      <h2 className="text-[11px] font-bold tracking-[2px] uppercase text-slate-600 mb-4">
        Variant System
      </h2>
      <div className="flex flex-col gap-2">
        {variants.map((v) => (
          <div
            key={v.name}
            className="flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#11111B] border border-[#1A1A28]"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${v.color}15` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: v.color }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">{v.name}</p>
              <p className="text-[11px] text-slate-500">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PagesPanel() {
  const roots = frames.filter((f) => !f.parentId);
  const childrenOf = (parentId: string) => frames.filter((f) => f.parentId === parentId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-white mb-1.5">
        Pages & Screens
      </h1>
      <p className="text-[14px] text-slate-500 leading-relaxed mb-8 max-w-[560px]">
        All frames in the design file. Click any frame to open it in the documentation inspector.
      </p>
      <div className="flex flex-col gap-1.5">
        {roots.map((frame) => (
          <FrameRow key={frame.id} frame={frame} childrenOf={childrenOf} depth={0} />
        ))}
      </div>
    </div>
  );
}

function FrameRow({
  frame,
  childrenOf,
  depth,
}: {
  frame: (typeof frames)[0];
  childrenOf: (id: string) => (typeof frames);
  depth: number;
}) {
  const children = childrenOf(frame.id);
  return (
    <>
      <Link
        href={`/projects/author-studio/docs?node-id=${frame.id.replace(":", "-")}`}
        className="no-underline"
      >
        <div
          className="flex items-center gap-4 px-5 py-3 rounded-[10px] bg-[#11111B] border border-[#1A1A28] hover:border-[#2A2A3A] transition-all group"
          style={{ marginLeft: depth * 20 }}
        >
          <span className="text-[10px] font-mono text-slate-600 w-8 shrink-0">{frame.id}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white group-hover:text-[#31AD52] transition-colors">
                {frame.name}
              </span>
              {children.length > 0 && (
                <span className="text-[10px] text-slate-600">
                  {children.length} children
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">{frame.description}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            {frame.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-medium text-slate-600 bg-[#1A1A28] border-0 rounded-full px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </Link>
      {children.map((child) => (
        <FrameRow key={child.id} frame={child} childrenOf={childrenOf} depth={depth + 1} />
      ))}
    </>
  );
}

function ColorsPanel() {
  // Group colors by hue family for a design-system feel
  const colorGroups: { label: string; colors: { hex: string; name: string }[] }[] = [];
  const blues: { hex: string; name: string }[] = [];
  const reds: { hex: string; name: string }[] = [];
  const ambers: { hex: string; name: string }[] = [];
  const neutrals: { hex: string; name: string }[] = [];
  const others: { hex: string; name: string }[] = [];

  Object.entries(allColors).forEach(([hex, name]) => {
    const h = hex.toLowerCase();
    if (h.includes("25") && h.includes("eb") || h.includes("3b82") || h.includes("bfd") || h.includes("eff")) {
      blues.push({ hex, name });
    } else if (h.includes("ef44") || h.includes("fee2")) {
      reds.push({ hex, name });
    } else if (h.includes("f59e") || h.includes("fef3")) {
      ambers.push({ hex, name });
    } else if (["#f7f8fa", "#ffffff", "#fafbfc", "#e4e7ee", "#cbd5e1", "#0f172a", "#475569", "#94a3b8"].includes(h)) {
      neutrals.push({ hex, name });
    } else {
      others.push({ hex, name });
    }
  });

  if (blues.length) colorGroups.push({ label: "Primary — Blue", colors: blues });
  if (reds.length) colorGroups.push({ label: "Danger — Red", colors: reds });
  if (ambers.length) colorGroups.push({ label: "Warning — Amber", colors: ambers });
  if (neutrals.length) colorGroups.push({ label: "Neutrals", colors: neutrals });
  if (others.length) colorGroups.push({ label: "Other", colors: others });

  // Flatten for the "all swatches" grid if no grouping works well
  const allEntries = Object.entries(allColors);

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-white mb-1.5">
        Colors & Branding
      </h1>
      <p className="text-[14px] text-slate-500 leading-relaxed mb-10 max-w-[560px]">
        The design system color palette and CSS custom properties used across all frames and components.
      </p>

      {/* Color palette — large swatches */}
      <div className="mb-12">
        <h2 className="text-[11px] font-bold tracking-[2px] uppercase text-slate-600 mb-5">
          Color Palette
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {allEntries.map(([hex, name]) => (
            <div key={hex} className="group">
              <div
                className="w-full aspect-[4/3] rounded-xl border border-white/[0.06] mb-2.5 transition-transform group-hover:scale-[1.03]"
                style={{ background: hex }}
              />
              <p className="text-[12px] font-medium text-slate-300 leading-tight mb-0.5">{name}</p>
              <p className="text-[11px] font-mono text-slate-600">{hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped color rows — Figma style */}
      <div className="mb-12">
        <h2 className="text-[11px] font-bold tracking-[2px] uppercase text-slate-600 mb-5">
          Color Families
        </h2>
        <div className="flex flex-col gap-6">
          {colorGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[12px] font-semibold text-slate-400 mb-3">{group.label}</p>
              <div className="flex gap-0 rounded-xl overflow-hidden border border-white/[0.06]">
                {group.colors.map(({ hex }) => (
                  <div
                    key={hex}
                    className="flex-1 h-14 relative group/swatch"
                    style={{ background: hex }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover/swatch:opacity-100 transition-opacity"
                      style={{ color: isLightColor(hex) ? "#0F172A" : "#FFFFFF", mixBlendMode: "normal" }}
                    >
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Tokens */}
      <div>
        <h2 className="text-[11px] font-bold tracking-[2px] uppercase text-slate-600 mb-2">
          Design Tokens
        </h2>
        <p className="text-[13px] text-slate-500 mb-5">
          CSS custom properties available for theming and consistency.
        </p>
        <div className="rounded-xl border border-[#1A1A28] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_80px] px-5 py-2.5 bg-[#0D0D18] border-b border-[#1A1A28]">
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-600">Token</span>
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-600">Value</span>
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-600 text-right">Preview</span>
          </div>
          {Object.entries(tokens).map(([token, value], i) => (
            <div
              key={token}
              className={cn(
                "grid grid-cols-[1fr_120px_80px] items-center px-5 py-3 transition-colors hover:bg-[#11111B]",
                i < Object.keys(tokens).length - 1 && "border-b border-[#1A1A28]/60"
              )}
            >
              <span className="text-[12px] font-mono text-slate-300">--{token}</span>
              <span className="text-[12px] font-mono text-slate-500">{value}</span>
              <div className="flex justify-end">
                <div
                  className="w-8 h-8 rounded-lg border border-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
                  style={{ background: value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

function ComponentsPanel() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-white mb-1.5">
        Components
      </h1>
      <p className="text-[14px] text-slate-500 leading-relaxed mb-8 max-w-[560px]">
        Reusable components and design systems extracted from the project frames.
      </p>
      <div className="flex flex-col gap-3">
        {componentFrames.map((frame) => (
          <Card key={frame.id} className="bg-[#11111B] border-[#1A1A28] rounded-[14px] px-6 py-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-[15px] font-bold text-white mb-1">{frame.name}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">{frame.description}</p>
              </div>
              <div className="flex gap-1 shrink-0 ml-4">
                {frame.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] font-medium text-slate-600 bg-[#1A1A28] border-0 rounded-full px-2 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {frame.specs && (
              <div className="mt-3 pt-3 border-t border-[#1A1A28]">
                {frame.specs.spacing && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-600">Spacing</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      {Object.entries(frame.specs.spacing).map(([k, v]) => (
                        <span key={k} className="text-[11px] text-slate-500">
                          <span className="text-slate-400">{k}:</span> <span className="font-mono">{v}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {frame.specs.colors && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[1px] text-slate-600">Colors</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(frame.specs.colors).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-1.5">
                          {value.startsWith("#") && (
                            <div className="w-3 h-3 rounded-sm border border-[#2A2A3A]" style={{ background: value }} />
                          )}
                          <span className="text-[10px] text-slate-500">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function TechStackPanel() {
  const categories = ["Framework", "Language", "Styling", "Typography"];
  const grouped = categories.map((cat) => ({
    label: cat,
    items: project.techStack.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-extrabold tracking-[-0.5px] text-white mb-1.5">
        Tech Stack
      </h1>
      <p className="text-[14px] text-slate-500 leading-relaxed mb-10 max-w-[560px]">
        Technologies, frameworks, and typefaces powering this project.
      </p>

      {/* Grouped cards */}
      <div className="flex flex-col gap-8">
        {grouped.map((group) => (
          <div key={group.label}>
            <h2 className="text-[11px] font-bold tracking-[2px] uppercase text-slate-600 mb-3">
              {group.label}
            </h2>
            <div className="flex flex-col gap-2">
              {group.items.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-[#11111B] border border-[#1A1A28] hover:border-[#2A2A3A] transition-all group"
                >
                  {/* Color dot / icon area */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tech.color}15` }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: tech.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-white mb-0.5">{tech.name}</p>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{tech.description}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium text-slate-600 bg-[#1A1A28] border-0 rounded-full px-2.5 py-0.5 shrink-0"
                  >
                    {tech.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function ProjectOverviewPage() {
  const [active, setActive] = useState<Section>("overview");

  return (
    <div className="h-screen flex flex-col bg-[#0A0A12] font-sans text-slate-200 overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-3.5 border-b border-[#1A1A28] bg-[#0A0A12] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <UpstreamLogo />
            <span className="text-base font-bold tracking-tight text-slate-200">
              upstream<span className="text-[#31AD52]">lab</span>
            </span>
          </Link>
          <div className="w-px h-4 bg-[#1A1A28]" />
          <span className="text-[13px] font-semibold text-white">{project.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className="text-[10px] font-semibold rounded-full border-0"
            style={{
              color: project.statusColor,
              background: `${project.statusColor}15`,
            }}
          >
            {project.status}
          </Badge>
        </div>
      </nav>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] shrink-0 border-r border-[#1A1A28] bg-[#0A0A12] flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A28]">
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#31AD52]">
              {project.name}
            </span>
          </div>

          <div className="flex-1 overflow-auto py-2 px-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 border-none cursor-pointer transition-all text-[12px] mb-0.5",
                  active === section.id
                    ? "bg-[#31AD52]/10 text-[#31AD52] font-semibold"
                    : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-[#1A1A28]/50"
                )}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          {/* External links */}
          <div className="border-t border-[#1A1A28] px-2 py-2">
            <Link
              href="/projects/author-studio/prototype"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-[#31AD52] hover:bg-[#31AD52]/10 transition-all no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Prototype
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-50">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
            <Link
              href="/projects/author-studio/docs"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-[#31AD52] hover:bg-[#31AD52]/10 transition-all no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              Docs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-50">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-[#1A1A28] text-[10px] text-slate-700">
            {project.client}
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[800px] mx-auto px-10 py-12">
            {active === "overview" && <OverviewPanel />}
            {active === "pages" && <PagesPanel />}
            {active === "colors" && <ColorsPanel />}
            {active === "components" && <ComponentsPanel />}
            {active === "techstack" && <TechStackPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

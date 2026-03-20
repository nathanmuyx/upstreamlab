"use client";

import Link from "next/link";

function UpstreamLogo({ size = 18 }: { size?: number }) {
  const h = size * (669.96 / 608.44);
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={size} height={h}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upHub)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upHub" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type ProjectCard = {
  title: string;
  description: string;
  route: string;
  status: "active" | "coming-soon";
  preview: { label: string; stats?: string[]; icon: React.ReactNode };
};

const cards: ProjectCard[] = [
  {
    title: "Old System",
    description: "Interactive documentation of the existing Hospitality Safe app — all 19 modules with iPad mockups, flow maps, and client notes.",
    route: "/projects/hospitality-safe/old-system",
    status: "active",
    preview: {
      label: "Interactive Prototype",
      stats: ["19 modules", "22 screens", "Flow maps", "Liveblocks comments"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#31AD52" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 22h8M12 18v4" />
        </svg>
      ),
    },
  },
  {
    title: "Site Maps / Brainstorm",
    description: "Role-based sitemaps for Staff, Manager, and Admin — three experiences across 19 modules.",
    route: "/projects/hospitality-safe/site-maps",
    status: "active",
    preview: {
      label: "Role Sitemaps",
      stats: ["3 roles", "19 modules", "Staff · Manager · Admin"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#31AD52" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
  },
  {
    title: "Design System",
    description: "Color tokens, typography, spacing, radius, shadows, component library, and UI patterns for the Hospitality Safe redesign.",
    route: "/projects/hospitality-safe/design-system",
    status: "active",
    preview: {
      label: "Tokens & Components",
      stats: ["Colors", "Typography", "Shadows", "Patterns"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
  },
  {
    title: "Staff Prototype",
    description: "Staff iPad experience — timers, temperatures, labels, processes, and checklists. The hands-on kitchen interface.",
    route: "/projects/hospitality-safe/new-design",
    status: "active",
    preview: {
      label: "Interactive Prototype",
      stats: ["Staff Kitchen iPad", "20 screens", "PIN auth flow"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#31AD52" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
  },
  {
    title: "Manager Prototype",
    description: "Mobile-first manager experience — review checklists, monitor temps, manage tasks and complaints on the floor.",
    route: "/projects/hospitality-safe/manager",
    status: "active",
    preview: {
      label: "Interactive Prototype",
      stats: ["Mobile + iPad", "Manager role", "Review & Monitor"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
        </svg>
      ),
    },
  },
  {
    title: "Client's View",
    description: "Shared view for Joseph and the Hospitality Safe team to review progress and leave feedback.",
    route: "/projects/hospitality-safe/client-view",
    status: "coming-soon",
    preview: {
      label: "Review",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  },
];

export default function HospitalitySafeHub() {
  return (
    <div className="min-h-screen bg-[#0A0A12] font-sans text-slate-200">
      {/* Nav bar */}
      <nav className="flex items-center gap-4 px-6 py-3 border-b border-[#1A1A28]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1A1A28] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <UpstreamLogo size={14} />
          <span className="text-[12px] font-bold tracking-tight">
            upstream<span className="text-[#31AD52]">lab</span>
          </span>
        </Link>
        <span className="text-[11px] text-slate-600">/</span>
        <span className="text-[13px] font-semibold text-slate-200">Hospitality Safe</span>
      </nav>

      {/* Header */}
      <div className="px-6 pt-8 pb-6 max-w-[960px] mx-auto">
        <div className="flex items-start gap-4 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#2D2F7B" }}>
            <span className="text-white text-[12px] font-bold">HS</span>
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-slate-100">Hospitality Safe</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Food safety management platform for hospitality businesses. Temperature monitoring, timers, checklists, audits, and compliance.</p>
            <p className="text-[11px] text-slate-600 mt-1.5">Client: <span className="text-slate-400">Joseph — Hospitality Safe</span></p>
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="px-6 pb-12 max-w-[960px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const isActive = card.status === "active";
            const inner = (
              <div
                className={`rounded-md border overflow-hidden transition-all ${
                  isActive
                    ? "border-[#1A1A28] bg-[#11111B] hover:border-[#31AD52]/40 hover:bg-[#11111B]/80 cursor-pointer"
                    : "border-[#1A1A28]/60 bg-[#11111B]/50 opacity-50 cursor-default"
                }`}
              >
                {/* Preview */}
                <div className="aspect-[16/10] bg-[#0D0D18] flex flex-col items-center justify-center gap-2.5 px-5">
                  {card.preview.icon}
                  <span className={`text-[10px] font-medium ${isActive ? "text-slate-400" : "text-slate-600"}`}>
                    {card.preview.label}
                  </span>
                  {card.preview.stats && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {card.preview.stats.map((stat) => (
                        <span key={stat} className="text-[9px] text-slate-600 px-1.5 py-0.5 rounded bg-[#1A1A28]/80">
                          {stat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[14px] font-semibold text-slate-200">{card.title}</h3>
                    <span
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                        isActive
                          ? "text-[#31AD52] bg-[#31AD52]/10 border border-[#31AD52]/20"
                          : "text-slate-600 bg-[#1A1A28] border border-[#1A1A28]"
                      }`}
                    >
                      {isActive ? "Active" : "Coming Soon"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            );

            if (isActive) {
              return (
                <Link key={card.title} href={card.route} className="block">
                  {inner}
                </Link>
              );
            }
            return <div key={card.title}>{inner}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

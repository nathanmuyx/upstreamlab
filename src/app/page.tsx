"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    slug: "author-studio",
    title: "Dictation",
    client: "Maloney Anderson Legal",
    description: "Dictation platform with recording, trimming, and replace-from-cursor workflows.",
    variants: ["Mild", "Medium", "Spicy"],
    status: "In Progress",
    statusColor: "#F59E0B",
    tags: ["Web App", "Audio", "React"],
    frameCount: 8,
  },
  {
    slug: "hospitality-safe",
    title: "Hospitality Safe",
    client: "Hospitality Safe",
    description: "Food safety management platform for hospitality businesses. Temperature monitoring, timers, checklists, audits, and compliance.",
    variants: [],
    status: "Documentation",
    statusColor: "#2E75B6",
    tags: ["Web App", "Food Safety", "React"],
    frameCount: 14,
  },
];

function UpstreamLogo() {
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={22} height={25}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upHome)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upHome" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0A0A12] font-sans text-slate-200">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-3.5 border-b border-[#1A1A28] sticky top-0 bg-[#0A0A12]/92 backdrop-blur-[16px] z-10">
        <div className="flex items-center gap-2.5">
          <UpstreamLogo />
          <span className="text-base font-bold tracking-tight">
            upstream<span className="text-[#31AD52]">lab</span>
          </span>
        </div>
        <span className="text-[11px] text-ma-text-sec font-medium">
          Developer Handoff
        </span>
      </nav>

      {/* Header */}
      <div className="max-w-[960px] mx-auto px-8 pt-14">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#31AD52] mb-2.5">
          Projects
        </p>
        <h1 className="text-4xl font-extrabold tracking-[-1.5px] text-white mb-2">
          All Projects
        </h1>
        <p className="text-[15px] text-slate-500 mb-12 leading-relaxed">
          Interactive prototypes with mild, medium, and spicy variant options. Select a project to explore.
        </p>

        {/* Project cards */}
        <div className="flex flex-col gap-4 pb-16">
          {projects.map((project) => (
            <div
              key={project.slug}
              onClick={() => router.push(`/projects/${project.slug}`)}
              className="cursor-pointer"
            >
              <Card className="bg-[#11111B] border-[#1A1A28] rounded-[14px] px-8 py-7 flex items-center justify-between gap-6 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-[rgba(49,173,82,0.3)] hover:shadow-[0_4px_24px_rgba(49,173,82,0.06)]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h2 className="text-lg font-bold text-white tracking-tight">{project.title}</h2>
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
                  <p className="text-xs text-slate-500 mb-1">{project.client}</p>
                  <p className="text-[13px] text-slate-400 mb-3.5 leading-relaxed">{project.description}</p>
                  <div className="flex gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[11px] font-semibold text-slate-500 bg-[#1A1A28] border-0 rounded-full px-2.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right side: actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    {project.variants.map((v) => {
                      const colors: Record<string, string> = { Mild: "#3B82F6", Medium: "#F59E0B", Spicy: "#EF4444" };
                      return (
                        <Badge
                          key={v}
                          className="text-[10px] font-semibold rounded-full border-0"
                          style={{
                            color: colors[v],
                            background: `${colors[v]}15`,
                          }}
                        >
                          {v}
                        </Badge>
                      );
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.slug}${project.slug === "author-studio" ? "/docs" : ""}`);
                    }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#31AD52]/10 text-[#31AD52] hover:bg-[#31AD52]/20 border-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {project.frameCount} {project.variants.length > 0 ? "Frames" : "Screens"}
                  </button>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </Card>
            </div>
          ))}

          {/* Empty state */}
          <div className="border border-dashed border-[#1E1E2A] rounded-[14px] px-8 py-10 flex items-center justify-center flex-col gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2A2A3A" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="text-[13px] text-[#2A2A3A] font-medium">
              More projects coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Upstream Logo ─── */
function UpstreamLogo({ size = 14 }: { size?: number }) {
  const h = size * (669.96 / 608.44);
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={size} height={h}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upSM)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upSM" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Types ─── */
type SiteNode = {
  label: string;
  info?: string;
  tag?: { text: string; type: "do" | "view" | "review" | "setup" };
  highlight?: string;
  children?: SiteNode[];
};

type RoleSection = {
  role: "staff" | "manager" | "admin";
  title: string;
  description: string;
  categories?: { label: string; columns: SiteNode[] }[];
  inherits?: string[];
  cannot?: string[];
  questions?: string;
  prototypeUrl?: string;
};

/* ─── Color config ─── */
const roleColors = {
  staff: { accent: "#059669", bg: "#ecfdf5", light: "#d1fae5", text: "#065f46" },
  manager: { accent: "#7c3aed", bg: "#f5f3ff", light: "#ede9fe", text: "#4c1d95" },
  admin: { accent: "#475569", bg: "#f1f5f9", light: "#e2e8f0", text: "#1e293b" },
};

const tagStyles = {
  do: { bg: "#dcfce7", color: "#166534" },
  view: { bg: "#e0e7ff", color: "#3730a3" },
  review: { bg: "#f3e8ff", color: "#6b21a8" },
  setup: { bg: "#f1f5f9", color: "#334155" },
};

/* ─── Data ─── */
const sections: RoleSection[] = [
  {
    role: "staff",
    title: "Staff",
    description: "A general staff member who uploads data — kitchen hands, bar workers, floor staff. They do the work.",
    prototypeUrl: "/projects/hospitality-safe/new-design",
    categories: [
      {
        label: "They record things",
        columns: [
          {
            label: "Labels", tag: { text: "do", type: "do" }, highlight: "#ecfdf5",
            children: [
              { label: "Sub-types", info: "Prep / Opened / Defrost / Freeze / Custom" },
              { label: "PIN" },
              { label: "Print" },
            ],
          },
          {
            label: "Timers", tag: { text: "do", type: "do" }, highlight: "#eff6ff",
            children: [
              { label: "Pick food timer" },
              { label: "Print label or skip" },
              { label: "PIN" },
              { label: "Start" },
              { label: "Pause / Resume / Restart / Finish" },
            ],
          },
          {
            label: "Temperatures", tag: { text: "do", type: "do" }, highlight: "#f3e8ff",
            children: [
              { label: "Pick unit" },
              { label: "Bluetooth / Manual" },
              { label: "PIN" },
              { label: "Save" },
              { label: "Corrective action" },
            ],
          },
          {
            label: "Processes", tag: { text: "do", type: "do" }, highlight: "#fef2f2",
            children: [
              { label: "Cook / Reheat / Cool" },
              { label: "Pick food" },
              { label: "Take temp" },
              { label: "PIN" },
              { label: "Save" },
            ],
          },
          {
            label: "Checklists", tag: { text: "do", type: "do" }, highlight: "#fff7ed",
            children: [
              { label: "See my assigned" },
              { label: "Complete items" },
              { label: "Add comment" },
              { label: "PIN" },
              { label: "Submit" },
            ],
          },
        ],
      },
    ],
    cannot: [
      "Delete any record",
      "Delete checklist tasks",
      "Edit saved records",
      "Log deliveries",
      "Manage tasks",
      "See Foods setup",
      "See Settings",
      "See Users",
      "See Devices / Units / Areas",
    ],
  },
  {
    role: "manager",
    title: "Manager",
    description: "Can view all data and edit where needed.",
    inherits: ["+ Can do everything Staff can do"],
    categories: [
      {
        label: "They review and sign off",
        columns: [
          {
            label: "Checklists", tag: { text: "review", type: "review" },
            children: [
              { label: "See all" },
              { label: "Review submitted" },
              { label: "Sign off" },
              { label: "\u201CReviewed\u201D" },
            ],
          },
          {
            label: "Tasks", tag: { text: "do", type: "do" },
            children: [
              { label: "Create" },
              { label: "Assign" },
              { label: "Set severity" },
              { label: "Review completed" },
              { label: "See linked tasks" },
            ],
          },
          {
            label: "Complaints", tag: { text: "do", type: "do" },
            children: [
              { label: "Log complaint" },
              { label: "Create follow-up task" },
              { label: "Track resolution" },
            ],
          },
          {
            label: "Pest Control", tag: { text: "do", type: "do" },
            children: [
              { label: "Log inspection" },
              { label: "Generate task" },
            ],
          },
        ],
      },
      {
        label: "They monitor",
        columns: [
          {
            label: "Temperatures", tag: { text: "view", type: "view" },
            children: [
              { label: "See all + status" },
              { label: "Calendar view" },
              { label: "Review corrective actions" },
              { label: "Alerts panel" },
            ],
          },
          {
            label: "Deliveries", tag: { text: "view", type: "view" },
            children: [
              { label: "See all records" },
              { label: "Edit records", info: "With traceability" },
              { label: "Add comments" },
              { label: "Receive task alerts" },
            ],
          },
          {
            label: "Processes", tag: { text: "view", type: "view" },
            children: [
              { label: "See all records" },
              { label: "Review failed + actions" },
            ],
          },
          {
            label: "Companies", tag: { text: "view", type: "view" },
            children: [
              { label: "Look up contacts" },
              { label: "View certificates" },
            ],
          },
        ],
      },
    ],
    cannot: [
      "Set up food items",
      "Manage users or PINs",
      "Configure devices or units",
      "Change settings",
      "Set up areas",
      "Manage calibration",
    ],
  },
  {
    role: "admin",
    title: "Admin",
    description: "Two separate applications — admin back end and staff platform. Admin configures everything.",
    inherits: [
      "+ Can do everything Manager can do",
      "+ Can do everything Staff can do",
    ],
    categories: [
      {
        label: "They set up the system",
        columns: [
          {
            label: "Foods", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Create categories" },
              { label: "Add food items" },
              { label: "Edit" },
              { label: "Delist / Relist / Delete" },
            ],
          },
          {
            label: "Users", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Create" },
              { label: "Assign roles" },
              { label: "Manage PINs" },
            ],
          },
          {
            label: "Settings", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Company / location" },
              { label: "Role config" },
              { label: "Timer presets" },
              { label: "Data logger freq" },
              { label: "Notifications" },
              { label: "Logo / branding" },
            ],
          },
          {
            label: "Areas", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Create zones" },
              { label: "Link to temp units" },
            ],
          },
          {
            label: "Devices", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Add hardware" },
              { label: "Active / Inactive" },
              { label: "Assign to units" },
            ],
          },
          {
            label: "Units", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Add fridges / freezers" },
              { label: "Set temp thresholds" },
              { label: "Link devices + areas" },
            ],
          },
          {
            label: "Companies", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Add contacts" },
              { label: "Store certificates" },
            ],
          },
          {
            label: "Calibration", tag: { text: "setup", type: "setup" },
            children: [
              { label: "Track records" },
              { label: "Set reminders" },
              { label: "Log corrective action" },
            ],
          },
          {
            label: "Onboarding", tag: { text: "setup", type: "setup" },
            children: [
              { label: "7-step registration" },
              { label: "Duplicate site setup" },
            ],
          },
        ],
      },
      {
        label: "They oversee",
        columns: [
          {
            label: "All Locations", tag: { text: "view", type: "view" },
            children: [
              { label: "Traffic light per site" },
              { label: "All compliance data" },
            ],
          },
        ],
      },
    ],
  },
];

/* ─── Tag badge ─── */
function Tag({ text, type }: { text: string; type: "do" | "view" | "review" | "setup" }) {
  const s = tagStyles[type];
  return (
    <span
      className="inline-block text-[8px] font-bold px-1.5 py-[1px] rounded ml-1.5 align-middle"
      style={{ background: s.bg, color: s.color }}
    >
      {text}
    </span>
  );
}

/* ─── Node card ─── */
function NodeBox({ node, isPage, accentColor }: { node: SiteNode; isPage?: boolean; accentColor: string }) {
  return (
    <div
      className="bg-white text-center px-2.5 py-1.5 rounded-[7px]"
      style={{
        border: isPage ? `2px solid ${accentColor}` : "1.5px solid #e0e0e0",
        boxShadow: "1px 1px 0 rgba(0,0,0,0.04)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span
        className="text-[#1a1a1a]"
        style={{
          fontSize: isPage ? 16 : 12,
          fontWeight: isPage ? 600 : 500,
          fontFamily: isPage ? "'Caveat', cursive" : "'DM Sans', sans-serif",
        }}
      >
        {node.label}
      </span>
      {node.tag && <Tag text={node.tag.text} type={node.tag.type} />}
      {node.info && (
        <span className="block text-[10px] text-[#999] mt-0.5 leading-tight max-w-[130px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {node.info}
        </span>
      )}
    </div>
  );
}

/* ─── Vertical connector ─── */
function Connector({ height = 12, color = "#ccc" }: { height?: number; color?: string }) {
  return <div className="mx-auto" style={{ width: 1.5, height, background: color }} />;
}

/* ─── Column of nodes (page + children) ─── */
function NodeColumn({ node, accentColor }: { node: SiteNode; accentColor: string }) {
  return (
    <div className="flex flex-col items-center px-[5px]" style={{ minWidth: 80 }}>
      <Connector height={16} />
      <NodeBox node={node} isPage accentColor={accentColor} />
      {node.children?.map((child, i) => (
        <div key={i} className="flex flex-col items-center">
          <Connector />
          <NodeBox node={child} accentColor={accentColor} />
        </div>
      ))}
    </div>
  );
}

/* ─── Section component ─── */
function RoleSectionCard({ section }: { section: RoleSection }) {
  const colors = roleColors[section.role];

  return (
    <div className="overflow-hidden">
      {/* Section header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1A1A28] rounded-t-2xl border border-[#2A2A3A] border-b-0">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: colors.accent }}
          >
            {section.title[0]}
          </div>
          <span className="text-[14px] font-semibold text-slate-200">{section.title}</span>
          <span className="text-[11px] text-slate-500">—</span>
          <span className="text-[11px] text-slate-500 max-w-[400px] truncate">{section.description}</span>
        </div>
        {section.prototypeUrl ? (
          <Link
            href={section.prototypeUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#2A2A3A] text-slate-300 hover:text-white hover:bg-[#31AD52]/20 hover:border-[#31AD52]/40 border border-[#333] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8M12 18v4" /></svg>
            View Prototype
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium text-slate-600 bg-[#222] border border-[#333]">
            Prototype Coming Soon
          </span>
        )}
      </div>

      {/* Sitemap canvas — warm light bg */}
      <div className="bg-[#f9f9f7] rounded-b-2xl border border-[#e8e8e4] border-t-0 py-10 px-4 overflow-x-auto">
        <div className="flex flex-col items-center">

          {/* Role title badge */}
          <div
            className="text-center px-7 py-2.5 rounded-[10px] shadow-[3px_3px_0_rgba(0,0,0,0.12)]"
            style={{ background: colors.bg, border: `2.5px solid ${colors.accent}`, color: colors.text, fontFamily: "'Caveat', cursive" }}
          >
            <span className="text-[26px] font-semibold">{section.title}</span>
          </div>

          {/* Description */}
          <Connector height={20} />
          <p className="text-[12px] text-[#999] text-center max-w-[500px] leading-relaxed mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            &quot;{section.description}&quot;
          </p>

          {/* Inherits */}
          {section.inherits && (
            <div className="flex flex-wrap items-center justify-center gap-2 my-4">
              {section.inherits.map((text, i) => {
                const isStaff = text.includes("Staff");
                const c = isStaff ? roleColors.staff : roleColors.manager;
                return (
                  <div
                    key={i}
                    className="text-[11px] px-4 py-1.5 rounded-lg"
                    style={{ background: c.bg, border: `1px solid ${c.light}`, color: c.text }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          )}

          {/* Categories */}
          {section.categories?.map((cat, ci) => (
            <div key={ci} className="w-full mb-6">
              {/* Category label — handwritten italic */}
              <Connector height={24} />
              <div className="text-center mb-2">
                <span className="text-[15px] italic text-[#999]" style={{ fontFamily: "'Caveat', cursive" }}>{cat.label}</span>
              </div>

              {/* Horizontal connector bar */}
              <div
                className="h-[1.5px] rounded-full mx-auto"
                style={{
                  background: "#ccc",
                  width: `${Math.max(cat.columns.length * 140, 200)}px`,
                  maxWidth: "100%",
                }}
              />

              {/* Column nodes */}
              <div className="flex justify-center gap-1 flex-nowrap">
                {cat.columns.map((col, i) => (
                  <NodeColumn key={i} node={col} accentColor={colors.accent} />
                ))}
              </div>
            </div>
          ))}

          {/* Cannot items */}
          {section.cannot && section.cannot.length > 0 && (
            <div className="w-full mt-4">
              <div className="text-center mb-3">
                <span className="text-[15px] italic text-[#999]" style={{ fontFamily: "'Caveat', cursive" }}>They cannot</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {section.cannot.map((item, i) => (
                  <div
                    key={i}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg border-dashed border border-red-300 bg-red-50 text-red-700 opacity-70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {section.questions && (
            <div className="w-full mt-6">
              <div
                className="text-[11px] px-5 py-3 rounded-xl border-dashed border-[1.5px] border-amber-300 bg-[#fffbeb] text-amber-700 max-w-[600px] mx-auto leading-relaxed text-center"
              >
                {section.questions}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function SiteMapsPage() {
  const [activeRole, setActiveRole] = useState<"all" | "staff" | "manager" | "admin">("all");

  const filtered = activeRole === "all" ? sections : sections.filter((s) => s.role === activeRole);

  return (
    <div className="min-h-screen bg-[#0A0A12] font-sans text-slate-200">
      {/* Nav bar */}
      <nav className="flex items-center gap-4 px-6 py-3 border-b border-[#1A1A28]">
        <Link
          href="/projects/hospitality-safe"
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
        <Link href="/projects/hospitality-safe" className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors">
          Hospitality Safe
        </Link>
        <span className="text-[11px] text-slate-600">/</span>
        <span className="text-[13px] font-semibold text-slate-200">Who Does What?</span>
      </nav>

      {/* Header */}
      <div className="px-6 pt-8 pb-2 max-w-[1200px] mx-auto">
        <h1 className="text-[36px] font-semibold text-slate-100" style={{ fontFamily: "'Caveat', cursive" }}>Who does what?</h1>
        <p className="text-[13px] text-slate-500 max-w-[660px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Each role&apos;s actions — only what&apos;s confirmed from our FigJam review and the March 17 meeting.
        </p>
      </div>

      {/* Legend + filter */}
      <div className="px-6 py-4 max-w-[1200px] mx-auto flex flex-wrap items-center gap-3">
        {(["all", "staff", "manager", "admin"] as const).map((role) => {
          const isActive = activeRole === role;
          const clrs = role === "all" ? null : roleColors[role];
          return (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                isActive
                  ? "border-slate-600 bg-[#1A1A28] text-slate-200"
                  : "border-[#1A1A28] text-slate-500 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {clrs && (
                <span className="w-3 h-3 rounded" style={{ background: clrs.bg, border: `1.5px solid ${clrs.accent}` }} />
              )}
              {role === "all" ? "All Roles" : role === "staff" ? "Staff" : role === "manager" ? "Manager" : "Admin"}
            </button>
          );
        })}

        <span className="ml-2 text-[10px] text-slate-600">|</span>

        <div className="flex items-center gap-3 ml-1">
          {([
            { type: "do" as const, label: "Hands-on work" },
            { type: "view" as const, label: "View / monitor" },
            { type: "review" as const, label: "Review / approve" },
            { type: "setup" as const, label: "Configure" },
          ]).map(({ type, label }) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block text-[8px] font-bold px-1.5 py-[1px] rounded"
                style={{ background: tagStyles[type].bg, color: tagStyles[type].color }}
              >
                {type}
              </span>
              <span className="text-[10px] text-slate-600">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="inline-block text-[8px] font-bold px-1.5 py-[1px] rounded border border-dashed border-red-300 bg-red-50 text-red-700">
              nope
            </span>
            <span className="text-[10px] text-slate-600">Cannot do</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block text-[8px] font-bold px-1.5 py-[1px] rounded border border-dashed border-amber-300 bg-amber-50 text-amber-700">
              ?
            </span>
            <span className="text-[10px] text-slate-600">Question</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 pb-16 max-w-[1200px] mx-auto space-y-8">
        {filtered.map((section) => (
          <RoleSectionCard key={section.role} section={section} />
        ))}
      </div>
    </div>
  );
}

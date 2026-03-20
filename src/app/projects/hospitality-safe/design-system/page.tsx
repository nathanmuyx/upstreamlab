"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  Warning,
  Thermometer,
  Truck,
  ListChecks,
  ClipboardText,
  Bell,
  CaretRight,
  House,
  ChartBar,
  Camera,
  MagnifyingGlass,
  DotsThreeVertical,
} from "@phosphor-icons/react";



/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════ */

type ColorScale = {
  name: string;
  description: string;
  steps: { step: string; hex: string; wcag: string }[];
};

const colorScales: ColorScale[] = [
  {
    name: "Gray",
    description: "Neutral color and the foundation of the color system. Used for text, form fields, backgrounds, dividers, and borders.",
    steps: [
      { step: "25", hex: "#FCFCFD", wcag: "1.03" },
      { step: "50", hex: "#F9FAFB", wcag: "1.07" },
      { step: "100", hex: "#F3F4F6", wcag: "1.17" },
      { step: "200", hex: "#E5E7EB", wcag: "1.40" },
      { step: "300", hex: "#D1D5DB", wcag: "1.72" },
      { step: "400", hex: "#9CA3AF", wcag: "2.96" },
      { step: "500", hex: "#6B7280", wcag: "4.64" },
      { step: "600", hex: "#4B5563", wcag: "7.14" },
      { step: "700", hex: "#374151", wcag: "9.68" },
      { step: "800", hex: "#1F2937", wcag: "14.19" },
      { step: "900", hex: "#111827", wcag: "16.88" },
      { step: "950", hex: "#030712", wcag: "19.87" },
    ],
  },
  {
    name: "Brand",
    description: "The Hospitality Safe brand blue. Used across all interactive elements — buttons, links, inputs, and active states. 600 is the primary.",
    steps: [
      { step: "25", hex: "#F5F9FE", wcag: "1.03" },
      { step: "50", hex: "#EBF4FC", wcag: "1.09" },
      { step: "100", hex: "#D6E8F9", wcag: "1.24" },
      { step: "200", hex: "#ADCFF2", wcag: "1.55" },
      { step: "300", hex: "#7EB2E8", wcag: "2.10" },
      { step: "400", hex: "#5196DD", wcag: "3.00" },
      { step: "500", hex: "#3580CC", wcag: "3.98" },
      { step: "600", hex: "#2E75B6", wcag: "4.62" },
      { step: "700", hex: "#255E94", wcag: "5.98" },
      { step: "800", hex: "#1D4873", wcag: "7.80" },
      { step: "900", hex: "#153252", wcag: "10.62" },
      { step: "950", hex: "#0C1E32", wcag: "15.18" },
    ],
  },
  {
    name: "Error",
    description: "Used across error states and in destructive actions. Alerts, out-of-range temperatures, rejected deliveries, critical tasks.",
    steps: [
      { step: "25", hex: "#FFFBFA", wcag: "1.02" },
      { step: "50", hex: "#FEF2F2", wcag: "1.07" },
      { step: "100", hex: "#FEE2E2", wcag: "1.19" },
      { step: "200", hex: "#FECACA", wcag: "1.39" },
      { step: "300", hex: "#FCA5A5", wcag: "1.88" },
      { step: "400", hex: "#F87171", wcag: "2.78" },
      { step: "500", hex: "#EF4444", wcag: "3.86" },
      { step: "600", hex: "#DC2626", wcag: "4.83" },
      { step: "700", hex: "#B91C1C", wcag: "6.57" },
      { step: "800", hex: "#991B1B", wcag: "8.06" },
      { step: "900", hex: "#7F1D1D", wcag: "9.84" },
      { step: "950", hex: "#450A0A", wcag: "15.48" },
    ],
  },
  {
    name: "Warning",
    description: "Communicates that an action is potentially in-progress or needs attention. Partial deliveries, flagged checklists, caution states.",
    steps: [
      { step: "25", hex: "#FFFCF5", wcag: "1.01" },
      { step: "50", hex: "#FFFBEB", wcag: "1.04" },
      { step: "100", hex: "#FEF3C7", wcag: "1.14" },
      { step: "200", hex: "#FDE68A", wcag: "1.33" },
      { step: "300", hex: "#FCD34D", wcag: "1.50" },
      { step: "400", hex: "#FBBF24", wcag: "1.74" },
      { step: "500", hex: "#F59E0B", wcag: "2.18" },
      { step: "600", hex: "#D97706", wcag: "3.03" },
      { step: "700", hex: "#B45309", wcag: "4.35" },
      { step: "800", hex: "#92400E", wcag: "5.88" },
      { step: "900", hex: "#78350F", wcag: "7.51" },
      { step: "950", hex: "#451A03", wcag: "13.03" },
    ],
  },
  {
    name: "Success",
    description: "Communicates a positive action, safe result, or completion. In-range temperatures, approved checklists, accepted deliveries.",
    steps: [
      { step: "25", hex: "#F6FEF9", wcag: "1.03" },
      { step: "50", hex: "#ECFDF5", wcag: "1.07" },
      { step: "100", hex: "#D1FAE5", wcag: "1.18" },
      { step: "200", hex: "#A7F3D0", wcag: "1.37" },
      { step: "300", hex: "#6EE7B7", wcag: "1.69" },
      { step: "400", hex: "#34D399", wcag: "2.17" },
      { step: "500", hex: "#10B981", wcag: "2.96" },
      { step: "600", hex: "#059669", wcag: "3.90" },
      { step: "700", hex: "#047857", wcag: "5.09" },
      { step: "800", hex: "#065F46", wcag: "6.70" },
      { step: "900", hex: "#064E3B", wcag: "8.03" },
      { step: "950", hex: "#022C22", wcag: "14.43" },
    ],
  },
];

/* helper: is a step dark enough to need white text? */
const isDark = (wcag: string) => parseFloat(wcag) >= 4.5;

const radii = [
  { name: "Default", value: "6px", tw: "rounded-md", usage: "Everything — cards, buttons, inputs, badges, modals, list items" },
  { name: "Full", value: "9999px", tw: "rounded-full", usage: "Avatars, status dots, circular indicators only" },
];

/* No shadows — use borders only */

const spacing = [
  { name: "2xs", value: "2px", tw: "0.5", usage: "Icon gaps, dot indicators" },
  { name: "xs", value: "4px", tw: "1", usage: "Tight gaps, badge padding" },
  { name: "sm", value: "8px", tw: "2", usage: "Compact padding, small gaps" },
  { name: "md", value: "12px", tw: "3", usage: "Card inner padding, list gap" },
  { name: "default", value: "16px", tw: "4", usage: "Standard padding, page margins (mobile)" },
  { name: "lg", value: "20px", tw: "5", usage: "Section padding, header padding" },
  { name: "xl", value: "24px", tw: "6", usage: "Page gutters (tablet/desktop)" },
  { name: "2xl", value: "32px", tw: "8", usage: "Section spacing, large gutters" },
];

const typography = [
  { name: "Display", size: "22px", weight: "Bold (700)", tw: "text-[22px] font-bold", usage: "Page greeting, user name" },
  { name: "Title", size: "20px", weight: "Bold (700)", tw: "text-[20px] font-bold", usage: "Screen titles (Tasks, Monitor)" },
  { name: "Heading", size: "18px", weight: "Bold (700)", tw: "text-[18px] font-bold", usage: "Detail view titles" },
  { name: "Subheading", size: "15px", weight: "Semibold (600)", tw: "text-[15px] font-semibold", usage: "Back nav centered title" },
  { name: "Section", size: "14px", weight: "Semibold (600)", tw: "text-[14px] font-semibold", usage: "Section headings" },
  { name: "Body", size: "13px", weight: "Medium (500)", tw: "text-[13px] font-medium", usage: "Card titles, list item primary text, body copy" },
  { name: "Caption", size: "12px", weight: "Regular (400)", tw: "text-[12px]", usage: "Metadata, secondary info" },
  { name: "Label", size: "12px", weight: "Semibold (600)", tw: "text-[12px] font-semibold", usage: "Section labels (uppercase + tracking)" },
  { name: "Small", size: "11px", weight: "Medium (500)", tw: "text-[11px] font-medium", usage: "Timestamps, dot separators, helper text" },
  { name: "Micro", size: "10px", weight: "Regular (400)", tw: "text-[10px]", usage: "Badge counts, unit ranges, tertiary info" },
  { name: "Badge", size: "10px", weight: "Bold (700)", tw: "text-[10px] font-bold", usage: "Status badges" },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

function ColorScaleRow({ scale }: { scale: ColorScale }) {
  return (
    <div className="mb-8">
      <div className="flex gap-6">
        <div className="w-[180px] shrink-0 pt-5">
          <h3 className="text-[13px] font-bold text-slate-100">{scale.name}</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{scale.description}</p>
        </div>
        <div className="flex-1 flex gap-1.5">
          {scale.steps.map((s) => {
            const dark = isDark(s.wcag);
            return (
              <div key={s.step} className="flex-1 flex flex-col items-center">
                <div className={`text-[8px] font-semibold rounded px-1 py-px mb-1 ${
                  dark
                    ? "bg-slate-100 text-slate-700"
                    : "border border-slate-600 text-slate-400"
                }`}>
                  {s.wcag}
                </div>
                <div
                  className="w-full h-10 rounded-md border border-white/5"
                  style={{ background: s.hex }}
                />
                <span className="text-[9px] font-medium text-slate-300 mt-1">{s.step}</span>
                <span className="text-[8px] font-mono text-slate-500">{s.hex}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type NavGroup = {
  title: string;
  items: { id: string; label: string }[];
};

const navGroups: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { id: "colors", label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "spacing", label: "Spacing" },
      { id: "radius", label: "Border Radius" },
      { id: "shadows", label: "Elevation" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "components", label: "UI Components" },
      { id: "patterns", label: "Patterns" },
      { id: "icons", label: "Iconography" },
    ],
  },
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("colors");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] font-sans text-slate-200">

      {/* ──── LEFT: Sidebar (Figma layers style) ──── */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r border-[#1A1A28]">
        {/* Header */}
        <Link
          href="/projects/hospitality-safe"
          className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1A1A28] hover:bg-[#1A1A28]/50 transition-colors group"
        >
          <div className="w-6 h-6 rounded-md bg-[#2E75B6] flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-white">HS</span>
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-200 tracking-tight group-hover:text-white transition-colors">Hospitality Safe</div>
            <div className="text-[10px] text-slate-500">Design System</div>
          </div>
        </Link>

        {/* Nav groups — Figma layers style */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-1">
              <div className="px-4 py-1.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-1.5 text-[12px] flex items-center gap-2 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#2E75B6]/15 text-[#5196DD] font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#1A1A28]/50"
                    }`}
                  >
                    {/* Layer dot indicator */}
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-[#5196DD]" : "bg-slate-700"}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1A1A28]">
          <div className="text-[10px] text-slate-600">Design System v1.0</div>
          <div className="text-[10px] text-slate-600">shadcn/ui + Phosphor</div>
        </div>
      </aside>

      {/* ──── RIGHT: Content ──── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0A0A12]/95 backdrop-blur-sm border-b border-[#1A1A28] px-8 py-4">
          <h1 className="text-[20px] font-bold text-white tracking-tight">
            {navGroups.flatMap(g => g.items).find(i => i.id === activeSection)?.label}
          </h1>
        </div>

        <div className="px-8 py-6">

        {/* ═══ COLORS ═══ */}
        {activeSection === "colors" && (
          <div>
            <p className="text-[13px] text-slate-400 mb-8 leading-relaxed max-w-[600px]">
              These are the main colors that make up the color system. Each scale runs from 25 (lightest) to 950 (darkest) with WCAG contrast ratios against white (#FFF).
            </p>

            {/* Base: White + Black */}
            <div className="mb-8">
              <div className="flex gap-6">
                <div className="w-[180px] shrink-0 pt-1">
                  <h3 className="text-[13px] font-bold text-slate-100">Base</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Black and white base styles.</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex flex-col items-center">
                    <div className="text-[8px] font-semibold border border-slate-600 text-slate-400 rounded px-1 py-px mb-1">21:1</div>
                    <div className="w-12 h-10 rounded-md border border-slate-600 bg-white" />
                    <span className="text-[9px] font-medium text-slate-300 mt-1">White</span>
                    <span className="text-[8px] font-mono text-slate-500">#FFFFFF</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[8px] font-semibold bg-slate-100 text-slate-700 rounded px-1 py-px mb-1">21:1</div>
                    <div className="w-12 h-10 rounded-md bg-black border border-white/10" />
                    <span className="text-[9px] font-medium text-slate-300 mt-1">Black</span>
                    <span className="text-[8px] font-mono text-slate-500">#000000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Color scales */}
            {colorScales.map(scale => (
              <ColorScaleRow key={scale.name} scale={scale} />
            ))}

          </div>
        )}

        {/* ═══ TYPOGRAPHY ═══ */}
        {activeSection === "typography" && (
          <div className="space-y-8">
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Type Scale</h2>
              <p className="text-[12px] text-slate-500 mb-6">Font family: DM Sans (--font-sans). All sizes use px for precise mobile rendering.</p>
              <div className="space-y-0">
                {typography.map((t, i) => (
                  <div key={t.name} className={`flex items-center gap-6 py-4 ${i < typography.length - 1 ? "border-b border-[#1A1A28]" : ""}`}>
                    <div className="w-[140px] shrink-0">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{t.name}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-white ${t.tw} tracking-tight`} style={{ fontSize: t.size }}>
                        The quick brown fox
                      </p>
                    </div>
                    <div className="w-[200px] shrink-0 text-right">
                      <code className="text-[10px] font-mono text-[#5196DD] bg-[#2E75B6]/10 px-1.5 py-0.5 rounded">{t.tw}</code>
                      <p className="text-[10px] text-slate-500 mt-1">{t.size} / {t.weight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-4">Section Label Pattern</h2>
              <p className="text-[12px] text-slate-500 mb-4">Used above grouped content. Always uppercase with wide tracking.</p>
              <div className="bg-white rounded-md p-5 border border-gray-200">
                <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Section Label</h3>
                <div className="bg-gray-50 rounded-md p-3 text-[13px] text-gray-700">Content goes here</div>
              </div>
              <code className="text-[10px] font-mono text-slate-400 mt-3 block">text-[12px] font-semibold text-gray-500 uppercase tracking-wider</code>
            </div>
          </div>
        )}

        {/* ═══ SPACING ═══ */}
        {activeSection === "spacing" && (
          <div className="space-y-8">
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Spacing Scale</h2>
              <p className="text-[12px] text-slate-500 mb-6">Based on 4px grid. Use Tailwind spacing utilities.</p>
              <div className="space-y-0">
                {spacing.map((s, i) => (
                  <div key={s.name} className={`flex items-center gap-4 py-3 ${i < spacing.length - 1 ? "border-b border-[#1A1A28]" : ""}`}>
                    <div className="w-[80px] shrink-0">
                      <span className="text-[12px] font-semibold text-white">{s.name}</span>
                    </div>
                    <div className="w-[60px] shrink-0">
                      <code className="text-[11px] font-mono text-[#5196DD]">{s.value}</code>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="h-3 rounded-full bg-[#2E75B6]" style={{ width: s.value }} />
                    </div>
                    <div className="w-[60px] shrink-0">
                      <code className="text-[10px] font-mono text-slate-400">p-{s.tw}</code>
                    </div>
                    <div className="w-[200px] shrink-0">
                      <span className="text-[11px] text-slate-500">{s.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-4">Key Spacing Rules</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Mobile page gutter", value: "px-4 (16px)", desc: "Horizontal padding on mobile screens" },
                  { title: "Card inner padding", value: "p-3.5 (14px)", desc: "Content padding inside cards" },
                  { title: "Section gap", value: "mb-4 to mb-5", desc: "Vertical space between content sections" },
                  { title: "List item gap", value: "gap-2 (8px)", desc: "Space between stacked list cards" },
                  { title: "Header padding", value: "pt-5 pb-4", desc: "Top of screen to content" },
                  { title: "Bottom action bar", value: "px-5 py-4", desc: "Sticky footer action buttons" },
                ].map(rule => (
                  <div key={rule.title} className="bg-[#0A0A12] rounded-md p-4 border border-[#1A1A28]">
                    <span className="text-[12px] font-semibold text-white">{rule.title}</span>
                    <code className="text-[11px] font-mono text-[#5196DD] block mt-1">{rule.value}</code>
                    <p className="text-[11px] text-slate-500 mt-1">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RADIUS ═══ */}
        {activeSection === "radius" && (
          <div className="space-y-6">
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Border Radius</h2>
              <p className="text-[12px] text-slate-400 mb-6">One radius for everything. Keep it simple — <code className="text-[11px] font-mono text-blue-400">6px</code> across all surfaces. Only use <code className="text-[11px] font-mono text-blue-400">rounded-full</code> for circles.</p>

              <div className="flex gap-6">
                {radii.map(r => (
                  <div key={r.name} className="flex flex-col items-center gap-3 p-5 bg-[#0A0A12] rounded-md border border-[#1A1A28] flex-1">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 bg-[#2E75B6] border-2 border-[#5196DD]"
                        style={{ borderRadius: r.value }}
                      />
                      <div
                        className="w-16 h-10 bg-[#2E75B6]/20 border border-[#2E75B6]/40"
                        style={{ borderRadius: r.value }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[13px] font-semibold text-white block">{r.name}</span>
                      <code className="text-[10px] font-mono text-blue-400">{r.tw} — {r.value}</code>
                      <p className="text-[11px] text-slate-400 mt-1">{r.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage examples */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h3 className="text-[13px] font-bold text-white mb-4">Applied examples</h3>
              <div className="bg-white rounded-md p-5 border border-gray-200">
                <div className="flex gap-3 items-start">
                  <button className="px-4 py-2 bg-[#2E75B6] text-white text-[12px] font-semibold rounded-md">Button</button>
                  <input className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-[12px] text-gray-900 w-[160px]" placeholder="Input field" />
                  <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-[12px] text-gray-700">Card</div>
                  <Badge className="text-[10px] font-bold border-0 rounded-md bg-emerald-50 text-emerald-600">Badge</Badge>
                  <div className="w-8 h-8 rounded-full bg-[#2E75B6] flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">SM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SHADOWS ═══ */}
        {activeSection === "shadows" && (
          <div className="space-y-6">
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Elevation</h2>
              <p className="text-[12px] text-slate-400 mb-6">No shadows. All elevation is communicated through <strong className="text-slate-200">borders (stroke)</strong> and background contrast. This keeps the UI flat, clean, and consistent across light and dark contexts.</p>

              <div className="flex gap-4">
                {/* On white bg */}
                <div className="flex-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 block">On white background</span>
                  <div className="bg-white rounded-md p-5 border border-gray-200 space-y-3">
                    <div className="p-3 bg-white border border-gray-200 rounded-md text-[12px] text-gray-700">Card — <code className="text-[10px] font-mono text-gray-400">border border-gray-200</code></div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-[12px] text-gray-700">Input — <code className="text-[10px] font-mono text-gray-400">bg-gray-50 border border-gray-200</code></div>
                    <div className="p-3 bg-white border border-gray-100 rounded-md text-[12px] text-gray-500">Subtle — <code className="text-[10px] font-mono text-gray-400">border border-gray-100</code></div>
                  </div>
                </div>
                {/* On dark bg */}
                <div className="flex-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 block">On dark background</span>
                  <div className="bg-[#0A0A12] rounded-md p-5 border border-[#1A1A28] space-y-3">
                    <div className="p-3 bg-[#11111B] border border-[#1A1A28] rounded-md text-[12px] text-slate-300">Card — <code className="text-[10px] font-mono text-slate-500">border border-[#1A1A28]</code></div>
                    <div className="p-3 bg-[#0A0A12] border border-[#1A1A28] rounded-md text-[12px] text-slate-300">Input — <code className="text-[10px] font-mono text-slate-500">border border-[#1A1A28]</code></div>
                    <div className="p-3 bg-[#11111B] border border-white/5 rounded-md text-[12px] text-slate-400">Subtle — <code className="text-[10px] font-mono text-slate-500">border border-white/5</code></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-5">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Warning size={12} className="text-red-400" weight="bold" />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-slate-200">Never use box-shadow</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">No <code className="font-mono text-slate-500">shadow-sm</code>, <code className="font-mono text-slate-500">shadow-md</code>, or any shadow utility. If something needs to feel elevated, use a border or change the background color.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ COMPONENTS ═══ */}
        {activeSection === "components" && (
          <div className="space-y-8">
            {/* Buttons */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Buttons</h2>
              <p className="text-[12px] text-slate-500 mb-5">shadcn/ui Button with project overrides. All action buttons use rounded-md h-12 on mobile.</p>
              <div className="bg-white rounded-md p-6 border border-gray-200 space-y-6">
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Primary Actions</span>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-[#2E75B6] hover:bg-[#255E94] text-white rounded-md h-12 px-6 text-[13px] font-semibold">Assign to Me</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-12 px-6 text-[13px] font-semibold">
                      <CheckCircle size={16} weight="bold" className="mr-1.5" />Approve
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md h-12 px-6 text-[13px] font-semibold">
                      <Warning size={16} weight="bold" className="mr-1.5" />Log Action
                    </Button>
                  </div>
                </div>
                <Separator className="bg-gray-100" />
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Secondary / Outline</span>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="border-gray-300 text-gray-700 rounded-md h-12 px-6 text-[13px] font-semibold">Assign Staff</Button>
                    <Button variant="outline" className="border-red-300 text-red-500 rounded-md h-12 px-6 text-[13px] font-semibold">Reject</Button>
                    <Button variant="outline" className="border-amber-300 text-amber-600 rounded-md h-12 px-6 text-[13px] font-semibold">Create Task</Button>
                    <Button variant="outline" className="border-[#7EB2E8] text-[#2E75B6] rounded-md h-12 px-6 text-[13px] font-semibold">Create Task</Button>
                  </div>
                </div>
                <Separator className="bg-gray-100" />
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Small / Pill</span>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#D6E8F9] text-[#2E75B6]">Active Filter</button>
                    <button className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">Inactive Filter</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Badges</h2>
              <p className="text-[12px] text-slate-500 mb-5">shadcn/ui Badge. Always rounded-full, border-0, text-[10px] font-bold for status; text-[9px] for compact.</p>
              <div className="bg-white rounded-md p-6 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-red-500 bg-red-50">Open</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-amber-600 bg-amber-50">In Progress</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-emerald-600 bg-emerald-50">Done</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-[#2E75B6] bg-[#EBF4FC]">Awaiting Review</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-amber-600 bg-amber-50">Flagged</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-emerald-600 bg-emerald-50">Accepted</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-amber-600 bg-amber-50">Partial</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-red-500 bg-red-50">Rejected</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-red-500 bg-red-50">High</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-amber-600 bg-amber-50">Medium</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-gray-500 bg-gray-100">Low</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-red-500 bg-red-50">Out of Range</Badge>
                  <Badge className="text-[10px] font-bold border-0 rounded-full text-emerald-600 bg-emerald-50">In Range</Badge>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Cards &amp; List Items</h2>
              <p className="text-[12px] text-slate-500 mb-5">White surface, gray-200 border, no shadow, rounded-md. Full-width tappable on mobile.</p>
              <div className="bg-gray-50 rounded-md p-5 border border-gray-200 space-y-3 max-w-[400px]">
                {/* Task card example */}
                <div className="flex items-center gap-3 p-3.5 rounded-md bg-white border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Truck size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">Missing Steak — Metro</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-500">Kitchen</span>
                      <span className="text-[11px] text-gray-300">&middot;</span>
                      <span className="text-[11px] text-gray-500">Adele</span>
                    </div>
                  </div>
                  <CaretRight size={14} className="text-gray-400 shrink-0" />
                </div>

                {/* Temp card example */}
                <div className="flex items-center gap-3 p-3.5 rounded-md bg-white border border-gray-200">
                  <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center">
                    <Thermometer size={20} className="text-emerald-500" weight="bold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900">Cool Room</p>
                    <p className="text-[10px] text-gray-400">Kitchen &middot; 10 min ago</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[16px] font-bold text-emerald-500">3.2C</p>
                    <p className="text-[10px] text-gray-400">0 to 5C</p>
                  </div>
                </div>

                {/* Alert card example */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-red-50 border border-red-200">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <Thermometer size={18} className="text-red-500" weight="bold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-red-600">Grill U/B Fridge — 8.1C</p>
                    <p className="text-[11px] text-red-400">Above threshold (5C max)</p>
                  </div>
                  <CaretRight size={14} className="text-red-400" />
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Form Controls</h2>
              <p className="text-[12px] text-slate-500 mb-5">shadcn/ui primitives with light-theme overrides.</p>
              <div className="bg-white rounded-md p-6 border border-gray-200 space-y-5 max-w-[400px]">
                <div>
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Input</span>
                  <Input placeholder="Search tasks..." className="bg-gray-50 border-gray-200 rounded-md text-[13px]" />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Textarea</span>
                  <Textarea placeholder="Add notes..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Select</span>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200 rounded-md text-[13px]">
                      <SelectValue placeholder="Choose area..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="larder">Larder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch />
                  <span className="text-[13px] text-gray-700">Enable notifications</span>
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Progress</span>
                  <Progress value={71} className="h-1.5 bg-gray-200 [&>div]:bg-[#EBF4FC]0" />
                  <p className="text-[10px] text-gray-400 mt-1">5/7 completed</p>
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Photo Upload</span>
                  <div className="flex gap-2">
                    <div className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Camera size={20} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PATTERNS ═══ */}
        {activeSection === "patterns" && (
          <div className="space-y-8">
            {/* Navigation patterns */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Navigation</h2>
              <p className="text-[12px] text-slate-500 mb-5">Mobile uses bottom tab nav. Detail screens replace with a back header.</p>
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden max-w-[400px]">
                {/* Bottom nav example */}
                <div className="px-4 py-6 flex items-center justify-center">
                  <span className="text-[13px] text-gray-400">Screen content</span>
                </div>
                <div className="flex items-center justify-around bg-white border-t border-gray-200 py-1.5 pb-4">
                  {[
                    { icon: House, label: "Home", active: true },
                    { icon: ClipboardText, label: "Tasks", badge: 4 },
                    { icon: ChartBar, label: "Monitor" },
                    { icon: DotsThreeVertical, label: "More" },
                  ].map((tab, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 relative">
                      <div className="relative">
                        <tab.icon size={22} weight={tab.active ? "fill" : "regular"} className={tab.active ? "text-[#2E75B6]" : "text-gray-400"} />
                        {tab.badge && (
                          <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-[9px] text-white font-bold">{tab.badge}</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-medium ${tab.active ? "text-[#2E75B6]" : "text-gray-400"}`}>{tab.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PIN pattern */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">PIN Authentication</h2>
              <p className="text-[12px] text-slate-500 mb-5">Every state-changing action requires PIN. 4-digit entry with auto-submit. White bg, gray-100 keys.</p>
              <div className="bg-white rounded-md p-8 border border-gray-200 flex flex-col items-center max-w-[300px] mx-auto">
                <div className="text-[16px] font-semibold text-gray-900 mb-5">Enter PIN</div>
                <div className="flex gap-4 mb-6">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < 2 ? "bg-[#2E75B6]" : "border-2 border-gray-300"}`} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 w-[180px]">
                  {["1","2","3","4","5","6","7","8","9","","0","<"].map(k => (
                    <div key={k} className={`h-[44px] rounded-md text-[18px] font-medium text-gray-900 flex items-center justify-center ${k === "" ? "opacity-0" : "bg-gray-100"}`}>
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Success pattern */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Success Confirmation</h2>
              <p className="text-[12px] text-slate-500 mb-5">Centered layout. Emerald check icon, title, subtitle, primary button to return home.</p>
              <div className="bg-white rounded-md p-8 border border-gray-200 flex flex-col items-center max-w-[300px] mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle size={36} className="text-emerald-500" weight="fill" />
                </div>
                <div className="text-[18px] font-semibold text-gray-900 mt-4">Done</div>
                <p className="text-[13px] text-gray-500 mt-1">Action completed successfully</p>
                <button className="mt-6 px-6 py-2.5 rounded-md bg-[#2E75B6] text-white text-[13px] font-semibold">
                  Back to Home
                </button>
              </div>
            </div>

            {/* Quick stats pattern */}
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Quick Stats Grid</h2>
              <p className="text-[12px] text-slate-500 mb-5">3-column grid on mobile. Colored bg + matching text. Tappable to navigate.</p>
              <div className="bg-gray-50 rounded-md p-5 border border-gray-200 max-w-[400px]">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-red-50 rounded-md p-3.5 border border-gray-100">
                    <p className="text-[22px] font-bold text-red-600">2</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">Open Tasks</p>
                  </div>
                  <div className="bg-[#EBF4FC] rounded-md p-3.5 border border-gray-100">
                    <p className="text-[22px] font-bold text-[#2E75B6]">2</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">To Review</p>
                  </div>
                  <div className="bg-blue-50 rounded-md p-3.5 border border-gray-100">
                    <p className="text-[22px] font-bold text-blue-600">3</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">Deliveries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ICONS ═══ */}
        {activeSection === "icons" && (
          <div className="space-y-8">
            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-2">Phosphor Icons</h2>
              <p className="text-[12px] text-slate-500 mb-5">
                All icons from <code className="text-[#5196DD]">@phosphor-icons/react</code>. Default weight: regular. Active nav: fill. Alert/emphasis: bold.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: House, name: "House", usage: "Home tab" },
                  { icon: ClipboardText, name: "ClipboardText", usage: "Tasks tab" },
                  { icon: ChartBar, name: "ChartBar", usage: "Monitor tab" },
                  { icon: Bell, name: "Bell", usage: "Notifications" },
                  { icon: Thermometer, name: "Thermometer", usage: "Temperature units" },
                  { icon: Truck, name: "Truck", usage: "Deliveries" },
                  { icon: ListChecks, name: "ListChecks", usage: "Checklists" },
                  { icon: Warning, name: "Warning", usage: "Alerts, complaints" },
                  { icon: CheckCircle, name: "CheckCircle", usage: "Success, approved" },
                  { icon: Camera, name: "Camera", usage: "Photo upload" },
                  { icon: MagnifyingGlass, name: "MagnifyingGlass", usage: "Audit source" },
                  { icon: CaretRight, name: "CaretRight", usage: "Navigation arrow" },
                ].map(item => (
                  <div key={item.name} className="bg-[#0A0A12] rounded-md p-4 border border-[#1A1A28] flex flex-col items-center gap-2">
                    <item.icon size={28} className="text-slate-300" />
                    <span className="text-[11px] font-semibold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-500 text-center">{item.usage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#11111B] border border-[#1A1A28] rounded-md p-6">
              <h2 className="text-[16px] font-bold text-white mb-4">Icon Sizing Guide</h2>
              <div className="space-y-0">
                {[
                  { size: "14-16px", usage: "Inline with text, badges, metadata" },
                  { size: "18-20px", usage: "List item icons, card icons, nav icons" },
                  { size: "22px", usage: "Bottom tab bar icons" },
                  { size: "28-36px", usage: "Feature/success icons, empty states" },
                ].map((rule, i) => (
                  <div key={i} className={`flex items-center gap-4 py-3 ${i < 3 ? "border-b border-[#1A1A28]" : ""}`}>
                    <code className="text-[12px] font-mono text-[#5196DD] w-[80px]">{rule.size}</code>
                    <span className="text-[12px] text-slate-400">{rule.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

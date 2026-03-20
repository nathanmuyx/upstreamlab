"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  CaretLeft,
  House,
  ClipboardText,
  ListChecks,
  ChartBar,
  Bell,
  CheckCircle,
  Warning,
  Thermometer,
  Truck,
  MagnifyingGlass,
  ChatDots,
  CaretRight,
  Clock,
  User,
  Backspace,
  Bug,
  Fire,
  DotsThreeVertical,
  Buildings,
  Phone,
  DeviceTablet,
  X,
  FunnelSimple,
  ArrowCounterClockwise,
  Camera,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

/* ─── UpstreamLogo ─── */
function UpstreamLogo({ size = 14 }: { size?: number }) {
  const h = size * (669.96 / 608.44);
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={size} height={h}>
      <path
        d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z"
        fill="url(#upMgr)"
      />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upMgr" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" />
          <stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

type Task = {
  id: string;
  title: string;
  source: "checklist" | "delivery" | "audit" | "complaint";
  severity: "high" | "medium" | "low";
  assignee: string;
  area: string;
  time: string;
  status: "open" | "in-progress" | "done";
  description: string;
};

const tasks: Task[] = [
  { id: "t1", title: "Missing Steak — Metro delivery", source: "delivery", severity: "high", assignee: "Adele", area: "Kitchen", time: "9:12 AM", status: "open", description: "Steak not included in today's delivery from Metro Foods. Check with supplier and log replacement order." },
  { id: "t2", title: "Fryer oil change overdue", source: "checklist", severity: "high", assignee: "Unassigned", area: "Fryer", time: "8:45 AM", status: "open", description: "Mid-day checklist flagged fryer oil past change date. Needs immediate replacement." },
  { id: "t3", title: "Cool Room temp spike logged", source: "audit", severity: "medium", assignee: "Vicki", area: "Cool Room", time: "Yesterday", status: "in-progress", description: "Cool room reached 8.1C at 14:20 yesterday. Corrective action required — check door seal and compressor." },
  { id: "t4", title: "Customer allergen complaint", source: "complaint", severity: "high", assignee: "Adele", area: "Front of House", time: "Yesterday", status: "in-progress", description: "Customer reported undisclosed dairy in the pesto pasta. Review allergen matrix and staff training." },
  { id: "t5", title: "Sanitiser low in prep area", source: "checklist", severity: "low", assignee: "Jake", area: "Larder", time: "2 days ago", status: "done", description: "Opening checklist noted sanitiser dispenser nearly empty. Restocked." },
];

type Checklist = {
  id: string;
  title: string;
  area: string;
  submittedBy: string;
  time: string;
  progress: number;
  total: number;
  status: "awaiting-review" | "reviewed" | "flagged";
  items: { label: string; checked: boolean; note?: string }[];
};

const checklists: Checklist[] = [
  { id: "c1", title: "Larder — Mid Day Cleaning", area: "Larder", submittedBy: "Vicki Warburton", time: "12:34 PM", progress: 7, total: 7, status: "awaiting-review", items: [
    { label: "Wipe down all surfaces", checked: true },
    { label: "Check fridge temps", checked: true },
    { label: "Rotate stock (FIFO)", checked: true },
    { label: "Sweep + mop floor", checked: true },
    { label: "Empty bins", checked: true },
    { label: "Sanitise prep boards", checked: true },
    { label: "Photo of clean larder", checked: true },
  ]},
  { id: "c2", title: "Bar — Opening Checks", area: "Bar", submittedBy: "Jake Miller", time: "7:15 AM", progress: 5, total: 6, status: "flagged", items: [
    { label: "Beer lines flushed", checked: true },
    { label: "Glass washer clean", checked: true },
    { label: "Ice machine topped up", checked: true },
    { label: "Bar fridge temp check", checked: true },
    { label: "Garnish prep complete", checked: true },
    { label: "Sanitiser station stocked", checked: false, note: "Ran out — flagged for restock" },
  ]},
  { id: "c3", title: "Kitchen — Morning Prep", area: "Kitchen", submittedBy: "Adele Cheng", time: "6:50 AM", progress: 8, total: 8, status: "reviewed", items: [
    { label: "All surfaces sanitised", checked: true },
    { label: "Knives sharpened", checked: true },
    { label: "Walk-in stock check", checked: true },
    { label: "Prep list reviewed", checked: true },
    { label: "Allergen board updated", checked: true },
    { label: "Waste bins emptied", checked: true },
    { label: "Handwash stations stocked", checked: true },
    { label: "Equipment temp check", checked: true },
  ]},
];

type TempUnit = {
  id: string;
  name: string;
  area: string;
  current: number;
  min: number;
  max: number;
  status: "normal" | "alert" | "no-data";
  lastReading: string;
  readings: { time: string; temp: number }[];
};

const tempUnits: TempUnit[] = [
  { id: "u1", name: "Cool Room", area: "Kitchen", current: 3.2, min: 0, max: 5, status: "normal", lastReading: "10 min ago", readings: [{ time: "08:00", temp: 3.1 }, { time: "09:00", temp: 3.2 }, { time: "10:00", temp: 3.4 }, { time: "11:00", temp: 3.2 }] },
  { id: "u2", name: "Grill U/B Fridge", area: "Grill", current: 8.1, min: 0, max: 5, status: "alert", lastReading: "5 min ago", readings: [{ time: "08:00", temp: 4.8 }, { time: "09:00", temp: 5.9 }, { time: "10:00", temp: 7.2 }, { time: "11:00", temp: 8.1 }] },
  { id: "u3", name: "Larder Fridge 1", area: "Larder", current: 2.8, min: 0, max: 5, status: "normal", lastReading: "12 min ago", readings: [{ time: "08:00", temp: 2.9 }, { time: "09:00", temp: 2.7 }, { time: "10:00", temp: 2.8 }, { time: "11:00", temp: 2.8 }] },
  { id: "u4", name: "Freezer 1", area: "Kitchen", current: -18.4, min: -25, max: -15, status: "normal", lastReading: "8 min ago", readings: [{ time: "08:00", temp: -18.2 }, { time: "09:00", temp: -18.5 }, { time: "10:00", temp: -18.3 }, { time: "11:00", temp: -18.4 }] },
  { id: "u5", name: "Bar Fridge", area: "Bar", current: 4.1, min: 0, max: 5, status: "normal", lastReading: "15 min ago", readings: [{ time: "08:00", temp: 4.0 }, { time: "09:00", temp: 4.2 }, { time: "10:00", temp: 4.0 }, { time: "11:00", temp: 4.1 }] },
  { id: "u6", name: "Pizza Prep Fridge", area: "Pizza", current: 0, min: 0, max: 5, status: "no-data", lastReading: "No data today", readings: [] },
];

type Delivery = {
  id: string;
  supplier: string;
  time: string;
  items: string;
  outcome: "accepted" | "partial" | "rejected";
  recordedBy: string;
  temp?: string;
  notes?: string;
};

const deliveries: Delivery[] = [
  { id: "d1", supplier: "Metro Foods", time: "7:30 AM", items: "Meat, Dairy, Vegetables", outcome: "partial", recordedBy: "Adele Cheng", temp: "3.4C", notes: "Steak missing from order. Task created." },
  { id: "d2", supplier: "Seafresh Ltd", time: "8:15 AM", items: "Seafood", outcome: "accepted", recordedBy: "Vicki Warburton", temp: "1.2C" },
  { id: "d3", supplier: "Local Farm Co", time: "9:00 AM", items: "Fruit, Vegetables", outcome: "accepted", recordedBy: "Jake Miller" },
];

type Complaint = {
  id: string;
  title: string;
  customer: string;
  time: string;
  severity: "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved";
  description: string;
  linkedTask?: string;
};

const complaints: Complaint[] = [
  { id: "cm1", title: "Undisclosed dairy allergen", customer: "Table 12", time: "Yesterday 7:45 PM", severity: "high", status: "investigating", description: "Customer reported dairy in pesto pasta not listed on allergen menu. No allergic reaction but raised concern.", linkedTask: "t4" },
  { id: "cm2", title: "Undercooked chicken", customer: "Takeaway #482", time: "2 days ago", severity: "medium", status: "resolved", description: "Customer returned chicken burger — pink in centre. Batch temp records reviewed, isolated incident. Staff retrained on probe use." },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export default function ManagerPrototypePage() {
  const [viewport, setViewport] = useState<"mobile" | "ipad">("mobile");
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState<string[]>([]);
  const [bottomTab, setBottomTab] = useState("home");
  const [pinDigits, setPinDigits] = useState("");
  const [pinCallback, setPinCallback] = useState<(() => void) | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<TempUnit | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [taskFilter, setTaskFilter] = useState<"all" | "open" | "in-progress" | "done">("all");

  const go = useCallback((s: string) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  }, [screen]);

  const back = useCallback(() => {
    setHistory((h) => {
      const prev = [...h];
      const last = prev.pop();
      if (last) setScreen(last);
      return prev;
    });
  }, []);

  const goPin = useCallback((cb: () => void) => {
    setPinCallback(() => cb);
    setPinDigits("");
    setHistory((h) => [...h, screen]);
    setScreen("pin");
  }, [screen]);

  const switchTab = (tab: string) => {
    setBottomTab(tab);
    setHistory([]);
    setScreen(tab === "home" ? "home" : tab === "tasks" ? "tasks" : tab === "monitor" ? "monitor" : "more");
  };

  /* ─── severity helpers ─── */
  const sevColor = (s: string) => s === "high" ? "text-red-500" : s === "medium" ? "text-amber-500" : "text-gray-400";
  const sevBg = (s: string) => s === "high" ? "bg-red-50" : s === "medium" ? "bg-amber-50" : "bg-gray-100";
  const statusColor = (s: string) => s === "open" ? "text-red-500 bg-red-50" : s === "in-progress" ? "text-amber-600 bg-amber-50" : s === "investigating" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

  const alertCount = tempUnits.filter(u => u.status === "alert").length + tasks.filter(t => t.status === "open" && t.severity === "high").length;

  /* ═══ SCREENS ═══ */

  /* ─── iOS Status Bar (flanks Dynamic Island) ─── */
  const StatusBar = () => (
    <div className="relative h-[54px] bg-white">
      {/* Dynamic Island */}
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] rounded-[22px] bg-black z-10">
        <div className="absolute right-[24px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-[#1a1a2e] border-[1.5px] border-[#2a2a3a]">
          <div className="absolute top-[1.5px] left-[1.5px] w-[3px] h-[3px] rounded-full bg-[#333350]" />
        </div>
      </div>
      {/* Time — left of island */}
      <div className="absolute left-[28px] top-[16px]">
        <span className="text-[15px] font-semibold text-gray-900" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif", fontWeight: 600, letterSpacing: "0.3px" }}>9:41</span>
      </div>
      {/* Icons — right of island */}
      <div className="absolute right-[22px] top-[18px] flex items-center gap-[5px]">
        {/* Cellular */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill="#1d1d1f" />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="#1d1d1f" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#1d1d1f" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#1d1d1f" opacity="0.25" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#1d1d1f">
          <path d="M8 3.6c2.1 0 4 .8 5.5 2.1l1.1-1.3C12.7 2.7 10.5 1.8 8 1.8S3.3 2.7 1.4 4.4l1.1 1.3C4 4.4 5.9 3.6 8 3.6z" opacity="1" />
          <path d="M8 7c1.2 0 2.3.5 3.1 1.2l1.1-1.3C11 5.8 9.6 5.2 8 5.2S5 5.8 3.8 6.9L4.9 8.2C5.7 7.5 6.8 7 8 7z" opacity="1" />
          <circle cx="8" cy="10.5" r="1.5" />
        </svg>
        {/* Battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#1d1d1f" strokeWidth="1" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="#1d1d1f" />
          <path d="M24 4v4a2 2 0 0 0 0-4z" fill="#1d1d1f" opacity="0.4" />
        </svg>
      </div>
    </div>
  );

  /* ─── Bottom Nav ─── */
  const BottomNav = () => (
    <div className="flex items-center justify-around bg-white border-t border-gray-200 py-1.5 pb-4">
      {[
        { id: "home", icon: House, label: "Home" },
        { id: "tasks", icon: ClipboardText, label: "Tasks", badge: tasks.filter(t => t.status !== "done").length },
        { id: "monitor", icon: ChartBar, label: "Monitor" },
        { id: "more", icon: DotsThreeVertical, label: "More" },
      ].map((tab) => {
        const active = bottomTab === tab.id;
        return (
          <button key={tab.id} onClick={() => switchTab(tab.id)} className="flex flex-col items-center gap-0.5 cursor-pointer relative">
            <div className="relative">
              <tab.icon size={22} weight={active ? "fill" : "regular"} className={active ? "text-[#2E75B6]" : "text-gray-400"} />
              {tab.badge && tab.badge > 0 && (
                <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{tab.badge}</span>
                </div>
              )}
            </div>
            <span className={`text-[10px] font-medium ${active ? "text-[#2E75B6]" : "text-gray-400"}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  /* ─── Back Nav Header ─── */
  const BackNav = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
      <button onClick={back} className="flex items-center gap-1 text-[#2E75B6] cursor-pointer">
        <CaretLeft size={18} weight="bold" />
        <span className="text-[13px] font-medium">Back</span>
      </button>
      <span className="text-[15px] font-semibold text-gray-900 ml-auto mr-auto pr-12">{title}</span>
    </div>
  );

  /* ═══ HOME ═══ */
  /* mini sparkline for temp widget */
  const Sparkline = ({ readings, max, color }: { readings: { temp: number }[]; max: number; color: string }) => {
    if (readings.length < 2) return null;
    const h = 24; const w = 60;
    const temps = readings.map(r => r.temp);
    const mn = Math.min(...temps) - 1; const mx = Math.max(...temps) + 1;
    const pts = temps.map((t, i) => `${(i / (temps.length - 1)) * w},${h - ((t - mn) / (mx - mn)) * h}`).join(" ");
    const threshY = h - ((max - mn) / (mx - mn)) * h;
    return (
      <svg width={w} height={h} className="shrink-0">
        <line x1="0" y1={threshY} x2={w} y2={threshY} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const [taskPage, setTaskPage] = useState(0);

  const HomeScreen = () => {
    const openTasks = tasks.filter(t => t.status === "open");
    const inProgressTasks = tasks.filter(t => t.status === "in-progress");
    const pendingChecklists = checklists.filter(c => c.status === "awaiting-review" || c.status === "flagged");
    const alertUnits = tempUnits.filter(u => u.status === "alert");
    const priorityTasks = [...openTasks, ...inProgressTasks];
    const taskPages = [];
    for (let i = 0; i < priorityTasks.length; i += 2) taskPages.push(priorityTasks.slice(i, i + 2));

    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Greeting */}
        <div className="px-5 pt-4 pb-3 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Good Morning</p>
              <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Sarah</h1>
            </div>
            <div className="relative">
              <button onClick={() => go("notifications")} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
                <Bell size={18} className="text-gray-600" />
              </button>
              {alertCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">{alertCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-2">

          {/* ── Temperature Widget (iOS stocks style) ── */}
          <div className="px-4 pt-3 mb-3">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Units</span>
                <button onClick={() => switchTab("monitor")} className="text-[10px] text-[#2E75B6] font-semibold cursor-pointer">All &rarr;</button>
              </div>
              {tempUnits.filter(u => u.status !== "no-data").map((unit, i, arr) => (
                <button
                  key={unit.id}
                  onClick={() => { setSelectedUnit(unit); go("temp-detail"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 cursor-pointer text-left hover:bg-gray-50 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${unit.status === "alert" ? "bg-red-500" : "bg-emerald-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-900 truncate">{unit.name}</p>
                    <p className="text-[10px] text-gray-400">{unit.area}</p>
                  </div>
                  <Sparkline readings={unit.readings} max={unit.max} color={unit.status === "alert" ? "#ef4444" : "#10b981"} />
                  <div className="text-right shrink-0 w-[44px]">
                    <span className={`text-[14px] font-bold ${unit.status === "alert" ? "text-red-500" : "text-gray-900"}`}>{unit.current}C</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Tasks carousel (swipeable cards with dots) ── */}
          <div className="px-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tasks</span>
              <button onClick={() => switchTab("tasks")} className="text-[10px] text-[#2E75B6] font-semibold cursor-pointer">{priorityTasks.length} open &rarr;</button>
            </div>
            {/* Cards */}
            <div className="overflow-x-auto flex gap-2 pb-2 snap-x snap-mandatory scrollbar-hide" onScroll={(e) => {
              const el = e.currentTarget;
              const page = Math.round(el.scrollLeft / el.clientWidth);
              setTaskPage(page);
            }}>
              {priorityTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => { setSelectedTask(task); go("task-detail"); }}
                  className="snap-start shrink-0 w-[85%] bg-white border border-gray-200 rounded-md p-3.5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.severity === "high" ? "bg-red-500" : task.severity === "medium" ? "bg-amber-500" : "bg-gray-300"}`} />
                    <Badge className={`text-[9px] font-bold border-0 rounded-md ${statusColor(task.status)}`}>
                      {task.status === "open" ? "Open" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 mb-1">{task.title}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <User size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">{task.assignee}</span>
                    <span className="text-[10px] text-gray-300">&middot;</span>
                    <span className="text-[10px] text-gray-400">{task.area}</span>
                  </div>
                </button>
              ))}
            </div>
            {/* Dots */}
            {priorityTasks.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {priorityTasks.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all ${i === taskPage ? "w-4 h-1.5 bg-[#2E75B6]" : "w-1.5 h-1.5 bg-gray-300"}`} />
                ))}
              </div>
            )}
          </div>

          {/* ── Checklists ── */}
          <div className="px-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Checklists</span>
              {pendingChecklists.length > 0 && (
                <span className="text-[10px] font-bold text-[#2E75B6] bg-[#EBF4FC] px-1.5 py-0.5 rounded-md">{pendingChecklists.length} to review</span>
              )}
            </div>
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {checklists.map((cl, i) => (
                <button
                  key={cl.id}
                  onClick={() => { setSelectedChecklist(cl); go("checklist-detail"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 cursor-pointer text-left hover:bg-gray-50 ${i < checklists.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    cl.status === "reviewed" ? "bg-emerald-50" : cl.status === "flagged" ? "bg-amber-50" : "bg-[#EBF4FC]"
                  }`}>
                    {cl.status === "reviewed"
                      ? <CheckCircle size={14} className="text-emerald-500" weight="fill" />
                      : <ListChecks size={14} className={cl.status === "flagged" ? "text-amber-600" : "text-[#2E75B6]"} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-900 truncate">{cl.title}</p>
                    <p className="text-[10px] text-gray-400">{cl.submittedBy} &middot; {cl.time}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-[10px] font-semibold ${
                      cl.status === "reviewed" ? "text-emerald-500" : cl.status === "flagged" ? "text-amber-600" : "text-[#2E75B6]"
                    }`}>
                      {cl.status === "reviewed" ? "Done" : cl.status === "flagged" ? "Flagged" : "Review"}
                    </span>
                    <p className="text-[9px] text-gray-300 mt-0.5">{cl.progress}/{cl.total}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Deliveries ── */}
          <div className="px-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Today&apos;s Deliveries</span>
              <span className="text-[10px] text-gray-400">{deliveries.length} received</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {deliveries.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDelivery(d); go("delivery-detail"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 cursor-pointer text-left hover:bg-gray-50 ${i < deliveries.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    d.outcome === "rejected" ? "bg-red-500" : d.outcome === "partial" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-900">{d.supplier}</p>
                    <p className="text-[10px] text-gray-400">{d.items}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{d.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Complaints ── */}
          {complaints.filter(c => c.status !== "resolved").length > 0 && (
            <div className="px-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Active Complaints</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                {complaints.filter(c => c.status !== "resolved").map((c, i, arr) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedComplaint(c); go("complaint-detail"); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 cursor-pointer text-left hover:bg-gray-50 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <Warning size={14} className="text-red-500 shrink-0" weight="bold" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-gray-900 truncate">{c.title}</p>
                      <p className="text-[10px] text-gray-400">{c.customer} &middot; {c.time}</p>
                    </div>
                    <CaretRight size={12} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══ TASKS ═══ */
  const TasksScreen = () => {
    const filtered = taskFilter === "all" ? tasks : tasks.filter(t => t.status === taskFilter);
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="px-5 pt-5 pb-3">
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-3">Tasks</h1>
          <div className="flex gap-2">
            {(["all", "open", "in-progress", "done"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                  taskFilter === f ? "bg-[#D6E8F9] text-[#2E75B6]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {f === "all" ? "All" : f === "open" ? "Open" : f === "in-progress" ? "In Progress" : "Done"}
                {f !== "all" && <span className="ml-1 opacity-60">{tasks.filter(t => t.status === f).length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {filtered.map(task => (
            <button
              key={task.id}
              onClick={() => { setSelectedTask(task); go("task-detail"); }}
              className="w-full flex items-start gap-3 p-4 rounded-md bg-white border border-gray-200  cursor-pointer text-left mb-2"
            >
              <div className={`w-8 h-8 rounded-full ${sevBg(task.severity)} flex items-center justify-center shrink-0 mt-0.5`}>
                {task.source === "delivery" ? <Truck size={16} className={sevColor(task.severity)} /> :
                 task.source === "complaint" ? <ChatDots size={16} className={sevColor(task.severity)} /> :
                 task.source === "audit" ? <MagnifyingGlass size={16} className={sevColor(task.severity)} /> :
                 <ListChecks size={16} className={sevColor(task.severity)} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-medium text-gray-900">{task.title}</p>
                  <Badge className={`text-[9px] font-bold border-0 rounded-full shrink-0 ${statusColor(task.status)}`}>
                    {task.status === "open" ? "Open" : task.status === "in-progress" ? "In Progress" : "Done"}
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <User size={10} className="text-gray-500" />
                    <span className="text-[10px] text-gray-400">{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-500" />
                    <span className="text-[10px] text-gray-400">{task.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ═══ TASK DETAIL ═══ */
  const TaskDetailScreen = () => {
    if (!selectedTask) return null;
    const t = selectedTask;
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <BackNav title="Task" />
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-[10px] font-bold border-0 rounded-full ${statusColor(t.status)}`}>
                {t.status === "open" ? "Open" : t.status === "in-progress" ? "In Progress" : "Done"}
              </Badge>
              <Badge className={`text-[10px] font-bold border-0 rounded-full capitalize ${sevBg(t.severity)} ${sevColor(t.severity)}`}>
                {t.severity}
              </Badge>
            </div>
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">{t.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{t.assignee}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{t.time}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="px-5 py-4">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{t.description}</p>
          </div>

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Source</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[11px] font-semibold bg-gray-100 text-gray-600 border-0 rounded-full capitalize">{t.source}</Badge>
              <span className="text-[11px] text-gray-500">{t.area}</span>
            </div>
          </div>

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Completion Notes</h3>
            <Textarea placeholder="Add notes..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
          </div>

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Photo Evidence</h3>
            <div className="flex gap-2">
              <div className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                <Camera size={20} className="text-gray-400" />
              </div>
              <div className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                <Camera size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 bg-white border-t border-gray-200">
          {t.status === "open" ? (
            <div className="flex gap-2">
              <Button
                onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
                className="flex-1 bg-[#2E75B6] hover:bg-[#255E94] text-white rounded-md h-12 text-[13px] font-semibold"
              >
                Assign to Me
              </Button>
              <Button
                variant="outline"
                onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
                className="flex-1 border-gray-300 text-gray-700 rounded-md h-12 text-[13px] font-semibold bg-white hover:bg-gray-50"
              >
                Assign Staff
              </Button>
            </div>
          ) : t.status === "in-progress" ? (
            <Button
              onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-12 text-[13px] font-semibold"
            >
              <CheckCircle size={16} weight="bold" className="mr-1.5" />
              Mark Complete
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  /* ═══ CHECKLIST DETAIL ═══ */
  const ChecklistDetailScreen = () => {
    if (!selectedChecklist) return null;
    const cl = selectedChecklist;
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <BackNav title="Checklist Review" />
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-[10px] font-bold border-0 rounded-full ${cl.status === "flagged" ? "text-amber-600 bg-amber-50" : "text-[#2E75B6] bg-[#EBF4FC]"}`}>
                {cl.status === "flagged" ? "Flagged" : "Awaiting Review"}
              </Badge>
            </div>
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{cl.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{cl.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{cl.time}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500">{cl.progress}/{cl.total} completed</span>
                <span className="text-[11px] text-gray-500">{Math.round((cl.progress / cl.total) * 100)}%</span>
              </div>
              <Progress value={(cl.progress / cl.total) * 100} className="h-1.5 bg-gray-200 [&>div]:bg-[#EBF4FC]0" />
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="px-5 py-3">
            {cl.items.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 py-3 ${i < cl.items.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.checked ? "bg-emerald-500/20" : "bg-red-100"}`}>
                  {item.checked
                    ? <CheckCircle size={14} className="text-emerald-500" weight="fill" />
                    : <X size={10} className="text-red-500" weight="bold" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] ${item.checked ? "text-gray-300" : "text-red-500 font-medium"}`}>{item.label}</p>
                  {item.note && <p className="text-[11px] text-amber-600 mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Manager Notes</h3>
            <Textarea placeholder="Add review notes..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-12 text-[13px] font-semibold"
            >
              <CheckCircle size={16} weight="bold" className="mr-1.5" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
              className="flex-1 border-red-300 text-red-500 rounded-md h-12 text-[13px] font-semibold bg-white hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /* ═══ MONITOR ═══ */
  const MonitorScreen = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-1">Monitor</h1>
        <p className="text-[12px] text-gray-500">Live temperatures, deliveries & processes</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {/* Temperature Units */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-700">Temperatures</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-gray-400">{tempUnits.filter(u => u.status === "normal").length} OK</span>
              {tempUnits.filter(u => u.status === "alert").length > 0 && <>
                <div className="w-2 h-2 rounded-full bg-red-500 ml-2" />
                <span className="text-[10px] text-red-500">{tempUnits.filter(u => u.status === "alert").length} Alert</span>
              </>}
            </div>
          </div>

          {tempUnits.map(unit => (
            <button
              key={unit.id}
              onClick={() => { setSelectedUnit(unit); go("temp-detail"); }}
              className="w-full flex items-center gap-3 p-3.5 rounded-md bg-white border border-gray-200  cursor-pointer text-left mb-2"
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                unit.status === "alert" ? "bg-red-50" : unit.status === "no-data" ? "bg-gray-100" : "bg-emerald-50"
              }`}>
                <Thermometer size={20} className={
                  unit.status === "alert" ? "text-red-500" : unit.status === "no-data" ? "text-gray-500" : "text-emerald-500"
                } weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900">{unit.name}</p>
                <p className="text-[10px] text-gray-400">{unit.area} &middot; {unit.lastReading}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[16px] font-bold ${
                  unit.status === "alert" ? "text-red-500" : unit.status === "no-data" ? "text-gray-500" : "text-emerald-500"
                }`}>
                  {unit.status === "no-data" ? "—" : `${unit.current}C`}
                </p>
                <p className="text-[10px] text-gray-400">{unit.min} to {unit.max}C</p>
              </div>
            </button>
          ))}
        </div>

        {/* Today's Deliveries */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-700">Today&apos;s Deliveries</h2>
            <span className="text-[10px] text-gray-400">{deliveries.length} received</span>
          </div>

          {deliveries.map(d => (
            <button
              key={d.id}
              onClick={() => { setSelectedDelivery(d); go("delivery-detail"); }}
              className="w-full flex items-center gap-3 p-3.5 rounded-md bg-white border border-gray-200  cursor-pointer text-left mb-2"
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                d.outcome === "rejected" ? "bg-red-50" : d.outcome === "partial" ? "bg-amber-50" : "bg-emerald-50"
              }`}>
                <Truck size={20} className={
                  d.outcome === "rejected" ? "text-red-500" : d.outcome === "partial" ? "text-amber-600" : "text-emerald-500"
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900">{d.supplier}</p>
                <p className="text-[10px] text-gray-400">{d.items} &middot; {d.time}</p>
              </div>
              <Badge className={`text-[10px] font-bold border-0 rounded-full capitalize ${
                d.outcome === "rejected" ? "text-red-500 bg-red-50" : d.outcome === "partial" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"
              }`}>
                {d.outcome}
              </Badge>
            </button>
          ))}
        </div>

        {/* Complaints */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-700">Complaints</h2>
            <span className="text-[10px] text-gray-400">{complaints.filter(c => c.status !== "resolved").length} active</span>
          </div>

          {complaints.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedComplaint(c); go("complaint-detail"); }}
              className="w-full flex items-start gap-3 p-3.5 rounded-md bg-white border border-gray-200  cursor-pointer text-left mb-2"
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${sevBg(c.severity)}`}>
                <Warning size={20} className={sevColor(c.severity)} weight="bold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-medium text-gray-900">{c.title}</p>
                  <Badge className={`text-[9px] font-bold border-0 rounded-full shrink-0 capitalize ${statusColor(c.status)}`}>{c.status}</Badge>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400">{c.customer}</span>
                  <span className="text-[10px] text-gray-600">&middot;</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══ TEMP DETAIL ═══ */
  const TempDetailScreen = () => {
    if (!selectedUnit) return null;
    const u = selectedUnit;
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <BackNav title={u.name} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-5 pb-4">
            {/* Large reading */}
            <div className="flex items-center justify-center flex-col mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${u.status === "alert" ? "bg-red-50 border-2 border-red-300" : "bg-emerald-50 border-2 border-emerald-200"}`}>
                <span className={`text-[32px] font-bold ${u.status === "alert" ? "text-red-500" : "text-emerald-500"}`}>{u.current}C</span>
              </div>
              <p className="text-[13px] text-gray-400 mt-3">{u.area}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-[10px] font-bold border-0 rounded-full ${u.status === "alert" ? "text-red-500 bg-red-50" : "text-emerald-600 bg-emerald-50"}`}>
                  {u.status === "alert" ? "Out of Range" : "In Range"}
                </Badge>
                <span className="text-[10px] text-gray-400">Range: {u.min}C to {u.max}C</span>
              </div>
            </div>

            {/* Today's readings */}
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Today&apos;s Readings</h3>
            {u.readings.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {u.readings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3.5 rounded-md bg-white border border-gray-200 ">
                    <span className="text-[12px] text-gray-500">{r.time}</span>
                    <span className={`text-[14px] font-semibold ${r.temp > u.max || r.temp < u.min ? "text-red-500" : "text-emerald-500"}`}>{r.temp}C</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 flex items-center justify-center">
                <p className="text-[13px] text-gray-500">No readings recorded today</p>
              </div>
            )}
          </div>

          {u.status === "alert" && (
            <div className="px-5 py-3">
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Corrective Action</h3>
              <Textarea placeholder="Describe action taken..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
            </div>
          )}
        </div>

        {u.status === "alert" && (
          <div className="px-5 py-4 bg-white border-t border-gray-200">
            <Button
              onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md h-12 text-[13px] font-semibold"
            >
              <Warning size={16} weight="bold" className="mr-1.5" />
              Log Corrective Action
            </Button>
          </div>
        )}
      </div>
    );
  };

  /* ═══ DELIVERY DETAIL ═══ */
  const DeliveryDetailScreen = () => {
    if (!selectedDelivery) return null;
    const d = selectedDelivery;
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <BackNav title="Delivery" />
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-[10px] font-bold border-0 rounded-full capitalize ${
                d.outcome === "rejected" ? "text-red-500 bg-red-50" : d.outcome === "partial" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"
              }`}>{d.outcome}</Badge>
            </div>
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{d.supplier}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{d.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={12} className="text-gray-500" />
                <span className="text-[12px] text-gray-500">{d.recordedBy}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="px-5 py-4 flex flex-col gap-4">
            <div>
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Items</h3>
              <p className="text-[13px] text-gray-700">{d.items}</p>
            </div>
            {d.temp && (
              <div>
                <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Temperature</h3>
                <p className="text-[13px] text-gray-700">{d.temp}</p>
              </div>
            )}
            {d.notes && (
              <div>
                <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</h3>
                <p className="text-[13px] text-amber-600">{d.notes}</p>
              </div>
            )}
          </div>

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Manager Comments</h3>
            <Textarea placeholder="Add comment..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
              className="flex-1 bg-[#2E75B6] hover:bg-[#255E94] text-white rounded-md h-12 text-[13px] font-semibold"
            >
              <PaperPlaneTilt size={16} weight="bold" className="mr-1.5" />
              Add Comment
            </Button>
            {d.outcome === "partial" && (
              <Button
                variant="outline"
                onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
                className="flex-1 border-amber-300 text-amber-600 rounded-md h-12 text-[13px] font-semibold bg-white hover:bg-amber-50"
              >
                Create Task
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ═══ COMPLAINT DETAIL ═══ */
  const ComplaintDetailScreen = () => {
    if (!selectedComplaint) return null;
    const c = selectedComplaint;
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <BackNav title="Complaint" />
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-[10px] font-bold border-0 rounded-full capitalize ${statusColor(c.status)}`}>{c.status}</Badge>
              <Badge className={`text-[10px] font-bold border-0 rounded-full capitalize ${sevBg(c.severity)} ${sevColor(c.severity)}`}>{c.severity}</Badge>
            </div>
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{c.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[12px] text-gray-500">{c.customer}</span>
              <span className="text-[12px] text-gray-500">&middot;</span>
              <span className="text-[12px] text-gray-500">{c.time}</span>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="px-5 py-4">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{c.description}</p>
          </div>

          {c.linkedTask && (
            <div className="px-5 py-3">
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Linked Task</h3>
              <button
                onClick={() => {
                  const task = tasks.find(t => t.id === c.linkedTask);
                  if (task) { setSelectedTask(task); go("task-detail"); }
                }}
                className="w-full flex items-center gap-3 p-3 rounded-md bg-white border border-gray-200  cursor-pointer text-left"
              >
                <ClipboardText size={16} className="text-[#2E75B6]" />
                <span className="text-[12px] text-[#2E75B6] font-medium">{tasks.find(t => t.id === c.linkedTask)?.title}</span>
                <CaretRight size={12} className="text-gray-600 ml-auto" />
              </button>
            </div>
          )}

          <div className="px-5 py-3">
            <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Investigation Notes</h3>
            <Textarea placeholder="Add investigation notes..." className="bg-gray-50 border-gray-200 text-gray-900 rounded-md text-[13px] min-h-[80px] placeholder:text-gray-400" />
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-t border-gray-200">
          {c.status !== "resolved" ? (
            <div className="flex gap-2">
              <Button
                onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-12 text-[13px] font-semibold"
              >
                Resolve
              </Button>
              {!c.linkedTask && (
                <Button
                  variant="outline"
                  onClick={() => goPin(() => { setHistory([]); setScreen("success"); })}
                  className="flex-1 border-[#7EB2E8] text-[#2E75B6] rounded-md h-12 text-[13px] font-semibold bg-white hover:bg-[#EBF4FC]"
                >
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2">
              <CheckCircle size={16} className="text-emerald-500" weight="fill" />
              <span className="text-[13px] text-emerald-500 font-medium">Resolved</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══ MORE ═══ */
  const MoreScreen = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight mb-1">More</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {/* Modules */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-4">
          {[
            { icon: Fire, label: "Processes", desc: "Cook, reheat, cool records", action: () => go("processes") },
            { icon: Bug, label: "Pest Control", desc: "Inspections & reports", action: () => {} },
            { icon: Buildings, label: "Companies", desc: "Supplier contacts & certs", action: () => {} },
            { icon: ChatDots, label: "Complaints", desc: "Customer complaints log", action: () => go("complaints-list") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer text-left hover:bg-gray-50 ${i < 3 ? "border-b border-gray-100" : ""}`}
            >
              <div className="w-8 h-8 rounded-md bg-[#EBF4FC] flex items-center justify-center">
                <item.icon size={16} className="text-[#2E75B6]" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-medium text-gray-900">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
              <CaretRight size={12} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Activity Log */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block px-0.5">Activity Log</span>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {[
              { user: "Vicki W.", action: "Recorded temp", detail: "Cool Room — 3.2C", time: "10:34 AM", pin: "PIN ****2847" },
              { user: "Adele C.", action: "Submitted checklist", detail: "Kitchen — Morning Prep", time: "10:12 AM", pin: "PIN ****1923" },
              { user: "Jake M.", action: "Started timer", detail: "Chicken Broth — 2hrs", time: "9:58 AM", pin: "PIN ****4401" },
              { user: "Adele C.", action: "Logged delivery", detail: "Metro Foods — Partial", time: "9:30 AM", pin: "PIN ****1923" },
              { user: "Vicki W.", action: "Completed task", detail: "Sanitiser restock", time: "9:15 AM", pin: "PIN ****2847" },
              { user: "Jake M.", action: "Printed label", detail: "Prep — Buffalo Cheese x2", time: "8:50 AM", pin: "PIN ****4401" },
            ].map((log, i, arr) => (
              <div key={i} className={`flex items-start gap-3 px-3.5 py-2.5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[8px] font-bold text-gray-500">{log.user.split(" ").map(w => w[0]).join("")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-900"><span className="font-medium">{log.user}</span> {log.action}</p>
                  <p className="text-[10px] text-gray-400">{log.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] text-gray-400">{log.time}</p>
                  <p className="text-[9px] text-gray-300 font-mono">{log.pin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 p-3.5 rounded-md bg-white border border-gray-200 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#2E75B6] flex items-center justify-center">
            <span className="text-[11px] font-bold text-white">SM</span>
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-medium text-gray-900">Sarah Mitchell</p>
            <p className="text-[10px] text-gray-400">Manager &middot; Main Kitchen</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══ NOTIFICATIONS ═══ */
  const NotificationsScreen = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <BackNav title="Notifications" />
      <div className="flex-1 overflow-y-auto px-4 pt-2">
        {[
          { icon: Thermometer, color: "text-red-500", bg: "bg-red-50", title: "Grill U/B Fridge at 8.1C", desc: "Above 5C threshold", time: "5 min ago" },
          { icon: ListChecks, color: "text-[#2E75B6]", bg: "bg-[#EBF4FC]", title: "Checklist submitted", desc: "Larder — Mid Day Cleaning by Vicki", time: "22 min ago" },
          { icon: Truck, color: "text-amber-600", bg: "bg-amber-50", title: "Partial delivery — Metro Foods", desc: "Missing items flagged", time: "1 hr ago" },
          { icon: Warning, color: "text-red-500", bg: "bg-red-50", title: "Allergen complaint logged", desc: "Table 12 — undisclosed dairy", time: "Yesterday" },
          { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", title: "Task completed", desc: "Sanitiser restocked — Jake", time: "2 days ago" },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-3.5 rounded-md bg-white border border-gray-200  mb-2">
            <div className={`w-9 h-9 rounded-full ${n.bg} flex items-center justify-center shrink-0`}>
              <n.icon size={18} className={n.color} weight="bold" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-900">{n.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{n.desc}</p>
              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ═══ PIN ═══ */
  const PinScreen = () => {
    const handlePinKey = (key: string) => {
      if (key === "back") { setPinDigits(v => v.slice(0, -1)); return; }
      if (key === "") return;
      const next = pinDigits + key;
      setPinDigits(next);
      if (next.length === 4 && pinCallback) {
        setTimeout(() => { pinCallback(); setPinCallback(null); setPinDigits(""); }, 200);
      }
    };
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-950">
        <div className="text-[16px] font-semibold text-gray-900 mb-6 tracking-tight">Enter PIN</div>
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < pinDigits.length ? "bg-[#2E75B6]" : "border-2 border-gray-300"}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 w-[220px]">
          {["1","2","3","4","5","6","7","8","9","","0","back"].map(k => (
            <button
              key={k}
              onClick={() => handlePinKey(k)}
              disabled={k === ""}
              className={`h-[52px] rounded-md text-[20px] font-medium text-gray-900 cursor-pointer transition-colors ${
                k === "" ? "opacity-0 cursor-default" : k === "back" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {k === "back" ? <Backspace size={20} className="text-gray-500 mx-auto" /> : k}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ═══ SUCCESS ═══ */
  const SuccessScreen = () => (
    <div className="flex flex-col h-full items-center justify-center bg-white">
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle size={36} className="text-emerald-500" weight="fill" />
      </div>
      <div className="text-[18px] font-semibold text-gray-900 mt-4 tracking-tight">Done</div>
      <p className="text-[13px] text-gray-500 mt-1">Action completed successfully</p>
      <button
        onClick={() => { setHistory([]); setScreen("home"); setBottomTab("home"); }}
        className="mt-6 px-6 py-2.5 rounded-md bg-[#2E75B6] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#255E94] transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  /* ═══ ROUTER ═══ */
  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen />;
      case "tasks": return <TasksScreen />;
      case "task-detail": return <TaskDetailScreen />;
      case "checklist-detail": return <ChecklistDetailScreen />;
      case "monitor": return <MonitorScreen />;
      case "temp-detail": return <TempDetailScreen />;
      case "delivery-detail": return <DeliveryDetailScreen />;
      case "complaint-detail": return <ComplaintDetailScreen />;
      case "more": return <MoreScreen />;
      case "notifications": return <NotificationsScreen />;
      case "pin": return <PinScreen />;
      case "success": return <SuccessScreen />;
      default: return <HomeScreen />;
    }
  };

  const showBottomNav = !["pin", "success", "task-detail", "checklist-detail", "temp-detail", "delivery-detail", "complaint-detail", "notifications"].includes(screen);

  /* ═══ FRAME ═══ */
  const ipadW = 1024;
  const ipadH = 668;

  return (
    <div className="min-h-screen bg-[#0A0A12] font-sans text-slate-200">
      {/* ─── Site nav bar ─── */}
      <nav className="flex items-center gap-4 px-6 py-3 border-b border-[#1A1A28]">
        <Link
          href="/projects/hospitality-safe"
          className="flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#1A1A28] transition-colors"
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
        <span className="text-[13px] font-semibold text-slate-200">Manager</span>
      </nav>

      {/* ─── Viewport toggle ─── */}
      <div className="flex items-center justify-center pt-6 pb-2 gap-1">
        <button
          onClick={() => setViewport("mobile")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-l-xl text-[12px] font-semibold cursor-pointer transition-colors ${
            viewport === "mobile" ? "bg-[#2E75B6] text-white" : "bg-[#1A1A28] text-slate-400 hover:text-slate-200"
          }`}
        >
          <Phone size={14} weight={viewport === "mobile" ? "fill" : "regular"} />
          Mobile
        </button>
        <button
          onClick={() => setViewport("ipad")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-r-xl text-[12px] font-semibold cursor-pointer transition-colors ${
            viewport === "ipad" ? "bg-[#2E75B6] text-white" : "bg-[#1A1A28] text-slate-400 hover:text-slate-200"
          }`}
        >
          <DeviceTablet size={14} weight={viewport === "ipad" ? "fill" : "regular"} />
          iPad
        </button>
      </div>

      {/* ─── Device Frame ─── */}
      <div className="flex items-center justify-center py-6">
        {viewport === "mobile" ? (
          /* iPhone 17 Pro */
          <div className="relative" style={{ width: 410, height: 856 }}>
            {/* Frame */}
            <div className="absolute inset-0 rounded-[62px] bg-[#1a1a1f] border border-[#5a5a65]" />

            {/* Side buttons — left */}
            <div className="absolute left-[-2px] top-[155px] w-[3px] h-[28px] rounded-l-sm bg-[#5a5a65]" />
            <div className="absolute left-[-2px] top-[220px] w-[3px] h-[50px] rounded-l-sm bg-[#5a5a65]" />
            <div className="absolute left-[-2px] top-[282px] w-[3px] h-[50px] rounded-l-sm bg-[#5a5a65]" />
            {/* Power — right */}
            <div className="absolute right-[-2px] top-[248px] w-[3px] h-[66px] rounded-r-sm bg-[#5a5a65]" />

            {/* Screen */}
            <div className="absolute rounded-[52px] overflow-hidden bg-white" style={{ top: 10, left: 10, width: 390, height: 836 }}>
              <div className="flex flex-col h-full">
                <StatusBar />
                <div className="flex-1 overflow-hidden">
                  {renderScreen()}
                </div>
                {showBottomNav && <BottomNav />}
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-full bg-black/15 z-20" />
          </div>
        ) : (
          /* iPad frame */
          <div className="relative rounded-[32px] border-[3px] border-white/20 bg-[#0b0b0b] p-[23px]" style={{ width: ipadW + 46, height: ipadH + 46 }}>
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#333]" />
            <div className="rounded-[14px] overflow-hidden bg-white" style={{ width: ipadW, height: ipadH }}>
              <div className="flex flex-col h-full">
                <StatusBar />
                <div className="flex-1 overflow-hidden">
                  {renderScreen()}
                </div>
                {showBottomNav && <BottomNav />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

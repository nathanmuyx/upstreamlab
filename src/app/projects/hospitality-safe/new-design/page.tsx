"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  CaretLeft,
  CaretRight,
  Timer,
  Thermometer,
  Printer,
  Truck,
  Fire,
  CheckCircle,
  Camera,
  Backspace,
  ClipboardText,
  Plus,
  CaretDown,
  Warning,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ─── UpstreamLogo ─── */
function UpstreamLogo({ size = 18 }: { size?: number }) {
  const h = size * (669.96 / 608.44);
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={size} height={h}>
      <path
        d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z"
        fill="url(#upNewDesign)"
      />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upNewDesign" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" />
          <stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════ */
export default function NewDesignPage() {
  const [screen, setScreen] = useState("dashboard");
  const [history, setHistory] = useState<string[]>([]);
  const [pinCallback, setPinCallback] = useState<(() => void) | null>(null);
  const [pinDigits, setPinDigits] = useState("");
  const [checklistChecked, setChecklistChecked] = useState<boolean[]>([true, true, true, false, false, false, false]);
  const [selectedTimerCategory, setSelectedTimerCategory] = useState("Stock");
  const [selectedLabelTab, setSelectedLabelTab] = useState("Prep");
  const [selectedProcessType, setSelectedProcessType] = useState("Cook");
  const [labelCount, setLabelCount] = useState(2);
  const [tempInput, setTempInput] = useState("3.2");
  const [deliveryMeat, setDeliveryMeat] = useState("Meat");
  const [deliveryQuality, setDeliveryQuality] = useState("Acceptable");
  const [deliveryQuantity, setDeliveryQuantity] = useState("Acceptable");
  const [deliveryOutcome, setDeliveryOutcome] = useState("Accepted");
  const [dashFilter, setDashFilter] = useState<"all" | "timers" | "checklists" | "temps">("all");

  const go = useCallback((s: string) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  }, [screen]);

  const back = useCallback(() => {
    setHistory((h) => {
      const copy = [...h];
      const prev = copy.pop() || "dashboard";
      setScreen(prev);
      return copy;
    });
  }, []);

  const goPin = useCallback((cb: () => void) => {
    setPinCallback(() => cb);
    setPinDigits("");
    setHistory((h) => [...h, screen]);
    setScreen("pin");
  }, [screen]);

  /* ─── Back header ─── */
  const BackHeader = ({ title }: { title: string }) => (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5 sticky top-0 z-10">
      <Button variant="ghost" size="sm" onClick={back} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 -ml-2">
        <CaretLeft size={14} className="text-gray-400" weight="bold" />
        {title}
      </Button>
    </div>
  );

  /* ═══ Dashboard ═══ */
  const DashboardScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-[14px]">Hospitality Safe</span>
          <Separator orientation="vertical" className="h-4 bg-gray-600" />
          <span className="text-gray-400 text-[12px]">Kitchen iPad · Vicki Warburton</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => go("temp-list")}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-red-400 text-[12px] font-bold">1 Alert</span>
          </button>
          <span className="text-gray-500 text-[12px]">8:09 AM</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Quick action buttons — muted, monochrome */}
        <div className="flex gap-2 mb-4">
          {[
            { label: "Add Timer", icon: <Timer size={20} weight="light" />, action: () => go("timer-start") },
            { label: "Record Temp", icon: <Thermometer size={20} weight="light" />, action: () => go("temp-list") },
            { label: "Print Label", icon: <Printer size={20} weight="light" />, action: () => go("labels") },
            { label: "Process", icon: <Fire size={20} weight="light" />, action: () => go("processes") },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.action}
              className="flex-1 flex flex-col items-center py-3 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {a.icon}
              <span className="mt-1 text-[10px] font-medium">{a.label}</span>
            </button>
          ))}
        </div>

        {/* 2-column grid: Timers + Temperatures */}
        <div className="grid grid-cols-2 gap-4">

          {/* Active Timers — analog tick-mark clock style */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-gray-900">Active Timers</span>
              <span className="text-[10px] text-gray-400">4</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Rebelled Dough", time: "02:15", sub: "Hrs Remaining", progress: 56, by: "Vicki · 9:45" },
                { name: "Chicken Broth", time: "00:12", sub: "Mins Remaining", progress: 10, by: "Adele · 8:30" },
                { name: "Rice", time: "00:00", sub: "Expired", progress: 100, by: "Vicki · 7:00" },
                { name: "Salmon", time: "03:46", sub: "Paused", progress: 94, by: "— · 9:15" },
              ].map((t) => {
                const TICKS = 60;
                const filledTicks = Math.round((t.progress / 100) * TICKS);
                return (
                  <button
                    key={t.name}
                    onClick={() => go("timer-detail")}
                    className="flex flex-col items-center p-3 rounded-2xl bg-white hover:shadow-lg transition-all cursor-pointer"
                  >
                    {/* Analog tick-mark circle */}
                    <div className="relative w-[110px] h-[110px]">
                      <svg className="w-full h-full" viewBox="0 0 120 120">
                        {Array.from({ length: TICKS }).map((_, i) => {
                          const angle = (i / TICKS) * 360 - 90;
                          const rad = (angle * Math.PI) / 180;
                          const isFilled = i < filledTicks;
                          const isLong = i % 5 === 0;
                          const outer = 56;
                          const inner = isLong ? 46 : 49;
                          return (
                            <line
                              key={i}
                              x1={60 + Math.cos(rad) * inner}
                              y1={60 + Math.sin(rad) * inner}
                              x2={60 + Math.cos(rad) * outer}
                              y2={60 + Math.sin(rad) * outer}
                              stroke={isFilled ? "#374151" : "#e5e7eb"}
                              strokeWidth={isLong ? 2 : 1.2}
                              strokeLinecap="round"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[20px] font-semibold tabular-nums tracking-tight text-gray-900">{t.time}</span>
                        <span className="text-[8px] text-gray-400 mt-0.5">{t.sub}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-gray-900 mt-1.5">{t.name}</span>
                    <span className="text-[9px] text-gray-400">{t.by}</span>
                  </button>
                );
              })}
            </div>
            {/* Cooling — inline with small tick ring */}
            <button onClick={() => go("cool-process")} className="mt-3 w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer">
              <div className="relative w-[40px] h-[40px] flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 50 50">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const angle = (i / 30) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const filled = i < 23;
                    return (
                      <line key={i} x1={25 + Math.cos(rad) * 18} y1={25 + Math.sin(rad) * 18} x2={25 + Math.cos(rad) * 22} y2={25 + Math.sin(rad) * 22}
                        stroke={filled ? "#374151" : "#e5e7eb"} strokeWidth={1.5} strokeLinecap="round" />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-gray-700 tabular-nums">1:32</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-medium text-gray-900">Broccoli — Cooling</div>
                <div className="text-[9px] text-gray-400">Stage 1 · 1:32 remaining</div>
              </div>
            </button>
          </div>

          {/* Temperature Units */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-gray-900">Temperature Units</span>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-red-500">1 alert</span>
            </div>
            <Card className="py-0 overflow-hidden rounded-xl">
              <CardContent className="p-0">
                {[
                  { name: "Grill U/B Fridge", temp: "8.1°C", note: "Alert!", indicatorClass: "bg-red-400", isAlert: true, noteClass: "text-red-400" },
                  { name: "Cool Room", temp: "3.2°C", note: "2hrs ago", indicatorClass: "bg-gray-400", isAlert: false, noteClass: "text-gray-400" },
                  { name: "Upright Freezer 1", temp: "-18°C", note: "1hr ago", indicatorClass: "bg-gray-400", isAlert: false, noteClass: "text-gray-400" },
                  { name: "Larder U/B Fridge", temp: "2.8°C", note: "30min ago", indicatorClass: "bg-gray-400", isAlert: false, noteClass: "text-gray-400" },
                  { name: "Pasta Draw Fridge", temp: "", note: "No data today", indicatorClass: "bg-gray-200", isAlert: false, noteClass: "text-gray-300" },
                  { name: "Pans/Fryer U/B Fridge", temp: "1.9°C", note: "45min ago", indicatorClass: "bg-gray-400", isAlert: false, noteClass: "text-gray-400" },
                ].map((u, i) => (
                  <button key={u.name} onClick={() => go("temp-list")} className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${u.isAlert ? "bg-red-50/50" : ""} ${i > 0 ? "border-t border-gray-50" : ""}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.indicatorClass}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-gray-900 truncate">{u.name}</div>
                      <div className={`text-[10px] ${u.noteClass}`}>{u.temp ? `${u.temp} · ${u.note}` : u.note}</div>
                    </div>
                    <CaretRight size={12} className="text-gray-200" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );

  /* ═══ Timer Start ═══ */
  const categories = ["Stock", "Pastry", "Prep"];
  const timersByCategory: Record<string, { name: string; duration: string }[]> = {
    Stock: [
      { name: "Rebelled Dough", duration: "4 hrs" },
      { name: "Chicken Broth", duration: "2 hrs" },
      { name: "Fish Stock", duration: "3 hrs" },
    ],
    Pastry: [
      { name: "Croissant Proof", duration: "1 hr" },
      { name: "Sourdough Rise", duration: "6 hrs" },
    ],
    Prep: [
      { name: "Marinate Chicken", duration: "2 hrs" },
      { name: "Brine Turkey", duration: "8 hrs" },
    ],
  };

  const [timerHours, setTimerHours] = useState(4);
  const [timerMins, setTimerMins] = useState(0);
  const hoursArr = Array.from({ length: 24 }, (_, i) => i);
  const minsArr = Array.from({ length: 60 }, (_, i) => i);

  /* iOS-style scroll drum — big numbers, scale by distance */
  const ScrollDrum = ({ values, selected, onSelect, label }: { values: number[]; selected: number; onSelect: (v: number) => void; label: string }) => {
    const ROW = 52;
    const VISIBLE = 7;
    const containerRef = useRef<HTMLDivElement>(null);
    const midIdx = values.indexOf(selected);

    useEffect(() => {
      const el = containerRef.current;
      if (el) el.scrollTop = midIdx * ROW;
    }, []);

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ROW);
      if (idx >= 0 && idx < values.length && values[idx] !== selected) onSelect(values[idx]);
    };

    return (
      <div className="flex flex-col items-center w-[100px]">
        <div className="relative overflow-hidden" style={{ height: ROW * VISIBLE }}>
          {/* Fade top/bottom */}
          <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div
            ref={containerRef}
            className="h-full overflow-y-auto relative z-[1]"
            style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
            onScroll={handleScroll}
          >
            {/* Top spacer to center first item */}
            <div style={{ height: ROW * 3 }} />
            {values.map((v) => {
              const dist = Math.abs(v - selected);
              const fontSize = dist === 0 ? 44 : dist === 1 ? 32 : dist === 2 ? 24 : 20;
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;
              const weight = dist === 0 ? 700 : dist === 1 ? 600 : 400;
              return (
                <div
                  key={v}
                  className="flex items-center justify-center cursor-pointer select-none"
                  style={{ height: ROW, scrollSnapAlign: "center", fontSize, opacity, fontWeight: weight, transition: "all 0.15s ease" }}
                  onClick={() => {
                    onSelect(v);
                    containerRef.current?.scrollTo({ top: values.indexOf(v) * ROW, behavior: "smooth" });
                  }}
                >
                  {String(v).padStart(2, "0")}
                </div>
              );
            })}
            <div style={{ height: ROW * 3 }} />
          </div>
        </div>
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">{label}</span>
      </div>
    );
  };

  const TimerStartScreen = () => (
    <div className="flex flex-col h-full bg-white">
      <BackHeader title="Start Timer" />
      <div className="flex-1 flex gap-6 p-5">
        {/* Left — Food selection */}
        <div className="w-[200px] flex flex-col border-r border-gray-100 pr-5">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</div>
          <div className="flex gap-1.5 mb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTimerCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  selectedTimerCategory === cat ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Food item</div>
          <div className="flex flex-col gap-1 overflow-y-auto">
            {(timersByCategory[selectedTimerCategory] || []).map((t) => (
              <button
                key={t.name}
                onClick={() => go("timer-label")}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-[12px] font-medium text-gray-900"
              >
                {t.name}
                <span className="text-gray-400 ml-1.5">· {t.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Scroll drum picker */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center gap-0">
            <ScrollDrum values={hoursArr} selected={timerHours} onSelect={setTimerHours} label="hours" />
            <span className="text-[40px] font-bold text-gray-200 -mt-6">:</span>
            <ScrollDrum values={minsArr} selected={timerMins} onSelect={setTimerMins} label="mins" />
          </div>
          <Button
            onClick={() => go("timer-label")}
            className="mt-6 rounded-xl px-12 py-3 text-[14px] font-semibold"
            disabled={timerHours === 0 && timerMins === 0}
          >
            Start Timer
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Timer Label ═══ */
  const TimerLabelScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Label" />
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
        <p className="text-[18px] font-semibold text-gray-900 tracking-tight">Print a label for this batch?</p>
        <div className="flex flex-col gap-2.5 w-72">
          <Button
            onClick={() => goPin(() => go("timer-detail"))}
            size="lg"
            className="rounded-xl text-[13px] font-semibold"
          >
            Print Label
          </Button>
          <Button
            variant="outline"
            onClick={() => goPin(() => go("timer-detail"))}
            size="lg"
            className="rounded-xl text-[13px] font-medium"
          >
            No Label
          </Button>
          <Button
            variant="ghost"
            onClick={back}
            size="lg"
            className="rounded-xl text-[13px] font-medium text-gray-400 hover:text-gray-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Timer Detail ═══ */
  const TimerDetailScreen = () => (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Back header — dark variant */}
      <div className="px-5 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={back} className="text-gray-400 hover:text-white -ml-2">
          <CaretLeft size={14} weight="bold" />
          <span className="text-[13px]">Back</span>
        </Button>
        <span className="text-[12px] text-gray-500">Rebelled Dough</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Rounded-rect progress track (Apple Watch style) */}
        <div className="relative w-[280px] h-[160px] mb-6">
          <svg className="w-full h-full" viewBox="0 0 280 160">
            {/* Track */}
            <rect x="8" y="8" width="264" height="144" rx="40" fill="none" stroke="#1f2937" strokeWidth="12" />
            {/* Progress */}
            <rect x="8" y="8" width="264" height="144" rx="40" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round"
              strokeDasharray="720" strokeDashoffset="317"
              className="transition-all duration-1000"
            />
          </svg>
          {/* Pause icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-[6px] h-[28px] rounded-full bg-white/60" />
              <div className="w-[6px] h-[28px] rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        {/* Timer label + time */}
        <span className="text-[13px] text-gray-500 font-medium">Timer</span>
        <span className="text-[56px] font-bold tabular-nums tracking-tight text-white mt-1">02:15:00</span>
        <span className="text-[12px] text-gray-500 mt-1">Started by Vicki · 9:45 AM</span>

        {/* Actions — separated with confirmation safety */}
        <div className="flex flex-col gap-2 w-full max-w-[320px] mt-8">
          <Button
            variant="outline"
            className="w-full rounded-xl py-3.5 text-[14px] font-semibold bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            Pause Timer
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl py-3 text-[12px] font-medium bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Print Label
            </Button>
            <Button
              className="flex-1 rounded-xl py-3 text-[12px] font-medium bg-amber-600 hover:bg-amber-500 text-white"
            >
              Restart
            </Button>
          </div>
          <Button
            variant="destructive"
            className="w-full rounded-xl py-3 text-[12px] font-semibold mt-2"
            onClick={() => goPin(() => go("success-generic"))}
          >
            Finish Timer
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Labels ═══ */
  const labelTabs = ["Prep", "Opened", "Defrost", "Freeze", "Custom"];
  const labelCategories = ["Seafood", "Cocktails", "Dairy", "Meat", "Sauces", "Pizza Prep", "Pasta", "Desserts", "Vegetables", "Fryer"];

  const LabelsScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Labels" />
      <Tabs value={selectedLabelTab} onValueChange={setSelectedLabelTab} className="flex flex-col flex-1">
        <div className="px-5 pt-4">
          <TabsList>
            {labelTabs.map((t) => (
              <TabsTrigger key={t} value={t}>{t}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        {labelTabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="flex-1 p-5 mt-0">
            <div className="grid grid-cols-5 gap-3">
              {labelCategories.map((cat) => (
                <Button
                  key={cat}
                  variant="ghost"
                  onClick={() => go("label-foods")}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-2xl p-4 h-auto text-[14px] font-semibold"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  /* ═══ Label Foods ═══ */
  const foods = ["Buffalo Cheese", "Burrata", "Butter Cut", "Grana Padano", "Chilli Butter", "Anchovy Cream"];

  const LabelFoodsScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Dairy" />
      <div className="flex-1 p-5">
        <div className="grid grid-cols-5 gap-3">
          {foods.map((f) => (
            <Button
              key={f}
              variant="outline"
              onClick={() => go("label-preview")}
              className="rounded-2xl p-4 h-auto text-[14px] font-semibold text-gray-900 hover:bg-gray-50"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══ Label Preview ═══ */
  const LabelPreviewScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Label Preview" />
      <div className="flex-1 flex gap-8 p-6 items-start">
        {/* Label card */}
        <Card className="flex-1 max-w-sm">
          <CardContent className="p-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest mb-4 pb-3 border-b border-gray-100 text-gray-400">PREP LABEL</div>
            <div className="space-y-3 text-[13px]">
              <div><span className="text-gray-400">Food:</span> <span className="font-semibold text-gray-900">Buffalo Cheese</span></div>
              <div><span className="text-gray-400">Prepared by:</span> <span className="font-semibold text-gray-900">Vicki Warburton</span></div>
              <div><span className="text-gray-400">Date:</span> <span className="font-semibold text-gray-900">19/03/2026</span></div>
              <div><span className="text-gray-400">Use by:</span> <span className="font-semibold text-gray-900">21/03/2026</span></div>
            </div>
          </CardContent>
        </Card>
        {/* Controls */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-[14px] font-semibold text-gray-900 mb-3">Number of labels</div>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4].map((n) => (
                <Button
                  key={n}
                  variant={labelCount === n ? "default" : "outline"}
                  onClick={() => setLabelCount(n)}
                  className={`w-14 h-14 rounded-xl font-bold text-[18px] ${
                    labelCount === n ? "shadow-md" : "shadow-sm hover:shadow-md"
                  }`}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={() => goPin(() => go("success-label"))}
            className="rounded-xl text-[13px] font-semibold"
          >
            Print Labels
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Success Label ═══ */
  const SuccessLabelScreen = () => (
    <div className="flex flex-col h-full items-center justify-center bg-muted/50">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-500" weight="fill" />
      </div>
      <div className="text-[20px] font-semibold text-gray-900 mt-5 tracking-tight">Printing {labelCount} labels</div>
      <p className="text-[14px] text-gray-400 mt-1.5">Buffalo Cheese · Prep Label · by Vicki</p>
      <Button
        onClick={() => { setHistory([]); setScreen("dashboard"); }}
        className="mt-8 rounded-xl text-[13px] font-semibold"
      >
        Back to Dashboard
      </Button>
    </div>
  );

  /* ═══ Temperature List ═══ */
  const tempUnits = [
    { name: "Grill U/B Fridge", temp: "8.1°C", note: "Alert!", indicatorClass: "bg-red-500", isAlert: true, noteClass: "text-red-600" },
    { name: "Cool Room", temp: "3.2°C", note: "2hrs ago", indicatorClass: "bg-emerald-500", isAlert: false, noteClass: "text-gray-400" },
    { name: "Upright Freezer 1", temp: "-18°C", note: "1hr ago", indicatorClass: "bg-emerald-500", isAlert: false, noteClass: "text-gray-400" },
    { name: "Larder U/B Fridge", temp: "2.8°C", note: "30min ago", indicatorClass: "bg-emerald-500", isAlert: false, noteClass: "text-gray-400" },
    { name: "Pasta Draw Fridge", temp: "", note: "No data today", indicatorClass: "bg-gray-300", isAlert: false, noteClass: "text-gray-400" },
    { name: "Pans/Fryer U/B Fridge", temp: "1.9°C", note: "45min ago", indicatorClass: "bg-emerald-500", isAlert: false, noteClass: "text-gray-400" },
  ];

  const TempListScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Temperature Units" />
      <div className="flex-1 flex items-start justify-center p-6">
        <Card className="w-full max-w-lg py-0 overflow-hidden">
          <CardContent className="p-0 divide-y divide-gray-50">
            {tempUnits.map((u) => (
              <button
                key={u.name}
                onClick={() => go("temp-method")}
                className={`flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-muted/50 transition-colors cursor-pointer ${u.isAlert ? "bg-red-50/60" : ""}`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.indicatorClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-gray-900">{u.name}</div>
                  <div className={`text-[11px] mt-0.5 ${u.noteClass}`}>{u.temp ? `${u.temp} · ${u.note}` : u.note}</div>
                </div>
                <CaretRight size={14} className="text-gray-300" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /* ═══ Temperature Method ═══ */
  const TempMethodScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Record Temperature" />
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
        <div className="text-[18px] font-semibold text-gray-900 tracking-tight">How are you recording?</div>
        <Button
          onClick={() => go("temp-manual")}
          size="lg"
          className="w-72 rounded-xl text-[13px] font-semibold"
        >
          Bluetooth Thermometer
        </Button>
        <Button
          variant="outline"
          onClick={() => go("temp-manual")}
          size="lg"
          className="w-72 rounded-xl text-[13px] font-medium"
        >
          Manual Entry
        </Button>
      </div>
    </div>
  );

  /* ═══ Temperature Manual ═══ */
  const TempManualScreen = () => {
    const handleKey = (key: string) => {
      if (key === "back") {
        setTempInput((v) => v.slice(0, -1));
      } else if (key === ".") {
        if (!tempInput.includes(".")) setTempInput((v) => v + ".");
      } else {
        setTempInput((v) => v + key);
      }
    };

    return (
      <div className="flex flex-col h-full bg-muted/50">
        <BackHeader title="Manual Entry" />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card className="mb-5 py-0">
            <CardContent className="px-10 py-5 text-center min-w-[220px]">
              <span className="text-[48px] font-bold text-gray-900 tabular-nums tracking-tighter">{tempInput || "0"}</span>
              <span className="text-[20px] font-semibold text-gray-400 ml-1">°C</span>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-2.5 mb-5 w-[260px]">
            {["1","2","3","4","5","6","7","8","9",".","0","back"].map((k) => (
              <Button
                key={k}
                variant={k === "back" ? "ghost" : "outline"}
                onClick={() => handleKey(k)}
                className="h-[56px] rounded-xl text-[24px] font-medium"
              >
                {k === "back" ? <Backspace size={24} className="text-gray-500" /> : k}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => goPin(() => go("temp-success"))}
            className="rounded-xl text-[13px] font-semibold"
          >
            Record Temperature
          </Button>
        </div>
      </div>
    );
  };

  /* ═══ Temperature Success ═══ */
  const TempSuccessScreen = () => (
    <div className="flex flex-col h-full items-center justify-center bg-muted/50">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-500" weight="fill" />
      </div>
      <div className="text-[20px] font-semibold text-gray-900 mt-5 tracking-tight">{tempInput || "3.2"}°C — In range</div>
      <p className="text-[14px] text-gray-400 mt-1.5">Cool Room · Saved</p>
      <Button
        onClick={() => { setHistory([]); setScreen("dashboard"); }}
        className="mt-8 rounded-xl text-[13px] font-semibold"
      >
        Back to Dashboard
      </Button>
    </div>
  );

  /* ═══ Processes ═══ */
  const processTypes = ["Cook", "Reheat", "Cool"];

  const ProcessesScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Process" />
      <div className="flex-1 flex gap-8 p-6 items-start">
        <div className="flex flex-col gap-3 w-48">
          {processTypes.map((p) => (
            <Button
              key={p}
              variant={selectedProcessType === p ? "default" : "outline"}
              onClick={() => {
                setSelectedProcessType(p);
                if (p === "Cool") go("cool-process");
              }}
              className={`rounded-2xl text-[13px] font-semibold ${
                selectedProcessType !== p ? "shadow-sm hover:shadow-md" : ""
              }`}
            >
              {p}
            </Button>
          ))}
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Food</div>
            <Card className="py-0">
              <CardContent className="px-4 py-3">
                <span className="text-[14px] font-semibold text-gray-900">Chicken Breast</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-5">
          <Card className="py-0">
            <CardContent className="px-10 py-5 text-center min-w-[220px]">
              <span className="text-[48px] font-bold text-gray-900 tabular-nums tracking-tighter">75.0</span>
              <span className="text-[20px] font-semibold text-gray-400 ml-1">°C</span>
            </CardContent>
          </Card>
          <p className="text-[13px] text-gray-400">Must reach ≥ 75°C to pass</p>
          <Button
            onClick={() => goPin(() => go("success-generic"))}
            className="rounded-xl text-[13px] font-semibold"
          >
            Record
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Cool Process ═══ */
  const CoolProcessScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Cooling Process" />
      <div className="flex-1 flex gap-8 p-6 items-start">
        <div className="flex flex-col items-center">
          {/* Custom CSS ring — no shadcn equivalent */}
          <div className="w-[160px] h-[160px] rounded-full border-[6px] border-amber-400 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[48px] font-bold tabular-nums tracking-tighter text-gray-900">1:32</div>
              <div className="text-[13px] text-gray-400 mt-1">Stage 1</div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[13px] text-gray-600">Cooking temp: <span className="font-semibold text-gray-900">82°C</span></div>
              <div className="text-[13px] mt-1.5 text-gray-600">Target: <span className="font-semibold text-gray-900">≤ 21°C within 2 hours</span></div>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[13px] text-gray-600">Status:</span>
                <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-semibold">In progress</Badge>
              </div>
              <Button
                onClick={() => goPin(() => go("success-generic"))}
                className="mt-4 w-full rounded-xl text-[13px] font-semibold"
              >
                Take Stage 1 Temperature
              </Button>
            </CardContent>
          </Card>
          <Card className="py-0 opacity-40">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-gray-400">Stage 2</span>
                <Badge variant="secondary" className="text-[10px] font-semibold">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  /* ═══ Delivery Form ═══ */
  const goodsTypes = ["Meat", "Poultry", "Fruit/Veg", "Dried", "Frozen", "Seafood", "Dairy", "Other"];

  const DeliveryFormScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Log Delivery" />
      <div className="flex-1 flex gap-5 p-6 overflow-y-auto">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Supplier</div>
              <Select>
                <SelectTrigger className="rounded-xl text-[13px]">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metro">Metro Foods</SelectItem>
                  <SelectItem value="sysco">Sysco</SelectItem>
                  <SelectItem value="local">Local Farm Co</SelectItem>
                  <SelectItem value="seafresh">Seafresh Ltd</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Goods type</div>
              <div className="flex flex-wrap gap-2">
                {goodsTypes.map((g) => (
                  <Button
                    key={g}
                    variant={deliveryMeat === g ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setDeliveryMeat(g)}
                    className="rounded-xl text-[13px] font-medium"
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Quality</div>
              <div className="flex gap-2.5">
                {["Acceptable", "Unacceptable"].map((q) => (
                  <Button
                    key={q}
                    variant={deliveryQuality === q ? "default" : "secondary"}
                    onClick={() => setDeliveryQuality(q)}
                    className={`flex-1 rounded-xl text-[13px] font-semibold ${
                      deliveryQuality === q
                        ? q === "Acceptable"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                  >
                    {q}
                  </Button>
                ))}
              </div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 mt-4">Quantity</div>
              <div className="flex gap-2.5">
                {["Acceptable", "Unacceptable"].map((q) => (
                  <Button
                    key={q}
                    variant={deliveryQuantity === q ? "default" : "secondary"}
                    onClick={() => setDeliveryQuantity(q)}
                    className={`flex-1 rounded-xl text-[13px] font-semibold ${
                      deliveryQuantity === q
                        ? q === "Acceptable"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right column */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Punctuality</div>
              <Select>
                <SelectTrigger className="rounded-xl text-[13px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-time">On Time</SelectItem>
                  <SelectItem value="early">Early</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <Button variant="secondary" className="w-full rounded-xl text-[13px] font-medium">
                <Plus size={14} weight="bold" className="mr-1.5" />
                Add Temperature
              </Button>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Photo</div>
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center hover:border-gray-300 transition-colors cursor-pointer">
                <Camera size={24} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Outcome</div>
              <div className="flex gap-2">
                {[
                  { label: "Rejected", activeClass: "bg-red-500 hover:bg-red-600 text-white" },
                  { label: "Partial", activeClass: "bg-amber-500 hover:bg-amber-600 text-white" },
                  { label: "Accepted", activeClass: "bg-emerald-500 hover:bg-emerald-600 text-white" },
                ].map((o) => (
                  <Button
                    key={o.label}
                    variant={deliveryOutcome === o.label ? "default" : "secondary"}
                    onClick={() => setDeliveryOutcome(o.label)}
                    className={`flex-1 rounded-xl text-[13px] font-semibold ${
                      deliveryOutcome === o.label ? o.activeClass : ""
                    }`}
                  >
                    {o.label}
                  </Button>
                ))}
              </div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 mt-4">Comments</div>
              <Textarea
                className="rounded-xl text-[13px] resize-none placeholder:text-gray-400"
                placeholder="Optional notes..."
                rows={3}
              />
            </CardContent>
          </Card>
          <Button
            onClick={() => goPin(() => go("delivery-done"))}
            className="rounded-xl text-[13px] font-semibold"
          >
            Submit Delivery
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Delivery Done ═══ */
  const DeliveryDoneScreen = () => (
    <div className="flex flex-col h-full items-center justify-center bg-muted/50">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-500" weight="fill" />
      </div>
      <div className="text-[20px] font-semibold text-gray-900 mt-5 tracking-tight">Delivery saved</div>
      <p className="text-[14px] text-gray-400 mt-1.5">Create a follow-up task?</p>
      <div className="mt-8 flex flex-col gap-2.5 w-72">
        <Button
          onClick={() => { setHistory([]); setScreen("dashboard"); }}
          className="rounded-xl text-[13px] font-semibold"
        >
          Create Task for Manager
        </Button>
        <Button
          variant="outline"
          onClick={() => { setHistory([]); setScreen("dashboard"); }}
          className="rounded-xl text-[13px] font-medium"
        >
          Skip
        </Button>
      </div>
    </div>
  );

  /* ═══ Checklist Detail ═══ */
  const checklistItems = [
    "Wipe down all surfaces",
    "Check fridge temps",
    "Rotate stock (FIFO)",
    "Sweep + mop floor",
    "Empty bins",
    "Sanitise prep boards",
    "Photo of clean larder",
  ];

  const checkedCount = checklistChecked.filter(Boolean).length;

  const ChecklistDetailScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Larder — Mid Day Cleaning" />
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <div className="w-full max-w-[520px]">
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-5">
            <Progress value={(checkedCount / 7) * 100} className="flex-1 h-2" />
            <span className="text-[14px] font-semibold text-gray-900">{checkedCount}/7</span>
          </div>
          {/* Checklist items */}
          <div className="flex flex-col gap-2.5">
            {checklistItems.map((item, i) => (
              <Card
                key={i}
                className="py-0 cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setChecklistChecked((prev) => {
                    const next = [...prev];
                    next[i] = !next[i];
                    return next;
                  });
                }}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      checklistChecked[i] ? "bg-emerald-500" : "border-2 border-gray-200"
                    }`}
                  >
                    {checklistChecked[i] && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[14px] font-semibold ${
                      checklistChecked[i] ? "line-through text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {item}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Submit button */}
          <Button
            onClick={() => {
              if (checkedCount === 7) goPin(() => go("success-generic"));
            }}
            disabled={checkedCount !== 7}
            className="mt-5 w-full rounded-xl text-[13px] font-semibold"
          >
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ Task Detail ═══ */
  const TaskDetailScreen = () => (
    <div className="flex flex-col h-full bg-muted/50">
      <BackHeader title="Missing Steak" />
      <div className="flex-1 flex gap-8 p-6 items-start">
        <div className="flex-1">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</div>
              <p className="text-[13px] leading-relaxed text-gray-600">
                Steak not included in today&apos;s delivery from Metro Foods. Check with supplier and log replacement order.
              </p>
            </CardContent>
          </Card>
          <Card className="py-0 mt-3">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Completion Notes</div>
              <Textarea
                className="rounded-xl text-[13px] resize-none placeholder:text-gray-400"
                placeholder="Add notes..."
                rows={5}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 w-56">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Photo Evidence</div>
              <div className="flex gap-2.5">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <Camera size={20} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-medium">Add</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={() => goPin(() => go("success-generic"))}
            className="rounded-xl text-[13px] font-semibold"
          >
            Mark Complete
          </Button>
        </div>
      </div>
    </div>
  );

  /* ═══ PIN Screen ═══ */
  const PinScreen = () => {
    const handlePinKey = (key: string) => {
      if (key === "back") {
        setPinDigits((v) => v.slice(0, -1));
        return;
      }
      if (key === "") return;
      const next = pinDigits + key;
      setPinDigits(next);
      if (next.length === 4 && pinCallback) {
        setTimeout(() => {
          pinCallback();
          setPinCallback(null);
          setPinDigits("");
        }, 200);
      }
    };

    return (
      <div className="flex flex-col h-full items-center justify-center bg-white">
        <div className="text-[18px] font-semibold text-gray-900 mb-8 tracking-tight">Authentication</div>
        {/* PIN dots */}
        <div className="flex gap-5 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < pinDigits.length
                  ? "bg-gray-900"
                  : "border-2 border-gray-200"
              }`}
            />
          ))}
        </div>
        {/* Number pad */}
        <div className="grid grid-cols-3 gap-2.5 w-[260px]">
          {["1","2","3","4","5","6","7","8","9","","0","back"].map((k) => (
            <Button
              key={k}
              variant={k === "back" ? "ghost" : k === "" ? "ghost" : "outline"}
              onClick={() => handlePinKey(k)}
              disabled={k === ""}
              className={`h-[56px] rounded-xl text-[24px] font-medium ${
                k === "" ? "cursor-default opacity-0" : ""
              }`}
            >
              {k === "back" ? <Backspace size={24} className="text-gray-500" /> : k}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  /* ═══ Success Generic ═══ */
  const SuccessGenericScreen = () => (
    <div className="flex flex-col h-full items-center justify-center bg-muted/50">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-500" weight="fill" />
      </div>
      <div className="text-[20px] font-semibold text-gray-900 mt-5 tracking-tight">Done</div>
      <p className="text-[14px] text-gray-400 mt-1.5">Action completed successfully</p>
      <Button
        onClick={() => { setHistory([]); setScreen("dashboard"); }}
        className="mt-8 rounded-xl text-[13px] font-semibold"
      >
        Back to Dashboard
      </Button>
    </div>
  );

  /* ─── Screen router ─── */
  const renderScreen = () => {
    switch (screen) {
      case "dashboard": return <DashboardScreen />;
      case "timer-start": return <TimerStartScreen />;
      case "timer-label": return <TimerLabelScreen />;
      case "timer-detail": return <TimerDetailScreen />;
      case "labels": return <LabelsScreen />;
      case "label-foods": return <LabelFoodsScreen />;
      case "label-preview": return <LabelPreviewScreen />;
      case "success-label": return <SuccessLabelScreen />;
      case "temp-list": return <TempListScreen />;
      case "temp-method": return <TempMethodScreen />;
      case "temp-manual": return <TempManualScreen />;
      case "temp-success": return <TempSuccessScreen />;
      case "processes": return <ProcessesScreen />;
      case "cool-process": return <CoolProcessScreen />;
      case "delivery-form": return <DeliveryFormScreen />;
      case "delivery-done": return <DeliveryDoneScreen />;
      case "checklist-detail": return <ChecklistDetailScreen />;
      case "task-detail": return <TaskDetailScreen />;
      case "pin": return <PinScreen />;
      case "success-generic": return <SuccessGenericScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A12] font-sans text-slate-200">
      {/* ─── Site nav bar ─── */}
      <nav className="flex items-center gap-4 px-6 py-3 border-b border-[#1A1A28]">
        <Link
          href="/projects/hospitality-safe"
          className="flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1A1A28] transition-colors"
        >
          <CaretLeft size={16} />
          <UpstreamLogo size={18} />
          <span>upstreamlab</span>
        </Link>
        <span className="text-slate-500">/</span>
        <span className="text-slate-400">Hospitality Safe</span>
        <span className="text-slate-500">/</span>
        <span className="text-slate-200">New Design</span>
      </nav>

      {/* ─── iPad Frame ─── */}
      <div className="flex items-center justify-center py-8">
        <div className="relative w-[1076px] h-[720px] rounded-[32px] border-[3px] border-white/20 bg-[#0b0b0b] p-[23px]">
          {/* Camera dot */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#333]" />
          {/* Screen */}
          <div className="w-[1024px] h-[668px] rounded-[14px] overflow-hidden bg-muted/50">
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

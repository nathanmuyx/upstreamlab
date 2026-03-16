"use client";

import { useState } from "react";
import { DocSection } from "@/app/projects/hospitality-safe/page";

/* ─── data ─── */
const categories = [
  { name: "Pizza Prep", items: [{ name: "Rebelled Dough", duration: "4 Hours" }] },
  { name: "Grill Station", items: [{ name: "Sliced Ham", duration: "4 Hours" }, { name: "Cooked Chicken", duration: "2 Hours" }] },
  { name: "Salad Bar", items: [{ name: "Prepared Sandwiches", duration: "4 Hours" }] },
];

/* ─── small components ─── */
function BlueLine() { return <div className="h-[2px] w-full" style={{ background: "#4A5FC1" }} />; }

type View = "browse" | "label-choice" | "label-count" | "pin-entry" | "timer-started";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("browse");
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [selectedTimer, setSelectedTimer] = useState("");
  const [labelChoice, setLabelChoice] = useState<"none" | "print" | null>(null);
  const [labelCount, setLabelCount] = useState(1);
  const [pin, setPin] = useState("");

  const stepMap: Record<View, number> = { browse: 1, "label-choice": 2, "label-count": 3, "pin-entry": 4, "timer-started": 5 };
  const go = (v: View) => { setView(v); onSubStepChange?.(stepMap[v]); };

  if (currentStep !== undefined) {
    const m: Record<number, View> = { 1: "browse", 2: "label-choice", 3: "label-count", 4: "pin-entry", 5: "timer-started" };
    const expected = m[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  const filteredCats = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.items.some(it => it.name.toLowerCase().includes(search.toLowerCase()))
  );

  /* ── View 1: Browse categories + items ── */
  if (view === "browse" || view === "label-choice") {
    return (
      <div className="h-full flex flex-col bg-white relative">
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div className="flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Add Timer</h2>
            <p className="text-[7px] text-[#888]">Add timers to track temperatures and processes.</p>
          </div>
          <button onClick={() => onNavigateScreen?.("homepage")} className="px-2.5 py-1 rounded text-[8px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Cancel</button>
        </div>
        <BlueLine />

        {/* Search */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[8px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          </div>
        </div>

        {/* Categories + items */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {filteredCats.map((cat) => (
              <div key={cat.name}>
                {/* Category tile (blue) */}
                <button
                  onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
                  className="w-[80px] h-[80px] rounded-lg flex flex-col items-center justify-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "#4A5FC1" }}
                >
                  <span className="text-[9px] font-bold text-center leading-tight px-1">{cat.name}</span>
                  <span className="text-[7px] opacity-80">{cat.items.length} Items</span>
                </button>
              </div>
            ))}
          </div>

          {/* Expanded items (white tiles) */}
          {expandedCat && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(categories.find(c => c.name === expandedCat)?.items || []).map((item) => (
                <button
                  key={item.name}
                  onClick={() => { setSelectedTimer(item.name); go("label-choice"); }}
                  className="w-[80px] h-[80px] rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#F0F0F4] transition-colors border border-[#E4E7EE] bg-white"
                >
                  <span className="text-[9px] font-bold text-[#333] text-center leading-tight px-1">{item.name}</span>
                  <span className="text-[7px] text-[#888]">{item.duration}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Label choice popup overlay */}
        {view === "label-choice" && (
          <>
            <div className="absolute inset-0 bg-black/10 z-10" />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg border border-[#E4E7EE] p-4 w-[160px]">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => { setLabelChoice("none"); go("pin-entry"); }}
                    className="flex-1 py-1.5 rounded border border-[#4A5FC1] text-[8px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5"
                    style={{ color: "#4A5FC1" }}
                  >
                    No Label
                  </button>
                  <button
                    onClick={() => { setLabelChoice("print"); go("label-count"); }}
                    className="flex-1 py-1.5 rounded text-white text-[8px] font-medium cursor-pointer hover:opacity-90"
                    style={{ background: "#4A5FC1" }}
                  >
                    Print Label
                  </button>
                </div>
                <button onClick={() => { setView("browse"); onSubStepChange?.(1); }} className="w-full text-center text-[8px] cursor-pointer hover:underline" style={{ color: "#4A5FC1" }}>Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ── View 3: Label Count (Print Label path) ── */
  if (view === "label-count") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h2 className="text-[11px] font-bold text-[#333] mb-1">Print Labels</h2>
          <p className="text-[8px] text-[#888] mb-4 text-center">How many labels do you want to print?</p>

          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setLabelCount(Math.max(1, labelCount - 1))} className="w-[28px] h-[28px] rounded-full border-2 border-[#D1D5DB] flex items-center justify-center text-[14px] text-[#666] cursor-pointer hover:border-[#4A5FC1]">−</button>
            <span className="text-[20px] font-bold text-[#333] w-[30px] text-center">{labelCount}</span>
            <button onClick={() => setLabelCount(labelCount + 1)} className="w-[28px] h-[28px] rounded-full border-2 border-[#D1D5DB] flex items-center justify-center text-[14px] text-[#666] cursor-pointer hover:border-[#4A5FC1]">+</button>
          </div>

          <button
            onClick={() => go("pin-entry")}
            className="px-6 py-1.5 rounded text-white text-[9px] font-medium cursor-pointer hover:opacity-90"
            style={{ background: "#4A5FC1" }}
          >
            Continue
          </button>
          <button onClick={() => go("label-choice")} className="mt-2 text-[8px] cursor-pointer hover:underline" style={{ color: "#4A5FC1" }}>Cancel</button>
        </div>
      </div>
    );
  }

  /* ── View 4: PIN Entry ── */
  if (view === "pin-entry") {
    const addDigit = (d: string) => { if (pin.length < 4) { const newPin = pin + d; setPin(newPin); if (newPin.length === 4) { setTimeout(() => go("timer-started"), 300); } } };
    const clearPin = () => setPin("");

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h2 className="text-[12px] font-bold mb-4" style={{ color: "#E74C3C" }}>Authentication Required</h2>

          {/* PIN dots */}
          <div className="flex gap-2.5 mb-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-[14px] h-[14px] rounded border-2" style={{ borderColor: "#D1D5DB", background: i < pin.length ? "#4A5FC1" : "transparent" }} />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2 w-[130px]">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <button key={d} onClick={() => addDigit(d)} className="w-[38px] h-[32px] rounded-lg border border-[#D1D5DB] text-[12px] font-medium text-[#333] cursor-pointer hover:bg-[#F0F0F4] flex items-center justify-center">{d}</button>
            ))}
            <button onClick={clearPin} className="w-[38px] h-[32px] rounded-lg border border-[#D1D5DB] flex items-center justify-center cursor-pointer hover:bg-[#FDE8E8]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E74C3C"><rect x="3" y="3" width="18" height="18" rx="3" opacity="0.2" /><path d="M9 9l6 6M15 9l-6 6" stroke="#E74C3C" strokeWidth="2" fill="none" /></svg>
            </button>
            <button onClick={() => addDigit("0")} className="w-[38px] h-[32px] rounded-lg border border-[#D1D5DB] text-[12px] font-medium text-[#333] cursor-pointer hover:bg-[#F0F0F4] flex items-center justify-center">0</button>
            <button onClick={() => { if (pin.length === 4) go("timer-started"); }} className="w-[38px] h-[32px] rounded-lg flex items-center justify-center cursor-pointer text-white text-[10px] font-bold" style={{ background: pin.length === 4 ? "#27AE60" : "#ccc" }}>✓</button>
          </div>

          <button onClick={() => go(labelChoice === "print" ? "label-count" : "label-choice")} className="mt-3 text-[8px] cursor-pointer hover:underline" style={{ color: "#4A5FC1" }}>Cancel</button>
        </div>
      </div>
    );
  }

  /* ── View 5: Timer Started ── */
  return (
    <div className="h-full flex flex-col bg-[#F0F0F4]">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Timer circle — green, active */}
        <div className="relative w-[100px] h-[100px] mb-3">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E4E7EE" strokeWidth="4" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#27AE60" strokeWidth="4" strokeDasharray={`${0.99 * 2 * Math.PI * 44} ${2 * Math.PI * 44}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[8px] text-[#333] font-medium">{selectedTimer || "Rebelled Dough"}</span>
            <span className="text-[16px] font-bold" style={{ color: "#27AE60" }}>3:59h</span>
            <span className="text-[7px] text-[#888]">Action by</span>
            <span className="text-[7px] text-[#888]">5:20pm</span>
          </div>
        </div>

        <div className="text-[10px] font-bold text-[#27AE60] mb-1">Timer Started!</div>
        <p className="text-[8px] text-[#888] text-center mb-4">
          {selectedTimer || "Rebelled Dough"} timer is now active.
          {labelChoice === "print" && ` ${labelCount} label(s) printed.`}
        </p>

        <button onClick={() => onNavigateScreen?.("homepage")} className="px-4 py-1.5 rounded text-white text-[9px] font-medium cursor-pointer hover:opacity-90" style={{ background: "#4A5FC1" }}>Back to Home</button>
      </div>
    </div>
  );
}

/* ─── Annotation ─── */
function Annotation({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "issue" | "context" }) {
  const colors = { info: { border: "#4A5FC1", label: "Note:" }, issue: { border: "#E74C3C", label: "Issue:" }, context: { border: "#F39C12", label: "Context:" } };
  const c = colors[type];
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: `2px solid ${c.border}` }}>
      <span className="text-[8px] font-medium mr-1" style={{ color: c.border }}>{c.label}</span>{children}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Browse categories + items */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>Timer category selection. Blue tiles are categories pre-set in admin settings. Press a category to reveal the timer items within it (white tiles).</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>This opens up the Timer Page with all pre-set timers added in the settings section of the app. (Blue buttons are categories). Once a category is pressed it will show the timers within the category (white buttons).</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: Label choice */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>After selecting a timer, choose whether to print a label for the food container/packaging to track the batch.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>Once the timer has been selected, the user will get to choose to print a label or not. The purpose of printing a label is to then place on the container or food packaging to track the exact batch.</Annotation>
        <Annotation type="issue">The label needs to be amended. Where it says &ldquo;Prepared at&rdquo; should say &ldquo;Timer Started At ##:##&rdquo; (and the time the timer started).</Annotation>
      </DocSection>
    </>
  );

  /* Step 3: Label count */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>Select how many labels to print. Multiple labels may be needed for multiple containers of the same batch.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>User to add the number of labels required for printing.</Annotation>
      </DocSection>
    </>
  );

  /* Step 4: PIN entry */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>User enters their 4-digit PIN for authentication. This logs who started the timer for traceability.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>User to add their 4 digit unique PIN.</Annotation>
      </DocSection>
    </>
  );

  /* Step 5: Timer started */
  return (
    <>
      <DocSection title="What is this?">
        <p>Timer is now running. It appears on the homepage under Temperature Timers as a circular countdown.</p>
      </DocSection>
      <DocSection title="Timer Colours">
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><span className="font-semibold" style={{ color: "#27AE60" }}>Green circle</span> — active timer, time remaining</li>
          <li><span className="font-semibold" style={{ color: "#999" }}>Grey circle</span> — paused timer</li>
          <li><span className="font-semibold" style={{ color: "#E74C3C" }}>Red circle</span> — time finished, &ldquo;Action Now&rdquo;</li>
        </ul>
      </DocSection>
      <DocSection title="Timer Actions (clicking a timer)">
        <p>Pressing a timer on the homepage opens Timer Details:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Pause Timer</strong> — greys out, moves to end of list</li>
          <li><strong>Pause Timer and Print Label</strong> — select label count, enter PIN, print, timer pauses</li>
          <li><strong>Restart Timer</strong> — resets to original duration (new batch)</li>
          <li><strong>Finish Timer</strong> — ends and removes from homepage</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>When the user presses on the timer on the homepage it opens to this box. You can see the user who started the timer and the duration of the timer.</Annotation>
        <Annotation type="issue">Currently when restart is selected, user adds PIN and timer restarts. However, there should be the pop up option to print a label or not, as this may be a new batch requiring a new label.</Annotation>
        <Annotation type="issue">Label change: &ldquo;Prepared At&rdquo; → &ldquo;Timer Started At ##:##&rdquo;. Add line &ldquo;Paused Timer At ##:##&rdquo; when paused. TIME REMAINING should show time left (e.g. 2:15H), not overall time.</Annotation>
        <Annotation>Select Unpause Timer will resume the timer, the timer will go back to Green and be active again.</Annotation>
      </DocSection>
    </>
  );
}

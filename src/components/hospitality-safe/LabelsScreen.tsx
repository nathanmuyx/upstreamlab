"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/lib/hospitality-safe-docs";

/* ─── data ─── */
const typeFilters = ["Prep", "Opened", "Defrost", "Freeze", "Custom"];

const categoryData = [
  { name: "Cocktail Preps", count: 8 },
  { name: "Dairy", count: 16 },
  { name: "Desserts", count: 5 },
  { name: "Fryer", count: 3 },
  { name: "Meat", count: 7 },
  { name: "Pasta", count: 3 },
  { name: "Pizza Prep", count: 3 },
  { name: "Sauces", count: 13 },
  { name: "Seafood", count: 10 },
  { name: "Vegetables & Fruit", count: 33 },
];

const printHistory = [
  { user: "Emma Timpano", type: "Prep", item: "Crispy Potatoes", qty: 1, time: "Today at 12:32 PM" },
  { user: "Emma Timpano", type: "Prep", item: "Crispy Potatoes", qty: 1, time: "Today at 12:22 PM" },
  { user: "Emma Timpano", type: "Prep", item: "Lemon Wedge", qty: 2, time: "Today at 11:47 AM" },
  { user: "Emma Timpano", type: "Defrost", item: "Lasagne", qty: 9, time: "Today at 11:20 AM" },
  { user: "Emma Timpano", type: "Prep", item: "Veal", qty: 1, time: "Yesterday 21:30 PM" },
  { user: "Jongha Baek", type: "Prep", item: "Rebelled Dough", qty: 1, time: "Yesterday 21:27 PM" },
  { user: "Billie Erdal", type: "Defrost", item: "Tiramisu", qty: 5, time: "Yesterday 21:14 PM" },
  { user: "Jongha Baek", type: "Prep", item: "Casalongo tromba", qty: 1, time: "Yesterday 21:03 PM" },
  { user: "Jongha Baek", type: "Prep", item: "Hot Salami", qty: 1, time: "Yesterday 21:02 PM" },
  { user: "Emma Timpano", type: "Prep", item: "Ricotta Mix", qty: 1, time: "Yesterday 20:50 PM" },
];

/* ─── small components ─── */
function BlueLine() { return <div className="h-[2px] w-full" style={{ background: "#4A5FC1" }} />; }

type View = "browse" | "items" | "label-form";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("browse");
  const [activeType, setActiveType] = useState("Prep");
  const [search, setSearch] = useState("");

  const stepMap: Record<View, number> = { browse: 1, items: 2, "label-form": 3 };
  const go = (v: View) => { setView(v); onSubStepChange?.(stepMap[v]); };

  if (currentStep !== undefined) {
    const m: Record<number, View> = { 1: "browse", 2: "items", 3: "label-form" };
    const expected = m[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  const filteredCats = categoryData.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ── View 1: Browse categories ── */
  if (view === "browse") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div className="flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Add Label</h2>
            <p className="text-[7px] text-[#888]">Print labels for food products.</p>
          </div>
          <button onClick={() => onNavigateScreen?.("homepage")} className="px-2.5 py-1 rounded text-[8px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Cancel</button>
        </div>
        <BlueLine />

        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[8px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
            </div>
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-1.5 px-3 pb-2">
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className="px-3 py-1 rounded-lg text-[8px] font-semibold cursor-pointer transition-colors"
                style={activeType === t
                  ? { background: "#27AE60", color: "white" }
                  : { background: "#E8F8EF", color: "#27AE60" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category grid */}
          <div className="px-3 pb-3">
            <div className="grid grid-cols-5 gap-2">
              {filteredCats.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => go("items")}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "#4A5FC1" }}
                >
                  <span className="text-[7px] font-bold text-center leading-tight px-1">{cat.name}</span>
                  <span className="text-[6px] opacity-80">{cat.count} items</span>
                </button>
              ))}
            </div>
          </div>

          {/* Print history */}
          <div className="border-t border-[#E8E8EE]">
            {printHistory.map((entry, i) => (
              <div key={i} className="flex items-center px-3 py-2 border-b border-[#F0F0F0]">
                <span className="text-[8px] text-[#333] flex-1">
                  <strong>{entry.user}</strong> printed a <strong>{entry.type} Label</strong> for <strong>{entry.item}</strong>  x{entry.qty}
                </span>
                <span className="text-[7px] text-[#999] shrink-0 ml-2">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── View 2: Items within category ── */
  if (view === "items") {
    const sampleItems = ["Crispy Potatoes", "Lemon Wedge", "Veal Schnitzel", "Garlic Bread", "Onion Rings"];
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <button onClick={() => go("browse")} className="px-2 py-0.5 rounded text-[8px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>← Back</button>
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Add Label</h2>
            <p className="text-[7px] text-[#888]">Select a food item to print a label.</p>
          </div>
          <button onClick={() => onNavigateScreen?.("homepage")} className="px-2.5 py-1 rounded text-[8px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Cancel</button>
        </div>
        <BlueLine />

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="flex flex-wrap gap-2">
            {sampleItems.map((item) => (
              <button
                key={item}
                onClick={() => go("label-form")}
                className="w-[80px] h-[80px] rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#F0F0F4] transition-colors border border-[#E4E7EE] bg-white"
              >
                <span className="text-[9px] font-bold text-[#333] text-center leading-tight px-1">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── View 3: Label form (select count + print) ── */
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
        <button onClick={() => go("items")} className="px-2 py-0.5 rounded text-[8px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>← Back</button>
        <div className="text-center flex-1">
          <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Print Label</h2>
        </div>
        <div className="w-12" />
      </div>
      <BlueLine />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-[10px] font-bold text-[#333] mb-1">Crispy Potatoes</div>
        <div className="text-[8px] text-[#888] mb-4">Prep Label</div>

        <div className="flex items-center gap-4 mb-4">
          <button className="w-[28px] h-[28px] rounded-full border-2 border-[#D1D5DB] flex items-center justify-center text-[14px] text-[#666] cursor-pointer hover:border-[#4A5FC1]">−</button>
          <span className="text-[20px] font-bold text-[#333]">1</span>
          <button className="w-[28px] h-[28px] rounded-full border-2 border-[#D1D5DB] flex items-center justify-center text-[14px] text-[#666] cursor-pointer hover:border-[#4A5FC1]">+</button>
        </div>

        <button className="px-6 py-1.5 rounded text-white text-[9px] font-medium cursor-pointer hover:opacity-90" style={{ background: "#4A5FC1" }}>Print Label</button>
        <button onClick={() => go("items")} className="mt-2 text-[8px] cursor-pointer hover:underline" style={{ color: "#4A5FC1" }}>Cancel</button>
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

  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>Label printing page. Select a label type (Prep, Opened, Defrost, Freeze, Custom), then browse food categories to find the item you want to label.</p>
      </DocSection>
      <DocSection title="How it works">
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Green tabs filter by label type (Prep, Opened, Defrost, Freeze, Custom)</li>
          <li>Blue category tiles show food groups with item counts</li>
          <li>Print history below shows recent label prints with user, item, quantity, and time</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="issue">Delete the &ldquo;Add Label&rdquo; button on the homepage — not required. The user can print a food prep label from pressing the label button on the side panel.</Annotation>
        <Annotation>The user can print a food prep label from pressing the label button on the side panel.</Annotation>
      </DocSection>
    </>
  );

  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Food items within the selected category. Press an item to print a label for it.</p>
      </DocSection>
    </>
  );

  return (
    <>
      <DocSection title="What is this?">
        <p>Select how many labels to print for this food item, then press Print Label.</p>
      </DocSection>
    </>
  );
}

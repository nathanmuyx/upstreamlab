"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/app/projects/hospitality-safe/page";

/* ─── data ─── */
const areasList = ["Bar", "Fryer", "Grill", "Larder", "Main Area", "Pans", "Pasta", "Pizza"];

const foodCategories = [
  { name: "Cocktail Preps", foods: ["Banana negroni mix", "Coffee", "Cucunation mix", "Mango mix", "Passionfruit Sour Mix", "Rockmelon cardamom mix", "Rose Vanilla Mix", "Salumi meat", "Simple syrup"] },
  { name: "Dairy", foods: ["Buffalo Cheese", "Buffalo _ Cut", "Burrata", "Butter cut", "Chilli Butter"] },
];

const unitNames = ["Cool Room", "Freezer Room", "Grill U/B Fridge", "Keg Room", "Larder U/B Fridge", "Pans / Fryer U/B Fridge", "Pasta draw Freezer", "Pasta Draw Fridge", "Pasta U/B Fridge"];

type View = "list" | "add" | "view" | "manage-foods" | "manage-units";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("list");
  const [viewingArea, setViewingArea] = useState("Area 1");
  const [selFoods, setSelFoods] = useState<Set<string>>(new Set(["Coffee"]));
  const [selCats, setSelCats] = useState<Set<string>>(new Set(["Cocktail Preps"]));
  const [selUnits, setSelUnits] = useState<Set<string>>(new Set(["Grill U/B Fridge", "Pasta draw Freezer"]));

  const stepMap: Record<View, number> = { list: 1, add: 2, view: 3, "manage-foods": 4, "manage-units": 5 };
  const go = (v: View) => { setView(v); onSubStepChange?.(stepMap[v]); };

  // Sync from parent
  if (currentStep !== undefined) {
    const m: Record<number, View> = { 1: "list", 2: "add", 3: "view", 4: "manage-foods", 5: "manage-units" };
    const expected = m[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  const toggleFood = (f: string) => { const n = new Set(selFoods); n.has(f) ? n.delete(f) : n.add(f); setSelFoods(n); };
  const toggleCat = (c: string) => {
    const nc = new Set(selCats); const nf = new Set(selFoods);
    const cat = foodCategories.find((x) => x.name === c);
    if (nc.has(c)) { nc.delete(c); cat?.foods.forEach((f) => nf.delete(f)); } else { nc.add(c); cat?.foods.forEach((f) => nf.add(f)); }
    setSelCats(nc); setSelFoods(nf);
  };
  const toggleUnit = (u: string) => { const n = new Set(selUnits); n.has(u) ? n.delete(u) : n.add(u); setSelUnits(n); };

  /* ── Areas List ── */
  if (view === "list") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header: Back (left), Title (center), Add (right) */}
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => onNavigateScreen?.("admin-login")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Areas</h2>
            <p className="text-[7px] text-[#888]">Manage areas for this location.</p>
          </div>
          <BtnFill label="Add" onClick={() => go("add")} />
        </div>
        <BlueLine />
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {areasList.map((name) => (
            <div key={name} className="flex items-center justify-between py-3 px-4 border-b border-[#F0F0F0]">
              <span className="text-[10px] text-[#333]">{name}</span>
              <button onClick={() => { setViewingArea(name); go("view"); }} className="px-3 py-1 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[8px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">View</button>
            </div>
          ))}
          <div className="h-20" style={{ background: "#f0f0f0" }} />
        </div>
      </div>
    );
  }

  /* ── Add Area ── */
  if (view === "add") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header: title LEFT, Cancel RIGHT */}
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div>
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Add Area</h2>
            <p className="text-[7px] text-[#888]">Enter details to add a new area.</p>
          </div>
          <BtnFill label="Cancel" color="#E74C3C" onClick={() => go("list")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto px-4 pt-5">
          {/* Name field */}
          <div className="flex items-center gap-6 mb-8">
            <label className="text-[9px] text-[#333] font-medium w-[80px] shrink-0">Name</label>
            <input type="text" placeholder="e.g. Pizza Section" className="flex-1 px-2 py-2 border-b border-[#D1D5DB] text-[10px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          </div>
          {/* Divider */}
          <div className="border-t border-[#E4E7EE] mb-6" />
          {/* Photo */}
          <div className="flex items-start gap-6">
            <label className="text-[9px] text-[#333] font-medium w-[80px] shrink-0 pt-6">Photo (optional)</label>
            <div className="w-[140px] h-[110px] rounded border border-[#D1D5DB] bg-white flex items-center justify-center cursor-pointer hover:border-[#4A5FC1]">
              <span className="text-[9px] text-[#4A5FC1] font-medium">Add Photo</span>
            </div>
          </div>
          {/* Create button — large, bottom right */}
          <div className="mt-8 flex justify-end">
            <button onClick={() => go("list")} className="px-10 py-2.5 rounded-md text-white text-[11px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Create</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View Area ── */
  if (view === "view") {
    const linked = foodCategories.map((c) => ({ ...c, foods: c.foods.filter((f) => selFoods.has(f)) })).filter((c) => selCats.has(c.name) || c.foods.length > 0);
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => go("list")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>View Area</h2>
            <p className="text-[7px] text-[#888]">The details of this area.</p>
          </div>
          <BtnFill label="Edit" />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto">
          {/* Name */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-[#E4E7EE]">
            <span className="text-[9px] text-[#666]">Name</span>
            <span className="text-[10px] text-[#333] font-medium">{viewingArea}</span>
          </div>
          {/* Green separator */}
          <div className="h-[3px]" style={{ background: "#27AE60" }} />
          {/* Foods */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-[#666]">Foods</span>
              <button onClick={() => go("manage-foods")} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer underline">Manage Foods</button>
            </div>
            {linked.length === 0 ? <p className="text-[8px] text-[#999] italic py-2">No foods assigned to this area...</p> : linked.map((c) => (
              <div key={c.name} className="mb-2">
                <div className="px-3 py-1.5 rounded-sm text-[9px] text-white font-medium" style={{ background: "#4A5FC1" }}>{c.name}</div>
                {c.foods.map((f) => <div key={f} className="px-4 py-2 border-b border-[#F0F0F0] text-[9px] text-[#333] bg-white">{f}</div>)}
              </div>
            ))}
          </div>
          {/* Divider */}
          <div className="h-[3px] mx-4" style={{ background: "#27AE60" }} />
          {/* Units */}
          <div className="px-4 pt-3 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-[#666]">Units</span>
              <button onClick={() => go("manage-units")} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer underline">Manage Units</button>
            </div>
            {selUnits.size === 0 ? <p className="text-[8px] text-[#999] italic py-2">No units assigned to this area...</p> : [...selUnits].map((u) => <div key={u} className="px-4 py-2 border-b border-[#F0F0F0] text-[9px] text-[#333]">{u}</div>)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Manage Foods ── */
  if (view === "manage-foods") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div>
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Edit Area Foods</h2>
            <p className="text-[7px] text-[#888]">Manage the food categories and products assigned to this area.</p>
          </div>
          <BtnFill label="Cancel" color="#E74C3C" onClick={() => go("view")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto px-3 pt-2">
          {/* Header with deselect icon */}
          <div className="flex items-center gap-2 text-[9px] text-[#333] font-semibold mb-2 px-1 py-1 border-b border-[#E4E7EE]">
            <Circle checked={false} size={14} />
            Food Category / Food Product Name
          </div>
          {foodCategories.map((cat) => (
            <div key={cat.name}>
              <SelectRow checked={selCats.has(cat.name)} onClick={() => toggleCat(cat.name)} label={cat.name} />
              <div className="ml-4">
                {cat.foods.map((f) => <SelectRow key={f} checked={selFoods.has(f)} onClick={() => toggleFood(f)} label={f} indent />)}
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-end pb-3">
            <button onClick={() => go("view")} className="px-10 py-2.5 rounded-md text-white text-[11px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Manage Units ── */
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
        <div>
          <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Edit Area Units</h2>
          <p className="text-[7px] text-[#888]">Manage the units assigned to this area.</p>
        </div>
        <BtnFill label="Cancel" color="#E74C3C" onClick={() => go("view")} />
      </div>
      <BlueLine />
      <div className="flex-1 overflow-y-auto px-3 pt-2">
        <div className="flex items-center gap-2 text-[9px] text-[#333] font-semibold mb-2 px-1 py-1 border-b border-[#E4E7EE]">
          <Circle checked={false} size={14} />
          Unit Name
        </div>
        {unitNames.map((u) => <SelectRow key={u} checked={selUnits.has(u)} onClick={() => toggleUnit(u)} label={u} />)}
        <div className="mt-4 flex justify-end pb-3">
          <button onClick={() => go("view")} className="px-10 py-2.5 rounded-md text-white text-[11px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI matching Figma exactly ─── */
function BtnFill({ label, color, onClick }: { label: string; color?: string; onClick?: () => void }) {
  return <button onClick={onClick} className="px-3 py-1 rounded text-white text-[8px] font-semibold cursor-pointer shrink-0" style={{ background: color || "#4A5FC1" }}>{label}</button>;
}

function BlueLine() {
  return <div className="h-[2px] shrink-0" style={{ background: "#4A5FC1" }} />;
}

function Circle({ checked, size = 16 }: { checked: boolean; size?: number }) {
  return (
    <div className="shrink-0 rounded-full border-[1.5px] flex items-center justify-center" style={{ width: size, height: size, borderColor: checked ? "#4A5FC1" : "#bbb", background: checked ? "#4A5FC1" : "transparent" }}>
      {checked && <svg width={size - 6} height={size - 6} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
    </div>
  );
}

function SelectRow({ checked, onClick, label, indent }: { checked: boolean; onClick: () => void; label: string; indent?: boolean }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 py-2.5 px-3 cursor-pointer border-b border-[#F0F0F0] hover:bg-[#F9FAFB] ${indent ? "" : ""}`} style={checked ? { background: "rgba(74,95,193,0.04)", borderLeft: "2px solid #4A5FC1" } : { borderLeft: "2px solid transparent" }}>
      <Circle checked={checked} size={indent ? 14 : 16} />
      <span className={`text-[9px] text-[#333] ${!indent ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}

/* ─── Annotation ─── */
function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: "2px solid #4A5FC1" }}>
      <span className="text-[8px] text-[#4A5FC1] font-medium mr-1">Figma:</span>{children}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Areas List */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>All the areas (zones) in this location. Each area filters what staff see — only relevant foods, checklists, and tasks show up.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Press <strong>View</strong> to see what is linked to an area</li>
          <li>Press <strong>Add</strong> to create a new area</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Areas act like a filter — only relevant foods, checklists, tasks show for each area.</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: Add Area */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Create a new area. Just needs a name, photo is optional.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Type a name like &ldquo;Pizza Section&rdquo;</li>
          <li>Optionally add a photo to help staff identify the area</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 3: View Area */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>See what foods and units are linked to this area. Use the links to manage them.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Foods are grouped by category</li>
          <li>Units are listed below the foods</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>View page should only show selected foods — currently shows all (bug).</Annotation>
      </DocSection>
    </>
  );

  /* Step 4: Manage Foods */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>Pick which foods belong to this area. Selecting a category should select all items inside it.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Tick a category to select all foods in it</li>
          <li>Or tick individual foods one by one</li>
          <li>Press Save when done</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Category selection doesn&apos;t cascade to child foods (bug).</Annotation>
        <Annotation>Save button at bottom of long lists — easy to miss.</Annotation>
      </DocSection>
    </>
  );

  /* Step 5: Manage Units */
  return (
    <>
      <DocSection title="What is this?">
        <p>Pick which temperature units belong to this area.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Tick the units that are in this area</li>
          <li>Press Save when done</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Remove select/deselect all button.</Annotation>
      </DocSection>
    </>
  );
}

"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/app/projects/hospitality-safe/page";

/* ─── data ─── */
const unitData = [
  { name: "Cool Room", type: "Fridge" },
  { name: "Freezer Room", type: "Freezer" },
  { name: "Grill U/B Fridge", type: "Fridge" },
  { name: "Keg Room", type: "Fridge" },
  { name: "Larder U/B Fridge", type: "Fridge" },
  { name: "Pans / Fryer U/B Fridge", type: "Fridge" },
  { name: "Pasta draw Freezer", type: "Freezer" },
  { name: "Pasta Draw Fridge", type: "Fridge" },
  { name: "Pasta U/B fridge", type: "Fridge" },
  { name: "Pizza u/B Fridge", type: "Fridge" },
  { name: "Upright Freezer 1", type: "Fridge" },
  { name: "Upright freezer 2", type: "Freezer" },
];

const typeFilters = ["All", "Freezer", "Fridge", "Hot Holding Unit", "Other"] as const;
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const typeOptions = ["Fridge", "Freezer", "Hot Holding Unit", "Other"];

type View = "list" | "add" | "view" | "edit" | "copy-modal";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("list");
  const [prevView, setPrevView] = useState<View>("list");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [viewingUnit, setViewingUnit] = useState(unitData[11]); // Upright freezer 2

  const stepMap: Record<View, number> = { list: 1, add: 2, view: 3, edit: 4, "copy-modal": 5 };
  const go = (v: View) => { setPrevView(view); setView(v); onSubStepChange?.(stepMap[v]); };

  // Sync from parent
  if (currentStep !== undefined) {
    const m: Record<number, View> = { 1: "list", 2: "add", 3: "view", 4: "edit", 5: "copy-modal" };
    const expected = m[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  const filtered = unitData.filter((u) => {
    if (activeFilter !== "All" && u.type !== activeFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ── Unit List ── */
  if (view === "list") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => onNavigateScreen?.("admin-login")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Units</h2>
            <p className="text-[7px] text-[#888]">Manage units for this location.</p>
          </div>
          <BtnFill label="Add" onClick={() => go("add")} />
        </div>
        <BlueLine />
        {/* Search */}
        <div className="px-3 pt-2 pb-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-[#D1D5DB] bg-[#F9FAFB]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[8px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 px-3 pb-2 shrink-0 flex-wrap">
          {typeFilters.map((t) => (
            <button key={t} onClick={() => setActiveFilter(t)} className="px-2 py-0.5 rounded-full text-[7px] font-medium cursor-pointer border" style={activeFilter === t ? { background: "#4A5FC1", color: "#fff", borderColor: "#4A5FC1" } : { background: "#fff", color: "#4A5FC1", borderColor: "#4A5FC1" }}>
              {t}
            </button>
          ))}
        </div>
        {/* Unit rows */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((u) => (
            <div key={u.name} className="flex items-center py-2 px-3 border-b border-[#F0F0F0]">
              <span className="text-[9px] text-[#333] font-medium" style={{ width: "35%" }}>{u.name}</span>
              <span className="text-[8px] text-[#666]" style={{ width: "25%" }}>{u.type}</span>
              <div style={{ width: "15%" }}>
                <button onClick={() => { setViewingUnit(u); go("copy-modal"); }} className="px-2 py-0.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[7px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">Copy</button>
              </div>
              <div style={{ width: "15%" }}>
                <button onClick={() => { setViewingUnit(u); go("view"); }} className="px-2 py-0.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[7px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">View</button>
              </div>
            </div>
          ))}
          <div className="h-20" style={{ background: "#f0f0f0" }} />
        </div>
      </div>
    );
  }

  /* ── Add Unit ── */
  if (view === "add") {
    return <UnitForm title="Add Unit" subtitle="Enter details to add a new unit." onCancel={() => go("list")} onSave={() => go("list")} />;
  }

  /* ── View Unit ── */
  if (view === "view") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => go("list")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>View Unit</h2>
            <p className="text-[7px] text-[#888]">The details of this unit.</p>
          </div>
          <BtnFill label="Edit" onClick={() => go("edit")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto">
          <SummaryRow label="Name" value={viewingUnit.name} />
          <SummaryRow label="Type" value={viewingUnit.type} />
          <SummaryRow label="Min Temperature" value="-" />
          <SummaryRow label="Max Temperature" value="-13°C" />
          <SummaryRow label="Check on Days" value="Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday" />
          <SummaryRow label="Checks per Day" value="1" />
          <SummaryRow label="Check Times" value="10:00am" />
          <BlueLine />
          <div className="flex justify-center py-4">
            <button onClick={() => go("copy-modal")} className="px-8 py-2 rounded-md text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Copy Unit</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Edit Unit ── */
  if (view === "edit") {
    return (
      <UnitForm
        title="Edit Unit"
        subtitle="Update the details of this unit."
        onCancel={() => go("view")}
        onSave={() => go("view")}
        prefill={{ name: viewingUnit.name, type: viewingUnit.type === "Freezer" ? "Freezer" : "Fridge", maxTemp: "-13" }}
      />
    );
  }

  /* ── Copy Unit Modal ── */
  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* List behind overlay */}
      <div className="h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="flex items-start justify-between px-3 pt-2 pb-1">
          <BtnFill label="Back" />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Units</h2>
            <p className="text-[7px] text-[#888]">Manage units for this location.</p>
          </div>
          <BtnFill label="Add" />
        </div>
        <BlueLine />
        <div className="px-3 pt-2 pb-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-[#D1D5DB] bg-[#F9FAFB]">
            <span className="text-[8px] text-[#bbb]">Search...</span>
          </div>
        </div>
        {unitData.slice(0, 5).map((u) => (
          <div key={u.name} className="flex items-center py-2 px-3 border-b border-[#F0F0F0]">
            <span className="text-[9px] text-[#333]" style={{ width: "35%" }}>{u.name}</span>
            <span className="text-[8px] text-[#666]" style={{ width: "25%" }}>{u.type}</span>
          </div>
        ))}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-4 w-[75%]">
          <h3 className="text-[11px] font-bold text-[#333] text-center mb-3">Copy Unit</h3>
          <label className="text-[8px] text-[#666] font-medium mb-1 block">New Unit Name</label>
          <input type="text" placeholder="e.g. Fridge 1" className="w-full px-2 py-1.5 border border-[#D1D5DB] rounded text-[9px] text-[#333] outline-none placeholder:text-[#bbb] mb-3" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => go(prevView === "view" ? "view" : "list")} className="px-4 py-1.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[8px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">Cancel</button>
            <button onClick={() => go("list")} className="px-4 py-1.5 rounded text-white text-[8px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Create Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Unit Form (shared for Add / Edit) ─── */
function UnitForm({ title, subtitle, onCancel, onSave, prefill }: { title: string; subtitle: string; onCancel: () => void; onSave: () => void; prefill?: { name?: string; type?: string; maxTemp?: string } }) {
  const [unitType, setUnitType] = useState(prefill?.type || "Fridge");
  const [days, setDays] = useState<Set<string>>(new Set(dayNames));
  const toggleDay = (d: string) => { const n = new Set(days); n.has(d) ? n.delete(d) : n.add(d); setDays(n); };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
        <div>
          <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>{title}</h2>
          <p className="text-[7px] text-[#888]">{subtitle}</p>
        </div>
        <BtnFill label="Cancel" color="#E74C3C" onClick={onCancel} />
      </div>
      <BlueLine />
      <div className="flex-1 overflow-y-auto px-4 pt-3">
        {/* Name */}
        <FormRow label="Name">
          <input type="text" defaultValue={prefill?.name || ""} placeholder="e.g. Fridge 1" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
        </FormRow>
        {/* Type */}
        <FormRow label="Type">
          <div className="relative flex-1">
            <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer">
              {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </FormRow>
        {/* Hint */}
        <p className="text-[7px] italic mb-2 mt-1" style={{ color: "#4A5FC1" }}>Must provide either a min or max temperature. You can enter both, but only one is required.</p>
        {/* Temps */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-[7px] text-[#666] font-medium block mb-0.5">Min Temperature (Optional)</label>
            <div className="flex items-center gap-1">
              <input type="text" className="w-full px-2 py-1 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
              <span className="text-[8px] text-[#666] shrink-0">°C</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-[7px] text-[#666] font-medium block mb-0.5">Max Temperature (Optional)</label>
            <div className="flex items-center gap-1">
              <input type="text" defaultValue={prefill?.maxTemp || ""} className="w-full px-2 py-1 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
              <span className="text-[8px] text-[#666] shrink-0">°C</span>
            </div>
          </div>
        </div>
        {/* Checks On Days */}
        <FormRow label="Checks On Days">
          <div className="flex-1 grid grid-cols-3 gap-x-3 gap-y-1">
            {dayNames.map((d) => (
              <label key={d} onClick={() => toggleDay(d)} className="flex items-center gap-1.5 cursor-pointer">
                <div className="w-[12px] h-[12px] rounded-sm border flex items-center justify-center shrink-0" style={{ borderColor: days.has(d) ? "#4A5FC1" : "#bbb", background: days.has(d) ? "#4A5FC1" : "transparent" }}>
                  {days.has(d) && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-[8px] text-[#333]">{d}</span>
              </label>
            ))}
          </div>
        </FormRow>
        {/* Checks Per Day */}
        <FormRow label="Checks Per Day">
          <div className="relative flex-1">
            <select className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer" defaultValue="1">
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </FormRow>
        {/* Allowed Time */}
        <FormRow label="Allowed Time For Checks">
          <div className="flex-1">
            <div className="relative">
              <select className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer" defaultValue="60 min">
                {["15 min", "30 min", "45 min", "60 min", "90 min", "120 min"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <p className="text-[7px] text-[#999] mt-0.5">The amount of time before the deadline...</p>
          </div>
        </FormRow>
        {/* Hint */}
        <p className="text-[7px] text-[#999] mb-1.5 mt-1">The times which the checks need to be completed by.</p>
        {/* Check #1 */}
        <FormRow label="Check #1">
          <div className="relative flex-1">
            <select className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer" defaultValue="10:00am">
              {["6:00am", "7:00am", "8:00am", "9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
          </div>
        </FormRow>
        {/* Create / Save button */}
        <div className="mt-4 flex justify-end pb-4">
          <button onClick={onSave} className="px-10 py-2 rounded-md text-white text-[10px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>{title === "Add Unit" ? "Create" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI ─── */
function BtnFill({ label, color, onClick }: { label: string; color?: string; onClick?: () => void }) {
  return <button onClick={onClick} className="px-3 py-1 rounded text-white text-[8px] font-semibold cursor-pointer shrink-0" style={{ background: color || "#4A5FC1" }}>{label}</button>;
}

function BlueLine() {
  return <div className="h-[2px] shrink-0" style={{ background: "#4A5FC1" }} />;
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <label className="text-[8px] text-[#666] font-medium w-[90px] shrink-0 pt-1.5">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 px-4 border-b border-[#E4E7EE]">
      <span className="text-[8px] text-[#666]">{label}</span>
      <span className="text-[9px] text-[#333] font-medium text-right max-w-[60%]">{value}</span>
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

  /* Step 1: Unit List */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>This is the list of all temperature units (fridges, freezers, etc.) the business has set up. Each unit gets temperature checks at scheduled times.</p>
      </DocSection>
      <DocSection title="How it works">
        <ul className="list-disc pl-4 space-y-1">
          <li>Use the <strong>tabs</strong> to filter by type (Freezer, Fridge, etc.)</li>
          <li><strong>Copy</strong> duplicates a unit with all its settings — just enter a new name</li>
          <li><strong>View</strong> shows the full details of that unit</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>The Units page shows all temperature controlled units added by the business. Tabs filter by type.</Annotation>
        <Annotation>A user can copy a unit to duplicate all information — saves time when adding many similar units (e.g. 10 fridges).</Annotation>
      </DocSection>
      <DocNote type="warning">After copying a unit, the new unit doesn&apos;t appear until you navigate away and back. Should auto-refresh.</DocNote>
    </>
  );

  /* Step 2: Add Unit */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Form to add a new temperature unit. Fill in the name, type, temp range, and when checks should happen.</p>
      </DocSection>
      <DocSection title="Key fields">
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Type</strong> — Fridge, Freezer, Hot Holding, or Other</li>
          <li><strong>Min/Max Temp</strong> — the safe range. At least one is required</li>
          <li><strong>Checks On Days</strong> — which days need checks. Deselect closed days so they show grey (not red)</li>
          <li><strong>Checks Per Day</strong> — adding more creates extra time slots</li>
          <li><strong>Allowed Time</strong> — how much leeway staff have around the scheduled time (e.g. 60 min before/after)</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>When the unit type is selected, standard temperature ranges should auto-fill but the business can customise them.</Annotation>
        <Annotation>All days are selected by default. For manual checks, deselect closed days so the record shows grey instead of red.</Annotation>
        <Annotation>If a data logger is used, the app should auto-capture the reading at scheduled times.</Annotation>
        <Annotation>Maybe the &ldquo;check time&rdquo; field should come before the &ldquo;allowed time&rdquo; field — order feels wrong.</Annotation>
      </DocSection>
    </>
  );

  /* Step 3: View Unit */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>A read-only summary of all the unit&apos;s settings. From here you can edit the unit or copy it to create a new one.</p>
      </DocSection>
      <DocSection title="Actions">
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Edit</strong> — opens the form with all saved details</li>
          <li><strong>Copy Unit</strong> — creates a duplicate with a new name</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>From the View page, the user can see a summary of the Unit details.</Annotation>
        <Annotation>From the View page the user can also duplicate the unit for a new one.</Annotation>
      </DocSection>
    </>
  );

  /* Step 4: Edit Unit */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>The same form as Add Unit, but pre-filled with the unit&apos;s saved details. Change anything and hit Save.</p>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>The edit page opens the Add Unit form with the previously added details saved.</Annotation>
      </DocSection>
    </>
  );

  /* Step 5: Copy Unit */
  return (
    <>
      <DocSection title="What is this?">
        <p>Quick way to duplicate a unit. All settings are copied — you just give the new unit a name.</p>
      </DocSection>
      <DocSection title="Good for">
        <p>Sites with many identical units. Instead of filling out the form 10 times for 10 fridges, set up one and copy the rest.</p>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Once the new unit is named, the popup closes but the unit doesn&apos;t appear in the list. You have to navigate away and back. Should auto-refresh.</Annotation>
        <Annotation>Should the Add Unit form show after copying so the user can review and adjust the settings?</Annotation>
      </DocSection>
      <DocNote type="warning">Copy refresh bug — new unit doesn&apos;t appear until page is revisited.</DocNote>
    </>
  );
}

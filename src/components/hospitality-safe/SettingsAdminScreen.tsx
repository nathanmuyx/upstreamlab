"use client";

import { useState } from "react";
import { DocSection } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type View = "main" | "edit-org" | "edit-location";

const viewToStep: Record<View, number> = { main: 1, "edit-org": 2, "edit-location": 3 };
const stepToView: Record<number, View> = { 1: "main", 2: "edit-org", 3: "edit-location" };

/* ─── Annotation ─── */
function Annotation({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "issue" }) {
  const isIssue = type === "issue";
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: `2px solid ${isIssue ? "#E74C3C" : "#4A5FC1"}` }}>
      <span className="text-[8px] font-medium mr-1" style={{ color: isIssue ? "#E74C3C" : "#4A5FC1" }}>{isIssue ? "Issue:" : "Note:"}</span>{children}
    </div>
  );
}

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("main");

  const go = (v: View) => { setView(v); onSubStepChange?.(viewToStep[v]); };

  /* sync from currentStep prop */
  if (currentStep !== undefined) {
    const expected = stepToView[currentStep] ?? "main";
    if (expected !== view) setView(expected);
  }

  /* ── View 1: Settings Main ── */
  if (view === "main") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <button onClick={() => onNavigateScreen?.("admin-login")} className="text-[9px] font-semibold cursor-pointer" style={{ color: "#4A5FC1" }}>Back</button>
          <span className="text-[10px] font-bold" style={{ color: "#4A5FC1" }}>Settings</span>
          <span className="w-[30px]" />
        </div>
        <p className="text-[7px] text-[#888] text-center mb-1">View settings for this organisation.</p>
        <div className="mx-3 mb-2" style={{ height: 2, background: "#4A5FC1" }} />

        {/* Setting rows */}
        <div className="mx-3 flex-1">
          {/* Row 1: Organisation */}
          <div className="flex items-center justify-between py-3 border-b border-[#E4E7EE]">
            <span className="text-[9px] text-[#333] font-medium">Organisation</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#666]">400 Gradi</span>
              <button onClick={() => go("edit-org")} className="rounded px-3 py-1 text-[8px] font-semibold text-white cursor-pointer" style={{ background: "#4A5FC1" }}>Edit</button>
            </div>
          </div>

          {/* Row 2: Location */}
          <div className="flex items-center justify-between py-3 border-b border-[#E4E7EE]">
            <span className="text-[9px] text-[#333] font-medium">Location</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#666]">Mildura</span>
              <button onClick={() => go("edit-location")} className="rounded px-3 py-1 text-[8px] font-semibold text-white cursor-pointer" style={{ background: "#4A5FC1" }}>Edit</button>
            </div>
          </div>

          {/* Row 3: Manual Temperature Entry toggle */}
          <div className="flex items-center justify-between py-3 border-b border-[#E4E7EE]">
            <span className="text-[9px] text-[#333] font-medium">Allow Manual Temperature Entry</span>
            <div className="flex items-center gap-1.5">
              <div className="rounded-full flex items-center px-1 cursor-pointer" style={{ background: "#E74C3C", width: 32, height: 16 }}>
                <div className="rounded-full bg-white" style={{ width: 12, height: 12 }} />
              </div>
              <span className="text-[7px] text-[#E74C3C] font-medium">Off</span>
            </div>
          </div>
        </div>

        {/* Grey area below */}
        <div className="flex-1 min-h-[60px]" style={{ background: "#f0f0f3" }} />
      </div>
    );
  }

  /* ── View 2: Edit Organisation ── */
  if (view === "edit-org") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <span className="text-[10px] font-bold" style={{ color: "#4A5FC1" }}>Edit Organisation</span>
          <button onClick={() => go("main")} className="text-[9px] font-semibold cursor-pointer" style={{ color: "#E74C3C" }}>Cancel</button>
        </div>
        <p className="text-[7px] text-[#888] px-3 mb-1">Update the details of this organisation.</p>
        <div className="mx-3 mb-2" style={{ height: 2, background: "#4A5FC1" }} />

        {/* Fields */}
        <div className="mx-3 flex-1 space-y-2.5">
          {/* Business Name */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Name</label>
            <input type="text" defaultValue="400 Gradi" className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none bg-white" readOnly />
          </div>

          {/* Business Address */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Address</label>
            <input type="text" defaultValue="31 Deakin Ave, Mildura 3500 VIC" className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none" style={{ background: "#f5f5f5" }} readOnly />
          </div>

          {/* Business Type */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Type</label>
            <select className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none bg-white" defaultValue="Restaurant">
              <option>Restaurant</option>
              <option>Cafe</option>
              <option>Hotel</option>
              <option>Catering</option>
            </select>
          </div>

          {/* Separator */}
          <div className="border-t border-[#E4E7EE]" />

          {/* Photo (optional) */}
          <div className="flex items-start gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0 pt-6">Photo (optional)</label>
            <div className="rounded border-2 border-dashed border-[#ccc] flex items-center justify-center cursor-pointer hover:border-[#4A5FC1] transition-colors" style={{ width: 120, height: 90, background: "#fafafa" }}>
              <span className="text-[8px] font-medium" style={{ color: "#4A5FC1" }}>Add Photo</span>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button onClick={() => go("main")} className="rounded px-6 py-2 text-[9px] font-semibold text-white cursor-pointer hover:opacity-90" style={{ background: "#4A5FC1" }}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View 3: Edit Location ── */
  if (view === "edit-location") {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <span className="text-[10px] font-bold" style={{ color: "#4A5FC1" }}>Edit Location</span>
          <button onClick={() => go("main")} className="text-[9px] font-semibold cursor-pointer" style={{ color: "#E74C3C" }}>Cancel</button>
        </div>
        <p className="text-[7px] text-[#888] px-3 mb-1">Update the details of this location.</p>
        <div className="mx-3 mb-2" style={{ height: 2, background: "#4A5FC1" }} />

        {/* Fields */}
        <div className="mx-3 flex-1 space-y-2.5">
          {/* Business Name */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Name</label>
            <input type="text" defaultValue="Mildura" className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none bg-white" readOnly />
          </div>

          {/* Business Address */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Address</label>
            <input type="text" defaultValue="31 Deakin Ave, Mildura 3500 VIC" className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none" style={{ background: "#f5f5f5" }} readOnly />
          </div>

          {/* Business Type */}
          <div className="flex items-center gap-2">
            <label className="text-[8px] text-[#666] font-medium w-[100px] shrink-0">Business Type</label>
            <select className="flex-1 px-2 py-1 border border-[#E4E7EE] rounded text-[9px] text-[#333] outline-none bg-white" defaultValue="Restaurant">
              <option>Restaurant</option>
              <option>Cafe</option>
              <option>Hotel</option>
              <option>Catering</option>
            </select>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-4">
            <button onClick={() => go("main")} className="rounded px-6 py-2 text-[9px] font-semibold text-white cursor-pointer hover:opacity-90" style={{ background: "#4A5FC1" }}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Settings Main */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>Main settings page. Currently only 3 options: edit the organisation, edit the location, or toggle manual temperature entry.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Organisation</strong> is the head office or business level. Think of it as the company that owns one or more stores.</li>
          <li><strong>Location</strong> is an individual store or premises. One organisation can have many locations.</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="info">Currently these are the only settings options on the app.</Annotation>
        <Annotation type="info">Allow Manual Temperature Entry prevents staff from typing temperatures manually. This stops human error and falsifying records. Turn it off if you have Bluetooth thermometers.</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: Edit Organisation */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Edit your business name, address, type, and logo. This is the head office or business level info.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="info">Business can edit name, address, type and add a photo of the logo.</Annotation>
        <Annotation type="issue">Organisation vs Location is confusing. For franchises, Organisation = head office, Location = individual store. This needs to be clearer.</Annotation>
        <Annotation type="info">The address field is a type-and-search field (Google Places).</Annotation>
      </DocSection>
    </>
  );

  /* Step 3: Edit Location */
  return (
    <>
      <DocSection title="What is this?">
        <p>Edit this specific location&apos;s name, address, and type. This is the individual store or premises.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="info">The location is for the individual premises. E.g. Gradi restaurant location Mildura.</Annotation>
      </DocSection>
    </>
  );
}

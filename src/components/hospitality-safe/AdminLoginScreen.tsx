"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/lib/hospitality-safe-docs";
import { AppSidebar } from "@/components/hospitality-safe/AppSidebar";

/* ─── data ─── */
const adminTiles = ["Areas", "Devices", "Foods", "Units", "Users", "Settings"];
const tileToScreen: Record<string, string> = {
  Areas: "areas",
  Devices: "admin-devices",
  Foods: "admin-foods",
  Units: "admin-units",
  Users: "admin-users",
  Settings: "settings",
};

type View = "auth" | "panel";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("auth");

  const go = (v: View) => { setView(v); onSubStepChange?.(v === "auth" ? 1 : 2); };

  if (currentStep !== undefined) {
    const expected: View = currentStep >= 2 ? "panel" : "auth";
    if (expected !== view) setView(expected);
  }

  /* ── Auth ── */
  if (view === "auth") {
    return (
      <div className="flex h-full min-h-[380px]">
        <AppSidebar activeId="admin" />
        <div className="flex-1 flex items-center justify-center" style={{ background: "#f0f0f3" }}>
          <div className="bg-white rounded-md p-5 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)", width: 280 }}>
            <h2 className="text-[13px] font-bold text-[#1a1a1a] mb-4">Authentication Required</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center border border-[#ccc] rounded px-2 py-1.5" style={{ background: "#fafafa" }}>
                <span className="flex-1 text-[10px] text-[#333] tracking-[2px]">••••••••</span>
                <span className="text-[8px] text-[#4A5FC1] cursor-pointer font-medium">Show</span>
              </div>
              <button onClick={() => go("panel")} className="rounded px-3 py-1.5 text-[10px] font-semibold text-white cursor-pointer" style={{ background: "#27AE60" }}>Go</button>
            </div>
            <span className="text-[9px] text-[#4A5FC1] cursor-pointer">Cancel</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Admin Panel ── */
  if (view === "panel") {
    return (
      <div className="h-full flex flex-col bg-white">
        <Header title="Admin" subtitle="All admin settings and options for this account" />
        <div className="flex flex-wrap gap-2 p-4" style={{ background: "#f0f0f3" }}>
          {adminTiles.map((label) => (
            <button key={label} onClick={() => { const target = tileToScreen[label]; if (target && onNavigateScreen) onNavigateScreen(target); }} className="rounded-md text-white text-[9px] font-semibold flex items-center justify-center cursor-pointer hover:opacity-90" style={{ background: "#4A5FC1", width: 72, height: 72 }}>
              {label}
            </button>
          ))}
          <button onClick={() => go("auth")} className="rounded-md text-white text-[9px] font-semibold flex items-center justify-center cursor-pointer leading-tight text-center" style={{ background: "#E74C3C", width: 72, height: 72 }}>
            End Admin{"\n"}Session
          </button>
        </div>
      </div>
    );
  }

  /* ── Fallback ── */
  return null;
}

/* ─── Shared UI ─── */
function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center pt-3 pb-2 border-b border-[#E4E7EE] shrink-0">
      <h2 className="text-[13px] font-bold" style={{ color: "#4A5FC1" }}>{title}</h2>
      <p className="text-[8px] text-[#888] mt-0.5">{subtitle}</p>
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

  /* Step 1: Auth Required */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>Admin needs a password to get in. Only the person who signed up has this password.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Type the password and press Go to enter admin</li>
          <li>This is not a PIN — it is the password from account creation</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>When the admin panel is pressed the admin needs to enter their password. Only the person who initially signs up can access this. Do we change this to PIN? Do we allow superusers to create passwords?</Annotation>
      </DocSection>
      <DocNote type="warning">
        Only one person has the password. If they leave or forget it, nobody can get into admin. This is an operational risk.
      </DocNote>
    </>
  );

  /* Step 2: Admin Panel */
  return (
    <>
      <DocSection title="What is this?">
        <p>The admin dashboard. Click any tile to manage that section: Areas, Devices, Foods, Units, Users, Settings.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Each tile opens a different settings page</li>
          <li>Press &ldquo;End Admin Session&rdquo; to log out of admin</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Once the user successfully logs into the admin panel they can view settings sections.</Annotation>
      </DocSection>
    </>
  );
}

"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/lib/hospitality-safe-docs";

/* ─── types ─── */
type AuditStatus = "due" | "in-progress" | "completed";
type ItemResult = "pass" | "fail" | "na" | null;

interface AuditItem {
  id: number;
  description: string;
  result: ItemResult;
  note?: string;
}

interface AuditSection {
  name: string;
  items: AuditItem[];
}

interface Audit {
  id: number;
  name: string;
  type: string;
  typeColor: string;
  status: AuditStatus;
  dueDate?: string;
  progress: number;
  score: number | null;
  completedBy?: string;
  completedDate?: string;
  sections?: AuditSection[];
}

interface AuditTemplate {
  id: number;
  name: string;
  type: string;
  typeColor: string;
  sections: number;
  items: number;
  source: "Platform" | "Custom";
}

const audits: Audit[] = [
  {
    id: 1,
    name: "Monthly Food Safety Audit",
    type: "Food Safety",
    typeColor: "#2E75B6",
    status: "due",
    dueDate: "20/03/2026",
    progress: 0,
    score: null,
  },
  {
    id: 2,
    name: "Quarterly Allergen Audit",
    type: "Allergens",
    typeColor: "#9B59B6",
    status: "due",
    dueDate: "01/04/2026",
    progress: 0,
    score: null,
  },
  {
    id: 3,
    name: "Weekly Kitchen Inspection",
    type: "Health & Safety",
    typeColor: "#27AE60",
    status: "in-progress",
    progress: 60,
    score: 78,
    sections: [
      {
        name: "Section 1: Floors, Walls, Ceiling",
        items: [
          { id: 1, description: "Floors clean and in good repair", result: "pass" },
          { id: 2, description: "Walls clean, no peeling paint", result: "pass" },
          { id: 3, description: "Ceiling tiles intact, no moisture", result: "fail", note: "Water stain near vent" },
          { id: 4, description: "Floor drains clean and functional", result: "na" },
        ],
      },
      {
        name: "Section 2: Food Storage",
        items: [
          { id: 5, description: "Food stored off the floor (min 15cm)", result: "pass" },
          { id: 6, description: "Raw and cooked foods separated", result: "pass" },
          { id: 7, description: "All containers labelled with date", result: null },
          { id: 8, description: "FIFO rotation being followed", result: null },
        ],
      },
      {
        name: "Section 3: Personal Hygiene",
        items: [
          { id: 9, description: "Hand wash stations stocked with soap", result: null },
          { id: 10, description: "Staff wearing clean uniforms", result: null },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Monthly Food Safety Audit",
    type: "Food Safety",
    typeColor: "#2E75B6",
    status: "completed",
    progress: 100,
    score: 92,
    completedBy: "Sarah C.",
    completedDate: "01/03",
  },
  {
    id: 5,
    name: "Allergen Compliance Check",
    type: "Allergens",
    typeColor: "#9B59B6",
    status: "completed",
    progress: 100,
    score: 85,
    completedBy: "James L.",
    completedDate: "15/02",
  },
  {
    id: 6,
    name: "Customer Service Review",
    type: "Customer Service",
    typeColor: "#F39C12",
    status: "completed",
    progress: 100,
    score: 71,
    completedBy: "Emily T.",
    completedDate: "01/02",
  },
];

const templates: AuditTemplate[] = [
  { id: 1, name: "FSANZ Food Safety Audit", type: "Food Safety", typeColor: "#2E75B6", sections: 8, items: 64, source: "Platform" },
  { id: 2, name: "Health & Safety Checklist", type: "Health & Safety", typeColor: "#27AE60", sections: 6, items: 42, source: "Platform" },
  { id: 3, name: "Custom Kitchen Audit", type: "Food Safety", typeColor: "#2E75B6", sections: 4, items: 28, source: "Custom" },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<"due" | "in-progress" | "completed" | "templates">("due");
  const [executingAudit, setExecutingAudit] = useState<Audit | null>(null);
  const [itemResults, setItemResults] = useState<Record<number, ItemResult>>({});
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});

  void selectedArea;

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "due", label: "Due" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
    { key: "templates", label: "Templates" },
  ];

  /* initialize item results from audit data when starting execution */
  const startExecution = (audit: Audit) => {
    const results: Record<number, ItemResult> = {};
    const notes: Record<number, string> = {};
    if (audit.sections) {
      audit.sections.forEach((section) => {
        section.items.forEach((item) => {
          results[item.id] = item.result;
          if (item.note) notes[item.id] = item.note;
        });
      });
    }
    setItemResults(results);
    setItemNotes(notes);
    setExecutingAudit(audit);
  };

  const setResult = (itemId: number, result: ItemResult) => {
    setItemResults((prev) => ({ ...prev, [itemId]: result }));
  };

  /* ─── execution view ─── */
  if (executingAudit && executingAudit.sections) {
    const allItems = executingAudit.sections.flatMap((s) => s.items);
    const answered = allItems.filter((item) => itemResults[item.id] !== null && itemResults[item.id] !== undefined).length;
    const total = allItems.length;
    const progressPct = Math.round((answered / total) * 100);
    const passCount = allItems.filter((item) => itemResults[item.id] === "pass").length;
    const failCount = allItems.filter((item) => itemResults[item.id] === "fail").length;
    const scored = passCount + failCount;
    const scorePct = scored > 0 ? Math.round((passCount / scored) * 100) : 0;

    const resultButtonStyle = (itemId: number, target: ItemResult) => {
      const current = itemResults[itemId];
      const base = "px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors border ";
      if (current === target) {
        if (target === "pass") return base + "bg-[#27AE60] text-white border-[#27AE60]";
        if (target === "fail") return base + "bg-[#E74C3C] text-white border-[#E74C3C]";
        return base + "bg-[#95A5A6] text-white border-[#95A5A6]";
      }
      return base + "bg-white text-[#666] border-[#E4E7EE] hover:bg-[#F5F6FA]";
    };

    return (
      <div className="p-4 space-y-4">
        {/* Back */}
        <button
          onClick={() => setExecutingAudit(null)}
          className="flex items-center gap-1.5 text-[12px] text-[#2E75B6] hover:text-[#1a5a94] cursor-pointer font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          Back to Audits
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-bold text-[#333]">{executingAudit.name}</h2>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: executingAudit.typeColor + "18", color: executingAudit.typeColor }}
              >
                {executingAudit.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-[24px] font-bold" style={{ color: scorePct >= 80 ? "#27AE60" : scorePct >= 60 ? "#F39C12" : "#E74C3C" }}>
                {scored > 0 ? `${scorePct}%` : "\u2013"}
              </div>
              <div className="text-[10px] text-[#999]">Running Score</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%`, background: "#2E75B6" }}
              />
            </div>
            <span className="text-[11px] text-[#666] font-medium shrink-0">{progressPct}% ({answered}/{total})</span>
          </div>
        </div>

        {/* Sections */}
        {executingAudit.sections.map((section, si) => (
          <div key={si} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-[#E4E7EE]">
              <h3 className="text-[12px] font-semibold text-[#333]">{section.name}</h3>
            </div>
            <div className="divide-y divide-[#F0F0F0]">
              {section.items.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#333] font-medium mb-1.5">{item.description}</div>
                      {/* Result buttons */}
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setResult(item.id, "pass")} className={resultButtonStyle(item.id, "pass")}>
                          Pass
                        </button>
                        <button onClick={() => setResult(item.id, "fail")} className={resultButtonStyle(item.id, "fail")}>
                          Fail
                        </button>
                        <button onClick={() => setResult(item.id, "na")} className={resultButtonStyle(item.id, "na")}>
                          N/A
                        </button>
                      </div>
                      {/* Note area for fail items */}
                      {itemResults[item.id] === "fail" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={itemNotes[item.id] || ""}
                            onChange={(e) => setItemNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            placeholder="Add note for failed item..."
                            className="w-full border border-[#E4E7EE] rounded px-2.5 py-1.5 text-[11px] text-[#333] focus:outline-none focus:border-[#E74C3C]"
                          />
                        </div>
                      )}
                      {/* Show existing note if present */}
                      {itemNotes[item.id] && itemResults[item.id] !== "fail" && (
                        <div className="mt-1.5 text-[10px] text-[#E74C3C] italic">Note: {itemNotes[item.id]}</div>
                      )}
                    </div>
                    {/* Photo upload icon */}
                    <button className="shrink-0 p-1.5 rounded hover:bg-[#F5F6FA] cursor-pointer text-[#999] hover:text-[#666]" title="Add photo">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md text-[12px] font-medium text-[#666] border border-[#E4E7EE] hover:bg-[#F5F6FA] cursor-pointer">
            Save Draft
          </button>
          <button className="px-4 py-2 rounded-md text-[12px] font-bold text-white bg-[#27AE60] hover:bg-[#219a52] cursor-pointer">
            Submit Audit
          </button>
        </div>
      </div>
    );
  }

  /* ─── list views ─── */
  const filtered = audits.filter((a) => a.status === (activeTab === "in-progress" ? "in-progress" : activeTab === "completed" ? "completed" : "due"));

  return (
    <div className="p-4 space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-colors ${
              activeTab === tab.key
                ? "bg-[#2E75B6] text-white"
                : "text-[#666] hover:bg-[#F5F6FA]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Due / In Progress cards */}
      {(activeTab === "due" || activeTab === "in-progress") && (
        <div className="space-y-2">
          {filtered.map((audit) => (
            <div key={audit.id} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[13px] font-semibold text-[#333]">{audit.name}</span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: audit.typeColor + "18", color: audit.typeColor }}
                    >
                      {audit.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-[#666]">
                    {audit.dueDate && (
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                        Due: {audit.dueDate}
                      </div>
                    )}
                    <div>Score: {audit.score !== null ? `${audit.score}%` : "\u2013"}</div>
                  </div>

                  {/* Progress bar for in-progress */}
                  {audit.status === "in-progress" && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden max-w-[200px]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${audit.progress}%`, background: "#2E75B6" }}
                        />
                      </div>
                      <span className="text-[11px] text-[#666] font-medium">{audit.progress}%</span>
                      {audit.score !== null && (
                        <span className="text-[11px] font-medium" style={{ color: audit.score >= 80 ? "#27AE60" : audit.score >= 60 ? "#F39C12" : "#E74C3C" }}>
                          Current Score: {audit.score}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => audit.sections ? startExecution(audit) : null}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold cursor-pointer shrink-0 ${
                    audit.status === "in-progress"
                      ? "bg-[#F39C12] text-white hover:bg-[#d68910]"
                      : "bg-[#2E75B6] text-white hover:bg-[#24608f]"
                  }`}
                >
                  {audit.status === "in-progress" ? "Continue" : "Start"}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10">
              <div className="text-[32px] mb-2">{activeTab === "in-progress" ? "\ud83d\udcca" : "\ud83d\udccb"}</div>
              <div className="text-[13px] text-[#999]">No {activeTab} audits</div>
            </div>
          )}
        </div>
      )}

      {/* Completed table */}
      {activeTab === "completed" && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E4E7EE]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Audit Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Completed By</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Score</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((audit) => {
                const scoreIcon = audit.score !== null && audit.score >= 80 ? " \u2705" : audit.score !== null && audit.score < 75 ? " \u26a0\ufe0f" : "";
                return (
                  <tr key={audit.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3 font-medium text-[#333]">{audit.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: audit.typeColor + "18", color: audit.typeColor }}
                      >
                        {audit.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666]">{audit.completedBy}</td>
                    <td className="px-4 py-3 text-[#666]">{audit.completedDate}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: audit.score !== null && audit.score >= 80 ? "#27AE60" : audit.score !== null && audit.score >= 60 ? "#F39C12" : "#E74C3C" }}>
                        {audit.score}%{scoreIcon}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-[11px] font-medium text-[#2E75B6] hover:underline cursor-pointer">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Templates table */}
      {activeTab === "templates" && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E4E7EE]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Template Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Sections</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Items</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Source</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tmpl) => (
                <tr key={tmpl.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3 font-medium text-[#333]">{tmpl.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: tmpl.typeColor + "18", color: tmpl.typeColor }}
                    >
                      {tmpl.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#666]">{tmpl.sections}</td>
                  <td className="px-4 py-3 text-[#666]">{tmpl.items}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tmpl.source === "Platform" ? "bg-[#2E75B6]/10 text-[#2E75B6]" : "bg-[#F39C12]/10 text-[#F39C12]"}`}>
                      {tmpl.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-[11px] font-medium text-[#2E75B6] hover:underline cursor-pointer">View</button>
                      <span className="text-[#E4E7EE]">|</span>
                      <button className="text-[11px] font-medium text-[#2E75B6] hover:underline cursor-pointer">Duplicate</button>
                      {tmpl.source === "Custom" && (
                        <>
                          <span className="text-[#E4E7EE]">|</span>
                          <button className="text-[11px] font-medium text-[#2E75B6] hover:underline cursor-pointer">Edit</button>
                          <span className="text-[#E4E7EE]">|</span>
                          <button className="text-[11px] font-medium text-[#E74C3C] hover:underline cursor-pointer">Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs() {
  return (
    <>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#2E75B6]">Documentation</span>
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Audits</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Audits module provides structured assessments for food safety compliance, health and safety inspections, allergen management, and custom business reviews with scoring and evidence collection.
        </p>
      </div>

      <DocSection title="FSANZ Compliance">
        <p>Hospitality Safe includes audit templates aligned with the <strong>Food Standards Australia New Zealand (FSANZ)</strong> Food Standards Code. These templates cover:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Food handling and storage requirements</li>
          <li>Temperature control and cold chain compliance</li>
          <li>Premises cleanliness and maintenance</li>
          <li>Personal hygiene and staff training records</li>
          <li>Allergen management and labelling</li>
          <li>Pest control documentation</li>
        </ul>
        <p className="mt-2">Platform-provided templates are regularly updated to reflect changes in food safety regulations.</p>
      </DocSection>

      <DocSection title="Audit Types">
        <p>The platform supports multiple audit categories:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Food Safety</strong> &mdash; FSANZ-aligned assessments covering all aspects of food handling, storage, and preparation</li>
          <li><strong>Health & Safety</strong> &mdash; Workplace safety inspections including premises condition, equipment, and hazards</li>
          <li><strong>Allergens</strong> &mdash; Allergen management compliance checks, cross-contamination controls, and labelling accuracy</li>
          <li><strong>Customer Service</strong> &mdash; Service quality reviews, cleanliness standards, presentation audits</li>
        </ul>
      </DocSection>

      <DocSection title="Audits vs Checklists">
        <p>While both audits and checklists involve structured item review, they serve different purposes:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Checklists</strong> are simple mark-off lists (done/not done). Used for daily routines like opening and closing procedures.</li>
          <li><strong>Audits</strong> use a scoring/rating system (pass/fail/N/A) with percentage-based results. Used for periodic compliance assessments.</li>
          <li>Audits include section-level and overall scoring breakdowns</li>
          <li>Audit results feed into compliance trend reports and can trigger corrective-action tasks</li>
          <li>Failed audit items can automatically create tasks in the Task Manager</li>
        </ul>
      </DocSection>

      <DocSection title="Template System">
        <p>Audits are built from templates. Two types of templates are available:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Platform-provided:</strong> Pre-built templates based on FSANZ standards and industry best practices. These are read-only but can be duplicated and customized.</li>
          <li><strong>Custom:</strong> Business-created templates for specific operational needs. Fully editable with custom sections, items, and scoring weights.</li>
        </ul>
        <p className="mt-2">Templates define sections (logical groupings) and items (individual assessment points). Each template can be scheduled for regular completion.</p>
      </DocSection>

      <DocSection title="Auditor Access">
        <p>External auditors (e.g. council inspectors, third-party food safety auditors) can be granted temporary access:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>View-only role</strong> with access limited to audit records, scores, and evidence</li>
          <li><strong>Time-limited sessions</strong> that automatically expire after a set period</li>
          <li>No ability to modify records or access business configuration</li>
          <li>Audit trail of what the external auditor viewed</li>
        </ul>
      </DocSection>

      <DocSection title="Scoring System">
        <p>Audits use a percentage-based scoring system:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Each item is marked <strong>Pass</strong>, <strong>Fail</strong>, or <strong>N/A</strong></li>
          <li>Score = (Pass items) / (Pass + Fail items) &times; 100%</li>
          <li>N/A items are excluded from the score calculation</li>
          <li>Section-level breakdowns show which areas need improvement</li>
          <li>Scores are color-coded: <span style={{ color: "#27AE60" }}>green (&ge;80%)</span>, <span style={{ color: "#F39C12" }}>orange (60-79%)</span>, <span style={{ color: "#E74C3C" }}>red (&lt;60%)</span></li>
        </ul>
      </DocSection>

      <DocSection title="Photo Evidence">
        <p>Photos can be attached at the item level during an audit to provide visual evidence of compliance or non-conformance. This is particularly important for:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Documenting failed items with photographic proof</li>
          <li>Before/after comparisons for corrective actions</li>
          <li>Providing evidence to external auditors or council inspectors</li>
          <li>Building a visual compliance record over time</li>
        </ul>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Complete assigned audits within their area"],
          ["Team Leader", "Complete audits, view section-level results for their area"],
          ["Manager", "Create/schedule audits, view all results, export reports, create templates"],
          ["Superuser", "Cross-location audit oversight, manage platform templates, configure scoring"],
          ["Viewer/Auditor", "Read-only access to completed audits and scores (time-limited)"],
        ]} />
      </DocSection>

      <DocNote type="info">
        Completed audit scores are tracked over time, enabling trend analysis. Managers can view score progression by audit type, section, or location to identify systemic issues.
      </DocNote>

      <DocNote type="warning">
        Failed audit items with a score below the configured threshold will automatically create corrective-action tasks in the Task Manager, ensuring follow-up accountability.
      </DocNote>
    </>
  );
}

"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/lib/hospitality-safe-docs";

/* ─── types ─── */
type TabId = "due" | "in-progress" | "completed" | "library";

interface ChecklistCard {
  name: string;
  area: string;
  areaColor: string;
  schedule: string;
  totalItems: number;
  completedItems: number;
  status: "due" | "upcoming" | "overdue";
}

interface ChecklistJob {
  num: number;
  desc: string;
  markType: "tick" | "yesno" | "text" | "photo" | "temperature";
  done: boolean;
  result?: string;
  doneBy?: string;
  doneAt?: string;
}

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("due");
  const [executingChecklist, setExecutingChecklist] = useState<string | null>(null);

  const tabs: { id: TabId; label: string }[] = [
    { id: "due", label: "Due" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "library", label: "Library" },
  ];

  /* ── Due tab data ── */
  const dueChecklists: ChecklistCard[] = [
    { name: "Opening Checklist", area: "Kitchen", areaColor: "#2E75B6", schedule: "Daily \u2013 Due by 9:00 AM", totalItems: 8, completedItems: 0, status: "due" },
    { name: "Temperature Verification", area: "All Areas", areaColor: "#27AE60", schedule: "Daily \u2013 Due by 10:00 AM", totalItems: 5, completedItems: 0, status: "upcoming" },
    { name: "Allergen Station Check", area: "Kitchen", areaColor: "#2E75B6", schedule: "Daily \u2013 Due by 8:30 AM", totalItems: 6, completedItems: 0, status: "overdue" },
    { name: "Evening Close-Down", area: "All Areas", areaColor: "#27AE60", schedule: "Daily \u2013 Due by 10:00 PM", totalItems: 12, completedItems: 0, status: "upcoming" },
  ];

  /* ── In Progress data ── */
  const inProgressChecklists = [
    { name: "Cleaning Schedule", area: "Grill", areaColor: "#F39C12", totalItems: 10, completedItems: 5 },
  ];

  /* ── Completed data ── */
  const completedRows = [
    { name: "Opening Checklist", completedBy: "Sarah C.", dateTime: "16/03, 8:45 AM", items: "8/8", signedOff: true },
  ];

  /* ── Library data ── */
  const libraryRows = [
    { name: "Opening Checklist", area: "Kitchen", schedule: "Daily", totalItems: 8, createdBy: "Sarah C." },
    { name: "Temperature Verification", area: "All Areas", schedule: "Daily", totalItems: 5, createdBy: "Sarah C." },
    { name: "Allergen Station Check", area: "Kitchen", schedule: "Daily", totalItems: 6, createdBy: "James L." },
    { name: "Evening Close-Down", area: "All Areas", schedule: "Daily", totalItems: 12, createdBy: "Sarah C." },
    { name: "Cleaning Schedule", area: "Grill", schedule: "Daily", totalItems: 10, createdBy: "Emily T." },
  ];

  /* ── Execution view jobs ── */
  const executionJobs: ChecklistJob[] = [
    { num: 1, desc: "Check all fridge temperatures are in range", markType: "tick", done: true, doneBy: "Sarah C.", doneAt: "8:15 AM" },
    { num: 2, desc: "Verify handwash stations stocked", markType: "yesno", done: true, result: "Yes", doneBy: "Sarah C.", doneAt: "8:16 AM" },
    { num: 3, desc: "Inspect food storage areas for pests", markType: "yesno", done: false },
    { num: 4, desc: "Check cleaning chemical levels", markType: "text", done: false },
    { num: 5, desc: "Photo of prep area setup", markType: "photo", done: false },
    { num: 6, desc: "Record coolroom temperature", markType: "temperature", done: false },
    { num: 7, desc: "Verify allergen labels displayed", markType: "tick", done: false },
    { num: 8, desc: "Confirm staff uniforms compliant", markType: "tick", done: false },
  ];

  const statusBadge = (status: "due" | "upcoming" | "overdue") => {
    const styles = {
      due: { bg: "#FFF3E0", text: "#E65100", label: "\u23f0 Due Now" },
      upcoming: { bg: "#F0F0F0", text: "#666", label: "\uD83D\uDCC5 Upcoming" },
      overdue: { bg: "#FDE8E8", text: "#E74C3C", label: "\u274c Overdue" },
    };
    const s = styles[status];
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.text }}>
        {s.label}
      </span>
    );
  };

  const markTypeIcon = (type: ChecklistJob["markType"]) => {
    switch (type) {
      case "tick": return "\u2610";
      case "yesno": return "Y/N";
      case "text": return "\u270D";
      case "photo": return "\uD83D\uDCF7";
      case "temperature": return "\uD83C\uDF21";
    }
  };

  const markTypeLabel = (type: ChecklistJob["markType"]) => {
    switch (type) {
      case "tick": return "Tick";
      case "yesno": return "Yes / No";
      case "text": return "Free Text";
      case "photo": return "Photo";
      case "temperature": return "Temperature";
    }
  };

  const filteredDue =
    selectedArea === "All Areas"
      ? dueChecklists
      : dueChecklists.filter((c) => c.area === selectedArea || c.area === "All Areas");

  const filteredLibrary =
    selectedArea === "All Areas"
      ? libraryRows
      : libraryRows.filter((c) => c.area === selectedArea || c.area === "All Areas");

  /* ── Execution View ── */
  if (executingChecklist) {
    const doneCount = executionJobs.filter((j) => j.done).length;
    const progress = Math.round((doneCount / executionJobs.length) * 100);

    return (
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExecutingChecklist(null)}
                className="text-[12px] text-[#2E75B6] font-medium hover:underline cursor-pointer"
              >
                &larr; Back
              </button>
              <h3 className="text-[14px] font-semibold text-[#333]">{executingChecklist}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#EBF5FF", color: "#2E75B6" }}>Kitchen</span>
              <span className="text-[11px] text-[#666]">Due by 9:00 AM</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[6px] rounded-full bg-[#E4E7EE] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "#27AE60" }} />
            </div>
            <span className="text-[11px] text-[#666] font-medium shrink-0">{doneCount} of {executionJobs.length} items</span>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-2">
          {executionJobs.map((job) => (
            <div
              key={job.num}
              className={`rounded-lg border p-3 ${
                job.done
                  ? "bg-[#F0FFF4] border-[#C6F6D5]"
                  : "bg-white border-[#E4E7EE]"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Number */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  job.done ? "bg-[#27AE60] text-white" : "bg-[#F5F6FA] text-[#666]"
                }`}>
                  {job.done ? "\u2713" : job.num}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#333]">{job.desc}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-[#999] bg-[#F5F6FA] px-1.5 py-0.5 rounded">
                      {markTypeIcon(job.markType)} {markTypeLabel(job.markType)}
                    </span>
                    {job.done && job.doneBy && (
                      <span className="text-[10px] text-[#27AE60] font-medium">
                        {job.result ? `${job.result} \u2013 ` : "\u2713 "}{job.doneBy} {job.doneAt}
                      </span>
                    )}
                    {!job.done && (
                      <button className="text-[10px] text-[#E74C3C] hover:underline cursor-pointer">
                        {"\uD83D\uDEA9"} Flag Issue
                      </button>
                    )}
                  </div>
                </div>

                {/* Action area for incomplete items */}
                {!job.done && (
                  <div className="shrink-0">
                    {job.markType === "tick" && (
                      <button className="w-6 h-6 rounded border-2 border-[#ccc] hover:border-[#2E75B6] cursor-pointer transition-colors" />
                    )}
                    {job.markType === "yesno" && (
                      <div className="flex gap-1">
                        <button className="text-[10px] px-2 py-1 rounded border border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white cursor-pointer transition-colors">Yes</button>
                        <button className="text-[10px] px-2 py-1 rounded border border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white cursor-pointer transition-colors">No</button>
                      </div>
                    )}
                    {job.markType === "text" && (
                      <div className="w-[120px]">
                        <input type="text" placeholder="Enter note..." className="w-full text-[11px] px-2 py-1 rounded border border-[#E4E7EE] text-[#333]" readOnly />
                      </div>
                    )}
                    {job.markType === "photo" && (
                      <button className="text-[18px] w-8 h-8 rounded border border-dashed border-[#ccc] flex items-center justify-center hover:border-[#2E75B6] cursor-pointer transition-colors">
                        {"\uD83D\uDCF7"}
                      </button>
                    )}
                    {job.markType === "temperature" && (
                      <div className="flex items-center gap-1">
                        <input type="text" placeholder="0.0" className="w-[48px] text-[11px] px-2 py-1 rounded border border-[#E4E7EE] text-[#333] text-right" readOnly />
                        <span className="text-[11px] text-[#999]">&deg;C</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-3">
          <button className="text-[12px] px-3 py-1.5 rounded border border-[#E4E7EE] text-[#666] hover:bg-[#F5F6FA] cursor-pointer">
            &larr; Previous
          </button>
          <button
            className="text-[12px] px-4 py-1.5 rounded font-medium text-white cursor-not-allowed opacity-50"
            style={{ background: "#2E75B6" }}
            disabled
          >
            Complete Checklist
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded border border-[#E4E7EE] text-[#666] hover:bg-[#F5F6FA] cursor-pointer">
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }

  /* ── Tab Views ── */
  return (
    <div className="p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? "bg-[#2E75B6] text-white"
                  : "bg-white text-[#666] border border-[#E4E7EE] hover:bg-[#F5F6FA]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#2E75B6" }}
        >
          <span className="text-[14px]">+</span> New Checklist
        </button>
      </div>

      {/* ── DUE TAB ── */}
      {activeTab === "due" && (
        <div className="grid grid-cols-2 gap-3">
          {filteredDue.map((c, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-[13px] font-semibold text-[#333]">{c.name}</h4>
                {statusBadge(c.status)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: c.areaColor }}>{c.area}</span>
              </div>
              <div className="text-[11px] text-[#666] mb-1">{c.schedule}</div>
              <div className="text-[11px] text-[#999] mb-3">{c.completedItems} of {c.totalItems} items</div>
              <button
                onClick={() => setExecutingChecklist(c.name)}
                className="w-full text-center text-[12px] font-medium py-1.5 rounded text-white cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: "#2E75B6" }}
              >
                Start
              </button>
            </div>
          ))}
          {filteredDue.length === 0 && (
            <div className="col-span-2 text-center py-8 text-[12px] text-[#999]">No checklists due for the selected area.</div>
          )}
        </div>
      )}

      {/* ── IN PROGRESS TAB ── */}
      {activeTab === "in-progress" && (
        <div className="grid grid-cols-2 gap-3">
          {inProgressChecklists.map((c, i) => {
            const progress = Math.round((c.completedItems / c.totalItems) * 100);
            return (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-[13px] font-semibold text-[#333]">{c.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: c.areaColor }}>{c.area}</span>
                </div>
                <div className="text-[11px] text-[#666] mb-2">{c.completedItems} of {c.totalItems} items completed</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-[6px] rounded-full bg-[#E4E7EE] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "#2E75B6" }} />
                  </div>
                  <span className="text-[10px] text-[#666] font-medium">{progress}%</span>
                </div>
                <button
                  onClick={() => setExecutingChecklist(c.name)}
                  className="w-full text-center text-[12px] font-medium py-1.5 rounded text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: "#2E75B6" }}
                >
                  Continue
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── COMPLETED TAB ── */}
      {activeTab === "completed" && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: "#1B2A4A" }}>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Checklist Name</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Completed By</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Date / Time</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Items</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Sign-off Status</th>
              </tr>
            </thead>
            <tbody>
              {completedRows.map((r, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-[#F9FAFB]" : ""} style={{ borderBottom: "1px solid #E4E7EE" }}>
                  <td className="px-3 py-2.5 font-medium text-[#333]">{r.name}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.completedBy}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.dateTime}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.items}</td>
                  <td className="px-3 py-2.5">
                    {r.signedOff ? (
                      <span className="text-[#27AE60] font-semibold">{"\u2705"} Signed Off</span>
                    ) : (
                      <span className="text-[#F39C12] font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── LIBRARY TAB ── */}
      {activeTab === "library" && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: "#1B2A4A" }}>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Name</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Area</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Schedule</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Total Items</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Created By</th>
                <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLibrary.map((r, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-[#F9FAFB]" : ""} style={{ borderBottom: "1px solid #E4E7EE" }}>
                  <td className="px-3 py-2.5 font-medium text-[#333]">{r.name}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.area}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.schedule}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.totalItems}</td>
                  <td className="px-3 py-2.5 text-[#666]">{r.createdBy}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-[11px] text-[#2E75B6] hover:underline cursor-pointer" title="Edit">{"\u270F\uFE0F"}</button>
                      <button className="text-[11px] text-[#666] hover:underline cursor-pointer" title="Duplicate">{"\uD83D\uDCCB"}</button>
                      <button className="text-[11px] text-[#E74C3C] hover:underline cursor-pointer" title="Delete">{"\uD83D\uDDD1\uFE0F"}</button>
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Checklists</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Checklists module provides structured, repeatable task lists for daily operations. Checklists ensure accountability, standardize procedures across shifts, and satisfy regulatory compliance requirements for food safety documentation.
        </p>
      </div>

      <DocSection title="Purpose">
        <p>Checklists serve three core purposes in food safety management:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Accountability:</strong> Every item is marked off with a specific staff member&apos;s PIN and timestamp, creating an unambiguous record of who completed each task and when.</li>
          <li><strong>Standardization:</strong> The same procedures are followed every day, across every shift, regardless of which staff member is working. This eliminates inconsistency and missed steps.</li>
          <li><strong>Regulatory compliance:</strong> Auditors require evidence of routine checks. Completed checklists provide date-stamped, user-verified proof that inspections and procedures were carried out.</li>
        </ul>
      </DocSection>

      <DocSection title="Mark-off Types">
        <p>Each item in a checklist uses one of five mark-off types, chosen when the checklist is designed:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Tick (\u2610):</strong> Simple yes/done confirmation. Used for visual inspections or binary checks (e.g. &ldquo;allergen labels displayed&rdquo;).</li>
          <li><strong>Yes / No:</strong> Two-option response. A &ldquo;No&rdquo; answer can optionally trigger an automatic Task creation for follow-up.</li>
          <li><strong>Free Text:</strong> Open text input for notes, readings, or descriptions (e.g. &ldquo;describe any issues observed&rdquo;).</li>
          <li><strong>Photo:</strong> Camera capture for visual evidence. Used for setup verification, cleanliness checks, or damage documentation.</li>
          <li><strong>Temperature:</strong> Numeric temperature input (&deg;C). Can be entered manually or pulled from a connected Bluetooth thermometer. Out-of-range values trigger a warning.</li>
        </ul>
      </DocSection>

      <DocSection title="Issue Flagging & Task Creation">
        <p>Any checklist item can be flagged with an issue during execution. Flagging an item:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>Creates a linked <strong>Task</strong> in the Task Manager module</li>
          <li>The task is pre-populated with the checklist name, item description, and area</li>
          <li>The task is assigned to the area&apos;s default responsible person (configurable)</li>
          <li>A &ldquo;No&rdquo; answer on a Yes/No item can also auto-create a task</li>
          <li>Flagged items are highlighted in red on the completed checklist for manager review</li>
        </ul>
      </DocSection>

      <DocSection title="Scheduling">
        <p>Checklists can be scheduled at various intervals:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Hourly:</strong> For high-frequency checks (e.g. temperature verification every 2 hours)</li>
          <li><strong>Daily:</strong> Most common. Opening checklists, closing checklists, cleaning schedules</li>
          <li><strong>Weekly:</strong> Deep cleaning, equipment maintenance checks</li>
          <li><strong>Monthly:</strong> Pest control inspections, equipment calibration</li>
          <li><strong>Yearly:</strong> Annual compliance reviews, fire safety equipment checks</li>
        </ul>
        <p className="mt-2">Each scheduled checklist has a due time. If not started by the due time, it moves to &ldquo;Overdue&rdquo; status and generates notifications to the assigned area&apos;s staff and manager.</p>
      </DocSection>

      <DocSection title="Manager Sign-off">
        <p>Completed checklists can optionally require manager sign-off:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>When enabled, completed checklists appear in the manager&apos;s &ldquo;Pending Sign-off&rdquo; queue</li>
          <li>The manager reviews each item, especially any flagged issues</li>
          <li>Sign-off is recorded with the manager&apos;s PIN and timestamp</li>
          <li>Unsigned checklists are highlighted on the Homepage dashboard</li>
          <li>Sign-off can be configured as required or optional per checklist template</li>
        </ul>
      </DocSection>

      <DocSection title="Area Filtering">
        <p>Checklists are assigned to one or more areas. The global area selector in the sidebar filters which checklists are visible:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>Staff see only checklists for their assigned area(s)</li>
          <li>Checklists assigned to &ldquo;All Areas&rdquo; appear regardless of filter selection</li>
          <li>Managers can view checklists across all areas</li>
        </ul>
      </DocSection>

      <DocSection title="Library vs Scheduled Views">
        <p>The Checklists module has two conceptual layers:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Library:</strong> The master list of checklist templates. This is where checklists are designed, edited, duplicated, or deleted. Think of these as blueprints.</li>
          <li><strong>Scheduled / Due / In Progress:</strong> These are active instances generated from library templates based on their schedule. Each instance is a unique, completable record tied to a specific date and time.</li>
        </ul>
        <p className="mt-2">Editing a library template updates all future scheduled instances but does not retroactively change already-completed records.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View and complete checklists assigned to their area. Flag issues."],
          ["Team Leader", "All Staff actions plus sign-off on checklists, view completion history for their area."],
          ["Manager", "Full access. Create/edit templates in Library, configure schedules, sign-off, view all areas, export reports."],
          ["Superuser", "Cross-location checklist management, template sharing between locations, compliance reporting."],
        ]} />
      </DocSection>

      <DocNote type="info">
        Completed checklists are stored as immutable records. Once a checklist is completed and signed off, it cannot be edited &mdash; only annotated with follow-up notes. This ensures audit integrity.
      </DocNote>

      <DocNote type="warning">
        Open question: Should overdue checklists be automatically escalated to the Manager after a configurable time window (e.g. 30 minutes past due), or should escalation require manual action?
      </DocNote>
    </>
  );
}

"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type Priority = "urgent" | "normal";
type TaskStatus = "open" | "in-progress" | "completed";

interface Task {
  id: number;
  name: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  categoryColor: string;
  description: string;
  sourceIcon: string;
  source: string;
  assignedTo: string;
  assignedInitials: string;
  assignedColor: string;
  created: string;
  completedBy?: string;
  completedDate?: string;
}

const tasks: Task[] = [
  {
    id: 1,
    name: "Freezer 2 Temperature Alert",
    priority: "urgent",
    status: "open",
    category: "Fridge Issue",
    categoryColor: "#2E75B6",
    description: "Freezer 2 reading -12.1\u00b0C, outside safe range. Requires immediate inspection to determine if compressor is functioning correctly.",
    sourceIcon: "\ud83c\udf21",
    source: "From: Coolroom 1 Alert",
    assignedTo: "Maintenance Team",
    assignedInitials: "MT",
    assignedColor: "#9B59B6",
    created: "16/03, 8:30 AM",
  },
  {
    id: 2,
    name: "Replace hand soap dispensers",
    priority: "normal",
    status: "open",
    category: "Cleaning",
    categoryColor: "#27AE60",
    description: "Multiple hand soap dispensers empty in kitchen and prep areas. Need restocking before lunch service begins.",
    sourceIcon: "\ud83d\udccb",
    source: "From: Opening Checklist Item #3",
    assignedTo: "James Liu",
    assignedInitials: "JL",
    assignedColor: "#2E75B6",
    created: "16/03, 8:20 AM",
  },
  {
    id: 3,
    name: "Pest bait station check",
    priority: "normal",
    status: "open",
    category: "Pest Issue",
    categoryColor: "#E74C3C",
    description: "Monthly pest bait station inspection overdue. All stations in kitchen, storeroom, and waste area need checking and documentation.",
    sourceIcon: "\ud83d\udcdd",
    source: "Manual",
    assignedTo: "Maintenance Team",
    assignedInitials: "MT",
    assignedColor: "#9B59B6",
    created: "15/03, 3:00 PM",
  },
  {
    id: 4,
    name: "Coolroom door seal damaged",
    priority: "urgent",
    status: "open",
    category: "Maintenance",
    categoryColor: "#F39C12",
    description: "Door seal on Coolroom 1 showing wear and not closing properly. Cold air escaping causing temperature fluctuations.",
    sourceIcon: "\ud83d\udcdd",
    source: "Manual",
    assignedTo: "External - CoolFix Repairs",
    assignedInitials: "CF",
    assignedColor: "#95A5A6",
    created: "14/03, 11:00 AM",
  },
  {
    id: 5,
    name: "Deep clean extraction fans",
    priority: "normal",
    status: "in-progress",
    category: "Maintenance",
    categoryColor: "#F39C12",
    description: "Quarterly deep clean of kitchen extraction fans. Currently in progress, estimated completion by end of day.",
    sourceIcon: "\ud83d\udcdd",
    source: "Manual",
    assignedTo: "James Liu",
    assignedInitials: "JL",
    assignedColor: "#2E75B6",
    created: "15/03, 9:00 AM",
  },
  {
    id: 6,
    name: "Fix hot water tap",
    priority: "normal",
    status: "completed",
    category: "Maintenance",
    categoryColor: "#F39C12",
    description: "Hot water tap in main kitchen basin was leaking. Washer replaced and tested.",
    sourceIcon: "\ud83d\udcdd",
    source: "Manual",
    assignedTo: "David Park",
    assignedInitials: "DP",
    assignedColor: "#27AE60",
    created: "14/03, 8:00 AM",
    completedBy: "David P.",
    completedDate: "15/03",
  },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<"open" | "in-progress" | "completed" | "all">("open");
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [noteText, setNoteText] = useState("");

  void selectedArea;

  const tabs: { key: typeof activeTab; label: string; count: number }[] = [
    { key: "open", label: "Open", count: tasks.filter((t) => t.status === "open").length },
    { key: "in-progress", label: "In Progress", count: tasks.filter((t) => t.status === "in-progress").length },
    { key: "completed", label: "Completed", count: tasks.filter((t) => t.status === "completed").length },
    { key: "all", label: "All", count: tasks.length },
  ];

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((t) => t.status === activeTab);

  /* ─── detail view ─── */
  if (viewingTask) {
    const timeline = [
      { action: `Task created by Sarah Chen`, time: viewingTask.created, icon: "\u2795" },
      { action: `Assigned to ${viewingTask.assignedTo}`, time: viewingTask.created, icon: "\ud83d\udc64" },
      { action: `Priority set to ${viewingTask.priority === "urgent" ? "Urgent" : "Normal"}`, time: viewingTask.created, icon: "\ud83d\udea9" },
      ...(viewingTask.status !== "open"
        ? [{ action: "Status changed to In Progress by James Liu", time: "16/03, 9:15 AM", icon: "\u25b6\ufe0f" }]
        : []),
      ...(viewingTask.id === 1
        ? [{ action: "Note added by James: 'Checked the unit, compressor is faulty. Called CoolFix for emergency repair.'", time: "16/03, 9:45 AM", icon: "\ud83d\udcac" }]
        : []),
      ...(viewingTask.status === "completed"
        ? [{ action: `Marked as Complete by ${viewingTask.completedBy}`, time: `${viewingTask.completedDate}, 4:30 PM`, icon: "\u2705" }]
        : []),
    ];

    return (
      <div className="p-4 space-y-4">
        {/* Back button */}
        <button
          onClick={() => setViewingTask(null)}
          className="flex items-center gap-1.5 text-[12px] text-[#2E75B6] hover:text-[#1a5a94] cursor-pointer font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          Back to Tasks
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#333]">{viewingTask.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: viewingTask.status === "open" ? "#2E75B6" : viewingTask.status === "in-progress" ? "#F39C12" : "#27AE60" }}
                >
                  {viewingTask.status === "open" ? "Open" : viewingTask.status === "in-progress" ? "In Progress" : "Completed"}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ background: viewingTask.priority === "urgent" ? "#E74C3C" : "#F39C12" }}
                >
                  {viewingTask.priority === "urgent" ? "\ud83d\udd34 Urgent" : "\ud83d\udfe0 Normal"}
                </span>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: viewingTask.categoryColor + "18", color: viewingTask.categoryColor }}
                >
                  {viewingTask.category}
                </span>
              </div>
            </div>
          </div>

          {/* Two column detail */}
          <div className="grid grid-cols-2 gap-5 mt-4">
            {/* Left: details */}
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-1">Description</div>
                <p className="text-[12px] text-[#555] leading-relaxed">{viewingTask.description}</p>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-1">Photos</div>
                <div className="flex gap-2">
                  <div className="w-16 h-16 rounded-lg bg-[#F5F6FA] border border-dashed border-[#ccc] flex items-center justify-center text-[18px] text-[#ccc]">
                    +
                  </div>
                  {viewingTask.id === 1 && (
                    <div className="w-16 h-16 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-[10px] text-[#2E75B6] font-medium">
                      IMG_01
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-1">Created By</div>
                  <div className="text-[12px] text-[#333] font-medium">Sarah Chen</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-1">Source</div>
                  <div className="text-[12px] text-[#2E75B6] font-medium">{viewingTask.sourceIcon} {viewingTask.source}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-1">Assigned To</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: viewingTask.assignedColor }}
                  >
                    {viewingTask.assignedInitials}
                  </div>
                  <span className="text-[12px] text-[#333] font-medium">{viewingTask.assignedTo}</span>
                </div>
              </div>
            </div>

            {/* Right: timeline */}
            <div>
              <div className="text-[10px] font-semibold text-[#999] uppercase tracking-wider mb-2">Activity Timeline</div>
              <div className="space-y-0">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex gap-2.5 pb-3 relative">
                    {/* connector line */}
                    {i < timeline.length - 1 && (
                      <div className="absolute left-[9px] top-5 w-px h-[calc(100%-12px)] bg-[#E4E7EE]" />
                    )}
                    <div className="w-[18px] h-[18px] rounded-full bg-[#F5F6FA] border border-[#E4E7EE] flex items-center justify-center text-[9px] shrink-0 z-10">
                      {entry.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-[#555] leading-snug">{entry.action}</div>
                      <div className="text-[10px] text-[#999] mt-0.5">{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
          <div className="flex gap-3 mb-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 border border-[#E4E7EE] rounded-lg px-3 py-2 text-[12px] text-[#333] resize-none h-[60px] focus:outline-none focus:border-[#2E75B6]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-md text-[11px] font-medium text-[#2E75B6] border border-[#2E75B6] hover:bg-[#2E75B6]/5 cursor-pointer">
              Add Note
            </button>
            <button className="px-3 py-1.5 rounded-md text-[11px] font-medium text-[#666] border border-[#E4E7EE] hover:bg-[#F5F6FA] cursor-pointer flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
              Add Photo
            </button>
            <div className="flex-1" />
            {viewingTask.status !== "completed" && (
              <button className="px-4 py-1.5 rounded-md text-[11px] font-bold text-white bg-[#27AE60] hover:bg-[#219a52] cursor-pointer">
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─── list view ─── */
  return (
    <div className="p-4 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div />
        <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white bg-[#2E75B6] hover:bg-[#24608f] cursor-pointer flex items-center gap-1.5">
          <span className="text-[14px] leading-none">+</span> New Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "bg-[#2E75B6] text-white"
                : "text-[#666] hover:bg-[#F5F6FA]"
            }`}
          >
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-[#F0F0F0] text-[#999]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select className="appearance-none bg-white border border-[#E4E7EE] rounded-md px-3 py-1.5 pr-7 text-[11px] text-[#666] cursor-pointer focus:outline-none focus:border-[#2E75B6]">
            <option>All Categories</option>
            <option>Fridge Issue</option>
            <option>Cleaning</option>
            <option>Pest Issue</option>
            <option>Maintenance</option>
          </select>
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        <div className="relative">
          <select className="appearance-none bg-white border border-[#E4E7EE] rounded-md px-3 py-1.5 pr-7 text-[11px] text-[#666] cursor-pointer focus:outline-none focus:border-[#2E75B6]">
            <option>All Assigned</option>
            <option>Maintenance Team</option>
            <option>James Liu</option>
            <option>External - CoolFix Repairs</option>
          </select>
          <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>

      {/* Task Cards or Completed Table */}
      {activeTab === "completed" ? (
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E4E7EE]">
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Task Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Completed By</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[#333]">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#F9FAFB]">
                  <td className="px-4 py-3 font-medium text-[#333]">{task.name}</td>
                  <td className="px-4 py-3 text-[#666]">{task.completedBy}</td>
                  <td className="px-4 py-3 text-[#666]">{task.completedDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: task.categoryColor + "18", color: task.categoryColor }}
                    >
                      {task.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4 flex items-start gap-3 hover:border-[#2E75B6]/30 transition-colors"
            >
              {/* Priority dot */}
              <div className="pt-1 shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: task.priority === "urgent" ? "#E74C3C" : "#F39C12" }}
                  title={task.priority === "urgent" ? "Urgent" : "Normal"}
                />
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-[#333] truncate">{task.name}</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: task.categoryColor + "18", color: task.categoryColor }}
                  >
                    {task.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#666] leading-snug line-clamp-2 mb-1.5">{task.description}</p>
                <div className="text-[10px] text-[#999] flex items-center gap-1">
                  <span>{task.sourceIcon}</span>
                  <span>{task.source}</span>
                </div>
              </div>

              {/* Right side */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ background: task.assignedColor }}
                  >
                    {task.assignedInitials}
                  </div>
                  <span className="text-[11px] text-[#555] font-medium max-w-[120px] truncate">{task.assignedTo}</span>
                </div>
                <span className="text-[10px] text-[#999]">{task.created}</span>
                <button
                  onClick={() => setViewingTask(task)}
                  className="px-2.5 py-1 rounded text-[10px] font-semibold text-[#2E75B6] border border-[#2E75B6]/30 hover:bg-[#2E75B6]/5 cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-10">
              <div className="text-[32px] mb-2">{activeTab === "in-progress" ? "\ud83d\udee0" : "\ud83d\udccb"}</div>
              <div className="text-[13px] text-[#999]">No {activeTab} tasks</div>
            </div>
          )}
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Task Manager</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Task Manager provides a centralized system for tracking issues, maintenance jobs, follow-ups, and corrective actions across the business.
        </p>
      </div>

      <DocSection title="Task Sources">
        <p>Tasks can be created in two ways:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Manual:</strong> Staff or managers create a task directly from the Task Manager screen, describing the issue and assigning it.</li>
          <li><strong>Auto-created:</strong> Tasks are generated automatically from other modules:
            <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
              <li><em>Temperature alerts</em> &mdash; out-of-range sensor readings create a &ldquo;Fridge Issue&rdquo; task</li>
              <li><em>Checklist failures</em> &mdash; a failed or flagged checklist item can spawn a task</li>
              <li><em>Audit findings</em> &mdash; non-conformances from audits create corrective-action tasks</li>
              <li><em>Complaint investigations</em> &mdash; follow-up actions from customer complaints</li>
            </ul>
          </li>
        </ul>
        <p className="mt-2">Each auto-created task links back to its source, so you can trace the full context.</p>
      </DocSection>

      <DocSection title="Category-Based Auto-Assignment">
        <p>Tasks are assigned a category (e.g. Fridge Issue, Cleaning, Pest Issue, Maintenance). Each category can be configured with a default assignee:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Fridge Issue</strong> &rarr; auto-assigns to Maintenance Team</li>
          <li><strong>Cleaning</strong> &rarr; auto-assigns to the relevant area team lead</li>
          <li><strong>Pest Issue</strong> &rarr; auto-assigns to Maintenance Team or external pest control</li>
          <li><strong>Maintenance</strong> &rarr; auto-assigns to Maintenance Team</li>
        </ul>
        <p className="mt-2">Auto-assignment can be overridden by the task creator or a manager at any time.</p>
      </DocSection>

      <DocSection title="Groups & Teams">
        <p>Tasks can be assigned to individual staff members or to groups. Groups represent functional teams:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Maintenance Team</strong> &mdash; handles equipment issues, repairs, facility upkeep</li>
          <li><strong>Managers</strong> &mdash; escalation point for critical or unresolved tasks</li>
          <li><strong>Head Chef</strong> &mdash; food safety-specific tasks related to kitchen operations</li>
        </ul>
        <p className="mt-2">When a task is assigned to a group, all members of that group receive the notification and any member can pick it up.</p>
      </DocSection>

      <DocSection title="Task Lifecycle">
        <p>Every task follows a simple three-stage lifecycle:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Open:</strong> Newly created. Waiting for someone to begin work.</li>
          <li><strong>In Progress:</strong> A staff member has started working on the task.</li>
          <li><strong>Completed:</strong> Work is done. The task is closed with a completion note and optional photo evidence.</li>
        </ul>
        <p className="mt-2">Status changes are logged in the activity timeline for full accountability.</p>
      </DocSection>

      <DocSection title="External Supplier Tasks">
        <p>Some tasks require external contractors or repair companies. Hospitality Safe supports this with:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Assigning tasks to external companies from the Suppliers module</li>
          <li>Auto-emailing the supplier with task details when assigned</li>
          <li>Tracking supplier response and completion within the platform</li>
          <li>Linking supplier invoices or service reports to the task</li>
        </ul>
      </DocSection>

      <DocSection title="Notes, Photos & Timeline">
        <p>Each task maintains a full activity timeline recording:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Task creation, assignment, and status changes</li>
          <li>Notes added by staff with timestamps and user attribution</li>
          <li>Photos uploaded as evidence (before/after, damage, repairs)</li>
          <li>Escalation events and manager sign-offs</li>
        </ul>
        <p className="mt-2">This provides a complete audit trail for compliance and accountability purposes.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Create tasks, add notes/photos, update status on assigned tasks"],
          ["Team Leader", "All staff actions + reassign tasks within their area"],
          ["Manager", "Full access: create, assign, reassign, close any task. View reports."],
          ["Superuser", "Cross-location task oversight. Configure categories and auto-assignment rules."],
        ]} />
      </DocSection>

      <DocNote type="warning">
        Open question: Should tasks auto-escalate to managers after a configurable number of days without progress? This could help ensure urgent issues are not forgotten, but may generate noise if thresholds are too aggressive.
      </DocNote>

      <DocNote type="info">
        Tasks created from temperature alerts or checklist failures include a direct link back to the originating record, allowing managers to review the full context without switching modules.
      </DocNote>
    </>
  );
}

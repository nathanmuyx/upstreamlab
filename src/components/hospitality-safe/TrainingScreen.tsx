"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type FilterTab = "all" | "onboarding" | "food-safety" | "custom";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "onboarding", label: "Onboarding" },
  { id: "food-safety", label: "Food Safety" },
  { id: "custom", label: "Custom" },
];

type BadgeType = "Video" | "Document" | "Quiz" | "Document + Quiz" | "Video + Quiz" | "Document + Video + Quiz";

const badgeColors: Record<string, { bg: string; text: string }> = {
  Video: { bg: "#EBF5FF", text: "#2E75B6" },
  Document: { bg: "#FFF8E1", text: "#F39C12" },
  Quiz: { bg: "#F3E8FF", text: "#8B5CF6" },
};

function renderBadges(type: BadgeType) {
  const parts = type.split(" + ");
  return (
    <div className="flex gap-1 flex-wrap">
      {parts.map((part) => {
        const c = badgeColors[part] || badgeColors.Document;
        return (
          <span
            key={part}
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: c.bg, color: c.text }}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
}

const modules: {
  name: string;
  type: BadgeType;
  duration: string;
  completed: number;
  total: number;
  custom?: boolean;
  filterKey: FilterTab;
}[] = [
  { name: "Hand Hygiene Basics", type: "Video", duration: "15 min", completed: 18, total: 24, filterKey: "food-safety" },
  { name: "Food Allergen Awareness", type: "Document + Quiz", duration: "30 min", completed: 12, total: 24, filterKey: "food-safety" },
  { name: "Temperature Recording", type: "Video", duration: "10 min", completed: 22, total: 24, filterKey: "food-safety" },
  { name: "Safe Food Handling", type: "Video + Quiz", duration: "45 min", completed: 8, total: 24, filterKey: "food-safety" },
  { name: "Chemical Safety (COSHH)", type: "Document", duration: "20 min", completed: 15, total: 24, filterKey: "food-safety" },
  { name: "New Starter Onboarding", type: "Document + Video + Quiz", duration: "2 hours", completed: 0, total: 0, custom: true, filterKey: "onboarding" },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = modules.filter((m) => {
    if (activeTab !== "all" && m.filterKey !== activeTab) return false;
    return true;
  });

  return (
    <div className="p-5">
      {selectedArea !== "All Areas" && (
        <div className="mb-3 text-[11px] text-[#2E75B6] font-medium">
          Filtered: {selectedArea}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-semibold text-[#333]">Training Library</h2>
        <button className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Add Module
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#E4E7EE] mb-5">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[12px] cursor-pointer transition-colors relative ${
              activeTab === tab.id
                ? "text-[#2E75B6] font-bold"
                : "text-[#666] hover:text-[#333]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2E75B6] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((m) => {
          const pct = m.custom ? null : Math.round((m.completed / m.total) * 100);
          const progressColor =
            pct === null ? "#95A5A6" : pct >= 80 ? "#27AE60" : pct >= 50 ? "#F39C12" : "#E74C3C";

          return (
            <div key={m.name} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4 hover:shadow-md transition-shadow cursor-pointer">
              {/* Type badges */}
              <div className="mb-2">
                {renderBadges(m.type)}
              </div>

              {/* Module name */}
              <h4 className="text-[13px] font-semibold text-[#333] mb-1 leading-tight">{m.name}</h4>

              {/* Duration */}
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <span className="text-[11px] text-[#666]">{m.duration}</span>
              </div>

              {/* Completion */}
              {m.custom ? (
                <div className="text-[11px] text-[#95A5A6] font-medium">Custom per staff</div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#666]">{m.completed}/{m.total} staff</span>
                    <span className="text-[11px] font-semibold" style={{ color: progressColor }}>{pct}%</span>
                  </div>
                  <div className="h-[4px] rounded-full bg-[#E4E7EE] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: progressColor }}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[12px] text-[#999]">
          No training modules found for this filter.
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Training</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Training module provides a library of food safety and compliance training materials. Staff complete training modules, take quizzes, and their progress is tracked against their profile.
        </p>
      </div>

      <DocSection title="Platform-Provided Training">
        <p>Hospitality Safe includes a library of pre-built training modules covering essential food safety topics:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Hand hygiene and personal protective equipment</li>
          <li>Food allergen awareness and management</li>
          <li>Temperature recording procedures</li>
          <li>Safe food handling and storage</li>
          <li>Chemical safety (COSHH) for cleaning products</li>
          <li>Pest awareness and prevention</li>
        </ul>
        <p className="mt-2">Platform modules are maintained and updated by the Hospitality Safe team. New modules are added as regulations change.</p>
      </DocSection>

      <DocSection title="Custom Training Material">
        <p>Businesses can upload their own training content:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Videos:</strong> Upload MP4, MOV, or link to YouTube/Vimeo</li>
          <li><strong>Documents:</strong> Upload PDF, Word, or PowerPoint files</li>
          <li><strong>Quizzes:</strong> Build custom quizzes with multiple-choice and true/false questions</li>
          <li>Custom modules can be assigned to specific areas or roles</li>
        </ul>
      </DocSection>

      <DocSection title="Knowledge Testing">
        <p>Modules with a Quiz component require staff to pass before the module is marked as complete:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Configurable pass mark (default: 80%)</li>
          <li>Staff can retake quizzes if they fail</li>
          <li>Quiz results are logged with timestamp and score</li>
          <li>Managers can view quiz performance analytics</li>
        </ul>
      </DocSection>

      <DocSection title="Completion Tracking">
        <p>Training completion is tracked against each staff member&apos;s profile:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Progress is visible on both the Training screen and the staff member&apos;s profile in Settings</li>
          <li>Managers can see which modules each staff member has completed</li>
          <li>Overdue training modules are flagged on the homepage dashboard</li>
          <li>Training completion is included in audit reports</li>
        </ul>
      </DocSection>

      <DocSection title="Onboarding Workflow">
        <p>The &ldquo;New Starter Onboarding&rdquo; module is a special composite module that can include:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>A sequence of required training modules</li>
          <li>Document acknowledgements (e.g. read and sign the food safety policy)</li>
          <li>Mentor sign-off steps (a manager or team leader confirms practical skills)</li>
          <li>Automatic task creation for managers to schedule orientation sessions</li>
        </ul>
        <p className="mt-2">New staff members are automatically assigned the onboarding module when their account is created.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View assigned modules, complete training, take quizzes"],
          ["Team Leader", "View team training progress, assign modules to staff in their area"],
          ["Manager", "Full training management: upload custom content, create quizzes, view analytics, assign modules"],
          ["Superuser", "All above, plus manage training library across all locations"],
        ]} />
      </DocSection>

      <DocNote type="info">
        Training completion data is included in the Audits module. Auditors can verify that all staff have completed required food safety training as part of compliance checks.
      </DocNote>
    </>
  );
}

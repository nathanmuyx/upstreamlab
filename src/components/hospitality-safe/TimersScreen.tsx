"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/lib/hospitality-safe-docs";

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<"Active" | "Paused" | "All">("Active");
  const [showModal, setShowModal] = useState(false);

  const activeTimers = [
    {
      name: "Sliced Ham",
      area: "Grill",
      countdown: "0:00:00",
      label: "EXPIRED \u2013 Action Required",
      color: "#E74C3C",
      expired: true,
      progress: 1,
      started: "6:15 AM",
      by: "Emily T.",
    },
    {
      name: "Cooked Chicken Breast",
      area: "Kitchen",
      countdown: "0:22:45",
      label: "",
      color: "#E74C3C",
      expired: false,
      progress: 0.9,
      started: "7:45 AM",
      by: "James L.",
    },
    {
      name: "Sushi Display Rice",
      area: "Bar",
      countdown: "1:34:10",
      label: "",
      color: "#F39C12",
      expired: false,
      progress: 0.6,
      started: "8:30 AM",
      by: "Sarah C.",
    },
    {
      name: "Prepared Sandwiches",
      area: "Front of House",
      countdown: "3:15:22",
      label: "",
      color: "#27AE60",
      expired: false,
      progress: 0.19,
      started: "9:00 AM",
      by: "David P.",
    },
  ];

  const pausedTimers = [
    {
      name: "Marinated Prawns",
      area: "Kitchen",
      remaining: "1:45:22",
      by: "Sarah C.",
    },
    {
      name: "Diced Onions",
      area: "Grill",
      remaining: "2:30:00",
      by: "James L.",
    },
  ];

  const filterByArea = <T extends { area: string }>(items: T[]) =>
    selectedArea === "All Areas" ? items : items.filter((t) => t.area === selectedArea);

  const filteredActive = filterByArea(activeTimers);
  const filteredPaused = filterByArea(pausedTimers);

  const tabs: ("Active" | "Paused" | "All")[] = ["Active", "Paused", "All"];

  return (
    <div className="p-4 space-y-4 relative">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#F0F1F5] rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-[#333] shadow-sm"
                  : "text-[#666] hover:text-[#333]"
              }`}
            >
              {tab}
              {tab === "Active" && (
                <span className="ml-1.5 text-[10px] bg-[#2E75B6]/10 text-[#2E75B6] px-1.5 py-0.5 rounded-full font-bold">
                  {filteredActive.length}
                </span>
              )}
              {tab === "Paused" && (
                <span className="ml-1.5 text-[10px] bg-[#95A5A6]/15 text-[#95A5A6] px-1.5 py-0.5 rounded-full font-bold">
                  {filteredPaused.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[12px] font-medium cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#2E75B6" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Start New Timer
        </button>
      </div>

      {/* Active Timers */}
      {(activeTab === "Active" || activeTab === "All") && (
        <div className="space-y-3">
          {activeTab === "All" && filteredActive.length > 0 && (
            <div className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Active</div>
          )}
          {filteredActive.map((timer, i) => (
            <div
              key={i}
              className={`bg-white rounded-lg shadow-sm border border-[#E4E7EE] flex overflow-hidden ${
                timer.expired ? "animate-pulse" : ""
              }`}
              style={{ minHeight: 100 }}
            >
              {/* Color strip */}
              <div className="w-[5px] shrink-0" style={{ background: timer.color }} />

              {/* Left: Name & Area */}
              <div className="flex flex-col justify-center px-4 py-3 w-[140px] shrink-0">
                <div className="text-[13px] font-semibold text-[#333]">{timer.name}</div>
                <span className="text-[10px] mt-1 bg-[#F5F6FA] text-[#666] px-2 py-0.5 rounded self-start">
                  {timer.area}
                </span>
              </div>

              {/* Center: Countdown & Progress */}
              <div className="flex-1 flex flex-col justify-center items-center py-3 px-2">
                <div
                  className="text-[22px] font-mono font-bold"
                  style={{ color: timer.color }}
                >
                  {timer.countdown}
                </div>
                {timer.expired && (
                  <span className="text-[10px] font-bold mt-0.5" style={{ color: "#E74C3C" }}>
                    {timer.label}
                  </span>
                )}
                {/* Progress bar */}
                <div className="w-full max-w-[180px] h-[4px] rounded-full bg-[#E4E7EE] mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${timer.progress * 100}%`,
                      background: timer.color,
                    }}
                  />
                </div>
              </div>

              {/* Right: Buttons */}
              <div className="flex flex-col justify-center gap-1.5 px-3 py-3 shrink-0">
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#2E75B6] text-[#2E75B6] cursor-pointer hover:bg-[#2E75B6]/5 transition-colors">
                  Replenish
                </button>
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#95A5A6] text-[#95A5A6] cursor-pointer hover:bg-[#95A5A6]/5 transition-colors">
                  Pause
                </button>
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#E74C3C] text-[#E74C3C] cursor-pointer hover:bg-[#E74C3C]/5 transition-colors">
                  Stop
                </button>
              </div>

              {/* Far Right: Meta */}
              <div className="flex flex-col justify-center items-end px-4 py-3 shrink-0 border-l border-[#F0F0F0] w-[100px]">
                <span className="text-[10px] text-[#999]">Started:</span>
                <span className="text-[11px] text-[#666] font-medium">{timer.started}</span>
                <span className="text-[10px] text-[#999] mt-1.5">By:</span>
                <span className="text-[11px] text-[#666] font-medium">{timer.by}</span>
              </div>
            </div>
          ))}
          {filteredActive.length === 0 && activeTab === "Active" && (
            <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-8 text-center text-[12px] text-[#999]">
              No active timers for the selected area.
            </div>
          )}
        </div>
      )}

      {/* Paused Timers */}
      {(activeTab === "Paused" || activeTab === "All") && (
        <div className="space-y-3">
          {activeTab === "All" && filteredPaused.length > 0 && (
            <div className="text-[11px] font-semibold text-[#999] uppercase tracking-wider mt-2">Paused</div>
          )}
          {filteredPaused.map((timer, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] flex overflow-hidden opacity-70"
              style={{ minHeight: 90 }}
            >
              {/* Grey strip */}
              <div className="w-[5px] shrink-0 bg-[#95A5A6]" />

              {/* Left: Name & Area */}
              <div className="flex flex-col justify-center px-4 py-3 w-[140px] shrink-0">
                <div className="text-[13px] font-semibold text-[#666]">{timer.name}</div>
                <span className="text-[10px] mt-1 bg-[#F5F6FA] text-[#999] px-2 py-0.5 rounded self-start">
                  {timer.area}
                </span>
              </div>

              {/* Center: Paused state */}
              <div className="flex-1 flex flex-col justify-center items-center py-3 px-2">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#95A5A6" stroke="none">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span className="text-[11px] text-[#999] font-medium">PAUSED</span>
                </div>
                <div className="text-[16px] font-mono font-bold text-[#95A5A6] mt-1">
                  {timer.remaining}
                </div>
                <span className="text-[10px] text-[#999]">remaining</span>
              </div>

              {/* Right: Buttons */}
              <div className="flex flex-col justify-center gap-1.5 px-3 py-3 shrink-0">
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#2E75B6] text-[#2E75B6] cursor-pointer hover:bg-[#2E75B6]/5 transition-colors">
                  Resume
                </button>
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#95A5A6] text-[#95A5A6] cursor-pointer hover:bg-[#95A5A6]/5 transition-colors">
                  Print Label
                </button>
                <button className="text-[10px] font-medium px-2.5 py-1 rounded border border-[#E74C3C] text-[#E74C3C] cursor-pointer hover:bg-[#E74C3C]/5 transition-colors">
                  Waste
                </button>
              </div>

              {/* Far Right: Meta */}
              <div className="flex flex-col justify-center items-end px-4 py-3 shrink-0 border-l border-[#F0F0F0] w-[100px]">
                <span className="text-[10px] text-[#999]">By:</span>
                <span className="text-[11px] text-[#666] font-medium">{timer.by}</span>
              </div>
            </div>
          ))}
          {filteredPaused.length === 0 && activeTab === "Paused" && (
            <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-8 text-center text-[12px] text-[#999]">
              No paused timers for the selected area.
            </div>
          )}
        </div>
      )}

      {/* Start New Timer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-[380px] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E7EE]">
              <h3 className="text-[15px] font-semibold text-[#333]">Start New Timer</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#999] hover:text-[#333] cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 space-y-4">
              {/* Select Food */}
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1">Select Food</label>
                <select className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[12px] text-[#666] bg-white cursor-pointer">
                  <option>Choose a food item...</option>
                  <option>Sliced Ham</option>
                  <option>Cooked Chicken Breast</option>
                  <option>Sushi Display Rice</option>
                  <option>Prepared Sandwiches</option>
                  <option>Marinated Prawns</option>
                  <option>Diced Onions</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1">Area</label>
                <select className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[12px] text-[#666] bg-white cursor-pointer">
                  <option>Select area...</option>
                  <option>Kitchen</option>
                  <option>Grill</option>
                  <option>Bar</option>
                  <option>Front of House</option>
                  <option>Pastry</option>
                </select>
              </div>

              {/* Timer Duration */}
              <div>
                <label className="block text-[12px] font-medium text-[#333] mb-1">Timer Duration</label>
                <input
                  type="text"
                  defaultValue="4:00:00"
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-[12px] text-[#333] font-mono"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#E4E7EE] bg-[#F9FAFB]">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-[12px] font-medium text-[#666] bg-white border border-[#D1D5DB] rounded-lg cursor-pointer hover:bg-[#F5F6FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-[12px] font-medium text-white rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: "#2E75B6" }}
              >
                Start Timer
              </button>
            </div>
          </div>
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Timers</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Timers module tracks the time food has been out of temperature control, based on the 2-hour / 4-hour food safety rule.
        </p>
      </div>

      <DocSection title="The 2-Hour / 4-Hour Rule">
        <p>Under Australian food safety standards (FSANZ Food Standards Code 3.2.2), potentially hazardous food left in the temperature danger zone (5\u00b0C\u201360\u00b0C) must be managed as follows:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Under 2 hours total</strong> &ndash; Refrigerate for later use or serve immediately</li>
          <li><strong>Between 2 and 4 hours total</strong> &ndash; Use immediately (cannot be refrigerated again)</li>
          <li><strong>Over 4 hours total</strong> &ndash; Must be discarded (waste)</li>
        </ul>
        <p className="mt-2">Timers in the app count <em>up</em> from zero, tracking cumulative time in the danger zone. The countdown display shown on screen reflects remaining time until the 4-hour limit.</p>
      </DocSection>

      <DocSection title="Timer Actions">
        <p>Each active timer has three available actions:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Replenish</strong> &ndash; The food has been replaced with a fresh batch. Resets the timer to the full duration. The old batch should have been discarded.</li>
          <li><strong>Pause</strong> &ndash; Food has been returned to refrigeration. The timer freezes, preserving elapsed time. When resumed, the timer continues from where it left off.</li>
          <li><strong>Stop</strong> &ndash; Ends the timer. Prompts for a reason: disposed as waste, consumed/sold, or moved to a different process. Connects to the waste recording module.</li>
        </ul>
      </DocSection>

      <DocSection title="Paused Timers">
        <p>Pausing a timer indicates the food has been refrigerated. While paused:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>The elapsed time is preserved &ndash; the clock does not reset</li>
          <li>Available actions change to: <strong>Resume</strong>, <strong>Print Label</strong>, <strong>Waste</strong></li>
          <li>Resuming restarts the countdown from where it was paused</li>
          <li>A refrigeration label can be printed for the stored food</li>
        </ul>
      </DocSection>

      <DocSection title="Waste Tracking">
        <p>When a timer is stopped, staff are prompted to record the waste event. This data flows into the waste tracking system, capturing:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Food item and quantity</li>
          <li>Reason for disposal (expired timer, quality issue, etc.)</li>
          <li>Cost estimate (linked to Menutory product data)</li>
          <li>Staff member who recorded the waste</li>
        </ul>
      </DocSection>

      <DocSection title="Color Coding">
        <p>Timer cards use color to indicate urgency at a glance:</p>
        <div className="border border-[#E4E7EE] rounded-lg overflow-hidden mt-2">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#1B2A4A] text-white">
                <th className="text-left px-3 py-2 font-medium">Color</th>
                <th className="text-left px-3 py-2 font-medium">Condition</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Green", "More than 2 hours remaining"],
                ["Yellow", "Less than 2 hours remaining"],
                ["Orange", "Less than 1 hour remaining"],
                ["Red", "Less than 30 minutes remaining"],
                ["Flashing Red", "Expired \u2013 action required immediately"],
              ].map(([color, condition], i) => (
                <tr key={color} className={i % 2 === 1 ? "bg-[#F9FAFB]" : ""}>
                  <td className="px-3 py-2 font-medium text-[#333] whitespace-nowrap">{color}</td>
                  <td className="px-3 py-2 text-[#666]">{condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Start, pause, resume, replenish, and stop timers. Record waste."],
          ["Team Leader", "All Staff actions plus override timer durations and view timer history."],
          ["Manager", "All actions plus configure timer presets, view waste reports, and export data."],
          ["Superuser", "Cross-location timer overview and analytics."],
        ]} />
      </DocSection>

      <DocNote type="warning">
        Open question: Should paused timers auto-clear after 24 hours? If food has been refrigerated for over 24 hours, the timer may no longer be relevant. Options: auto-archive, send a reminder notification, or require manual resolution.
      </DocNote>

      <DocSection title="Menutory Integration">
        <p>Timer presets (food items, default durations) can be synced from Menutory prep levels. When a menu item has a defined prep level in Menutory, the timer duration is automatically set based on that configuration. This reduces manual setup and ensures consistency across locations.</p>
      </DocSection>

      <DocNote type="info">
        Timers are area-aware. The area selector in the sidebar filters which timers are displayed. Each timer is assigned to an area when started.
      </DocNote>
    </>
  );
}

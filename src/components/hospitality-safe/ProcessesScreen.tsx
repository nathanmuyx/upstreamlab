"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<"All" | "Cooking/Reheating" | "Cooling" | "Sushi" | "Sous Vide">("All");

  const tabs = ["All", "Cooking/Reheating", "Cooling", "Sushi", "Sous Vide"] as const;

  const records = [
    { date: "16/03", type: "Cooking", food: "Chicken Breast", pass: true, temp: "78\u00b0C", user: "Sarah C.", time: "45 min", area: "Kitchen" },
    { date: "16/03", type: "Reheating", food: "Beef Stew", pass: true, temp: "82\u00b0C", user: "James L.", time: "20 min", area: "Kitchen" },
    { date: "15/03", type: "Cooling", food: "Bolognese Sauce", pass: true, temp: null, user: "Emily T.", time: "5h 30m", area: "Kitchen" },
    { date: "15/03", type: "Cooking", food: "Fish Fillets", pass: false, temp: "68\u00b0C", user: "David P.", time: "35 min", area: "Grill" },
    { date: "14/03", type: "Sushi", food: "Sushi Rice Batch A", pass: true, temp: null, user: "Sarah C.", time: "2h", area: "Bar" },
  ];

  const scheduledProcesses = [
    { name: "Weekly Cooling Test", freq: "Weekly", due: "20/03", area: "Kitchen" },
    { name: "Monthly Sushi Audit", freq: "Monthly", due: "01/04", area: "Bar" },
  ];

  const filteredRecords = records.filter((r) => {
    if (selectedArea !== "All Areas" && r.area !== selectedArea) return false;
    if (activeTab === "All") return true;
    if (activeTab === "Cooking/Reheating") return r.type === "Cooking" || r.type === "Reheating";
    return r.type === activeTab;
  });

  const filteredScheduled =
    selectedArea === "All Areas"
      ? scheduledProcesses
      : scheduledProcesses.filter((s) => s.area === selectedArea);

  const typeBadgeColor: Record<string, { bg: string; text: string }> = {
    Cooking: { bg: "#EBF5FF", text: "#2E75B6" },
    Reheating: { bg: "#FFF3E0", text: "#E65100" },
    Cooling: { bg: "#E8F5E9", text: "#2E7D32" },
    Sushi: { bg: "#FCE4EC", text: "#C62828" },
    "Sous Vide": { bg: "#F3E5F5", text: "#7B1FA2" },
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-colors ${
                activeTab === tab
                  ? "bg-[#2E75B6] text-white"
                  : "bg-white text-[#666] border border-[#E4E7EE] hover:bg-[#F5F6FA]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#2E75B6" }}
        >
          <span className="text-[14px]">+</span> New Record
        </button>
      </div>

      {/* Process Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: "#1B2A4A" }}>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Date</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Process Type</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Food</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Result</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">User</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Time Taken</th>
              <th className="text-left px-3 py-2.5 text-white font-medium text-[11px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r, i) => (
              <tr
                key={i}
                className={r.pass ? "bg-[#F0FFF4]" : "bg-[#FFF5F5]"}
                style={{ borderBottom: "1px solid #E4E7EE" }}
              >
                <td className="px-3 py-2.5 text-[#333] font-medium">{r.date}</td>
                <td className="px-3 py-2.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: typeBadgeColor[r.type]?.bg, color: typeBadgeColor[r.type]?.text }}
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[#333]">{r.food}</td>
                <td className="px-3 py-2.5">
                  {r.pass ? (
                    <span className="text-[#27AE60] font-semibold">{r.temp ? `\u2705 ${r.temp}` : "\u2705"}</span>
                  ) : (
                    <span className="text-[#E74C3C] font-semibold">{r.temp ? `\u274c ${r.temp}` : "\u274c"}</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-[#666]">{r.user}</td>
                <td className="px-3 py-2.5 text-[#666]">{r.time}</td>
                <td className="px-3 py-2.5">
                  <button className="text-[11px] text-[#2E75B6] font-medium hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[12px] text-[#999]">
                  No process records found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Scheduled Processes */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <div className="px-4 py-2.5 border-b border-[#E4E7EE]">
          <h3 className="text-[13px] font-semibold text-[#333]">Scheduled Processes</h3>
        </div>
        <div className="divide-y divide-[#F0F0F0]">
          {filteredScheduled.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-2.5">
              <span className="text-[14px]">{"\uD83D\uDCC5"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-[#333]">{s.name}</div>
                <div className="text-[10px] text-[#999]">{s.freq}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[#666]">Due: {s.due}</div>
                <div className="text-[10px] text-[#999]">{s.area}</div>
              </div>
            </div>
          ))}
          {filteredScheduled.length === 0 && (
            <div className="px-4 py-4 text-center text-[12px] text-[#999]">
              No scheduled processes for the selected area.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Docs ─── */
export function Docs() {
  return (
    <>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#2E75B6]">Documentation</span>
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Processes</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Processes module records and tracks food safety processes such as cooking, reheating, cooling, and sushi preparation. Each process type has specific regulatory requirements and time/temperature targets.
        </p>
      </div>

      <DocSection title="Cooking & Reheating">
        <p>Cooking and reheating processes must reach a <strong>minimum core temperature of 75&deg;C</strong> to ensure food safety. This is the standard required under Australian food safety regulations (FSANZ).</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>A Bluetooth or manual thermometer reading is recorded at the end of cooking</li>
          <li>If the core temperature is <strong>below 75&deg;C</strong>, the record is flagged as a failure</li>
          <li>A corrective action must be logged: continue cooking, discard, or re-heat</li>
          <li>The system links to the Temperatures module for the thermometer reading</li>
        </ul>
        <p className="mt-2">Reheating follows the same rules &mdash; reheated food must reach &ge;75&deg;C throughout before serving.</p>
      </DocSection>

      <DocSection title="Cooling Process">
        <p>The cooling process has strict two-phase time/temperature requirements:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Phase 1:</strong> Cool from 60&deg;C to 21&deg;C within <strong>2 hours</strong></li>
          <li><strong>Phase 2:</strong> Cool from 21&deg;C to 5&deg;C within <strong>4 hours</strong></li>
          <li><strong>Total maximum:</strong> 6 hours from 60&deg;C to 5&deg;C</li>
        </ul>
        <p className="mt-2">When a cooling process is started, the system creates a linked timer that tracks both phases. Temperature readings are prompted at key intervals (start, 2h mark, end). If either phase exceeds its time limit, the process is flagged as failed and corrective action is required.</p>
      </DocSection>

      <DocNote type="warning">
        If food has not reached 21&deg;C within 2 hours, it must be discarded or rapidly cooled using an approved method (e.g. ice bath, blast chiller). The corrective action must be recorded.
      </DocNote>

      <DocSection title="Sushi Process">
        <p>The sushi process tracks the full lifecycle of sushi rice and assembled sushi products:</p>
        <ol className="list-decimal pl-4 space-y-1 mt-2">
          <li><strong>Rice Acidification:</strong> Rice is acidified with vinegar to achieve a target pH. The pH reading and vinegar amount are recorded.</li>
          <li><strong>Assembly:</strong> Sushi is assembled. Start time is logged.</li>
          <li><strong>Completed:</strong> Assembly is finished, products are placed in display cases.</li>
          <li><strong>Display Monitoring:</strong> Products are monitored for maximum display time (typically 4 hours at ambient temperature).</li>
        </ol>
        <p className="mt-2">A linked timer is automatically created to track display duration. Products must be discarded once the display window expires.</p>
      </DocSection>

      <DocSection title="Sous Vide (Planned)">
        <p>Sous vide cooking support is a planned future feature. It will include:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>Water bath temperature monitoring via connected sensors</li>
          <li>Time-at-temperature logging for pasteurization validation</li>
          <li>Core temperature verification post-cook</li>
          <li>Integration with cooling process for post-cook chilling</li>
        </ul>
      </DocSection>

      <DocNote type="info">
        The Sous Vide tab is visible in the interface but will display a &ldquo;Coming Soon&rdquo; placeholder until the feature is built. This allows early feedback on placement and user expectations.
      </DocNote>

      <DocSection title="Timers & Thermometer Integration">
        <p>Processes are deeply linked to the Timers and Temperatures modules:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li>Starting a cooling process automatically creates a 2-phase timer</li>
          <li>Cooking/reheating records require a linked temperature reading</li>
          <li>Sushi display monitoring creates a countdown timer</li>
          <li>Bluetooth thermometer readings can be pulled directly into a process record</li>
          <li>Auto-sensor readings (e.g. coolroom) can be referenced as the final temperature for cooling processes</li>
        </ul>
      </DocSection>

      <DocSection title="Scheduling">
        <p>Processes can be scheduled to recur automatically:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>One-off:</strong> Single scheduled process for a specific date/time</li>
          <li><strong>Weekly:</strong> Repeats on selected days each week (e.g. cooling test every Monday)</li>
          <li><strong>Monthly:</strong> Repeats on a specific date each month</li>
          <li><strong>Quarterly:</strong> Repeats every 3 months for audit-related processes</li>
        </ul>
        <p className="mt-2">Scheduled processes appear on the Homepage as upcoming tasks and generate notifications when due.</p>
      </DocSection>

      <DocSection title="Corrective Actions">
        <p>When a process fails (temperature not met, time exceeded), the system requires a corrective action:</p>
        <ul className="list-disc pl-4 space-y-1 mt-2">
          <li><strong>Cooking/Reheating failure:</strong> Continue cooking, re-cook, or discard. Must re-check temperature after corrective action.</li>
          <li><strong>Cooling failure:</strong> Rapid cool (ice bath/blast chiller), reheat to 75&deg;C and re-cool, or discard.</li>
          <li><strong>Sushi display expired:</strong> Discard product. No recovery option.</li>
        </ul>
        <p className="mt-2">All corrective actions are logged with the staff member&apos;s PIN and timestamp for full traceability.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Start processes, record temperatures, log corrective actions"],
          ["Team Leader", "All Staff actions plus review and sign-off on failed processes"],
          ["Manager", "Full access. Configure process types, set schedules, view reports, override results"],
          ["Superuser", "Cross-location process data, bulk scheduling, template management"],
        ]} />
      </DocSection>

      <DocNote type="danger">
        Failed cooking processes (below 75&deg;C) are a critical food safety issue. The system enforces corrective action recording and notifies the Manager immediately. The food item cannot be marked as &ldquo;served&rdquo; without resolution.
      </DocNote>
    </>
  );
}

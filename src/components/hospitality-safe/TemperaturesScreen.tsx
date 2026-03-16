"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type ViewId = "dashboard" | "calendar" | "records";

const views: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "calendar", label: "Calendar" },
  { id: "records", label: "Records" },
];

/* ─── unit data ─── */
interface TempUnit {
  name: string;
  icon: string;
  temp: string;
  tempNum: number;
  safeRange: string;
  safeMin: number;
  safeMax: number;
  method: "auto" | "bluetooth" | "manual";
  lastReading: string;
}

const units: TempUnit[] = [
  { name: "Coolroom 1", icon: "\u2744\uFE0F", temp: "3.2\u00B0C", tempNum: 3.2, safeRange: "0\u20135\u00B0C", safeMin: 0, safeMax: 5, method: "auto", lastReading: "10 min ago" },
  { name: "Coolroom 2", icon: "\u2744\uFE0F", temp: "4.8\u00B0C", tempNum: 4.8, safeRange: "0\u20135\u00B0C", safeMin: 0, safeMax: 5, method: "auto", lastReading: "10 min ago" },
  { name: "Freezer 1", icon: "\u2744\uFE0F", temp: "-18.5\u00B0C", tempNum: -18.5, safeRange: "-15 to -25\u00B0C", safeMin: -25, safeMax: -15, method: "auto", lastReading: "10 min ago" },
  { name: "Freezer 2", icon: "\u2744\uFE0F", temp: "-12.1\u00B0C", tempNum: -12.1, safeRange: "-15 to -25\u00B0C", safeMin: -25, safeMax: -15, method: "auto", lastReading: "5 min ago" },
  { name: "Fridge 1", icon: "\uD83C\uDF21", temp: "2.1\u00B0C", tempNum: 2.1, safeRange: "0\u20135\u00B0C", safeMin: 0, safeMax: 5, method: "bluetooth", lastReading: "30 min ago" },
  { name: "Hot Display", icon: "\uD83D\uDD25", temp: "66.2\u00B0C", tempNum: 66.2, safeRange: "60\u2013100\u00B0C", safeMin: 60, safeMax: 100, method: "manual", lastReading: "1 hour ago" },
];

const methodIcons: Record<string, { icon: string; label: string }> = {
  auto: { icon: "\uD83D\uDCE1", label: "Auto Sensor" },
  bluetooth: { icon: "\uD83D\uDCF1", label: "Bluetooth" },
  manual: { icon: "\u270F\uFE0F", label: "Manual" },
};

function isInRange(u: TempUnit): boolean {
  return u.tempNum >= u.safeMin && u.tempNum <= u.safeMax;
}

/* ─── schedule data ─── */
const scheduleItems = [
  { status: "done", label: "Morning Check \u2013 Coolroom 1", time: "8:00 AM", temp: "3.2\u00B0C", user: "Sarah C." },
  { status: "done", label: "Morning Check \u2013 Coolroom 2", time: "8:05 AM", temp: "4.8\u00B0C", user: "Sarah C." },
  { status: "done", label: "Morning Check \u2013 Freezer 1", time: "8:10 AM", temp: "-18.5\u00B0C", user: "James L." },
  { status: "overdue", label: "Morning Check \u2013 Freezer 2", time: "8:15 AM", temp: "Overdue (25 min)", user: "" },
  { status: "upcoming", label: "Afternoon Check \u2013 All Units", time: "2:00 PM", temp: "Upcoming", user: "" },
  { status: "upcoming", label: "Evening Check \u2013 All Units", time: "6:00 PM", temp: "Upcoming", user: "" },
];

/* ─── records data ─── */
const recordsData = [
  { dateTime: "16/03, 10:30 AM", unit: "Coolroom 1", temp: "3.2\u00B0C", method: "Auto Sensor", result: "Pass", user: "System", corrective: "\u2014" },
  { dateTime: "16/03, 10:30 AM", unit: "Coolroom 2", temp: "4.8\u00B0C", method: "Auto Sensor", result: "Pass", user: "System", corrective: "\u2014" },
  { dateTime: "16/03, 10:30 AM", unit: "Freezer 1", temp: "-18.5\u00B0C", method: "Auto Sensor", result: "Pass", user: "System", corrective: "\u2014" },
  { dateTime: "16/03, 10:25 AM", unit: "Freezer 2", temp: "-12.1\u00B0C", method: "Auto Sensor", result: "Fail", user: "System", corrective: "Technician called" },
  { dateTime: "16/03, 8:00 AM", unit: "Coolroom 1", temp: "3.2\u00B0C", method: "Auto Sensor", result: "Pass", user: "Sarah C.", corrective: "\u2014" },
  { dateTime: "16/03, 9:15 AM", unit: "Hot Display", temp: "66.2\u00B0C", method: "Manual", result: "Pass", user: "James L.", corrective: "\u2014" },
  { dateTime: "16/03, 8:30 AM", unit: "Fridge 1", temp: "2.1\u00B0C", method: "Bluetooth", result: "Pass", user: "Sarah C.", corrective: "\u2014" },
];

/* ─── calendar helpers ─── */
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const calendarDots: Record<number, "green" | "red"> = {
  1: "green", 2: "green", 3: "green", 4: "red", 5: "green",
  6: "green", 7: "green", 8: "green", 9: "green", 10: "green",
  11: "red", 12: "green", 13: "green", 14: "green", 15: "green",
  16: "red",
};

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");

  return (
    <div className="p-5">
      {/* Area indicator */}
      {selectedArea !== "All Areas" && (
        <div className="mb-3 text-[11px] text-[#2E75B6] font-medium">
          Filtered: {selectedArea}
        </div>
      )}

      {/* Top bar: view toggle + action button */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex rounded-lg overflow-hidden border border-[#E4E7EE]">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-4 py-2 text-[12px] font-medium cursor-pointer transition-colors ${
                activeView === v.id
                  ? "bg-[#2E75B6] text-white"
                  : "bg-white text-[#666] hover:bg-[#F5F6FA]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-colors" style={{ background: "#2E75B6" }}>
          <span className="text-[14px]">+</span> Manual Check
        </button>
      </div>

      {/* Views */}
      {activeView === "dashboard" && <DashboardView />}
      {activeView === "calendar" && <CalendarView />}
      {activeView === "records" && <RecordsView />}
    </div>
  );
}

/* ─── Dashboard View ─── */
function DashboardView() {
  return (
    <>
      {/* Unit Status Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {units.map((u) => {
          const safe = isInRange(u);
          const m = methodIcons[u.method];
          return (
            <div
              key={u.name}
              className={`bg-white rounded-lg p-3.5 shadow-sm border ${
                safe ? "border-[#E4E7EE]" : "border-[#E74C3C] border-2"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px]">{u.icon}</span>
                  <span className="text-[12px] font-semibold text-[#333]">{u.name}</span>
                </div>
                {!safe && (
                  <span className="text-[10px] font-bold text-[#E74C3C]">\u26A0\uFE0F Action Required</span>
                )}
              </div>

              {/* Temperature */}
              <div className={`text-center py-2.5 rounded-md mb-2 ${safe ? "bg-[#E8F8F0]" : "bg-[#FDE8E8]"}`}>
                <div className={`text-[24px] font-black ${safe ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
                  {u.temp}
                </div>
                {!safe && (
                  <div className="text-[9px] font-bold text-[#E74C3C] uppercase tracking-[0.5px] mt-0.5">OUT OF RANGE</div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#666]">
                  <span>Safe range: {u.safeRange}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#666]">
                  <span>{m.icon} {m.label}</span>
                  <span>{u.lastReading}</span>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-1 mt-2">
                <span className={`w-1.5 h-1.5 rounded-full ${safe ? "bg-[#27AE60]" : "bg-[#E74C3C]"}`} />
                <span className={`text-[10px] font-medium ${safe ? "text-[#27AE60]" : "text-[#E74C3C]"}`}>
                  {safe ? "Normal" : "Alert"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <div className="px-4 py-3 border-b border-[#E4E7EE]">
          <h3 className="text-[13px] font-semibold text-[#333]">Today&apos;s Schedule</h3>
        </div>
        <div className="divide-y divide-[#F0F0F0]">
          {scheduleItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              {/* Status icon */}
              <span className="text-[14px] w-5 text-center shrink-0">
                {item.status === "done" ? "\u2705" : item.status === "overdue" ? "\u274C" : "\u23F3"}
              </span>
              {/* Label */}
              <span className={`text-[12px] flex-1 ${
                item.status === "overdue" ? "text-[#E74C3C] font-semibold" : "text-[#333]"
              }`}>
                {item.label}
              </span>
              {/* Time */}
              <span className="text-[11px] text-[#999] w-[70px] shrink-0">{item.time}</span>
              {/* Temp / status */}
              <span className={`text-[11px] w-[110px] shrink-0 text-right font-medium ${
                item.status === "overdue" ? "text-[#E74C3C]" :
                item.status === "upcoming" ? "text-[#95A5A6]" : "text-[#333]"
              }`}>
                {item.temp}
              </span>
              {/* User */}
              <span className="text-[11px] text-[#666] w-[70px] shrink-0 text-right">
                {item.user || "\u2014"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Calendar View ─── */
function CalendarView() {
  const days = getCalendarDays(2026, 2); // March 2026 (month index 2)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-5">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button className="text-[12px] text-[#666] hover:text-[#333] cursor-pointer px-2 py-1">&larr; Feb</button>
        <h3 className="text-[14px] font-semibold text-[#333]">March 2026</h3>
        <button className="text-[12px] text-[#666] hover:text-[#333] cursor-pointer px-2 py-1">Apr &rarr;</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#999] py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`h-[52px] rounded-md flex flex-col items-center justify-center text-[12px] ${
              day ? "hover:bg-[#F5F6FA] cursor-pointer" : ""
            } ${day === 16 ? "bg-[#2E75B6]/10 font-bold text-[#2E75B6]" : "text-[#333]"}`}
          >
            {day && (
              <>
                <span>{day}</span>
                {calendarDots[day] && (
                  <span
                    className={`w-2 h-2 rounded-full mt-1 ${
                      calendarDots[day] === "green" ? "bg-[#27AE60]" : "bg-[#E74C3C]"
                    }`}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#E4E7EE]">
        <div className="flex items-center gap-1.5 text-[11px] text-[#666]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]" /> All checks passed
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#666]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E74C3C]" /> Issues detected
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#666]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E4E7EE]" /> No data
        </div>
      </div>
    </div>
  );
}

/* ─── Records View ─── */
function RecordsView() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
      <div className="px-4 py-3 border-b border-[#E4E7EE] flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#333]">Temperature Records</h3>
        <button className="text-[11px] px-3 py-1.5 rounded border border-[#E4E7EE] text-[#666] hover:bg-[#F5F6FA] cursor-pointer transition-colors">
          Export CSV
        </button>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-[#E4E7EE] text-[#666]">
            <th className="text-left px-3 py-2 font-medium">Date/Time</th>
            <th className="text-left px-3 py-2 font-medium">Unit</th>
            <th className="text-left px-3 py-2 font-medium">Temperature</th>
            <th className="text-left px-3 py-2 font-medium">Method</th>
            <th className="text-left px-3 py-2 font-medium">Result</th>
            <th className="text-left px-3 py-2 font-medium">User</th>
            <th className="text-left px-3 py-2 font-medium">Corrective Action</th>
          </tr>
        </thead>
        <tbody>
          {recordsData.map((row, i) => (
            <tr key={i} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
              <td className="px-3 py-2 text-[#666]">{row.dateTime}</td>
              <td className="px-3 py-2 font-medium text-[#333]">{row.unit}</td>
              <td className="px-3 py-2 font-medium text-[#333]">{row.temp}</td>
              <td className="px-3 py-2 text-[#666]">{row.method}</td>
              <td className="px-3 py-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  row.result === "Pass"
                    ? "bg-[#E8F8F0] text-[#27AE60]"
                    : "bg-[#FDE8E8] text-[#E74C3C]"
                }`}>
                  {row.result}
                </span>
              </td>
              <td className="px-3 py-2 text-[#666]">{row.user}</td>
              <td className="px-3 py-2 text-[#666]">{row.corrective}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Docs ─── */
export function Docs() {
  return (
    <>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#2E75B6]">Documentation</span>
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Temperatures</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Temperatures module provides real-time monitoring, scheduled checks, and manual recording of temperature data across all refrigeration, freezer, and hot-holding units. It is the most compliance-critical module in Hospitality Safe.
        </p>
      </div>

      <DocSection title="Recording Methods">
        <p>Temperatures can be recorded via three methods:</p>
        <ul className="list-disc pl-4 space-y-2 mt-2">
          <li>
            <strong>Auto Sensor (\uD83D\uDCE1):</strong> IoT sensors installed inside fridges, freezers, and coolrooms transmit readings every 15 minutes via a gateway device. No staff action required. If a reading is out of the safe range, the system generates an alert immediately. Sensors are battery-powered and last approximately 2 years.
          </li>
          <li>
            <strong>Bluetooth Thermometer (\uD83D\uDCF1):</strong> Staff pair a wireless probe thermometer via Bluetooth. To take a reading: insert probe, wait for stable reading (the display shows a stabilizing animation), then tap &quot;Record.&quot; The temperature is captured with the unit, timestamp, and staff PIN. There can be a 30&ndash;60 second delay for Bluetooth sync.
          </li>
          <li>
            <strong>Manual Entry (\u270F\uFE0F):</strong> Staff type the temperature manually using the on-screen keypad. This is a fallback method enabled per-unit in Settings. Manual entry requires the staff member to visually read a thermometer and type the value. It is the least reliable method and is flagged in reports.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Auto Monitoring Details">
        <p>For units with auto sensors:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Readings arrive every 15 minutes (configurable: 5, 10, 15, 30 min)</li>
          <li>If a reading is outside the safe range, an alert is generated within 1 minute</li>
          <li>Alerts are pushed to the app, email, and SMS (configurable)</li>
          <li>If the sensor loses connection for more than 30 minutes, a &quot;sensor disconnected&quot; alert is triggered</li>
          <li>Data is stored for 7 years for compliance auditing</li>
        </ul>
      </DocSection>

      <DocSection title="Scheduling">
        <p>Temperature check schedules are configured per unit, per day of the week:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Each unit can have multiple scheduled checks per day (e.g. morning, afternoon, evening)</li>
          <li>Schedules can vary by day (e.g. fewer checks on weekends)</li>
          <li>Closed days can be marked &mdash; no checks are expected</li>
          <li>Overdue checks appear in the dashboard as red items</li>
          <li>The system tracks compliance percentage: completed checks vs. scheduled checks</li>
        </ul>
        <p className="mt-2">Schedules are configured by Managers in Settings &rarr; Temperature &rarr; Schedules.</p>
      </DocSection>

      <DocSection title="Corrective Action Workflow">
        <p>When a temperature reading is out of range (either from a sensor alert or a manual/Bluetooth reading), the system requires a corrective action:</p>
        <ol className="list-decimal pl-4 space-y-1 mt-1">
          <li><strong>Select action type</strong> from a dropdown: &quot;Adjusted thermostat,&quot; &quot;Moved food to another unit,&quot; &quot;Discarded food,&quot; &quot;Called technician,&quot; &quot;Defrosted/cleaned unit,&quot; or &quot;Other&quot;</li>
          <li><strong>Add notes</strong> describing what was done (free text)</li>
          <li><strong>Optionally create a Task</strong> for follow-up (e.g. &quot;Check Freezer 2 in 1 hour&quot;). This creates a task in the Task Manager module.</li>
          <li><strong>Optionally record waste</strong> if food was discarded, linking to the waste/inventory system</li>
          <li><strong>Re-check temperature</strong> after corrective action to confirm it&apos;s back in range</li>
        </ol>
        <p className="mt-2">All corrective actions are logged and visible in the Records view and in Audit reports.</p>
      </DocSection>

      <DocSection title="Calendar View">
        <p>The Calendar view provides a monthly overview of temperature compliance:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#27AE60] align-middle mr-1" /> <strong>Green dot:</strong> All scheduled checks completed and within range</li>
          <li><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E74C3C] align-middle mr-1" /> <strong>Red dot:</strong> One or more out-of-range readings or missed checks</li>
          <li><strong>No dot:</strong> No data recorded (could be a closed day or future date)</li>
        </ul>
        <p className="mt-2">Clicking a day opens the detailed records for that date.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Record manual/Bluetooth temps, view own readings, complete corrective actions"],
          ["Team Leader", "View all readings for their area, acknowledge alerts, view reports"],
          ["Manager", "Configure schedules, safe ranges, units, alert thresholds. View all records, export data, sign off corrective actions"],
          ["Superuser", "All above across locations. Configure sensor gateways, manage IoT devices"],
        ]} />
      </DocSection>

      <DocNote type="warning">
        <strong>Known Issues:</strong>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Hot Display 66\u00B0C showing green:</strong> The current safe range for hot holding is set to 60&ndash;100\u00B0C, which means 66\u00B0C is technically &quot;in range.&quot; However, Australian food safety guidelines recommend &ge;63\u00B0C for hot holding. The default range configuration needs review &mdash; some businesses may want a tighter threshold (e.g. 63&ndash;100\u00B0C).</li>
          <li><strong>Cooling temperature false warnings:</strong> During the cooling process (e.g. cooked food cooling from 60\u00B0C to 21\u00B0C within 2 hours), the system may generate false out-of-range alerts for fridge units. The Processes module handles cooling workflows separately, but the temperature module does not yet suppress alerts during active cooling processes.</li>
          <li><strong>Bluetooth delay:</strong> Bluetooth thermometer readings can take 30&ndash;60 seconds to stabilize and sync. Staff sometimes tap &quot;Record&quot; before the reading stabilizes, capturing an inaccurate temperature. A &quot;waiting for stable reading&quot; indicator is shown, but it&apos;s not always clear enough.</li>
        </ul>
      </DocNote>

      <DocNote type="info">
        Temperature data is the most frequently audited data in food safety inspections. Ensure auto sensors are calibrated annually and that manual checks are performed as scheduled, even when auto sensors are installed (some councils require both).
      </DocNote>
    </>
  );
}

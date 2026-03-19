"use client";

import { useState, useEffect } from "react";
import { DocSection, DocNote } from "@/lib/hospitality-safe-docs";

/* ─── types ─── */
type View = "list" | "unit-detail" | "add-record" | "pin-auth" | "temp-warning" | "alerts";

const stepMap: Record<View, number> = {
  list: 1,
  "unit-detail": 2,
  "add-record": 3,
  "pin-auth": 4,
  "temp-warning": 5,
  alerts: 6,
};

/* ─── unit data ─── */
interface TempUnit {
  name: string;
  min: string;
  avg: string;
  max: string;
  minNum: number;
  avgNum: number;
  maxNum: number;
  safeMin: number;
  safeMax: number;
  status: "red" | "orange" | "green" | "grey";
  timer: string;
}

const units: TempUnit[] = [
  { name: "Cool Room", min: "2.80°C", avg: "3.75°C", max: "5.80°C", minNum: 2.8, avgNum: 3.75, maxNum: 5.8, safeMin: 0, safeMax: 5, status: "green", timer: "0.00h" },
  { name: "Freezer Room", min: "-20.90°C", avg: "-20.10°C", max: "-18.66°C", minNum: -20.9, avgNum: -20.1, maxNum: -18.66, safeMin: -25, safeMax: -15, status: "red", timer: "0.00h" },
  { name: "Grill U/B Fridge", min: "4.80°C", avg: "4.90°C", max: "5.00°C", minNum: 4.8, avgNum: 4.9, maxNum: 5.0, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Keg Room", min: "", avg: "", max: "", minNum: 0, avgNum: 0, maxNum: 0, safeMin: 0, safeMax: 5, status: "grey", timer: "0.00h" },
  { name: "Larder U/B Fridge", min: "21.70°C", avg: "21.83°C", max: "21.00°C", minNum: 21.7, avgNum: 21.83, maxNum: 21.0, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Pans / Fryer U/B Fridge", min: "3.70°C", avg: "3.79°C", max: "3.90°C", minNum: 3.7, avgNum: 3.79, maxNum: 3.9, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Pasta draw Freezer", min: "-16.80°C", avg: "-15.46°C", max: "-13.70°C", minNum: -16.8, avgNum: -15.46, maxNum: -13.7, safeMin: -25, safeMax: -15, status: "red", timer: "0.00h" },
  { name: "Pasta Draw Fridge", min: "4.20°C", avg: "4.36°C", max: "4.60°C", minNum: 4.2, avgNum: 4.36, maxNum: 4.6, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Pasta U/B fridge", min: "3.40°C", avg: "4.25°C", max: "5.20°C", minNum: 3.4, avgNum: 4.25, maxNum: 5.2, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Pizza u/B Fridge", min: "3.30°C", avg: "3.43°C", max: "3.60°C", minNum: 3.3, avgNum: 3.43, maxNum: 3.6, safeMin: 0, safeMax: 5, status: "red", timer: "0.00h" },
  { name: "Upright Freezer 1", min: "-17.40°C", avg: "-14.44°C", max: "-12.60°C", minNum: -17.4, avgNum: -14.44, maxNum: -12.6, safeMin: -25, safeMax: -15, status: "red", timer: "0.00h" },
  { name: "Upright freezer 2", min: "-17.20°C", avg: "-15.18°C", max: "-13.80°C", minNum: -17.2, avgNum: -15.18, maxNum: -13.8, safeMin: -25, safeMax: -15, status: "red", timer: "0.00h" },
];

/* ─── unit detail data (Cool Room hourly records) ─── */
interface HourlyRecord {
  min: string;
  avg: string;
  max: string;
  timeRange: string;
  type: string;
  minNum: number;
  maxNum: number;
  safeMin: number;
  safeMax: number;
}

const coolRoomRecords: HourlyRecord[] = [
  { min: "2.80°C", avg: "3.51°C", max: "4.70°C", timeRange: "00:00 am to 00:59 am", type: "Sensor", minNum: 2.8, maxNum: 4.7, safeMin: 0, safeMax: 5 },
  { min: "2.90°C", avg: "3.77°C", max: "5.00°C", timeRange: "01:00 am to 01:59 am", type: "Sensor", minNum: 2.9, maxNum: 5.0, safeMin: 0, safeMax: 5 },
  { min: "2.80°C", avg: "3.75°C", max: "5.00°C", timeRange: "02:00 am to 02:59 am", type: "Sensor", minNum: 2.8, maxNum: 5.0, safeMin: 0, safeMax: 5 },
];

/* out-of-range unit detail (Larder U/B Fridge or similar) */
const outOfRangeRecords: HourlyRecord[] = [
  { min: "5.20°C", avg: "6.94°C", max: "9.00°C", timeRange: "04:00 am to 04:59 am", type: "Sensor", minNum: 5.2, maxNum: 9.0, safeMin: 0, safeMax: 5 },
  { min: "3.90°C", avg: "5.03°C", max: "6.30°C", timeRange: "05:00 am to 05:59 am", type: "Sensor", minNum: 3.9, maxNum: 6.3, safeMin: 0, safeMax: 5 },
  { min: "4.90°C", avg: "6.48°C", max: "9.20°C", timeRange: "06:00 am to 06:59 am", type: "Sensor", minNum: 4.9, maxNum: 9.2, safeMin: 0, safeMax: 5 },
  { min: "7.20°C", avg: "9.04°C", max: "11.70°C", timeRange: "07:00 am to 07:59 am", type: "Sensor", minNum: 7.2, maxNum: 11.7, safeMin: 0, safeMax: 5 },
  { min: "4.30°C", avg: "5.76°C", max: "7.40°C", timeRange: "08:00 am to 08:59 am", type: "Sensor", minNum: 4.3, maxNum: 7.4, safeMin: 0, safeMax: 5 },
  { min: "3.20°C", avg: "4.13°C", max: "5.30°C", timeRange: "09:00 am to 09:59 am", type: "Sensor", minNum: 3.2, maxNum: 5.3, safeMin: 0, safeMax: 5 },
];

/* ─── calendar data ─── */
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

// January 2024 calendar dots matching Figma
const calendarDots: Record<number, ("red" | "green")[]> = {
  1: ["red"],
  2: ["red"],
  3: ["red"],
  4: ["red"],
  5: ["red"],
  6: ["red"],
  7: ["red"],
  8: ["red"],
  9: ["red"],
  10: ["red"],
  11: ["green"],
  12: ["red"],
  13: ["red"],
  14: ["red"],
  15: ["red"],
  16: ["red"],
  17: ["red"],
  18: ["red", "green"],
  19: ["red"],
  20: ["red"],
  21: ["green"],
  22: ["green"],
  23: ["green"],
  24: ["green"],
  25: ["green"],
  26: ["green"],
  27: [],
  28: ["green"],
  29: ["green", "red"],
  30: ["red"],
  31: ["red"],
};

/* ─── alerts data ─── */
const alertsData = [
  { unit: "Cool Room", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:09 PM" },
  { unit: "Cool Room", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:08 PM" },
  { unit: "Freezer Room", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:08 PM" },
  { unit: "Grill U/B Fridge", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:09 PM" },
  { unit: "Upright Freezer 1", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:08 PM" },
  { unit: "Larder U/B Fridge", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:09 PM" },
  { unit: "Pans / Fryer U/B Fridge", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:08 PM" },
  { unit: "Pasta draw Freezer", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:09 PM" },
  { unit: "Pasta Draw Fridge", type: "SENSOR ALERT", msg: "Out of Temperature Range", time: "Today at 17:09 PM" },
];

/* ─── corrective actions ─── */
const correctiveActions = [
  "Maintenance Issue",
  "Busy service period",
  "Defrost Cycle",
];

/* ─── helpers ─── */
function isOutOfRange(val: number, safeMin: number, safeMax: number) {
  return val < safeMin || val > safeMax;
}

function tempColor(val: number, safeMin: number, safeMax: number) {
  return isOutOfRange(val, safeMin, safeMax) ? "text-[#E74C3C]" : "text-[#27AE60]";
}

function statusColor(s: TempUnit["status"]) {
  switch (s) {
    case "red": return "bg-[#E74C3C]";
    case "orange": return "bg-[#F39C12]";
    case "green": return "bg-[#27AE60]";
    case "grey": return "bg-[#CCCCCC]";
  }
}

function BtnFill({ label, color, onClick }: { label: string; color?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded text-white text-[11px] font-semibold cursor-pointer hover:opacity-90 transition-colors"
      style={{ background: color || "#4A5FC1" }}
    >
      {label}
    </button>
  );
}

function BtnOutline({ label, onClick, active }: { label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-[11px] font-semibold cursor-pointer transition-colors border ${
        active
          ? "bg-[#4A5FC1] text-white border-[#4A5FC1]"
          : "bg-white text-[#4A5FC1] border-[#4A5FC1] hover:bg-[#F0F2FF]"
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Mockup ─── */
export function Mockup({
  selectedArea,
  onSubStepChange,
  currentStep,
}: {
  selectedArea: string;
  onSubStepChange?: (step: number) => void;
  currentStep?: number;
  onNavigateScreen?: (id: string) => void;
}) {
  const [view, setView] = useState<View>("list");
  const [selectedUnit, setSelectedUnit] = useState<TempUnit | null>(null);
  const [addTab, setAddTab] = useState<"device" | "manual">("manual");
  const [tempInput, setTempInput] = useState("");
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  const [selectedAction, setSelectedAction] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [calMonth, setCalMonth] = useState(0); // 0 = January 2024
  const [calYear, setCalYear] = useState(2024);

  const go = (v: View) => {
    setView(v);
    onSubStepChange?.(stepMap[v]);
  };

  // Sync from parent
  useEffect(() => {
    if (currentStep !== undefined) {
      const m: Record<number, View> = { 1: "list", 2: "unit-detail", 3: "add-record", 4: "pin-auth", 5: "temp-warning", 6: "alerts" };
      const expected = m[currentStep];
      if (expected && expected !== view) setView(expected);
    }
  }, [currentStep]);

  // Filter by area
  const filteredUnits = selectedArea === "All Areas"
    ? units
    : units.filter((u) => u.name.toLowerCase().includes(selectedArea.toLowerCase()));

  /* ─── LIST VIEW ─── */
  if (view === "list") {
    return (
      <div className="p-5">
        <h2 className="text-[18px] font-bold text-[#4A5FC1] text-center mb-1">Temperature Records</h2>
        <p className="text-[11px] text-[#999] text-center mb-5">View and add temperature records for units.</p>

        {/* Unit list */}
        <div className="border border-[#E4E7EE] rounded-lg overflow-hidden">
          {filteredUnits.map((u, i) => (
            <div
              key={u.name}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#F5F6FA] transition-colors ${
                i < filteredUnits.length - 1 ? "border-b border-[#E4E7EE]" : ""
              }`}
              onClick={() => {
                setSelectedUnit(u);
                go("unit-detail");
              }}
            >
              {/* Unit name */}
              <div className="w-[160px] shrink-0">
                <span className="text-[12px] font-medium text-[#333]">{u.name}</span>
              </div>

              {/* MIN / AVG / MAX */}
              <div className="flex items-center gap-4 flex-1 justify-center">
                {u.min ? (
                  <>
                    <div className="text-center">
                      <div className="text-[8px] text-[#999] uppercase tracking-wider">Min</div>
                      <div className={`text-[11px] font-semibold ${tempColor(u.minNum, u.safeMin, u.safeMax)}`}>
                        {u.min}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] text-[#999] uppercase tracking-wider">Avg</div>
                      <div className={`text-[11px] font-semibold ${tempColor(u.avgNum, u.safeMin, u.safeMax)}`}>
                        {u.avg}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] text-[#999] uppercase tracking-wider">Max</div>
                      <div className={`text-[11px] font-semibold ${tempColor(u.maxNum, u.safeMin, u.safeMax)}`}>
                        {u.max}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-[#CCC]">&mdash;</div>
                )}
              </div>

              {/* Status indicator + timer + Add */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-[#999]">Today</span>
                <span className={`w-3 h-3 rounded-sm ${statusColor(u.status)}`} />
                <span className="text-[11px] text-[#333] font-mono">{u.timer}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUnit(u);
                    go("add-record");
                  }}
                  className="px-3 py-1 bg-[#4A5FC1] text-white text-[10px] font-semibold rounded cursor-pointer hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── UNIT DETAIL VIEW ─── */
  if (view === "unit-detail" && selectedUnit) {
    const isOutOfRangeUnit = selectedUnit.name === "Larder U/B Fridge" || selectedUnit.name === "Grill U/B Fridge";
    const records = isOutOfRangeUnit ? outOfRangeRecords : coolRoomRecords;
    const days = getCalendarDays(calYear, calMonth);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="p-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => go("list")}
            className="px-3 py-1.5 bg-[#4A5FC1] text-white text-[11px] font-semibold rounded cursor-pointer hover:opacity-90"
          >
            Back
          </button>
          <h2 className="text-[16px] font-bold text-[#4A5FC1]">{selectedUnit.name}</h2>
          <button
            onClick={() => go("add-record")}
            className="px-3 py-1.5 bg-[#4A5FC1] text-white text-[11px] font-semibold rounded cursor-pointer hover:opacity-90"
          >
            Add Record
          </button>
        </div>

        {/* Hourly records */}
        <div className="space-y-3 mb-6">
          {records.map((r, i) => {
            const outMin = isOutOfRange(r.minNum, r.safeMin, r.safeMax);
            const outMax = isOutOfRange(r.maxNum, r.safeMin, r.safeMax);
            return (
              <div key={i} className="border border-[#E4E7EE] rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] text-[#999]">Min: </span>
                      <span className={`text-[12px] font-semibold ${outMin ? "text-[#E74C3C]" : "text-[#4A5FC1]"}`}>{r.min}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#999]">Avg: </span>
                      <span className={`text-[12px] font-semibold ${outMin || outMax ? "text-[#E74C3C]" : "text-[#4A5FC1]"}`}>{r.avg}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#999]">Max: </span>
                      <span className={`text-[12px] font-semibold ${outMax ? "text-[#E74C3C]" : "text-[#4A5FC1]"}`}>{r.max}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#999]">{r.timeRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-[#999]">Type</div>
                  <div className="text-[10px] text-[#333]">{r.type}</div>
                </div>
                {isOutOfRangeUnit && (
                  <div className="mt-2 pt-2 border-t border-[#E4E7EE]">
                    <button className="text-[10px] text-[#4A5FC1] font-medium cursor-pointer hover:underline">
                      Corrective Action
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Missing record placeholder */}
          <div className="border border-[#E4E7EE] rounded-lg p-4 bg-white">
            <p className="text-[11px] text-[#E74C3C]">No temperature record found for this check time.</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="border border-[#E4E7EE] rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                else setCalMonth(calMonth - 1);
              }}
              className="px-3 py-1 border border-[#4A5FC1] text-[#4A5FC1] text-[10px] font-semibold rounded cursor-pointer hover:bg-[#F0F2FF]"
            >
              Prev Month
            </button>
            <h3 className="text-[13px] font-semibold text-[#333]">
              {monthNames[calMonth]} {calYear}
            </h3>
            <button
              onClick={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                else setCalMonth(calMonth + 1);
              }}
              className="px-3 py-1 border border-[#4A5FC1] text-[#4A5FC1] text-[10px] font-semibold rounded cursor-pointer hover:bg-[#F0F2FF]"
            >
              Next Month
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-[9px] font-semibold text-[#666] py-2 border-b border-[#E4E7EE]">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0">
            {days.map((day, i) => (
              <div
                key={i}
                className={`min-h-[50px] border-b border-r border-[#E4E7EE] p-1 ${
                  day === 29 && calMonth === 0 ? "bg-[#E8F0FE]" : ""
                }`}
              >
                {day && (
                  <>
                    <div className="text-[10px] text-[#333] mb-1">{day}</div>
                    {calMonth === 0 && calYear === 2024 && calendarDots[day] && (
                      <div className="flex gap-0.5 flex-wrap">
                        {calendarDots[day].map((color, ci) => (
                          <span
                            key={ci}
                            className={`w-2.5 h-2.5 rounded-sm ${color === "green" ? "bg-[#27AE60]" : "bg-[#E74C3C]"}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── ADD RECORD VIEW ─── */
  if (view === "add-record") {
    return (
      <div className="p-5 flex items-center justify-center min-h-[500px]">
        <div className="w-[320px] bg-white rounded-lg border border-[#E4E7EE] p-6">
          <h2 className="text-[16px] font-bold text-[#4A5FC1] text-center mb-1">Record Temperature</h2>
          <p className="text-[11px] text-[#999] text-center mb-5">Record a temperature manually.</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <BtnOutline label="Device Entry" onClick={() => setAddTab("device")} active={addTab === "device"} />
            <BtnOutline label="Manual Entry" onClick={() => setAddTab("manual")} active={addTab === "manual"} />
          </div>

          {addTab === "device" ? (
            /* Device Entry (Bluetooth) */
            <div>
              <p className="text-[11px] text-[#666] mb-3">Scanning for bluetooth devices...</p>
              <div className="h-[60px] border border-[#E4E7EE] rounded-lg flex items-center justify-center mb-4">
                <span className="text-[11px] text-[#999]">No devices found</span>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => go(selectedUnit ? "unit-detail" : "list")}
                  className="px-4 py-2 border border-[#E4E7EE] rounded text-[11px] text-[#666] cursor-pointer hover:bg-[#F5F6FA]"
                >
                  Cancel
                </button>
                <BtnFill label="Continue" />
              </div>
            </div>
          ) : (
            /* Manual Entry */
            <div>
              <p className="text-[11px] text-[#666] mb-4">
                Enter a temperature and press the Record button below to save the temperature.
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <input
                  type="text"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  placeholder="0"
                  className="w-[80px] h-[50px] border border-[#E4E7EE] rounded-lg text-center text-[24px] font-bold text-[#333] outline-none focus:border-[#4A5FC1]"
                />
                <span className="text-[18px] text-[#666]">°C</span>
                <button
                  onClick={() => {
                    const val = parseFloat(tempInput);
                    if (isNaN(val)) return;
                    // Check if out of range → go to warning, else go to PIN
                    if (selectedUnit && isOutOfRange(val, selectedUnit.safeMin, selectedUnit.safeMax)) {
                      go("temp-warning");
                    } else {
                      go("pin-auth");
                    }
                  }}
                  className="px-5 py-3 bg-[#4A5FC1] text-white text-[13px] font-semibold rounded-lg cursor-pointer hover:opacity-90"
                >
                  Record
                </button>
              </div>
              <button
                onClick={() => go(selectedUnit ? "unit-detail" : "list")}
                className="block mx-auto text-[11px] text-[#E74C3C] cursor-pointer hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── PIN AUTH VIEW ─── */
  if (view === "pin-auth") {
    const handlePinDigit = (digit: string) => {
      const next = [...pinDigits];
      const idx = next.findIndex((d) => d === "");
      if (idx !== -1) {
        next[idx] = digit;
        setPinDigits(next);
        // If all filled, proceed
        if (idx === 3) {
          setTimeout(() => {
            setPinDigits(["", "", "", ""]);
            go(selectedUnit ? "unit-detail" : "list");
          }, 500);
        }
      }
    };
    const handlePinBackspace = () => {
      const next = [...pinDigits];
      const lastFilled = next.map((d, i) => (d !== "" ? i : -1)).filter((i) => i !== -1);
      if (lastFilled.length > 0) {
        next[lastFilled[lastFilled.length - 1]] = "";
        setPinDigits(next);
      }
    };

    return (
      <div className="p-5 flex items-center justify-center min-h-[500px]">
        <div className="w-[280px] bg-white rounded-lg border border-[#E4E7EE] p-6">
          <h2 className="text-[14px] font-bold text-[#333] text-center mb-5">Authentication Required</h2>

          {/* PIN dots */}
          <div className="flex justify-center gap-3 mb-6">
            {pinDigits.map((d, i) => (
              <div
                key={i}
                className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center text-[18px] font-bold ${
                  d ? "border-[#4A5FC1] text-[#4A5FC1]" : "border-[#E4E7EE]"
                }`}
              >
                {d ? "•" : ""}
              </div>
            ))}
          </div>

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handlePinDigit(String(n))}
                className="h-[44px] bg-white border border-[#E4E7EE] rounded-lg text-[16px] font-semibold text-[#333] cursor-pointer hover:bg-[#F5F6FA]"
              >
                {n}
              </button>
            ))}
            <button
              onClick={handlePinBackspace}
              className="h-[44px] bg-[#E74C3C] rounded-lg text-[14px] text-white cursor-pointer hover:opacity-90"
            >
              ←
            </button>
            <button
              onClick={() => handlePinDigit("0")}
              className="h-[44px] bg-white border border-[#E4E7EE] rounded-lg text-[16px] font-semibold text-[#333] cursor-pointer hover:bg-[#F5F6FA]"
            >
              0
            </button>
            <div />
          </div>

          <button
            onClick={() => {
              setPinDigits(["", "", "", ""]);
              go("add-record");
            }}
            className="block mx-auto text-[11px] text-[#E74C3C] cursor-pointer hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  /* ─── TEMPERATURE WARNING VIEW ─── */
  if (view === "temp-warning") {
    return (
      <div className="p-5 flex items-center justify-center min-h-[500px]">
        <div className="w-[340px] bg-white rounded-lg border border-[#E4E7EE] p-6">
          <h2 className="text-[16px] font-bold text-[#E74C3C] text-center mb-1">Temperature Warning</h2>
          <p className="text-[11px] text-[#999] text-center mb-5">The entered temperature is at an unsafe level.</p>

          <p className="text-[12px] font-semibold text-[#333] mb-3">Please provide a corrective action.</p>

          {/* Dropdown */}
          <div className="relative mb-5">
            <button
              onClick={() => setShowActionDropdown(!showActionDropdown)}
              className="w-full px-3 py-2.5 border border-[#E4E7EE] rounded-lg text-left text-[11px] cursor-pointer hover:border-[#4A5FC1] flex items-center justify-between"
            >
              <span className={selectedAction ? "text-[#333]" : "text-[#999]"}>
                {selectedAction || "Select an item..."}
              </span>
              <span className="text-[#999]">{showActionDropdown ? "∧" : "∨"}</span>
            </button>
            {showActionDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#E4E7EE] rounded-lg mt-1 shadow-lg z-10">
                {correctiveActions.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setSelectedAction(a);
                      setShowActionDropdown(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-[11px] text-[#333] hover:bg-[#F5F6FA] cursor-pointer"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          <BtnFill
            label="Submit"
            onClick={() => {
              setSelectedAction("");
              setShowActionDropdown(false);
              go("pin-auth");
            }}
          />

          <button
            onClick={() => {
              setSelectedAction("");
              setShowActionDropdown(false);
              go("add-record");
            }}
            className="block mx-auto mt-3 text-[11px] text-[#E74C3C] cursor-pointer hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  /* ─── ALERTS VIEW ─── */
  if (view === "alerts") {
    return (
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#4A5FC1]">Alerts</h2>
            <span className="w-5 h-5 rounded-full bg-[#E74C3C] text-white text-[10px] font-bold flex items-center justify-center">
              {alertsData.length}
            </span>
          </div>
          <button
            onClick={() => go("list")}
            className="text-[11px] text-[#4A5FC1] cursor-pointer hover:underline"
          >
            Close
          </button>
        </div>

        <div className="space-y-2">
          {alertsData.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white border border-[#E4E7EE] rounded-lg">
              <div className="flex-1">
                <div className="text-[9px] font-bold text-[#E74C3C] uppercase tracking-wider mb-0.5">
                  {a.type}:
                </div>
                <div className="text-[11px] font-medium text-[#333]">
                  {a.unit} &ndash; {a.msg}
                </div>
              </div>
              <div className="text-[9px] text-[#999] shrink-0">{a.time}</div>
              <button className="w-5 h-5 rounded-full border border-[#E4E7EE] flex items-center justify-center text-[10px] text-[#999] cursor-pointer hover:bg-[#FDE8E8] hover:text-[#E74C3C] shrink-0">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback
  return <div className="p-5 text-[12px] text-[#999]">No view selected.</div>;
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  return (
    <>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#2E75B6]">Documentation</span>
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Temperatures</h2>
      </div>

      {step === 1 && (
        <>
          <DocSection title="What is this?">
            <p>The main Temperature Records list shows every temperature unit configured for the business. Each row displays the unit name, today&apos;s MIN / AVG / MAX readings, a status indicator, a countdown timer, and an Add button.</p>
          </DocSection>

          <DocSection title="Status Indicator Colors">
            <ul className="list-disc pl-4 space-y-1 mt-1">
              <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#E74C3C] align-middle mr-1" /> <strong>Red:</strong> Temperature is within an unsafe range</li>
              <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#F39C12] align-middle mr-1" /> <strong>Orange:</strong> Temperature has fluctuations &mdash; in and out of range</li>
              <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#27AE60] align-middle mr-1" /> <strong>Green:</strong> All temperatures are within safe range and completed within required timeframes</li>
              <li><span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#CCC] align-middle mr-1" /> <strong>Grey:</strong> No temperature records taken</li>
            </ul>
          </DocSection>

          <DocSection title="Timer / Countdown">
            <p>The &quot;0.00h&quot; value is a countdown for when the next temperature record is due. Once temperature check times are configured in Settings, temperatures should be taken within that window. The system automatically grabs data logger temperatures at these times, or the user records manually via Bluetooth or manual entry.</p>
          </DocSection>

          <DocSection title="Area Filtering">
            <p>When an area is selected at the top, only temperature units linked to that area will show.</p>
          </DocSection>

          <DocNote type="info">
            <strong>[Figma: blue]</strong> Is it necessary to have icons next to the unit names?
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> The temperature readings need to be centred more in the middle. These readings that appear are hourly readings pushed through the app. Should we show the min, max and average or just the average to make the page easier on the eye? If we click onto the unit, maybe there is where we get more detailed temperature information like min, max.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> For data loggers, they should take 2x readings daily as a record. Fix this in setting requirements.
          </DocNote>
        </>
      )}

      {step === 2 && (
        <>
          <DocSection title="What is this?">
            <p>The unit detail screen shows hourly temperature records for a specific unit. Each record card shows the Min, Avg, and Max temperature for that hour, the time range, and the recording type (Sensor, Manual, Bluetooth).</p>
          </DocSection>

          <DocSection title="Calendar">
            <p>Below the records is a monthly calendar showing daily compliance status. Red squares indicate days with issues (out-of-range readings or missed checks). Green squares indicate all checks passed.</p>
          </DocSection>

          <DocSection title="Corrective Actions">
            <p>When a unit has out-of-range readings, each record card shows a &quot;Corrective Action&quot; link. Tapping it lets the user record what action was taken. An &quot;Add Corrective Action&quot; button also appears at the top.</p>
          </DocSection>

          <DocNote type="info">
            <strong>[Figma: blue]</strong> Every hour temperatures should be coming through to the app as records. A temperature record is due at 10:00am, however, there are no checks coming through.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> When there is an out of temperature reading with data loggers, there needs to be the ability to record the corrective action for the unit. We need to know how long the unit is out of temperature for so the business knows what action to take regarding the food.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> I&apos;m not sure what is determining if the daily temperature record indicator turns red. Need to establish this as there are temperatures taken within these red dot days and the temperatures are good but it looks like they are not.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> When I press Prev Month the calendar shows with no information &mdash; it is blank. If I press previous to November and then next Month back to December the data shows.
          </DocNote>
        </>
      )}

      {step === 3 && (
        <>
          <DocSection title="What is this?">
            <p>The Record Temperature screen lets users add a temperature reading for a unit. There are two entry methods: Device Entry (Bluetooth thermometer) and Manual Entry (type the value).</p>
          </DocSection>

          <DocSection title="Device Entry (Bluetooth)">
            <p>Staff pair a wireless probe thermometer via Bluetooth. The system scans for nearby devices. Once connected, insert the probe, wait for a stable reading, then tap Record.</p>
          </DocSection>

          <DocSection title="Manual Entry">
            <p>Staff type the temperature using the on-screen input. Negative values are supported (for freezers). After pressing Record, the system checks if the temperature is in the safe range. If not, it shows a Temperature Warning.</p>
          </DocSection>

          <DocNote type="info">
            <strong>[Figma: blue]</strong> The user can add unit temperature records manually or through Bluetooth thermometers to verify temperatures or as their main way of taking temperatures if they do not have data loggers in use.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> During testing, there was a 30&ndash;60 second delay for it to then show on the record page. Can we look into this and make it an instant update onto the record sheet.
          </DocNote>
        </>
      )}

      {step === 4 && (
        <>
          <DocSection title="What is this?">
            <p>After recording a temperature (or submitting a corrective action), the user must authenticate with their 4-digit PIN. This links the record to the specific staff member.</p>
          </DocSection>

          <DocSection title="How it works">
            <p>Enter 4 digits using the number pad. The red backspace button clears the last digit. Once all 4 digits are entered, the system validates the PIN and saves the record.</p>
          </DocSection>
        </>
      )}

      {step === 5 && (
        <>
          <DocSection title="What is this?">
            <p>The Temperature Warning screen appears when an out-of-range temperature is entered. The user must select a corrective action from the dropdown before proceeding.</p>
          </DocSection>

          <DocSection title="Corrective Action Options">
            <ul className="list-disc pl-4 space-y-1 mt-1">
              <li>Maintenance Issue</li>
              <li>Busy service period</li>
              <li>Defrost Cycle</li>
              <li>Other: Specify (free text)</li>
            </ul>
          </DocSection>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> If a user enters a temperature and the temperature warning screen shows, if the user just cancels it, the temperature is still recorded. So if it is a mistake and the user cancels it, it still saves that reading.
          </DocNote>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> When the corrective action is submitted, the screen does not close. The blue button turns lighter and then comes back dark blue. The pop up page should close and return back to the original page. To get off the page you need to press Cancel underneath the submit button. The record does save.
          </DocNote>
        </>
      )}

      {step === 6 && (
        <>
          <DocSection title="What is this?">
            <p>The Alerts panel shows sensor alerts when units go out of temperature range. Each alert shows the unit name, alert type, and timestamp. Alerts can be dismissed with the X button.</p>
          </DocSection>

          <DocSection title="Alert Behavior">
            <p>Out-of-range temperatures from data loggers or manual entry show in the alert panel and send push notifications. There needs to be the option to monitor the temperature or close the alert. If a corrective action has been submitted with the temperature, that alert should be closed and no further action is required.</p>
          </DocSection>

          <DocNote type="warning">
            <strong>[Figma: red]</strong> When an out of range temperature is taken from manual entry and the user has selected the corrective action, the out of range temperature shows in the alert panel and is sending push notifications. The alerts showing should be more data logger out of temperature reading alerts, or manual entries.
          </DocNote>
        </>
      )}
    </>
  );
}

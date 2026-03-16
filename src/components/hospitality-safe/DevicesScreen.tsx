"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/app/projects/hospitality-safe/page";

/* ─── data matching Figma exactly ─── */
const devices = [
  { name: "ChaTime Printer", type: "Label Printer", unit: "", connected: false },
  { name: "Cool Room", type: "Data Logger", unit: "Cool Room", connected: true },
  { name: "Freezer Room", type: "Data Logger", unit: "Freezer Room", connected: true },
  { name: "Grill U/B Fridge", type: "Data Logger", unit: "Grill U/B Fridge", connected: true },
  { name: "Ice cream Freezer 1", type: "Data Logger", unit: "Upright Freezer 1", connected: true },
  { name: "Larder U/B Fridge", type: "Data Logger", unit: "Larder U/B Fridge", connected: true },
  { name: "New Data Logger", type: "Data Logger", unit: "Pans / Fryer U/B Fridge", connected: true },
  { name: "Oasis Printer 1", type: "Label Printer", unit: "", connected: false },
  { name: "Pasta Draw Freezer", type: "Data Logger", unit: "Pasta draw Freezer", connected: true },
  { name: "Pasta Draw Fridge", type: "Data Logger", unit: "Pasta Draw Fridge", connected: true },
  { name: "Pasta U/B Fridge", type: "Data Logger", unit: "Pasta U/B fridge", connected: true },
  { name: "Pizza U/B Fridge", type: "Data Logger", unit: "Pizza u/B Fridge", connected: true },
  { name: "Thermapen 1", type: "Thermometer", unit: "", connected: false },
];

const tabs = ["All", "Data Logger", "Label Printer", "Thermometer"];

type View = "list" | "add-scan" | "add-scan-found" | "add-form-simple" | "add-logger-wifi" | "add-logger-details" | "edit" ;

export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("list");
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingDevice, setEditingDevice] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [addType, setAddType] = useState("");

  const stepMap: Record<View, number> = { list: 1, "add-scan": 2, "add-scan-found": 3, "add-form-simple": 4, "add-logger-wifi": 5, "add-logger-details": 6, edit: 7 };
  const go = (v: View) => { setView(v); onSubStepChange?.(stepMap[v]); };

  // Sync from parent (arrow keys / flow map prev/next)
  if (currentStep !== undefined) {
    const reverseMap: Record<number, View> = { 1: "list", 2: "add-scan", 3: "add-scan-found", 4: "add-form-simple", 5: "add-logger-wifi", 6: "add-logger-details", 7: "edit" };
    const expected = reverseMap[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  const filtered = devices.filter((d) => {
    if (activeTab !== "All" && d.type !== activeTab) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ── Add Thermometer/Label Printer: Bluetooth Scan (modal over list) ── */
  if (view === "add-scan") {
    return (
      <ModalOverList>
        <h2 className="text-[12px] font-bold text-[#333] text-center mb-1">Add Device</h2>
        <p className="text-[8px] text-[#666] text-center mb-3">Select the device you would like to register.</p>
        <p className="text-[7px] text-[#333] mb-2">Enter the first three digits of the Serial Number on the device.</p>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-[#D1D5DB] bg-white mb-3">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input type="text" placeholder="Search..." className="flex-1 text-[8px] text-[#333] outline-none bg-transparent" />
        </div>
        <p className="text-[8px] text-[#666] text-center mb-1">Scanning for bluetooth devices... <span className="inline-block animate-spin text-[10px]">⟳</span></p>
        <p className="text-[7px] text-[#4A5FC1] text-center underline mb-3 cursor-pointer">If your device isn&apos;t showing, click here, then contact an admin for help.</p>
        <div className="flex gap-2">
          <button onClick={() => go("list")} className="flex-1 py-1.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[8px] font-semibold cursor-pointer">Cancel</button>
          <button onClick={() => go("add-scan-found")} className="flex-1 py-1.5 rounded text-white text-[8px] font-semibold cursor-pointer opacity-60" style={{ background: "#4A5FC1" }}>Continue</button>
        </div>
      </ModalOverList>
    );
  }

  /* ── Bluetooth Scan: Device Found ── */
  if (view === "add-scan-found") {
    return (
      <ModalOverList>
        <h2 className="text-[12px] font-bold text-[#333] text-center mb-1">Add Device</h2>
        <p className="text-[8px] text-[#666] text-center mb-3">Select the device you would like to register.</p>
        {/* Found device */}
        <div className="flex items-center gap-2 px-3 py-2 rounded border-2 border-[#4A5FC1] bg-[#4A5FC1]/5 mb-3">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4A5FC1" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
          <span className="text-[9px] text-[#333]">22026869Thermapen</span>
        </div>
        <p className="text-[8px] text-[#666] text-center mb-1">Scanning for bluetooth devices... <span className="inline-block animate-spin text-[10px]">⟳</span></p>
        <p className="text-[7px] text-[#4A5FC1] text-center underline mb-3 cursor-pointer">If your device isn&apos;t showing, click here, then contact an admin for help.</p>
        <div className="flex gap-2">
          <button onClick={() => go("list")} className="flex-1 py-1.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[8px] font-semibold cursor-pointer">Cancel</button>
          <button onClick={() => go("add-form-simple")} className="flex-1 py-1.5 rounded text-white text-[8px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Continue</button>
        </div>
      </ModalOverList>
    );
  }

  /* ── Add Thermometer/Printer: Simple Name + Type Form (modal) ── */
  if (view === "add-form-simple") {
    return (
      <ModalOverList>
        <h2 className="text-[12px] font-bold text-[#333] text-center mb-1">Add Device</h2>
        <p className="text-[8px] text-[#666] text-center mb-4">Enter the details for the device.</p>
        <div className="mb-3">
          <div className="text-[8px] text-[#333] font-medium mb-1">Device Name</div>
          <input type="text" placeholder="e.g. Thermometer 1" className="w-full px-3 py-2 rounded border border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-white" />
        </div>
        <div className="mb-4">
          <div className="text-[8px] text-[#333] font-medium mb-1">Device Type</div>
          <select className="w-full px-3 py-2 rounded border border-[#D1D5DB] text-[9px] text-[#999] outline-none bg-white appearance-none">
            <option value="">Select an item...</option>
            <option>Thermometer</option>
            <option>Label Printer</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => go("list")} className="flex-1 py-1.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[8px] font-semibold cursor-pointer">Cancel</button>
          <button onClick={() => go("list")} className="flex-1 py-1.5 rounded text-white text-[8px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Create</button>
        </div>
      </ModalOverList>
    );
  }

  /* ── Add Data Logger Step 1: WiFi Setup Wizard ── */
  if (view === "add-logger-wifi") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex justify-end px-3 pt-2 shrink-0">
          <button onClick={() => go("list")} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer">Cancel</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-1 pb-4">
          <h2 className="text-[13px] font-bold text-[#333] text-center mb-0.5">Add Device</h2>
          <p className="text-[8px] text-[#888] text-center mb-3">Let&apos;s get your wifi device set up.</p>

          {/* Step 1 */}
          <p className="text-[8px] text-[#333] mb-2">Step 1: Hold down both buttons on the wifi device until the screen shows &ldquo;Set Up&rdquo;.</p>
          <div className="flex justify-center mb-2">
            <div className="bg-[#F5F5F5] rounded px-4 py-2 text-center">
              <div className="text-[8px] font-bold text-[#333]">ThermaData® WiFi</div>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-[#E74C3C] text-white font-bold">START</span>
                <span className="w-2 h-2 rounded-full bg-[#27AE60]" />
                <span className="w-2 h-2 rounded-full bg-[#E74C3C]" />
                <span className="text-[7px] px-1.5 py-0.5 rounded bg-[#F39C12] text-white font-bold">MAX MIN</span>
              </div>
              <div className="text-[6px] text-[#666] mt-0.5">ACTIVE &nbsp; ALARM</div>
              <div className="text-[7px] font-bold text-[#333] mt-1">Press and hold</div>
            </div>
          </div>

          {/* Step 2 */}
          <p className="text-[8px] text-[#333] mb-2">Step 2: Go to your Wifi Networks, and connect to the Device Network (with a name like &ldquo;ThermaData00000&rdquo;).</p>
          <div className="flex justify-center mb-2">
            <div className="bg-[#F5F5F5] rounded px-3 py-1.5 text-[7px] w-[160px]">
              <div className="flex items-center gap-1 mb-1"><span className="text-[#4A5FC1]">‹ Settings</span> <span className="font-bold">Wi-Fi</span></div>
              <div className="flex items-center justify-between border-b border-[#ddd] py-0.5">
                <span>Wi-Fi</span><span className="w-3 h-1.5 rounded-full bg-[#27AE60]" />
              </div>
              <div className="flex items-center gap-1 py-0.5">
                <span className="text-[#4A5FC1]">✓</span>
                <div><span className="text-[7px]">ThermaData WiFi D17061188</span><br /><span className="text-[6px] text-[#999]">Security Recommendation</span></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <p className="text-[8px] text-[#333] mb-3">Step 3: Once connected to the new Network, enter the details of the Wifi Network you want your new Device to connect to.</p>

          <FormRow label="Wifi Network" placeholder="e.g. Optus_11AA1F" hint="This is the name of the wifi network" />
          <FormRow label="Security Type" value="WPA2" type="select" hint="Most networks use WPA2." />
          <FormRow label="Security Key" placeholder="••••••••" hint="This is the password of the wifi network" showToggle />
          <FormRow label="Serial Number" placeholder="e.g. A11020131" hint="This is a combination of letters and numbers, typically on the back of the device." />

          <div className="flex gap-2 mt-4">
            <button onClick={() => go("list")} className="flex-1 py-2 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[9px] font-semibold cursor-pointer">Cancel</button>
            <button onClick={() => go("add-logger-details")} className="flex-1 py-2 rounded text-white text-[9px] font-semibold cursor-pointer opacity-80" style={{ background: "#4A5FC1" }}>Save Configuration</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Add Data Logger Step 2: Device Details Form ── */
  if (view === "add-logger-details") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex justify-end px-3 pt-2 shrink-0">
          <button onClick={() => go("list")} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer">Cancel</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-4">
          <h2 className="text-[13px] font-bold text-[#333] text-center mb-0.5">Add Device</h2>
          <p className="text-[8px] text-[#888] text-center mb-4">Enter the details for the device.</p>
          <CenteredField label="Serial Number" placeholder="e.g. A11020131" value="D23420271" />
          <CenteredField label="Connection Key" placeholder="e.g. 93FE965D" value="93FE965D" hint="The connection key is found on the back of your device." />
          <CenteredField label="Device Name" placeholder="e.g. Pan's Fridge" value="Pan's Fridge" />
          <div className="mb-4">
            <div className="text-[9px] text-[#333] font-medium text-center mb-1">Unit</div>
            <select className="w-full px-3 py-2 rounded border border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-white appearance-none">
              <option>Pans / Fryer U/B Fridge</option>
              <option>Cool Room</option>
              <option>Freezer Room</option>
              <option>Grill U/B Fridge</option>
            </select>
            <p className="text-[7px] text-[#4A5FC1] italic mt-1">This is the unit the data logger is measuring.</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => go("add-logger-wifi")} className="flex-1 py-2 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[9px] font-semibold cursor-pointer">Cancel</button>
            <button onClick={() => go("list")} className="flex-1 py-2 rounded text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Create</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Edit Device ── */
  if (view === "edit") {
    return (
      <div className="h-full flex flex-col bg-white relative">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div>
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Edit Device</h2>
            <p className="text-[7px] text-[#888]">Update the details of this device.</p>
          </div>
          <BtnFill label="Cancel" color="#4A5FC1" onClick={() => go("list")} />
        </div>
        <div className="h-[2px] shrink-0" style={{ background: "#4A5FC1" }} />
        <div className="flex-1 overflow-y-auto" style={{ background: "#f0f0f0" }}>
          <div className="bg-white px-4 pt-4 pb-3 mt-0">
            <div className="text-[9px] text-[#333] font-medium mb-1">Device Name</div>
            <input type="text" placeholder="e.g. Thermometer 1" defaultValue={editingDevice} className="w-full px-3 py-2.5 rounded border border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-white" />
          </div>
          <div className="px-4 py-3 bg-white">
            <button className="w-full py-2.5 rounded text-white text-[10px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Save</button>
          </div>
          <div className="h-[2px]" style={{ background: "#4A5FC1" }} />
          <div className="flex justify-center py-3">
            <button onClick={() => setShowDelete(true)} className="px-8 py-1.5 rounded text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#E74C3C" }}>Delete</button>
          </div>
          <div className="h-[2px]" style={{ background: "#4A5FC1" }} />
        </div>
        {/* Delete modal */}
        {showDelete && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl p-4 text-center" style={{ width: 180 }}>
              <h3 className="text-[10px] font-bold text-[#333] mb-1">Warning!</h3>
              <p className="text-[8px] text-[#666] mb-3">Are you sure you want to delete this device?</p>
              <div className="flex justify-center gap-6">
                <button onClick={() => setShowDelete(false)} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer">Cancel</button>
                <button onClick={() => { setShowDelete(false); go("list"); }} className="text-[9px] text-[#E74C3C] font-medium cursor-pointer">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Device List ── */
  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Page header */}
      <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
        <BtnFill label="Back" onClick={() => onNavigateScreen?.("admin-login")} />
        <div className="text-center flex-1">
          <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Devices</h2>
          <p className="text-[7px] text-[#888]">Manage devices registered for this location.</p>
        </div>
        <div className="relative">
          <BtnFill label="Add" onClick={() => setShowAddMenu(!showAddMenu)} />
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-[#E4E7EE] p-2 z-20 w-[110px]">
              {[
                { label: "Add Thermometer", action: () => { setAddType("Thermometer"); setShowAddMenu(false); go("add-scan"); } },
                { label: "Add Label Printer", action: () => { setAddType("Label Printer"); setShowAddMenu(false); go("add-scan"); } },
                { label: "Add Data Logger", action: () => { setShowAddMenu(false); go("add-logger-wifi"); } },
              ].map((item) => (
                <button key={item.label} onClick={item.action} className="w-full px-2 py-1.5 rounded text-white text-[8px] font-semibold cursor-pointer mb-1" style={{ background: "#4A5FC1" }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="h-[2px] shrink-0" style={{ background: "#4A5FC1" }} />

      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-white">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 text-[9px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 px-3 pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-1.5 rounded-lg text-[8px] font-semibold cursor-pointer" style={{ background: activeTab === tab ? "#4A5FC1" : "white", color: activeTab === tab ? "white" : "#4A5FC1", border: `1px solid ${activeTab === tab ? "#4A5FC1" : "#D1D5DB"}` }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="h-[1px] bg-[#E4E7EE]" />

        {/* Rows */}
        {filtered.map((d, i) => (
          <div key={i} className="flex items-center px-3 py-2.5 border-b border-[#F0F0F0]">
            <span className="text-[9px] text-[#333] w-[30%]">{d.name}</span>
            <span className="text-[9px] text-[#666] w-[25%]">{d.type}</span>
            <span className="text-[9px] text-[#333] w-[30%] flex items-center gap-1">
              {d.unit && <span className="w-[6px] h-[6px] rounded-sm shrink-0" style={{ background: d.connected ? "#27AE60" : "#E74C3C" }} />}
              {d.unit}
            </span>
            <div className="w-[15%] flex justify-end">
              <button onClick={() => { setEditingDevice(d.name); go("edit"); }} className="px-2.5 py-0.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[7px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">Edit</button>
            </div>
          </div>
        ))}
        <div className="h-16" style={{ background: "#f0f0f0" }} />
      </div>
    </div>
  );
}

/* ─── Shared UI ─── */
function BtnFill({ label, color, onClick }: { label: string; color?: string; onClick?: () => void }) {
  return <button onClick={onClick} className="px-3 py-1 rounded text-white text-[8px] font-semibold cursor-pointer shrink-0" style={{ background: color || "#4A5FC1" }}>{label}</button>;
}

function FormRow({ label, placeholder, value, hint, type, showToggle }: { label: string; placeholder?: string; value?: string; hint?: string; type?: string; showToggle?: boolean }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <label className="text-[8px] text-[#333] font-medium w-[70px] shrink-0">{label}</label>
        <div className="flex-1 relative">
          {type === "select" ? (
            <select className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none" defaultValue={value}>
              <option>WPA2</option><option>WPA3</option><option>WEP</option>
            </select>
          ) : (
            <input type={showToggle ? "password" : "text"} placeholder={placeholder} defaultValue={value} className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          )}
          {showToggle && <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-[#4A5FC1] font-medium cursor-pointer">Show</span>}
        </div>
      </div>
      {hint && <p className="text-[7px] text-[#4A5FC1] italic mt-0.5 ml-[82px]">{hint}</p>}
    </div>
  );
}

function CenteredField({ label, placeholder, value, hint }: { label: string; placeholder?: string; value?: string; hint?: string }) {
  return (
    <div className="mb-3">
      <div className="text-[9px] text-[#333] font-medium text-center mb-1">{label}</div>
      <input type="text" placeholder={placeholder} defaultValue={value} className="w-full px-3 py-2 rounded border border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-[#F5F6FA]" />
      {hint && <p className="text-[7px] text-[#4A5FC1] italic mt-1">{hint}</p>}
    </div>
  );
}

function ModalOverList({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center" style={{ background: "rgba(240,240,243,0.95)" }}>
      <div className="bg-white rounded-xl p-5 shadow-lg" style={{ width: 260 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Device List */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>All registered devices for this location. Filter by type using the tabs. Search works. Green square means connected.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Tabs: All, Data Logger, Label Printer, Thermometer</li>
          <li>Press <strong>Add</strong> to register a new device</li>
          <li>Press <strong>Edit</strong> on any row to change it</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Devices page divided into tabs. Search bar works.</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: BT Scan */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Scanning for Bluetooth devices nearby. Wait for your device to appear in the list.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Enter the first 3 digits of the serial number to filter</li>
          <li>If your device does not show, tap the help link</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 3: Device Found */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>Device found! Select it and press Continue to name it.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>The found device shows with a checkmark</li>
          <li>Press Continue to go to the name and type form</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 4: Name + Type Form */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>Give the device a name and pick its type (Thermometer or Label Printer).</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Type a friendly name like &ldquo;Thermometer 1&rdquo;</li>
          <li>Select the device type from the dropdown</li>
        </ul>
      </DocSection>
    </>
  );

  /* Step 5: WiFi Setup */
  if (step === 5) return (
    <>
      <DocSection title="What is this?">
        <p>WiFi data logger setup. Follow the 3 steps to connect the device to your network.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Hold both buttons on the device until it says &ldquo;Set Up&rdquo;</li>
          <li>Connect your phone/tablet to the device&apos;s WiFi network</li>
          <li>Enter your real WiFi details so the device can connect</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>The user will select the Unit the device is linked to from a list added in Units settings.</Annotation>
      </DocSection>
    </>
  );

  /* Step 6: Logger Details */
  if (step === 6) return (
    <>
      <DocSection title="What is this?">
        <p>Enter the data logger&apos;s serial number, connection key, name, and which unit it monitors.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Serial number and connection key are on the back of the device</li>
          <li>Pick which unit (fridge/freezer) this logger measures</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>Connection key is found on the back of the device.</Annotation>
      </DocSection>
    </>
  );

  /* Step 7: Edit Device */
  return (
    <>
      <DocSection title="What is this?">
        <p>Edit or delete a device. Currently the name field shows blank even if previously set.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li>Change the device name and press Save</li>
          <li>Or press Delete to remove the device</li>
        </ul>
      </DocSection>
      <DocSection title="Annotations">
        <Annotation>No data shown on edit page despite being previously entered (bug).</Annotation>
        <Annotation>Name doesn&apos;t save when edited (bug).</Annotation>
      </DocSection>
      <DocNote type="warning">
        Edit page is broken — shows no existing data and saving doesn&apos;t work.
      </DocNote>
    </>
  );
}

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] text-slate-500 pl-2" style={{ borderLeft: "2px solid #4A5FC1" }}>
      <span className="text-[8px] text-[#4A5FC1] font-medium mr-1">Figma:</span>{children}
    </div>
  );
}

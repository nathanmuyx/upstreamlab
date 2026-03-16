"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type SettingsTab = "general" | "areas" | "units" | "devices" | "users" | "notifications";

const settingsTabs: { id: SettingsTab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "areas", label: "Areas" },
  { id: "units", label: "Units" },
  { id: "devices", label: "Devices" },
  { id: "users", label: "Users" },
  { id: "notifications", label: "Notifications" },
];

/* ─── data matching actual client app ─── */
const areas = [
  { name: "Bar" },
  { name: "Fryer" },
  { name: "Grill" },
  { name: "Larder" },
  { name: "Main Area" },
  { name: "Pans" },
  { name: "Pasta" },
  { name: "Pizza" },
];

const foodCategories = [
  {
    name: "Cocktail Preps",
    foods: ["Banana negroni mix", "Coffee", "Cucunation mix", "Mango mix", "Passionfruit Sour Mix", "Rockmelon cardamom mix", "Rose Vanilla Mix", "Salumi meat", "Simple syrup"],
  },
  {
    name: "Dairy",
    foods: ["Buffalo Cheese", "Buffalo _ Cut", "Burrata", "Butter cut", "Chilli Butter"],
  },
  {
    name: "Vegetables",
    foods: ["Mushrooms", "Olives", "Orange segments", "Pea Puree", "Pea purée", "Porcini Muchrooms", "Pumpkin purée", "Red Oak Lettuce", "Roast Pumpkin", "Sautéed Mushroom", "Sautéed Peas & Onion", "Slow Cooked Onion 500g", "Spicy Cabbage", "Zucchini", "Zucchini & Eggplant", "Zucchini Purée"],
  },
];

const unitNames = [
  "Cool Room", "Freezer Room", "Grill U/B Fridge", "Keg Room", "Larder U/B Fridge",
  "Pans / Fryer U/B Fridge", "Pasta draw Freezer", "Pasta Draw Fridge", "Pasta U/B Fridge",
  "Pizza u/B Fridge", "Upright Freezer 1", "Upright freezer 2",
];

type AreaView = "list" | "add" | "view" | "manage-foods" | "manage-units";

const units = [
  { name: "Coolroom 1", type: "Coolroom", minTemp: "0°C", maxTemp: "5°C", schedule: "Every 2 hrs", area: "Kitchen" },
  { name: "Coolroom 2", type: "Coolroom", minTemp: "0°C", maxTemp: "5°C", schedule: "Every 2 hrs", area: "Kitchen" },
  { name: "Freezer 1", type: "Freezer", minTemp: "-25°C", maxTemp: "-18°C", schedule: "Every 4 hrs", area: "Kitchen" },
  { name: "Freezer 2", type: "Freezer", minTemp: "-25°C", maxTemp: "-18°C", schedule: "Every 4 hrs", area: "Pastry" },
  { name: "Fridge 1", type: "Fridge", minTemp: "0°C", maxTemp: "5°C", schedule: "Every 2 hrs", area: "Bar" },
  { name: "Hot Display", type: "Hot Hold", minTemp: "60°C", maxTemp: "80°C", schedule: "Every 1 hr", area: "Front of House" },
];

const users = [
  { name: "Sarah Chen", initials: "SC", role: "Manager", areas: "All Areas", pinStatus: "Active" },
  { name: "James Liu", initials: "JL", role: "Team Leader", areas: "Kitchen, Grill", pinStatus: "Active" },
  { name: "Emily Tran", initials: "ET", role: "Staff", areas: "Bar, Front of House", pinStatus: "Active" },
  { name: "David Park", initials: "DP", role: "Staff", areas: "Kitchen, Pastry", pinStatus: "Not Set" },
];

const roleBadgeColor: Record<string, { bg: string; text: string }> = {
  Manager: { bg: "#EBF5FF", text: "#2E75B6" },
  "Team Leader": { bg: "#E8F8EF", text: "#27AE60" },
  Staff: { bg: "#FFF8E1", text: "#F39C12" },
};

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="p-5">
      {selectedArea !== "All Areas" && (
        <div className="mb-3 text-[11px] text-[#2E75B6] font-medium">
          Filtered: {selectedArea}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-[#E4E7EE] mb-5">
        {settingsTabs.map((tab) => (
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

      {/* Tab content */}
      {activeTab === "general" && <GeneralTab />}
      {activeTab === "areas" && <AreasTab />}
      {activeTab === "units" && <UnitsTab />}
      {activeTab === "devices" && <DevicesTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "notifications" && <NotificationsTab />}
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-5 max-w-[500px]">
      <h3 className="text-[13px] font-semibold text-[#333] mb-4">Business Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-[#666] mb-1">Business Name</label>
          <input type="text" defaultValue="The Grand Sydney" className="w-full px-3 py-2 rounded-md border border-[#E4E7EE] bg-white text-[13px] text-[#333] outline-none focus:border-[#2E75B6]" readOnly />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#666] mb-1">Location Name</label>
          <input type="text" defaultValue="Main Kitchen – Sydney CBD" className="w-full px-3 py-2 rounded-md border border-[#E4E7EE] bg-white text-[13px] text-[#333] outline-none focus:border-[#2E75B6]" readOnly />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#666] mb-1">Address</label>
          <input type="text" defaultValue="123 George Street, Sydney NSW 2000" className="w-full px-3 py-2 rounded-md border border-[#E4E7EE] bg-white text-[13px] text-[#333] outline-none focus:border-[#2E75B6]" readOnly />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#666] mb-1">Logo</label>
          <div className="w-full h-[80px] rounded-md border-2 border-dashed border-[#E4E7EE] bg-[#F9FAFB] flex items-center justify-center text-[12px] text-[#999] cursor-pointer hover:border-[#2E75B6] hover:bg-[#EBF5FF] transition-colors">
            <div className="text-center">
              <div className="text-[20px] mb-1">+</div>
              <div>Click to upload logo</div>
            </div>
          </div>
        </div>
        <button className="w-full py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AreasTab() {
  const [view, setView] = useState<AreaView>("list");
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set(["Mango mix"]));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["Cocktail Preps"]));
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set(["Grill U/B Fridge", "Pasta draw Freezer"]));
  const [areaName, setAreaName] = useState("Area 1");

  const toggleFood = (food: string) => {
    const next = new Set(selectedFoods);
    if (next.has(food)) next.delete(food); else next.add(food);
    setSelectedFoods(next);
  };

  const toggleCategory = (cat: string) => {
    const nextCats = new Set(selectedCategories);
    const nextFoods = new Set(selectedFoods);
    const category = foodCategories.find((c) => c.name === cat);
    if (nextCats.has(cat)) {
      nextCats.delete(cat);
      category?.foods.forEach((f) => nextFoods.delete(f));
    } else {
      nextCats.add(cat);
      category?.foods.forEach((f) => nextFoods.add(f));
    }
    setSelectedCategories(nextCats);
    setSelectedFoods(nextFoods);
  };

  const toggleUnit = (unit: string) => {
    const next = new Set(selectedUnits);
    if (next.has(unit)) next.delete(unit); else next.add(unit);
    setSelectedUnits(next);
  };

  /* ── Areas List ── */
  if (view === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-bold text-[#2E75B6]">Areas</h3>
            <p className="text-[11px] text-[#666] mt-0.5">Manage areas for this location.</p>
          </div>
          <button onClick={() => setView("add")} className="px-5 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
            Add
          </button>
        </div>
        <div className="mt-4 border-t border-[#E4E7EE]">
          {areas.map((area) => (
            <div key={area.name} className="flex items-center justify-between py-3 border-b border-[#F0F0F0]">
              <span className="text-[13px] text-[#333] font-medium">{area.name}</span>
              <button
                onClick={() => { setAreaName(area.name); setView("view"); }}
                className="px-4 py-1.5 rounded-lg border border-[#2E75B6] text-[#2E75B6] text-[12px] font-medium cursor-pointer hover:bg-[#2E75B6]/5 transition-colors"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Add Area ── */
  if (view === "add") {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-bold text-[#2E75B6]">Add Area</h3>
            <p className="text-[11px] text-[#666] mt-0.5">Enter details to add a new area.</p>
          </div>
          <button onClick={() => setView("list")} className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#E74C3C" }}>
            Cancel
          </button>
        </div>
        <div className="mt-6 border-t border-[#E4E7EE] pt-6">
          <div className="flex items-center gap-16 mb-8">
            <label className="text-[13px] text-[#333] font-medium w-[80px] shrink-0">Name</label>
            <input type="text" placeholder="e.g. Pizza Section" className="flex-1 px-3 py-2 border-b border-[#E4E7EE] text-[13px] text-[#333] outline-none focus:border-[#2E75B6] bg-transparent" />
          </div>
          <div className="border-t border-[#E4E7EE] pt-6">
            <div className="flex items-start gap-16">
              <label className="text-[13px] text-[#333] font-medium w-[80px] shrink-0 pt-8">Photo (optional)</label>
              <div className="w-[200px] h-[160px] rounded-lg border-2 border-dashed border-[#E4E7EE] bg-[#F9FAFB] flex items-center justify-center cursor-pointer hover:border-[#2E75B6] transition-colors">
                <div className="text-center text-[12px] text-[#2E75B6] font-medium">Add Photo</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <button onClick={() => setView("list")} className="px-12 py-3 rounded-lg text-white text-[14px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#2E75B6" }}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View Area ── */
  if (view === "view") {
    const linkedFoodCategories = foodCategories
      .map((cat) => ({
        ...cat,
        foods: cat.foods.filter((f) => selectedFoods.has(f)),
      }))
      .filter((cat) => selectedCategories.has(cat.name) || cat.foods.length > 0);

    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => setView("list")} className="px-4 py-1.5 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#2E75B6" }}>
            Back
          </button>
          <div className="text-center">
            <h3 className="text-[15px] font-bold text-[#2E75B6]">View Area</h3>
            <p className="text-[11px] text-[#666]">The details of this area.</p>
          </div>
          <button className="px-4 py-1.5 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#2E75B6" }}>
            Edit
          </button>
        </div>

        {/* Name */}
        <div className="flex items-center justify-between py-3 mt-4 border-t border-b border-[#E4E7EE]">
          <span className="text-[12px] text-[#666]">Name</span>
          <span className="text-[13px] text-[#333] font-medium">{areaName}</span>
        </div>

        {/* Foods */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-[#666]">Foods</span>
            <button onClick={() => setView("manage-foods")} className="text-[12px] text-[#2E75B6] font-medium cursor-pointer hover:underline">
              Manage Foods
            </button>
          </div>
          {linkedFoodCategories.length === 0 ? (
            <p className="text-[11px] text-[#999] italic py-2">No foods assigned to this area...</p>
          ) : (
            linkedFoodCategories.map((cat) => (
              <div key={cat.name} className="mb-3">
                <div className="px-3 py-2 rounded-md text-[12px] text-white font-medium" style={{ background: "#2E75B6" }}>
                  {cat.name}
                </div>
                {cat.foods.map((food) => (
                  <div key={food} className="px-4 py-2 border-b border-[#F0F0F0] text-[12px] text-[#333]">{food}</div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Units */}
        <div className="mt-6 border-t border-[#E4E7EE] pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-[#666]">Units</span>
            <button onClick={() => setView("manage-units")} className="text-[12px] text-[#2E75B6] font-medium cursor-pointer hover:underline">
              Manage Units
            </button>
          </div>
          {selectedUnits.size === 0 ? (
            <p className="text-[11px] text-[#999] italic py-2">No units assigned to this area...</p>
          ) : (
            [...selectedUnits].map((unit) => (
              <div key={unit} className="px-4 py-2 border-b border-[#F0F0F0] text-[12px] text-[#333]">{unit}</div>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ── Manage Foods ── */
  if (view === "manage-foods") {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-bold text-[#2E75B6]">Edit Area Foods</h3>
            <p className="text-[11px] text-[#666] mt-0.5">Manage the food categories and products assigned to this area.</p>
          </div>
          <button onClick={() => setView("view")} className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#E74C3C" }}>
            Cancel
          </button>
        </div>

        <div className="mt-4 border-t border-[#E4E7EE] pt-3">
          <div className="flex items-center gap-2 text-[12px] text-[#333] font-semibold mb-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2E75B6] flex items-center justify-center cursor-pointer">
              <span className="text-[10px] text-[#2E75B6]">✕</span>
            </div>
            Food Category / Food Product Name
          </div>

          {foodCategories.map((cat) => (
            <div key={cat.name}>
              {/* Category row */}
              <div
                onClick={() => toggleCategory(cat.name)}
                className={`flex items-center gap-3 py-2.5 px-3 cursor-pointer border border-[#E4E7EE] rounded-md mb-0.5 ${
                  selectedCategories.has(cat.name) ? "bg-[#2E75B6]/5 border-[#2E75B6]" : "hover:bg-[#F9FAFB]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedCategories.has(cat.name) ? "border-[#2E75B6] bg-[#2E75B6]" : "border-[#ccc]"
                }`}>
                  {selectedCategories.has(cat.name) && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
                <span className="text-[13px] text-[#333] font-semibold">{cat.name}</span>
              </div>

              {/* Food items indented */}
              <div className="ml-5">
                {cat.foods.map((food) => (
                  <div
                    key={food}
                    onClick={() => toggleFood(food)}
                    className={`flex items-center gap-3 py-2 px-3 cursor-pointer border border-[#E4E7EE] rounded-md mb-0.5 ${
                      selectedFoods.has(food) ? "bg-[#2E75B6]/5 border-[#2E75B6]" : "hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedFoods.has(food) ? "border-[#2E75B6] bg-[#2E75B6]" : "border-[#ccc]"
                    }`}>
                      {selectedFoods.has(food) && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                    <span className="text-[12px] text-[#333]">{food}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Save button at bottom (UX issue noted) */}
          <div className="mt-6 flex justify-end">
            <button onClick={() => setView("view")} className="px-12 py-3 rounded-lg text-white text-[14px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#2E75B6" }}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Manage Units ── */
  if (view === "manage-units") {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-[15px] font-bold text-[#2E75B6]">Edit Area Units</h3>
            <p className="text-[11px] text-[#666] mt-0.5">Manage the units assigned to this area.</p>
          </div>
          <button onClick={() => setView("view")} className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#E74C3C" }}>
            Cancel
          </button>
        </div>

        <div className="mt-4 border-t border-[#E4E7EE] pt-3">
          <div className="flex items-center gap-2 text-[12px] text-[#333] font-semibold mb-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2E75B6] flex items-center justify-center cursor-pointer">
              <span className="text-[10px] text-[#2E75B6]">✕</span>
            </div>
            Unit Name
          </div>

          {unitNames.map((unit) => (
            <div
              key={unit}
              onClick={() => toggleUnit(unit)}
              className={`flex items-center gap-3 py-2.5 px-3 cursor-pointer border border-[#E4E7EE] rounded-md mb-0.5 ${
                selectedUnits.has(unit) ? "bg-[#2E75B6]/5 border-[#2E75B6]" : "hover:bg-[#F9FAFB]"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedUnits.has(unit) ? "border-[#2E75B6] bg-[#2E75B6]" : "border-[#ccc]"
              }`}>
                {selectedUnits.has(unit) && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <span className="text-[12px] text-[#333]">{unit}</span>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <button onClick={() => setView("view")} className="px-12 py-3 rounded-lg text-white text-[14px] font-semibold cursor-pointer hover:opacity-90" style={{ background: "#2E75B6" }}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function UnitsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#333]">Temperature Units</h3>
        <button className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Add Unit
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-3 py-2.5 font-medium">Name</th>
              <th className="text-left px-3 py-2.5 font-medium">Type</th>
              <th className="text-left px-3 py-2.5 font-medium">Min Temp</th>
              <th className="text-left px-3 py-2.5 font-medium">Max Temp</th>
              <th className="text-left px-3 py-2.5 font-medium">Schedule</th>
              <th className="text-left px-3 py-2.5 font-medium">Area</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => (
              <tr key={u.name} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                <td className="px-3 py-2 font-medium text-[#333]">{u.name}</td>
                <td className="px-3 py-2 text-[#666]">{u.type}</td>
                <td className="px-3 py-2 text-[#2E75B6] font-medium">{u.minTemp}</td>
                <td className="px-3 py-2 text-[#E74C3C] font-medium">{u.maxTemp}</td>
                <td className="px-3 py-2 text-[#666]">{u.schedule}</td>
                <td className="px-3 py-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F6FA] text-[#666] font-medium">{u.area}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DevicesTab() {
  return (
    <div className="space-y-3">
      <h3 className="text-[13px] font-semibold text-[#333] mb-2">Connected Devices</h3>
      {[
        { name: "Gateway Hub 1", type: "IoT Gateway", status: "Connected", statusColor: "#27AE60", lastSeen: "Just now" },
        { name: "Bluetooth Thermometer", type: "Thermometer", status: "Connected", statusColor: "#27AE60", lastSeen: "2 min ago" },
        { name: "Brother QL-820NWB", type: "Label Printer", status: "Connected", statusColor: "#27AE60", lastSeen: "5 min ago" },
        { name: "Fridge 2 Sensor", type: "Auto Sensor", status: "Disconnected", statusColor: "#E74C3C", lastSeen: "45 min ago" },
      ].map((d) => (
        <div key={d.name} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.statusColor }} />
            <div>
              <div className="text-[13px] font-semibold text-[#333]">{d.name}</div>
              <div className="text-[11px] text-[#666] mt-0.5">{d.type} &middot; Last seen: {d.lastSeen}</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: d.status === "Connected" ? "#E8F8EF" : "#FDE8E8", color: d.statusColor }}>
            {d.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-[#333]">Users</h3>
        <button className="px-4 py-2 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Add User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-3 py-2.5 font-medium">Name</th>
              <th className="text-left px-3 py-2.5 font-medium">Role</th>
              <th className="text-left px-3 py-2.5 font-medium">Areas</th>
              <th className="text-left px-3 py-2.5 font-medium">PIN Status</th>
              <th className="text-left px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const badge = roleBadgeColor[u.role] || { bg: "#F5F6FA", text: "#666" };
              return (
                <tr key={u.name} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2E75B6] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                        {u.initials}
                      </div>
                      <span className="font-medium text-[#333]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[#666]">{u.areas}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.pinStatus === "Active" ? "bg-[#E8F8EF] text-[#27AE60]" : "bg-[#FDE8E8] text-[#E74C3C]"}`}>
                      {u.pinStatus}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button className="text-[11px] px-2.5 py-1 rounded border border-[#2E75B6] text-[#2E75B6] hover:bg-[#2E75B6]/5 cursor-pointer transition-colors">
                        Edit
                      </button>
                      <button className="text-[11px] px-2.5 py-1 rounded border border-[#F39C12] text-[#F39C12] hover:bg-[#F39C12]/5 cursor-pointer transition-colors">
                        Reset PIN
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="max-w-[500px]">
      <h3 className="text-[13px] font-semibold text-[#333] mb-4">Notification Settings</h3>

      {/* Alert Types */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4 mb-4">
        <h4 className="text-[12px] font-semibold text-[#333] mb-3">Alert Types</h4>
        <div className="space-y-2.5">
          {[
            { label: "Temperature Out of Range", checked: true },
            { label: "Timer Expired", checked: true },
            { label: "Checklist Overdue", checked: true },
            { label: "Task Assigned", checked: true },
            { label: "Document Expiring", checked: true },
            { label: "Device Disconnected", checked: true },
            { label: "Staff Certificate Expiring", checked: false },
            { label: "Delivery Expected", checked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${item.checked ? "bg-[#2E75B6] border-[#2E75B6]" : "border-[#ccc]"}`}>
                {item.checked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-[#333]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4 mb-4">
        <h4 className="text-[12px] font-semibold text-[#333] mb-3">Notification Methods</h4>
        <div className="space-y-2.5">
          {[
            { label: "Push Notifications", checked: true, desc: "In-app and device push notifications" },
            { label: "SMS Alerts", checked: true, desc: "Text messages for critical alerts only" },
            { label: "Email Notifications", checked: false, desc: "Email summaries and alert digests" },
          ].map((item) => (
            <label key={item.label} className="flex items-start gap-3 cursor-pointer">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${item.checked ? "bg-[#2E75B6] border-[#2E75B6]" : "border-[#ccc]"}`}>
                {item.checked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-[12px] text-[#333] font-medium">{item.label}</span>
                <div className="text-[10px] text-[#999] mt-0.5">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
        Save Notification Settings
      </button>
    </div>
  );
}

/* ─── Docs ─── */
export function Docs() {
  return (
    <>
      <div className="mb-6">
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#2E75B6]">Documentation</span>
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Settings</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Settings module controls all configuration for a location &mdash; business details, operational areas, temperature units, connected devices, user management, and notification preferences.
        </p>
      </div>

      <DocSection title="General Settings">
        <p>Business-level configuration:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Business Name:</strong> Appears on reports, labels, and audit documents</li>
          <li><strong>Location Name:</strong> Identifies this specific site within a multi-location business</li>
          <li><strong>Address:</strong> Used for regulatory filings and delivery scheduling</li>
          <li><strong>Logo:</strong> Displayed on printed reports and labels</li>
        </ul>
      </DocSection>

      <DocSection title="Areas Configuration">
        <p>Areas allow a business to customise the app to their layout. Once created, an area acts as a <strong>filter</strong> across the entire app — only foods (labels), checklists, tasks, and temperature units relevant to that area will show to staff working in that section.</p>

        <h4 className="text-[12px] font-semibold text-[#333] mt-3 mb-1">Area Setup Flow</h4>
        <ol className="list-decimal pl-4 space-y-1">
          <li><strong>Create Area:</strong> Enter name (e.g. &ldquo;Pizza Section&rdquo;) + optional photo</li>
          <li><strong>View Area:</strong> Shows the area name, linked Foods (grouped by category), and linked Units</li>
          <li><strong>Manage Foods:</strong> Select food categories and/or individual foods from the business&apos;s food database to link to this area</li>
          <li><strong>Manage Units:</strong> Select temperature units (fridges, freezers, etc.) to link to this area</li>
        </ol>

        <h4 className="text-[12px] font-semibold text-[#333] mt-3 mb-1">How Food Selection Works</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>Foods are organised hierarchically: <strong>Category → Food Items</strong></li>
          <li>Selecting a category should select all foods within it</li>
          <li>Selecting an individual food should also mark its parent category</li>
          <li>Only selected foods/categories appear on the View Area page</li>
        </ul>

        <h4 className="text-[12px] font-semibold text-[#333] mt-3 mb-1">Area Dropdown</h4>
        <p>Areas appear in the global &ldquo;All Areas&rdquo; dropdown in the sidebar. Each area shows a small circle that can display the area photo.</p>
      </DocSection>

      <DocSection title="Known Bugs & Issues — Areas">
        <div className="space-y-2 mt-1">
          <div className="p-2.5 rounded-md bg-[#FDE8E8] border-l-3 border-[#E74C3C]" style={{ borderLeft: "3px solid #E74C3C" }}>
            <div className="text-[11px] font-bold text-[#E74C3C] mb-0.5">BUG: Category selection not cascading</div>
            <div className="text-[11px] text-[#666]">When a category is selected, all food within the category should be auto-selected. Currently the category gets a checkmark but individual foods remain unselected.</div>
          </div>
          <div className="p-2.5 rounded-md bg-[#FDE8E8] border-l-3 border-[#E74C3C]" style={{ borderLeft: "3px solid #E74C3C" }}>
            <div className="text-[11px] font-bold text-[#E74C3C] mb-0.5">BUG: View Area shows all foods</div>
            <div className="text-[11px] text-[#666]">The View Area page currently shows every food and category, even unselected ones. It should only display foods/categories that have been selected for the area.</div>
          </div>
          <div className="p-2.5 rounded-md bg-[#FFF8E1] border-l-3 border-[#F39C12]" style={{ borderLeft: "3px solid #F39C12" }}>
            <div className="text-[11px] font-bold text-[#F39C12] mb-0.5">REMOVE: Select/Deselect All button</div>
            <div className="text-[11px] text-[#666]">The &ldquo;Select All / Deselect All&rdquo; toggle button on both the Manage Foods and Manage Units pages should be removed.</div>
          </div>
          <div className="p-2.5 rounded-md bg-[#FFF8E1] border-l-3 border-[#F39C12]" style={{ borderLeft: "3px solid #F39C12" }}>
            <div className="text-[11px] font-bold text-[#F39C12] mb-0.5">UX: Save button location</div>
            <div className="text-[11px] text-[#666]">The Save button is at the bottom of Manage Foods/Units pages. With long food lists, users may not scroll down to find it. <strong>Options:</strong> auto-save changes, floating/sticky save button, or warn users about unsaved changes when navigating away.</div>
          </div>
          <div className="p-2.5 rounded-md bg-[#EBF5FF] border-l-3 border-[#2E75B6]" style={{ borderLeft: "3px solid #2E75B6" }}>
            <div className="text-[11px] font-bold text-[#2E75B6] mb-0.5">QUESTION: Area photos usefulness</div>
            <div className="text-[11px] text-[#666]">Areas can have photos added, but the circle in the area dropdown is very small — you can&apos;t really see the image. Is this feature relevant or should it be removed?</div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Unit Setup">
        <p>Temperature units represent physical equipment that needs monitoring:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Min/Max Temp:</strong> Safe temperature range. Readings outside this range trigger alerts</li>
          <li><strong>Schedule:</strong> How frequently temperature checks are required</li>
          <li><strong>Area:</strong> Which operational area the unit belongs to</li>
          <li><strong>Monitoring Type:</strong> Auto (IoT sensor) or Manual (staff-recorded)</li>
        </ul>
      </DocSection>

      <DocSection title="Manual Entry Toggle">
        <p>Each unit can be configured for automatic or manual temperature recording:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Auto:</strong> IoT sensors continuously monitor and log temperatures. Staff see readings but don&apos;t need to manually record</li>
          <li><strong>Manual:</strong> Staff must physically check the temperature (using a Bluetooth or analog thermometer) and log the reading</li>
          <li><strong>Hybrid:</strong> Auto sensors provide continuous data, but staff are still required to perform manual spot-checks at scheduled intervals</li>
        </ul>
      </DocSection>

      <DocSection title="Notification Configuration">
        <p>Notifications can be configured per alert type and delivery method:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Push:</strong> In-app notifications appear in the bell icon and as device push notifications</li>
          <li><strong>SMS:</strong> Text messages sent to the user&apos;s registered phone number. Best for critical alerts when staff may not be actively using the app</li>
          <li><strong>Email:</strong> Email notifications for digest summaries and non-urgent alerts</li>
        </ul>
        <p className="mt-2">Managers can configure notification rules per role (e.g. staff only get push, managers get push + SMS for critical alerts).</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View own profile, no access to settings"],
          ["Team Leader", "View settings (read-only)"],
          ["Manager", "Full settings access: areas, units, users, notifications. Cannot modify billing"],
          ["Superuser", "All settings across all locations, plus billing and subscription management"],
        ]} />
      </DocSection>

      <DocNote type="warning">
        Changing temperature unit min/max ranges retroactively affects historical data analysis. Previous readings that were &ldquo;in range&rdquo; under old settings may appear &ldquo;out of range&rdquo; under new settings. The system logs the date of any threshold change for audit clarity.
      </DocNote>

      <DocNote type="info">
        User PINs are set by Managers only. Staff cannot set or change their own PINs. When a PIN is reset, the staff member must use the new PIN for their next action.
      </DocNote>
    </>
  );
}

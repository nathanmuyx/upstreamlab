"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
const allergens = ["Dairy", "Gluten", "Eggs", "Fish", "Nuts", "Shellfish", "Soy", "Sesame", "Lupin"] as const;
type Allergen = (typeof allergens)[number];

type AllergenStatus = "contains" | "may_contain" | "none";

type FoodItem = {
  name: string;
  allergens: Partial<Record<Allergen, AllergenStatus>>;
};

const foodItems: FoodItem[] = [
  { name: "Sliced Ham", allergens: { Soy: "may_contain" } },
  { name: "Caesar Salad", allergens: { Dairy: "contains", Gluten: "contains", Eggs: "contains", Fish: "may_contain", Nuts: "may_contain" } },
  { name: "Margherita Pizza", allergens: { Dairy: "contains", Gluten: "contains" } },
  { name: "Prawn Pasta", allergens: { Gluten: "contains", Shellfish: "contains", Eggs: "may_contain" } },
  { name: "Chocolate Mousse", allergens: { Dairy: "contains", Eggs: "contains", Nuts: "may_contain", Soy: "may_contain" } },
  { name: "Garden Salad", allergens: { Sesame: "may_contain" } },
  { name: "Fish & Chips", allergens: { Fish: "contains", Gluten: "contains", Eggs: "may_contain" } },
  { name: "Chicken Schnitzel", allergens: { Gluten: "contains", Eggs: "contains" } },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [filterAllergen, setFilterAllergen] = useState<Allergen | "all">("all");

  const filteredFoods = filterAllergen === "all"
    ? foodItems
    : foodItems.filter((f) => {
        const status = f.allergens[filterAllergen];
        return status === "contains" || status === "may_contain";
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
        <h2 className="text-[14px] font-semibold text-[#333]">Allergen Matrix</h2>
        <button className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Add Food Item
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[11px] text-[#666]">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white" style={{ background: "#E74C3C" }}>&bull;</span>
          <span>Contains</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white" style={{ background: "#F39C12" }}>&bull;</span>
          <span>May Contain</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#F5F6FA] text-[10px] text-[#ccc]">&mdash;</span>
          <span>Free</span>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] text-[#666] font-medium shrink-0">Filter by allergen:</span>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterAllergen("all")}
            className={`text-[10px] px-2 py-1 rounded-full cursor-pointer transition-colors ${
              filterAllergen === "all"
                ? "bg-[#2E75B6] text-white font-semibold"
                : "bg-[#F5F6FA] text-[#666] hover:bg-[#E4E7EE]"
            }`}
          >
            All
          </button>
          {allergens.map((a) => (
            <button
              key={a}
              onClick={() => setFilterAllergen(a)}
              className={`text-[10px] px-2 py-1 rounded-full cursor-pointer transition-colors ${
                filterAllergen === a
                  ? "bg-[#2E75B6] text-white font-semibold"
                  : "bg-[#F5F6FA] text-[#666] hover:bg-[#E4E7EE]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Allergen matrix table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-3 py-2.5 font-medium sticky left-0 bg-[#1B2A4A] min-w-[160px]">Food Item</th>
              {allergens.map((a) => (
                <th key={a} className="text-center px-2 py-2.5 font-medium min-w-[60px]">
                  <span className="text-[10px]">{a}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFoods.map((food, i) => (
              <tr key={food.name} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                <td className="px-3 py-2 font-medium text-[#333] sticky left-0 bg-inherit">{food.name}</td>
                {allergens.map((a) => {
                  const status = food.allergens[a] || "none";
                  return (
                    <td key={a} className="text-center px-2 py-2">
                      {status === "contains" && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold text-white" style={{ background: "#E74C3C" }}>
                          &bull;
                        </span>
                      )}
                      {status === "may_contain" && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold text-white" style={{ background: "#F39C12" }}>
                          &bull;
                        </span>
                      )}
                      {status === "none" && (
                        <span className="text-[#ddd]">&mdash;</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredFoods.length === 0 && (
              <tr>
                <td colSpan={allergens.length + 1} className="px-4 py-8 text-center text-[12px] text-[#999]">
                  No food items match the selected allergen filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Allergen Matrix</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Allergen Matrix provides a comprehensive view of allergen information for every food item on the menu. This is a critical compliance tool for Australian food safety requirements.
        </p>
      </div>

      <DocSection title="Allergen List">
        <p>Hospitality Safe tracks 14+ allergens as required by Australian and international standards:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          {[
            "Dairy (Milk)", "Gluten (Wheat)", "Eggs", "Fish",
            "Tree Nuts", "Peanuts", "Shellfish (Crustaceans)",
            "Soy", "Sesame", "Lupin", "Sulphites",
            "Alcohol", "Royal Jelly", "Celery",
          ].map((a) => (
            <div key={a} className="flex items-center gap-1.5 text-[11px] text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E75B6] shrink-0" />
              {a}
            </div>
          ))}
        </div>
        <p className="mt-2">Businesses can add custom allergens beyond this list if needed (e.g. specific regional requirements).</p>
      </DocSection>

      <DocSection title="Dietary Requirements">
        <p>Beyond allergens, the matrix can track dietary preferences and restrictions:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Vegetarian / Vegan:</strong> Items that meet vegetarian or vegan criteria</li>
          <li><strong>Halal / Kosher:</strong> Items prepared according to religious dietary laws</li>
          <li><strong>Gluten-Free:</strong> Items that can be safely served to coeliac customers</li>
          <li><strong>Low FODMAP:</strong> Items suitable for customers with IBS</li>
        </ul>
      </DocSection>

      <DocSection title="Menu Modifications">
        <p>When a dish can be modified to remove an allergen, the system supports this:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Modification notes can be attached to any cell (e.g. &ldquo;Can be made gluten-free with GF bread&rdquo;)</li>
          <li>Modified versions update the matrix automatically</li>
          <li>Staff can filter the matrix to show &ldquo;possible with modification&rdquo; items</li>
        </ul>
      </DocSection>

      <DocSection title="Random Auditing Tool">
        <p>The system includes a random auditing feature for allergen compliance:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Randomly selects a menu item and asks staff to identify its allergens</li>
          <li>Results are logged as part of the training/compliance record</li>
          <li>Managers can schedule regular allergen spot-checks</li>
          <li>Incorrect answers trigger a follow-up training module</li>
        </ul>
      </DocSection>

      <DocSection title="Data Flow">
        <p>The allergen matrix is built from ingredient-level data flowing through the system:</p>
        <ol className="list-decimal pl-4 space-y-1 mt-1">
          <li><strong>Ingredients:</strong> Each ingredient has allergen flags set at the product level</li>
          <li><strong>Prep/Recipes:</strong> When ingredients are combined in recipes, allergens are aggregated</li>
          <li><strong>Dishes:</strong> The final dish inherits all allergens from its components</li>
          <li><strong>Matrix:</strong> The matrix view is auto-generated from dish-level allergen data</li>
        </ol>
        <p className="mt-2">Changing an ingredient&apos;s allergen flags automatically updates all dishes that use that ingredient.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View allergen matrix (read-only), use allergen filter for customer queries"],
          ["Team Leader", "View matrix, run allergen spot-checks with staff"],
          ["Manager", "Edit allergen data, add/remove menu items, configure modifications, view audit results"],
          ["Superuser", "All above, plus manage allergen settings across all locations"],
        ]} />
      </DocSection>

      <DocNote type="danger">
        Incorrect allergen information can cause severe allergic reactions or anaphylaxis. Always verify allergen data with suppliers and update the matrix immediately when ingredients or recipes change.
      </DocNote>

      <DocNote type="info">
        The allergen matrix connects to Menutory for menu management. Changes to recipes in Menutory automatically update allergen data in Hospitality Safe.
      </DocNote>
    </>
  );
}

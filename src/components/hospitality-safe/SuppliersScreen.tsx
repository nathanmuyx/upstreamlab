"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/lib/hospitality-safe-docs";

/* ─── types ─── */
type FilterTab = "all" | "food" | "drink" | "logistics" | "maintenance";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "drink", label: "Drink" },
  { id: "logistics", label: "Logistics" },
  { id: "maintenance", label: "Maintenance/Service" },
];

type SupplierType = "Food" | "Drink" | "Logistics" | "Maintenance";

const typeBadge: Record<SupplierType, { bg: string; text: string }> = {
  Food: { bg: "#E8F8EF", text: "#27AE60" },
  Drink: { bg: "#EBF5FF", text: "#2E75B6" },
  Logistics: { bg: "#F3E8FF", text: "#8B5CF6" },
  Maintenance: { bg: "#FFF8E1", text: "#F39C12" },
};

const suppliers: {
  company: string;
  type: SupplierType;
  contact: string;
  phone: string;
  email: string;
  filterKey: FilterTab;
}[] = [
  { company: "Fresh Farm Produce", type: "Food", contact: "Michael Brown", phone: "02 9876 5432", email: "orders@freshfarm.com.au", filterKey: "food" },
  { company: "Sydney Seafood Co.", type: "Food", contact: "Lisa Wang", phone: "02 9123 4567", email: "lisa@sydneyseafood.com.au", filterKey: "food" },
  { company: "Premium Beverages", type: "Drink", contact: "Tom Harris", phone: "02 9234 5678", email: "tom@premiumbev.com.au", filterKey: "drink" },
  { company: "CoolFix Repairs", type: "Maintenance", contact: "Ray Johnson", phone: "0412 345 678", email: "service@coolfix.com.au", filterKey: "maintenance" },
  { company: "Metro Logistics", type: "Logistics", contact: "Sam Peters", phone: "02 9345 6789", email: "dispatch@metrologistics.com.au", filterKey: "logistics" },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter((s) => {
    if (activeTab !== "all" && s.filterKey !== activeTab) return false;
    if (search && !s.company.toLowerCase().includes(search.toLowerCase()) && !s.contact.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-5">
      {selectedArea !== "All Areas" && (
        <div className="mb-3 text-[11px] text-[#2E75B6] font-medium">
          Filtered: {selectedArea}
        </div>
      )}

      {/* Top bar: Search + Add button */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E4E7EE] bg-white text-[13px] text-[#333] placeholder-[#999] outline-none focus:border-[#2E75B6] transition-colors"
          />
        </div>
        <button className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity shrink-0" style={{ background: "#2E75B6" }}>
          + Add Supplier
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#E4E7EE] mb-4">
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

      {/* Supplier table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-4 py-2.5 font-medium">Company Name</th>
              <th className="text-left px-4 py-2.5 font-medium">Type</th>
              <th className="text-left px-4 py-2.5 font-medium">Contact Person</th>
              <th className="text-left px-4 py-2.5 font-medium">Phone</th>
              <th className="text-left px-4 py-2.5 font-medium">Email</th>
              <th className="text-left px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.company} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                <td className="px-4 py-2.5 font-medium text-[#333]">{s.company}</td>
                <td className="px-4 py-2.5">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: typeBadge[s.type].bg, color: typeBadge[s.type].text }}
                  >
                    {s.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[#666]">{s.contact}</td>
                <td className="px-4 py-2.5 text-[#666]">{s.phone}</td>
                <td className="px-4 py-2.5 text-[#2E75B6]">{s.email}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <button className="text-[11px] px-2.5 py-1 rounded border border-[#2E75B6] text-[#2E75B6] hover:bg-[#2E75B6]/5 cursor-pointer transition-colors">
                      Edit
                    </button>
                    <button className="text-[11px] px-2.5 py-1 rounded border border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C]/5 cursor-pointer transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#999]">
                  No suppliers found.
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Companies / Suppliers</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Suppliers module maintains a register of all companies your business works with &mdash; food suppliers, beverage distributors, logistics providers, and maintenance/service contractors.
        </p>
      </div>

      <DocSection title="Legal Requirement">
        <p>Australian food safety regulations require businesses to maintain up-to-date records of all food suppliers. This includes:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Company name and ABN</li>
          <li>Contact person details (name, phone, email)</li>
          <li>Type of goods or services supplied</li>
          <li>Delivery schedules and order history</li>
        </ul>
        <p className="mt-2">This register must be available for inspection during food safety audits and council inspections.</p>
      </DocSection>

      <DocSection title="Task Manager Integration">
        <p>The Suppliers module integrates with the Task Manager to auto-notify suppliers when issues arise:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Goods Receiving Issues:</strong> When a delivery fails a temperature check or has damaged items, the system can automatically create a task and notify the supplier via email</li>
          <li><strong>Equipment Service:</strong> When a maintenance task is created (e.g. coolroom repair), the linked maintenance supplier is notified</li>
          <li><strong>Recall Notices:</strong> When a product recall is logged, the system flags the supplier and tracks which deliveries may be affected</li>
        </ul>
      </DocSection>

      <DocSection title="Menutory Connection">
        <p>Suppliers in Hospitality Safe connect to the Menutory platform for ordering and invoice management:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Supplier details sync between both systems</li>
          <li>Orders placed in Menutory are visible in Hospitality Safe for goods receiving</li>
          <li>Delivery schedules feed into the Goods Receivable module</li>
        </ul>
      </DocSection>

      <DocSection title="Invoice Price Change Detection">
        <p>The system monitors invoices for price changes and alerts managers when:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>A product&apos;s unit price increases by more than a configurable threshold (default 5%)</li>
          <li>New line items appear on invoices that were not part of the original order</li>
          <li>Quantity discrepancies exist between ordered and invoiced amounts</li>
        </ul>
        <p className="mt-2">This helps catch billing errors and unauthorized price increases early.</p>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View supplier list (read-only)"],
          ["Team Leader", "View supplier list, contact suppliers for delivery queries"],
          ["Manager", "Full CRUD: add, edit, delete suppliers. Configure notifications and integrations"],
          ["Superuser", "All above, plus manage supplier records across all locations"],
        ]} />
      </DocSection>

      <DocNote type="info">
        Supplier records are shared across modules. Editing a supplier here updates their details in Goods Receivable, Task Manager, and Documents automatically.
      </DocNote>
    </>
  );
}

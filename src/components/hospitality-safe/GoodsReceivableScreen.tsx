"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/app/projects/hospitality-safe/page";

/* ─── types ─── */
type FilterTab = "all" | "pending" | "received" | "issues";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "received", label: "Received" },
  { id: "issues", label: "Issues" },
];

type DeliveryStatus = "pending" | "received" | "issues";

const statusConfig: Record<DeliveryStatus, { label: string; icon: string; bg: string; text: string }> = {
  pending: { label: "Pending", icon: "\u23F3", bg: "#FFF8E1", text: "#F39C12" },
  received: { label: "Received", icon: "\u2705", bg: "#E8F8EF", text: "#27AE60" },
  issues: { label: "Issues", icon: "\u26A0\uFE0F", bg: "#FDE8E8", text: "#E74C3C" },
};

const deliveries: {
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status: DeliveryStatus;
  items: string;
  action: string;
  filterKey: FilterTab;
}[] = [
  { supplier: "Fresh Farm Produce", orderDate: "15/03", expectedDelivery: "16/03 9:00 AM", status: "pending", items: "12 items", action: "Record", filterKey: "pending" },
  { supplier: "Sydney Seafood Co.", orderDate: "14/03", expectedDelivery: "15/03 7:00 AM", status: "received", items: "8 items", action: "View", filterKey: "received" },
  { supplier: "Premium Beverages", orderDate: "13/03", expectedDelivery: "14/03 10:00 AM", status: "received", items: "15 items", action: "View", filterKey: "received" },
  { supplier: "Metro Logistics", orderDate: "12/03", expectedDelivery: "13/03 8:00 AM", status: "issues", items: "10 items (2 issues)", action: "View", filterKey: "issues" },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = deliveries.filter((d) => {
    if (activeTab !== "all" && d.filterKey !== activeTab) return false;
    return true;
  });

  return (
    <div className="p-5">
      {selectedArea !== "All Areas" && (
        <div className="mb-3 text-[11px] text-[#2E75B6] font-medium">
          Filtered: {selectedArea}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-semibold text-[#333]">Goods Receivable</h2>
        <button className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Record Delivery
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-3">
          <div className="text-[11px] text-[#666] font-medium mb-1">Pending Today</div>
          <div className="text-[22px] font-bold" style={{ color: "#F39C12" }}>1</div>
          <div className="text-[10px] text-[#666] mt-0.5">Expected by 9:00 AM</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-3">
          <div className="text-[11px] text-[#666] font-medium mb-1">Received This Week</div>
          <div className="text-[22px] font-bold" style={{ color: "#27AE60" }}>2</div>
          <div className="text-[10px] text-[#666] mt-0.5">23 items total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-3">
          <div className="text-[11px] text-[#666] font-medium mb-1">Issues to Resolve</div>
          <div className="text-[22px] font-bold" style={{ color: "#E74C3C" }}>1</div>
          <div className="text-[10px] text-[#666] mt-0.5">2 items flagged</div>
        </div>
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

      {/* Deliveries table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-4 py-2.5 font-medium">Supplier</th>
              <th className="text-left px-4 py-2.5 font-medium">Order Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Expected Delivery</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-left px-4 py-2.5 font-medium">Items</th>
              <th className="text-left px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const s = statusConfig[d.status];
              return (
                <tr key={`${d.supplier}-${d.orderDate}`} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-[#333]">{d.supplier}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.orderDate}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.expectedDelivery}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                      style={{ background: s.bg, color: s.text }}
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[#666]">
                    {d.items}
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      className="text-[11px] px-3 py-1 rounded font-medium cursor-pointer transition-colors"
                      style={{
                        background: d.action === "Record" ? "#2E75B6" : "transparent",
                        color: d.action === "Record" ? "white" : "#2E75B6",
                        border: d.action === "Record" ? "none" : "1px solid #2E75B6",
                      }}
                    >
                      {d.action}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#999]">
                  No deliveries found.
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Goods Receivable</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Goods Receivable module tracks incoming deliveries from suppliers. Staff record delivery arrivals, check temperatures for cold chain compliance, report issues, and link deliveries to orders.
        </p>
      </div>

      <DocSection title="Menutory Integration">
        <p>Deliveries in Hospitality Safe link to purchase orders placed through Menutory:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>When an order is placed in Menutory, an expected delivery record is automatically created here</li>
          <li>The expected items list is pre-populated from the order details</li>
          <li>Staff compare received items against the expected order during goods receiving</li>
          <li>Discrepancies (missing items, wrong quantities) are flagged automatically</li>
        </ul>
      </DocSection>

      <DocSection title="Temperature Checking (Cold Chain)">
        <p>For cold chain compliance, staff must record temperatures of refrigerated and frozen goods on arrival:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Chilled items:</strong> Must arrive at 5&deg;C or below. The system prompts for a temperature reading</li>
          <li><strong>Frozen items:</strong> Must arrive at -18&deg;C or below</li>
          <li><strong>Hot items:</strong> Must arrive at 60&deg;C or above</li>
          <li>Temperatures outside safe ranges trigger an immediate alert and create a corrective action task</li>
          <li>Bluetooth thermometers can be used for quick, accurate readings during goods receiving</li>
        </ul>
      </DocSection>

      <DocSection title="Issue Reporting">
        <p>When problems are found during goods receiving, staff can report issues:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Temperature failures:</strong> Items arriving outside safe temperature range</li>
          <li><strong>Damaged goods:</strong> Physical damage to packaging or products</li>
          <li><strong>Wrong items:</strong> Products that don&apos;t match the order</li>
          <li><strong>Short delivery:</strong> Missing items from the order</li>
          <li><strong>Quality concerns:</strong> Items that appear spoiled, discoloured, or otherwise unfit</li>
        </ul>
        <p className="mt-2">Issues automatically generate a notification to the supplier (via the Suppliers module) and create a follow-up task for the manager.</p>
      </DocSection>

      <DocSection title="Inventory Feed">
        <p>Delivery data feeds into inventory management:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Received quantities update stock levels in Menutory</li>
          <li>Rejected items are excluded from inventory counts</li>
          <li>Delivery frequency and quantities feed into ordering forecasts</li>
          <li>Price changes detected between orders and invoices are flagged</li>
        </ul>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "Record deliveries, take temperature readings, report issues"],
          ["Team Leader", "All staff actions, plus review and approve delivery records"],
          ["Manager", "Full access: view history, manage supplier communications, configure delivery schedules"],
          ["Superuser", "Cross-location delivery analytics and supplier performance tracking"],
        ]} />
      </DocSection>

      <DocNote type="warning">
        Refusing a delivery due to temperature failure must be documented in the system. The refused items, temperature readings, and delivery driver details are recorded for regulatory compliance and supplier dispute resolution.
      </DocNote>

      <DocNote type="info">
        The Goods Receivable module works with the Suppliers module for contact information and the Task Manager for follow-up actions on delivery issues.
      </DocNote>
    </>
  );
}

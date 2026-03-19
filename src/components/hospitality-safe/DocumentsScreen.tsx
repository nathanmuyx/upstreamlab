"use client";

import { useState } from "react";
import { DocSection, DocNote, RoleTable } from "@/lib/hospitality-safe-docs";

/* ─── types ─── */
type FilterTab = "all" | "pest" | "calibration" | "equipment" | "staff" | "other";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pest", label: "Pest Control" },
  { id: "calibration", label: "Calibration" },
  { id: "equipment", label: "Equipment Service" },
  { id: "staff", label: "Staff Certificates" },
  { id: "other", label: "Other" },
];

type DocStatus = "current" | "expiring" | "expired";

const statusConfig: Record<DocStatus, { label: string; bg: string; text: string }> = {
  current: { label: "Current", bg: "#E8F8EF", text: "#27AE60" },
  expiring: { label: "Expiring Soon", bg: "#FFF8E1", text: "#F39C12" },
  expired: { label: "Expired", bg: "#FDE8E8", text: "#E74C3C" },
};

const documents: {
  name: string;
  type: string;
  relatedTo: string;
  uploadDate: string;
  expiryDate: string;
  status: DocStatus;
  filterKey: FilterTab;
}[] = [
  { name: "Pest Control Report - Q1", type: "Pest Control", relatedTo: "Main Kitchen", uploadDate: "15/01/2026", expiryDate: "15/04/2026", status: "current", filterKey: "pest" },
  { name: "Thermometer Calibration", type: "Calibration", relatedTo: "All Units", uploadDate: "01/02/2026", expiryDate: "01/08/2026", status: "current", filterKey: "calibration" },
  { name: "Coolroom Service Report", type: "Equipment Service", relatedTo: "Coolroom 1", uploadDate: "10/12/2025", expiryDate: "10/03/2026", status: "expiring", filterKey: "equipment" },
  { name: "Sarah Chen - Food Safety Cert", type: "Staff Certificates", relatedTo: "Sarah Chen", uploadDate: "01/06/2024", expiryDate: "01/06/2026", status: "current", filterKey: "staff" },
  { name: "James Liu - RSA Certificate", type: "Staff Certificates", relatedTo: "James Liu", uploadDate: "15/03/2024", expiryDate: "15/03/2025", status: "expired", filterKey: "staff" },
];

const staffCards = [
  {
    name: "Sarah Chen",
    initials: "SC",
    role: "Manager",
    certs: [
      { name: "Food Safety Supervisor", expiry: "01/06/2026", status: "current" as DocStatus },
      { name: "RSA Certificate", expiry: "15/09/2026", status: "current" as DocStatus },
      { name: "First Aid", expiry: "01/12/2026", status: "current" as DocStatus },
    ],
  },
  {
    name: "James Liu",
    initials: "JL",
    role: "Team Leader",
    certs: [
      { name: "Food Safety Handler", expiry: "20/08/2026", status: "current" as DocStatus },
      { name: "RSA Certificate", expiry: "15/03/2025", status: "expired" as DocStatus },
    ],
  },
];

/* ─── Mockup ─── */
export function Mockup({ selectedArea }: { selectedArea: string }) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = documents.filter((d) => {
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
        <h2 className="text-[14px] font-semibold text-[#333]">Document Register</h2>
        <button className="px-4 py-2 rounded-lg text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "#2E75B6" }}>
          + Upload Document
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#E4E7EE] mb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-[12px] cursor-pointer transition-colors relative ${
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

      {/* Documents table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] mb-5">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#1B2A4A] text-white">
              <th className="text-left px-4 py-2.5 font-medium">Document Name</th>
              <th className="text-left px-4 py-2.5 font-medium">Type</th>
              <th className="text-left px-4 py-2.5 font-medium">Related To</th>
              <th className="text-left px-4 py-2.5 font-medium">Upload Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Expiry Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => {
              const s = statusConfig[d.status];
              return (
                <tr key={d.name} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-[#333]">{d.name}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.type}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.relatedTo}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.uploadDate}</td>
                  <td className="px-4 py-2.5 text-[#666]">{d.expiryDate}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                      style={{ background: s.bg, color: s.text }}
                    >
                      {d.status === "current" && <span>&#10003;</span>}
                      {d.status === "expiring" && <span>&#9888;</span>}
                      {d.status === "expired" && <span>&#10005;</span>}
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[12px] text-[#999]">
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Staff Certificates Section */}
      <div className="mb-2">
        <h3 className="text-[13px] font-semibold text-[#333] mb-3">Staff Certificates</h3>
        <div className="grid grid-cols-2 gap-3">
          {staffCards.map((staff) => (
            <div key={staff.name} className="bg-white rounded-lg shadow-sm border border-[#E4E7EE] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2E75B6] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {staff.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#333]">{staff.name}</div>
                  <div className="text-[10px] text-[#666]">{staff.role}</div>
                </div>
              </div>
              <div className="space-y-2">
                {staff.certs.map((cert) => {
                  const cs = statusConfig[cert.status];
                  return (
                    <div key={cert.name} className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#F5F6FA]">
                      <span className="text-[11px] text-[#333] font-medium">{cert.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#666]">{cert.expiry}</span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: cs.text }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
        <h2 className="text-[22px] font-bold text-[#333] mt-1">Documents</h2>
        <p className="text-[13px] text-[#666] mt-2 leading-relaxed">
          The Documents module is a centralized register for all compliance-related documents &mdash; pest control reports, equipment calibration records, service reports, and staff certifications.
        </p>
      </div>

      <DocSection title="Auto-Filing from Email">
        <p>Documents can be automatically filed into the system when suppliers email reports to a dedicated address:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Each location has a unique email address (e.g. <code className="text-[11px] bg-[#F5F6FA] px-1 rounded">docs-sydney@hospitality-safe.com.au</code>)</li>
          <li>Incoming emails are parsed: PDF attachments are extracted and filed</li>
          <li>The system attempts to auto-classify the document type based on sender and subject line</li>
          <li>Managers receive a notification to review and confirm auto-filed documents</li>
        </ul>
      </DocSection>

      <DocSection title="Staff Certificate Tracking">
        <p>Staff certificates have a dedicated tracking workflow with escalating expiry notifications:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>6 months before expiry:</strong> Info notification to the staff member and their manager</li>
          <li><strong>3 months before expiry:</strong> Warning notification with a task created for the manager to follow up</li>
          <li><strong>6 weeks before expiry:</strong> Urgent alert. Staff member is flagged on checklists and shift planning</li>
          <li><strong>Expired:</strong> Staff member is blocked from food-handling duties until certificate is renewed</li>
        </ul>
      </DocSection>

      <DocSection title="RSA & Food Safety Renewal">
        <p>For RSA (Responsible Service of Alcohol) and Food Safety certificates:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>The system tracks both the certificate number and the issuing body</li>
          <li>Renewal reminders include links to approved training providers</li>
          <li>Once a staff member uploads a renewed certificate, the old one is archived (not deleted)</li>
          <li>Managers can bulk-view all staff certifications and their status from this screen</li>
        </ul>
      </DocSection>

      <DocSection title="Email-to-System Upload">
        <p>Beyond auto-filing, staff can manually forward documents to the system email address. The system:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Accepts PDF, JPG, and PNG attachments</li>
          <li>Extracts text from documents using OCR for searchability</li>
          <li>Links documents to the relevant supplier or staff member automatically when possible</li>
          <li>Flags unclassified documents for manager review</li>
        </ul>
      </DocSection>

      <DocSection title="Document Status">
        <p>Every document with an expiry date has a status indicator:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><span className="font-semibold" style={{ color: "#27AE60" }}>Current</span> &mdash; Valid and not approaching expiry</li>
          <li><span className="font-semibold" style={{ color: "#F39C12" }}>Expiring Soon</span> &mdash; Within the configurable warning window (default: 30 days)</li>
          <li><span className="font-semibold" style={{ color: "#E74C3C" }}>Expired</span> &mdash; Past the expiry date. Triggers alerts and may block related operations</li>
        </ul>
      </DocSection>

      <DocSection title="User Roles">
        <RoleTable roles={[
          ["Staff", "View own certificates, upload own documents"],
          ["Team Leader", "View team certificates, upload area documents"],
          ["Manager", "Full document management, approve auto-filed docs, configure expiry alerts"],
          ["Superuser", "Cross-location document overview, bulk export for audits"],
        ]} />
      </DocSection>

      <DocNote type="warning">
        Expired staff certificates may prevent the staff member from being assigned to food-handling checklists or shifts. Ensure renewals are processed promptly to avoid operational disruptions.
      </DocNote>

      <DocNote type="info">
        Documents are stored securely with versioning. When a document is replaced (e.g. a renewed certificate), the previous version is archived and remains accessible in the document history.
      </DocNote>
    </>
  );
}

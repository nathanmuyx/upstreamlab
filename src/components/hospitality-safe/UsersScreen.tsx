"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/app/projects/hospitality-safe/page";

/* ─── data ─── */
const userData = [
  { firstName: "Adele", lastName: "Sarrou", email: "Adelesarrou@hotmail.com", role: "Staff" },
  { firstName: "John", lastName: "Smith", email: "johnsmith@hospitalitysafe.com.au", role: "Staff" },
  { firstName: "Emily", lastName: "Tran", email: "emilytran@gmail.com", role: "Manager" },
];

const roleFilters = ["All", "Admin", "Managers", "Staff"] as const;
const roleOptions = ["Admin", "Manager", "Supervisor", "Staff"];

type View = "list" | "add" | "pin-created" | "view-user" | "edit-user" | "reset-pin";

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [view, setView] = useState<View>("list");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showPin, setShowPin] = useState(false);

  const stepMap: Record<View, number> = { list: 1, add: 2, "pin-created": 3, "view-user": 4, "edit-user": 5, "reset-pin": 6 };
  const go = (v: View) => { setView(v); onSubStepChange?.(stepMap[v]); };

  // Sync from parent
  if (currentStep !== undefined) {
    const m: Record<number, View> = { 1: "list", 2: "add", 3: "pin-created", 4: "view-user", 5: "edit-user", 6: "reset-pin" };
    const expected = m[currentStep];
    if (expected && expected !== view) setView(expected);
  }

  /* ── View 1: User List ── */
  if (view === "list") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => onNavigateScreen?.("admin-login")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Users</h2>
            <p className="text-[7px] text-[#888]">Manage users for this location.</p>
          </div>
          <BtnFill label="Add" onClick={() => go("add")} />
        </div>
        <BlueLine />
        {/* Search */}
        <div className="px-3 pt-2 pb-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-[#D1D5DB] bg-[#F9FAFB]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-[8px] text-[#333] outline-none bg-transparent placeholder:text-[#bbb]" />
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 px-3 pb-2 shrink-0 flex-wrap">
          {roleFilters.map((t) => (
            <button key={t} onClick={() => setActiveFilter(t)} className="px-2 py-0.5 rounded-full text-[7px] font-medium cursor-pointer border" style={activeFilter === t ? { background: "#4A5FC1", color: "#fff", borderColor: "#4A5FC1" } : { background: "#fff", color: "#4A5FC1", borderColor: "#4A5FC1" }}>
              {t}
            </button>
          ))}
        </div>
        {/* User rows */}
        <div className="flex-1 overflow-y-auto">
          {userData
            .filter((u) => {
              if (search && !`${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())) return false;
              return true;
            })
            .map((u) => (
            <div key={u.email} className="flex items-center py-2 px-3 border-b border-[#F0F0F0]">
              <div className="w-[12px] h-[12px] rounded-sm shrink-0 mr-2" style={{ background: "#4CAF50" }} />
              <span className="text-[9px] text-[#333] font-medium flex-1">{u.firstName} {u.lastName}</span>
              <button onClick={() => { go("view-user"); }} className="px-2 py-0.5 rounded border border-[#4A5FC1] text-[#4A5FC1] text-[7px] font-medium cursor-pointer hover:bg-[#4A5FC1]/5">View</button>
            </div>
          ))}
          <div className="h-20" style={{ background: "#f0f0f0" }} />
        </div>
      </div>
    );
  }

  /* ── View 2: Add User Form ── */
  if (view === "add") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div>
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Add User</h2>
            <p className="text-[7px] text-[#888]">Enter details to add a new user.</p>
          </div>
          <BtnFill label="Cancel" color="#E74C3C" onClick={() => go("list")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto px-4 pt-3">
          <FormRow label="First Name">
            <input type="text" defaultValue="Adele" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Last Name">
            <input type="text" defaultValue="Sarrou" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Email Address">
            <input type="text" defaultValue="Adelesarrou@hotmail.com" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Role">
            <div className="relative flex-1">
              <select defaultValue="Staff" className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer">
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </FormRow>
          <FormRow label="Profile Picture">
            <div className="flex-1">
              <div className="w-[80px] h-[60px] bg-[#E5E7EB] rounded flex items-center justify-center">
                <span className="text-[7px] text-[#999]">Add Photo</span>
              </div>
              <p className="text-[7px] text-[#999] mt-0.5">(optional)</p>
            </div>
          </FormRow>
          <FormRow label="Organisation">
            <span className="flex-1 px-2 py-1.5 text-[9px] text-[#999]">400 Gradi</span>
          </FormRow>
          <FormRow label="Location">
            <span className="flex-1 px-2 py-1.5 text-[9px] text-[#999]">Mildura</span>
          </FormRow>
          <div className="mt-4 flex justify-end pb-4">
            <button onClick={() => go("pin-created")} className="px-10 py-2 rounded-md text-white text-[10px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Create</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View 3: PIN Created Modal ── */
  if (view === "pin-created") {
    return (
      <div className="h-full flex flex-col bg-white relative">
        {/* Dimmed list behind */}
        <div className="h-full opacity-30 pointer-events-none overflow-hidden">
          <div className="flex items-start justify-between px-3 pt-2 pb-1">
            <BtnFill label="Back" />
            <div className="text-center flex-1">
              <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Users</h2>
              <p className="text-[7px] text-[#888]">Manage users for this location.</p>
            </div>
            <BtnFill label="Add" />
          </div>
          <BlueLine />
          {userData.map((u) => (
            <div key={u.email} className="flex items-center py-2 px-3 border-b border-[#F0F0F0]">
              <div className="w-[12px] h-[12px] rounded-sm shrink-0 mr-2" style={{ background: "#4CAF50" }} />
              <span className="text-[9px] text-[#333]">{u.firstName} {u.lastName}</span>
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-5 w-[78%] text-center">
            <h3 className="text-[11px] font-bold text-[#333] mb-2">User created successfully!</h3>
            <p className="text-[8px] text-[#666] mb-2">Remember this pin:</p>
            <div className="flex justify-center gap-3 mb-3">
              <span className="text-[20px] font-bold text-[#333]">6</span>
              <span className="text-[20px] font-bold text-[#333]">5</span>
              <span className="text-[20px] font-bold text-[#333]">4</span>
              <span className="text-[20px] font-bold text-[#333]">1</span>
            </div>
            <p className="text-[8px] text-[#666] mb-4">Adele will also receive an email with their new pin.</p>
            <button onClick={() => go("list")} className="px-8 py-2 rounded-md text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Continue</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View 4: View User ── */
  if (view === "view-user") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <BtnFill label="Back" onClick={() => go("list")} />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>View User</h2>
            <p className="text-[7px] text-[#888]">The details of this user.</p>
          </div>
          <BtnFill label="Edit" onClick={() => go("edit-user")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto">
          <SummaryRow label="Name" value="John Smith" />
          <SummaryRow label="Email" value="johnsmith@hospitalitysafe.com.au" />
          <SummaryRow label="Phone Number" value="-" />
          <SummaryRow label="Role" value="Account Staff" />
          <SummaryRow label="Created At" value="06/04/2023 8:32pm" />
          <SummaryRow label="Organisation" value="Adele test" />
          <SummaryRow label="Locations" value="Mildura" />
          {/* PIN row with show/hide */}
          <div className="flex items-start justify-between py-2.5 px-4 border-b border-[#E4E7EE]">
            <span className="text-[8px] text-[#666]">Pin</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#333] font-medium">{showPin ? "1827" : "\u2022\u2022\u2022\u2022"}</span>
              <button onClick={() => setShowPin(!showPin)} className="text-[8px] font-medium cursor-pointer" style={{ color: "#4A5FC1" }}>{showPin ? "Hide" : "Show"}</button>
            </div>
          </div>
          <BlueLine />
          <div className="flex justify-center py-4">
            <button onClick={() => go("reset-pin")} className="px-8 py-2 rounded-md text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Reset PIN</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View 5: Edit User ── */
  if (view === "edit-user") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-start justify-between px-3 pt-2 pb-1 shrink-0">
          <div>
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>Edit User</h2>
            <p className="text-[7px] text-[#888]">Update the details of this user.</p>
          </div>
          <BtnFill label="Cancel" color="#E74C3C" onClick={() => go("view-user")} />
        </div>
        <BlueLine />
        <div className="flex-1 overflow-y-auto px-4 pt-3">
          <FormRow label="First Name">
            <input type="text" defaultValue="John" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Last Name">
            <input type="text" defaultValue="Smith" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Email Address">
            <input type="text" defaultValue="johnsmith@hospitalitysafe.com.au" className="flex-1 px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent" />
          </FormRow>
          <FormRow label="Role">
            <div className="relative flex-1">
              <select defaultValue="Staff" className="w-full px-2 py-1.5 border-b border-[#D1D5DB] text-[9px] text-[#333] outline-none bg-transparent appearance-none cursor-pointer">
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </FormRow>
          <FormRow label="Profile Picture">
            <div className="flex-1">
              <div className="w-[80px] h-[60px] bg-[#E5E7EB] rounded flex items-center justify-center">
                <span className="text-[7px] text-[#999]">Add Photo</span>
              </div>
              <p className="text-[7px] text-[#999] mt-0.5">(optional)</p>
            </div>
          </FormRow>
          <FormRow label="Organisation">
            <span className="flex-1 px-2 py-1.5 text-[9px] text-[#999]">Adele test</span>
          </FormRow>
          <FormRow label="Location">
            <span className="flex-1 px-2 py-1.5 text-[9px] text-[#999]">Mildura</span>
          </FormRow>
          <div className="mt-4 flex justify-end pb-4">
            <button onClick={() => go("view-user")} className="px-10 py-2 rounded-md text-white text-[10px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Save</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── View 6: Reset PIN Modal ── */
  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Dimmed view behind */}
      <div className="h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="flex items-start justify-between px-3 pt-2 pb-1">
          <BtnFill label="Back" />
          <div className="text-center flex-1">
            <h2 className="text-[12px] font-bold" style={{ color: "#4A5FC1" }}>View User</h2>
            <p className="text-[7px] text-[#888]">The details of this user.</p>
          </div>
          <BtnFill label="Edit" />
        </div>
        <BlueLine />
        <SummaryRow label="Name" value="John Smith" />
        <SummaryRow label="Email" value="johnsmith@hospitalitysafe.com.au" />
        <SummaryRow label="Role" value="Account Staff" />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-5 w-[78%] text-center">
          <h3 className="text-[11px] font-bold text-[#333] mb-2">Pin reset successful!</h3>
          <p className="text-[8px] text-[#666] mb-2">Remember this new pin:</p>
          <div className="flex justify-center gap-3 mb-3">
            <span className="text-[20px] font-bold text-[#333]">3</span>
            <span className="text-[20px] font-bold text-[#333]">3</span>
            <span className="text-[20px] font-bold text-[#333]">3</span>
            <span className="text-[20px] font-bold text-[#333]">0</span>
          </div>
          <p className="text-[8px] text-[#666] mb-4">John will also receive an email with their pin.</p>
          <button onClick={() => go("view-user")} className="px-8 py-2 rounded-md text-white text-[9px] font-semibold cursor-pointer" style={{ background: "#4A5FC1" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI ─── */
function BtnFill({ label, color, onClick }: { label: string; color?: string; onClick?: () => void }) {
  return <button onClick={onClick} className="px-3 py-1 rounded text-white text-[8px] font-semibold cursor-pointer shrink-0" style={{ background: color || "#4A5FC1" }}>{label}</button>;
}

function BlueLine() {
  return <div className="h-[2px] shrink-0" style={{ background: "#4A5FC1" }} />;
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <label className="text-[8px] text-[#666] font-medium w-[90px] shrink-0 pt-1.5">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 px-4 border-b border-[#E4E7EE]">
      <span className="text-[8px] text-[#666]">{label}</span>
      <span className="text-[9px] text-[#333] font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

/* ─── Annotation ─── */
function Annotation({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "issue" }) {
  const isIssue = type === "issue";
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: `2px solid ${isIssue ? "#E74C3C" : "#4A5FC1"}` }}>
      <span className="text-[8px] font-medium mr-1" style={{ color: isIssue ? "#E74C3C" : "#4A5FC1" }}>{isIssue ? "Issue:" : "Note:"}</span>{children}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: User List */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>All users at this location. Filter by role using tabs.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Add</strong> creates a new user</li>
          <li><strong>View</strong> shows their info</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="issue">Users are not showing in the APP, this has not happened before. I just tried to add a new user, it didn&apos;t save on this page, it disappeared.</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: Add User */
  if (step === 2) return (
    <>
      <DocSection title="What is this?">
        <p>Create a new staff member. They&apos;ll get an auto-generated 4-digit PIN.</p>
      </DocSection>
      <DocSection title="Details">
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Role</strong> sets the user&apos;s access level</li>
          <li><strong>Photo</strong> is optional and doesn&apos;t show elsewhere</li>
          <li><strong>Organisation / Location</strong> are preset and read-only</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="issue">We may also want to get their contact number — might be used for a mobile app in the future.</Annotation>
        <Annotation>User will select the role which indicates their level of access.</Annotation>
      </DocSection>
    </>
  );

  /* Step 3: PIN Created */
  if (step === 3) return (
    <>
      <DocSection title="What is this?">
        <p>The new user&apos;s PIN was auto-generated. They&apos;ll also get an email with it.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>This is an automatically created 4 digit PIN which will also be emailed to the new user.</Annotation>
        <Annotation type="issue">Once the user is created it should direct to the All tab and show the newly added user on the list.</Annotation>
      </DocSection>
    </>
  );

  /* Step 4: View User */
  if (step === 4) return (
    <>
      <DocSection title="What is this?">
        <p>Summary of user details. PIN is hidden by default — click Show to reveal it.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>The View Users page is a summary of all information. To view users PIN press Show.</Annotation>
        <Annotation type="issue">There is a Phone Number line, but that isn&apos;t a section on the form. Role says &ldquo;Account Staff&rdquo;?? Does the PIN need to be hidden here?</Annotation>
      </DocSection>
    </>
  );

  /* Step 5: Edit User */
  if (step === 5) return (
    <>
      <DocSection title="What is this?">
        <p>Edit the user&apos;s name, email, role. Organisation and location can&apos;t be changed here.</p>
      </DocSection>
    </>
  );

  /* Step 6: Reset PIN */
  return (
    <>
      <DocSection title="What is this?">
        <p>PIN has been reset. The user gets an email with the new one.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>If the user wants a new PIN, they can press Reset PIN and an email will be sent with the new PIN.</Annotation>
        <Annotation type="issue">When Reset PIN is selected it doesn&apos;t confirm the action — it automatically assigns a new PIN.</Annotation>
      </DocSection>
      <DocNote type="warning">Reset PIN has no confirmation step — it immediately changes the PIN.</DocNote>
    </>
  );
}

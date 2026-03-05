"use client";

import { Grid, Mic, List, User, ChevLeft } from "./Icons";

const sections = [
  {
    label: "AUTHOR",
    items: [
      { icon: <Grid s={16} />, label: "Dashboard", active: false },
      { icon: <Mic s={16} />, label: "Add Dictation", active: true },
    ],
  },
  {
    label: "TYPIST",
    items: [
      { icon: <List s={16} />, label: "Transcribe Queue", active: false },
    ],
  },
  {
    label: "ADMIN",
    items: [
      { icon: <User s={16} />, label: "User Management", active: false },
    ],
  },
];

export default function Sidebar() {
  return (
    <div className="w-[220px] border-r border-ma-border flex flex-col bg-ma-sidebar shrink-0">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3 border-b border-ma-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#1B2E5A] rounded flex items-center justify-center">
            <span className="text-white text-[8px] font-bold font-serif tracking-wide">MA</span>
          </div>
          <span className="text-[11px] font-bold text-[#1B2E5A] font-serif tracking-wide uppercase">
            Maloney Anderson Legal
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-ma-text-sec">
            <User s={16} />
          </div>
          <div>
            <div className="text-xs font-medium text-ma-text">Sarah Chen, Esq.</div>
            <div className="text-[10px] text-ma-text-muted">sarah.chen@law.com</div>
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <div className="p-2 flex-1">
        {sections.map((section) => (
          <div key={section.label} className="mb-1">
            <div className="text-[10px] font-bold text-ma-blue px-3 pt-2.5 pb-1 tracking-wide">
              {section.label}
            </div>
            {section.items.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer ${
                  item.active
                    ? "bg-ma-sidebar-active text-ma-blue font-semibold"
                    : "bg-transparent text-ma-text-sec font-normal"
                }`}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Collapse */}
      <div className="py-3 px-4 border-t border-ma-border flex justify-center text-ma-text-muted cursor-pointer">
        <ChevLeft />
      </div>
    </div>
  );
}

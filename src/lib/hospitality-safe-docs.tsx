import React from "react";

export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-[12px] font-semibold text-slate-300 mb-1.5">{title}</h3>
      <div className="text-[11px] text-slate-500 leading-relaxed">{children}</div>
    </div>
  );
}

export function DocNote({ type, children }: { type: "info" | "warning" | "danger"; children: React.ReactNode }) {
  const styles = {
    info: { border: "#31AD52", bg: "rgba(49,173,82,0.06)", icon: "→" },
    warning: { border: "#F59E0B", bg: "rgba(245,158,11,0.06)", icon: "!" },
    danger: { border: "#EF4444", bg: "rgba(239,68,68,0.06)", icon: "×" },
  };
  const s = styles[type];
  return (
    <div className="rounded-md p-3 my-3 text-[10px] text-slate-400 leading-relaxed" style={{ background: s.bg, borderLeft: `2px solid ${s.border}` }}>
      <span className="font-bold text-slate-300 mr-1">{s.icon}</span>
      {children}
    </div>
  );
}

export function RoleTable({ roles }: { roles: [string, string][] }) {
  return (
    <div className="rounded-md overflow-hidden mt-2 border border-[#1A1A28]">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="bg-[#1A1A28]">
            <th className="text-left px-2.5 py-1.5 font-medium text-slate-400">Role</th>
            <th className="text-left px-2.5 py-1.5 font-medium text-slate-400">Access</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(([role, access], i) => (
            <tr key={role} className={i % 2 === 1 ? "bg-[#0F0F1A]" : "bg-[#0A0A12]"}>
              <td className="px-2.5 py-1.5 font-medium text-slate-300 whitespace-nowrap">{role}</td>
              <td className="px-2.5 py-1.5 text-slate-500">{access}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

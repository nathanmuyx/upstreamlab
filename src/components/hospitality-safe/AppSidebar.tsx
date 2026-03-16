"use client";

import {
  House,
  Tag,
  Thermometer,
  CookingPot,
  Truck,
  Bug,
  Gauge,
  ClipboardText,
  CheckSquare,
  Megaphone,
  UsersThree,
  ShieldCheck,
  SignOut,
} from "@phosphor-icons/react";

type NavItem = {
  type?: "header";
  label: string;
  id?: string;
  icon?: React.ElementType;
};

const sidebarNav: NavItem[] = [
  { label: "Home", id: "home", icon: House },
  { label: "Labels", id: "labels", icon: Tag },
  { type: "header", label: "RECORDS" },
  { label: "Temperatures", id: "temperatures", icon: Thermometer },
  { label: "Processes", id: "processes", icon: CookingPot },
  { label: "Deliveries", id: "deliveries", icon: Truck },
  { label: "Pest Control", id: "pest-control", icon: Bug },
  { label: "Calibrations", id: "calibrations", icon: Gauge },
  { type: "header", label: "MANAGEMENT" },
  { label: "Tasks", id: "tasks", icon: ClipboardText },
  { label: "Checklists", id: "checklists", icon: CheckSquare },
  { label: "Complaints", id: "complaints", icon: Megaphone },
  { label: "Companies", id: "companies", icon: UsersThree },
  { label: "Admin", id: "admin", icon: ShieldCheck },
  { label: "Logout", id: "logout", icon: SignOut },
];

// Map app sidebar IDs to upstream-lab screen IDs
const sidebarToScreen: Record<string, string> = {
  home: "homepage",
  labels: "labels",
  temperatures: "temperatures",
  processes: "processes",
  deliveries: "goods-receivable",
  "pest-control": "homepage",
  calibrations: "homepage",
  tasks: "task-manager",
  checklists: "checklists",
  complaints: "complaints",
  companies: "suppliers",
  admin: "admin-login",
  logout: "homepage",
};

export function AppSidebar({
  activeId,
  className,
  onNavigate,
}: {
  activeId?: string;
  className?: string;
  onNavigate?: (screenId: string) => void;
}) {
  return (
    <div
      className={`shrink-0 flex flex-col pt-1 pb-1 overflow-y-auto ${className || ""}`}
      style={{ width: 110, minWidth: 110, background: "#2D2F7B" }}
    >
      {sidebarNav.map((item, i) => {
        if (item.type === "header") {
          return (
            <div
              key={i}
              className="text-[7px] uppercase tracking-wider font-semibold mt-1 mb-0.5"
              style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "4px 12px" }}
            >
              {item.label}
            </div>
          );
        }

        const isActive = item.id === activeId;
        const Icon = item.icon;

        return (
          <div
            key={i}
            onClick={() => item.id && onNavigate?.(sidebarToScreen[item.id] || "homepage")}
            className={`flex items-center gap-2 ${onNavigate ? "cursor-pointer hover:bg-white/5" : "cursor-default"}`}
            style={{
              padding: "8px 12px",
              borderLeft: isActive ? "3px solid #27AE60" : "3px solid transparent",
              background: isActive ? "rgba(140,120,255,0.25)" : "transparent",
            }}
          >
            {Icon && (
              <Icon
                size={14}
                weight="fill"
                color="white"
                style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}
              />
            )}
            <span
              className="text-[9px] text-white"
              style={{ opacity: isActive ? 1 : 0.85, fontWeight: isActive ? 600 : 400 }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

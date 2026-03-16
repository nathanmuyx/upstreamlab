"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/hospitality-safe/AppSidebar";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { useThreads, useCreateThread } from "@liveblocks/react/suspense";
import { Thread, Composer } from "@liveblocks/react-ui";
import "@liveblocks/react-ui/styles.css";
import * as HomepageScreen from "@/components/hospitality-safe/HomepageScreen";
import * as TimersScreen from "@/components/hospitality-safe/TimersScreen";
import * as LabelsScreen from "@/components/hospitality-safe/LabelsScreen";
import * as TemperaturesScreen from "@/components/hospitality-safe/TemperaturesScreen";
import * as ProcessesScreen from "@/components/hospitality-safe/ProcessesScreen";
import * as ChecklistsScreen from "@/components/hospitality-safe/ChecklistsScreen";
import * as TaskManagerScreen from "@/components/hospitality-safe/TaskManagerScreen";
import * as AuditsScreen from "@/components/hospitality-safe/AuditsScreen";
import * as SuppliersScreen from "@/components/hospitality-safe/SuppliersScreen";
import * as DocumentsScreen from "@/components/hospitality-safe/DocumentsScreen";
import * as TrainingScreen from "@/components/hospitality-safe/TrainingScreen";
import * as AllergenScreen from "@/components/hospitality-safe/AllergenScreen";
import * as SettingsScreen from "@/components/hospitality-safe/SettingsScreen";
import * as SettingsAdminScreen from "@/components/hospitality-safe/SettingsAdminScreen";
import * as GoodsReceivableScreen from "@/components/hospitality-safe/GoodsReceivableScreen";
import * as AccountCreationScreen from "@/components/hospitality-safe/AccountCreationScreen";
import * as AdminLoginScreen from "@/components/hospitality-safe/AdminLoginScreen";
import * as AreasScreen from "@/components/hospitality-safe/AreasScreen";
import * as DevicesScreen from "@/components/hospitality-safe/DevicesScreen";
import * as UnitsScreen from "@/components/hospitality-safe/UnitsScreen";
import * as UsersScreen from "@/components/hospitality-safe/UsersScreen";
import * as AddTimerScreen from "@/components/hospitality-safe/AddTimerScreen";

/* ─── nav structure ─── */
type NavItem = { id: string; label: string; children?: NavItem[] };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { id: "getting-started", label: "Getting Started" },
      { id: "account-creation", label: "Account Creation" },
    ],
  },
  {
    title: "App",
    items: [
      {
        id: "homepage", label: "Home",
        children: [
          { id: "add-timer", label: "Add Timer" },
          { id: "add-record", label: "Add Record" },
        ],
      },
      { id: "labels", label: "Labels" },
    ],
  },
  {
    title: "Records",
    items: [
      { id: "temperatures", label: "Temperatures" },
      { id: "processes", label: "Processes" },
      { id: "goods-receivable", label: "Deliveries" },
      { id: "timers", label: "Timers" },
    ],
  },
  {
    title: "Management",
    items: [
      { id: "task-manager", label: "Tasks" },
      { id: "checklists", label: "Checklists" },
      { id: "complaints", label: "Complaints" },
      { id: "suppliers", label: "Companies" },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        id: "admin-login", label: "Admin",
        children: [
          { id: "areas", label: "Areas" },
          { id: "admin-devices", label: "Devices" },
          { id: "admin-foods", label: "Foods" },
          { id: "admin-units", label: "Units" },
          { id: "admin-users", label: "Users" },
          { id: "settings", label: "Settings" },
        ],
      },
      { id: "audits", label: "Audits" },
      { id: "documents", label: "Documents" },
      { id: "training", label: "Training" },
      { id: "allergens", label: "Allergens" },
    ],
  },
];

// Flatten for lookups (including children)
const allNavItems: NavItem[] = [];
navGroups.forEach((g) => g.items.forEach((item) => {
  allNavItems.push(item);
  item.children?.forEach((child) => allNavItems.push(child));
}));

const appAreas = ["All Areas", "Bar", "Fryer", "Grill", "Larder", "Main Area", "Pans", "Pasta", "Pizza"];

/* ─── screen registry ─── */
type ScreenEntry = {
  mockup: React.ComponentType<{ selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }>;
  docs: React.ComponentType<{ currentStep?: number }>;
};

const screens: Record<string, ScreenEntry> = {
  homepage: { mockup: HomepageScreen.Mockup, docs: HomepageScreen.Docs },
  timers: { mockup: TimersScreen.Mockup, docs: TimersScreen.Docs },
  labels: { mockup: LabelsScreen.Mockup, docs: LabelsScreen.Docs },
  temperatures: { mockup: TemperaturesScreen.Mockup, docs: TemperaturesScreen.Docs },
  processes: { mockup: ProcessesScreen.Mockup, docs: ProcessesScreen.Docs },
  checklists: { mockup: ChecklistsScreen.Mockup, docs: ChecklistsScreen.Docs },
  "task-manager": { mockup: TaskManagerScreen.Mockup, docs: TaskManagerScreen.Docs },
  audits: { mockup: AuditsScreen.Mockup, docs: AuditsScreen.Docs },
  suppliers: { mockup: SuppliersScreen.Mockup, docs: SuppliersScreen.Docs },
  documents: { mockup: DocumentsScreen.Mockup, docs: DocumentsScreen.Docs },
  training: { mockup: TrainingScreen.Mockup, docs: TrainingScreen.Docs },
  allergens: { mockup: AllergenScreen.Mockup, docs: AllergenScreen.Docs },
  settings: { mockup: SettingsAdminScreen.Mockup, docs: SettingsAdminScreen.Docs },
  "goods-receivable": { mockup: GoodsReceivableScreen.Mockup, docs: GoodsReceivableScreen.Docs },
  "account-creation": { mockup: AccountCreationScreen.Mockup, docs: AccountCreationScreen.Docs },
  "admin-login": { mockup: AdminLoginScreen.Mockup, docs: AdminLoginScreen.Docs },
  "areas": { mockup: AreasScreen.Mockup, docs: AreasScreen.Docs },
  "admin-devices": { mockup: DevicesScreen.Mockup, docs: DevicesScreen.Docs },
  "admin-units": { mockup: UnitsScreen.Mockup, docs: UnitsScreen.Docs },
  "admin-users": { mockup: UsersScreen.Mockup, docs: UsersScreen.Docs },
  "add-timer": { mockup: AddTimerScreen.Mockup, docs: AddTimerScreen.Docs },
  "add-record": { mockup: TemperaturesScreen.Mockup, docs: TemperaturesScreen.Docs },
};

/* ─── Flow Map Data ─── */
type FlowNode = { id: string; label: string };
type FlowEdge = { from: string; to: string; label?: string };
type Flow = { nodes: FlowNode[]; edges: FlowEdge[]; rows?: number[][]; cols?: number[][] };

const flows: Record<string, Flow> = {
  onboarding: {
    nodes: [
      { id: "account-creation", label: "Enter Email" },
      { id: "account-creation:2", label: "Account Owner" },
      { id: "account-creation:3", label: "Business Details" },
      { id: "account-creation:4", label: "Location Details" },
      { id: "account-creation:5", label: "Confirm" },
      { id: "admin-login", label: "Admin Login" },
      { id: "homepage", label: "App Home" },
    ],
    edges: [
      { from: "account-creation", to: "account-creation:2" },
      { from: "account-creation:2", to: "account-creation:3" },
      { from: "account-creation:3", to: "account-creation:4" },
      { from: "account-creation:4", to: "account-creation:5" },
      { from: "account-creation:5", to: "admin-login", label: "admin" },
      { from: "account-creation:5", to: "homepage", label: "app" },
    ],
    rows: [[0, 1, 2, 3, 4], [5, 6]],
  },
  admin: {
    nodes: [
      { id: "admin-login", label: "Auth" },
      { id: "admin-login:2", label: "Admin Panel" },
      { id: "areas", label: "Areas" },
    ],
    edges: [
      { from: "admin-login", to: "admin-login:2" },
      { from: "admin-login:2", to: "areas" },
    ],
    rows: [[0, 1, 2]],
  },
  areas: {
    nodes: [
      { id: "areas", label: "Areas List" },
      { id: "areas:2", label: "Add Area" },
      { id: "areas:3", label: "View Area" },
      { id: "areas:4", label: "Manage Foods" },
      { id: "areas:5", label: "Manage Units" },
    ],
    edges: [
      { from: "areas", to: "areas:2", label: "add" },
      { from: "areas", to: "areas:3", label: "view" },
      { from: "areas:3", to: "areas:4", label: "foods" },
      { from: "areas:3", to: "areas:5", label: "units" },
    ],
    rows: [[0, 1], [2, 3, 4]],
  },
  devices: {
    nodes: [
      { id: "admin-devices", label: "Device List" },
      { id: "admin-devices:2", label: "BT Scan" },
      { id: "admin-devices:3", label: "Found" },
      { id: "admin-devices:4", label: "Name + Type" },
      { id: "admin-devices:5", label: "WiFi Setup" },
      { id: "admin-devices:6", label: "Details" },
      { id: "admin-devices:7", label: "Edit" },
    ],
    edges: [
      { from: "admin-devices", to: "admin-devices:2", label: "thermo/printer" },
      { from: "admin-devices:2", to: "admin-devices:3" },
      { from: "admin-devices:3", to: "admin-devices:4" },
      { from: "admin-devices", to: "admin-devices:5", label: "data logger" },
      { from: "admin-devices:5", to: "admin-devices:6" },
      { from: "admin-devices", to: "admin-devices:7", label: "edit" },
    ],
    // cols: left-to-right columns, each column lists node indices stacked vertically
    cols: [[0], [1, 4, 6], [2, 5], [3]],
  },
  units: {
    nodes: [
      { id: "admin-units", label: "Unit List" },
      { id: "admin-units:2", label: "Add Unit" },
      { id: "admin-units:3", label: "View Unit" },
      { id: "admin-units:4", label: "Edit Unit" },
      { id: "admin-units:5", label: "Copy Unit" },
    ],
    edges: [
      { from: "admin-units", to: "admin-units:2", label: "add" },
      { from: "admin-units", to: "admin-units:3", label: "view" },
      { from: "admin-units", to: "admin-units:5", label: "copy" },
      { from: "admin-units:3", to: "admin-units:4", label: "edit" },
      { from: "admin-units:3", to: "admin-units:5", label: "copy" },
    ],
    cols: [[0], [1, 2, 4], [3]],
  },
  users: {
    nodes: [
      { id: "admin-users", label: "User List" },
      { id: "admin-users:2", label: "Add User" },
      { id: "admin-users:3", label: "PIN Created" },
      { id: "admin-users:4", label: "View User" },
      { id: "admin-users:5", label: "Edit User" },
      { id: "admin-users:6", label: "Reset PIN" },
    ],
    edges: [
      { from: "admin-users", to: "admin-users:2", label: "add" },
      { from: "admin-users:2", to: "admin-users:3" },
      { from: "admin-users", to: "admin-users:4", label: "view" },
      { from: "admin-users:4", to: "admin-users:5", label: "edit" },
      { from: "admin-users:4", to: "admin-users:6", label: "reset pin" },
    ],
    cols: [[0], [1, 3], [2, 4, 5]],
  },
  home: {
    nodes: [
      { id: "homepage", label: "Dashboard" },
      { id: "homepage:2", label: "Alerts" },
    ],
    edges: [
      { from: "homepage", to: "homepage:2", label: "view alerts" },
    ],
    cols: [[0], [1]],
  },
  "add-timer": {
    nodes: [
      { id: "add-timer", label: "Browse" },
      { id: "add-timer:2", label: "Label Choice" },
      { id: "add-timer:3", label: "Label Count" },
      { id: "add-timer:4", label: "PIN Entry" },
      { id: "add-timer:5", label: "Timer Started" },
    ],
    edges: [
      { from: "add-timer", to: "add-timer:2", label: "select item" },
      { from: "add-timer:2", to: "add-timer:4", label: "no label" },
      { from: "add-timer:2", to: "add-timer:3", label: "print label" },
      { from: "add-timer:3", to: "add-timer:4", label: "PIN" },
      { from: "add-timer:4", to: "add-timer:5" },
    ],
    cols: [[0], [1], [2, 3], [4]],
  },
  management: {
    nodes: [
      { id: "checklists", label: "Checklists" },
      { id: "task-manager", label: "Tasks" },
      { id: "complaints", label: "Complaints" },
      { id: "goods-receivable", label: "Deliveries" },
      { id: "audits", label: "Audits" },
    ],
    edges: [
      { from: "checklists", to: "task-manager", label: "issues" },
      { from: "goods-receivable", to: "task-manager", label: "issues" },
      { from: "audits", to: "task-manager", label: "findings" },
      { from: "complaints", to: "task-manager", label: "actions" },
    ],
    rows: [[0, 2, 3, 4], [1]],
  },
  settings: {
    nodes: [
      { id: "settings", label: "Settings" },
      { id: "settings:2", label: "Edit Organisation" },
      { id: "settings:3", label: "Edit Location" },
    ],
    edges: [
      { from: "settings", to: "settings:2", label: "organisation" },
      { from: "settings", to: "settings:3", label: "location" },
    ],
    cols: [[0], [1, 2]],
  },
};

// Map screen IDs to flow keys
const screenToFlow: Record<string, string> = {};
navGroups.forEach((g) => {
  const key = g.title === "Onboarding" ? "onboarding" : g.title === "Core App" ? "core" : g.title === "Management" ? "management" : g.title === "Configuration" ? "config" : "";
  g.items.forEach((item) => { if (key) screenToFlow[item.id] = key; });
});
screenToFlow["homepage"] = "home";
screenToFlow["add-timer"] = "add-timer";
screenToFlow["admin-login"] = "admin";
screenToFlow["areas"] = "areas";
screenToFlow["admin-devices"] = "devices";
screenToFlow["admin-units"] = "units";
screenToFlow["admin-users"] = "users";
screenToFlow["settings"] = "settings";

/* ─── Flow Map Component ─── */
function FlowMap({ activeScreen, activeNode, onNavigate }: { activeScreen: string; activeNode: string; onNavigate: (id: string) => void }) {
  const flowKey = screenToFlow[activeScreen];
  const flow = flowKey ? flows[flowKey] : null;
  if (!flow) return null;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  const nodeW = 110;
  const nodeH = 32;
  const gapX = 90;
  const gapY = 16;

  let totalW = 0;
  let svgH = 0;

  if (flow.cols) {
    // Left-to-right column layout
    let totalH = 0;
    flow.cols.forEach((col) => {
      const colH = col.length * nodeH + (col.length - 1) * gapY;
      if (colH > totalH) totalH = colH;
    });
    totalW = flow.cols.length * nodeW + (flow.cols.length - 1) * gapX;
    svgH = totalH + nodeH;

    flow.cols.forEach((col, ci) => {
      const colH = col.length * nodeH + (col.length - 1) * gapY;
      const startY = (totalH - colH) / 2;
      col.forEach((ni, ri) => {
        const node = flow.nodes[ni];
        if (node) {
          nodePositions[node.id] = {
            x: ci * (nodeW + gapX) + nodeW / 2,
            y: startY + ri * (nodeH + gapY) + nodeH / 2,
          };
        }
      });
    });
  } else {
    // Top-to-bottom row layout (default)
    const rows = flow.rows || [flow.nodes.map((_, i) => i)];

    rows.forEach((row) => {
      const rowW = row.length * nodeW + (row.length - 1) * gapX;
      if (rowW > totalW) totalW = rowW;
    });

    rows.forEach((row, ri) => {
      const rowW = row.length * nodeW + (row.length - 1) * gapX;
      const startX = (totalW - rowW) / 2;
      row.forEach((ni, ci) => {
        const node = flow.nodes[ni];
        if (node) {
          nodePositions[node.id] = {
            x: startX + ci * (nodeW + gapX) + nodeW / 2,
            y: ri * (nodeH + gapY) + nodeH / 2,
          };
        }
      });
    });

    const rows2 = flow.rows || [flow.nodes.map((_, i) => i)];
    svgH = rows2.length * (nodeH + gapY);
  }

  return (
    <div className="flex justify-center px-4 py-2 overflow-x-auto">
      <svg width={totalW + 40} height={svgH + 20} className="shrink-0" style={{ minWidth: totalW + 40 }}>
        <g transform="translate(20, 10)">
        <defs>
          <marker id="arrowG" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="6" markerHeight="5" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="#31AD52" opacity="0.5" />
          </marker>
          <marker id="arrowD" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="6" markerHeight="5" orient="auto-start-reverse">
            <polygon points="0 0, 10 3.5, 0 7" fill="#333" opacity="0.2" />
          </marker>
        </defs>

        {/* Edges */}
        {flow.edges.map((edge, i) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to) return null;

          const isActive = edge.from === activeNode || edge.to === activeNode;

          // Connect right side of source → left side of target
          const x1 = from.x + nodeW / 2;
          const y1 = from.y;
          const x2 = to.x - nodeW / 2;
          const y2 = to.y;

          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;

          // Use bezier curve for angled connections, straight for horizontal
          const path = Math.abs(y2 - y1) < 2
            ? `M${x1},${y1} L${x2},${y2}`
            : `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;

          return (
            <g key={i}>
              <path
                d={path}
                fill="none"
                stroke={isActive ? "#31AD52" : "#444"}
                strokeWidth={isActive ? 1.5 : 1}
                opacity={isActive ? 0.6 : 0.2}
                markerEnd={isActive ? "url(#arrowG)" : "url(#arrowD)"}
              />
              {edge.label && (
                <text x={mx} y={my - 5} fill={isActive ? "#31AD52" : "#666"} fontSize="9" opacity={isActive ? 0.9 : 0.5} textAnchor="middle">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {flow.nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;

          const isActive = node.id === activeNode;
          const isNavigable = !node.id.includes(":");

          return (
            <g
              key={node.id}
              onClick={() => isNavigable && onNavigate(node.id)}
              className={isNavigable ? "cursor-pointer" : ""}
            >
              <rect
                x={pos.x - nodeW / 2}
                y={pos.y - nodeH / 2}
                width={nodeW}
                height={nodeH}
                rx={6}
                fill={isActive ? "#31AD52" : "#1A1A28"}
                stroke={isActive ? "#31AD52" : "#2A2A3A"}
                strokeWidth={1}
                opacity={isActive ? 1 : 0.8}
              />
              <text
                x={pos.x}
                y={pos.y + 1}
                fill={isActive ? "#fff" : "#888"}
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-sans)"
                fontWeight={isActive ? 600 : 400}
              >
                {node.label}
              </text>
            </g>
          );
        })}
        </g>
      </svg>
    </div>
  );
}

/* ─── Upstream Logo ─── */
function UpstreamLogo({ size = 18 }: { size?: number }) {
  const h = size * (669.96 / 608.44);
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={size} height={h}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upHS)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upHS" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Right Panel with Docs + Comments tabs ─── */
function RightPanel({ activeScreen, currentNav, screenEntry, subStep }: { activeScreen: string; currentNav: any; screenEntry: any; subStep: number }) {
  const [rightTab, setRightTab] = useState<"docs" | "comments">("docs");
  const hasLiveblocks = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY && process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY !== "pk_YOUR_LIVEBLOCKS_PUBLIC_KEY";

  return (
    <div className="w-[380px] shrink-0 flex flex-col border-l border-[#1A1A28] bg-[#0A0A12]">
      {/* Tab header */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-[#1A1A28] shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRightTab("docs")}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors ${rightTab === "docs" ? "text-[#31AD52] bg-[#31AD52]/8" : "text-slate-500 hover:text-slate-300"}`}
          >
            <UpstreamLogo size={10} />
            Docs
          </button>
          <button
            onClick={() => setRightTab("comments")}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors ${rightTab === "comments" ? "text-[#31AD52] bg-[#31AD52]/8" : "text-slate-500 hover:text-slate-300"}`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            Comments
          </button>
        </div>
        <Badge variant="outline" className="text-[9px] text-[#31AD52] border-[#31AD52]/30 bg-[#31AD52]/5 px-2 py-0.5 font-medium">
          {currentNav?.label}
        </Badge>
      </div>

      {rightTab === "docs" ? (
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeScreen === "records" ? (
            <RecordsDocs />
          ) : activeScreen === "complaints" ? (
            <ComplaintsDocs />
          ) : screenEntry ? (
            <screenEntry.docs currentStep={subStep} />
          ) : null}
        </div>
      ) : (
        hasLiveblocks ? (
          <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[10px] text-slate-600">Loading comments...</div>}>
            <CommentsPanel />
          </Suspense>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 mb-2">Comments require Liveblocks</div>
              <p className="text-[9px] text-slate-600">Add your public key to <code className="text-slate-400">.env.local</code>:</p>
              <code className="text-[8px] text-[#31AD52] block mt-1">NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...</code>
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ─── Comments Panel ─── */
function CommentsPanel() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const { threads } = useThreads();
  const createThread = useCreateThread();

  // Load nickname from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hs-nickname");
    if (saved) setNickname(saved);
  }, []);

  const handleSetNickname = () => {
    if (nicknameInput.trim()) {
      const name = nicknameInput.trim();
      setNickname(name);
      localStorage.setItem("hs-nickname", name);
      setShowNicknamePrompt(false);
    }
  };

  const handleComposerSubmit = ({ body }: { body: any }) => {
    if (!nickname) {
      setShowNicknamePrompt(true);
      return;
    }
    createThread({ body, metadata: { author: nickname } });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A1A28] shrink-0">
        <span className="text-[11px] font-semibold text-slate-400">Comments</span>
        {nickname && (
          <span className="text-[9px] text-slate-600">
            as <span className="text-[#31AD52] font-medium">{nickname}</span>
          </span>
        )}
      </div>

      {/* Nickname prompt */}
      {showNicknamePrompt && (
        <div className="px-3 py-3 border-b border-[#1A1A28] bg-[#11111B]">
          <p className="text-[10px] text-slate-400 mb-2">Enter your name to comment:</p>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetNickname()}
              placeholder="Your name..."
              className="flex-1 px-2 py-1 rounded text-[10px] bg-[#1A1A28] border border-[#2A2A3A] text-slate-300 outline-none placeholder:text-slate-600 focus:border-[#31AD52]/50"
              autoFocus
            />
            <button
              onClick={handleSetNickname}
              className="px-2.5 py-1 rounded text-[10px] font-medium text-white cursor-pointer hover:opacity-90"
              style={{ background: "#31AD52" }}
            >
              Set
            </button>
          </div>
        </div>
      )}

      {/* Threads */}
      <div className="flex-1 overflow-y-auto">
        <div className="lb-root" data-theme="dark">
          {threads.length === 0 ? (
            <div className="px-3 py-6 text-center text-[10px] text-slate-600 italic">No comments yet.</div>
          ) : (
            threads.map((thread) => (
              <Thread key={thread.id} thread={thread} className="border-b border-[#1A1A28]" />
            ))
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-[#1A1A28] bg-[#11111B]">
        {nickname ? (
          <div className="lb-root" data-theme="dark">
            <Composer
              onComposerSubmit={({ body }) => {
                createThread({ body, metadata: { author: nickname } });
              }}
              overrides={{ COMPOSER_PLACEHOLDER: `Comment as ${nickname}...` }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowNicknamePrompt(true)}
            className="w-full px-3 py-2.5 text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer text-left transition-colors"
          >
            Click to add a comment...
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── main page ─── */
export default function HospitalitySafePage() {
  const publicKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  if (!publicKey || publicKey === "pk_YOUR_LIVEBLOCKS_PUBLIC_KEY") {
    return <HospitalitySafeContent />;
  }

  return (
    <LiveblocksProvider publicApiKey={publicKey}>
      <RoomProvider id="hospitality-safe-docs">
        <ClientSideSuspense fallback={<HospitalitySafeContent />}>
          <HospitalitySafeContent />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function HospitalitySafeContent() {
  const [activeScreen, setActiveScreen] = useState("getting-started");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [areaOpen, setAreaOpen] = useState(false);
  const [landscape, setLandscape] = useState(true);
  const [subStep, setSubStep] = useState(1);

  const screenEntry = screens[activeScreen];
  const currentNav = allNavItems.find((n) => n.id === activeScreen);

  // Reset subStep when switching screens
  const handleScreenChange = (id: string) => {
    setActiveScreen(id);
    setSubStep(1);
  };

  // Build the active flow node ID (e.g. "account-creation" for step 1, "account-creation:2" for step 2)
  const activeFlowNode = subStep > 1 ? `${activeScreen}:${subStep}` : activeScreen;

  // Screens without the app shell header (status bar, app header)
  const noHeaderScreens = ["getting-started", "account-creation"];
  // Screens without the app sidebar
  const noSidebarScreens = ["getting-started", "account-creation", "admin-login", "areas", "admin-devices", "admin-units", "admin-users", "settings"];
  const hasAppSidebar = !noSidebarScreens.includes(activeScreen);

  // Map our nav IDs to the app's sidebar IDs
  const sidebarIdMap: Record<string, string> = {
    homepage: "home",
    labels: "labels",
    temperatures: "temperatures",
    processes: "processes",
    "goods-receivable": "deliveries",
    checklists: "checklists",
    "task-manager": "tasks",
    complaints: "complaints",
    suppliers: "companies",
    settings: "admin",
    audits: "home",
    documents: "home",
    training: "home",
    allergens: "home",
    timers: "home",
    "add-timer": "home",
    "add-record": "home",
  };
  const sidebarActiveId = sidebarIdMap[activeScreen] || "home";

  // Flow step navigation
  const flowKey = screenToFlow[activeScreen];
  const currentFlow = flowKey ? flows[flowKey] : null;
  const currentFlowNodes = currentFlow?.nodes || [];
  const currentFlowIdx = currentFlowNodes.findIndex((n) => n.id === activeFlowNode);

  const canGoPrev = currentFlowIdx > 0;
  const canGoNext = currentFlowIdx >= 0 && currentFlowIdx < currentFlowNodes.length - 1;

  const goFlowStep = useCallback((dir: -1 | 1) => {
    if (!currentFlow) return;
    const nextIdx = currentFlowIdx + dir;
    if (nextIdx < 0 || nextIdx >= currentFlowNodes.length) return;
    const nextNode = currentFlowNodes[nextIdx];
    const parts = nextNode.id.split(":");
    if (parts.length === 1) {
      // It's a root screen
      handleScreenChange(nextNode.id);
    } else {
      // It's a sub-step like "account-creation:3"
      const baseScreen = parts[0];
      const step = parseInt(parts[1], 10);
      if (baseScreen !== activeScreen) {
        setActiveScreen(baseScreen);
      }
      setSubStep(step);
    }
  }, [currentFlow, currentFlowIdx, currentFlowNodes, activeScreen]);

  // Arrow key support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canGoPrev) goFlowStep(-1);
      if (e.key === "ArrowRight" && canGoNext) goFlowStep(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canGoPrev, canGoNext, goFlowStep]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] font-sans">

      {/* ──── LEFT: Navigation (Linear-style) ──── */}
      <aside className="w-[200px] shrink-0 flex flex-col border-r border-[#1A1A28]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A28]">
          <UpstreamLogo size={16} />
          <span className="text-[12px] font-bold tracking-tight text-slate-200">
            upstream<span className="text-[#31AD52]">lab</span>
          </span>
        </div>

        {/* Project label */}
        <div className="px-4 py-2.5 border-b border-[#1A1A28]">
          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Project</div>
          <div className="text-[12px] font-semibold text-slate-300 mt-0.5">Hospitality Safe</div>
        </div>

        {/* Nav groups — green dot = built from Figma, yellow dot = in progress */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-1">
              <div className="px-4 py-1.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = activeScreen === item.id;
                const childActive = item.children?.some((c) => c.id === activeScreen);
                const navStatus: Record<string, "done" | "wip" | "todo"> = {
                  "getting-started": "done",
                  "account-creation": "done",
                  "admin-login": "done",
                  homepage: "done",
                  "add-timer": "done",
                  "add-record": "wip",
                  labels: "done",
                  areas: "done",
                  "admin-devices": "done",
                  "admin-units": "done",
                  "admin-users": "done",
                  settings: "done",
                  temperatures: "todo",
                  processes: "todo",
                  "goods-receivable": "todo",
                  timers: "todo",
                  "task-manager": "todo",
                  checklists: "todo",
                  complaints: "todo",
                  suppliers: "todo",
                  audits: "todo",
                  documents: "todo",
                  training: "todo",
                  allergens: "todo",
                  "admin-foods": "todo",
                };
                const dotColor = navStatus[item.id] === "done" ? "#31AD52" : navStatus[item.id] === "wip" ? "#F39C12" : navStatus[item.id] === "todo" ? "#E74C3C" : null;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleScreenChange(item.id)}
                      className={`w-full text-left px-4 py-[5px] text-[12px] transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? "text-[#31AD52] font-medium bg-[#31AD52]/8"
                          : "text-slate-500 hover:text-slate-300 hover:bg-[#1A1A28]/50"
                      }`}
                    >
                      {isActive && <span className="w-[3px] h-3.5 rounded-full bg-[#31AD52] -ml-4 mr-[13px] shrink-0" />}
                      {!isActive && dotColor && <span className="w-[5px] h-[5px] rounded-full shrink-0 -ml-1 mr-0.5" style={{ background: dotColor }} />}
                      <span className="truncate">{item.label}</span>
                    </button>
                    {item.children && (
                      <div className="ml-4 border-l border-[#1A1A28]">
                        {item.children.map((child) => {
                          const isChildActive = activeScreen === child.id;
                          const childDotColor = navStatus[child.id] === "done" ? "#31AD52" : navStatus[child.id] === "wip" ? "#F39C12" : navStatus[child.id] === "todo" ? "#E74C3C" : null;
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleScreenChange(child.id)}
                              className={`w-full text-left pl-3 pr-4 py-[4px] text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                                isChildActive
                                  ? "text-[#31AD52] font-medium"
                                  : "text-slate-600 hover:text-slate-400"
                              }`}
                            >
                              {isChildActive && <span className="w-[2px] h-2.5 rounded-full bg-[#31AD52] -ml-[13px] mr-[11px] shrink-0" />}
                              {!isChildActive && childDotColor && <span className="w-[4px] h-[4px] rounded-full shrink-0 -ml-0.5 mr-0.5" style={{ background: childDotColor }} />}
                              <span className="truncate">{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#1A1A28] text-[10px] text-slate-700">
          Interactive Documentation
        </div>
      </aside>

      {/* ──── CENTER + RIGHT ──── */}
      {activeScreen === "getting-started" ? (
        /* Full-width documentation page for Getting Started */
        <div className="flex-1 overflow-y-auto bg-[#0A0A12] px-12 py-8">
          <div className="max-w-[720px] mx-auto">
            <GettingStartedPage />
          </div>
        </div>
      ) : (
      <>
      {/* ──── CENTER: Prototype Preview ──── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#111118]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A1A28] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Preview</span>
            <span className="text-[11px] text-slate-700">/</span>
            <span className="text-[11px] text-slate-400 font-medium">{currentNav?.label || "Screen"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLandscape(!landscape)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] text-slate-500 hover:text-slate-300 hover:bg-[#1A1A28] transition-colors cursor-pointer border border-[#1A1A28]"
              title={landscape ? "Switch to portrait" : "Switch to landscape"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={`transition-transform ${landscape ? "" : "rotate-90"}`}>
                <rect x="3" y="5" width="18" height="14" rx="3" />
              </svg>
              {landscape ? "Landscape" : "Portrait"}
            </button>
            <Badge variant="outline" className="text-[9px] text-slate-500 border-[#1A1A28] bg-transparent px-2 py-0.5 font-medium">
              Prototype
            </Badge>
          </div>
        </div>

        {/* Flow Map */}
        <FlowMap activeScreen={activeScreen} activeNode={activeFlowNode} onNavigate={handleScreenChange} />

        {/* iPad Pro mockup — fixed size, scrollable screen */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center shrink-0">
          <div className="relative">
            {/* Aluminium Body */}
            <div
              className="relative bg-[#0b0b0b] overflow-hidden transition-all duration-300"
              style={{
                width: landscape ? 822 : 520,
                height: landscape ? 627 : 720,
                borderRadius: 32,
                boxShadow: "inset 0 0 0 3px rgba(179,179,179,0.3)",
              }}
            >

              {/* Volume buttons */}
              {landscape ? (
                <>
                  <div className="absolute -top-px left-[80px] w-[29px] h-[2px] rounded-b-sm z-10" style={{ background: "linear-gradient(90deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
                  <div className="absolute -top-px left-[116px] w-[29px] h-[2px] rounded-b-sm z-10" style={{ background: "linear-gradient(90deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
                </>
              ) : (
                <>
                  <div className="absolute -right-px top-[60px] w-[2px] h-[29px] rounded-l-sm z-10" style={{ background: "linear-gradient(180deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
                  <div className="absolute -right-px top-[96px] w-[2px] h-[29px] rounded-l-sm z-10" style={{ background: "linear-gradient(180deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
                </>
              )}

              {/* Lock button */}
              {landscape ? (
                <div className="absolute -left-px top-[46px] w-[2px] h-[36px] rounded-r-sm z-10" style={{ background: "linear-gradient(180deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
              ) : (
                <div className="absolute -top-px right-[60px] w-[36px] h-[2px] rounded-b-sm z-10" style={{ background: "linear-gradient(90deg, #b0b0b0, #636363 9%, #c2c2c2 18%, #c2c2c2 75%, #efefee 86%, #6c6c6c)" }} />
              )}

              {/* Camera dot */}
              <div className={`absolute z-10 flex items-center gap-[3px] ${landscape ? "top-[6px] left-1/2 -translate-x-1/2 flex-row" : "left-[6px] top-1/2 -translate-y-1/2 flex-col"}`}>
                <div className="w-[5px] h-[5px] rounded-full bg-[#1c1c2e]" style={{ boxShadow: "inset 0 0 2px rgba(80,80,160,0.5)" }} />
              </div>

              {/* Screen — fixed size, scrollable content */}
              <div className="absolute bg-white overflow-hidden flex flex-col" style={{ top: 23, left: 23, right: 23, bottom: 23, borderRadius: 14 }}>

                  {/* App shell bars — hidden for standalone screens (account creation, admin login) */}
                  {!noHeaderScreens.includes(activeScreen) && (
                    <>
                      {/* Status Bar */}
                      <div className="flex items-center justify-between px-4 py-1 text-[9px] text-white/70 shrink-0" style={{ background: "#2D2F7B" }}>
                        <div className="flex items-center gap-3">
                          <span>8:09 am</span>
                          <span>Thu 22 Feb</span>
                        </div>
                        <span>···</span>
                        <div className="flex items-center gap-2">
                          <span>LOGGED OUT</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F39C12]" />
                        </div>
                      </div>

                      {/* Device Bar */}
                      <div className="flex items-center gap-4 px-4 py-0.5 text-[9px] shrink-0" style={{ background: "#2D2F7B" }}>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F39C12]" />
                          <span className="text-white font-medium">SCANNER</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F39C12]" />
                          <span className="text-white font-medium">PRINTER</span>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E4E7EE] shrink-0">
                        <div className="relative">
                          <button onClick={() => setAreaOpen(!areaOpen)} className="flex items-center gap-1 text-[12px] text-[#333] font-semibold cursor-pointer">
                            <div className="flex flex-col mr-0.5">
                              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="3"><path d="m18 15-6-6-6 6" /></svg>
                              <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                            {selectedArea}
                          </button>
                          {areaOpen && (
                            <div className="absolute top-full left-0 mt-1 w-[200px] bg-white rounded-xl shadow-xl border border-[#E4E7EE] py-1 z-30">
                              {appAreas.map((a) => (
                                <button key={a} onClick={() => { setSelectedArea(a); setAreaOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#333] hover:bg-[#F5F6FA] cursor-pointer">
                                  {a !== "All Areas" && <div className="w-6 h-6 rounded-full bg-[#ddd] shrink-0" />}
                                  <span className={a === "All Areas" ? "font-bold" : ""}>{a}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2D2F7B" }}>
                            <span className="text-white text-[9px] font-bold">HS</span>
                          </div>
                          <span className="text-[7px] text-[#666] font-medium tracking-widest mt-0.5">HOSPITALITY SAFE</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              if (activeScreen !== "homepage") handleScreenChange("homepage");
                              setSubStep(2);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-white text-[12px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
                            style={{ background: "#E74C3C" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                            6
                          </button>
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-white text-[12px] font-bold" style={{ background: "#2D2F7B" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" /><path d="M12 7v5l3 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                            0
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Screen Content — with optional sidebar */}
                  {hasAppSidebar ? (
                    <div className="flex flex-1 overflow-hidden">
                      <AppSidebar activeId={sidebarActiveId} onNavigate={handleScreenChange} />
                      <main className="flex-1 overflow-y-auto bg-white">
                        {activeScreen === "records" ? (
                          <PlaceholderScreen title="Records" />
                        ) : activeScreen === "complaints" ? (
                          <PlaceholderScreen title="Complaints" />
                        ) : screenEntry ? (
                          <screenEntry.mockup selectedArea={selectedArea} onSubStepChange={setSubStep} currentStep={subStep} onNavigateScreen={handleScreenChange} />
                        ) : (
                          <PlaceholderScreen title={currentNav?.label || "Module"} />
                        )}
                      </main>
                    </div>
                  ) : (
                    <main className="flex-1 overflow-y-auto bg-white">
                      {screenEntry ? (
                        <screenEntry.mockup selectedArea={selectedArea} onSubStepChange={setSubStep} currentStep={subStep} onNavigateScreen={handleScreenChange} />
                      ) : (
                        <PlaceholderScreen title={currentNav?.label || "Module"} />
                      )}
                    </main>
                  )}

                  {/* Home indicator */}
                  <div className="h-4 bg-white flex items-center justify-center shrink-0">
                    <div className="w-[100px] h-[4px] rounded-full bg-black/15" />
                  </div>
                </div>{/* screen */}
              </div>{/* body */}
          </div>{/* relative */}

          {/* Navigation arrows */}
          {currentFlow && (
            <div className="flex items-center justify-center gap-3 mt-3 shrink-0">
              <button
                onClick={() => canGoPrev && goFlowStep(-1)}
                disabled={!canGoPrev}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border border-[#1A1A28] ${
                  canGoPrev ? "text-slate-400 hover:text-[#31AD52] hover:border-[#31AD52]/30 hover:bg-[#31AD52]/5" : "text-slate-700 cursor-not-allowed opacity-40"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6" /></svg>
                Prev
              </button>
              <span className="text-[9px] text-slate-600">
                {currentFlowIdx + 1} / {currentFlowNodes.length}
              </span>
              <button
                onClick={() => canGoNext && goFlowStep(1)}
                disabled={!canGoNext}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border border-[#1A1A28] ${
                  canGoNext ? "text-slate-400 hover:text-[#31AD52] hover:border-[#31AD52]/30 hover:bg-[#31AD52]/5" : "text-slate-700 cursor-not-allowed opacity-40"
                }`}
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>{/* flex-col wrapper */}
        </div>{/* flex items-center */}
      </div>{/* CENTER panel */}

      {/* ──── RIGHT: Documentation + Comments (upstream-lab branded) ──── */}
      <RightPanel
        activeScreen={activeScreen}
        currentNav={currentNav}
        screenEntry={screenEntry}
        subStep={subStep}
      />
      </>
      )}
    </div>
  );
}

/* ─── placeholder ─── */
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="text-[32px] mb-3 opacity-30">○</div>
        <h2 className="text-[16px] font-semibold text-[#333] mb-1">{title}</h2>
        <p className="text-[12px] text-[#999]">Screen under development</p>
      </div>
    </div>
  );
}

function RecordsDocs() {
  return (
    <>
      <DocSection title="Records Module">
        <p>Centralized view of all logged data from Temperatures, Timers, Processes, and Checklists.</p>
      </DocSection>
      <DocSection title="Key Features">
        <ul className="list-disc pl-4 space-y-1">
          <li>Search and filter by date range, module, user, area, or result</li>
          <li>Export to CSV or PDF for auditor handoff</li>
          <li>Corrective action records attached to failed readings</li>
        </ul>
      </DocSection>
    </>
  );
}

function ComplaintsDocs() {
  return (
    <>
      <DocSection title="Complaints Module">
        <p>Record and investigate customer complaints related to food safety, allergens, or quality.</p>
      </DocSection>
      <DocNote type="info">This module is currently in the planning phase.</DocNote>
    </>
  );
}

/* ─── Getting Started (full documentation page, no iPad) ─── */
function GettingStartedPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <UpstreamLogo size={20} />
        <div>
          <h1 className="text-[22px] font-bold text-slate-100">Hospitality Safe</h1>
          <p className="text-[12px] text-slate-500">Food Safety Platform — Interactive Documentation</p>
        </div>
      </div>
      <Separator className="bg-[#1A1A28] mb-5" />

      {/* What is this */}
      <div className="rounded-lg border border-[#1A1A28] p-4 bg-[#11111B] mb-5">
        <h3 className="text-[13px] font-semibold text-slate-200 mb-2">What is this?</h3>
        <p className="text-[12px] text-slate-500 leading-relaxed">
          An app for restaurants, cafes, and food businesses to track food safety. It monitors fridge temperatures, manages food timers, prints labels, and keeps checklists — all on an iPad in the kitchen.
        </p>
      </div>

      {/* How to use this doc */}
      <div className="rounded-lg border border-[#1A1A28] p-4 bg-[#11111B] mb-5">
        <h3 className="text-[13px] font-semibold text-slate-200 mb-2">How to use this</h3>
        <ul className="text-[11px] text-slate-500 space-y-1.5">
          <li>👈 <strong className="text-slate-400">Left sidebar</strong> — pick a screen to view</li>
          <li>📱 <strong className="text-slate-400">Center iPad</strong> — interactive prototype (click through it like a real app)</li>
          <li>📝 <strong className="text-slate-400">Right panel</strong> — docs and client notes for that screen</li>
          <li>⬅️ ➡️ <strong className="text-slate-400">Arrow keys</strong> — step through the flow</li>
          <li>🗺️ <strong className="text-slate-400">Flow map</strong> — shows where you are in the user journey</li>
        </ul>
      </div>

      {/* Meeting info */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-lg border border-[#1A1A28] p-3 bg-[#11111B]">
          <h3 className="text-[12px] font-semibold text-slate-200 mb-1.5">Meeting</h3>
          <ul className="text-[11px] text-slate-500 space-y-0.5">
            <li><strong className="text-slate-400">Date:</strong> March 17, 2026</li>
            <li><strong className="text-slate-400">With:</strong> Joseph</li>
            <li><strong className="text-slate-400">Source:</strong> 2 FigJam boards</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[#1A1A28] p-3 bg-[#11111B]">
          <h3 className="text-[12px] font-semibold text-slate-200 mb-1.5">Platform</h3>
          <ul className="text-[11px] text-slate-500 space-y-0.5">
            <li><strong className="text-slate-400">iPad</strong> — main app for staff</li>
            <li><strong className="text-slate-400">Web</strong> — admin dashboard</li>
            <li><strong className="text-slate-400">Phone</strong> — quick actions</li>
          </ul>
        </div>
      </div>

      {/* Client annotation legend */}
      <h2 className="text-[14px] font-bold text-slate-200 mb-3">Reading Client Notes</h2>
      <p className="text-[11px] text-slate-500 mb-3">The client left sticky notes on their Figma. We show them in the docs panel. Here&apos;s what the colors mean:</p>
      <div className="space-y-2 mb-5">
        <div className="flex items-start gap-3 rounded-lg border border-[#1A1A28] p-3 bg-[#11111B]">
          <div className="w-3 h-3 rounded shrink-0 mt-0.5" style={{ background: "#4A5FC1" }} />
          <div>
            <div className="text-[11px] font-semibold text-slate-300">Blue = How it works</div>
            <div className="text-[10px] text-slate-500">Client explaining what a feature does or how the flow goes.</div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[#1A1A28] p-3 bg-[#11111B]">
          <div className="w-3 h-3 rounded shrink-0 mt-0.5" style={{ background: "#E74C3C" }} />
          <div>
            <div className="text-[11px] font-semibold text-slate-300">Red = Bug or question</div>
            <div className="text-[10px] text-slate-500">Something broken, needs fixing, or the client has a question about it.</div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[#1A1A28] p-3 bg-[#11111B]">
          <div className="w-3 h-3 rounded shrink-0 mt-0.5" style={{ background: "#F39C12" }} />
          <div>
            <div className="text-[11px] font-semibold text-slate-300">Yellow = Extra context</div>
            <div className="text-[10px] text-slate-500">Requirements or additional context like &ldquo;the user will need to add the food name&rdquo;.</div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-slate-600 italic mb-5">Question for Joseph: who wrote these annotations? One person or multiple? Do the colors mean different authors or different categories?</p>

      {/* Modules */}
      <h2 className="text-[14px] font-bold text-slate-200 mb-3">19 Modules</h2>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          "Account Creation", "Dashboard", "Areas", "Devices", "Units", "Users",
          "Settings", "Foods", "Timers", "Labels", "Temperatures", "Processes",
          "Deliveries", "Pest Control", "Calibration", "Tasks", "Checklists",
          "Complaints", "Companies",
        ].map((m) => (
          <div key={m} className="text-[10px] text-slate-500 px-2.5 py-1.5 rounded border border-[#1A1A28] bg-[#11111B]">{m}</div>
        ))}
      </div>

      {/* App colors */}
      <h2 className="text-[14px] font-bold text-slate-200 mb-3">App Colors</h2>
      <p className="text-[11px] text-slate-500 mb-2">The app uses colors to show status at a glance:</p>
      <div className="space-y-1.5 mb-5">
        {[
          { color: "#27AE60", label: "Green", meaning: "Good — safe temp, task done, pass" },
          { color: "#E74C3C", label: "Red", meaning: "Bad — unsafe temp, overdue, fail" },
          { color: "#F39C12", label: "Orange", meaning: "Warning — getting close, incomplete" },
          { color: "#95A5A6", label: "Grey", meaning: "Nothing — no data, paused, closed day" },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="text-slate-500 text-[11px]"><strong className="text-slate-300">{c.label}</strong> — {c.meaning}</span>
          </div>
        ))}
      </div>

      {/* PIN */}
      <h2 className="text-[14px] font-bold text-slate-200 mb-2">PIN System</h2>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-5">
        Every action needs a 4-digit PIN. This way the app knows WHO did WHAT and WHEN. Staff can&apos;t share PINs. Managers set them.
      </p>

      {/* Big issues */}
      <div className="rounded-lg p-4 mb-5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <h2 className="text-[14px] font-bold text-[#E74C3C] mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#E74C3C] flex items-center justify-center text-white text-[10px] font-bold">!</span>
          Critical Issues — Across All Modules
        </h2>
        <div className="space-y-2">
          {[
            { text: "66°C cooking temp shows GREEN — should be RED", detail: "Backend rule: must be 75°C+ to pass. This is a food safety risk." },
            { text: "No edit traceability", detail: "Edited records don't show who changed what or when. Audit problem." },
            { text: "Staff can delete records", detail: "Regular staff shouldn't delete. Only admin/manager should have this." },
            { text: "Labels print too small", detail: "Font sizes for name, date, USE BY are all hard to read on printed labels." },
            { text: "30-60 second delay saving temps", detail: "Manual temperature records lag. Should be instant." },
            { text: "Search broken in Labels", detail: "The search bar doesn't filter or find anything." },
          ].map((issue, i) => (
            <div key={i} className="rounded p-2" style={{ background: "rgba(239,68,68,0.06)" }}>
              <div className="text-[11px] font-semibold text-[#E74C3C]">{issue.text}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{issue.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── shared doc components (upstream-lab branded) ─── */
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

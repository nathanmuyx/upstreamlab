import type { FrameNode } from "@/lib/frames";

export const frames: FrameNode[] = [
  {
    id: "1:1",
    name: "Full App",
    description: "Complete Author Studio application with sidebar, header, and main content area.",
    tags: ["Layout", "Full Page"],
    specs: {
      spacing: { "Sidebar width": "220px", "Header height": "52px", "Content padding": "24px" },
      colors: {
        "Background": "#F7F8FA",
        "Surface": "#FFFFFF",
        "Border": "#E4E7EE",
        "Primary (Blue)": "#2563EB",
      },
      typography: {
        "Heading": "DM Sans / 18px / Bold",
        "Body": "DM Sans / 13px / Regular",
        "Caption": "DM Sans / 11px / Medium",
      },
      tokens: {
        "ma-bg": "#F7F8FA",
        "ma-surface": "#FFFFFF",
        "ma-border": "#E4E7EE",
        "ma-blue": "#2563EB",
        "ma-text": "#0F172A",
        "ma-text-sec": "#475569",
        "ma-text-muted": "#94A3B8",
      },
    },
    children: ["1:2", "1:3", "1:4", "1:5"],
  },
  {
    id: "1:2",
    name: "Sidebar Navigation",
    parentId: "1:1",
    description: "Left sidebar with logo, user info, and nav sections (Author, Typist, Admin).",
    tags: ["Navigation", "Component"],
    specs: {
      spacing: { "Width": "220px", "Logo padding": "16px 20px", "Nav item padding": "8px 12px" },
      colors: {
        "Sidebar bg": "#FAFBFC",
        "Active item bg": "#EFF3FF",
        "Active text": "#2563EB",
        "Section label": "#2563EB",
      },
      typography: {
        "Section label": "DM Sans / 10px / Bold / uppercase / tracking-wide",
        "Nav item": "DM Sans / 13px / Regular",
        "Nav item active": "DM Sans / 13px / Semibold",
      },
      tokens: {
        "ma-sidebar": "#FAFBFC",
        "ma-sidebar-active": "#EFF3FF",
        "ma-blue": "#2563EB",
      },
    },
  },
  {
    id: "1:3",
    name: "Recording - Idle State",
    parentId: "1:1",
    description: "Empty state with mic icon and 'Start Recording' CTA. Gradient icon treatment on spicy variant.",
    tags: ["State", "Empty", "CTA"],
    specs: {
      spacing: {
        "Icon size (mild)": "72px",
        "Icon size (spicy)": "100px",
        "Button padding": "12px 28px",
      },
      colors: {
        "CTA background": "#2563EB",
        "CTA shadow": "0 4px 16px rgba(37,99,235,0.3)",
        "Icon bg (spicy)": "linear-gradient(135deg, #EFF4FF, #BFDBFE)",
      },
      typography: {
        "Heading (mild)": "DM Sans / 16px / Semibold",
        "Heading (spicy)": "DM Sans / 24px / Bold",
        "Description": "DM Sans / 13-15px / Regular",
      },
    },
  },
  {
    id: "1:4",
    name: "Recording - Active",
    parentId: "1:1",
    description: "Live recording view with animated waveform, timer, and record/pause/stop controls.",
    tags: ["State", "Recording", "Interactive"],
    specs: {
      spacing: {
        "Waveform height (mild)": "100px",
        "Waveform height (spicy)": "130px",
        "Control button size": "64px",
        "Small button size": "44px",
      },
      colors: {
        "Recording dot": "#EF4444",
        "Stop button": "#EF4444",
        "Stop shadow": "0 4px 16px rgba(239,68,68,0.35)",
        "Waveform played": "#2563EB",
        "Waveform unplayed": "#CBD5E1",
      },
      typography: {
        "Timer": "DM Sans / 28px / Bold / tabular-nums",
        "Duration label": "DM Sans / 14px / Regular",
      },
      tokens: {
        "ma-red": "#EF4444",
        "ma-red-light": "#FEE2E2",
        "ma-blue": "#2563EB",
      },
    },
  },
  {
    id: "1:5",
    name: "Review - Edit Modes",
    parentId: "1:1",
    description: "Review state with Playback/Trim/Replace mode switcher. Trim uses drag-select, Replace uses click-to-set cursor.",
    tags: ["State", "Review", "Editing"],
    specs: {
      spacing: {
        "Mode switcher padding": "2px",
        "Mode button padding": "7px 16px",
        "Trim hint max-width": "480px",
      },
      colors: {
        "Play button": "#2563EB",
        "Trim selection": "rgba(245,158,11,0.2)",
        "Trim hint bg": "#FEF3C7",
        "Replace hint bg": "#EFF4FF",
        "Delete button": "#EF4444",
        "Re-record button": "#F59E0B",
      },
      typography: {
        "Mode label": "DM Sans / 12px / Medium",
        "Hint text": "DM Sans / 13px / Regular",
      },
      tokens: {
        "ma-amber": "#F59E0B",
        "ma-amber-light": "#FEF3C7",
        "ma-blue-light": "#EFF4FF",
      },
    },
  },
  {
    id: "1:6",
    name: "Waveform Component",
    description: "SVG-based waveform visualization with seek, drag-select, and replace-point interactions.",
    tags: ["Component", "SVG", "Interactive"],
    specs: {
      spacing: {
        "Bar width": "3px",
        "Bar gap": "2px",
        "Border radius": "1.5px",
      },
      colors: {
        "Played bar": "#2563EB / 0.85 opacity",
        "Unplayed bar": "#CBD5E1 / 0.35 opacity",
        "Playhead": "#2563EB / 2px wide",
        "Selection fill": "rgba(245,158,11,0.2)",
        "Replace cursor": "#EF4444 / dashed",
      },
    },
  },
  {
    id: "1:7",
    name: "Job Details Panel",
    description: "Right panel (mild/medium) or inline collapsible panel (spicy) for job metadata: client, note, typist, priority.",
    tags: ["Panel", "Form", "Component"],
    specs: {
      spacing: {
        "Panel width (side)": "260px",
        "Inline padding": "28px 16px",
        "Field gap": "16px",
      },
      colors: {
        "Panel bg": "#FFFFFF",
        "Input border": "#E4E7EE",
        "Priority switch (on)": "#2563EB",
      },
      typography: {
        "Section heading": "DM Sans / 14px / Bold",
        "Field label": "DM Sans / 11px / Semibold",
        "Input text": "DM Sans / 13px / Regular",
      },
    },
  },
  {
    id: "1:8",
    name: "Variant System",
    description: "Three variant levels that control UI complexity. Mild = basic, Medium = trim/replace, Spicy = full redesign with inline panels and gradient treatments.",
    tags: ["System", "Variants"],
    specs: {
      colors: {
        "Mild": "#3B82F6",
        "Medium": "#F59E0B",
        "Spicy": "#EF4444",
        "Variant pill bg": "{color}20",
      },
      typography: {
        "Variant label": "DM Sans / 12px / Semibold",
        "Description": "DM Sans / 10px / Regular",
      },
    },
  },
];

export const frameMap = Object.fromEntries(frames.map((f) => [f.id, f]));

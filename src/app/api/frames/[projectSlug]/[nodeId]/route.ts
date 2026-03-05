import { NextResponse } from "next/server";
import { frames } from "@/data/author-studio-frames";
import { paramToNodeId } from "@/lib/frames";

// JSON API for frame data — consumed by the Figma plugin to create auto-layout frames
// GET /api/frames/author-studio/1-1

const projectFrames: Record<string, typeof frames> = {
  "author-studio": frames,
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectSlug: string; nodeId: string }> }
) {
  const { projectSlug, nodeId: nodeIdParam } = await params;
  const allFrames = projectFrames[projectSlug];
  if (!allFrames) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const nodeId = paramToNodeId(nodeIdParam);
  const frame = allFrames.find((f) => f.id === nodeId);
  if (!frame) {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }

  // Return the frame data + a layout tree the plugin uses to build Figma nodes
  const layout = buildLayout(frame, allFrames);

  return NextResponse.json(
    { frame, layout },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}

// Describes the Figma node tree to create — auto-layout frames, text, rectangles
type FigmaNode =
  | { type: "FRAME"; name: string; layout: "HORIZONTAL" | "VERTICAL"; fill?: string; stroke?: string; padding?: number[]; gap?: number; width?: number; height?: number; cornerRadius?: number; children: FigmaNode[] }
  | { type: "TEXT"; name: string; content: string; fontSize: number; fontWeight?: number; fill: string; fontFamily?: string }
  | { type: "RECT"; name: string; width: number; height: number; fill: string; cornerRadius?: number; stroke?: string }
  | { type: "ELLIPSE"; name: string; width: number; height: number; fill: string };

function buildLayout(frame: typeof frames[0], allFrames: typeof frames): FigmaNode {
  // Build the full app layout for 1:1
  if (frame.id === "1:1") return buildFullApp();
  if (frame.id === "1:2") return buildSidebar();
  // Default: spec card
  return buildSpecCard(frame);
}

function buildFullApp(): FigmaNode {
  return {
    type: "FRAME", name: "Author Studio", layout: "HORIZONTAL", fill: "#F7F8FA", width: 1280, height: 800, cornerRadius: 12, gap: 0, padding: [0, 0, 0, 0],
    children: [
      buildSidebar(),
      {
        type: "FRAME", name: "Main", layout: "VERTICAL", fill: "#F7F8FA", gap: 0, padding: [0, 0, 0, 0],
        children: [
          // Header
          {
            type: "FRAME", name: "Header", layout: "HORIZONTAL", fill: "#FFFFFF", padding: [16, 28, 16, 28], gap: 0, height: 56, stroke: "#E4E7EE",
            children: [
              { type: "FRAME", name: "HeaderLeft", layout: "VERTICAL", gap: 2, padding: [0,0,0,0], children: [
                { type: "TEXT", name: "Title", content: "Author Studio", fontSize: 18, fontWeight: 700, fill: "#0F172A" },
                { type: "TEXT", name: "Subtitle", content: "Record and manage your dictations", fontSize: 13, fill: "#94A3B8" },
              ]},
              { type: "FRAME", name: "HeaderActions", layout: "HORIZONTAL", gap: 8, padding: [0,0,0,0], children: [
                { type: "FRAME", name: "SaveDraft", layout: "HORIZONTAL", fill: "#FFFFFF", stroke: "#E4E7EE", padding: [8, 18, 8, 18], cornerRadius: 8, gap: 0, children: [
                  { type: "TEXT", name: "SaveDraftLabel", content: "Save Draft", fontSize: 13, fontWeight: 500, fill: "#475569" },
                ]},
                { type: "FRAME", name: "SendToTypist", layout: "HORIZONTAL", fill: "#2563EB", padding: [8, 18, 8, 18], cornerRadius: 8, gap: 6, children: [
                  { type: "TEXT", name: "SendLabel", content: "Send to Typist", fontSize: 13, fontWeight: 600, fill: "#FFFFFF" },
                ]},
              ]},
            ]
          },
          // Content — Idle state
          {
            type: "FRAME", name: "Content", layout: "VERTICAL", fill: "#F7F8FA", padding: [60, 40, 60, 40], gap: 20,
            children: [
              { type: "ELLIPSE", name: "MicCircle", width: 120, height: 120, fill: "#EFF4FF" },
              { type: "TEXT", name: "Heading", content: "New Dictation", fontSize: 24, fontWeight: 700, fill: "#0F172A" },
              { type: "TEXT", name: "Description", content: "Record, edit, and send your dictation. You can trim mistakes, re-record sections, or replace audio from any point.", fontSize: 15, fill: "#94A3B8" },
              { type: "FRAME", name: "StartRecording", layout: "HORIZONTAL", fill: "#2563EB", padding: [14, 36, 14, 36], cornerRadius: 26, gap: 8, children: [
                { type: "TEXT", name: "StartLabel", content: "Start Recording", fontSize: 15, fontWeight: 600, fill: "#FFFFFF" },
              ]},
            ]
          },
        ]
      },
    ]
  };
}

function buildSidebar(): FigmaNode {
  return {
    type: "FRAME", name: "Sidebar", layout: "VERTICAL", fill: "#FAFBFC", width: 220, padding: [20, 16, 12, 16], gap: 8, stroke: "#E4E7EE",
    children: [
      // Logo
      { type: "FRAME", name: "Logo", layout: "HORIZONTAL", gap: 8, padding: [0,0,12,0], children: [
        { type: "RECT", name: "LogoMark", width: 32, height: 32, fill: "#1B2E5A", cornerRadius: 6 },
        { type: "FRAME", name: "LogoText", layout: "VERTICAL", gap: 2, padding: [0,0,0,0], children: [
          { type: "TEXT", name: "Firm1", content: "MALONEY ANDERSON", fontSize: 10, fontWeight: 700, fill: "#1B2E5A" },
          { type: "TEXT", name: "Firm2", content: "LEGAL", fontSize: 10, fontWeight: 700, fill: "#1B2E5A" },
        ]},
      ]},
      // User
      { type: "FRAME", name: "User", layout: "HORIZONTAL", gap: 8, padding: [12,0,12,0], children: [
        { type: "ELLIPSE", name: "Avatar", width: 32, height: 32, fill: "#E2E8F0" },
        { type: "FRAME", name: "UserInfo", layout: "VERTICAL", gap: 2, padding: [0,0,0,0], children: [
          { type: "TEXT", name: "UserName", content: "Sarah Chen, Esq.", fontSize: 12, fontWeight: 500, fill: "#0F172A" },
          { type: "TEXT", name: "UserEmail", content: "sarah.chen@law.com", fontSize: 10, fill: "#94A3B8" },
        ]},
      ]},
      // Nav sections
      { type: "TEXT", name: "AuthorLabel", content: "AUTHOR", fontSize: 10, fontWeight: 700, fill: "#2563EB" },
      { type: "FRAME", name: "NavDashboard", layout: "HORIZONTAL", gap: 10, padding: [8, 12, 8, 12], cornerRadius: 8, children: [
        { type: "TEXT", name: "Dashboard", content: "Dashboard", fontSize: 13, fill: "#475569" },
      ]},
      { type: "FRAME", name: "NavDictation", layout: "HORIZONTAL", gap: 10, padding: [8, 12, 8, 12], cornerRadius: 8, fill: "#EFF3FF", children: [
        { type: "TEXT", name: "AddDictation", content: "Add Dictation", fontSize: 13, fontWeight: 600, fill: "#2563EB" },
      ]},
      { type: "TEXT", name: "TypistLabel", content: "TYPIST", fontSize: 10, fontWeight: 700, fill: "#2563EB" },
      { type: "FRAME", name: "NavTranscribe", layout: "HORIZONTAL", gap: 10, padding: [8, 12, 8, 12], cornerRadius: 8, children: [
        { type: "TEXT", name: "TranscribeQueue", content: "Transcribe Queue", fontSize: 13, fill: "#475569" },
      ]},
      { type: "TEXT", name: "AdminLabel", content: "ADMIN", fontSize: 10, fontWeight: 700, fill: "#2563EB" },
      { type: "FRAME", name: "NavUsers", layout: "HORIZONTAL", gap: 10, padding: [8, 12, 8, 12], cornerRadius: 8, children: [
        { type: "TEXT", name: "UserMgmt", content: "User Management", fontSize: 13, fill: "#475569" },
      ]},
    ]
  };
}

function buildSpecCard(frame: typeof frames[0]): FigmaNode {
  const children: FigmaNode[] = [
    { type: "TEXT", name: "FrameId", content: `${frame.id} / ${(frame.tags ?? []).join(" / ")}`.toUpperCase(), fontSize: 10, fontWeight: 700, fill: "#31AD52" },
    { type: "TEXT", name: "FrameName", content: frame.name, fontSize: 24, fontWeight: 700, fill: "#0F172A" },
  ];
  if (frame.description) {
    children.push({ type: "TEXT", name: "Description", content: frame.description, fontSize: 13, fill: "#475569" });
  }
  const specs = frame.specs;
  if (specs) {
    const addSection = (title: string, entries: [string, string][], showColor = false) => {
      const rows: FigmaNode[] = [
        { type: "TEXT", name: `${title}Title`, content: title, fontSize: 10, fontWeight: 700, fill: "#94A3B8" },
      ];
      for (const [key, value] of entries) {
        const rowChildren: FigmaNode[] = [];
        if (showColor) {
          const cv = value.split(" /")[0];
          if (cv.startsWith("#")) {
            rowChildren.push({ type: "RECT", name: key + "Swatch", width: 16, height: 16, fill: cv, cornerRadius: 3 });
          }
        }
        rowChildren.push({ type: "TEXT", name: key, content: key, fontSize: 12, fill: "#0F172A" });
        rowChildren.push({ type: "TEXT", name: key + "Value", content: value, fontSize: 10, fill: "#94A3B8", fontFamily: "monospace" });
        rows.push({ type: "FRAME", name: key + "Row", layout: "HORIZONTAL", gap: 8, padding: [2, 0, 2, 0], children: rowChildren });
      }
      children.push({ type: "FRAME", name: title + "Section", layout: "VERTICAL", gap: 4, padding: [12, 0, 0, 0], children: rows });
    };
    if (specs.colors) addSection("COLORS", Object.entries(specs.colors), true);
    if (specs.spacing) addSection("SPACING", Object.entries(specs.spacing));
    if (specs.typography) addSection("TYPOGRAPHY", Object.entries(specs.typography));
    if (specs.tokens) addSection("DESIGN TOKENS", Object.entries(specs.tokens), true);
  }
  return { type: "FRAME", name: frame.name, layout: "VERTICAL", fill: "#FFFFFF", padding: [36, 36, 36, 36], gap: 8, cornerRadius: 12, stroke: "#E2E8F0", width: 720, children };
}

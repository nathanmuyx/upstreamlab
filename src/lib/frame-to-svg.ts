// Generates native SVG (rect, text, circle, path) that Figma parses into editable layers.
// Each frame ID maps to a hand-built SVG that matches the rendered prototype.

const F = "'DM Sans', system-ui, sans-serif";
const S = "'DM Sans', serif";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Full App (1:1) — The complete Author Studio idle state ──
function fullAppSvg(): string {
  const W = 1280, H = 800;
  const SB = 220; // sidebar width
  const HH = 56;  // header height
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#F7F8FA" rx="12"/>
  <rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" fill="none" stroke="#E4E7EE" rx="12"/>

  <!-- ═══ SIDEBAR ═══ -->
  <g id="Sidebar">
    <rect x="0" y="0" width="${SB}" height="${H}" fill="#FAFBFC" rx="12"/>
    <rect x="0" y="0" width="${SB}" height="${H}" fill="#FAFBFC"/>
    <line x1="${SB}" y1="0" x2="${SB}" y2="${H}" stroke="#E4E7EE"/>

    <!-- Logo -->
    <g id="Logo" transform="translate(16, 20)">
      <rect width="32" height="32" rx="6" fill="#1B2E5A"/>
      <text x="16" y="21" fill="white" font-family="${S}" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="1">MA</text>
      <text x="42" y="13" fill="#1B2E5A" font-family="${S}" font-size="10" font-weight="700" letter-spacing="1">MALONEY ANDERSON</text>
      <text x="42" y="27" fill="#1B2E5A" font-family="${S}" font-size="10" font-weight="700" letter-spacing="1">LEGAL</text>
    </g>

    <!-- User -->
    <line x1="16" y1="64" x2="${SB-16}" y2="64" stroke="#E4E7EE"/>
    <g id="User" transform="translate(16, 76)">
      <circle cx="16" cy="16" r="16" fill="#E2E8F0"/>
      <path d="M16 10a4 4 0 110 8 4 4 0 010-8zM8 26a8 8 0 0116 0" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
      <text x="42" y="12" fill="#0F172A" font-family="${F}" font-size="12" font-weight="500">Sarah Chen, Esq.</text>
      <text x="42" y="28" fill="#94A3B8" font-family="${F}" font-size="10">sarah.chen@law.com</text>
    </g>

    <!-- Nav: AUTHOR -->
    <g id="NavAuthor" transform="translate(16, 130)">
      <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">AUTHOR</text>

      <!-- Dashboard -->
      <g transform="translate(0, 14)">
        <rect x="0" y="0" width="${SB-32}" height="36" rx="8" fill="transparent"/>
        <rect x="12" y="10" width="6" height="6" rx="1" fill="none" stroke="#475569" stroke-width="1.5"/>
        <rect x="20" y="10" width="6" height="6" rx="1" fill="none" stroke="#475569" stroke-width="1.5"/>
        <rect x="12" y="18" width="6" height="6" rx="1" fill="none" stroke="#475569" stroke-width="1.5"/>
        <rect x="20" y="18" width="6" height="6" rx="1" fill="none" stroke="#475569" stroke-width="1.5"/>
        <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">Dashboard</text>
      </g>

      <!-- Add Dictation (active) -->
      <g transform="translate(0, 52)">
        <rect x="0" y="0" width="${SB-32}" height="36" rx="8" fill="#EFF3FF"/>
        <circle cx="20" cy="18" r="8" fill="none" stroke="#2563EB" stroke-width="1.5"/>
        <line x1="20" y1="14" x2="20" y2="22" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/>
        <text x="36" y="22" fill="#2563EB" font-family="${F}" font-size="13" font-weight="600">Add Dictation</text>
      </g>
    </g>

    <!-- Nav: TYPIST -->
    <g id="NavTypist" transform="translate(16, 240)">
      <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">TYPIST</text>
      <g transform="translate(0, 14)">
        <rect x="0" y="0" width="${SB-32}" height="36" rx="8" fill="transparent"/>
        <line x1="12" y1="12" x2="26" y2="12" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="18" x2="26" y2="18" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="24" x2="26" y2="24" stroke="#475569" stroke-width="1.5" stroke-linecap="round"/>
        <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">Transcribe Queue</text>
      </g>
    </g>

    <!-- Nav: ADMIN -->
    <g id="NavAdmin" transform="translate(16, 310)">
      <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">ADMIN</text>
      <g transform="translate(0, 14)">
        <rect x="0" y="0" width="${SB-32}" height="36" rx="8" fill="transparent"/>
        <circle cx="20" cy="14" r="6" fill="none" stroke="#475569" stroke-width="1.5"/>
        <path d="M10 28c0-6 6-10 10-10s10 4 10 10" fill="none" stroke="#475569" stroke-width="1.5"/>
        <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">User Management</text>
      </g>
    </g>

    <!-- Collapse -->
    <g id="Collapse" transform="translate(0, ${H - 44})">
      <line x1="0" y1="0" x2="${SB}" y2="0" stroke="#E4E7EE"/>
      <path d="M${SB/2 + 3} ${22 - 4}l-6 4 6 4" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- ═══ HEADER ═══ -->
  <g id="Header">
    <rect x="${SB}" y="0" width="${W-SB}" height="${HH}" fill="white"/>
    <line x1="${SB}" y1="${HH}" x2="${W}" y2="${HH}" stroke="#E4E7EE"/>

    <text x="${SB + 28}" y="26" fill="#0F172A" font-family="${F}" font-size="18" font-weight="700">Author Studio</text>
    <text x="${SB + 28}" y="44" fill="#94A3B8" font-family="${F}" font-size="13">Record and manage your dictations</text>

    <!-- Save Draft button -->
    <g id="SaveDraft" transform="translate(${W - 290}, 12)">
      <rect width="100" height="34" rx="8" fill="white" stroke="#E4E7EE"/>
      <text x="50" y="22" fill="#475569" font-family="${F}" font-size="13" font-weight="500" text-anchor="middle">Save Draft</text>
    </g>

    <!-- Send to Typist button -->
    <g id="SendTypist" transform="translate(${W - 178}, 12)">
      <rect width="150" height="34" rx="8" fill="#2563EB"/>
      <path d="M24 17l8-4-8 4v-6l8 10-8-4z" fill="white" transform="translate(4, 0)"/>
      <text x="82" y="22" fill="white" font-family="${F}" font-size="13" font-weight="600" text-anchor="middle">Send to Typist</text>
    </g>
  </g>

  <!-- ═══ MAIN CONTENT — Idle State ═══ -->
  <g id="IdleState">
    <!-- Mic circle -->
    <circle cx="${SB + (W-SB)/2}" cy="${HH + (H-HH)/2 - 80}" r="60" fill="#EFF4FF"/>
    <circle cx="${SB + (W-SB)/2}" cy="${HH + (H-HH)/2 - 80}" r="44" fill="#DBEAFE" opacity="0.5"/>
    <!-- Mic icon -->
    <g transform="translate(${SB + (W-SB)/2 - 12}, ${HH + (H-HH)/2 - 104})">
      <rect x="4" y="0" width="16" height="28" rx="8" fill="none" stroke="#2563EB" stroke-width="2.5"/>
      <path d="M0 20c0 8 5.5 14 12 14s12-6 12-14" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="12" y1="34" x2="12" y2="40" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
    </g>

    <!-- Heading -->
    <text x="${SB + (W-SB)/2}" y="${HH + (H-HH)/2 + 20}" fill="#0F172A" font-family="${F}" font-size="24" font-weight="700" text-anchor="middle">New Dictation</text>

    <!-- Description -->
    <text x="${SB + (W-SB)/2}" y="${HH + (H-HH)/2 + 50}" fill="#94A3B8" font-family="${F}" font-size="15" text-anchor="middle">Record, edit, and send your dictation. You can trim</text>
    <text x="${SB + (W-SB)/2}" y="${HH + (H-HH)/2 + 70}" fill="#94A3B8" font-family="${F}" font-size="15" text-anchor="middle">mistakes, re-record sections, or replace audio from any point.</text>

    <!-- Start Recording button -->
    <g id="StartRecording" transform="translate(${SB + (W-SB)/2 - 110}, ${HH + (H-HH)/2 + 100})">
      <rect width="220" height="52" rx="26" fill="#2563EB"/>
      <rect width="220" height="52" rx="26" fill="url(#btnShadow)" opacity="0.15"/>
      <!-- Mic icon small -->
      <g transform="translate(56, 14)">
        <rect x="4" y="0" width="12" height="20" rx="6" fill="none" stroke="white" stroke-width="2"/>
        <path d="M0 14c0 6 4.5 10 10 10s10-4 10-10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </g>
      <text x="130" y="32" fill="white" font-family="${F}" font-size="15" font-weight="600" text-anchor="middle">Start Recording</text>
    </g>
  </g>

  <defs>
    <linearGradient id="btnShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0"/>
      <stop offset="1" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
</svg>`;
}

// ── Sidebar only (1:2) ──
function sidebarSvg(): string {
  // Reuse the sidebar group from fullApp but standalone
  const W = 220, H = 600;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FAFBFC" rx="10"/>
  <rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" fill="none" stroke="#E4E7EE" rx="10"/>

  <!-- Logo -->
  <g transform="translate(16, 20)">
    <rect width="32" height="32" rx="6" fill="#1B2E5A"/>
    <text x="16" y="21" fill="white" font-family="${S}" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="1">MA</text>
    <text x="42" y="13" fill="#1B2E5A" font-family="${S}" font-size="10" font-weight="700" letter-spacing="1">MALONEY ANDERSON</text>
    <text x="42" y="27" fill="#1B2E5A" font-family="${S}" font-size="10" font-weight="700" letter-spacing="1">LEGAL</text>
  </g>

  <line x1="16" y1="64" x2="${W-16}" y2="64" stroke="#E4E7EE"/>

  <!-- User -->
  <g transform="translate(16, 76)">
    <circle cx="16" cy="16" r="16" fill="#E2E8F0"/>
    <path d="M16 10a4 4 0 110 8 4 4 0 010-8zM8 26a8 8 0 0116 0" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
    <text x="42" y="12" fill="#0F172A" font-family="${F}" font-size="12" font-weight="500">Sarah Chen, Esq.</text>
    <text x="42" y="28" fill="#94A3B8" font-family="${F}" font-size="10">sarah.chen@law.com</text>
  </g>

  <!-- AUTHOR -->
  <g transform="translate(16, 130)">
    <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">AUTHOR</text>
    <g transform="translate(0, 14)">
      <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">Dashboard</text>
    </g>
    <g transform="translate(0, 52)">
      <rect x="0" y="0" width="${W-32}" height="36" rx="8" fill="#EFF3FF"/>
      <text x="36" y="22" fill="#2563EB" font-family="${F}" font-size="13" font-weight="600">Add Dictation</text>
    </g>
  </g>

  <!-- TYPIST -->
  <g transform="translate(16, 240)">
    <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">TYPIST</text>
    <g transform="translate(0, 14)">
      <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">Transcribe Queue</text>
    </g>
  </g>

  <!-- ADMIN -->
  <g transform="translate(16, 310)">
    <text x="8" y="0" fill="#2563EB" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1">ADMIN</text>
    <g transform="translate(0, 14)">
      <text x="36" y="22" fill="#475569" font-family="${F}" font-size="13">User Management</text>
    </g>
  </g>
</svg>`;
}

// ── Spec card fallback for frames without a visual SVG ──
export function frameSpecToSvg(frame: import("./frames").FrameNode): string {
  const W = 720;
  const PAD = 36;
  let y = PAD;
  const parts: string[] = [];
  const MONO = "'JetBrains Mono', monospace";

  const tagLine = [frame.id, ...(frame.tags ?? [])].join(" / ");
  parts.push(`<text x="${PAD}" y="${y + 10}" fill="#31AD52" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1.5">${esc(tagLine.toUpperCase())}</text>`);
  y += 26;
  parts.push(`<text x="${PAD}" y="${y + 20}" fill="#0F172A" font-family="${F}" font-size="24" font-weight="700">${esc(frame.name)}</text>`);
  y += 34;
  if (frame.description) {
    parts.push(`<text x="${PAD}" y="${y + 14}" fill="#475569" font-family="${F}" font-size="13">${esc(frame.description)}</text>`);
    y += 28;
  }
  y += 16;

  const specs = frame.specs;
  if (!specs) return wrapSvg(W, y + PAD, parts);

  const colWidth = (W - PAD * 2 - 24) / 2;
  const sections: { title: string; entries: [string, string][]; showSwatch?: boolean }[] = [];
  if (specs.colors && Object.keys(specs.colors).length > 0) sections.push({ title: "COLORS", entries: Object.entries(specs.colors), showSwatch: true });
  if (specs.spacing && Object.keys(specs.spacing).length > 0) sections.push({ title: "SPACING", entries: Object.entries(specs.spacing) });
  if (specs.typography && Object.keys(specs.typography).length > 0) sections.push({ title: "TYPOGRAPHY", entries: Object.entries(specs.typography) });
  if (specs.tokens && Object.keys(specs.tokens).length > 0) sections.push({ title: "DESIGN TOKENS", entries: Object.entries(specs.tokens), showSwatch: true });

  let col = 0;
  const colY = [y, y];
  for (const section of sections) {
    const x = PAD + col * (colWidth + 24);
    let sy = colY[col];
    parts.push(`<line x1="${x}" y1="${sy}" x2="${x + colWidth}" y2="${sy}" stroke="#E2E8F0"/>`);
    sy += 16;
    parts.push(`<text x="${x}" y="${sy}" fill="#94A3B8" font-family="${F}" font-size="10" font-weight="700" letter-spacing="1.2">${section.title}</text>`);
    sy += 18;
    for (const [key, value] of section.entries) {
      if (section.showSwatch) {
        const cv = value.split(" /")[0];
        if (cv.startsWith("#") || cv.startsWith("rgb")) {
          parts.push(`<rect x="${x}" y="${sy - 9}" width="14" height="14" rx="3" fill="${esc(cv)}" stroke="#E2E8F0" stroke-width="0.5"/>`);
        }
        parts.push(`<text x="${x + 22}" y="${sy}" fill="#0F172A" font-family="${F}" font-size="12">${esc(key)}</text>`);
      } else {
        parts.push(`<text x="${x}" y="${sy}" fill="#0F172A" font-family="${F}" font-size="12">${esc(key)}</text>`);
      }
      parts.push(`<text x="${x + colWidth}" y="${sy}" fill="#94A3B8" font-family="${MONO}" font-size="10" text-anchor="end">${esc(value)}</text>`);
      sy += 22;
    }
    colY[col] = sy + 12;
    col = col === 0 ? 1 : 0;
  }
  return wrapSvg(W, Math.max(colY[0], colY[1]) + PAD, parts);
}

function wrapSvg(w: number, h: number, parts: string[]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="white" rx="12"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="#E2E8F0" rx="12"/>
  ${parts.join("\n  ")}
</svg>`;
}

// ── Registry: maps frame ID → SVG generator ──
const frameSvgMap: Record<string, () => string> = {
  "1:1": fullAppSvg,
  "1:2": sidebarSvg,
};

// Get SVG for a frame — returns the visual SVG if available, spec card fallback otherwise
export function getFrameSvg(frame: import("./frames").FrameNode): string {
  const generator = frameSvgMap[frame.id];
  if (generator) return generator();
  return frameSpecToSvg(frame);
}

// Copy SVG to clipboard — Figma reads text/plain SVG and creates editable layers
export async function copySvgToClipboard(svg: string): Promise<void> {
  await navigator.clipboard.writeText(svg);
}

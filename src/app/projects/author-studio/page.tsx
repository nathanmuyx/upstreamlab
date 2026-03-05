"use client";

import { useState } from "react";
import SpicyPrototype from "@/components/prototype/SpicyPrototype";
import { mediumCode } from "@/components/variantCode";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function UpstreamLogo() {
  return (
    <svg viewBox="0 0 608.44 669.96" fill="none" width={18} height={20}>
      <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upL)" />
      <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
      <defs>
        <linearGradient id="upL" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function highlightCode(code: string): string {
  const esc = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const keywords = new Set([
    "const","let","var","function","return","import","from","export","default",
    "if","else","new","type","interface","class","async","await","typeof",
    "null","undefined","true","false","this","style","onClick","useState",
    "useEffect","useRef","useCallback",
  ]);
  const token = /\/\/.*$|\/\*[\s\S]*?\*\/|(["'])(?:(?!\1|\\).|\\.)*\1|&lt;\/?[\w]+|[A-Za-z_]\w*|\d+\.?\d*/gm;
  return esc.replace(token, (m) => {
    if (m.startsWith("//") || m.startsWith("/*")) return `<span style="color:#475569">${m}</span>`;
    if ((m.startsWith('"') || m.startsWith("'")) && m.length >= 2) return `<span style="color:#31AD52">${m}</span>`;
    if (m.startsWith("&lt;")) {
      const tag = m.replace(/^&lt;\/?/, "");
      return m.replace(tag, `<span style="color:#60A5FA">${tag}</span>`);
    }
    if (/^[A-Za-z_]/.test(m)) {
      if (keywords.has(m)) return `<span style="color:#C084FC">${m}</span>`;
      if (/^[A-Z]/.test(m)) return `<span style="color:#60A5FA">${m}</span>`;
      return m;
    }
    if (/^\d/.test(m)) return `<span style="color:#F59E0B">${m}</span>`;
    return m;
  });
}

export default function AuthorStudioPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mediumCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] font-sans">

      {/* LEFT: Preview */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-[18px] py-2.5 border-b border-[#1A1A28] shrink-0 bg-[#0A0A12]/95 backdrop-blur-[12px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <UpstreamLogo />
            <span className="text-[15px] font-bold text-slate-200 tracking-tight">
              upstream<span className="text-[#31AD52]">lab</span>
            </span>
          </Link>

          <span className="text-[13px] font-semibold text-slate-400">Dictation</span>

          <div className="flex items-center gap-3">
            <Link
              href="/projects/author-studio/docs"
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#31AD52]/10 text-[#31AD52] hover:bg-[#31AD52]/20 no-underline transition-all flex items-center gap-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              Docs
            </Link>
          </div>
        </div>

        {/* Browser window */}
        <div className="flex-1 p-[10px_12px_12px] overflow-hidden flex flex-col">
          <div className="flex-1 flex flex-col rounded-[10px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)]">
            {/* Chrome */}
            <div className="h-[34px] bg-[#F1F3F8] border-b border-[#DEE2EA] flex items-center px-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-[320px] mx-auto py-[3px] px-3 bg-white rounded-[5px] border border-[#DEE2EA] text-[11px] text-ma-text-muted text-center">
                app.maloneyanderson.com/studio
              </div>
            </div>

            {/* Prototype */}
            <div className="flex-1 overflow-hidden bg-white">
              <SpicyPrototype variant="medium" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Code panel */}
      <div className="w-[480px] shrink-0 flex flex-col border-l border-[#1A1A28] bg-[#0D0D14]">
        {/* File header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1A1A28] shrink-0">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-md bg-[#1E1E2A] text-xs font-semibold text-[#C8CCD4] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              Dictation.tsx
            </div>
            <span className="text-[10px] text-ma-text-sec">
              {mediumCode.split("\n").length} lines
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`text-[11px] font-medium border-[#1E1E2A] bg-transparent ${
              copied ? "bg-[#31AD52]/10 text-[#31AD52] border-[#31AD52]/30" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {copied ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>Copied!</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>Copy</>
            )}
          </Button>
        </div>

        {/* Code */}
        <pre className="flex-1 m-0 px-[18px] py-3.5 overflow-auto leading-[1.65] text-xs" style={{ tabSize: 2 }}>
          <code
            className="font-mono text-slate-300"
            dangerouslySetInnerHTML={{ __html: highlightCode(mediumCode) }}
          />
        </pre>
      </div>
    </div>
  );
}

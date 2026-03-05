"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Frame from "@/components/docs/Frame";
import FrameInspector from "@/components/docs/FrameInspector";
import DocsSidebar from "@/components/docs/DocsSidebar";
import type { FrameNode } from "@/lib/frames";
import { paramToNodeId, nodeIdToParam } from "@/lib/frames";
import { frames, frameMap } from "@/data/author-studio-frames";
import SpicyPrototype from "@/components/prototype/SpicyPrototype";
import Link from "next/link";

function DocsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nodeParam = searchParams.get("node-id");
  const initialId = nodeParam ? paramToNodeId(nodeParam) : null;

  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  useEffect(() => {
    if (nodeParam) {
      const id = paramToNodeId(nodeParam);
      setSelectedId(id);
      // Scroll to frame
      const el = document.getElementById(`frame-${nodeIdToParam(id)}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [nodeParam]);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      router.push(`?node-id=${nodeIdToParam(id)}`, { scroll: false });
    },
    [router]
  );

  const selectedNode = selectedId ? frameMap[selectedId] ?? null : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] font-sans text-slate-200">
      {/* Left: Frame tree */}
      <DocsSidebar
        frames={frames}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {/* Center: Frames canvas */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1A1A28] shrink-0 bg-[#0A0A12]/95 backdrop-blur-[12px]">
          <div className="flex items-center gap-3">
            <Link href="/projects/author-studio" className="flex items-center gap-2 no-underline">
              <svg viewBox="0 0 608.44 669.96" fill="none" width={18} height={20}>
                <path d="M405.72,366.23c0,28.07-11.42,53.33-29.76,71.67-18.34,18.48-43.73,29.77-71.67,29.77-56,0-101.43-45.42-101.43-101.43v-51.35L0,197.22v168.44c0,168.16,136.28,304.29,304.29,304.29s304.15-136.14,304.15-304.29V117.52L405.72,0v366.23Z" fill="url(#upD)" />
                <polygon points="405.72 197.22 202.86 314.88 202.86 79.57 405.72 197.22" fill="#31AD52" />
                <defs>
                  <linearGradient id="upD" x1="648" y1="33" x2="80" y2="553" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#3bc361" stopOpacity="0.2" /><stop offset="1" stopColor="#31AD52" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[14px] font-bold text-slate-200 tracking-tight">
                upstream<span className="text-[#31AD52]">lab</span>
              </span>
            </Link>
            <div className="w-px h-4 bg-[#1A1A28]" />
            <span className="text-[13px] font-semibold text-white">Author Studio</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#31AD52]/10 text-[#31AD52]">
              Docs
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects/author-studio"
              className="text-[11px] text-slate-500 hover:text-slate-300 no-underline flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Preview
            </Link>
            <span className="text-[10px] text-slate-600">
              {frames.length} frames
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-[900px] mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#31AD52] mb-1">
                Developer Handoff
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
                Author Studio
              </h1>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                Dictation platform with recording, trimming, and replace-from-cursor workflows.
                Click any frame to inspect specs, tokens, and copy references.
              </p>
              <div className="px-4 py-3 rounded-[10px] bg-[#31AD52]/5 border border-[#31AD52]/10">
                <p className="text-[12px] text-[#31AD52] font-semibold mb-1">Import to Figma</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Hover any frame and click <span className="text-[#31AD52] font-medium">Copy to Figma</span>.
                  In Figma, run the <span className="text-white font-medium">upstream-lab</span> plugin and paste the URL.
                  Frames are created with <span className="text-white font-medium">auto-layout</span>, editable text, and proper fills.
                </p>
              </div>
            </div>

            {/* Live prototype frame */}
            <Frame
              node={frameMap["1:1"]}
              projectSlug="author-studio"
              isSelected={selectedId === "1:1"}
              onSelect={handleSelect}
            >
              <div className="h-[500px] overflow-hidden">
                <SpicyPrototype variant="spicy" />
              </div>
            </Frame>

            {/* Component frames */}
            <div className="grid grid-cols-1 gap-5">
              {frames.filter((f) => f.id !== "1:1").map((frame) => (
                <Frame
                  key={frame.id}
                  node={frame}
                  projectSlug="author-studio"
                  isSelected={selectedId === frame.id}
                  onSelect={handleSelect}
                >
                  <FrameContent frame={frame} />
                </Frame>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Inspector */}
      <FrameInspector node={selectedNode} projectSlug="author-studio" />
    </div>
  );
}

export default function AuthorStudioDocsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-[#0A0A12] items-center justify-center text-slate-500">Loading...</div>}>
      <DocsContent />
    </Suspense>
  );
}

// Render appropriate content for each frame
function FrameContent({ frame }: { frame: FrameNode }) {
  const specs = frame.specs;
  if (!specs) {
    return (
      <div className="px-6 py-10 text-center text-[13px] text-slate-600">
        {frame.description}
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      {frame.description && (
        <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">{frame.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {specs.colors && Object.keys(specs.colors).length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-2">Colors</h4>
            <div className="flex flex-col gap-1.5">
              {Object.entries(specs.colors).map(([name, value]) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-sm border border-[#2A2A3A] shrink-0"
                    style={{ background: value.includes("gradient") || value.includes("rgba") ? value : value.split(" /")[0] }}
                  />
                  <span className="text-[11px] text-slate-400">{name}</span>
                  <span className="text-[10px] font-mono text-slate-600 ml-auto">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {specs.spacing && Object.keys(specs.spacing).length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-2">Spacing</h4>
            <div className="flex flex-col gap-1.5">
              {Object.entries(specs.spacing).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{name}</span>
                  <span className="text-[10px] font-mono text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {specs.typography && Object.keys(specs.typography).length > 0 && (
          <div className="col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-2">Typography</h4>
            <div className="flex flex-col gap-1.5">
              {Object.entries(specs.typography).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{name}</span>
                  <span className="text-[10px] font-mono text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {frame.tags && frame.tags.length > 0 && (
        <div className="flex gap-1.5 mt-4 pt-3 border-t border-[#1A1A28]">
          {frame.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1A1A28] text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

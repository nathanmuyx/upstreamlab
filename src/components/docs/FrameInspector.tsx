"use client";

import { useState } from "react";
import type { FrameNode } from "@/lib/frames";
import { getNodeUrl, nodeIdToParam } from "@/lib/frames";
import { cn } from "@/lib/utils";

type Tab = "specs" | "tokens" | "notes";

export default function FrameInspector({
  node,
  projectSlug,
}: {
  node: FrameNode | null;
  projectSlug: string;
}) {
  const [tab, setTab] = useState<Tab>("specs");

  if (!node) {
    return (
      <div className="w-[300px] shrink-0 border-l border-[#1A1A28] bg-[#0D0D14] flex flex-col items-center justify-center text-center px-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2A2A3A" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-[13px] text-slate-600 mt-3">Select a frame to inspect</p>
        <p className="text-[11px] text-slate-700 mt-1">Click any frame to see its specs, tokens, and notes</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "specs", label: "Specs" },
    { id: "tokens", label: "Tokens" },
    { id: "notes", label: "Notes" },
  ];

  const nodeUrl = getNodeUrl(projectSlug, node.id);

  return (
    <div className="w-[300px] shrink-0 border-l border-[#1A1A28] bg-[#0D0D14] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1A1A28]">
        <div className="flex items-center gap-2 mb-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#31AD52" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span className="text-[13px] font-semibold text-white">{node.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-600">node-id: {node.id}</span>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.origin + nodeUrl)}
            className="text-[10px] text-[#31AD52] hover:underline cursor-pointer bg-transparent border-none"
          >
            copy ref
          </button>
        </div>
        {node.description && (
          <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">{node.description}</p>
        )}
      </div>

      {/* Tags */}
      {node.tags && node.tags.length > 0 && (
        <div className="px-4 py-2 border-b border-[#1A1A28] flex flex-wrap gap-1">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1A1A28] text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1A1A28]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2 text-[11px] font-semibold border-none cursor-pointer transition-all",
              tab === t.id
                ? "bg-[#1A1A28] text-white"
                : "bg-transparent text-slate-600 hover:text-slate-400"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-3">
        {tab === "specs" && (
          <div className="flex flex-col gap-4">
            {node.specs?.spacing && Object.keys(node.specs.spacing).length > 0 && (
              <SpecSection title="Spacing" entries={node.specs.spacing} />
            )}
            {node.specs?.colors && Object.keys(node.specs.colors).length > 0 && (
              <SpecSection title="Colors" entries={node.specs.colors} showColor />
            )}
            {node.specs?.typography && Object.keys(node.specs.typography).length > 0 && (
              <SpecSection title="Typography" entries={node.specs.typography} />
            )}
          </div>
        )}

        {tab === "tokens" && (
          <div className="flex flex-col gap-2">
            {node.specs?.tokens && Object.entries(node.specs.tokens).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-[#1A1A28]">
                <span className="text-[11px] font-mono text-[#31AD52]">--{key}</span>
                <span className="text-[11px] font-mono text-slate-500">{value}</span>
              </div>
            ))}
            {(!node.specs?.tokens || Object.keys(node.specs.tokens).length === 0) && (
              <p className="text-[11px] text-slate-600">No tokens defined</p>
            )}
          </div>
        )}

        {tab === "notes" && (
          <div className="text-[12px] text-slate-400 leading-relaxed">
            {node.description || "No notes for this frame."}
          </div>
        )}
      </div>

      {/* Footer: node path */}
      <div className="px-4 py-2.5 border-t border-[#1A1A28] text-[10px] text-slate-700 font-mono truncate">
        {nodeUrl}
      </div>
    </div>
  );
}

function SpecSection({
  title,
  entries,
  showColor,
}: {
  title: string;
  entries: Record<string, string>;
  showColor?: boolean;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">{title}</h4>
      <div className="flex flex-col gap-1">
        {Object.entries(entries).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-1 border-b border-[#1A1A28]/50">
            <span className="text-[11px] text-slate-400">{key}</span>
            <div className="flex items-center gap-1.5">
              {showColor && (
                <div
                  className="w-3 h-3 rounded-sm border border-[#2A2A3A]"
                  style={{ background: value }}
                />
              )}
              <span className="text-[11px] font-mono text-slate-500">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

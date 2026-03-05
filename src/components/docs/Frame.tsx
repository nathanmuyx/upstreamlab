"use client";

import { useState, useCallback } from "react";
import { getNodeUrl, nodeIdToParam, type FrameNode } from "@/lib/frames";
import { getFrameSvg, copySvgToClipboard } from "@/lib/frame-to-svg";
import { cn } from "@/lib/utils";

type FrameProps = {
  node: FrameNode;
  projectSlug: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
};

export default function Frame({
  node,
  projectSlug,
  isSelected,
  onSelect,
  children,
}: FrameProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "copied-link">("idle");

  // Copy SVG to clipboard — Figma parses pasted SVG into editable vector layers
  const handleCopyForFigma = useCallback(async () => {
    const svg = getFrameSvg(node);
    await copySvgToClipboard(svg);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 3000);
  }, [node]);

  const handleCopyLink = useCallback(async () => {
    const url = window.location.origin + getNodeUrl(projectSlug, node.id);
    await navigator.clipboard.writeText(url);
    setCopyState("copied-link");
    setTimeout(() => setCopyState("idle"), 2500);
  }, [projectSlug, node.id]);

  return (
    <div
      id={`frame-${node.id.replace(":", "-")}`}
      data-node-id={node.id}
      className={cn(
        "group relative rounded-[12px] border transition-all duration-200",
        isSelected
          ? "border-[#31AD52] shadow-[0_0_0_1px_rgba(49,173,82,0.3),0_4px_24px_rgba(49,173,82,0.08)]"
          : "border-[#1E1E2A] hover:border-[#2A2A3A]"
      )}
      onClick={() => onSelect?.(node.id)}
    >
      {/* Frame header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E1E2A] bg-[#0D0D16] rounded-t-[12px]">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#31AD52" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span className="text-[12px] font-semibold text-slate-300">{node.name}</span>
          <span className="text-[10px] text-slate-600 font-mono">{node.id}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
            className="px-2 py-1 rounded-md text-[10px] font-medium bg-transparent border border-[#2A2A3A] text-slate-500 hover:text-slate-300 hover:border-[#3A3A4A] cursor-pointer transition-all"
          >
            {copyState === "copied-link" ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCopyForFigma(); }}
            className={cn(
              "px-2 py-1 rounded-md text-[10px] font-medium border cursor-pointer transition-all",
              copyState === "copied"
                ? "bg-[#31AD52]/20 border-[#31AD52]/40 text-[#31AD52]"
                : "bg-[#31AD52]/10 border-[#31AD52]/20 text-[#31AD52] hover:bg-[#31AD52]/20"
            )}
          >
            {copyState === "copied" ? "Copied! Paste in Figma plugin" : "Copy to Figma"}
          </button>
        </div>
      </div>

      {/* Frame content */}
      <div className="bg-white rounded-b-[12px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

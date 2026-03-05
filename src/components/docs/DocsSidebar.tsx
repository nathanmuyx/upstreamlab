"use client";

import type { FrameNode } from "@/lib/frames";
import { cn } from "@/lib/utils";

export default function DocsSidebar({
  frames,
  selectedId,
  onSelect,
}: {
  frames: FrameNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Group frames by parent
  const roots = frames.filter((f) => !f.parentId);
  const childrenOf = (parentId: string) => frames.filter((f) => f.parentId === parentId);

  return (
    <div className="w-[220px] shrink-0 border-r border-[#1A1A28] bg-[#0A0A12] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1A1A28]">
        <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#31AD52]">
          Frames
        </span>
      </div>

      <div className="flex-1 overflow-auto py-1">
        {roots.map((frame) => (
          <FrameTreeItem
            key={frame.id}
            frame={frame}
            childrenOf={childrenOf}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={0}
          />
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-[#1A1A28] text-[10px] text-slate-700">
        {frames.length} frames
      </div>
    </div>
  );
}

function FrameTreeItem({
  frame,
  childrenOf,
  selectedId,
  onSelect,
  depth,
}: {
  frame: FrameNode;
  childrenOf: (id: string) => FrameNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  depth: number;
}) {
  const children = childrenOf(frame.id);
  const isSelected = selectedId === frame.id;

  return (
    <>
      <button
        onClick={() => onSelect(frame.id)}
        className={cn(
          "w-full text-left px-3 py-1.5 flex items-center gap-2 border-none cursor-pointer transition-all text-[12px]",
          isSelected
            ? "bg-[#31AD52]/10 text-[#31AD52]"
            : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-[#1A1A28]/50"
        )}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {children.length > 0 ? (
            <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></>
          ) : (
            <rect x="3" y="3" width="18" height="18" rx="2" />
          )}
        </svg>
        <span className="truncate font-medium">{frame.name}</span>
        <span className="text-[9px] text-slate-700 font-mono ml-auto shrink-0">{frame.id}</span>
      </button>
      {children.map((child) => (
        <FrameTreeItem
          key={child.id}
          frame={child}
          childrenOf={childrenOf}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </>
  );
}

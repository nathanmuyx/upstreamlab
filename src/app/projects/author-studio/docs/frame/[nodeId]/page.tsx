"use client";

import { use } from "react";
import { paramToNodeId } from "@/lib/frames";
import { frameMap } from "@/data/author-studio-frames";
import SpicyPrototype from "@/components/prototype/SpicyPrototype";
import Sidebar from "@/components/prototype/Sidebar";

// Standalone frame page — no app chrome, just the frame content.
// This URL is what you paste into the html.to.design Figma plugin.
// e.g. http://localhost:3000/projects/author-studio/docs/frame/1-1

export default function StandaloneFramePage({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}) {
  const { nodeId: nodeIdParam } = use(params);
  const nodeId = paramToNodeId(nodeIdParam);
  const frame = frameMap[nodeId];

  if (!frame) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui", color: "#666" }}>
        Frame not found: {nodeId}
      </div>
    );
  }

  // For the full app frame, render the live prototype
  if (nodeId === "1:1") {
    return (
      <div style={{ width: 1280, height: 800, overflow: "hidden" }}>
        <SpicyPrototype variant="spicy" />
      </div>
    );
  }

  // For the sidebar frame, render just the sidebar
  if (nodeId === "1:2") {
    return (
      <div style={{ width: 220, height: 600, overflow: "hidden" }}>
        <Sidebar />
      </div>
    );
  }

  // For other frames, render a spec card that Figma can import
  return (
    <div
      style={{
        width: 800,
        padding: 40,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Frame title */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            color: "#31AD52",
            marginBottom: 6,
          }}
        >
          {frame.id} / {frame.tags?.join(" / ")}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
          {frame.name}
        </div>
        {frame.description && (
          <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            {frame.description}
          </div>
        )}
      </div>

      {/* Specs grid */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const }}>
        {frame.specs?.colors && Object.keys(frame.specs.colors).length > 0 && (
          <SpecBlock title="Colors">
            {Object.entries(frame.specs.colors).map(([name, value]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: "1px solid #E2E8F0",
                    backgroundColor: value.includes("gradient") || value.includes("rgba")
                      ? undefined
                      : value.split(" /")[0],
                    background: value.includes("gradient") ? value : undefined,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: "#0F172A" }}>{name}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace", marginLeft: "auto" }}>
                  {value}
                </span>
              </div>
            ))}
          </SpecBlock>
        )}

        {frame.specs?.spacing && Object.keys(frame.specs.spacing).length > 0 && (
          <SpecBlock title="Spacing">
            {Object.entries(frame.specs.spacing).map(([name, value]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#0F172A" }}>{name}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{value}</span>
              </div>
            ))}
          </SpecBlock>
        )}

        {frame.specs?.typography && Object.keys(frame.specs.typography).length > 0 && (
          <SpecBlock title="Typography">
            {Object.entries(frame.specs.typography).map(([name, value]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#0F172A" }}>{name}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{value}</span>
              </div>
            ))}
          </SpecBlock>
        )}

        {frame.specs?.tokens && Object.keys(frame.specs.tokens).length > 0 && (
          <SpecBlock title="Design Tokens">
            {Object.entries(frame.specs.tokens).map(([key, value]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor: value,
                    border: "1px solid #E2E8F0",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: "#31AD52", fontFamily: "monospace" }}>--{key}</span>
                <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace", marginLeft: "auto" }}>
                  {value}
                </span>
              </div>
            ))}
          </SpecBlock>
        )}
      </div>
    </div>
  );
}

function SpecBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: "1 1 300px", minWidth: 280 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: 1.5,
          color: "#94A3B8",
          marginBottom: 10,
          paddingBottom: 6,
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

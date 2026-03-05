"use client";

import { useRef, useEffect } from "react";

interface WaveformProps {
  data: number[];
  playhead: number;
  height?: number;
  selectedRange?: [number, number] | null;
  replacePoint?: number | null;
  insertRange?: [number, number] | null;
  onSeek?: (pos: number) => void;
  onDragSelect?: (range: [number, number]) => void;
  interactive?: boolean;
}

export default function Waveform({
  data,
  playhead,
  height = 100,
  selectedRange,
  replacePoint,
  insertRange,
  onSeek,
  onDragSelect,
  interactive = false,
}: WaveformProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef(0);
  const bw = 3;
  const gap = 2;
  const tw = data.length * (bw + gap);

  const getPos = (e: MouseEvent | React.MouseEvent) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const handleDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (onDragSelect) {
      dragging.current = true;
      dragStart.current = getPos(e);
      onDragSelect([dragStart.current, dragStart.current]);
    } else if (onSeek) {
      onSeek(getPos(e));
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragging.current && onDragSelect) {
        const pos = getPos(e);
        onDragSelect([Math.min(dragStart.current, pos), Math.max(dragStart.current, pos)]);
      }
    };
    const handleUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [onDragSelect]);

  return (
    <div
      ref={ref}
      onMouseDown={handleDown}
      style={{
        position: "relative",
        height,
        cursor: interactive ? (onDragSelect ? "crosshair" : "pointer") : "default",
        userSelect: "none",
      }}
    >
      <svg width="100%" height={height} viewBox={`0 0 ${tw} ${height}`} preserveAspectRatio="none">
        {data.map((v, i) => {
          const x = i * (bw + gap);
          const h = Math.max(v * (height - 8), 2);
          const pos = i / data.length;
          const played = pos <= playhead;
          const inSel = selectedRange && pos >= selectedRange[0] && pos <= selectedRange[1];
          const inInsert = insertRange && i >= insertRange[0] && i < insertRange[1];
          let fill = played ? "var(--ma-blue)" : "#CBD5E1";
          let opacity = played ? 0.85 : 0.35;
          if (inSel) { fill = "var(--ma-red)"; opacity = 0.9; }
          if (inInsert) { fill = "var(--ma-red)"; opacity = 0.9; }
          return (
            <rect key={i} x={x} y={(height - h) / 2} width={bw} height={h} rx={1.5} fill={fill} opacity={opacity} />
          );
        })}
      </svg>

      {/* Playhead */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${playhead * 100}%`,
          width: 2,
          height: "100%",
          background: "var(--ma-blue)",
          borderRadius: 1,
          transform: "translateX(-1px)",
          boxShadow: "0 0 8px rgba(37, 99, 235, 0.3)",
          transition: "left 0.05s linear",
        }}
      />

      {/* Trim selection overlay */}
      {selectedRange && (selectedRange[1] - selectedRange[0]) > 0.005 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${selectedRange[0] * 100}%`,
            width: `${(selectedRange[1] - selectedRange[0]) * 100}%`,
            height: "100%",
            background: "rgba(239, 68, 68, 0.07)",
            borderLeft: "2px solid var(--ma-red)",
            borderRight: "2px solid var(--ma-red)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--ma-red)",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Selected
          </div>
        </div>
      )}

      {/* Insert marker */}
      {replacePoint != null && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${replacePoint * 100}%`,
              width: 2.5,
              height: "100%",
              background: "var(--ma-red)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -8,
              left: `${replacePoint * 100}%`,
              transform: "translateX(-50%)",
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--ma-red)",
                border: "2.5px solid white",
                boxShadow: "0 2px 6px rgba(239,68,68,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              +
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: -26,
              left: `${replacePoint * 100}%`,
              transform: "translateX(-50%)",
              zIndex: 3,
              background: "var(--ma-red)",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Insert here
          </div>
        </>
      )}
    </div>
  );
}

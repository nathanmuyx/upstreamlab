export const mediumCode = `import { useState, useEffect, useRef, useCallback } from "react";

type Phase = "idle" | "recording" | "paused" | "review";
type EditMode = "play" | "trim" | "insert";

const fmt = (s) =>
  \`\${String(Math.floor(s / 60)).padStart(2, "0")}:\${String(
    Math.floor(s % 60)
  ).padStart(2, "0")}\`;

const makeWave = (n) =>
  Array.from({ length: n }, () => 0.12 + Math.random() * 0.88);

/* ── Waveform with selection + insert support ── */
function Waveform({
  data, playhead, height = 100,
  selectedRange, replacePoint, insertRange,
  onSeek, onDragSelect, interactive,
}) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const dragStart = useRef(0);
  const bw = 3, gap = 2;
  const tw = data.length * (bw + gap);

  const getPos = (e) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(1,
      (e.clientX - rect.left) / rect.width));
  };

  const handleDown = (e) => {
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
    const move = (e) => {
      if (dragging.current && onDragSelect) {
        const p = getPos(e);
        onDragSelect([
          Math.min(dragStart.current, p),
          Math.max(dragStart.current, p),
        ]);
      }
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [onDragSelect]);

  return (
    <div ref={ref} onMouseDown={handleDown}
      style={{
        position: "relative", height,
        cursor: interactive
          ? (onDragSelect ? "crosshair" : "pointer")
          : "default",
        userSelect: "none",
      }}>
      <svg width="100%" height={height}
        viewBox={\`0 0 \${tw} \${height}\`}
        preserveAspectRatio="none">
        {data.map((v, i) => {
          const x = i * (bw + gap);
          const h = Math.max(v * (height - 8), 2);
          const pos = i / data.length;
          const played = pos <= playhead;
          const inSel = selectedRange
            && pos >= selectedRange[0]
            && pos <= selectedRange[1];
          const inInsert = insertRange
            && i >= insertRange[0]
            && i < insertRange[1];
          let fill = played ? "#2563EB" : "#CBD5E1";
          let opacity = played ? 0.85 : 0.35;
          if (inSel) { fill = "#EF4444"; opacity = 0.9; }
          if (inInsert) { fill = "#EF4444"; opacity = 0.9; }
          return (
            <rect key={i} x={x} y={(height - h) / 2}
              width={bw} height={h} rx={1.5}
              fill={fill} opacity={opacity} />
          );
        })}
      </svg>
      {/* Playhead */}
      <div style={{
        position: "absolute", top: 0,
        left: \`\${playhead * 100}%\`, width: 2,
        height: "100%", background: "#2563EB",
        borderRadius: 1, transform: "translateX(-1px)",
        transition: "left 0.05s linear",
      }} />
      {/* Selection overlay */}
      {selectedRange && (selectedRange[1] - selectedRange[0]) > 0.005 && (
        <div style={{
          position: "absolute", top: 0,
          left: \`\${selectedRange[0] * 100}%\`,
          width: \`\${(selectedRange[1] - selectedRange[0]) * 100}%\`,
          height: "100%",
          background: "rgba(239, 68, 68, 0.07)",
          borderLeft: "2px solid #EF4444",
          borderRight: "2px solid #EF4444",
          pointerEvents: "none",
        }} />
      )}
      {/* Insert point marker */}
      {replacePoint != null && (
        <div style={{
          position: "absolute", top: 0,
          left: \`\${replacePoint * 100}%\`,
          width: 2.5, height: "100%",
          background: "#EF4444", zIndex: 2,
        }} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   Dictation — Record, Trim & Insert
   ══════════════════════════════════════ */
export default function Dictation() {
  const [phase, setPhase] = useState("idle");
  const [editMode, setEditMode] = useState("play");
  const [waveData, setWaveData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState(null);
  const [insertPoint, setInsertPoint] = useState(null);
  const [isReRecording, setIsReRecording] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [insertRange, setInsertRange] = useState(null);
  const [preInsertData, setPreInsertData] = useState(null);
  const [preInsertElapsed, setPreInsertElapsed] = useState(0);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const playRef = useRef(null);
  const insertRef = useRef(null);
  const insertIdxRef = useRef(0);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const startRecording = useCallback(() => {
    setPhase("recording");
    setWaveData([]);
    setElapsed(0);
    setEditMode("play");
    setSelection(null);
    setInsertPoint(null);
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 0.1);
      setWaveData((prev) => [...prev, 0.1 + Math.random() * 0.9]);
    }, 100);
  }, []);

  const pauseRecording = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("paused");
  }, []);

  const resumeRecording = useCallback(() => {
    setPhase("recording");
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 0.1);
      setWaveData((prev) => [...prev, 0.1 + Math.random() * 0.9]);
    }, 100);
  }, []);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("review");
    setPlayhead(0);
    setIsPlaying(false);
  }, []);

  const deleteRecording = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(playRef.current);
    setPhase("idle");
    setWaveData([]);
    setElapsed(0);
    setPlayhead(0);
    setIsPlaying(false);
    setEditMode("play");
    setSelection(null);
    setInsertPoint(null);
  }, []);

  // Trim: delete selected bars
  const handleDeleteSelection = useCallback(() => {
    if (!selection) return;
    const newData = waveData.filter((_, i) => {
      const p = i / waveData.length;
      return p < selection[0] || p > selection[1];
    });
    setWaveData(newData);
    setSelection(null);
    setEditMode("play");
    showToast("Selection deleted", "success");
  }, [selection, waveData, showToast]);

  // Trim: re-record selected section (animated)
  const handleReRecordSelection = useCallback(() => {
    if (!selection) return;
    setIsReRecording(true);
    const startIdx = Math.floor(selection[0] * waveData.length);
    const endIdx = Math.floor(selection[1] * waveData.length);
    const gapSize = endIdx - startIdx;
    const without = [
      ...waveData.slice(0, startIdx),
      ...waveData.slice(endIdx),
    ];
    setWaveData(without);
    setInsertRange([startIdx, startIdx]);
    let count = 0;
    insertIdxRef.current = startIdx;
    insertRef.current = setInterval(() => {
      count++;
      setWaveData((prev) => {
        const pos = insertIdxRef.current;
        const bar = 0.1 + Math.random() * 0.9;
        insertIdxRef.current = pos + 1;
        return [...prev.slice(0, pos), bar, ...prev.slice(pos)];
      });
      setInsertRange((prev) =>
        prev ? [prev[0], prev[0] + count] : null);
      if (count >= gapSize) {
        clearInterval(insertRef.current);
        setInsertRange(null);
        setSelection(null);
        setIsReRecording(false);
        setEditMode("play");
        showToast("Section re-recorded!", "success");
      }
    }, 100);
  }, [selection, waveData, showToast]);

  // Insert: record new audio at insert point
  const handleInsertAtPoint = useCallback(() => {
    if (insertPoint === null) return;
    setPreInsertData([...waveData]);
    setPreInsertElapsed(elapsed);
    setIsReRecording(true);
    const idx = Math.floor(insertPoint * waveData.length);
    insertIdxRef.current = idx;
    setInsertRange([idx, idx]);
    let count = 0;
    const total = 15;
    insertRef.current = setInterval(() => {
      count++;
      setWaveData((prev) => {
        const pos = insertIdxRef.current;
        const bar = 0.1 + Math.random() * 0.9;
        insertIdxRef.current = pos + 1;
        return [...prev.slice(0, pos), bar, ...prev.slice(pos)];
      });
      setInsertRange((prev) =>
        prev ? [prev[0], prev[0] + count] : null);
      setElapsed((prev) => prev + 0.1);
      if (count >= total) {
        clearInterval(insertRef.current);
        setInsertPoint(null);
        setIsReRecording(false);
      }
    }, 100);
  }, [insertPoint, waveData, elapsed]);

  const handleStopInsert = useCallback(() => {
    clearInterval(insertRef.current);
    setInsertPoint(null);
    setIsReRecording(false);
  }, []);

  const handleConfirmInsert = useCallback(() => {
    setInsertRange(null);
    setPreInsertData(null);
    setEditMode("play");
    showToast("Audio inserted!", "success");
  }, [showToast]);

  const handleDiscardInsert = useCallback(() => {
    if (preInsertData) {
      setWaveData(preInsertData);
      setElapsed(preInsertElapsed);
    }
    setInsertRange(null);
    setPreInsertData(null);
    setInsertPoint(null);
    showToast("Insert discarded", "info");
  }, [preInsertData, preInsertElapsed, showToast]);

  const skip15 = elapsed > 0
    ? Math.min(15 / elapsed, 0.3) : 0.15;

  // Playback simulation
  useEffect(() => {
    if (isPlaying && phase === "review") {
      playRef.current = setInterval(() => {
        setPlayhead((p) => {
          if (p >= 1) { setIsPlaying(false); return 1; }
          return p + 0.005;
        });
      }, 50);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, phase]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(playRef.current);
      clearInterval(insertRef.current);
    };
  }, []);

  const displayWave =
    waveData.length > 0 ? waveData : makeWave(120);

  return (
    <div style={{ width: "100%", height: "100vh",
      display: "flex", background: "#F7F8FA" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex",
        flexDirection: "column" }}>

        {/* Header */}
        <Header phase={phase} elapsed={elapsed} />

        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ flex: 1, padding: 24,
            display: "flex", flexDirection: "column" }}>

            {phase === "idle" ? (
              <EmptyState onStart={startRecording} />
            ) : (
              <div style={{
                background: "white", borderRadius: 14,
                border: "1px solid #E4E7EE", flex: 1,
                display: "flex", flexDirection: "column",
              }}>
                {/* Edit hint above waveform */}
                {phase === "review"
                  && (editMode === "trim" || editMode === "insert")
                  && !isReRecording && !insertRange && (
                  <div style={{ textAlign: "center",
                    padding: "16px 24px 4px",
                    fontSize: 12, color: "#94A3B8" }}>
                    {editMode === "trim" && !selection
                      && "✂ Drag to select a section"}
                    {editMode === "insert" && !insertPoint
                      && "+ Tap to place insert point"}
                  </div>
                )}

                {/* Waveform */}
                <div style={{ flex: 1, padding: "28px 24px 12px",
                  display: "flex", alignItems: "center" }}>
                  <Waveform
                    data={displayWave}
                    playhead={phase === "review" ? playhead : 1}
                    height={100}
                    interactive={phase === "review"}
                    selectedRange={
                      editMode === "trim" ? selection : null}
                    replacePoint={
                      editMode === "insert" ? insertPoint : null}
                    insertRange={insertRange}
                    onSeek={
                      editMode === "play"
                        ? (p) => { setPlayhead(p); setIsPlaying(false); }
                        : editMode === "insert"
                        ? (p) => { setInsertPoint(p); setPlayhead(p); }
                        : null}
                    onDragSelect={
                      editMode === "trim" ? setSelection : null}
                  />
                </div>

                {/* Timer */}
                <Timer phase={phase} playhead={playhead}
                  elapsed={elapsed} />

                {/* Edit mode tabs */}
                {phase === "review"
                  && (editMode === "trim" || editMode === "insert")
                  && (
                  <EditTabs
                    editMode={editMode}
                    setEditMode={setEditMode}
                    isReRecording={isReRecording}
                    insertRange={insertRange}
                    onCancel={() => {
                      setEditMode("play");
                      setSelection(null);
                      setInsertPoint(null);
                      setInsertRange(null);
                      setIsPlaying(false);
                    }}
                  />
                )}

                {/* Controls */}
                <Controls
                  phase={phase}
                  editMode={editMode}
                  isPlaying={isPlaying}
                  isReRecording={isReRecording}
                  selection={selection}
                  insertPoint={insertPoint}
                  insertRange={insertRange}
                  showDeleteConfirm={showDeleteConfirm}
                  playhead={playhead}
                  elapsed={elapsed}
                  skip15={skip15}
                  onPause={pauseRecording}
                  onStop={stopRecording}
                  onResume={resumeRecording}
                  onPlay={() => {
                    if (playhead >= 1) setPlayhead(0);
                    setIsPlaying(!isPlaying);
                  }}
                  onSkipBack={() => {
                    setPlayhead(Math.max(0, playhead - skip15));
                    setIsPlaying(false);
                  }}
                  onSkipFwd={() => {
                    setPlayhead(Math.min(1, playhead + skip15));
                    setIsPlaying(false);
                  }}
                  onEdit={() => {
                    setEditMode("trim");
                    setIsPlaying(false);
                  }}
                  onDeleteSelection={() => {
                    setShowDeleteConfirm(true);
                  }}
                  onConfirmDelete={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteSelection();
                  }}
                  onCancelDelete={() => setShowDeleteConfirm(false)}
                  onReRecord={handleReRecordSelection}
                  onInsertAtPoint={handleInsertAtPoint}
                  onStopInsert={handleStopInsert}
                  onConfirmInsert={handleConfirmInsert}
                  onDiscardInsert={handleDiscardInsert}
                />
              </div>
            )}
          </div>

          {/* Right panel — Job Details */}
          <JobDetailsPanel phase={phase}
            onSend={() => showToast("Sent to typist!", "success")}
            onDelete={deleteRecording} />
        </div>
      </div>
    </div>
  );
}`;

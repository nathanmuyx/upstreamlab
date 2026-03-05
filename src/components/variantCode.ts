export const mildCode = `import { useState, useEffect, useRef } from "react";

/* ── Colour tokens ── */
const C = {
  bg: "#F7F8FA", surface: "#FFFFFF", border: "#E4E7EE",
  blue: "#2563EB", blueDark: "#1D4ED8", blueLight: "#EFF4FF",
  red: "#EF4444", redLight: "#FEE2E2",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8",
  sidebar: "#FAFBFC", sidebarActive: "#EFF3FF",
};

const fmt = (s) =>
  \`\${String(Math.floor(s / 60)).padStart(2, "0")}:\${String(Math.floor(s % 60)).padStart(2, "0")}\`;

const makeWave = (n) =>
  Array.from({ length: n }, () => 0.12 + Math.random() * 0.88);

/* ── Waveform (SVG bars, click-to-seek) ── */
function Waveform({ data, playhead, height = 90, onSeek }) {
  const ref = useRef(null);
  const bw = 3, gap = 2;
  const tw = data.length * (bw + gap);

  const handleClick = (e) => {
    if (!onSeek || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div ref={ref} onClick={handleClick}
      style={{ position: "relative", height, cursor: onSeek ? "pointer" : "default" }}>
      <svg width="100%" height={height}
        viewBox={\`0 0 \${tw} \${height}\`} preserveAspectRatio="none">
        {data.map((v, i) => {
          const x = i * (bw + gap);
          const h = v * (height - 6);
          const played = i / data.length <= playhead;
          return (
            <rect key={i} x={x} y={(height - h) / 2}
              width={bw} height={h} rx={1.5}
              fill={played ? C.blue : "#CBD5E1"}
              opacity={played ? 0.85 : 0.35} />
          );
        })}
      </svg>
      <div style={{
        position: "absolute", top: 0,
        left: \`\${playhead * 100}%\`, width: 2,
        height: "100%", background: C.blue,
        borderRadius: 1, transform: "translateX(-1px)",
        boxShadow: \`0 0 8px \${C.blue}50\`,
      }} />
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar() {
  return (
    <div style={{ width: 220, borderRight: \`1px solid \${C.border}\`,
      display: "flex", flexDirection: "column", background: C.sidebar }}>
      <div style={{ padding: "20px 16px 16px",
        borderBottom: \`1px solid \${C.border}\` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#1B2E5A",
            borderRadius: 4, display: "flex", alignItems: "center",
            justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 9, fontWeight: 700,
              fontFamily: "Georgia, serif" }}>MA</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1B2E5A",
            fontFamily: "Georgia, serif" }}>Maloney Anderson</span>
        </div>
      </div>
      <nav style={{ padding: "12px 8px", display: "flex",
        flexDirection: "column", gap: 2 }}>
        {[
          { label: "Dashboard", active: false },
          { label: "Add Dictation", active: true },
          { label: "Transcribe Queue", active: false },
          { label: "User Management", active: false },
        ].map((item) => (
          <div key={item.label} style={{
            padding: "8px 12px", borderRadius: 8, fontSize: 13,
            cursor: "pointer", fontWeight: item.active ? 600 : 400,
            background: item.active ? C.sidebarActive : "transparent",
            color: item.active ? C.blue : C.textSec,
          }}>
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}

/* ── Round Button ── */
function RndBtn({ onClick, size = 44, bg = "white",
  color = C.textSec, border = true, shadow, children }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%",
      border: border ? \`1px solid \${C.border}\` : "none",
      background: bg, cursor: "pointer",
      display: "flex", alignItems: "center",
      justifyContent: "center", color,
      boxShadow: shadow || "none",
    }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════
   MILD — Band-Aid Fix
   Basic record / pause / stop / review
   No editing modes
   ══════════════════════════════════════ */
export default function MildPrototype() {
  const [phase, setPhase] = useState("idle");
  const [waveData, setWaveData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [priority, setPriority] = useState(false);
  const timerRef = useRef(null);
  const playRef = useRef(null);

  const startRecording = () => {
    setPhase("recording");
    setWaveData([]);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 0.1);
      setWaveData((prev) => [...prev, 0.1 + Math.random() * 0.9]);
    }, 100);
  };

  const pauseRecording = () => {
    clearInterval(timerRef.current);
    setPhase("paused");
  };

  const resumeRecording = () => {
    setPhase("recording");
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 0.1);
      setWaveData((prev) => [...prev, 0.1 + Math.random() * 0.9]);
    }, 100);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setPhase("review");
    setPlayhead(0);
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    clearInterval(timerRef.current);
    clearInterval(playRef.current);
    setPhase("idle");
    setWaveData([]);
    setElapsed(0);
    setPlayhead(0);
    setIsPlaying(false);
  };

  // Playback simulation
  useEffect(() => {
    if (isPlaying && phase === "review") {
      playRef.current = setInterval(() => {
        setPlayhead((p) => {
          if (p >= 1) { setIsPlaying(false); return 1; }
          return p + 0.005;
        });
      }, 50);
    } else {
      clearInterval(playRef.current);
    }
    return () => clearInterval(playRef.current);
  }, [isPlaying, phase]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(playRef.current);
  }, []);

  const displayWave = waveData.length > 0 ? waveData : makeWave(100);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex",
      fontFamily: "'DM Sans', sans-serif", background: C.bg }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "20px 28px 14px",
          borderBottom: \`1px solid \${C.border}\`, background: "white" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Author Studio
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 13,
            color: C.textMuted }}>
            Record and manage your dictations
          </p>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          {/* Main area */}
          <div style={{ flex: 1, padding: 28, display: "flex",
            flexDirection: "column" }}>
            <div style={{ background: "white", borderRadius: 14,
              border: \`1px solid \${C.border}\`, flex: 1,
              display: "flex", flexDirection: "column" }}>

              {/* Waveform */}
              <div style={{ flex: 1, padding: "28px 28px 12px",
                display: "flex", alignItems: "center" }}>
                {phase === "idle" ? (
                  <div style={{ width: "100%", textAlign: "center",
                    padding: "32px 0" }}>
                    <div style={{ fontSize: 16, fontWeight: 600,
                      marginBottom: 4 }}>
                      Start a New Dictation
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>
                      Press the microphone button below to begin.
                    </div>
                  </div>
                ) : (
                  <Waveform data={displayWave}
                    playhead={phase === "review" ? playhead : 1}
                    height={100}
                    onSeek={phase === "review"
                      ? (p) => { setPlayhead(p); setIsPlaying(false); }
                      : null} />
                )}
              </div>

              {/* Timer */}
              {phase !== "idle" && (
                <div style={{ display: "flex", justifyContent: "center",
                  alignItems: "center", gap: 10, padding: "0 28px 8px" }}>
                  {phase === "recording" && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%",
                      background: C.red,
                      animation: "pulse 1s infinite" }} />
                  )}
                  <span style={{ fontSize: 28, fontWeight: 700,
                    fontVariantNumeric: "tabular-nums" }}>
                    {phase === "review"
                      ? fmt(playhead * elapsed)
                      : fmt(elapsed)}
                  </span>
                </div>
              )}

              {/* Controls */}
              <div style={{ padding: "12px 28px 28px", display: "flex",
                justifyContent: "center", gap: 12 }}>
                {phase === "idle" && (
                  <RndBtn onClick={startRecording} size={64}
                    bg={C.red} color="white" border={false}
                    shadow={\`0 4px 16px \${C.red}40\`}>
                    ● REC
                  </RndBtn>
                )}
                {phase === "recording" && (
                  <>
                    <RndBtn onClick={pauseRecording}>⏸</RndBtn>
                    <RndBtn onClick={stopRecording} size={64}
                      bg={C.red} color="white" border={false}>
                      ⏹
                    </RndBtn>
                  </>
                )}
                {phase === "paused" && (
                  <>
                    <RndBtn onClick={resumeRecording} size={64}
                      bg={C.red} color="white" border={false}>
                      ● REC
                    </RndBtn>
                    <RndBtn onClick={stopRecording}>⏹</RndBtn>
                  </>
                )}
                {phase === "review" && (
                  <>
                    <RndBtn onClick={() => {
                      setPlayhead(Math.max(0, playhead - 0.05));
                      setIsPlaying(false);
                    }}>⏮</RndBtn>
                    <RndBtn onClick={() => {
                      if (playhead >= 1) setPlayhead(0);
                      setIsPlaying(!isPlaying);
                    }} size={60} bg={C.blue} color="white"
                      border={false}>
                      {isPlaying ? "⏸" : "▶"}
                    </RndBtn>
                    <RndBtn onClick={() => {
                      setPlayhead(Math.min(1, playhead + 0.05));
                      setIsPlaying(false);
                    }}>⏭</RndBtn>
                    <RndBtn onClick={startRecording}
                      bg={C.redLight} color={C.red}
                      border={false}>●</RndBtn>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right panel — Job Details */}
          <div style={{ width: 280, borderLeft: \`1px solid \${C.border}\`,
            background: "white", padding: 20,
            display: "flex", flexDirection: "column", gap: 18 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
              Job Details
            </h3>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input placeholder="Enter client name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Note</label>
              <textarea placeholder="Enter note" rows={3}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>Assign Typist</label>
              <div style={{ ...inputStyle, color: C.textMuted,
                display: "flex", justifyContent: "space-between" }}>
                Any Available Typist ▾
              </div>
            </div>
            <div style={{ marginTop: "auto", display: "flex",
              flexDirection: "column", gap: 8 }}>
              <button disabled={phase !== "review"} style={{
                width: "100%", padding: 11, borderRadius: 10,
                border: "none", fontWeight: 600, fontSize: 13,
                background: phase === "review" ? C.blue : "#E2E8F0",
                color: phase === "review" ? "white" : C.textMuted,
                cursor: phase === "review" ? "pointer" : "not-allowed",
              }}>
                Save & Send to Typist
              </button>
              {phase !== "idle" && (
                <button onClick={deleteRecording} style={{
                  width: "100%", padding: 11, borderRadius: 10,
                  border: \`1px solid \${C.redLight}\`,
                  background: "white", color: C.red,
                  fontWeight: 500, fontSize: 13, cursor: "pointer",
                }}>
                  Delete Recording
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 11, fontWeight: 600, color: C.textSec,
  marginBottom: 5, display: "block",
  textTransform: "uppercase", letterSpacing: 0.4,
};

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 10,
  border: \`1px solid \${C.border}\`, fontSize: 13,
  outline: "none", boxSizing: "border-box",
};`;

export const mediumCode = `import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F7F8FA", surface: "#FFFFFF", border: "#E4E7EE",
  blue: "#2563EB", blueDark: "#1D4ED8", blueLight: "#EFF4FF",
  red: "#EF4444", redLight: "#FEE2E2",
  amber: "#F59E0B", amberLight: "#FEF3C7", amberDark: "#92400E",
  green: "#10B981",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8",
  sidebar: "#FAFBFC", sidebarActive: "#EFF3FF",
};

const fmt = (s) =>
  \`\${String(Math.floor(s / 60)).padStart(2, "0")}:\\\
\${String(Math.floor(s % 60)).padStart(2, "0")}\`;

/* ── Waveform with selection + replace support ── */
function Waveform({ data, playhead, height = 110,
  selectedRange, replacePoint,
  onSeek, onDragSelect, interactive }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const dragStart = useRef(0);
  const bw = 3, gap = 2, tw = data.length * (bw + gap);

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
  }, []);

  return (
    <div ref={ref} onMouseDown={handleDown}
      style={{ position: "relative", height,
        cursor: interactive ? "crosshair" : "default",
        userSelect: "none" }}>
      <svg width="100%" height={height}
        viewBox={\`0 0 \${tw} \${height}\`}
        preserveAspectRatio="none">
        {data.map((v, i) => {
          const x = i * (bw + gap);
          const h = v * (height - 6);
          const pos = i / data.length;
          const played = pos <= playhead;
          const inSel = selectedRange
            && pos >= selectedRange[0]
            && pos <= selectedRange[1];
          const afterReplace = replacePoint != null
            && pos > replacePoint;
          let fill = played ? C.blue : "#CBD5E1";
          if (inSel) fill = C.red;
          if (afterReplace) fill = "#FDBA74";
          return (
            <rect key={i} x={x} y={(height - h) / 2}
              width={bw} height={h} rx={1.5} fill={fill}
              opacity={inSel ? 0.9 : afterReplace ? 0.5
                : played ? 0.85 : 0.35} />
          );
        })}
      </svg>
      {/* Playhead line */}
      <div style={{ position: "absolute", top: 0,
        left: \`\${playhead * 100}%\`, width: 2,
        height: "100%", background: C.blue }} />
      {/* Selection overlay */}
      {selectedRange && (
        <div style={{ position: "absolute", top: 0,
          left: \`\${selectedRange[0] * 100}%\`,
          width: \`\${(selectedRange[1] - selectedRange[0]) * 100}%\`,
          height: "100%", background: \`\${C.red}12\`,
          borderLeft: \`2px solid \${C.red}\`,
          borderRight: \`2px solid \${C.red}\`,
          pointerEvents: "none" }} />
      )}
      {/* Replace cursor */}
      {replacePoint != null && (
        <div style={{ position: "absolute", top: 0,
          left: \`\${replacePoint * 100}%\`,
          width: 2, height: "100%",
          background: C.red, zIndex: 2 }} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MEDIUM — Trim & Replace
   Adds edit mode switcher, drag-select
   trimming, replace-from-cursor
   ══════════════════════════════════════ */
export default function MediumPrototype() {
  const [phase, setPhase] = useState("idle");
  const [editMode, setEditMode] = useState("play");
  const [waveData, setWaveData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState(null);
  const [replacePoint, setReplacePoint] = useState(null);
  const [isReRecording, setIsReRecording] = useState(false);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const playRef = useRef(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const startRecording = () => {
    setPhase("recording");
    setWaveData([]);
    setElapsed(0);
    setEditMode("play");
    setSelection(null);
    setReplacePoint(null);
    timerRef.current = setInterval(() => {
      setElapsed((p) => p + 0.1);
      setWaveData((prev) => [...prev, 0.1 + Math.random() * 0.9]);
    }, 100);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    setPhase("review");
    setPlayhead(0);
    setIsPlaying(false);
  };

  // Trim: remove selected bars from waveData
  const handleDeleteSelection = () => {
    if (!selection) return;
    const newData = waveData.filter((_, i) => {
      const p = i / waveData.length;
      return p < selection[0] || p > selection[1];
    });
    setWaveData(newData);
    setSelection(null);
    setEditMode("play");
    showToast("Selection deleted", "success");
  };

  // Replace: regenerate bars after cursor
  const handleReplaceFromPoint = () => {
    if (replacePoint === null) return;
    setIsReRecording(true);
    showToast("Replacing from cursor...");
    setTimeout(() => {
      const nd = waveData.map((v, i) => {
        const p = i / waveData.length;
        return p > replacePoint
          ? 0.1 + Math.random() * 0.9 : v;
      });
      setWaveData(nd);
      setReplacePoint(null);
      setIsReRecording(false);
      setEditMode("play");
      showToast("Audio replaced!", "success");
    }, 1500);
  };

  // ... playback effect, cleanup same as mild ...

  return (
    <div style={{ width: "100%", height: "100vh",
      display: "flex", background: C.bg }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex",
        flexDirection: "column" }}>

        {/* Header with mode switcher */}
        <div style={{ padding: "16px 28px",
          borderBottom: \`1px solid \${C.border}\`,
          background: "white", display: "flex",
          justifyContent: "space-between",
          alignItems: "center" }}>
          <div>
            <h2>Author Studio</h2>
            <p style={{ color: C.textMuted }}>
              {phase === "review"
                ? \`Review — \${fmt(elapsed)}\`
                : "Record and manage"}
            </p>
          </div>

          {/* Edit mode tabs (review only) */}
          {phase === "review" && (
            <div style={{ display: "flex", gap: 3,
              background: "#F1F5F9", borderRadius: 10,
              padding: 3 }}>
              {["play", "trim", "replace"].map((m) => (
                <button key={m} onClick={() => {
                  setEditMode(m);
                  setSelection(null);
                  setReplacePoint(null);
                  setIsPlaying(false);
                }} style={{
                  padding: "7px 16px", borderRadius: 8,
                  border: "none", fontSize: 12,
                  background: editMode === m ? "white" : "transparent",
                  color: editMode === m ? C.text : C.textMuted,
                  fontWeight: 500, cursor: "pointer",
                }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", top: 16,
            right: 16, zIndex: 100, padding: "10px 20px",
            borderRadius: 10,
            background: toast.type === "success"
              ? C.green : C.blue,
            color: "white", fontSize: 13, fontWeight: 600 }}>
            {toast.msg}
          </div>
        )}

        <div style={{ flex: 1, display: "flex" }}>
          {/* Main area with waveform + controls */}
          <div style={{ flex: 1, padding: 28 }}>
            {/* Mode instruction banner */}
            {phase === "review" && editMode === "trim" && (
              <div style={{ padding: "10px 20px",
                background: C.amberLight, borderRadius: 10,
                fontSize: 12, color: C.amberDark,
                marginBottom: 12 }}>
                Click and drag to select a section to trim.
              </div>
            )}
            {phase === "review" && editMode === "replace" && (
              <div style={{ padding: "10px 20px",
                background: C.blueLight, borderRadius: 10,
                fontSize: 12, color: C.blueDark,
                marginBottom: 12 }}>
                Tap the timeline to set replace point.
              </div>
            )}

            <div style={{ background: "white",
              borderRadius: 14,
              border: \`1px solid \${C.border}\`,
              padding: "28px 24px" }}>
              <Waveform
                data={displayWave}
                playhead={phase === "review" ? playhead : 1}
                interactive={phase === "review"}
                selectedRange={
                  editMode === "trim" ? selection : null}
                replacePoint={
                  editMode === "replace" ? replacePoint : null}
                onSeek={
                  editMode === "play"
                    ? (p) => { setPlayhead(p); }
                    : editMode === "replace"
                    ? (p) => { setReplacePoint(p); }
                    : null}
                onDragSelect={
                  editMode === "trim" ? setSelection : null}
              />

              {/* Transport controls adapt per editMode */}
              <div style={{ display: "flex",
                justifyContent: "center", gap: 10,
                marginTop: 20 }}>
                {editMode === "trim" && selection && (
                  <>
                    <button onClick={handleDeleteSelection}>
                      Delete Selection
                    </button>
                    <button onClick={() => setSelection(null)}>
                      Cancel
                    </button>
                  </>
                )}
                {editMode === "replace"
                  && replacePoint !== null && (
                  <button onClick={handleReplaceFromPoint}>
                    Re-record from Here
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right panel — same as mild */}
          <JobDetailsPanel phase={phase} />
        </div>
      </div>
    </div>
  );
}`;

export const spicyCode = `import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F5F6F8", surface: "#FFFFFF", border: "#E4E7EE",
  blue: "#2563EB", blueDark: "#1D4ED8", blueLight: "#EFF4FF",
  blueMid: "#BFDBFE",
  red: "#EF4444", redLight: "#FEE2E2",
  amber: "#F59E0B", amberLight: "#FEF3C7", amberDark: "#92400E",
  green: "#10B981",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8",
  sidebar: "#FAFBFC", sidebarActive: "#EFF3FF",
};

/* ══════════════════════════════════════
   SPICY — Full Redesign
   - No right panel: inline collapsible job details
   - Centered Apple-style mode tabs
   - Full-width large waveform with timeline
   - Top-bar actions (Send, Save Draft)
   - Gradient CTA, polish animations
   ══════════════════════════════════════ */
export default function SpicyPrototype() {
  const [phase, setPhase] = useState("idle");
  const [editMode, setEditMode] = useState("play");
  const [waveData, setWaveData] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState(null);
  const [replacePoint, setReplacePoint] = useState(null);
  const [isReRecording, setIsReRecording] = useState(false);
  const [showJobPanel, setShowJobPanel] = useState(false);
  const [priority, setPriority] = useState(false);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const playRef = useRef(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Recording / playback / edit handlers
  // (same core logic as Medium, omitted for brevity)

  return (
    <div style={{ width: "100%", height: "100vh",
      display: "flex", background: C.bg }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex",
        flexDirection: "column", overflow: "hidden" }}>

        {/* ── Top Bar: actions live here now ── */}
        <div style={{ padding: "12px 32px",
          borderBottom: \`1px solid \${C.border}\`,
          background: "white", display: "flex",
          justifyContent: "space-between",
          alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              Author Studio
            </h2>
            <p style={{ fontSize: 12, color: C.textMuted }}>
              {phase === "review"
                ? \`Dictation — \${fmt(elapsed)}\`
                : "New dictation"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* Collapsible job details toggle */}
            {phase === "review" && (
              <button
                onClick={() => setShowJobPanel(!showJobPanel)}
                style={{
                  padding: "7px 16px", borderRadius: 8,
                  border: showJobPanel
                    ? \`1.5px solid \${C.blue}\`
                    : \`1px solid \${C.border}\`,
                  background: showJobPanel
                    ? C.blueLight : "white",
                  color: showJobPanel ? C.blue : C.textSec,
                  cursor: "pointer",
                }}>
                Job Details {showJobPanel ? "▲" : "▼"}
              </button>
            )}
            <button disabled={phase === "idle"}>
              Save Draft
            </button>
            <button disabled={phase !== "review"}
              style={{
                background: C.blue, color: "white",
                borderRadius: 8, padding: "7px 16px",
              }}>
              Send to Typist
            </button>
          </div>
        </div>

        {/* ── Collapsible Job Details (inline) ── */}
        {showJobPanel && (
          <div style={{
            padding: "16px 32px",
            borderBottom: \`1px solid \${C.border}\`,
            background: C.sidebar,
            display: "flex", gap: 16, flexWrap: "wrap",
            animation: "slideDown 0.25s ease",
          }}>
            <input placeholder="Client name" />
            <input placeholder="Add a note" />
            <select><option>Any Available Typist</option></select>
            <label>
              <input type="checkbox"
                checked={priority}
                onChange={() => setPriority(!priority)} />
              Urgent
            </label>
          </div>
        )}

        {/* ── Main Content (FULL WIDTH) ── */}
        <div style={{ flex: 1, display: "flex",
          flexDirection: "column", overflow: "auto" }}>

          {phase === "idle" ? (
            /* Empty state — gradient CTA */
            <div style={{ flex: 1, display: "flex",
              flexDirection: "column", alignItems: "center",
              justifyContent: "center" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: \`linear-gradient(135deg,
                  \${C.blueLight}, \${C.blueMid})\`,
                display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 24,
              }}>
                🎙️
              </div>
              <h2>New Dictation</h2>
              <p style={{ color: C.textMuted, maxWidth: 400,
                textAlign: "center" }}>
                Record, edit, and send your dictation.
                Trim mistakes, re-record sections,
                or replace audio from any point.
              </p>
              <button onClick={startRecording} style={{
                padding: "16px 44px", borderRadius: 36,
                background: \`linear-gradient(135deg,
                  \${C.blue}, \${C.blueDark})\`,
                color: "white", fontWeight: 700, fontSize: 16,
                border: "none", cursor: "pointer",
                boxShadow: \`0 6px 24px \${C.blue}30\`,
              }}>
                Start Recording
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, padding: "28px 40px",
              display: "flex", flexDirection: "column" }}>

              {/* Centered Apple-style mode tabs */}
              {phase === "review" && (
                <div style={{ display: "flex",
                  justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 3,
                    background: "#EEF0F5", borderRadius: 12,
                    padding: 4 }}>
                    {["Playback", "Trim", "Replace"].map((m) => (
                      <button key={m} onClick={() => {
                        setEditMode(m.toLowerCase());
                        setSelection(null);
                        setReplacePoint(null);
                      }} style={{
                        padding: "8px 20px", borderRadius: 9,
                        border: "none", fontSize: 13,
                        background: editMode === m.toLowerCase()
                          ? "white" : "transparent",
                        color: editMode === m.toLowerCase()
                          ? C.text : C.textMuted,
                        cursor: "pointer",
                      }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Large full-width waveform card */}
              <div style={{
                background: "white", borderRadius: 16,
                border: \`1px solid \${C.border}\`,
                padding: "28px 36px 20px", flex: 1,
              }}>
                <Waveform
                  data={displayWave}
                  playhead={phase === "review" ? playhead : 1}
                  height={130}
                  interactive={phase === "review"}
                  selectedRange={editMode === "trim"
                    ? selection : null}
                  replacePoint={editMode === "replace"
                    ? replacePoint : null}
                  onSeek={/* same as medium */}
                  onDragSelect={editMode === "trim"
                    ? setSelection : null}
                />

                {/* Timeline labels */}
                <div style={{ display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0 0", fontSize: 11,
                  color: C.textMuted }}>
                  {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                    <span key={p}>{fmt(p * elapsed)}</span>
                  ))}
                </div>
              </div>

              {/* Controls (same pattern, centered) */}
              <div style={{ display: "flex",
                justifyContent: "center", gap: 12,
                padding: "24px 0 8px" }}>
                {/* Transport controls adapt per editMode */}
              </div>

              {/* Subtle delete — bottom-right */}
              <div style={{ display: "flex",
                justifyContent: "flex-end" }}>
                <button onClick={deleteRecording}
                  style={{ color: C.red, opacity: 0.6,
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: 12 }}>
                  Delete Recording
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`;

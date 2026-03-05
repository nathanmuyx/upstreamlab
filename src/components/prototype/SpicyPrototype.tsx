"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./Sidebar";
import Waveform from "./Waveform";
import * as I from "./Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Variant = "mild" | "medium" | "spicy";
type Phase = "idle" | "recording" | "paused" | "review";
type EditMode = "play" | "trim" | "insert";

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const makeWave = (n: number) => Array.from({ length: n }, () => 0.12 + Math.random() * 0.88);

/* Round button */
function RndBtn({
  onClick, size = 44, bg = "white", color = "var(--ma-text-sec)", border = true, shadow, children,
}: {
  onClick: () => void; size?: number; bg?: string; color?: string; border?: boolean; shadow?: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full flex items-center justify-center cursor-pointer transition-transform duration-100"
      style={{
        width: size, height: size,
        border: border ? "1px solid var(--ma-border)" : "none",
        background: bg, color, boxShadow: shadow || "none",
      }}
    >
      {children}
    </button>
  );
}

/* Action button */
function Btn({
  children, onClick, bg, color, border, disabled, style: s,
}: {
  children: React.ReactNode; onClick?: () => void; bg?: string; color?: string;
  border?: string; disabled?: boolean; style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-[18px] py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-150",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
      style={{
        border: border || "none",
        background: bg || "white",
        color: color || "var(--ma-text-sec)",
        ...s,
      }}
    >
      {children}
    </button>
  );
}

export default function SpicyPrototype({ variant = "mild" }: { variant?: Variant }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [editMode, setEditMode] = useState<EditMode>("play");
  const [waveData, setWaveData] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState<[number, number] | null>(null);
  const [insertPoint, setInsertPoint] = useState<number | null>(null);
  const [isReRecording, setIsReRecording] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [insertRange, setInsertRange] = useState<[number, number] | null>(null); // [startIdx, endIdx] of pending insert
  const [preInsertData, setPreInsertData] = useState<number[] | null>(null); // backup to discard
  const [preInsertElapsed, setPreInsertElapsed] = useState(0);
  const [showJobPanel, setShowJobPanel] = useState(false);
  const [priority, setPriority] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insertRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insertIdxRef = useRef(0);

  const showToast = useCallback((msg: string, type = "info") => {
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
    if (timerRef.current) clearInterval(timerRef.current);
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
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("review");
    setPlayhead(0);
    setIsPlaying(false);
  }, []);

  const deleteRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (playRef.current) clearInterval(playRef.current);
    setPhase("idle");
    setWaveData([]);
    setElapsed(0);
    setPlayhead(0);
    setIsPlaying(false);
    setEditMode("play");
    setSelection(null);
    setInsertPoint(null);
    setShowJobPanel(false);
  }, []);

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

  const handleReRecordSelection = useCallback(() => {
    if (!selection) return;
    setIsReRecording(true);
    // Delete bars in the selected range, then grow new bars one-by-one to fill the gap
    const startIdx = Math.floor(selection[0] * waveData.length);
    const endIdx = Math.floor(selection[1] * waveData.length);
    const gapSize = endIdx - startIdx;
    const without = [...waveData.slice(0, startIdx), ...waveData.slice(endIdx)];
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
      setInsertRange((prev) => prev ? [prev[0], prev[0] + count] : null);
      if (count >= gapSize) {
        if (insertRef.current) clearInterval(insertRef.current);
        setInsertRange(null);
        setSelection(null);
        setIsReRecording(false);
        setEditMode("play");
        showToast("Section re-recorded!", "success");
      }
    }, 100);
  }, [selection, waveData, showToast]);

  const handleInsertAtPoint = useCallback(() => {
    if (insertPoint === null) return;
    // Save backup for discard
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
      setInsertRange((prev) => prev ? [prev[0], prev[0] + count] : null);
      setElapsed((prev) => prev + 0.1);
      if (count >= total) {
        if (insertRef.current) clearInterval(insertRef.current);
        setInsertPoint(null);
        setIsReRecording(false);
        // Stay in insert mode — pending review
      }
    }, 100);
  }, [insertPoint, waveData, elapsed]);

  const handleStopInsert = useCallback(() => {
    if (insertRef.current) clearInterval(insertRef.current);
    setInsertPoint(null);
    setIsReRecording(false);
    // Stay in insert mode — pending review
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

  const skip15 = elapsed > 0 ? Math.min(15 / elapsed, 0.3) : 0.15;

  // Playback
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
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playRef.current) clearInterval(playRef.current);
      if (insertRef.current) clearInterval(insertRef.current);
    };
  }, []);

  const displayWave = waveData.length > 0 ? waveData : makeWave(120);
  const hasTrimReplace = variant === "medium" || variant === "spicy";
  const isSpicy = variant === "spicy";

  /* ── Status badge ── */
  const statusBadge = (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full text-[11px] font-semibold border-0",
        phase === "recording" && "bg-ma-red-light text-ma-red",
        phase === "paused" && "bg-ma-amber-light text-ma-amber-dark",
        phase === "review" && "bg-ma-blue-light text-ma-blue",
        phase === "idle" && "bg-ma-border-light text-ma-text-muted",
      )}
    >
      {phase === "idle" ? "Ready" : phase === "recording" ? "\u25CF Recording" : phase === "paused" ? "Paused" : "Review"}
    </Badge>
  );

  /* ── Right panel (mild + medium) ── */
  const rightPanel = !isSpicy && (
    <div className="w-[260px] border-l border-ma-border bg-white p-5 flex flex-col gap-4 shrink-0 overflow-auto">
      <h3 className="text-sm font-bold text-ma-text">Job Details</h3>

      <div>
        <label className="text-[11px] font-semibold text-ma-text-sec mb-1.5 block">Client Name</label>
        <Input placeholder="Enter client name" />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-ma-text-sec mb-1.5 block">Note</label>
        <Textarea placeholder="Enter note" rows={3} className="resize-y" />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-ma-text-sec mb-1.5 block">Assign Typist</label>
        <div className="px-3 py-2.5 rounded-[10px] border border-ma-border text-[13px] text-ma-text-muted flex justify-between items-center cursor-pointer">
          Any Available Typist <I.Chev />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs font-semibold text-ma-text-sec">Priority</div>
          <div className="text-[11px] text-ma-text-muted">Mark as urgent</div>
        </div>
        <Switch checked={priority} onCheckedChange={setPriority} />
      </div>

      {/* Playback section in right panel */}
      {phase === "review" && !hasTrimReplace && (
        <div>
          <div className="text-sm font-semibold text-ma-text mb-2">Playback</div>
          <div className="h-1 bg-[#E2E8F0] rounded-sm mb-1 relative">
            <div className="h-full bg-ma-blue rounded-sm transition-[width] duration-[50ms]" style={{ width: `${playhead * 100}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-ma-text-muted mb-3">
            <span>{fmt(playhead * elapsed)}</span>
            <span>{fmt(elapsed)}</span>
          </div>
          <div className="flex justify-center gap-2">
            <RndBtn onClick={() => { setPlayhead(Math.max(0, playhead - skip15)); setIsPlaying(false); }} size={40}><I.Rew15 s={18} /></RndBtn>
            <RndBtn onClick={() => { if (playhead >= 1) setPlayhead(0); setIsPlaying(!isPlaying); }} size={44} bg="var(--ma-blue)" color="white" border={false} shadow="0 2px 8px rgba(37,99,235,0.3)">
              {isPlaying ? <I.Pause s={18} /> : <I.Play s={18} />}
            </RndBtn>
            <RndBtn onClick={() => { setPlayhead(Math.min(1, playhead + skip15)); setIsPlaying(false); }} size={40}><I.Fwd15 s={18} /></RndBtn>
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <Button
          disabled={phase !== "review"}
          onClick={() => showToast("Sent to typist!", "success")}
          className={cn(
            "w-full font-semibold text-[13px]",
            phase === "review"
              ? "bg-ma-blue hover:bg-ma-blue-dark text-white"
              : "bg-[#E2E8F0] text-ma-text-muted cursor-not-allowed"
          )}
        >
          <I.Save s={14} /> Save &amp; Send to Typist
        </Button>
        <Button
          variant="outline"
          disabled={phase === "idle"}
          className="w-full font-medium text-[13px] border-ma-border"
        >
          Save as Draft
        </Button>
        {phase !== "idle" && (
          <Button
            variant="outline"
            onClick={deleteRecording}
            className="w-full font-medium text-[13px] border-ma-red-light text-ma-red hover:bg-ma-red-light"
          >
            <I.Trash s={14} /> Delete Recording
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex font-sans bg-ma-bg overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div
          className={cn(
            "border-b border-ma-border bg-white flex justify-between items-center shrink-0",
            isSpicy ? "px-7 py-3" : "px-7 py-4"
          )}
        >
          <div>
            <h2 className="text-lg font-bold text-ma-text">Author Studio</h2>
            <p className="mt-0.5 text-[13px] text-ma-text-muted">
              {phase === "idle" ? "Record and manage your dictations" :
               phase === "review" ? `Review recording \u2014 ${fmt(elapsed)}` :
               phase === "recording" ? "Recording in progress..." : "Recording paused"}
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* Spicy: top-bar actions */}
            {isSpicy && phase === "review" && (
              <button
                onClick={() => setShowJobPanel(!showJobPanel)}
                className={cn(
                  "px-4 py-[7px] rounded-lg text-[13px] font-medium cursor-pointer flex items-center gap-1.5",
                  showJobPanel
                    ? "border-[1.5px] border-ma-blue bg-ma-blue-light text-ma-blue"
                    : "border border-ma-border bg-white text-ma-text-sec"
                )}
              >
                <I.Flag s={14} /> Job Details {showJobPanel ? <I.ChevUp /> : <I.Chev />}
              </button>
            )}
            {isSpicy && (
              <>
                <Btn onClick={() => showToast("Saved as draft", "success")} disabled={phase === "idle"} border="1px solid var(--ma-border)">Save Draft</Btn>
                <Btn
                  onClick={() => showToast("Sent to typist!", "success")}
                  disabled={phase !== "review"}
                  bg="var(--ma-blue)"
                  color="white"
                  style={{ boxShadow: phase === "review" ? "0 2px 8px rgba(37,99,235,0.25)" : "none" }}
                >
                  <I.Send s={14} /> Send to Typist
                </Btn>
              </>
            )}

            {!isSpicy && statusBadge}
          </div>
        </div>

        {/* ── Spicy inline job panel ── */}
        {isSpicy && showJobPanel && (
          <div className="px-7 py-4 border-b border-ma-border bg-ma-sidebar flex gap-4 items-end flex-wrap shrink-0 animate-slide-in">
            <div className="flex-1 min-w-[160px]">
              <label className="text-[10px] font-bold text-ma-text-muted mb-1 block uppercase tracking-wide">Client</label>
              <Input placeholder="Client name" className="bg-white" />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[10px] font-bold text-ma-text-muted mb-1 block uppercase tracking-wide">Note</label>
              <Input placeholder="Add a note" className="bg-white" />
            </div>
            <div className="min-w-[140px]">
              <label className="text-[10px] font-bold text-ma-text-muted mb-1 block uppercase tracking-wide">Typist</label>
              <div className="px-3 py-2 rounded-lg border border-ma-border text-[13px] text-ma-text-muted flex justify-between items-center cursor-pointer bg-white">
                Any Available <I.Chev />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <Switch checked={priority} onCheckedChange={setPriority} />
              <span className="text-xs text-ma-text-sec font-medium">Urgent</span>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            className={cn(
              "absolute top-4 right-4 z-[100] px-5 py-2.5 rounded-[10px] text-white text-[13px] font-semibold shadow-lg flex items-center gap-1.5 animate-slide-in",
              toast.type === "success" ? "bg-ma-green" : "bg-ma-blue"
            )}
          >
            {toast.type === "success" && <I.Check />} {toast.msg}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* ── Main Area ── */}
          <div className={cn("flex-1 flex flex-col overflow-auto", isSpicy ? "px-9 py-6" : "p-6")}>
            {/* Mode hints */}

            {phase === "idle" ? (
              /* ── Empty State ── */
              <div className="animate-fade-in flex-1 flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center text-ma-blue",
                    isSpicy ? "w-[100px] h-[100px] mb-6" : "w-[72px] h-[72px] mb-4"
                  )}
                  style={{
                    background: isSpicy ? "linear-gradient(135deg, var(--ma-blue-light), var(--ma-blue-mid))" : "var(--ma-blue-light)",
                    boxShadow: isSpicy ? "0 12px 40px rgba(37,99,235,0.1)" : "none",
                  }}
                >
                  <I.Mic s={isSpicy ? 42 : 30} />
                </div>
                <div className={cn("font-semibold text-ma-text mb-1", isSpicy ? "text-2xl font-bold" : "text-base")}>
                  {isSpicy ? "New Dictation" : "Start a New Dictation"}
                </div>
                <div className={cn("text-ma-text-muted max-w-[400px] text-center leading-relaxed", isSpicy ? "text-[15px] mb-8" : "text-[13px] mb-6")}>
                  {isSpicy
                    ? "Record, edit, and send your dictation. You can trim mistakes, re-record sections, or replace audio from any point."
                    : "Press the microphone button below to begin recording your dictation."}
                </div>
                <button
                  onClick={startRecording}
                  className={cn(
                    "border-none text-white font-semibold cursor-pointer flex items-center gap-2.5 shadow-[0_4px_16px_rgba(37,99,235,0.3)]",
                    isSpicy ? "px-11 py-4 rounded-full text-[15px]" : "px-7 py-3 rounded-[28px] text-sm"
                  )}
                  style={{
                    background: isSpicy ? "linear-gradient(135deg, var(--ma-blue), var(--ma-blue-dark))" : "var(--ma-blue)",
                  }}
                >
                  <I.Mic s={20} /> Start Recording
                </button>
              </div>
            ) : (
              /* ── Recording / Review card ── */
              <div className="animate-fade-in bg-white rounded-[14px] border border-ma-border shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex-1 flex flex-col relative">

                {/* ── Centered instruction hint above waveform ── */}
                {phase === "review" && (editMode === "trim" || editMode === "insert") && !isReRecording && !insertRange && (
                  <div className="text-center pt-4 pb-1 px-6 shrink-0 animate-fade-in">
                    {editMode === "trim" && !selection && (
                      <p className="text-[12px] text-ma-text-muted flex items-center justify-center gap-1.5">
                        <I.Scissors s={13} /> Drag on the waveform to select a section
                      </p>
                    )}
                    {editMode === "insert" && insertPoint === null && (
                      <p className="text-[12px] text-ma-text-muted flex items-center justify-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Tap on the waveform to place your insert point
                      </p>
                    )}
                  </div>
                )}

                {/* Waveform */}
                <div className="flex-1 px-6 pt-7 pb-3 flex items-center">
                  <div className="w-full">
                    <Waveform
                      data={displayWave}
                      playhead={phase === "review" ? playhead : 1}
                      height={isSpicy ? 130 : 100}
                      interactive={phase === "review"}
                      selectedRange={editMode === "trim" ? selection : undefined}
                      replacePoint={editMode === "insert" ? insertPoint : undefined}
                      insertRange={insertRange}
                      onSeek={
                        editMode === "play"
                          ? (p) => { setPlayhead(p); setIsPlaying(false); }
                          : editMode === "insert"
                          ? (p) => { setInsertPoint(p); setPlayhead(p); }
                          : undefined
                      }
                      onDragSelect={editMode === "trim" ? setSelection : undefined}
                    />
                  </div>
                </div>

                {/* Timer + status */}
                <div className="flex justify-center items-center gap-2.5 px-6 pt-2 pb-1.5">
                  {phase === "recording" && (
                    <div className="animate-pulse-dot w-2.5 h-2.5 rounded-full bg-ma-red" />
                  )}
                  {phase === "paused" && (
                    <Badge variant="secondary" className="bg-ma-red-light text-ma-red text-[11px] font-semibold border-0">Paused</Badge>
                  )}
                  <span className="text-[28px] font-bold text-ma-text tabular-nums tracking-tight">
                    {phase === "review" ? fmt(playhead * elapsed) : fmt(elapsed)}
                  </span>
                  {phase === "review" && (
                    <span className="text-sm text-ma-text-muted">/ {fmt(elapsed)}</span>
                  )}
                </div>

                {/* ── Edit mode tabs + cancel ── */}
                {phase === "review" && (editMode === "trim" || editMode === "insert") && (
                  <div className="flex items-center justify-center gap-3 px-6 pt-1 pb-1">
                    <button
                      onClick={() => { setEditMode("play"); setSelection(null); setInsertPoint(null); setInsertRange(null); setIsPlaying(false); }}
                      className="text-[12px] font-medium text-ma-text-muted hover:text-ma-text cursor-pointer bg-transparent border-none px-0"
                    >
                      Cancel
                    </button>

                    {!isReRecording && !insertRange && (
                      <>
                        <div className="w-px h-4 bg-ma-border" />
                        <div className="flex bg-[#F1F5F9] rounded-[8px] p-0.5">
                          <button
                            onClick={() => { setEditMode("trim"); setInsertPoint(null); setIsPlaying(false); }}
                            className={cn(
                              "px-4 py-1.5 rounded-[6px] border-none text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-150",
                              editMode === "trim" ? "bg-white text-ma-text shadow-sm" : "bg-transparent text-ma-text-muted"
                            )}
                          >
                            <I.Scissors s={12} /> Trim
                          </button>
                          <button
                            onClick={() => { setEditMode("insert"); setSelection(null); setIsPlaying(false); }}
                            className={cn(
                              "px-4 py-1.5 rounded-[6px] border-none text-[12px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-150",
                              editMode === "insert" ? "bg-white text-ma-text shadow-sm" : "bg-transparent text-ma-text-muted"
                            )}
                          >
                            <I.Replace s={12} /> Insert
                          </button>
                        </div>
                      </>
                    )}

                    {isReRecording && editMode === "insert" && (
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse-dot w-2 h-2 rounded-full bg-ma-red" />
                        <span className="text-[12px] font-semibold text-ma-red">Recording...</span>
                      </div>
                    )}
                    {!isReRecording && insertRange && (
                      <span className="text-[12px] font-semibold text-ma-amber-dark">Review insert</span>
                    )}
                  </div>
                )}

                {/* ── Controls ── */}
                <div className="px-6 pt-3 pb-6 flex flex-col items-center gap-3">
                  {/* Recording controls */}
                  {phase === "recording" && (
                    <div className="flex items-center gap-3">
                      <RndBtn onClick={pauseRecording} size={44}><I.Pause s={18} /></RndBtn>
                      <RndBtn onClick={stopRecording} size={64} bg="var(--ma-red)" color="white" border={false} shadow="0 4px 16px rgba(239,68,68,0.35)">
                        <I.Stop s={24} />
                      </RndBtn>
                    </div>
                  )}

                  {phase === "paused" && (
                    <div className="flex items-center gap-3">
                      <RndBtn onClick={resumeRecording} size={64} bg="var(--ma-red)" color="white" border={false} shadow="0 4px 16px rgba(239,68,68,0.35)">
                        <I.Mic s={26} />
                      </RndBtn>
                      <div className="w-px h-8 bg-ma-border mx-1" />
                      <RndBtn onClick={stopRecording} size={44}><I.Stop s={18} /></RndBtn>
                    </div>
                  )}

                  {/* Review: consistent playback controls (rew15, play, fwd15) + contextual actions */}
                  {phase === "review" && (
                    <>
                      {/* Always show playback controls unless actively recording insert */}
                      {!(editMode === "insert" && isReRecording) && (
                        <div className="flex items-center gap-3">
                          <RndBtn onClick={() => { setPlayhead(Math.max(0, playhead - skip15)); setIsPlaying(false); }} size={44}><I.Rew15 s={20} /></RndBtn>
                          <RndBtn
                            onClick={() => { if (playhead >= 1) setPlayhead(0); setIsPlaying(!isPlaying); }}
                            size={60}
                            bg="var(--ma-blue)"
                            color="white"
                            border={false}
                            shadow="0 4px 14px rgba(37,99,235,0.35)"
                          >
                            {isPlaying ? <I.Pause s={22} /> : <I.Play s={22} />}
                          </RndBtn>
                          <RndBtn onClick={() => { setPlayhead(Math.min(1, playhead + skip15)); setIsPlaying(false); }} size={44}><I.Fwd15 s={20} /></RndBtn>

                          {/* Edit button — only in play mode */}
                          {editMode === "play" && hasTrimReplace && (
                            <>
                              <div className="w-px h-8 bg-ma-border mx-1" />
                              <Btn
                                onClick={() => { setEditMode("trim"); setIsPlaying(false); }}
                                border="1px solid var(--ma-border)"
                              >
                                <I.Scissors s={14} /> Edit
                              </Btn>
                            </>
                          )}
                        </div>
                      )}

                      {/* Contextual action buttons below playback */}
                      {editMode === "trim" && selection && !showDeleteConfirm && (
                        <div className="flex items-center gap-2">
                          <Btn onClick={() => {
                            if (!selection) return;
                            setShowDeleteConfirm(true);
                          }} bg="white" color="var(--ma-red)" border="1px solid var(--ma-red-light)" disabled={isReRecording}>
                            <I.Trash s={14} /> Delete
                          </Btn>
                          <Btn onClick={handleReRecordSelection} bg="var(--ma-blue)" color="white" disabled={isReRecording}>
                            <I.Mic s={14} /> Re-record
                          </Btn>
                        </div>
                      )}

                      {/* Delete confirmation */}
                      {showDeleteConfirm && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-ma-red-light rounded-[10px] animate-fade-in">
                          <span className="text-[12px] text-ma-red font-medium">Delete this section?</span>
                          <Btn onClick={() => { setShowDeleteConfirm(false); handleDeleteSelection(); }} bg="var(--ma-red)" color="white">Yes, delete</Btn>
                          <Btn onClick={() => setShowDeleteConfirm(false)} border="1px solid var(--ma-border)">Cancel</Btn>
                        </div>
                      )}

                      {/* Insert: ready to record */}
                      {editMode === "insert" && insertPoint !== null && !isReRecording && !insertRange && (
                        <Btn
                          onClick={handleInsertAtPoint}
                          bg="var(--ma-red)"
                          color="white"
                          style={{ borderRadius: 28, padding: "10px 24px" }}
                        >
                          <I.Mic s={15} /> Record at {fmt(insertPoint * elapsed)}
                        </Btn>
                      )}

                      {/* Insert: actively recording */}
                      {editMode === "insert" && isReRecording && (
                        <div className="flex items-center gap-3">
                          <RndBtn onClick={handleStopInsert} size={52} bg="var(--ma-red)" color="white" border={false} shadow="0 4px 12px rgba(239,68,68,0.3)">
                            <I.Stop s={20} />
                          </RndBtn>
                        </div>
                      )}

                      {/* Insert: pending review */}
                      {editMode === "insert" && !isReRecording && insertRange && (
                        <div className="flex items-center gap-2">
                          <Btn onClick={handleDiscardInsert} bg="white" color="var(--ma-red)" border="1px solid var(--ma-red-light)">
                            <I.Trash s={14} /> Discard
                          </Btn>
                          <Btn onClick={handleConfirmInsert} bg="var(--ma-blue)" color="white">
                            <I.Check /> Save Insert
                          </Btn>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mild: hint banner */}
            {variant === "mild" && phase === "review" && (
              <div className="animate-fade-in mt-3 px-4 py-2.5 bg-[#FEF9C3] rounded-[10px] flex items-center gap-2 text-xs text-[#854D0E]">
                <I.Info /> Click anywhere on the waveform to jump to that position. Editing features coming soon.
              </div>
            )}

            {/* Spicy: subtle delete */}
            {isSpicy && phase !== "idle" && (
              <div className="flex justify-end py-1">
                <button
                  onClick={deleteRecording}
                  className="px-3 py-1.5 rounded-md border-none bg-transparent text-ma-red text-xs cursor-pointer font-medium flex items-center gap-1 opacity-60"
                >
                  <I.Trash s={13} /> Delete Recording
                </button>
              </div>
            )}
          </div>

          {/* Right panel (mild + medium only) */}
          {rightPanel}
        </div>
      </div>

    </div>
  );
}

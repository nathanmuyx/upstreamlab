"use client";

import { useState } from "react";
import { DocSection, DocNote } from "@/app/projects/hospitality-safe/page";

/* ─── data ─── */
const alertsData = [
  { desc: "Pasta draw Fridge  – Out of Temperature Range", time: "Today at 00:07 AM" },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 04:40 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 04:40 A..." },
  { desc: "Pasta draw Freezer – Out of Temperature Range", time: "Today at 04:30 AM" },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 03:40 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 03:40 A..." },
  { desc: "Cool Room – Out of Temperature Range", time: "Today at 03:26 AM" },
  { desc: "Grill U/B Fridge – Out of Temperature Range", time: "Today at 03:08 AM" },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 02:40 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 02:40 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:40 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:48 A..." },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:21 A..." },
];

const homeAlertsData = [
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:40 AM" },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:40 AM" },
  { desc: "Pans / Fryer U/B Fridge – Out of Temperature Range", time: "Today at 01:21 AM" },
  { desc: "Larder U/B Fridge  - Out of Temperature Range", time: "Today at 00:00 AM" },
  { desc: "Larder U/B Fridge  - Out of Temperature Range", time: "Today at 00:00 AM" },
];

const todosData = [
  { label: "CHECKLIST", desc: "FOH OPENING LIST 20/12", time: "Today at 12:00 PM", overdue: true },
  { label: "CHECKLIST", desc: "FOH Before Opening List", time: "Today at 18:00 PM", overdue: false },
  { label: "CHECKLIST", desc: "Larder - Mid Day Cleaning", time: "Today at 17:00 PM", overdue: false },
];

/* ─── icons ─── */
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
function RecordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
function DismissIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* ─── timer data ─── */
const tempTimers = [
  { name: "Rebelled Dough", time: "3:27h", actionBy: "4:48pm", progress: 0.82, status: "active" as const },
  { name: "Rebelled Dough", time: "1:54h", actionBy: "3:15pm", progress: 0.47, status: "active" as const },
  { name: "Rebelled Dough", time: "3:59h", actionBy: "5:20pm", progress: 0.99, status: "paused" as const },
];

const timerColor = { active: "#27AE60", paused: "#CCCCCC", expired: "#E74C3C" };

/* ─── TimerCircle ─── */
function TimerCircle({ name, time, actionBy, progress, status, onClick }: { name: string; time: string; actionBy: string; progress: number; status: "active" | "paused" | "expired"; onClick?: () => void }) {
  const color = timerColor[status];
  const r = 32;
  const circumference = 2 * Math.PI * r;
  return (
    <button onClick={onClick} className="flex flex-col items-center cursor-pointer shrink-0" style={{ width: 85 }}>
      <div className="relative w-[72px] h-[72px]">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#E4E7EE" strokeWidth="3" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${progress * circumference} ${circumference}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[7px] text-[#333] font-medium leading-tight text-center px-1">{name}</span>
          <span className="text-[12px] font-bold" style={{ color }}>{time}</span>
        </div>
      </div>
      <span className="text-[7px] text-[#888] mt-0.5">Action by</span>
      <span className="text-[7px] text-[#888]">{actionBy}</span>
    </button>
  );
}

/* ─── Mockup ─── */
export function Mockup({ selectedArea, onSubStepChange, currentStep, onNavigateScreen }: { selectedArea: string; onSubStepChange?: (step: number) => void; currentStep?: number; onNavigateScreen?: (id: string) => void }) {
  const [alertsPanelOpen, setAlertsPanelOpen] = useState(false);
  const [timerDetailsOpen, setTimerDetailsOpen] = useState<number | null>(null);

  const step = currentStep ?? 1;

  if (step === 2 && !alertsPanelOpen) setAlertsPanelOpen(true);
  if (step === 1 && alertsPanelOpen) setAlertsPanelOpen(false);

  const openAlerts = () => { setAlertsPanelOpen(true); onSubStepChange?.(2); };
  const closeAlerts = () => { setAlertsPanelOpen(false); onSubStepChange?.(1); };

  return (
    <div className="h-full flex flex-col bg-[#F0F0F4] relative">
      {/* Main dashboard content */}
      <div className="flex-1 overflow-y-auto">
        {/* Warning Banner */}
        <div className="flex items-center gap-2 mx-3 mt-2 px-3 py-2 rounded-lg text-white" style={{ background: "#2D2F7B" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-bold">Warning: Sensor Alert!</div>
            <div className="text-[7px] opacity-80">Freezer Room is out of temperature range at Mildura!</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2.5 px-3 py-3">
          {[
            { label: "Add Timer", icon: <ClockIcon />, nav: "add-timer" },
            { label: "Add Record", icon: <RecordIcon />, nav: "add-record" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigateScreen?.(action.nav)}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-lg text-white font-semibold text-[9px] cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "#4A5FC1", height: 56 }}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Temperature Timers */}
        <div className="bg-white mb-[1px]">
          <div className="px-3 py-2.5 border-b border-[#E8E8EE]">
            <span className="text-[10px] text-[#555]">Temperature Timers</span>
          </div>
          <div className="px-3 py-3 overflow-x-auto">
            <div className="flex gap-2">
              {tempTimers.map((t, i) => (
                <TimerCircle key={i} {...t} onClick={() => setTimerDetailsOpen(i)} />
              ))}
            </div>
          </div>
        </div>

        {/* Process Timers */}
        <div className="bg-white mb-[1px]">
          <div className="px-3 py-2.5 border-b border-[#E8E8EE]">
            <span className="text-[10px] text-[#555]">Process Timers</span>
          </div>
          <div className="px-3 py-6 text-center">
            <p className="text-[9px] text-[#aaa] italic">No active timers found.</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white mb-[1px]">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E8E8EE]">
            <span className="text-[10px] text-[#555]">Alerts</span>
            <button onClick={openAlerts} className="w-[20px] h-[20px] rounded-md flex items-center justify-center text-white text-[9px] font-bold cursor-pointer" style={{ background: "#E74C3C" }}>
              {homeAlertsData.length}
            </button>
          </div>
          <div>
            {homeAlertsData.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-3 border-b border-[#F0F0F0]" style={{ borderLeft: "3px solid #E74C3C" }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-extrabold tracking-wide text-[#E74C3C] mb-1">SENSOR ALERT</div>
                  <div className="text-[10px] text-[#333] leading-snug">{a.desc}</div>
                </div>
                <span className="text-[7px] text-[#999] shrink-0 pt-1 whitespace-nowrap">{a.time}</span>
                <button className="w-[20px] h-[20px] rounded-full border-2 border-[#ccc] flex items-center justify-center text-[#999] cursor-pointer hover:border-[#E74C3C] hover:text-[#E74C3C] shrink-0 mt-0.5 transition-colors">
                  <DismissIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Todos */}
        <div className="bg-white mb-[1px]">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E8E8EE]">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#555]">Todos</span>
              <span className="w-[5px] h-[5px] rounded-full -mt-2" style={{ background: "#E74C3C" }} />
            </div>
            <div className="flex gap-1">
              <span className="w-[20px] h-[20px] rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "#E74C3C" }}>1</span>
              <span className="w-[20px] h-[20px] rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "#4A5FC1" }}>2</span>
            </div>
          </div>
          <div>
            {todosData.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-3 border-b border-[#F0F0F0]" style={{ borderLeft: `3px solid ${t.overdue ? "#E74C3C" : "transparent"}` }}>
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-extrabold tracking-wide mb-1" style={{ color: "#4A5FC1" }}>{t.label}</div>
                  <div className="text-[10px] text-[#333] font-medium leading-snug">{t.desc}</div>
                </div>
                <span className="text-[7px] text-[#999] shrink-0 pt-1 whitespace-nowrap">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-10" />
      </div>

      {/* ── Timer Details Modal ── */}
      {timerDetailsOpen !== null && (
        <>
          <div className="absolute inset-0 bg-black/20 z-10" onClick={() => setTimerDetailsOpen(null)} />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl border border-[#E4E7EE] w-[220px] p-4">
              <h3 className="text-[11px] font-bold text-[#333] text-center mb-3">Timer Details</h3>
              <div className="text-center mb-3">
                <p className="text-[8px] text-[#888]">Created by: <span className="text-[#333] font-medium">Adele Sarrou</span></p>
                <p className="text-[8px] text-[#888]">Duration: <span className="text-[#333] font-medium">4 hours</span></p>
              </div>

              {tempTimers[timerDetailsOpen]?.status === "paused" ? (
                /* Paused timer actions */
                <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Unpause Timer</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#27AE60" }}>Unpause Timer and Print Label</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Restart Timer</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Finish Timer</button>
                </div>
              ) : (
                /* Active timer actions */
                <div className="flex flex-wrap gap-1.5 justify-center mb-2">
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer border border-[#4A5FC1]" style={{ color: "#4A5FC1" }}>Pause Timer</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#27AE60" }}>Pause Timer and Print Label</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Restart Timer</button>
                  <button onClick={() => setTimerDetailsOpen(null)} className="px-2 py-1 rounded text-[7px] font-medium cursor-pointer text-white" style={{ background: "#4A5FC1" }}>Finish Timer</button>
                </div>
              )}

              <button onClick={() => setTimerDetailsOpen(null)} className="w-full text-center text-[8px] cursor-pointer hover:underline" style={{ color: "#4A5FC1" }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* ── Alerts Side Panel (slides over content, sidebar stays visible) ── */}
      {alertsPanelOpen && (
        <>
          {/* Backdrop over main content only */}
          <div className="absolute inset-0 bg-black/20 z-10" onClick={closeAlerts} />
          {/* Side panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[70%] bg-white z-20 flex flex-col shadow-[-4px_0_12px_rgba(0,0,0,0.15)]">
            {/* Panel header — white with bottom border */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E8E8EE] shrink-0 bg-white">
              <span className="text-[12px] font-bold text-[#333]">Alerts</span>
              <button onClick={closeAlerts} className="text-[9px] text-[#4A5FC1] font-medium cursor-pointer hover:underline">Close</button>
            </div>
            {/* Sub-header with count */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8E8EE] shrink-0 bg-[#FAFAFA]">
              <span className="text-[9px] text-[#666]">Alerts</span>
              <span className="w-[20px] h-[20px] rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "#E74C3C" }}>{alertsData.length}</span>
            </div>
            {/* Alert list */}
            <div className="flex-1 overflow-y-auto">
              {alertsData.map((a, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2.5 border-b border-[#F0F0F0]" style={{ borderLeft: "3px solid #E74C3C" }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[7px] font-extrabold tracking-wide text-[#E74C3C] mb-0.5">SENSOR ALERT</div>
                    <div className="text-[9px] text-[#333] leading-snug">{a.desc}</div>
                  </div>
                  <span className="text-[6px] text-[#999] shrink-0 pt-0.5 whitespace-nowrap">{a.time}</span>
                  <button className="w-[18px] h-[18px] rounded-full border-2 border-[#ccc] flex items-center justify-center text-[#999] cursor-pointer hover:border-[#E74C3C] hover:text-[#E74C3C] shrink-0 mt-0.5 transition-colors">
                    <DismissIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Annotation ─── */
function Annotation({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "issue" | "context" }) {
  const colors = {
    info: { border: "#4A5FC1", label: "Note:" },
    issue: { border: "#E74C3C", label: "Issue:" },
    context: { border: "#F39C12", label: "Context:" },
  };
  const c = colors[type];
  return (
    <div className="text-[10px] text-slate-500 pl-2 mb-1.5" style={{ borderLeft: `2px solid ${c.border}` }}>
      <span className="text-[8px] font-medium mr-1" style={{ color: c.border }}>{c.label}</span>{children}
    </div>
  );
}

/* ─── Docs ─── */
export function Docs({ currentStep }: { currentStep?: number }) {
  const step = currentStep ?? 1;

  /* Step 1: Dashboard */
  if (step === 1) return (
    <>
      <DocSection title="What is this?">
        <p>The main dashboard. Shows quick actions, active timers, sensor alerts, and todo checklists for the current shift.</p>
      </DocSection>
      <DocSection title="Sections">
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li><strong>Quick Actions</strong> — Add Timer, Add Record, Add Label</li>
          <li><strong>Temperature Timers</strong> — active countdown timers for temperature checks</li>
          <li><strong>Process Timers</strong> — active process timers (cooling, cooking, etc.)</li>
          <li><strong>Alerts</strong> — data logger sensor alerts for out-of-range temps. Same alerts as the side panel.</li>
          <li><strong>Todos</strong> — open checklists, scheduled tasks, manual temps due today</li>
        </ul>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation>Indicating if the printer is connected or not. Currently the printer is connected through Bluetooth.</Annotation>
        <Annotation>This shows if a user is logged in or not. A user will enter their 4 digit PIN when entering any data / completing any tasks within the App for traceability purposes.</Annotation>
        <Annotation type="issue">Delete the &ldquo;Add Label&rdquo; button on the homepage — not required. The user can print a food prep label from pressing the label button on the side panel.</Annotation>
        <Annotation>The Alert button shows red when there are active alerts in the app such as data loggers reading temperatures out within set ranges. This can be seen on any page in the app and when pressed opens a side panel screen.</Annotation>
        <Annotation>Alerts show on the home page. These are data logger temperatures out of range. The actions are the same as those alerts that show on the side panel screen.</Annotation>
        <Annotation>This shows the number of active alerts. I do not think this feature is necessary.</Annotation>
        <Annotation>In the To Do section, all tasks that are open like checklists, scheduled things like temperatures (if manual) need to show here. So on the day staff know what tasks are open that they need to complete. This makes sure everything that needs to be done for the day / shift are visible in one central place and completed.</Annotation>
        <Annotation>All jobs when created can be allocated to different work areas which are filtered at the top of the screen, therefore everything on this page filters by the area relevant to the user.</Annotation>
      </DocSection>
    </>
  );

  /* Step 2: Alerts side panel */
  return (
    <>
      <DocSection title="What is this?">
        <p>Side panel showing all active sensor alerts. Opens over the current screen when the red alert button is pressed. Can be accessed from any page in the app.</p>
      </DocSection>
      <DocSection title="Client Notes">
        <Annotation type="issue">The alerts do not fit to screen properly.</Annotation>
        <Annotation type="issue">I am not sure how often or the frequency of alerts showing up on this screen. I think the alerts should only show if the temperature has been out of the set temperature range after 30 minutes. This is when a notification email will be sent to the relevant user/s too.</Annotation>
        <Annotation type="issue">There are clear/delete buttons next to the alerts, currently when they are pressed the alert disappears. However, there needs to be a corrective action box that pops up so the user can record why the unit was out of temperature and what action was taken to rectify the issue. Once the corrective is complete the alert can be closed.</Annotation>
        <Annotation type="issue">Maybe instead of the crosses, we can have swipe feature to delete or add corrective action?</Annotation>
      </DocSection>
      <DocSection title="Corrective Action Options">
        <p>When dismissing an alert, a pop-up box should appear with:</p>
        <ul className="list-disc pl-4 space-y-1 mt-1">
          <li>Drop-down options to select from (predefined reasons)</li>
          <li>An option for free text entry</li>
        </ul>
      </DocSection>
    </>
  );
}

export default function FrameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {children}
    </div>
  );
}

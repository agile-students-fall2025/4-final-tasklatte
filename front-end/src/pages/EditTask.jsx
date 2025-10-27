export default function Placeholder({ title = "Page" }) {
  return (
    <div className="page-root">
      <header className="header">
        <div style={{ width: 56 }} />
        <h1 className="header-title">{title}</h1>
        <button className="logo">Logo</button>
      </header>

      <main className="scroll-area" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: 0.7 }}>
          This is a placeholder. Build this page later.
        </div>
      </main>
    </div>
  );
}

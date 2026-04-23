function Topbar({ title, user, actions }) {
  return (
    <div
      style={{
        height: 56,
        borderBottom: "1px solid var(--d-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        background: "var(--d-bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "1.2rem",
          color: "var(--d-text)",
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {actions}
      </div>
    </div>
  );
}

export {Topbar}
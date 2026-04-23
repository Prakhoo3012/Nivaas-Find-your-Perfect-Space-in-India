function StatCard({ label, value, sub, icon, accent = "var(--gold)" }) {
  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        padding: "1.25rem",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      </div>
      <div
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "2rem",
          color: "var(--d-text)",
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--d-text3)",
          marginTop: "0.4rem",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

export {StatCard}
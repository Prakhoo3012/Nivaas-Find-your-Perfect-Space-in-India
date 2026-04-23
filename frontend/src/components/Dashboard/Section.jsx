function Section({ title, count, badge, action, children }) {
  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--d-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "var(--d-text)",
            }}
          >
            {title}
          </span>
          {(count || count === 0) && (
            <span
              style={{
                fontSize: "0.65rem",
                background: "var(--d-bg4)",
                color: "var(--d-text3)",
                borderRadius: 20,
                padding: "1px 8px",
                border: "1px solid var(--d-border2)",
              }}
            >
              {count}
            </span>
          )}
          {badge > 0 && (
            <span
              style={{
                fontSize: "0.65rem",
                background: "var(--d-amber)",
                color: "#fff",
                borderRadius: 20,
                padding: "1px 8px",
              }}
            >
              {badge} new
            </span>
          )}
        </div>
        {action}
      </div>
      <div style={{ padding: "0.75rem 1.25rem 1.25rem" }}>{children}</div>
    </div>
  );
}

export {Section}
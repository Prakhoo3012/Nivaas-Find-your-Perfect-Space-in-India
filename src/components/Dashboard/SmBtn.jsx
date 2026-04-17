function SmBtn({ children, danger, accent, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 7,
        fontSize: "0.72rem",
        background: danger
          ? "rgba(139,64,64,0.15)"
          : accent
            ? "rgba(200,169,110,0.15)"
            : "var(--d-bg4)",
        border: `1px solid ${danger ? "rgba(139,64,64,0.3)" : accent ? "rgba(200,169,110,0.3)" : "var(--d-border)"}`,
        color: danger ? "#e07070" : accent ? "var(--gold)" : "var(--d-text2)",
        cursor: "pointer",
        fontFamily: "DM Sans, sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export {SmBtn}
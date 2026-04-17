function EmptyState({ icon, text, cta }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2.5rem 1rem",
        color: "var(--d-text3)",
      }}
    >
      <div
        style={{ fontSize: "1.75rem", marginBottom: "0.75rem", opacity: 0.4 }}
      >
        {icon}
      </div>
      <p style={{ fontSize: "0.82rem" }}>{text}</p>
      {cta}
    </div>
  );
}

export {EmptyState}
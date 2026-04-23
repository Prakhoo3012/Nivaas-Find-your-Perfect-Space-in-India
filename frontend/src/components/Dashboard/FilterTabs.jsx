function FilterTabs({ filters, active, setActive, accent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        marginBottom: "1rem",
      }}
    >
      {filters.map((f) => (
        <button
          key={f.value || f}
          onClick={() => setActive(f.value || f)}
          style={{
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: "0.72rem",
            background:
              active === (f.value || f) ? `${accent}22` : "var(--d-bg3)",
            border: `1px solid ${active === (f.value || f) ? `${accent}55` : "var(--d-border)"}`,
            color: active === (f.value || f) ? accent : "var(--d-text3)",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: active === (f.value || f) ? 500 : 400,
            transition: "all 0.15s",
          }}
        >
          {f.label || f.charAt(0).toUpperCase() + f.slice(1)}
          {f.badge > 0 && (
            <span
              style={{
                marginLeft: 5,
                background: "var(--d-amber)",
                color: "#fff",
                borderRadius: 20,
                fontSize: "0.6rem",
                padding: "0px 4px",
              }}
            >
              {f.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export {FilterTabs}
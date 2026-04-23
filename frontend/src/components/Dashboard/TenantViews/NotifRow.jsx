function NotifRow({ notif: n }) {
  const icons = {
    booking: "📅",
    payment: "💳",
    message: "💬",
    alert: "⚠️",
    system: "ℹ️",
  };
  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem 0",
        borderBottom: "1px solid var(--d-border)",
        background: n.unread ? "rgba(192,90,40,0.04)" : "transparent",
        borderRadius: n.unread ? 6 : 0,
      }}
    >
      {n.unread && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--terracotta)",
            flexShrink: 0,
            marginTop: 6,
          }}
        />
      )}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "var(--d-bg3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "0.85rem",
        }}
      >
        {icons[n.type] || "📌"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--d-text)",
            }}
          >
            {n.title}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--d-text3)",
              flexShrink: 0,
            }}
          >
            {n.time}
          </span>
        </div>
        <div
          style={{ fontSize: "0.75rem", color: "var(--d-text3)", marginTop: 2 }}
        >
          {n.desc}
        </div>
      </div>
    </div>
  );
}

export {NotifRow}
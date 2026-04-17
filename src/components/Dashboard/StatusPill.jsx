function StatusPill({ status }) {
  const colours = {
    confirmed: "#3A5F8B",
    pending: "#8B6B2E",
    completed: "#4E7C5F",
    cancelled: "#8B4040",
    rejected: "#8B4040",
    active: "#4E7C5F",
    payment_done: "#2E7D6B",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: "0.65rem",
        fontWeight: 500,
        textTransform: "capitalize",
        letterSpacing: "0.04em",
        background: `${colours[status] || "#555"}22`,
        color: colours[status] || "#888",
        border: `1px solid ${colours[status] || "#555"}44`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: colours[status] || "#888",
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

export { StatusPill };

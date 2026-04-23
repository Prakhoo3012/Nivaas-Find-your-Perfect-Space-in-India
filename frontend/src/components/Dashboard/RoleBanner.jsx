function RoleBanner({ isTenant, isVerified }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 1.75rem",
        fontSize: "0.72rem",
        background: isTenant
          ? "rgba(192,90,40,0.08)"
          : "rgba(200,169,110,0.08)",
        borderBottom: `1px solid ${isTenant ? "rgba(192,90,40,0.15)" : "rgba(200,169,110,0.15)"}`,
        color: isTenant ? "var(--terracotta)" : "var(--gold)",
      }}
    >
      <span>
        {isTenant
          ? "🏠 Tenant Dashboard — Find and manage your stays"
          : "🔑 Owner Dashboard — Manage your properties & bookings"}
      </span>
      {!isVerified && (
        <span
          style={{
            background: "rgba(139,107,46,0.2)",
            border: "1px solid rgba(200,169,110,0.3)",
            color: "var(--gold)",
            padding: "2px 10px",
            borderRadius: 20,
            fontSize: "0.62rem",
          }}
        >
          ⚠️ Account unverified
        </span>
      )}
    </div>
  );
}
export {RoleBanner}
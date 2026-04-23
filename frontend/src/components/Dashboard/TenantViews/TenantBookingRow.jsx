import { useNavigate } from "react-router-dom";
import { fmt, fmtDate } from "../../../utils/helpers";
import { SmBtn } from "../SmBtn";
import { StatusPill } from "../StatusPill";

function TenantBookingRow({ booking: b, showActions = true }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "0.875rem 0",
        borderBottom: "1px solid var(--d-border)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--d-bg3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "1px solid var(--d-border)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--d-text3)"
          strokeWidth="1.2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--d-text)",
            marginBottom: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {b.property.title}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            `📍 ${b.property.location.city}`,
            `📅 ${fmtDate(b.checkIn)} → ${fmtDate(b.checkOut)}`,
            `👤 ${b.guests.adults} guest${b.guests.adults > 1 ? "s" : ""}`,
          ].map((m) => (
            <span
              key={m}
              style={{ fontSize: "0.7rem", color: "var(--d-text3)" }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.05rem",
            color: "var(--d-text)",
          }}
        >
          {fmt(b.priceBreakdown.totalAmount)}
        </div>
        <div style={{ marginTop: 4 }}>
          <StatusPill status={b.status} />
        </div>
        {showActions && (
          <div
            style={{
              display: "flex",
              gap: 4,
              marginTop: 6,
              justifyContent: "flex-end",
            }}
          >
            <SmBtn onClick={() => navigate(`/booking/get-booking/${b._id}`)}>
              View
            </SmBtn>
            {b.status === "pending" && <SmBtn danger>Cancel</SmBtn>}
            {b.status === "completed" && !b.review && (
              <SmBtn accent>Review</SmBtn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export {TenantBookingRow}

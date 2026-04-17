import { useNavigate } from "react-router-dom";
import { fmt, fmtDate } from "../../../utils/helpers";
import { FilterTabs } from "../FilterTabs";
import { Section } from "../Section";
import { useState } from "react";
import { Avatar } from "../Avatar";
import { SmBtn } from "../SmBtn";
import { EmptyState } from "../EmptyState";
import { StatusPill } from "../StatusPill";
import api from "../../../api/axiosInstance";

function OwnerBookingsSection({ bookings }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [localBookings, setLocalBookings] = useState(bookings);
  const [toasts, setToasts] = useState([]);

  const filters = [
    { label: "All", value: "all" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const filtered =
    filter === "all"
      ? localBookings
      : localBookings.filter((b) => b.status === filter);

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3000);
  };

  // Checkout date aa gayi hai ya nahi — aaj ki date >= checkOut date
  const isCheckoutPassed = (checkOutDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkout = new Date(checkOutDate);
    checkout.setHours(0, 0, 0, 0);
    return today >= checkout;
  };

  const markCompleted = async (id) => {
    try {
      await api.patch(`/booking/update-status/${id}`, { status: "completed" });
      setLocalBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
      );
      addToast("Booking marked as completed!", "success");
    } catch {
      addToast("Something went wrong.", "error");
    }
  };

  return (
    <>
      <Section title="My Bookings" count={localBookings.length}>
        <FilterTabs
          filters={filters}
          active={filter}
          setActive={setFilter}
          accent="var(--gold)"
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            text={`No ${filter !== "all" ? filter : ""} bookings found.`}
          />
        ) : (
          filtered.map((b) => (
            <div
              key={b._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.875rem",
                padding: "0.875rem 0",
                borderBottom: "1px solid var(--d-border)",
              }}
            >
              {/* Tenant avatar */}
              <Avatar
                name={b.tenant?.fullName || b.user?.fullName || "T"}
                size={40}
              />

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Tenant name */}
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--d-text)",
                    marginBottom: 2,
                  }}
                >
                  {b.tenant?.fullName || b.user?.fullName || "Tenant"}
                </div>
                {/* Property name */}
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--d-text2)",
                    marginBottom: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  🏠 {b.property?.title || "—"}
                </div>
                {/* Meta chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {[
                    `📅 ${fmtDate(b.checkIn)} → ${fmtDate(b.checkOut)}`,
                    `👤 ${b.guests?.adults ?? 1} guest${(b.guests?.adults ?? 1) > 1 ? "s" : ""}`,
                    b.property?.location?.city
                      ? `📍 ${b.property.location.city}`
                      : null,
                  ]
                    .filter(Boolean)
                    .map((m) => (
                      <span
                        key={m}
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--d-text3)",
                          background: "var(--d-bg3)",
                          padding: "2px 8px",
                          borderRadius: 6,
                          border: "1px solid var(--d-border)",
                        }}
                      >
                        {m}
                      </span>
                    ))}
                </div>
              </div>

              {/* Right: amount + status + actions */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.1rem",
                    color: "var(--d-text)",
                    marginBottom: 4,
                  }}
                >
                  {fmt(b.priceBreakdown?.totalAmount ?? 0)}
                </div>
                <StatusPill status={b.status} />

                {/* View button + booking type */}
                <div
                  style={{
                    marginTop: 5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <SmBtn onClick={() => navigate(`/booking/get-booking/${b._id}`)}>
                    View
                  </SmBtn>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: "var(--d-text3)",
                      background: "var(--d-bg3)",
                      padding: "2px 7px",
                      borderRadius: 20,
                      border: "1px solid var(--d-border)",
                    }}
                  >
                    {b.bookingType?.replace("per_", "") || "—"}
                  </span>
                </div>

                {/* ✅ Mark as Completed button:
                    - Sirf tab dikhega jab status === "confirmed"
                    - Aur checkout date aa gayi ho (aaj >= checkOut) */}
                {b.status === "confirmed" && isCheckoutPassed(b.checkOut) && (
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => markCompleted(b._id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 7,
                        fontSize: "0.72rem",
                        background: "rgba(78,124,95,0.2)",
                        border: "1px solid rgba(78,124,95,0.4)",
                        color: "#6abf85",
                        cursor: "pointer",
                      }}
                    >
                      ✓ Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </Section>

      {/* Toast notifications */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.65rem 1rem",
              borderRadius: 10,
              fontSize: "0.82rem",
              background:
                t.type === "success"
                  ? "rgba(78,124,95,0.95)"
                  : "rgba(139,64,64,0.95)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              animation: "fadeUp 0.3s ease both",
            }}
          >
            {t.type === "success" ? "✓" : "✕"} {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}

export { OwnerBookingsSection };

import { fmt, fmtDate } from "../../../utils/helpers";
import { Section } from "../Section";
import { StatCard } from "../StatCard";
import { StatusPill } from "../StatusPill";
import { NotifRow } from "./NotifRow";
import { TenantBookingRow } from "./TenantBookingRow";

function TenantOverview({ bookings, wishlist, notifications, setTab }) {
  const active = bookings.find((b) => b.status === "confirmed");
  const upcoming = bookings.filter((b) => b.status === "pending").length;
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard
          label="Total bookings"
          value={bookings.length}
          sub="All time"
          icon="📋"
          accent="var(--terracotta)"
        />
        <StatCard
          label="Active stay"
          value={active ? "1" : "0"}
          sub={active ? active.property.location.city : "None currently"}
          icon="🏠"
          accent="var(--terracotta)"
        />
        <StatCard
          label="Saved properties"
          value={wishlist.length}
          sub="In your wishlist"
          icon="❤️"
          accent="var(--terracotta)"
        />
        <StatCard
          label="Unread alerts"
          value={unreadCount}
          sub="Notifications"
          icon="🔔"
          accent="var(--terracotta)"
        />
      </div>

      {active && (
        <Section
          title="Current stay"
          badge={1}
          action={<StatusPill status="confirmed" />}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.15rem",
                  color: "var(--d-text)",
                  marginBottom: 6,
                }}
              >
                {active.property.title}
              </div>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
              >
                {[
                  `📍 ${active.property.location.city}, ${active.property.location.state}`,
                  `📅 ${fmtDate(active.checkIn)} → ${fmtDate(active.checkOut)}`,
                  `💳 ${fmt(active.priceBreakdown.totalAmount)}`,
                ].map((m) => (
                  <span
                    key={m}
                    style={{ fontSize: "0.75rem", color: "var(--d-text2)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "2.5rem",
                  color: "var(--terracotta)",
                  lineHeight: 1,
                }}
              >
                {Math.max(
                  0,
                  Math.round(
                    (new Date(active.checkIn) - new Date()) / 86400000,
                  ),
                )}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--d-text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                days to check-in
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section
        title="Recent bookings"
        count={bookings.length}
        action={
          <button
            onClick={() => setTab("bookings")}
            style={{
              fontSize: "0.75rem",
              color: "var(--terracotta)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View all →
          </button>
        }
      >
        {bookings.slice(0, 2).map((b) => (
          <TenantBookingRow key={b._id} booking={b} />
        ))}
      </Section>

      <Section
        title="Recent activity"
        badge={notifications.filter((n) => n.unread).length}
        action={
          <button
            onClick={() => setTab("notifications")}
            style={{
              fontSize: "0.75rem",
              color: "var(--terracotta)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            See all →
          </button>
        }
      >
        {notifications.slice(0, 3).map((n) => (
          <NotifRow key={n._id} notif={n} />
        ))}
      </Section>
    </div>
  );
}

export {TenantOverview}
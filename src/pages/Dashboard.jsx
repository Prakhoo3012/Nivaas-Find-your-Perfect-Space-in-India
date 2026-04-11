import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fmt, fmtDate, initials } from "../utils/helpers";
import {
  TENANT_BOOKINGS,
  TENANT_WISHLIST,
  TENANT_NOTIFICATIONS,
} from "../constants/tenant";
import { MOCK_LISTINGS, INIT_REQUESTS } from "../constants";
import api from "../api/axiosInstance";

// ─── Shared primitives ────────────────────────────────────────────────────────
function Icon({ d, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

function StatusPill({ status }) {
  const colours = {
    confirmed: "#3A5F8B",
    pending: "#8B6B2E",
    completed: "#4E7C5F",
    cancelled: "#8B4040",
    rejected: "#8B4040",
    active: "#4E7C5F",
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

function Avatar({ name, size = 36 }) {
  const cols = ["#C05A28", "#5E7252", "#C8A96E", "#3A5F8B", "#8B4040"];
  const idx = (name || "?").charCodeAt(0) % cols.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `${cols[idx]}33`,
        border: `1.5px solid ${cols[idx]}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 600,
        color: cols[idx],
        fontFamily: "Cormorant Garamond, serif",
        letterSpacing: "0.05em",
      }}
    >
      {initials(name || "?")}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ user, nav, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const isTenant = user.role === "tenant";
  const accentCol = isTenant ? "var(--terracotta)" : "var(--gold)";

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--d-bg2)",
        borderRight: "1px solid var(--d-border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "1.25rem 1.25rem 1rem",
          cursor: "pointer",
          borderBottom: "1px solid var(--d-border)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "var(--d-bg4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--d-border2)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentCol}
            strokeWidth="2.2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.3rem",
            fontWeight: 500,
            color: "var(--d-text)",
            letterSpacing: "0.02em",
          }}
        >
          Nivaas
        </span>
      </div>

      {/* User pill */}
      <div
        style={{
          margin: "1rem 0.875rem",
          background: "var(--d-bg3)",
          borderRadius: 12,
          padding: "0.875rem",
          border: "1px solid var(--d-border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar name={user.fullName || user.username} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--d-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.fullName || user.username}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accentCol,
                padding: "1px 7px",
                background: `${accentCol}18`,
                borderRadius: 20,
                border: `1px solid ${accentCol}33`,
              }}
            >
              {user.role}
            </span>
            {!user.isVerified && (
              <span style={{ fontSize: "0.6rem", color: "var(--d-text3)" }}>
                · Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.875rem" }}>
        <div
          style={{
            fontSize: "0.62rem",
            fontWeight: 500,
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
            paddingLeft: "0.25rem",
          }}
        >
          Menu
        </div>
        {nav.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0.55rem 0.75rem",
                borderRadius: 9,
                marginBottom: 2,
                background: isActive ? `${accentCol}18` : "transparent",
                border: isActive
                  ? `1px solid ${accentCol}33`
                  : "1px solid transparent",
                color: isActive ? accentCol : "var(--d-text2)",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: isActive ? 500 : 400,
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span
                  style={{
                    background: accentCol,
                    color: "#fff",
                    borderRadius: 20,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    padding: "1px 6px",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{ padding: "0.875rem", borderTop: "1px solid var(--d-border)" }}
      >
        <button
          onClick={() => navigate("/auth")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0.55rem 0.75rem",
            borderRadius: 9,
            background: "transparent",
            border: "1px solid var(--d-border)",
            color: "var(--d-text3)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.15s",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function Topbar({ title, user, actions }) {
  return (
    <div
      style={{
        height: 56,
        borderBottom: "1px solid var(--d-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        background: "var(--d-bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "1.2rem",
          color: "var(--d-text)",
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {actions}
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent = "var(--gold)" }) {
  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        padding: "1.25rem",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      </div>
      <div
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "2rem",
          color: "var(--d-text)",
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--d-text3)",
          marginTop: "0.4rem",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════════════════════
// TENANT VIEWS
// ═════════════════════════════════════════════════════════════════════════════

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

function TenantBookingRow({ booking: b, showActions = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "0.875rem 0",
        borderBottom: "1px solid var(--d-border)",
        lastChild: { borderBottom: "none" },
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
            <SmBtn>View</SmBtn>
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

function TenantBookingsTab({ bookings }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "confirmed", "pending", "completed", "cancelled"];
  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  return (
    <Section title="My Bookings" count={bookings.length}>
      <FilterTabs
        filters={filters}
        active={filter}
        setActive={setFilter}
        accent="var(--terracotta)"
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          text={`No ${filter !== "all" ? filter : ""} bookings found.`}
        />
      ) : (
        filtered.map((b) => (
          <TenantBookingRow key={b._id} booking={b} showActions />
        ))
      )}
    </Section>
  );
}

function TenantWishlistTab({ wishlist, onRemove }) {
  return (
    <Section title="Saved Properties" count={wishlist.length}>
      {wishlist.length === 0 ? (
        <EmptyState
          icon="❤️"
          text="Your wishlist is empty."
          cta={
            <Link to="/">
              <button
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 9,
                  background: "var(--d-bg3)",
                  border: "1px solid var(--d-border)",
                  color: "var(--d-text)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                }}
              >
                Browse listings
              </button>
            </Link>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "1rem",
          }}
        >
          {wishlist.map((p) => (
            <div
              key={p._id}
              style={{
                background: "var(--d-bg3)",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--d-border)",
              }}
            >
              <div
                style={{
                  height: 100,
                  background: "var(--d-bg4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--d-text3)"
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <button
                  onClick={() => onRemove(p._id)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.4)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div style={{ padding: "0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--d-text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 3,
                  }}
                >
                  {p.propertyType}
                </div>
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
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--d-text3)",
                    marginBottom: "0.5rem",
                  }}
                >
                  📍 {p.location.city}
                </div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.05rem",
                    color: "var(--d-text)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {fmt(p.pricing.basePrice)}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--d-text3)",
                      fontFamily: "DM Sans",
                    }}
                  >
                    {" "}
                    /{p.pricing.priceType.replace("per_", "")}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link to={`/property/${p._id}`} style={{ flex: 1 }}>
                    <SmBtn style={{ width: "100%" }}>View</SmBtn>
                  </Link>
                  <SmBtn accent>Book</SmBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

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

function TenantNotificationsTab({ notifications, onMarkAll }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "unread", "booking", "payment", "message"];
  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => n.unread)
        : notifications.filter((n) => n.type === filter);
  return (
    <Section
      title="Notifications"
      badge={notifications.filter((n) => n.unread).length}
      action={
        <button
          onClick={onMarkAll}
          style={{
            fontSize: "0.72rem",
            color: "var(--terracotta)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Mark all read
        </button>
      }
    >
      <FilterTabs
        filters={filters}
        active={filter}
        setActive={setFilter}
        accent="var(--terracotta)"
      />
      {filtered.length === 0 ? (
        <EmptyState icon="🔔" text="No notifications here." />
      ) : (
        filtered.map((n) => <NotifRow key={n._id} notif={n} />)
      )}
    </Section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// OWNER VIEWS
// ═════════════════════════════════════════════════════════════════════════════

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

function OwnerOverview({ listings, requests }) {
  const confirmed = requests.filter((r) => r.status === "confirmed").length;
  const revenue = requests
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + r.priceBreakdown.totalAmount, 0);
  const pending = requests.filter((r) => r.status === "pending").length;

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
          label="Total listings"
          value={listings.length}
          sub="+2 this month"
          icon="🏠"
          accent="var(--gold)"
        />
        <StatCard
          label="Pending requests"
          value={pending}
          sub={`${confirmed} confirmed`}
          icon="📥"
          accent="var(--gold)"
        />
        <StatCard
          label="Revenue"
          value={fmt(revenue)}
          sub="From completed bookings"
          icon="💰"
          accent="var(--gold)"
        />
        <StatCard
          label="Avg. rating"
          value="4.7"
          sub="Across all listings"
          icon="⭐"
          accent="var(--gold)"
        />
      </div>
      <OwnerListingsSection listings={listings} />
      <OwnerRequestsSection
        requests={requests}
        setRequests={() => {}}
        addToast={() => {}}
      />
    </div>
  );
}

function OwnerListingsSection({ listings }) {
  const [filter, setFilter] = useState("all");
  const types = ["all", "flat", "pg", "room", "hostel", "villa"];
  const filtered =
    filter === "all"
      ? listings
      : listings.filter((l) => l.propertyType === filter);
  return (
    <Section title="My Listings" count={listings.length}>
      <FilterTabs
        filters={types}
        active={filter}
        setActive={setFilter}
        accent="var(--gold)"
      />
      {filtered.length === 0 ? (
        <EmptyState icon="🏘️" text="No listings for this type." />
      ) : (
        filtered.map((l) => (
          <div
            key={l._id}
            style={{
              display: "flex",
              alignItems: "center",
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
                {l.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[
                  `📍 ${l.location.city}`,
                  `${l.propertyType.toUpperCase()}`,
                  `${l.roomInfo.availableRooms} room(s)`,
                ].map((m) => (
                  <span
                    key={m}
                    style={{ fontSize: "0.7rem", color: "var(--d-text3)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              {l.ratings.count > 0 && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--gold)",
                    marginTop: 2,
                  }}
                >
                  ⭐ {l.ratings.average}{" "}
                  <span style={{ color: "var(--d-text3)" }}>
                    ({l.ratings.count})
                  </span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.05rem",
                  color: "var(--d-text)",
                }}
              >
                {fmt(l.pricing.basePrice)}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--d-text3)",
                    fontFamily: "DM Sans",
                  }}
                >
                  {" "}
                  /{l.pricing.priceType.replace("per_", "")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 6,
                  justifyContent: "flex-end",
                }}
              >
                <SmBtn>Edit</SmBtn>
                <SmBtn>View</SmBtn>
              </div>
            </div>
          </div>
        ))
      )}
    </Section>
  );
}

function OwnerRequestsSection({ requests: initReqs }) {
  const [requests, setRequests] = useState(initReqs);
  const [filter, setFilter] = useState("all");
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3000);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending", badge: pendingCount },
    { label: "Confirmed", value: "confirmed" },
    { label: "Rejected", value: "rejected" },
    { label: "Completed", value: "completed" },
  ];

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handle = (id, action) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: action } : r)),
    );
    addToast(
      action === "confirmed" ? "Booking accepted!" : "Booking rejected.",
      action === "confirmed" ? "success" : "error",
    );
  };

  return (
    <>
      <Section
        title="Booking Requests"
        count={requests.length}
        badge={pendingCount}
      >
        <FilterTabs
          filters={filters}
          active={filter}
          setActive={setFilter}
          accent="var(--gold)"
        />
        {filtered.length === 0 ? (
          <EmptyState icon="📥" text="No requests here." />
        ) : (
          filtered.map((r) => (
            <div
              key={r._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.875rem",
                padding: "0.875rem 0",
                borderBottom: "1px solid var(--d-border)",
              }}
            >
              <Avatar name={r.tenant.fullName} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--d-text)",
                    marginBottom: 2,
                  }}
                >
                  {r.tenant.fullName}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--d-text2)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.property.title}
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {[
                    `📅 ${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`,
                    `👤 ${r.guests.adults} guest${r.guests.adults > 1 ? "s" : ""}`,
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
                  {fmt(r.priceBreakdown.totalAmount)}
                </div>
                <div style={{ marginTop: 4 }}>
                  <StatusPill status={r.status} />
                </div>
                {r.status === "pending" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 6,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handle(r._id, "confirmed")}
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
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handle(r._id, "rejected")}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 7,
                        fontSize: "0.72rem",
                        background: "rgba(139,64,64,0.15)",
                        border: "1px solid rgba(139,64,64,0.3)",
                        color: "#e07070",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </Section>

      {/* Toasts */}
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

function OwnerSettingsTab({ user }) {
  const fields = [
    ["Full name", user.fullName || ""],
    ["Email", user.email || ""],
    ["Phone", user.phone || ""],
    ["Username", user.username || ""],
  ];
  return (
    <Section title="Account Settings">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: 600,
        }}
      >
        {fields.map(([label, val]) => (
          <div key={label}>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--d-text3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
            <input
              defaultValue={val}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                background: "var(--d-bg3)",
                border: "1px solid var(--d-border)",
                borderRadius: 8,
                color: "var(--d-text)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>
        ))}
        <div style={{ gridColumn: "1/-1", paddingTop: "0.5rem" }}>
          <button
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: 8,
              background: "var(--gold)",
              border: "none",
              color: "#1a1500",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </Section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD (role-aware)
// ═════════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  console.log("Hello From DASH");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlist, setWishlist] = useState(TENANT_WISHLIST);
  const [notifs, setNotifs] = useState(TENANT_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        console.log("DASH RES: ", res);

        setUser(res?.data?.data);
      } catch (err) {
        console.log("ERROR FROM DASH: ", err);
        setUser(null);
        
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  console.log("User from DASH: ",user)

  // ── Role banner ───────────────────────────────────────────────────────────
  const RoleBanner = () => (
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
      {!user.isVerified && (
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if(!user) {
    navigate("/auth");
    return null;
  }

  const isTenant = user?.role === "tenant";
  const unread = notifs.filter((n) => n.unread).length;

   // ── Nav configs per role ──────────────────────────────────────────────────
  const tenantNav = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "bookings", label: "My Bookings", icon: "📋" },
    { id: "wishlist", label: "Wishlist", icon: "❤️", badge: wishlist.length },
    { id: "notifications", label: "Notifications", icon: "🔔", badge: unread },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const ownerNav = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "listings", label: "Listings", icon: "🏠" },
    {
      id: "requests",
      label: "Requests",
      icon: "📥",
      badge: INIT_REQUESTS.filter((r) => r.status === "pending").length,
    },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const nav = isTenant ? tenantNav : ownerNav;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--d-bg)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <Sidebar
        user={user}
        nav={nav}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <RoleBanner />
        <Topbar
          title={nav.find((n) => n.id === activeTab)?.label || "Dashboard"}
          user={user}
          actions={
            isTenant ? (
              <Link to="/">
                <button
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: 8,
                    background: "rgba(192,90,40,0.1)",
                    border: "1px solid rgba(192,90,40,0.2)",
                    color: "var(--terracotta)",
                    fontFamily: "DM Sans",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  Browse listings
                </button>
              </Link>
            ) : (
              <button
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 8,
                  background: "var(--gold)",
                  border: "none",
                  color: "#1a1500",
                  fontFamily: "DM Sans",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                + New listing
              </button>
            )
          }
        />

        <div style={{ flex: 1, padding: "1.75rem", overflowY: "auto" }}>
          {/* ── TENANT VIEWS ─────────────────────────────────── */}
          {isTenant && activeTab === "overview" && (
            <TenantOverview
              bookings={TENANT_BOOKINGS}
              wishlist={wishlist}
              notifications={notifs}
              setTab={setActiveTab}
            />
          )}
          {isTenant && activeTab === "bookings" && (
            <TenantBookingsTab bookings={TENANT_BOOKINGS} />
          )}
          {isTenant && activeTab === "wishlist" && (
            <TenantWishlistTab
              wishlist={wishlist}
              onRemove={(id) =>
                setWishlist((w) => w.filter((p) => p._id !== id))
              }
            />
          )}
          {isTenant && activeTab === "notifications" && (
            <TenantNotificationsTab
              notifications={notifs}
              onMarkAll={() =>
                setNotifs((n) => n.map((x) => ({ ...x, unread: false })))
              }
            />
          )}
          {isTenant && activeTab === "settings" && (
            <OwnerSettingsTab user={user} />
          )}

          {/* ── OWNER VIEWS ──────────────────────────────────── */}
          {!isTenant && activeTab === "overview" && (
            <OwnerOverview listings={MOCK_LISTINGS} requests={INIT_REQUESTS} />
          )}
          {!isTenant && activeTab === "listings" && (
            <OwnerListingsSection listings={MOCK_LISTINGS} />
          )}
          {!isTenant && activeTab === "requests" && (
            <OwnerRequestsSection requests={INIT_REQUESTS} />
          )}
          {!isTenant && activeTab === "earnings" && (
            <Section title="Earnings">
              <EmptyState icon="💰" text="Earnings chart coming soon." />
            </Section>
          )}
          {!isTenant && activeTab === "settings" && (
            <OwnerSettingsTab user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fmt, fmtDate } from "../utils/helpers";
import {
  TENANT_BOOKINGS,
  TENANT_WISHLIST,
  TENANT_NOTIFICATIONS,
  TENANT_PROFILE,
} from "../constants/tenant";

// ─── Icons ────────────────────────────────────────────────────
const Icon = ({ d, size = 15, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path d={d} />
  </svg>
);

// ─── Status pill ──────────────────────────────────────────────
function StatusPill({ status }) {
  return <span className={`td-pill ${status}`}>{status}</span>;
}

// ─── Notification icon ────────────────────────────────────────
function NotifIcon({ type }) {
  const icons = {
    booking: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    payment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    message: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    alert:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    system:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return <div className={`td-notif-icon ${type}`}>{icons[type]}</div>;
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────
function Overview({ bookings, wishlist, notifications, onTabChange }) {
  const active    = bookings.find((b) => b.status === "confirmed");
  const upcoming  = bookings.filter((b) => b.status === "pending").length;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const daysUntil = active
    ? Math.max(0, Math.round((new Date(active.checkIn) - new Date()) / 86400000))
    : 0;

  return (
    <div>
      {/* Stats */}
      <div className="td-stats">
        {[
          { label:"Total bookings",  value: bookings.length,  sub:"All time",           icon:"📋" },
          { label:"Active stay",     value: active ? "1"  : "0", sub: active ? active.property.location.city : "None currently", icon:"🏠" },
          { label:"Saved properties",value: wishlist.length,  sub:"In your wishlist",   icon:"❤️" },
          { label:"Unread alerts",   value: unreadCount,      sub:"Notifications",       icon:"🔔" },
        ].map((s, i) => (
          <div className="td-stat-card" key={i} style={{ animationDelay:`${i * 0.06}s` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div className="td-stat-label">{s.label}</div>
              <span style={{ fontSize:"1.1rem" }}>{s.icon}</span>
            </div>
            <div className="td-stat-value">{s.value}</div>
            <div className="td-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Current active stay */}
      {active && (
        <div className="td-section" style={{ marginBottom:"1.5rem" }}>
          <div className="td-section-head">
            <span className="td-section-title">Current stay</span>
            <span className="td-cb-badge">Active</span>
          </div>
          <div className="td-current-booking">
            <div style={{ flex:1 }}>
              <div className="td-cb-title">{active.property.title}</div>
              <div className="td-cb-meta">
                <span>📍 {active.property.location.city}, {active.property.location.state}</span>
                <span>📅 {fmtDate(active.checkIn)} → {fmtDate(active.checkOut)}</span>
                <span>💳 {fmt(active.priceBreakdown.totalAmount)}</span>
              </div>
            </div>
            <div className="td-cb-countdown">
              <div className="td-cb-days">{daysUntil}</div>
              <div className="td-cb-days-label">days to check-in</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="td-section">
        <div className="td-section-head">
          <span className="td-section-title">
            Recent bookings
            <span className="td-section-count">{bookings.length}</span>
          </span>
          <button className="td-section-action" onClick={() => onTabChange("bookings")}>View all →</button>
        </div>
        {bookings.slice(0, 2).map((b) => (
          <BookingRow key={b._id} booking={b} />
        ))}
      </div>

      {/* Recent notifications */}
      <div className="td-section">
        <div className="td-section-head">
          <span className="td-section-title">
            Recent activity
            {unreadCount > 0 && <span className="td-section-count">{unreadCount} new</span>}
          </span>
          <button className="td-section-action" onClick={() => onTabChange("notifications")}>See all →</button>
        </div>
        {notifications.slice(0, 3).map((n) => (
          <NotifRow key={n._id} notif={n} />
        ))}
      </div>
    </div>
  );
}

// ─── BOOKING ROW (shared) ──────────────────────────────────────
function BookingRow({ booking: b, showActions = false }) {
  const navigate = useNavigate();
  return (
    <div className="td-booking-card">
      <div className="td-booking-thumb">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <div className="td-booking-info">
        <div className="td-booking-title">{b.property.title}</div>
        <div className="td-booking-loc">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {b.property.location.city}, {b.property.location.state}
        </div>
        <div className="td-booking-meta">
          <span className="td-booking-meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
          </span>
          <span className="td-booking-meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {b.guests.adults} guest{b.guests.adults > 1 ? "s" : ""}
          </span>
          <span className="td-booking-meta-item" style={{ textTransform:"capitalize" }}>
            {b.property.propertyType}
          </span>
        </div>
      </div>
      <div className="td-booking-right">
        <div className="td-booking-amount-label">total</div>
        <div className="td-booking-amount">{fmt(b.priceBreakdown.totalAmount)}</div>
        <div style={{ margin:"6px 0" }}><StatusPill status={b.status} /></div>
        {showActions && (
          <div className="td-booking-actions">
            <Link to={`/property/${b.property._id}`}>
              <button className="td-btn-sm">View</button>
            </Link>
            {b.status === "pending" && (
              <button className="td-btn-sm danger">Cancel</button>
            )}
            {b.status === "completed" && !b.review && (
              <button className="td-btn-sm primary">Review</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BOOKINGS TAB ─────────────────────────────────────────────
function BookingsTab({ bookings }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "confirmed", "pending", "completed", "cancelled"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="td-section">
      <div className="td-section-head">
        <span className="td-section-title">
          My bookings
          <span className="td-section-count">{bookings.length}</span>
        </span>
        <div className="td-tabs">
          {filters.map((f) => (
            <button key={f} className={`td-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="td-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p>No {filter !== "all" ? filter : ""} bookings found.</p>
        </div>
      ) : (
        filtered.map((b) => <BookingRow key={b._id} booking={b} showActions />)
      )}
    </div>
  );
}

// ─── WISHLIST TAB ─────────────────────────────────────────────
function WishlistTab({ wishlist, onRemove }) {
  return (
    <div className="td-section">
      <div className="td-section-head">
        <span className="td-section-title">
          Saved properties
          <span className="td-section-count">{wishlist.length}</span>
        </span>
      </div>
      {wishlist.length === 0 ? (
        <div className="td-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          <p>Your wishlist is empty.</p>
          <Link to="/"><button className="td-empty-btn">Browse listings</button></Link>
        </div>
      ) : (
        <div className="td-wishlist-grid">
          {wishlist.map((p) => (
            <div key={p._id} className="td-wish-card">
              <div className="td-wish-img">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                {p.isNew && (
                  <div style={{ position:"absolute", top:8, left:8, background:"var(--terracotta)", color:"#fff", fontSize:"0.58rem", borderRadius:20, padding:"2px 8px", fontWeight:500, textTransform:"uppercase" }}>New</div>
                )}
                <button className="td-wish-remove" onClick={() => onRemove(p._id)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="td-wish-body">
                <div className="td-wish-type">{p.propertyType}</div>
                <div className="td-wish-title">{p.title}</div>
                <div className="td-wish-loc">📍 {p.location.city}, {p.location.state}</div>
                <div className="td-wish-price">{fmt(p.pricing.basePrice)}<span style={{ fontSize:"0.72rem", color:"var(--d-text3)", fontFamily:"DM Sans" }}> /{p.pricing.priceType.replace("per_","")}</span></div>
              </div>
              <div style={{ padding:"0 0.75rem 0.75rem", display:"flex", gap:6 }}>
                <Link to={`/property/${p._id}`} style={{ flex:1 }}>
                  <button className="td-btn-sm" style={{ width:"100%" }}>View</button>
                </Link>
                <button className="td-btn-sm primary">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATION ROW (shared) ────────────────────────────────
function NotifRow({ notif: n }) {
  return (
    <div className={`td-notif-item${n.unread ? " unread" : ""}`}>
      {n.unread && <div className="td-notif-unread-dot" />}
      <NotifIcon type={n.type} />
      <div className="td-notif-body">
        <div className="td-notif-title-row">
          <span className="td-notif-title">{n.title}</span>
          <span className="td-notif-time">{n.time}</span>
        </div>
        <div className="td-notif-desc">{n.desc}</div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────
function NotificationsTab({ notifications, onMarkAll }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? notifications
    : filter === "unread" ? notifications.filter((n) => n.unread)
    : notifications.filter((n) => n.type === filter);

  return (
    <div className="td-section">
      <div className="td-section-head">
        <span className="td-section-title">
          Notifications
          {notifications.filter((n) => n.unread).length > 0 && (
            <span className="td-section-count">{notifications.filter((n) => n.unread).length} unread</span>
          )}
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <div className="td-tabs">
            {["all","unread","booking","payment","message"].map((f) => (
              <button key={f} className={`td-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="td-section-action" onClick={onMarkAll}>Mark all read</button>
        </div>
      </div>
      {filtered.length === 0
        ? <div className="td-empty"><p>No notifications here.</p></div>
        : filtered.map((n) => <NotifRow key={n._id} notif={n} />)
      }
    </div>
  );
}

// ─── MAIN TENANT DASHBOARD ────────────────────────────────────
export default function TenantDashboard() {
  const navigate  = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlist,  setWishlist]  = useState(TENANT_WISHLIST);
  const [notifs,    setNotifs]    = useState(TENANT_NOTIFICATIONS);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const removeWishlist = (id) => setWishlist((w) => w.filter((p) => p._id !== id));
  const markAllRead    = ()   => setNotifs((n) => n.map((x) => ({ ...x, unread:false })));

  const NAV = [
    { id:"overview",      label:"Overview",       icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id:"bookings",      label:"My Bookings",    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id:"wishlist",      label:"Wishlist",        icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, count: wishlist.length },
    { id:"notifications", label:"Notifications",  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, badge: unreadCount },
    { id:"profile",       label:"Profile",         icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  const PAGE_TITLES = { overview:"Overview", bookings:"My Bookings", wishlist:"Saved Properties", notifications:"Notifications", profile:"Profile" };

  return (
    <div className="td-root">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="td-sidebar">
        <div className="td-sb-brand" onClick={() => navigate("/")}>
          <div className="td-sb-logo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="td-sb-name">Nivaas</span>
        </div>

        {/* User pill */}
        <div className="td-user-pill">
          <div className="td-avatar">{TENANT_PROFILE.initials}</div>
          <div className="td-user-info">
            <div className="td-user-name">{TENANT_PROFILE.fullName}</div>
            <div className="td-user-role">Tenant</div>
            {TENANT_PROFILE.verified && (
              <div className="td-verified">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Verified
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="td-nav">
          <div className="td-nav-label">Menu</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`td-nav-item${activeTab === item.id ? " active" : ""}`}
              onClick={() => item.id === "profile" ? navigate("/profile") : setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
              {item.badge > 0 && <span className="td-nav-badge">{item.badge}</span>}
              {item.count > 0 && !item.badge && (
                <span style={{ marginLeft:"auto", fontSize:"0.7rem", color:"var(--d-text3)" }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="td-sb-footer">
          <button className="td-logout-btn" onClick={() => navigate("/auth")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="td-main">
        <div className="td-topbar">
          <span className="td-topbar-title">{PAGE_TITLES[activeTab]}</span>
          <div className="td-topbar-right">
            <button className="td-icon-btn" onClick={() => setActiveTab("notifications")} title="Notifications">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              {unreadCount > 0 && <span className="td-notif-dot" />}
            </button>
            <button className="td-icon-btn" onClick={() => navigate("/profile")} title="Profile">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <Link to="/">
              <button style={{ padding:"0.4rem 1rem", borderRadius:8, background:"rgba(192,90,40,0.1)", border:"1px solid rgba(192,90,40,0.2)", color:"var(--terracotta)", fontFamily:"DM Sans,sans-serif", fontSize:"0.78rem", cursor:"pointer" }}>
                Browse listings
              </button>
            </Link>
          </div>
        </div>

        <div className="td-content">
          {activeTab === "overview" && (
            <Overview
              bookings={TENANT_BOOKINGS}
              wishlist={wishlist}
              notifications={notifs}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === "bookings" && <BookingsTab bookings={TENANT_BOOKINGS} />}
          {activeTab === "wishlist" && <WishlistTab wishlist={wishlist} onRemove={removeWishlist} />}
          {activeTab === "notifications" && <NotificationsTab notifications={notifs} onMarkAll={markAllRead} />}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_LISTINGS, INIT_REQUESTS } from "../constants";
import { fmt, fmtDate, initials } from "../utils/helpers";

function StatusPill({ status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}

function StatsBar({ listings, requests }) {
  const confirmed = requests.filter((r) => r.status === "confirmed").length;
  const revenue   = requests.filter((r) => r.status === "completed").reduce((s, r) => s + r.priceBreakdown.totalAmount, 0);
  const pending   = requests.filter((r) => r.status === "pending").length;
  const stats = [
    { label:"Total listings",    value: listings.length, change:"+2 this month", up:true  },
    { label:"Pending requests",  value: pending,          change:`${confirmed} confirmed`, up:false },
    { label:"Revenue (all time)",value: fmt(revenue),     change:"Completed bookings",     up:true  },
    { label:"Avg. rating",       value: "4.7",            change:"Across all listings",    up:true  },
  ];
  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div className="stat-card" key={i} style={{ animationDelay:`${i * 0.05}s` }}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className={`stat-change ${s.up ? "up" : "neutral"}`}>
            {s.up && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>}
            {s.change}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsSection({ listings }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? listings : listings.filter((l) => l.propertyType === filter);
  return (
    <div className="d-section">
      <div className="section-header">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span className="section-title">My listings</span>
          <span className="section-count">{listings.length}</span>
        </div>
        <div className="filter-tabs">
          {["all","flat","pg","room","hostel","villa"].map((f) => (
            <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0
        ? <div className="d-empty-state"><p>No listings for this filter.</p></div>
        : filtered.map((l) => (
          <div key={l._id} className="listing-item">
            <div className="listing-thumb">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="listing-info">
              <div className="listing-title">{l.title}</div>
              <div className="listing-meta">
                <span>{l.location.city}, {l.location.state}</span>
                <span>{l.propertyType.toUpperCase()}</span>
                <span>{l.roomInfo.availableRooms} room(s)</span>
              </div>
              {l.ratings.count > 0
                ? <div className="listing-rating">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    {l.ratings.average} <span style={{ color:"var(--d-text3)" }}>({l.ratings.count})</span>
                  </div>
                : <div style={{ fontSize:"0.7rem", color:"var(--d-text3)", marginTop:2 }}>No reviews yet</div>
              }
            </div>
            <div className="listing-price">
              {fmt(l.pricing.basePrice)}
              <span style={{ fontFamily:"DM Sans", fontSize:"0.7rem", color:"var(--d-text2)" }}> /{l.pricing.priceType.replace("per_","")}</span>
            </div>
            <div className="listing-actions">
              <button className="btn-sm">Edit</button>
              <button className="btn-sm">View</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function RequestsSection({ requests, setRequests, addToast }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const handle = (id, action) => {
    setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status:action } : r));
    addToast(action === "confirmed" ? "Booking accepted!" : "Booking rejected.", action === "confirmed" ? "success" : "error");
  };
  return (
    <div className="d-section">
      <div className="section-header">
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span className="section-title">Booking requests</span>
          <span className="section-count">{requests.length}</span>
        </div>
        <div className="filter-tabs">
          {["all","pending","confirmed","rejected","completed"].map((f) => (
            <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && requests.filter((r) => r.status === "pending").length > 0 && (
                <span style={{ marginLeft:4, background:"var(--d-amber)", color:"#fff", borderRadius:20, fontSize:"0.6rem", padding:"1px 5px" }}>
                  {requests.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0
        ? <div className="d-empty-state"><p>No requests here.</p></div>
        : <div className="requests-list">
            {filtered.map((r, i) => (
              <div key={r._id} className="request-card" style={{ animationDelay:`${i * 0.05}s` }}>
                <div className="req-avatar">{initials(r.tenant.fullName)}</div>
                <div className="req-info">
                  <div className="req-tenant">{r.tenant.fullName}</div>
                  <div className="req-property">{r.property.title}</div>
                  <div className="req-meta">
                    <span className="req-meta-item">📅 {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}</span>
                    <span className="req-meta-item">👤 {r.guests.adults} guest{r.guests.adults > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="req-divider" />
                <div style={{ textAlign:"right" }}>
                  <div className="req-amount">{fmt(r.priceBreakdown.totalAmount)}</div>
                  <div className="req-amount-label">total</div>
                  <div style={{ marginTop:6 }}><StatusPill status={r.status} /></div>
                </div>
                {r.status === "pending" && (
                  <>
                    <div className="req-divider" />
                    <div className="req-actions">
                      <button className="btn-accept" onClick={() => handle(r._id, "confirmed")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        Accept
                      </button>
                      <button className="btn-reject" onClick={() => handle(r._id, "rejected")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [requests,  setRequests]  = useState(INIT_REQUESTS);
  const [toasts,    setToasts]    = useState([]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id:tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3500);
  };

  const NAV = [
    { id:"overview",  label:"Overview"  },
    { id:"listings",  label:"Listings"  },
    { id:"requests",  label:"Requests",  badge: pendingCount },
    { id:"earnings",  label:"Earnings"  },
    { id:"billing",   label:"Billing"   },
    { id:"settings",  label:"Settings"  },
  ];

  return (
    <div className="dash-root">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sb-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="sb-brand-name">Nivaas</span>
        </div>
        <div className="sidebar-nav">
          <div className="nav-group-label">Main</div>
          {NAV.map((item) => (
            <button key={item.id} className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => item.id === "billing" ? navigate("/billing") : setActiveNav(item.id)}>
              {item.label}
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="user-pill" onClick={() => navigate("/")}>
            <div className="user-avatar">RS</div>
            <div>
              <div className="user-name">Rajesh Sharma</div>
              <div className="user-role">← Back to home</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="dash-main">
        <div className="topbar">
          <span className="topbar-title">{NAV.find((n) => n.id === activeNav)?.label}</span>
          <div className="topbar-actions">
            <button className="btn-primary-dash" onClick={() => navigate("/register-property")}>
              + New listing
            </button>
          </div>
        </div>

        <div className="dash-content">
          {["overview","listings","requests"].includes(activeNav) && (
            <StatsBar listings={MOCK_LISTINGS} requests={requests} />
          )}
          {["overview","listings"].includes(activeNav) && (
            <ListingsSection listings={MOCK_LISTINGS} />
          )}
          {["overview","requests"].includes(activeNav) && (
            <RequestsSection requests={requests} setRequests={setRequests} addToast={addToast} />
          )}
          {activeNav === "earnings" && (
            <div className="d-section">
              <div className="section-header"><span className="section-title">Earnings</span></div>
              <div style={{ padding:"2rem", color:"var(--d-text3)", fontSize:"0.875rem" }}>Earnings chart coming soon.</div>
            </div>
          )}
          {activeNav === "settings" && (
            <div className="d-section">
              <div className="section-header"><span className="section-title">Account Settings</span></div>
              <div style={{ padding:"1.5rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", maxWidth:640 }}>
                {[["Full name","Rajesh Sharma"],["Email","rajesh@example.com"],["Phone","+91 98765 43210"],["City","Jaipur, Rajasthan"]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:"0.7rem", color:"var(--d-text3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{label}</div>
                    <input defaultValue={val} style={{ width:"100%", padding:"0.6rem 0.9rem", background:"var(--d-bg3)", border:"1px solid var(--d-border)", borderRadius:8, color:"var(--d-text)", fontFamily:"DM Sans,sans-serif", fontSize:"0.875rem", outline:"none" }} />
                  </div>
                ))}
                <div style={{ gridColumn:"1/-1", paddingTop:"0.5rem" }}>
                  <button style={{ padding:"0.6rem 1.25rem", borderRadius:8, background:"var(--gold)", border:"none", color:"#1a1500", fontFamily:"DM Sans,sans-serif", fontWeight:500, cursor:"pointer" }}>
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Toasts ───────────────────────────────────────────── */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            }
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

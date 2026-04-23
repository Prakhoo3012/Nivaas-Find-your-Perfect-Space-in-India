import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TENANT_BOOKINGS, TENANT_PROFILE, TENANT_WISHLIST } from "../constants/tenant";
import { fmt, fmtDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

// ─── Toggle switch ─────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button className={`up-toggle ${on ? "on" : "off"}`} onClick={onToggle} type="button">
      <div className="up-toggle-knob" />
    </button>
  );
}

// ─── Toast ─────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="up-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`up-toast ${t.type}`}>
          {t.type === "success"
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          }
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── PERSONAL INFO SECTION ────────────────────────────────────
function PersonalInfo({ user, addToast, updateUser }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({
    fullName: user.fullName,
    username: user.username,
    email:    user.email,
    phone:    user.phone,
    city:     user.city,
    state:    user.state,
    about:    user.about,
  });


  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/users/update-profile", form);
      if (updateUser) updateUser(form);
      setEditing(false);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ fullName:user.fullName, username:user.username, email:user.email, phone:user.phone, city:user.city, state:user.state, about:user.about });
    setEditing(false);
  };

  return (
    <div className="up-section">
      <div className="up-section-head">
        <span className="up-section-title">Personal information</span>
        {!editing && (
          <button className="up-section-edit" onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
      <div className="up-section-body">
        <div className="up-form-grid">
          <div className="up-form-group">
            <label className="up-label">Full name</label>
            <input className="up-input" value={form.fullName} onChange={set("fullName")} disabled={!editing} />
          </div>
          <div className="up-form-group">
            <label className="up-label">Username</label>
            <input className="up-input" value={form.username} onChange={set("username")} disabled={!editing}
              style={{ fontFamily:"monospace", letterSpacing:"0.03em" }} />
          </div>
          <div className="up-form-group">
            <label className="up-label">Email address</label>
            <div className="up-input-icon-wrap">
              <input className="up-input" value={form.email} onChange={set("email")} disabled={!editing} style={{ paddingRight:"2.5rem" }} />
              {user.verified && (
                <span className="up-input-icon" title="Verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--d-green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              )}
            </div>
          </div>
          <div className="up-form-group">
            <label className="up-label">Phone number</label>
            <input className="up-input" value={form.phone} onChange={set("phone")} disabled={!editing} />
          </div>
          <div className="up-form-group">
            <label className="up-label">City</label>
            <input className="up-input" value={form.city} onChange={set("city")} disabled={!editing} />
          </div>
          <div className="up-form-group">
            <label className="up-label">State</label>
            <input className="up-input" value={form.state} onChange={set("state")} disabled={!editing} />
          </div>
          <div className="up-form-group full">
            <label className="up-label">About</label>
            <textarea className="up-input up-textarea" value={form.about} onChange={set("about")} disabled={!editing} />
          </div>
        </div>

        {editing && (
          <div className="up-save-bar">
            <button className="up-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="up-btn-save" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Saving…</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save changes</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECURITY SECTION ─────────────────────────────────────────
function SecuritySection({ addToast }) {
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ current:"", newPw:"", confirm:"" });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]:e.target.value }));

  const handleSave = async () => {
    if (form.newPw !== form.confirm) { addToast("Passwords don't match", "error"); return; }
    if (form.newPw.length < 8)       { addToast("Password must be at least 8 characters", "error"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false); setChangingPw(false);
    setForm({ current:"", newPw:"", confirm:"" });
    addToast("Password updated!", "success");
  };

  return (
    <div className="up-section">
      <div className="up-section-head">
        <span className="up-section-title">Security</span>
      </div>
      <div className="up-section-body">
        {/* Password */}
        <div style={{ marginBottom:"1.25rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: changingPw ? "1rem" : 0 }}>
            <div>
              <div style={{ fontSize:"0.85rem", color:"var(--d-text)", marginBottom:2 }}>Password</div>
              <div style={{ fontSize:"0.72rem", color:"var(--d-text3)" }}>Last changed 3 months ago</div>
            </div>
            {!changingPw && (
              <button className="td-btn-sm" onClick={() => setChangingPw(true)}>Change</button>
            )}
          </div>
          {changingPw && (
            <div className="up-form-grid" style={{ marginTop:"0.75rem" }}>
              {[["current","Current password"],["newPw","New password"],["confirm","Confirm new password"]].map(([k, label]) => (
                <div key={k} className="up-form-group">
                  <label className="up-label">{label}</label>
                  <input className="up-input" type="password" value={form[k]} onChange={set(k)} placeholder="••••••••" />
                </div>
              ))}
              <div className="up-form-group" style={{ gridColumn:"1/-1" }}>
                <div className="up-save-bar" style={{ paddingTop:0, marginTop:0, border:"none" }}>
                  <button className="up-btn-cancel" onClick={() => setChangingPw(false)}>Cancel</button>
                  <button className="up-btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Update password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ height:1, background:"var(--d-border)", marginBottom:"1.25rem" }} />

        {/* 2FA */}
        {[
          { title:"Two-factor authentication", desc:"Add an extra layer of security to your account", key:"2fa" },
          { title:"Login notifications",       desc:"Get notified when someone logs into your account",key:"loginNotif" },
        ].map((item) => (
          <div key={item.key} className="up-pref-item">
            <div className="up-pref-left">
              <div className="up-pref-title">{item.title}</div>
              <div className="up-pref-desc">{item.desc}</div>
            </div>
            <Toggle on={item.key === "loginNotif"} onToggle={() => addToast("Settings saved", "success")} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PREFERENCES SECTION ──────────────────────────────────────
function PreferencesSection({ addToast }) {
  const [prefs, setPrefs] = useState({
    emailBooking:   true,
    emailPromo:     false,
    smsAlerts:      true,
    pushNotif:      true,
    newsletter:     false,
    darkMode:       true,
  });
  const toggle = (k) => {
    setPrefs((p) => ({ ...p, [k]:!p[k] }));
    addToast("Preference saved", "success");
  };

  const items = [
    { key:"emailBooking", label:"Booking updates via email",      desc:"Confirmations, reminders, receipts" },
    { key:"emailPromo",   label:"Promotional emails",             desc:"Deals, featured stays, news" },
    { key:"smsAlerts",    label:"SMS alerts",                     desc:"Important booking alerts by SMS" },
    { key:"pushNotif",    label:"Push notifications",             desc:"Real-time alerts in browser" },
    { key:"newsletter",   label:"Weekly newsletter",              desc:"Top picks and curated stays" },
  ];

  return (
    <div className="up-section">
      <div className="up-section-head">
        <span className="up-section-title">Notifications & preferences</span>
      </div>
      <div className="up-section-body">
        {items.map((item) => (
          <div key={item.key} className="up-pref-item">
            <div className="up-pref-left">
              <div className="up-pref-title">{item.label}</div>
              <div className="up-pref-desc">{item.desc}</div>
            </div>
            <Toggle on={prefs[item.key]} onToggle={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VERIFICATION SECTION ─────────────────────────────────────
function VerificationSection({ addToast }) {
  const docs = [
    { label:"Email address",  status:"verified",   icon:"✉️" },
    { label:"Phone number",   status:"verified",   icon:"📱" },
    { label:"Aadhaar card",   status:"pending",    icon:"🪪" },
    { label:"PAN card",       status:"unverified", icon:"📄" },
  ];
  const colors = { verified:"var(--d-green)", pending:"#C4912A", unverified:"var(--d-text3)" };

  return (
    <div className="up-section">
      <div className="up-section-head">
        <span className="up-section-title">Identity verification</span>
      </div>
      <div className="up-section-body">
        <p style={{ fontSize:"0.82rem", color:"var(--d-text2)", marginBottom:"1.25rem", lineHeight:1.6 }}>
          Verified profiles get priority access to premium listings and build trust with property owners.
        </p>
        {docs.map((doc) => (
          <div key={doc.label} className="up-pref-item">
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:"1.1rem" }}>{doc.icon}</span>
              <div>
                <div style={{ fontSize:"0.85rem", color:"var(--d-text)" }}>{doc.label}</div>
                <div style={{ fontSize:"0.72rem", color:colors[doc.status], textTransform:"capitalize", marginTop:2 }}>
                  {doc.status === "verified" && "✓ "}{doc.status}
                </div>
              </div>
            </div>
            {doc.status !== "verified" && (
              <button className={`td-btn-sm ${doc.status === "pending" ? "" : "primary"}`}
                onClick={() => addToast(doc.status === "pending" ? "Document under review" : "Upload initiated", "success")}>
                {doc.status === "pending" ? "Under review" : "Verify now"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR QUICK INFO ───────────────────────────────────────
function ProfileSidebar({ profile, bookings }) {
  const navigate   = useNavigate();
  const completed  = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.priceBreakdown.totalAmount, 0);

  return (
    <div>
      <div className="up-quick-card">
        <div className="up-quick-head">Activity summary</div>
        {[
          { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label:"Total bookings",    val: bookings.length },
          { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>, label:"Stays completed", val: completed },
          { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, label:"Total spent",      val: fmt(totalSpent) },
          { icon:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, label:"Wishlist items",  val: 3 },
        ].map((item) => (
          <div key={item.label} className="up-quick-item">
            {item.icon}
            {item.label}
            <strong>{item.val}</strong>
          </div>
        ))}
      </div>

      <div className="up-quick-card">
        <div className="up-quick-head">Account info</div>
        {[
          { label:"Member since", val: profile.createdAt.split("T")[0] },
          { label:"Account type", val: profile.role           },
          { label:"Status",       val: "Active"           },
        ].map((item) => (
          <div key={item.label} className="up-quick-item">
            <span>{item.label}</span>
            <strong>{item.val}</strong>
          </div>
        ))}
      </div>

      <div className="up-quick-card">
        <div className="up-quick-head">Quick actions</div>
        {[
          { label:"Browse listings",   action: () => navigate("/")                },
          { label:"My bookings",       action: () => navigate("/smart-dashboard") },
          { label:"My wishlist",       action: () => navigate("/smart-dashboard") },
        ].map((item) => (
          <div key={item.label} className="up-quick-item" style={{ cursor:"pointer" }} onClick={item.action}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            {item.label}
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="up-danger">
        <div className="up-danger-title">Danger zone</div>
        <div className="up-danger-desc">Once you delete your account, there is no going back.</div>
        <button className="up-danger-btn">Delete account</button>
      </div>
    </div>
  );
}

// ─── MAIN PROFILE PAGE ────────────────────────────────────────
export default function UserProfilePage() {
  // ProtectedRoute ensures user is always non-null here
  const { user, updateUser } = useAuth();
  console.log("User: ", user);
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  return (
    <div className="up-root">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="up-navbar">
        <button className="up-back-btn" onClick={() => navigate("/smart-dashboard")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </button>
        <div className="up-nav-brand">
          <div className="up-brand-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="up-brand-name" onClick={() => navigate("/")}>Nivaas</span>
        </div>
        <div className="up-nav-actions">
          <button onClick={() => navigate("/")}
            style={{ padding:"0.4rem 0.9rem", borderRadius:8, background:"rgba(192,90,40,0.1)", border:"1px solid rgba(192,90,40,0.2)", color:"var(--terracotta)", fontFamily:"DM Sans,sans-serif", fontSize:"0.78rem", cursor:"pointer" }}>
            Browse listings
          </button>
        </div>
      </nav>

      <div className="up-body">
        {/* ── Hero card ────────────────────────────────────── */}
        <div className="up-hero">
          <div className="up-avatar-wrap">
            <div className="up-avatar">{user?.initials ||
                      user.fullName?.slice(0, 2).toUpperCase()}</div>
            <button className="up-avatar-edit" title="Change photo">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
          <div className="up-hero-info">
            <div className="up-name">{user.fullName}</div>
            <div className="up-handle">@{user.username}</div>
            <div className="up-badges">
              {user.isVerified && (
                <span className="up-badge verified">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Verified tenant
                </span>
              )}
              <span className="up-badge tenant">Tenant</span>
              <span className="up-badge joined">Member since {user.createdAt.split("T")[0]}</span>
            </div>
            <div className="up-hero-stats">
              {[
                { val: TENANT_PROFILE.stats.totalBookings, label:"Bookings"  },
                { val: TENANT_PROFILE.stats.completed,     label:"Completed" },
                { val: TENANT_PROFILE.stats.reviewsGiven,  label:"Reviews"   },
                { val: TENANT_PROFILE.stats.wishlistCount,  label:"Saved"    },
              ].map((s) => (
                <div key={s.label} className="up-hero-stat">
                  <div className="up-hero-stat-val">{s.val}</div>
                  <div className="up-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="up-edit-btn" onClick={() => {}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit profile
          </button>
        </div>

        {/* ── Grid ─────────────────────────────────────────── */}
        <div className="up-grid">
          {/* Left column */}
          <div>
            <PersonalInfo      user={user} addToast={addToast} updateUser={updateUser} />
            <SecuritySection   addToast={addToast} />
            <VerificationSection addToast={addToast} />
            <PreferencesSection  addToast={addToast} />
          </div>

          {/* Right sidebar */}
          <div>
            <ProfileSidebar profile={user} bookings={TENANT_BOOKINGS} />
          </div>
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}

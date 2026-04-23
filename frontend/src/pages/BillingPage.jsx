import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fmt, fmtDate } from "../utils/helpers";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_INVOICES = [
  { id:"INV-001", tenant:"Priya Sharma",   property:"Sunlit Studio in Malviya Nagar", amount:12000, dueDate:"2025-08-01", status:"paid",    period:"Aug 2025" },
  { id:"INV-002", tenant:"Ananya K.",      property:"Sunlit Studio in Malviya Nagar", amount:12000, dueDate:"2025-07-01", status:"paid",    period:"Jul 2025" },
  { id:"INV-003", tenant:"Rahul Mehta",    property:"Heritage Haveli Suite",           amount:13500, dueDate:"2025-07-20", status:"overdue", period:"Jul 2025" },
  { id:"INV-004", tenant:"Karan Singh",    property:"Heritage Haveli Suite",           amount:9000,  dueDate:"2025-06-15", status:"paid",    period:"Jun 2025" },
  { id:"INV-005", tenant:"Sneha Patel",    property:"Premium PG — Koregaon Park",      amount:11000, dueDate:"2025-09-01", status:"pending", period:"Sep 2025" },
];

const MONTHLY_DATA = [
  { month:"Jan", amount:18000 }, { month:"Feb", amount:21000 },
  { month:"Mar", amount:34500 }, { month:"Apr", amount:28000 },
  { month:"May", amount:42000 }, { month:"Jun", amount:37500 },
  { month:"Jul", amount:55000 }, { month:"Aug", amount:48000 },
];

const PAYMENT_METHODS = [
  { id:"pm1", name:"PhonePe UPI",   meta:"rajesh@okicici",       icon:"📱", primary:true  },
  { id:"pm2", name:"HDFC Bank",     meta:"A/C •••• 4521",        icon:"🏦", primary:false },
  { id:"pm3", name:"ICICI Visa",    meta:"•••• •••• •••• 9832",  icon:"💳", primary:false },
];

const MOCK_LISTINGS_NAMES = [
  "Sunlit Studio in Malviya Nagar",
  "Heritage Haveli Suite",
  "Premium PG — Koregaon Park",
];

// ─── StatusPill (local, same as dashboard) ────────────────────────────────────
function StatusPill({ status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}

// ─── Receipt Modal ────────────────────────────────────────────────────────────
function ReceiptModal({ invoice, onClose }) {
  const gst = Math.round(invoice.amount * 0.09);
  const total = invoice.amount + gst * 2;

  return (
    <div className="billing-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="billing-modal-box">
        {/* Header */}
        <div className="receipt-header">
          <div>
            <div className="receipt-brand">Nivaas</div>
            <div style={{ fontSize:"0.72rem", color:"var(--d-text3)", marginTop:2 }}>Tax Invoice</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.1rem", color:"var(--gold)" }}>{invoice.id}</div>
            <div style={{ fontSize:"0.7rem", color:"var(--d-text3)" }}>{invoice.dueDate || "—"}</div>
          </div>
        </div>

        {/* Parties */}
        <div className="receipt-parties">
          <div>
            <div className="receipt-party-label">From</div>
            <div className="receipt-party-name">Rajesh Sharma</div>
            <div className="receipt-party-sub">rajesh@example.com</div>
            <div className="receipt-party-sub">GSTIN: 08AABCT1332L1ZV</div>
          </div>
          <div>
            <div className="receipt-party-label">Bill To</div>
            <div className="receipt-party-name">{invoice.tenant}</div>
            <div className="receipt-party-sub">{invoice.property}</div>
          </div>
        </div>

        {/* Line items */}
        <div className="receipt-lines">
          {[
            { label:`Rent — ${invoice.period}`, val:fmt(invoice.amount) },
            { label:"CGST (9%)",                val:fmt(gst)             },
            { label:"SGST (9%)",                val:fmt(gst)             },
          ].map((r) => (
            <div key={r.label} className="receipt-line">
              <span>{r.label}</span><span>{r.val}</span>
            </div>
          ))}
          <div className="receipt-total-row">
            <span>Total Due</span>
            <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.25rem", color:"var(--gold)" }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginTop:"1rem" }}>
          <StatusPill status={invoice.status} />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.5rem" }}>
          <button className="billing-btn-secondary" style={{ flex:1 }} onClick={() => window.print()}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Download
          </button>
          <button className="billing-btn-secondary" onClick={onClose}>Close</button>
        </div>

        <div style={{ textAlign:"center", fontSize:"0.7rem", color:"var(--d-text3)", marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid var(--d-border)" }}>
          Nivaas · Zero brokerage rental platform · support@nivaas.in
        </div>
      </div>
    </div>
  );
}

// ─── New Invoice Modal ────────────────────────────────────────────────────────
function NewInvoiceModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ tenant:"", property:"", amount:"", period:"", dueDate:"" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]:v }));
  const valid = form.tenant && form.property && form.amount;

  return (
    <div className="billing-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="billing-modal-box">
        <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.5rem", color:"var(--d-text)", marginBottom:4 }}>Create Invoice</h2>
        <p style={{ fontSize:"0.78rem", color:"var(--d-text3)", marginBottom:"1.5rem" }}>Generate a new invoice for a tenant</p>

        <div className="billing-form-row">
          <div className="billing-form-group">
            <label className="billing-label">Tenant name *</label>
            <input className="billing-input" placeholder="e.g. Priya Sharma" value={form.tenant} onChange={(e) => set("tenant", e.target.value)} />
          </div>
          <div className="billing-form-group">
            <label className="billing-label">Amount (₹) *</label>
            <input className="billing-input" type="number" placeholder="12000" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
        </div>

        <div className="billing-form-group" style={{ marginBottom:"1rem" }}>
          <label className="billing-label">Property *</label>
          <select className="billing-input" value={form.property} onChange={(e) => set("property", e.target.value)}>
            <option value="">Select property</option>
            {MOCK_LISTINGS_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="billing-form-row">
          <div className="billing-form-group">
            <label className="billing-label">Period</label>
            <input className="billing-input" placeholder="e.g. Sep 2025" value={form.period} onChange={(e) => set("period", e.target.value)} />
          </div>
          <div className="billing-form-group">
            <label className="billing-label">Due date</label>
            <input className="billing-input" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem", marginTop:"1.5rem" }}>
          <button className="billing-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary-dash"
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.45, cursor: valid ? "pointer" : "not-allowed" }}
            onClick={() => valid && onSubmit({ ...form, amount: +form.amount })}
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main BillingPage ─────────────────────────────────────────────────────────
export default function BillingPage() {
  const navigate = useNavigate();
  const [invoices,      setInvoices]      = useState(MOCK_INVOICES);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("all");
  const [showNew,       setShowNew]       = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [toasts,        setToasts]        = useState([]);
  const [activeNav,     setActiveNav]     = useState("billing");

  // ── Helpers ────────────────────────────────────────────────────
  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const handleCreate = (data) => {
    const id = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
    setInvoices((prev) => [{ id, ...data, status:"pending" }, ...prev]);
    setShowNew(false);
    addToast("Invoice created successfully!");
  };

  const markPaid = (invId, e) => {
    e.stopPropagation();
    setInvoices((prev) => prev.map((i) => i.id === invId ? { ...i, status:"paid" } : i));
    addToast("Invoice marked as paid!");
  };

  const sendReminder = (inv, e) => {
    e.stopPropagation();
    addToast(`Reminder sent to ${inv.tenant}!`);
  };

  // ── Derived values ──────────────────────────────────────────────
  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch = !q || inv.tenant.toLowerCase().includes(q) || inv.property.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const maxBar       = Math.max(...MONTHLY_DATA.map((m) => m.amount));

  const NAV = [
    { id:"overview",  label:"Overview"  },
    { id:"listings",  label:"Listings"  },
    { id:"requests",  label:"Requests"  },
    { id:"earnings",  label:"Earnings"  },
    { id:"billing",   label:"Billing"   },
    { id:"settings",  label:"Settings"  },
  ];

  return (
    <div className="dash-root">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
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
            <button
              key={item.id}
              className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => {
                if (item.id === "billing") { setActiveNav("billing"); return; }
                navigate("/smart-dashboard");
              }}
            >
              {item.label}
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

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="dash-main">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">Billing</span>
          <div className="topbar-actions">
            <button className="btn-primary-dash" onClick={() => setShowNew(true)}>
              + New invoice
            </button>
          </div>
        </div>

        <div className="dash-content">

          {/* ── Summary cards ──────────────────────────────────────── */}
          <div className="billing-summary-grid">
            {[
              { label:"Total collected", value:fmt(totalPaid),    sub:`${invoices.filter((i) => i.status === "paid").length} paid invoices`,     color:"var(--d-green)",  icon:"✓" },
              { label:"Pending",         value:fmt(totalPending), sub:`${invoices.filter((i) => i.status === "pending").length} awaiting payment`, color:"#C8A040",         icon:"⏳" },
              { label:"Overdue",         value:fmt(totalOverdue), sub:`${invoices.filter((i) => i.status === "overdue").length} overdue invoices`,  color:"#C06060",         icon:"!" },
              { label:"Total invoices",  value:invoices.length,   sub:"All time",                                                                  color:"var(--d-text2)",  icon:"📄" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay:`${i * 0.06}s` }}>
                <div className="stat-label">{s.icon}&nbsp; {s.label}</div>
                <div className="stat-value" style={{ color:s.color, fontSize:"1.8rem" }}>{s.value}</div>
                <div className="stat-change neutral">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Chart + Payment methods ─────────────────────────────── */}
          <div className="billing-two-col">
            {/* Revenue bar chart */}
            <div className="d-section" style={{ marginBottom:0 }}>
              <div className="section-header">
                <span className="section-title">Monthly Revenue</span>
                <span className="section-count">Last 8 months</span>
              </div>
              <div style={{ padding:"1.5rem", display:"flex", alignItems:"flex-end", gap:8, height:180 }}>
                {MONTHLY_DATA.map((m) => (
                  <div key={m.month} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div style={{ fontSize:"0.62rem", color:"var(--d-text3)" }}>{(m.amount / 1000).toFixed(0)}k</div>
                    <div
                      style={{
                        width:"100%",
                        height:`${(m.amount / maxBar) * 100}px`,
                        background:"linear-gradient(to top, rgba(200,169,110,0.9), rgba(200,169,110,0.4))",
                        border:"1px solid rgba(200,169,110,0.2)",
                        borderRadius:"4px 4px 0 0",
                        transition:"height 0.5s ease",
                        cursor:"pointer",
                      }}
                      title={`${m.month}: ${fmt(m.amount)}`}
                    />
                    <div style={{ fontSize:"0.65rem", color:"var(--d-text3)" }}>{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="d-section" style={{ marginBottom:0 }}>
              <div className="section-header">
                <span className="section-title">Payment Methods</span>
                <button className="billing-link-btn">+ Add</button>
              </div>
              <div style={{ padding:"1rem" }}>
                {PAYMENT_METHODS.map((pm) => (
                  <div key={pm.id} className={`billing-pm-item${pm.primary ? " primary" : ""}`}>
                    <span style={{ fontSize:"1.4rem" }}>{pm.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.82rem", fontWeight:500, color:"var(--d-text)" }}>{pm.name}</div>
                      <div style={{ fontSize:"0.72rem", color:"var(--d-text3)" }}>{pm.meta}</div>
                    </div>
                    {pm.primary && <span className="billing-pm-badge">Default</span>}
                  </div>
                ))}
                <div
                  className="billing-add-pm"
                  onClick={() => addToast("Payment method flow — connect your bank API!")}
                >
                  + Add bank account or card
                </div>
              </div>
            </div>
          </div>

          {/* ── Controls row ────────────────────────────────────────── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1rem", gap:"1rem" }}>
            {/* Search */}
            <div className="billing-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--d-text3)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Search invoices…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Status filter tabs */}
            <div className="filter-tabs" style={{ background:"var(--d-bg2)", border:"1px solid var(--d-border)", borderRadius:8, padding:2 }}>
              {["all","paid","pending","overdue"].map((s) => (
                <button
                  key={s}
                  className={`filter-tab${filterStatus === s ? " active" : ""}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Invoices table ───────────────────────────────────────── */}
          <div className="d-section">
            <table className="billing-table">
              <thead>
                <tr>
                  {["Invoice","Tenant","Property","Period","Due date","Amount","Status","Actions"].map((h) => (
                    <th key={h} className="billing-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign:"center", padding:"2.5rem", color:"var(--d-text3)", fontSize:"0.85rem" }}>
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr
                      key={inv.id}
                      className="billing-tr"
                      onClick={() => setActiveReceipt(inv)}
                    >
                      <td className="billing-td">
                        <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"0.95rem", color:"var(--gold)" }}>{inv.id}</span>
                      </td>
                      <td className="billing-td" style={{ fontWeight:500, color:"var(--d-text)" }}>{inv.tenant}</td>
                      <td className="billing-td" style={{ maxWidth:170, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inv.property}</td>
                      <td className="billing-td">{inv.period}</td>
                      <td className="billing-td">{inv.dueDate || "—"}</td>
                      <td className="billing-td">
                        <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1rem", color:"var(--d-text)" }}>{fmt(inv.amount)}</span>
                      </td>
                      <td className="billing-td"><StatusPill status={inv.status} /></td>
                      <td className="billing-td" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display:"flex", gap:5 }}>
                          {inv.status !== "paid" && (
                            <button className="btn-sm" style={{ color:"var(--gold)", borderColor:"rgba(200,169,110,0.25)", background:"rgba(200,169,110,0.08)" }} onClick={(e) => { e.stopPropagation(); navigate("/payment", { state: { invoice: inv } }); }}>
                              Pay now
                            </button>
                          )}
                          {inv.status !== "paid" && (
                            <button className="btn-sm" style={{ color:"var(--gold)", borderColor:"rgba(200,169,110,0.25)", background:"rgba(200,169,110,0.08)" }} onClick={(e) => markPaid(inv.id, e)}>
                              Mark paid
                            </button>
                          )}
                          {inv.status !== "paid" && (
                            <button className="btn-sm" onClick={(e) => sendReminder(inv, e)}>Remind</button>
                          )}
                          <button className="btn-sm" onClick={(e) => { e.stopPropagation(); setActiveReceipt(inv); }}>Receipt</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      {showNew       && <NewInvoiceModal onClose={() => setShowNew(false)} onSubmit={handleCreate} />}
      {activeReceipt && <ReceiptModal invoice={activeReceipt} onClose={() => setActiveReceipt(null)} />}

      {/* ── Toasts ───────────────────────────────────────────────── */}
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

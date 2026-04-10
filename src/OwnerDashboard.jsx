import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0E0F0D;
    --bg2:      #161815;
    --bg3:      #1D1F1B;
    --bg4:      #252720;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.12);
    --text:     #E8E4DC;
    --text2:    #9A9890;
    --text3:    #5E5D58;
    --gold:     #C8A96E;
    --gold2:    #E8C98A;
    --green:    #4E7C5F;
    --green-bg: rgba(78,124,95,0.12);
    --red:      #8B4040;
    --red-bg:   rgba(139,64,64,0.12);
    --amber:    #8B6B2E;
    --amber-bg: rgba(139,107,46,0.12);
    --blue:     #3A5F8B;
    --blue-bg:  rgba(58,95,139,0.12);
    --radius:   10px;
    --sidebar-w: 240px;
  }

  .dash-root {
    display: flex; min-height: 100vh;
    background: var(--bg); color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0;
    position: sticky; top: 0; height: 100vh;
  }

  .sidebar-brand {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }

  .brand-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--gold); display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
  }

  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: var(--text);
    letter-spacing: 0.02em;
  }

  .sidebar-owner {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .owner-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg4); border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--gold); margin-bottom: 0.6rem;
  }

  .owner-name {
    font-size: 0.875rem; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .owner-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.68rem; color: var(--gold);
    background: rgba(200,169,110,0.1);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 20px; padding: 2px 8px; margin-top: 4px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 2px; }

  .nav-label {
    font-size: 0.65rem; color: var(--text3); text-transform: uppercase;
    letter-spacing: 0.1em; padding: 0 0.75rem; margin: 1rem 0 0.4rem;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 0.6rem 0.75rem; border-radius: 8px; cursor: pointer;
    color: var(--text2); font-size: 0.875rem; font-weight: 400;
    transition: all 0.15s; border: none; background: none;
    width: 100%; text-align: left;
  }

  .nav-item:hover { background: var(--bg3); color: var(--text); }

  .nav-item.active { background: rgba(200,169,110,0.1); color: var(--gold); }

  .nav-item svg { flex-shrink: 0; opacity: 0.7; }
  .nav-item.active svg { opacity: 1; }

  .nav-badge {
    margin-left: auto; background: var(--red);
    color: #fff; font-size: 0.65rem; font-weight: 500;
    border-radius: 20px; padding: 1px 6px; min-width: 18px; text-align: center;
  }

  .nav-badge.gold { background: var(--amber); }

  .sidebar-bottom {
    padding: 1rem 0.75rem;
    border-top: 1px solid var(--border);
  }

  /* ── Main ── */
  .dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  .dash-topbar {
    background: var(--bg2); border-bottom: 1px solid var(--border);
    padding: 0 2rem; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }

  .topbar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 400; color: var(--text);
    letter-spacing: -0.01em;
  }

  .topbar-actions { display: flex; align-items: center; gap: 0.75rem; }

  .btn-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--bg3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text2); transition: all 0.15s;
  }
  .btn-icon:hover { background: var(--bg4); color: var(--text); }

  .btn-primary {
    display: flex; align-items: center; gap: 7px;
    padding: 0.5rem 1rem; border-radius: 8px;
    background: var(--gold); color: #1a1500;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; font-weight: 500; transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-1px); }

  .dash-content { padding: 2rem; flex: 1; overflow-y: auto; }

  /* ── Stats ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem; margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem 1.5rem;
    animation: fadeUp 0.4s ease both;
  }

  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.10s; }
  .stat-card:nth-child(3) { animation-delay: 0.15s; }
  .stat-card:nth-child(4) { animation-delay: 0.20s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stat-label { font-size: 0.72rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.6rem; }

  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 400; color: var(--text); line-height: 1;
    margin-bottom: 0.4rem;
  }

  .stat-change { font-size: 0.72rem; display: flex; align-items: center; gap: 4px; }
  .stat-change.up { color: var(--green); }
  .stat-change.neutral { color: var(--text3); }

  .stat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.75rem;
  }

  /* ── Section ── */
  .section { margin-bottom: 2rem; animation: fadeUp 0.5s ease 0.1s both; }

  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 400; color: var(--text);
    letter-spacing: -0.01em;
  }

  .section-count {
    font-size: 0.75rem; color: var(--text3);
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 10px; margin-left: 8px;
  }

  .view-all {
    font-size: 0.78rem; color: var(--gold);
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }
  .view-all:hover { opacity: 0.7; }

  /* ── Listings Grid ── */
  .listings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

  .listing-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    cursor: pointer; transition: all 0.2s;
  }
  .listing-card:hover { border-color: var(--border2); transform: translateY(-2px); }

  .listing-img {
    height: 140px; background: var(--bg3);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }

  .listing-img-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    color: var(--text3);
  }

  .listing-status-pill {
    position: absolute; top: 10px; left: 10px;
    font-size: 0.65rem; font-weight: 500;
    border-radius: 20px; padding: 3px 9px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .pill-active   { background: var(--green-bg); color: #6DBF8A; border: 1px solid rgba(109,191,138,0.25); }
  .pill-rented   { background: var(--blue-bg);  color: #7AAAD4; border: 1px solid rgba(122,170,212,0.25); }
  .pill-inactive { background: var(--bg4);      color: var(--text3); border: 1px solid var(--border); }

  .listing-body { padding: 1rem; }

  .listing-type {
    font-size: 0.65rem; color: var(--gold); text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 0.3rem;
  }

  .listing-title {
    font-size: 0.9rem; font-weight: 500; color: var(--text);
    margin-bottom: 0.3rem; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }

  .listing-location {
    font-size: 0.75rem; color: var(--text2);
    display: flex; align-items: center; gap: 4px; margin-bottom: 0.75rem;
  }

  .listing-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 0.75rem; border-top: 1px solid var(--border);
  }

  .listing-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: var(--text);
  }

  .listing-price span { font-size: 0.7rem; color: var(--text3); font-family: 'DM Sans', sans-serif; font-weight: 400; }

  .listing-actions { display: flex; gap: 6px; }

  .btn-sm {
    padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.72rem;
    cursor: pointer; border: 1px solid var(--border);
    background: var(--bg3); color: var(--text2); font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .btn-sm:hover { background: var(--bg4); color: var(--text); }

  .listing-rating {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.75rem; color: var(--text2);
  }

  /* ── Requests ── */
  .requests-list { display: flex; flex-direction: column; gap: 0.75rem; }

  .request-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem 1.5rem;
    display: flex; align-items: center; gap: 1.25rem;
    transition: border-color 0.15s; animation: fadeUp 0.4s ease both;
  }

  .request-card:hover { border-color: var(--border2); }

  .req-avatar {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    background: var(--bg4); border: 1.5px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 1rem;
    color: var(--gold); font-weight: 400;
  }

  .req-info { flex: 1; min-width: 0; }

  .req-tenant {
    font-size: 0.875rem; font-weight: 500; color: var(--text);
    margin-bottom: 0.15rem;
  }

  .req-property {
    font-size: 0.78rem; color: var(--text2);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }

  .req-meta { display: flex; align-items: center; gap: 12px; }

  .req-meta-item {
    font-size: 0.7rem; color: var(--text3);
    display: flex; align-items: center; gap: 4px;
  }

  .req-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--text); font-weight: 400;
    white-space: nowrap; text-align: right;
  }

  .req-amount-label { font-size: 0.68rem; color: var(--text3); font-family: 'DM Sans', sans-serif; }

  .req-status-col { text-align: right; min-width: 80px; }

  .status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.68rem; font-weight: 500;
    border-radius: 20px; padding: 3px 10px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }

  .sp-pending   { background: var(--amber-bg); color: #D4A843; border: 1px solid rgba(212,168,67,0.2); }
  .sp-confirmed { background: var(--green-bg); color: #6DBF8A; border: 1px solid rgba(109,191,138,0.25); }
  .sp-rejected  { background: var(--red-bg);   color: #D47A7A; border: 1px solid rgba(212,122,122,0.25); }
  .sp-completed { background: var(--blue-bg);  color: #7AAAD4; border: 1px solid rgba(122,170,212,0.25); }

  .req-actions { display: flex; gap: 8px; flex-shrink: 0; }

  .btn-accept {
    padding: 0.4rem 0.9rem; border-radius: 7px;
    background: var(--green-bg); color: #6DBF8A;
    border: 1px solid rgba(109,191,138,0.25);
    font-size: 0.78rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
    display: flex; align-items: center; gap: 5px;
  }
  .btn-accept:hover { background: rgba(78,124,95,0.25); }

  .btn-reject {
    padding: 0.4rem 0.9rem; border-radius: 7px;
    background: var(--red-bg); color: #D47A7A;
    border: 1px solid rgba(212,122,122,0.25);
    font-size: 0.78rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
    display: flex; align-items: center; gap: 5px;
  }
  .btn-reject:hover { background: rgba(139,64,64,0.25); }

  .req-divider { width: 1px; background: var(--border); flex-shrink: 0; align-self: stretch; }

  /* ── Filter tabs ── */
  .filter-tabs { display: flex; gap: 4px; }

  .filter-tab {
    padding: 0.35rem 0.85rem; border-radius: 7px;
    background: none; border: 1px solid transparent;
    font-size: 0.78rem; color: var(--text2); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .filter-tab:hover { background: var(--bg3); color: var(--text); }
  .filter-tab.active {
    background: var(--bg3); border-color: var(--border2);
    color: var(--text);
  }

  /* ── Toast ── */
  .toast-wrap {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 100;
    display: flex; flex-direction: column; gap: 8px; pointer-events: none;
  }

  .toast {
    padding: 0.75rem 1.25rem; border-radius: 10px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
    animation: slideIn 0.3s ease both;
    pointer-events: all; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }

  .toast.success { background: var(--green-bg); color: #6DBF8A; border: 1px solid rgba(109,191,138,0.3); }
  .toast.error   { background: var(--red-bg);   color: #D47A7A; border: 1px solid rgba(212,122,122,0.3); }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Empty ── */
  .empty-state {
    text-align: center; padding: 3rem 1rem; color: var(--text3);
  }
  .empty-state p { font-size: 0.85rem; margin-top: 0.5rem; }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2,1fr); } .listings-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 768px)  { .sidebar { display: none; } .stats-grid { grid-template-columns: repeat(2,1fr); } .listings-grid { grid-template-columns: 1fr; } .request-card { flex-wrap: wrap; } }
`;

// ── Mock Data ──────────────────────────────────────────────────

const LISTINGS = [
  { _id: "1", title: "Cozy Studio in Malviya Nagar", propertyType: "flat", location: { city: "Jaipur", state: "Rajasthan" }, pricing: { basePrice: 12000, priceType: "per_month" }, status: "active",  ratings: { average: 4.7, count: 14 }, roomInfo: { availableRooms: 1, totalRooms: 1 } },
  { _id: "2", title: "Furnished PG Near IIT", propertyType: "pg", location: { city: "Delhi", state: "Delhi" }, pricing: { basePrice: 8500, priceType: "per_month" }, status: "rented",  ratings: { average: 4.2, count: 8  }, roomInfo: { availableRooms: 0, totalRooms: 4 } },
  { _id: "3", title: "Spacious 2BHK Flat", propertyType: "flat", location: { city: "Bangalore", state: "Karnataka" }, pricing: { basePrice: 22000, priceType: "per_month" }, status: "active",  ratings: { average: 4.9, count: 22 }, roomInfo: { availableRooms: 1, totalRooms: 1 } },
  { _id: "4", title: "Private Room in Villa", propertyType: "room", location: { city: "Goa", state: "Goa" }, pricing: { basePrice: 2500, priceType: "per_night" }, status: "inactive", ratings: { average: 0,   count: 0  }, roomInfo: { availableRooms: 1, totalRooms: 1 } },
  { _id: "5", title: "Hostel Bed — Lower Parel", propertyType: "hostel", location: { city: "Mumbai", state: "Maharashtra" }, pricing: { basePrice: 6000, priceType: "per_month" }, status: "active",  ratings: { average: 4.0, count: 5  }, roomInfo: { availableRooms: 3, totalRooms: 10 } },
  { _id: "6", title: "Hill-view Studio Apartment", propertyType: "flat", location: { city: "Shimla", state: "Himachal" }, pricing: { basePrice: 1800, priceType: "per_night" }, status: "active",  ratings: { average: 4.8, count: 31 }, roomInfo: { availableRooms: 1, totalRooms: 1 } },
];

const INIT_REQUESTS = [
  { _id: "r1", tenant: { fullName: "Priya Verma",   username: "priya_v"   }, property: { title: "Cozy Studio in Malviya Nagar" }, checkIn: "2025-05-01", checkOut: "2025-08-01", priceBreakdown: { totalAmount: 36000 }, bookingType: "per_month", status: "pending",   createdAt: "2025-04-08T10:22:00Z", guests: { adults: 1 } },
  { _id: "r2", tenant: { fullName: "Rohan Mehta",   username: "rohan_m"   }, property: { title: "Spacious 2BHK Flat"           }, checkIn: "2025-05-15", checkOut: "2025-11-15", priceBreakdown: { totalAmount: 132000}, bookingType: "per_month", status: "pending",   createdAt: "2025-04-07T08:10:00Z", guests: { adults: 2 } },
  { _id: "r3", tenant: { fullName: "Ananya Singh",  username: "ananya_s"  }, property: { title: "Hill-view Studio Apartment"   }, checkIn: "2025-04-18", checkOut: "2025-04-22", priceBreakdown: { totalAmount: 7200  }, bookingType: "per_night", status: "confirmed", createdAt: "2025-04-06T14:30:00Z", guests: { adults: 2 } },
  { _id: "r4", tenant: { fullName: "Karan Joshi",   username: "karan_j"   }, property: { title: "Hostel Bed — Lower Parel"     }, checkIn: "2025-05-01", checkOut: "2025-07-01", priceBreakdown: { totalAmount: 12000 }, bookingType: "per_month", status: "pending",   createdAt: "2025-04-05T09:45:00Z", guests: { adults: 1 } },
  { _id: "r5", tenant: { fullName: "Sneha Gupta",   username: "sneha_g"   }, property: { title: "Furnished PG Near IIT"        }, checkIn: "2025-03-01", checkOut: "2025-04-01", priceBreakdown: { totalAmount: 8500  }, bookingType: "per_month", status: "completed", createdAt: "2025-02-20T11:00:00Z", guests: { adults: 1 } },
  { _id: "r6", tenant: { fullName: "Aditya Kumar",  username: "aditya_k"  }, property: { title: "Private Room in Villa"        }, checkIn: "2025-04-10", checkOut: "2025-04-14", priceBreakdown: { totalAmount: 10000 }, bookingType: "per_night", status: "rejected",  createdAt: "2025-04-01T07:20:00Z", guests: { adults: 2 } },
];

// ── Helpers ────────────────────────────────────────────────────

function fmt(n) { return "₹" + n.toLocaleString("en-IN"); }

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) { return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2); }

function StatusPill({ status }) {
  const cls = { pending: "sp-pending", confirmed: "sp-confirmed", rejected: "sp-rejected", completed: "sp-completed" };
  return <span className={`status-pill ${cls[status] || ""}`}>{status}</span>;
}

function ListingStatusPill({ status }) {
  const cls = { active: "pill-active", rented: "pill-rented", inactive: "pill-inactive" };
  return <span className={`listing-status-pill ${cls[status]}`}>{status}</span>;
}

function StarIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="#C8A96E" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

// ── Components ─────────────────────────────────────────────────

function Sidebar({ active, setActive, pendingCount }) {
  const navItems = [
    { id: "overview",  label: "Overview",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id: "listings",  label: "My Listings", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: "requests",  label: "Requests",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, badge: pendingCount },
    { id: "earnings",  label: "Earnings",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { id: "settings",  label: "Settings",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1500" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span className="brand-name">Nivaas</span>
      </div>

      <div className="sidebar-owner">
        <div className="owner-avatar">RS</div>
        <div className="owner-name">Rajesh Sharma</div>
        <div className="owner-badge">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Owner
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Menu</span>
        {navItems.map(item => (
          <button key={item.id} className={`nav-item${active === item.id ? " active" : ""}`}
            onClick={() => setActive(item.id)}>
            {item.icon}
            {item.label}
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" style={{ color: "#D47A7A" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

function StatsBar({ listings, requests }) {
  const active    = listings.filter(l => l.status === "active").length;
  const rented    = listings.filter(l => l.status === "rented").length;
  const pending   = requests.filter(r => r.status === "pending").length;
  const revenue   = requests.filter(r => r.status === "confirmed" || r.status === "completed")
                            .reduce((s, r) => s + r.priceBreakdown.totalAmount, 0);

  const cards = [
    { label: "Active listings", value: active,         change: "+2 this month", up: true,  color: "#4E7C5F", bg: "rgba(78,124,95,0.1)" },
    { label: "Currently rented", value: rented,        change: `${rented}/${listings.length} occupied`, up: false, color: "#3A5F8B", bg: "rgba(58,95,139,0.1)" },
    { label: "Pending requests", value: pending,       change: "Needs action",  up: false, color: "#8B6B2E", bg: "rgba(139,107,46,0.1)" },
    { label: "Total earnings",   value: fmt(revenue),  change: "Confirmed + completed", up: true, color: "#C8A96E", bg: "rgba(200,169,110,0.1)" },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-icon" style={{ background: c.bg }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2">
              {i === 0 && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
              {i === 1 && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
              {i === 2 && <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.13 2 2 2 0 012.1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121.92 15z"/></>}
              {i === 3 && <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>}
            </svg>
          </div>
          <div className="stat-label">{c.label}</div>
          <div className="stat-value">{c.value}</div>
          <div className={`stat-change${c.up ? " up" : " neutral"}`}>
            {c.up && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>}
            {c.change}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsSection({ listings }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? listings : listings.filter(l => l.status === filter);

  return (
    <div className="section">
      <div className="section-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="section-title">My listings</span>
          <span className="section-count">{listings.length}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="filter-tabs">
            {["all","active","rented","inactive"].map(f => (
              <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn-primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add listing
          </button>
        </div>
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><p>No listings found.</p></div>
        : (
          <div className="listings-grid">
            {filtered.map(l => (
              <div className="listing-card" key={l._id}>
                <div className="listing-img">
                  <ListingStatusPill status={l.status} />
                  <div className="listing-img-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span style={{ fontSize: "0.7rem", opacity: 0.35 }}>No image</span>
                  </div>
                </div>
                <div className="listing-body">
                  <div className="listing-type">{l.propertyType.toUpperCase()}</div>
                  <div className="listing-title">{l.title}</div>
                  <div className="listing-location">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {l.location.city}, {l.location.state}
                  </div>
                  <div className="listing-footer">
                    <div>
                      <div className="listing-price">
                        {fmt(l.pricing.basePrice)} <span>/ {l.pricing.priceType.replace("per_","")}</span>
                      </div>
                      {l.ratings.count > 0
                        ? <div className="listing-rating"><StarIcon />{l.ratings.average} <span style={{ color: "var(--text3)" }}>({l.ratings.count})</span></div>
                        : <div style={{ fontSize:"0.7rem", color:"var(--text3)", marginTop:2 }}>No reviews yet</div>
                      }
                    </div>
                    <div className="listing-actions">
                      <button className="btn-sm">Edit</button>
                      <button className="btn-sm">View</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

function RequestsSection({ requests, setRequests, addToast }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? requests
    : requests.filter(r => r.status === filter);

  const handle = (id, action) => {
    setRequests(prev => prev.map(r => r._id === id ? { ...r, status: action } : r));
    // TODO: await axios.patch(`/api/bookings/${id}/status`, { status: action })
    addToast(action === "confirmed" ? "Booking accepted!" : "Booking rejected.", action === "confirmed" ? "success" : "error");
  };

  return (
    <div className="section">
      <div className="section-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="section-title">Booking requests</span>
          <span className="section-count">{requests.length}</span>
        </div>
        <div className="filter-tabs">
          {["all","pending","confirmed","rejected","completed"].map(f => (
            <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && requests.filter(r => r.status === "pending").length > 0 &&
                <span style={{ marginLeft: 4, background: "var(--amber)", color: "#fff", borderRadius: 20, fontSize: "0.6rem", padding: "1px 5px" }}>
                  {requests.filter(r => r.status === "pending").length}
                </span>
              }
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><p>No requests here.</p></div>
        : (
          <div className="requests-list">
            {filtered.map((r, i) => (
              <div className="request-card" key={r._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="req-avatar">{initials(r.tenant.fullName)}</div>

                <div className="req-info">
                  <div className="req-tenant">{r.tenant.fullName}</div>
                  <div className="req-property">{r.property.title}</div>
                  <div className="req-meta">
                    <span className="req-meta-item">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}
                    </span>
                    <span className="req-meta-item">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      {r.guests.adults} guest{r.guests.adults > 1 ? "s" : ""}
                    </span>
                    <span className="req-meta-item">{r.bookingType.replace("per_","/ ")}</span>
                  </div>
                </div>

                <div className="req-divider" />

                <div style={{ textAlign: "right" }}>
                  <div className="req-amount">{fmt(r.priceBreakdown.totalAmount)}</div>
                  <div className="req-amount-label">total amount</div>
                  <div style={{ marginTop: 6 }}><StatusPill status={r.status} /></div>
                </div>

                {r.status === "pending" && (
                  <>
                    <div className="req-divider" />
                    <div className="req-actions">
                      <button className="btn-accept" onClick={() => handle(r._id, "confirmed")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Accept
                      </button>
                      <button className="btn-reject" onClick={() => handle(r._id, "rejected")}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function OwnerDashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [requests,  setRequests]  = useState(INIT_REQUESTS);
  const [toasts,    setToasts]    = useState([]);

  const pendingCount = requests.filter(r => r.status === "pending").length;

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  const pageTitles = { overview: "Overview", listings: "My Listings", requests: "Booking Requests", earnings: "Earnings", settings: "Settings" };

  return (
    <>
      <style>{S}</style>
      <div className="dash-root">
        <Sidebar active={activeNav} setActive={setActiveNav} pendingCount={pendingCount} />

        <div className="dash-main">
          <div className="dash-topbar">
            <span className="topbar-title">{pageTitles[activeNav]}</span>
            <div className="topbar-actions">
              <button className="btn-icon" title="Notifications">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </button>
              <button className="btn-primary" onClick={() => setActiveNav("listings")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New listing
              </button>
            </div>
          </div>

          <div className="dash-content">
            {(activeNav === "overview" || activeNav === "listings" || activeNav === "requests") && (
              <StatsBar listings={LISTINGS} requests={requests} />
            )}

            {(activeNav === "overview" || activeNav === "listings") && (
              <ListingsSection listings={LISTINGS} />
            )}

            {(activeNav === "overview" || activeNav === "requests") && (
              <RequestsSection requests={requests} setRequests={setRequests} addToast={addToast} />
            )}

            {activeNav === "earnings" && (
              <div className="empty-state" style={{ paddingTop: "5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                <p>Earnings breakdown coming soon.</p>
              </div>
            )}

            {activeNav === "settings" && (
              <div className="empty-state" style={{ paddingTop: "5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                <p>Settings page coming soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Toasts */}
        <div className="toast-wrap">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.type === "success"
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

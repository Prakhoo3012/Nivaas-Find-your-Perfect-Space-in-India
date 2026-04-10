import { useState, useEffect, useRef } from "react";
import { allListings } from "./api/listings";

// ═══════════════════════════════════════════════════════════════
//  GLOBAL STYLES + CSS VARIABLES
// ═══════════════════════════════════════════════════════════════
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:      #F7F3EC;
    --cream2:     #EDE8DF;
    --warm-white: #FAFAF6;
    --charcoal:   #1A1A18;
    --charcoal2:  #2C2C29;
    --stone:      #7A7870;
    --stone2:     #B8B4AB;
    --terracotta: #C05A28;
    --terra2:     #E07848;
    --sage:       #5E7252;
    --sage2:      #8AAD7A;
    --border:     rgba(26,26,24,0.1);
    --border2:    rgba(26,26,24,0.06);
    --shadow-sm:  0 1px 4px rgba(26,26,24,0.06);
    --shadow-md:  0 4px 20px rgba(26,26,24,0.08);
    --shadow-lg:  0 12px 48px rgba(26,26,24,0.12);
    --shadow-xl:  0 24px 80px rgba(26,26,24,0.16);
    --d-bg:       #0E0F0D;
    --d-bg2:      #161815;
    --d-bg3:      #1D1F1B;
    --d-bg4:      #252720;
    --d-border:   rgba(255,255,255,0.07);
    --d-border2:  rgba(255,255,255,0.12);
    --d-text:     #E8E4DC;
    --d-text2:    #9A9890;
    --d-text3:    #5E5D58;
    --gold:       #C8A96E;
    --gold2:      #E8C98A;
    --d-green:    #4E7C5F;
    --d-red:      #8B4040;
    --d-amber:    #8B6B2E;
    --d-blue:     #3A5F8B;
    --sidebar-w:  240px;
    --radius:     10px;
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--warm-white); color: var(--charcoal); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-8px); }
  }
  @keyframes toastIn {
    from { opacity:0; transform: translateX(40px); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════════
const LISTINGS = [
  { _id:"1", title:"Sunlit Studio in Malviya Nagar",  propertyType:"flat",   location:{city:"Jaipur",    state:"Rajasthan"},   pricing:{basePrice:12000,priceType:"per_month"}, ratings:{average:4.8,count:32}, amenities:["wifi","ac","parking"],          roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:380}, isNew:true  },
  { _id:"2", title:"Cozy PG Near IIT Delhi",           propertyType:"pg",     location:{city:"Delhi",     state:"Delhi"},        pricing:{basePrice:8500, priceType:"per_month"}, ratings:{average:4.3,count:18}, amenities:["wifi","meals_included","laundry"],roomInfo:{availableRooms:3,bathrooms:2,areaSqFt:120} },
  { _id:"3", title:"Spacious 2BHK with Garden View",   propertyType:"flat",   location:{city:"Bangalore", state:"Karnataka"},    pricing:{basePrice:22000,priceType:"per_month"}, ratings:{average:4.9,count:47}, amenities:["wifi","ac","gym","parking"],     roomInfo:{availableRooms:1,bathrooms:2,areaSqFt:950} },
  { _id:"4", title:"Sea-facing Room, South Goa",       propertyType:"room",   location:{city:"Goa",       state:"Goa"},          pricing:{basePrice:3200, priceType:"per_night"}, ratings:{average:4.7,count:89}, amenities:["wifi","ac"],                    roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:280} },
  { _id:"5", title:"Minimalist Hostel — Lower Parel",  propertyType:"hostel", location:{city:"Mumbai",    state:"Maharashtra"},  pricing:{basePrice:6000, priceType:"per_month"}, ratings:{average:4.1,count:14}, amenities:["wifi","laundry"],               roomInfo:{availableRooms:5,bathrooms:3,areaSqFt:80}  },
  { _id:"6", title:"Hill-view Studio, Old Manali",     propertyType:"room",   location:{city:"Manali",    state:"Himachal"},     pricing:{basePrice:1800, priceType:"per_night"}, ratings:{average:4.6,count:61}, amenities:["wifi","hot_water"],             roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:220}, isNew:true },
  { _id:"7", title:"Heritage Haveli Suite",            propertyType:"villa",  location:{city:"Udaipur",   state:"Rajasthan"},    pricing:{basePrice:4500, priceType:"per_night"}, ratings:{average:5.0,count:22}, amenities:["wifi","ac","parking"],          roomInfo:{availableRooms:1,bathrooms:2,areaSqFt:600} },
  { _id:"8", title:"Furnished Room in HSR Layout",     propertyType:"room",   location:{city:"Bangalore", state:"Karnataka"},    pricing:{basePrice:9500, priceType:"per_month"}, ratings:{average:4.4,count:9 }, amenities:["wifi","ac"],                    roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:200} },
  { _id:"9", title:"Premium PG — Koregaon Park",       propertyType:"pg",     location:{city:"Pune",      state:"Maharashtra"},  pricing:{basePrice:11000,priceType:"per_month"}, ratings:{average:4.6,count:28}, amenities:["wifi","ac","gym","meals_included"],roomInfo:{availableRooms:2,bathrooms:2,areaSqFt:180} },
];

const CITIES = [
  { name:"Jaipur", icon:"🏯", count:142 }, { name:"Delhi", icon:"🌆", count:389 },
  { name:"Mumbai", icon:"🌊", count:512 }, { name:"Bangalore", icon:"🌿", count:448 },
  { name:"Goa", icon:"🏖️", count:96 },   { name:"Pune", icon:"🎓", count:203 },
];

const CATEGORIES = [
  { label:"All", value:"all" }, { label:"Room", value:"room" }, { label:"Flat", value:"flat" },
  { label:"PG", value:"pg" }, { label:"Hostel", value:"hostel" }, { label:"House", value:"house" },
  { label:"Villa", value:"villa" },
];

const AMENITY_FILTERS = [
  { label:"WiFi", value:"wifi", count:387 }, { label:"AC", value:"ac", count:241 },
  { label:"Parking", value:"parking", count:198 }, { label:"Gym", value:"gym", count:84 },
  { label:"Meals", value:"meals_included", count:112 }, { label:"Laundry", value:"laundry", count:156 },
  { label:"Hot Water", value:"hot_water", count:329 },
];

const INIT_REQUESTS = [
  { _id:"r1", tenant:{fullName:"Priya Sharma"},       property:{title:"Sunlit Studio in Malviya Nagar"}, checkIn:"2025-08-01", checkOut:"2025-08-31", guests:{adults:1}, bookingType:"per_month", priceBreakdown:{totalAmount:12000}, status:"pending"   },
  { _id:"r2", tenant:{fullName:"Rahul Mehta"},         property:{title:"Heritage Haveli Suite"},           checkIn:"2025-07-15", checkOut:"2025-07-18", guests:{adults:2}, bookingType:"per_night", priceBreakdown:{totalAmount:13500}, status:"pending"   },
  { _id:"r3", tenant:{fullName:"Ananya Krishnamurthy"},property:{title:"Sunlit Studio in Malviya Nagar"},  checkIn:"2025-07-01", checkOut:"2025-07-31", guests:{adults:1}, bookingType:"per_month", priceBreakdown:{totalAmount:12000}, status:"confirmed" },
  { _id:"r4", tenant:{fullName:"Karan Singh"},         property:{title:"Heritage Haveli Suite"},           checkIn:"2025-06-10", checkOut:"2025-06-12", guests:{adults:2}, bookingType:"per_night", priceBreakdown:{totalAmount:9000},  status:"completed" },
];

const MOCK_INVOICES = [
  { id:"INV-001", tenant:"Priya Sharma",   property:"Sunlit Studio in Malviya Nagar", amount:12000, dueDate:"2025-08-01", status:"paid",    period:"Aug 2025" },
  { id:"INV-002", tenant:"Ananya K.",      property:"Sunlit Studio in Malviya Nagar", amount:12000, dueDate:"2025-07-01", status:"paid",    period:"Jul 2025" },
  { id:"INV-003", tenant:"Rahul Mehta",    property:"Heritage Haveli Suite",           amount:13500, dueDate:"2025-07-20", status:"overdue", period:"Jul 2025" },
  { id:"INV-004", tenant:"Karan Singh",    property:"Heritage Haveli Suite",           amount:9000,  dueDate:"2025-06-15", status:"paid",    period:"Jun 2025" },
  { id:"INV-005", tenant:"Sneha Patel",    property:"Premium PG — Koregaon Park",      amount:11000, dueDate:"2025-09-01", status:"pending", period:"Sep 2025" },
];

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
const fmt      = n => "₹" + n.toLocaleString("en-IN");
const fmtDate  = s => new Date(s).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
const initials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

// ═══════════════════════════════════════════════════════════════
//  HOME PAGE STYLES
// ═══════════════════════════════════════════════════════════════
const HOME_STYLES = `
  .home-root { min-height:100vh; background:var(--warm-white); color:var(--charcoal); font-family:'DM Sans',sans-serif; }
  .navbar { position:sticky; top:0; z-index:100; background:rgba(250,250,246,0.92); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); padding:0 4rem; height:64px; display:flex; align-items:center; justify-content:space-between; transition:box-shadow 0.3s; }
  .navbar.scrolled { box-shadow:var(--shadow-md); }
  .nav-brand { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .nav-logo-icon { width:34px; height:34px; border-radius:9px; background:var(--charcoal); display:flex; align-items:center; justify-content:center; }
  .nav-logo-name { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:500; color:var(--charcoal); letter-spacing:0.02em; }
  .nav-links { display:flex; align-items:center; gap:0.25rem; }
  .nav-link { padding:0.45rem 0.9rem; border-radius:8px; font-size:0.85rem; color:var(--stone); font-weight:400; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .nav-link:hover { background:var(--cream); color:var(--charcoal); }
  .nav-right { display:flex; align-items:center; gap:0.75rem; }
  .btn-ghost { padding:0.45rem 1rem; border-radius:8px; border:1.5px solid var(--border); background:transparent; color:var(--charcoal); font-size:0.82rem; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .btn-ghost:hover { background:var(--cream2); }
  .btn-cta { padding:0.45rem 1.1rem; border-radius:8px; background:var(--charcoal); color:var(--cream); border:none; font-size:0.82rem; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-cta:hover { background:var(--charcoal2); transform:translateY(-1px); box-shadow:var(--shadow-md); }

  .hero { position:relative; overflow:hidden; padding:5rem 4rem 4rem; background:var(--cream); border-bottom:1px solid var(--border); }
  .hero-bg-pattern { position:absolute; inset:0; pointer-events:none; background-image:radial-gradient(circle at 15% 50%,rgba(192,90,40,0.06) 0%,transparent 50%),radial-gradient(circle at 85% 20%,rgba(94,114,82,0.07) 0%,transparent 45%),repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(26,26,24,0.025) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(26,26,24,0.025) 80px); }
  .hero-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; position:relative; z-index:1; }
  .hero-label { display:inline-flex; align-items:center; gap:6px; font-size:0.7rem; color:var(--terracotta); font-weight:500; text-transform:uppercase; letter-spacing:0.1em; background:rgba(192,90,40,0.08); border:1px solid rgba(192,90,40,0.15); border-radius:20px; padding:4px 12px; margin-bottom:1.25rem; animation:fadeUp 0.6s ease both; }
  .hero-label span { width:5px; height:5px; border-radius:50%; background:var(--terracotta); }
  .hero-headline { font-family:'Cormorant Garamond',serif; font-size:3.8rem; font-weight:400; line-height:1.1; color:var(--charcoal); letter-spacing:-0.02em; margin-bottom:1.25rem; animation:fadeUp 0.6s ease 0.1s both; }
  .hero-headline em { font-style:italic; color:var(--terracotta); }
  .hero-desc { font-size:1rem; color:var(--stone); line-height:1.7; font-weight:300; max-width:420px; margin-bottom:2rem; animation:fadeUp 0.6s ease 0.2s both; }
  .hero-cta-row { display:flex; align-items:center; gap:1rem; animation:fadeUp 0.6s ease 0.3s both; }
  .btn-hero-primary { padding:0.75rem 1.75rem; border-radius:10px; background:var(--charcoal); color:var(--cream); border:none; font-size:0.9rem; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:8px; }
  .btn-hero-primary:hover { background:var(--charcoal2); transform:translateY(-2px); box-shadow:var(--shadow-lg); }
  .btn-hero-secondary { padding:0.75rem 1.5rem; border-radius:10px; background:transparent; color:var(--charcoal); border:1.5px solid var(--border); font-size:0.9rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:8px; font-weight:400; }
  .btn-hero-secondary:hover { background:var(--cream2); border-color:var(--stone2); }
  .hero-trust { display:flex; align-items:center; gap:1.25rem; margin-top:2rem; animation:fadeUp 0.6s ease 0.4s both; }
  .hero-trust-item { display:flex; align-items:center; gap:6px; font-size:0.78rem; color:var(--stone); }
  .hero-trust-dot { width:4px; height:4px; border-radius:50%; background:var(--stone2); }
  .hero-right { position:relative; height:380px; animation:fadeUp 0.7s ease 0.2s both; }
  .hero-card-float { position:absolute; background:var(--warm-white); border:1px solid var(--border); border-radius:16px; padding:1.25rem; box-shadow:var(--shadow-xl); }
  .hcf-main  { width:280px; top:20px; left:0; animation:float 6s ease-in-out infinite; }
  .hcf-stat  { width:160px; top:200px; right:0; animation:float 6s ease-in-out 2s infinite; padding:1rem 1.25rem; }
  .hcf-badge { width:180px; top:0; right:20px; animation:float 6s ease-in-out 1s infinite; padding:0.9rem 1.1rem; }
  .hcf-img { height:130px; border-radius:10px; background:var(--cream2); margin-bottom:0.9rem; display:flex; align-items:center; justify-content:center; position:relative; }
  .hcf-tag { position:absolute; top:8px; left:8px; background:var(--charcoal); color:var(--cream); font-size:0.62rem; font-weight:500; border-radius:20px; padding:3px 9px; text-transform:uppercase; letter-spacing:0.06em; }
  .hcf-title { font-size:0.85rem; font-weight:500; color:var(--charcoal); margin-bottom:0.25rem; }
  .hcf-loc { font-size:0.72rem; color:var(--stone); display:flex; align-items:center; gap:4px; margin-bottom:0.75rem; }
  .hcf-price-row { display:flex; align-items:center; justify-content:space-between; }
  .hcf-price { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:500; color:var(--charcoal); }
  .hcf-stat-num { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:var(--charcoal); font-weight:400; }
  .hcf-stat-label { font-size:0.7rem; color:var(--stone); margin-top:2px; }
  .hcf-badge-row { display:flex; align-items:center; gap:8px; }
  .hcf-badge-icon { width:28px; height:28px; border-radius:8px; background:rgba(192,90,40,0.1); display:flex; align-items:center; justify-content:center; }
  .hcf-badge-title { font-size:0.78rem; font-weight:500; color:var(--charcoal); }
  .hcf-badge-sub { font-size:0.66rem; color:var(--stone); margin-top:1px; }

  .search-section { background:var(--warm-white); padding:2rem 4rem; border-bottom:1px solid var(--border2); }
  .search-wrap { max-width:1200px; margin:0 auto; }
  .search-bar { display:flex; align-items:stretch; background:var(--warm-white); border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:var(--shadow-md); transition:box-shadow 0.2s,border-color 0.2s; }
  .search-bar:focus-within { border-color:var(--charcoal); box-shadow:var(--shadow-lg); }
  .search-field { flex:1; display:flex; flex-direction:column; padding:0.875rem 1.25rem; border-right:1px solid var(--border2); }
  .sf-label { font-size:0.65rem; font-weight:500; color:var(--charcoal); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:2px; }
  .sf-input { border:none; outline:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--charcoal); font-weight:300; }
  .sf-input::placeholder { color:var(--stone2); }
  .sf-select { border:none; outline:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--charcoal); font-weight:300; cursor:pointer; -webkit-appearance:none; width:100%; }
  .search-btn { padding:0 1.75rem; background:var(--charcoal); border:none; cursor:pointer; color:var(--cream); display:flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500; transition:background 0.15s; white-space:nowrap; }
  .search-btn:hover { background:var(--charcoal2); }

  .categories { display:flex; gap:0.6rem; margin-top:1.25rem; flex-wrap:wrap; }
  .cat-pill { display:flex; align-items:center; gap:6px; padding:0.4rem 1rem; border-radius:20px; border:1.5px solid var(--border); background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.78rem; color:var(--stone); font-weight:400; transition:all 0.15s; }
  .cat-pill:hover,.cat-pill.active { border-color:var(--charcoal); color:var(--charcoal); background:var(--cream); font-weight:500; }

  .listings-section { padding:2.5rem 4rem; max-width:1200px; margin:0 auto; }
  .listings-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:1.75rem; }
  .listings-title { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:400; color:var(--charcoal); letter-spacing:-0.01em; }
  .listings-subtitle { font-size:0.83rem; color:var(--stone); margin-top:3px; }
  .listings-controls { display:flex; align-items:center; gap:0.75rem; }
  .sort-select { padding:0.4rem 0.85rem; border:1.5px solid var(--border); border-radius:8px; background:var(--warm-white); font-family:'DM Sans',sans-serif; font-size:0.78rem; color:var(--charcoal); cursor:pointer; outline:none; }
  .listings-layout { display:flex; gap:2rem; }
  .filters-sidebar { width:220px; flex-shrink:0; }
  .filters-sticky { position:sticky; top:80px; }
  .filter-group { margin-bottom:1.75rem; }
  .filter-group-title { font-size:0.72rem; font-weight:500; color:var(--charcoal); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.75rem; }
  .filter-check { display:flex; align-items:center; justify-content:space-between; padding:0.35rem 0; cursor:pointer; }
  .filter-check-left { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--charcoal); }
  .filter-check-count { font-size:0.72rem; color:var(--stone2); }
  .price-range { width:100%; accent-color:var(--terracotta); }

  .listings-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }
  .prop-card { border-radius:16px; overflow:hidden; background:var(--warm-white); border:1px solid var(--border); cursor:pointer; transition:all 0.2s; animation:fadeUp 0.4s ease both; }
  .prop-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:var(--stone2); }
  .prop-img { height:180px; background:var(--cream2); position:relative; display:flex; align-items:center; justify-content:center; }
  .prop-img-icon { opacity:0.2; }
  .prop-badge-new { position:absolute; top:10px; left:10px; background:var(--terracotta); color:#fff; font-size:0.6rem; font-weight:500; border-radius:20px; padding:3px 9px; text-transform:uppercase; letter-spacing:0.06em; }
  .prop-wish { position:absolute; top:10px; right:10px; width:32px; height:32px; border-radius:50%; background:rgba(250,250,246,0.92); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
  .prop-wish:hover { background:#fff; box-shadow:var(--shadow-sm); }
  .prop-wish.active svg { fill:var(--terracotta); stroke:var(--terracotta); }
  .prop-body { padding:1rem; }
  .prop-type-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem; }
  .prop-type { font-size:0.65rem; font-weight:500; color:var(--stone); text-transform:uppercase; letter-spacing:0.08em; }
  .prop-rating { display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--charcoal); font-weight:500; }
  .prop-title { font-size:0.92rem; font-weight:500; color:var(--charcoal); margin-bottom:0.35rem; line-height:1.35; }
  .prop-loc { display:flex; align-items:center; gap:4px; font-size:0.75rem; color:var(--stone); margin-bottom:0.75rem; }
  .prop-amenities { display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.75rem; }
  .prop-amenity { font-size:0.65rem; padding:2px 7px; border-radius:6px; background:var(--cream); border:1px solid var(--border2); color:var(--stone); }
  .prop-footer { display:flex; align-items:center; justify-content:space-between; }
  .prop-price { font-family:'Cormorant Garamond',serif; font-size:1.25rem; font-weight:500; color:var(--charcoal); }
  .prop-price-period { font-family:'DM Sans',sans-serif; font-size:0.72rem; color:var(--stone); }
  .prop-area { font-size:0.72rem; color:var(--stone2); }

  .pagination { display:flex; align-items:center; justify-content:center; gap:0.4rem; margin-top:2rem; }
  .page-btn { width:36px; height:36px; border-radius:8px; border:1.5px solid var(--border); background:transparent; color:var(--stone); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.82rem; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
  .page-btn:hover:not(:disabled) { background:var(--cream); color:var(--charcoal); }
  .page-btn.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }
  .page-btn:disabled { opacity:0.3; cursor:not-allowed; }

  .empty-state { text-align:center; padding:4rem 2rem; color:var(--stone); }

  .cities-section { background:var(--cream); padding:3rem 4rem; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .cities-inner { max-width:1200px; margin:0 auto; }
  .section-heading { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:400; color:var(--charcoal); letter-spacing:-0.01em; margin-bottom:0.4rem; }
  .section-subheading { font-size:0.85rem; color:var(--stone); margin-bottom:1.75rem; }
  .cities-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:0.75rem; }
  .city-card { background:var(--warm-white); border:1px solid var(--border); border-radius:14px; padding:1.25rem 1rem; text-align:center; cursor:pointer; transition:all 0.2s; }
  .city-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--stone2); }
  .city-icon { font-size:1.75rem; margin-bottom:0.5rem; }
  .city-name { font-size:0.85rem; font-weight:500; color:var(--charcoal); margin-bottom:2px; }
  .city-count { font-size:0.7rem; color:var(--stone); }

  .hiw-section { padding:3.5rem 4rem; background:var(--warm-white); border-top:1px solid var(--border); }
  .hiw-inner { max-width:1200px; margin:0 auto; }
  .hiw-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:400; color:var(--charcoal); text-align:center; margin-bottom:0.5rem; }
  .hiw-subtitle { font-size:0.85rem; color:var(--stone); text-align:center; margin-bottom:2.5rem; }
  .hiw-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
  .hiw-step { padding:2rem; background:var(--cream); border:1px solid var(--border); border-radius:18px; }
  .hiw-step-num { font-family:'Cormorant Garamond',serif; font-size:2.5rem; font-weight:300; color:var(--stone2); margin-bottom:0.75rem; }
  .hiw-step-icon { margin-bottom:0.75rem; }
  .hiw-step-title { font-size:0.95rem; font-weight:500; color:var(--charcoal); margin-bottom:0.5rem; }
  .hiw-step-desc { font-size:0.82rem; color:var(--stone); line-height:1.6; font-weight:300; }

  .h-footer { background:var(--charcoal); padding:3rem 4rem 2rem; }
  .h-footer-inner { max-width:1200px; margin:0 auto; }
  .h-footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:2rem; }
  .h-footer-brand-name { font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--cream); margin-bottom:0.5rem; }
  .h-footer-brand-desc { font-size:0.8rem; color:var(--stone); line-height:1.6; max-width:260px; font-weight:300; }
  .h-footer-col-title { font-size:0.72rem; font-weight:500; color:var(--cream); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.75rem; }
  .h-footer-link { display:block; font-size:0.82rem; color:var(--stone); text-decoration:none; margin-bottom:0.4rem; cursor:pointer; transition:color 0.15s; }
  .h-footer-link:hover { color:var(--cream); }
  .h-footer-bottom { border-top:1px solid rgba(255,255,255,0.07); padding-top:1.5rem; display:flex; justify-content:space-between; font-size:0.78rem; color:var(--stone); }
`;

// ═══════════════════════════════════════════════════════════════
//  AUTH STYLES
// ═══════════════════════════════════════════════════════════════
const AUTH_STYLES = `
  .auth-root { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; font-family:'DM Sans',sans-serif; background:var(--warm-white); }
  .auth-left { background:var(--charcoal); display:flex; flex-direction:column; justify-content:space-between; padding:3rem; position:relative; overflow:hidden; }
  .auth-left::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 50% at 20% 80%,rgba(196,98,45,0.18) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 80% 20%,rgba(107,124,92,0.12) 0%,transparent 60%); pointer-events:none; }
  .auth-left-pattern { position:absolute; inset:0; opacity:0.04; background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%); background-size:24px 24px; pointer-events:none; }
  .auth-brand { position:relative; z-index:1; }
  .auth-logo { display:flex; align-items:center; gap:10px; }
  .auth-logo-icon { width:36px; height:36px; background:var(--terracotta); border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .auth-logo-name { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:500; color:var(--cream); letter-spacing:0.02em; }
  .auth-left-content { position:relative; z-index:1; }
  .auth-left-headline { font-family:'Cormorant Garamond',serif; font-size:3rem; font-weight:300; color:var(--cream); line-height:1.2; margin-bottom:1.25rem; letter-spacing:-0.01em; }
  .auth-left-headline em { font-style:italic; color:#E8845A; }
  .auth-left-desc { font-size:0.9rem; color:#B8B4AB; line-height:1.7; max-width:300px; font-weight:300; }
  .auth-left-stats { display:flex; gap:2rem; position:relative; z-index:1; }
  .auth-stat { border-top:1px solid rgba(255,255,255,0.12); padding-top:1rem; }
  .auth-stat-num { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:400; color:var(--cream); display:block; }
  .auth-stat-label { font-size:0.75rem; color:var(--stone); text-transform:uppercase; letter-spacing:0.08em; font-weight:400; }
  .auth-right { display:flex; align-items:center; justify-content:center; padding:3rem 2rem; background:var(--warm-white); overflow-y:auto; }
  .auth-form-container { width:100%; max-width:420px; animation:fadeUp 0.5s ease both; }
  .auth-tabs { display:flex; margin-bottom:2.5rem; border-bottom:1.5px solid var(--border); position:relative; }
  .auth-tab { flex:1; padding:0.75rem 1rem; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:400; color:var(--stone); transition:color 0.2s; letter-spacing:0.02em; }
  .auth-tab.active { color:var(--charcoal); font-weight:500; }
  .auth-tab-indicator { position:absolute; bottom:-1.5px; height:2px; background:var(--terracotta); transition:all 0.3s cubic-bezier(0.4,0,0.2,1); }
  .auth-heading { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:400; color:var(--charcoal); margin-bottom:0.4rem; letter-spacing:-0.01em; }
  .auth-subheading { font-size:0.85rem; color:var(--stone); margin-bottom:2rem; font-weight:300; line-height:1.5; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .form-group { margin-bottom:1.2rem; }
  .form-label { display:block; font-size:0.75rem; font-weight:500; color:var(--charcoal2); margin-bottom:0.45rem; letter-spacing:0.04em; text-transform:uppercase; }
  .form-input-wrap { position:relative; }
  .form-input { width:100%; padding:0.72rem 1rem; border:1.5px solid var(--border); border-radius:8px; background:var(--warm-white); font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--charcoal); transition:border-color 0.2s,box-shadow 0.2s; outline:none; }
  .form-input::placeholder { color:var(--stone2); }
  .form-input:focus { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(192,90,40,0.1); }
  .form-input.error { border-color:#C94040; box-shadow:0 0 0 3px rgba(201,64,64,0.08); }
  .form-error { font-size:0.73rem; color:#C94040; margin-top:0.3rem; }
  .input-icon { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--stone); cursor:pointer; background:none; border:none; padding:2px; display:flex; align-items:center; }
  .role-selector { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
  .role-option { border:1.5px solid var(--border); border-radius:8px; padding:0.75rem 1rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:8px; background:var(--warm-white); }
  .role-option:hover { border-color:var(--stone2); }
  .role-option.selected { border-color:var(--terracotta); background:rgba(192,90,40,0.04); }
  .role-option input { display:none; }
  .role-icon { width:28px; height:28px; border-radius:6px; background:var(--cream); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
  .role-title { display:block; font-size:0.82rem; font-weight:500; color:var(--charcoal); }
  .role-desc { display:block; font-size:0.7rem; color:var(--stone); margin-top:1px; }
  .btn-primary-auth { width:100%; padding:0.8rem; border-radius:8px; background:var(--charcoal); color:var(--cream); border:none; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:0.5rem; }
  .btn-primary-auth:hover:not(:disabled) { background:var(--charcoal2); transform:translateY(-1px); box-shadow:var(--shadow-lg); }
  .btn-primary-auth:disabled { opacity:0.6; cursor:not-allowed; }
  .form-check { display:flex; align-items:flex-start; gap:10px; margin-bottom:1.5rem; cursor:pointer; }
  .form-check-label { font-size:0.8rem; color:var(--stone); line-height:1.5; }
  .form-check-label a { color:var(--charcoal); text-decoration:underline; cursor:pointer; }
  .auth-footer { text-align:center; margin-top:1.5rem; font-size:0.82rem; color:var(--stone); }
  .auth-footer a { color:var(--charcoal); font-weight:500; cursor:pointer; text-decoration:none; }
  .auth-footer a:hover { text-decoration:underline; }
  .strength-bar { height:3px; background:var(--cream2); border-radius:2px; margin-top:6px; overflow:hidden; }
  .strength-fill { height:100%; border-radius:2px; transition:width 0.3s,background 0.3s; }
  .strength-text { font-size:0.68rem; margin-top:3px; }
  .success-wrap { text-align:center; padding:2rem 0; animation:fadeUp 0.4s ease both; }
  .success-icon { width:56px; height:56px; border-radius:50%; background:rgba(107,124,92,0.1); border:2px solid rgba(107,124,92,0.2); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; }
  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; flex-shrink:0; }
`;

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD STYLES
// ═══════════════════════════════════════════════════════════════
const DASH_STYLES = `
  .dash-root { display:flex; min-height:100vh; background:var(--d-bg); color:var(--d-text); font-family:'DM Sans',sans-serif; font-size:14px; }
  .sidebar { width:var(--sidebar-w); flex-shrink:0; background:var(--d-bg2); border-right:1px solid var(--d-border); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; }
  .sidebar-brand { padding:1.5rem 1.5rem 1rem; border-bottom:1px solid var(--d-border); display:flex; align-items:center; gap:10px; }
  .brand-icon { width:32px; height:32px; border-radius:8px; background:var(--gold); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .brand-name { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; color:var(--d-text); letter-spacing:0.02em; }
  .sidebar-owner { padding:1.25rem 1.5rem; border-bottom:1px solid var(--d-border); }
  .owner-avatar { width:40px; height:40px; border-radius:50%; background:var(--d-bg4); border:1.5px solid var(--d-border2); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:var(--gold); margin-bottom:0.6rem; }
  .owner-name { font-size:0.875rem; font-weight:500; color:var(--d-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .owner-badge { display:inline-flex; align-items:center; gap:4px; font-size:0.68rem; color:var(--gold); background:rgba(200,169,110,0.1); border:1px solid rgba(200,169,110,0.2); border-radius:20px; padding:2px 8px; margin-top:4px; text-transform:uppercase; letter-spacing:0.06em; }
  .sidebar-nav { flex:1; padding:1rem 0.75rem; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
  .nav-label-dash { font-size:0.65rem; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.1em; padding:0 0.75rem; margin:1rem 0 0.4rem; }
  .d-nav-item { display:flex; align-items:center; gap:10px; padding:0.6rem 0.75rem; border-radius:8px; cursor:pointer; color:var(--d-text2); font-size:0.875rem; font-weight:400; transition:all 0.15s; border:none; background:none; width:100%; text-align:left; }
  .d-nav-item:hover { background:var(--d-bg3); color:var(--d-text); }
  .d-nav-item.active { background:rgba(200,169,110,0.1); color:var(--gold); }
  .d-nav-item svg { flex-shrink:0; opacity:0.7; }
  .d-nav-item.active svg { opacity:1; }
  .nav-badge-dash { margin-left:auto; background:var(--d-red); color:#fff; font-size:0.65rem; font-weight:500; border-radius:20px; padding:1px 6px; min-width:18px; text-align:center; }
  .nav-badge-dash.gold { background:var(--d-amber); }
  .sidebar-bottom { padding:1rem 0.75rem; border-top:1px solid var(--d-border); }
  .dash-main { flex:1; display:flex; flex-direction:column; min-width:0; }
  .dash-topbar { background:var(--d-bg2); border-bottom:1px solid var(--d-border); padding:0 2rem; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
  .topbar-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:400; color:var(--d-text); letter-spacing:-0.01em; }
  .topbar-actions { display:flex; align-items:center; gap:0.75rem; }
  .btn-icon-dash { width:36px; height:36px; border-radius:8px; background:var(--d-bg3); border:1px solid var(--d-border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--d-text2); transition:all 0.15s; }
  .btn-icon-dash:hover { background:var(--d-bg4); color:var(--d-text); }
  .btn-primary-dash { display:flex; align-items:center; gap:7px; padding:0.5rem 1rem; border-radius:8px; background:var(--gold); color:#1a1500; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:500; transition:all 0.15s; white-space:nowrap; }
  .btn-primary-dash:hover { background:var(--gold2); transform:translateY(-1px); }
  .dash-content { padding:2rem; flex:1; overflow-y:auto; }
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2rem; }
  .stat-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:1.25rem 1.5rem; animation:fadeUp 0.4s ease both; }
  .stat-label { font-size:0.72rem; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.6rem; }
  .stat-value { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:400; color:var(--d-text); line-height:1; margin-bottom:0.4rem; }
  .stat-change { font-size:0.72rem; display:flex; align-items:center; gap:4px; }
  .stat-change.up { color:var(--d-green); }
  .stat-change.neutral { color:var(--d-text3); }
  .d-section { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); margin-bottom:1.5rem; overflow:hidden; animation:fadeUp 0.4s ease both; }
  .section-header { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--d-border); }
  .section-title { font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:400; color:var(--d-text); letter-spacing:-0.01em; }
  .section-count { font-size:0.7rem; color:var(--d-text3); background:var(--d-bg3); border:1px solid var(--d-border); border-radius:20px; padding:2px 8px; }
  .filter-tabs { display:flex; gap:4px; flex-wrap:wrap; }
  .filter-tab { padding:0.3rem 0.75rem; border-radius:6px; border:none; background:none; color:var(--d-text2); font-size:0.75rem; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; }
  .filter-tab:hover { background:var(--d-bg3); color:var(--d-text); }
  .filter-tab.active { background:rgba(200,169,110,0.1); color:var(--gold); }
  .listing-item { display:flex; align-items:center; gap:1rem; padding:1rem 1.5rem; border-bottom:1px solid var(--d-border); transition:background 0.15s; }
  .listing-item:last-child { border-bottom:none; }
  .listing-item:hover { background:rgba(255,255,255,0.02); }
  .listing-thumb { width:56px; height:56px; border-radius:8px; background:var(--d-bg3); border:1px solid var(--d-border); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--d-text3); }
  .listing-info { flex:1; min-width:0; }
  .listing-title { font-size:0.875rem; font-weight:500; color:var(--d-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; }
  .listing-meta { font-size:0.72rem; color:var(--d-text2); display:flex; align-items:center; gap:10px; }
  .listing-rating { display:flex; align-items:center; gap:4px; font-size:0.72rem; color:var(--gold); }
  .listing-price { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:var(--d-text); white-space:nowrap; margin-right:1rem; }
  .listing-actions { display:flex; gap:6px; }
  .btn-sm { padding:0.3rem 0.65rem; border-radius:6px; border:1px solid var(--d-border2); background:var(--d-bg3); color:var(--d-text2); font-size:0.72rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .btn-sm:hover { background:var(--d-bg4); color:var(--d-text); }
  .status-pill { display:inline-flex; align-items:center; gap:4px; font-size:0.68rem; font-weight:500; border-radius:20px; padding:3px 9px; text-transform:capitalize; }
  .status-confirmed { background:rgba(78,124,95,0.12); color:var(--d-green); }
  .status-pending   { background:rgba(139,107,46,0.12); color:#C4912A; }
  .status-rejected  { background:rgba(139,64,64,0.12);  color:#C06060; }
  .status-completed { background:rgba(58,95,139,0.12);  color:#6A9FD4; }
  .status-paid      { background:rgba(78,124,95,0.12); color:var(--d-green); }
  .status-overdue   { background:rgba(139,64,64,0.12); color:#C06060; }
  .requests-list { padding:0; }
  .request-card { display:flex; align-items:center; gap:1.25rem; padding:1.1rem 1.5rem; border-bottom:1px solid var(--d-border); animation:fadeUp 0.3s ease both; }
  .request-card:last-child { border-bottom:none; }
  .req-avatar { width:40px; height:40px; border-radius:50%; background:var(--d-bg4); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:0.95rem; color:var(--gold); flex-shrink:0; }
  .req-info { flex:1; min-width:0; }
  .req-tenant { font-size:0.875rem; font-weight:500; color:var(--d-text); margin-bottom:2px; }
  .req-property { font-size:0.75rem; color:var(--d-text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px; }
  .req-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .req-meta-item { display:flex; align-items:center; gap:4px; font-size:0.7rem; color:var(--d-text3); }
  .req-divider { width:1px; height:48px; background:var(--d-border); flex-shrink:0; }
  .req-amount { font-family:'Cormorant Garamond',serif; font-size:1.15rem; color:var(--d-text); text-align:right; }
  .req-amount-label { font-size:0.65rem; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.06em; }
  .req-actions { display:flex; gap:6px; flex-direction:column; }
  .btn-accept { display:flex; align-items:center; gap:5px; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(78,124,95,0.12); border:1px solid rgba(78,124,95,0.2); color:var(--d-green); font-size:0.75rem; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; white-space:nowrap; }
  .btn-accept:hover { background:rgba(78,124,95,0.2); }
  .btn-reject { display:flex; align-items:center; gap:5px; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(139,64,64,0.12); border:1px solid rgba(139,64,64,0.2); color:#C06060; font-size:0.75rem; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; white-space:nowrap; }
  .btn-reject:hover { background:rgba(139,64,64,0.2); }
  .toast-wrap { position:fixed; bottom:1.5rem; right:1.5rem; display:flex; flex-direction:column; gap:8px; z-index:999; }
  .toast { display:flex; align-items:center; gap:8px; padding:0.7rem 1rem; border-radius:8px; font-size:0.82rem; font-weight:500; animation:toastIn 0.3s ease; box-shadow:0 4px 20px rgba(0,0,0,0.3); }
  .toast.success { background:#1E2E1E; border:1px solid rgba(78,124,95,0.3); color:var(--d-green); }
  .toast.error   { background:#2A1A1A; border:1px solid rgba(139,64,64,0.3); color:#C06060; }
  .d-empty-state { text-align:center; padding:3rem 1rem; color:var(--d-text3); }
  .d-empty-state p { font-size:0.875rem; margin-top:0.5rem; }
`;

// ═══════════════════════════════════════════════════════════════
//  PROPERTY DETAIL STYLES
// ═══════════════════════════════════════════════════════════════
const DETAIL_STYLES = `
  .detail-root { font-family:'DM Sans',sans-serif; background:var(--warm-white); color:var(--charcoal); min-height:100vh; }
  .d-navbar { position:sticky; top:0; z-index:200; background:rgba(250,250,246,0.94); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); height:64px; padding:0 3rem; display:flex; align-items:center; justify-content:space-between; }
  .d-navbar.scrolled { box-shadow:var(--shadow-md); }
  .d-nav-left { display:flex; align-items:center; gap:1rem; }
  .back-btn { display:flex; align-items:center; gap:7px; background:none; border:1.5px solid var(--border); border-radius:8px; padding:0.4rem 0.85rem; font-family:'DM Sans',sans-serif; font-size:0.8rem; color:var(--stone); cursor:pointer; transition:all 0.15s; }
  .back-btn:hover { background:var(--cream); color:var(--charcoal); }
  .d-brand { display:flex; align-items:center; gap:9px; }
  .d-brand-icon { width:30px; height:30px; border-radius:8px; background:var(--charcoal); display:flex; align-items:center; justify-content:center; }
  .d-brand-name { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:500; color:var(--charcoal); }
  .d-nav-right { display:flex; align-items:center; gap:0.75rem; }
  .icon-btn { width:38px; height:38px; border-radius:9px; border:1.5px solid var(--border); background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--stone); transition:all 0.15s; }
  .icon-btn:hover { background:var(--cream); color:var(--charcoal); }
  .icon-btn.wishlisted { background:var(--cream); border-color:var(--terracotta); color:var(--terracotta); }
  .gallery-wrap { padding:1.5rem 3rem 0; max-width:1320px; margin:0 auto; }
  .gallery-grid { display:grid; grid-template-columns:1.65fr 1fr; grid-template-rows:260px 220px; gap:4px; height:488px; border-radius:18px; overflow:hidden; }
  .gallery-main { grid-row:span 2; background:var(--cream2); position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .gallery-thumb { background:var(--cream2); position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .gallery-thumb:first-of-type { border-top-right-radius:0; }
  .gallery-thumb:last-of-type { border-bottom-right-radius:18px; }
  .gallery-img-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:var(--stone2); }
  .gallery-all-btn { position:absolute; bottom:14px; right:14px; background:rgba(250,250,246,0.95); border:1.5px solid var(--border); border-radius:8px; padding:0.45rem 1rem; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:500; color:var(--charcoal); cursor:pointer; display:flex; align-items:center; gap:6px; }
  .detail-layout { max-width:1320px; margin:0 auto; padding:2.5rem 3rem 5rem; display:grid; grid-template-columns:1fr 380px; gap:3.5rem; align-items:start; }
  .detail-left { min-width:0; }
  .property-type-pill { display:inline-flex; align-items:center; gap:5px; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--terracotta); font-weight:500; background:rgba(192,90,40,0.08); border:1px solid rgba(192,90,40,0.15); border-radius:20px; padding:4px 12px; margin-bottom:1rem; }
  .property-title { font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-weight:400; line-height:1.1; color:var(--charcoal); letter-spacing:-0.02em; margin-bottom:1rem; }
  .property-meta-row { display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; margin-bottom:1.75rem; }
  .meta-item { display:flex; align-items:center; gap:6px; font-size:0.83rem; color:var(--stone); }
  .meta-dot { width:4px; height:4px; border-radius:50%; background:var(--stone2); }
  .rating-badge { display:flex; align-items:center; gap:5px; background:var(--cream); border:1px solid var(--border); border-radius:8px; padding:4px 10px; font-size:0.83rem; font-weight:500; color:var(--charcoal); }
  .section-divider { height:1px; background:var(--border); margin:2rem 0; }
  .sec-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:500; color:var(--charcoal); letter-spacing:-0.01em; margin-bottom:1rem; }
  .description-text { font-size:0.93rem; color:var(--stone); line-height:1.9; font-weight:300; max-width:640px; }
  .description-text.clamped { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
  .read-more-btn { background:none; border:none; color:var(--charcoal); font-weight:500; font-family:'DM Sans',sans-serif; font-size:0.85rem; cursor:pointer; margin-top:0.6rem; padding:0; text-decoration:underline; text-underline-offset:3px; }
  .quick-facts { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
  .fact-card { background:var(--cream); border:1px solid var(--border); border-radius:14px; padding:1.1rem 1rem; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; }
  .fact-icon { color:var(--terracotta); }
  .fact-value { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:400; color:var(--charcoal); }
  .fact-label { font-size:0.7rem; color:var(--stone); text-transform:uppercase; letter-spacing:0.07em; }
  .amenities-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0.6rem; }
  .amenity-item { display:flex; align-items:center; gap:10px; padding:0.65rem 0.9rem; border-radius:10px; border:1px solid var(--border2); background:var(--cream); font-size:0.83rem; color:var(--charcoal); }
  .amenity-item svg { color:var(--terracotta); flex-shrink:0; }
  .owner-card { border:1px solid var(--border); border-radius:18px; padding:1.5rem; background:var(--cream); }
  .owner-top { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
  .owner-avatar-lg { width:56px; height:56px; border-radius:50%; background:var(--charcoal); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--cream); flex-shrink:0; }
  .owner-verified { display:inline-flex; align-items:center; gap:4px; font-size:0.68rem; color:var(--sage); font-weight:500; background:rgba(94,114,82,0.08); border:1px solid rgba(94,114,82,0.2); border-radius:20px; padding:2px 8px; margin-top:4px; }
  .owner-stats { display:flex; gap:1.5rem; flex-wrap:wrap; }
  .owner-stat-val { font-family:'Cormorant Garamond',serif; font-size:1.4rem; color:var(--charcoal); }
  .owner-stat-label { font-size:0.68rem; color:var(--stone); text-transform:uppercase; letter-spacing:0.06em; }
  .contact-owner-btn { width:100%; margin-top:1.25rem; padding:0.65rem; border-radius:9px; border:1.5px solid var(--charcoal); background:transparent; font-family:'DM Sans',sans-serif; font-size:0.83rem; font-weight:500; color:var(--charcoal); cursor:pointer; transition:all 0.2s; }
  .contact-owner-btn:hover { background:var(--charcoal); color:var(--cream); }
  .reviews-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .review-card { background:var(--cream); border:1px solid var(--border); border-radius:14px; padding:1.25rem; }
  .review-author-row { display:flex; align-items:center; gap:10px; margin-bottom:0.75rem; }
  .review-avatar { width:36px; height:36px; border-radius:50%; background:var(--charcoal); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:0.85rem; color:var(--cream); flex-shrink:0; }
  .review-author { font-size:0.85rem; font-weight:500; color:var(--charcoal); }
  .review-date { font-size:0.72rem; color:var(--stone); }
  .review-text { font-size:0.82rem; color:var(--stone); line-height:1.7; font-weight:300; }
  .booking-card { position:sticky; top:80px; background:var(--warm-white); border:1.5px solid var(--border); border-radius:20px; padding:1.75rem; box-shadow:var(--shadow-xl); animation:fadeUp 0.5s ease 0.3s both; }
  .booking-price-row { display:flex; align-items:baseline; gap:6px; margin-bottom:1.5rem; }
  .booking-price { font-family:'Cormorant Garamond',serif; font-size:2.4rem; font-weight:500; color:var(--charcoal); line-height:1; }
  .booking-price-period { font-size:0.83rem; color:var(--stone); font-weight:300; }
  .booking-dates { border:1.5px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:1rem; }
  .date-row { display:grid; grid-template-columns:1fr 1fr; }
  .date-field { padding:0.75rem 1rem; border-right:1px solid var(--border); cursor:pointer; }
  .date-field:last-child { border-right:none; }
  .date-field:hover { background:var(--cream); }
  .date-field-label { font-size:0.62rem; font-weight:500; text-transform:uppercase; letter-spacing:0.09em; color:var(--charcoal); margin-bottom:3px; }
  .date-field input { width:100%; border:none; outline:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--charcoal); cursor:pointer; }
  .guests-field { border:1.5px solid var(--border); border-radius:12px; padding:0.75rem 1rem; margin-bottom:1.25rem; display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
  .guests-field:hover { background:var(--cream); }
  .guests-field-label { font-size:0.62rem; font-weight:500; text-transform:uppercase; letter-spacing:0.09em; color:var(--charcoal); margin-bottom:3px; }
  .guests-counter { display:flex; align-items:center; gap:10px; }
  .counter-btn { width:28px; height:28px; border-radius:50%; border:1.5px solid var(--border); background:var(--warm-white); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--charcoal); transition:all 0.15s; }
  .counter-btn:hover:not(:disabled) { background:var(--cream2); }
  .counter-btn:disabled { opacity:0.3; cursor:not-allowed; }
  .counter-val { font-size:0.93rem; font-weight:500; color:var(--charcoal); min-width:18px; text-align:center; }
  .price-breakdown { background:var(--cream); border-radius:12px; padding:1rem 1.1rem; margin-bottom:1.25rem; }
  .breakdown-row { display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; color:var(--stone); margin-bottom:0.6rem; }
  .breakdown-row.total { border-top:1px solid var(--border); padding-top:0.6rem; margin-top:0.6rem; color:var(--charcoal); font-weight:500; font-size:0.88rem; }
  .book-btn { width:100%; padding:0.9rem; background:var(--charcoal); color:var(--cream); border:none; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:0.93rem; font-weight:500; cursor:pointer; transition:all 0.25s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .book-btn:hover { background:var(--charcoal2); transform:translateY(-2px); box-shadow:var(--shadow-lg); }
  .book-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .book-note { text-align:center; font-size:0.72rem; color:var(--stone); margin-top:0.75rem; }
  .map-placeholder { height:220px; background:var(--cream2); border-radius:16px; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--stone2); gap:8px; font-size:0.85rem; }
  .detail-toast-wrap { position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%); z-index:9999; display:flex; flex-direction:column; align-items:center; gap:8px; }
  .detail-toast { display:flex; align-items:center; gap:10px; padding:0.75rem 1.25rem; border-radius:10px; font-size:0.82rem; font-weight:500; min-width:240px; animation:toastIn 0.3s ease both; box-shadow:var(--shadow-xl); }
  .detail-toast.success { background:#1B2E1B; border:1px solid rgba(94,114,82,0.3); color:#7AC97A; }
  .detail-toast.error   { background:#2A1818; border:1px solid rgba(192,90,40,0.3); color:#E07848; }
`;

// ═══════════════════════════════════════════════════════════════
//  BILLING PAGE STYLES (enhanced)
// ═══════════════════════════════════════════════════════════════
const BILLING_STYLES = `
  .billing-page { background:var(--d-bg); min-height:100vh; color:var(--d-text); font-family:'DM Sans',sans-serif; padding:2rem; }
  .billing-header { margin-bottom:2rem; }
  .billing-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:400; color:var(--d-text); margin-bottom:0.3rem; }
  .billing-subtitle { font-size:0.82rem; color:var(--d-text3); }
  .billing-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
  .billing-sum-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:1.25rem; animation:fadeUp 0.35s ease both; position:relative; overflow:hidden; }
  .billing-sum-card::after { content:''; position:absolute; inset:0; opacity:0.04; pointer-events:none; border-radius:var(--radius); }
  .billing-sum-label { font-size:0.7rem; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.6rem; display:flex; align-items:center; gap:6px; }
  .billing-sum-value { font-family:'Cormorant Garamond',serif; font-size:2rem; color:var(--d-text); line-height:1; }
  .billing-sum-sub { font-size:0.72rem; color:var(--d-text3); margin-top:0.4rem; display:flex; align-items:center; gap:4px; }
  .billing-sum-trend { display:inline-flex; align-items:center; gap:3px; font-size:0.7rem; font-weight:500; }
  .billing-sum-trend.up { color:#5E9E6A; } .billing-sum-trend.down { color:#C06060; }

  .billing-two-col { display:grid; grid-template-columns:1fr 320px; gap:1.25rem; margin-bottom:1.5rem; }
  .billing-chart-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:1.5rem; }
  .billing-chart-title { font-size:0.82rem; font-weight:500; color:var(--d-text); margin-bottom:0.25rem; }
  .billing-chart-sub { font-size:0.72rem; color:var(--d-text3); margin-bottom:1.25rem; }
  .billing-bars { display:flex; align-items:flex-end; gap:8px; height:140px; }
  .billing-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; }
  .billing-bar-amt { font-size:0.62rem; color:var(--d-text3); }
  .billing-bar { width:100%; border-radius:4px 4px 0 0; transition:opacity 0.2s; cursor:pointer; }
  .billing-bar:hover { opacity:0.85; }
  .billing-bar-label { font-size:0.65rem; color:var(--d-text3); }

  .payment-methods-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:1.5rem; }
  .pm-title { font-size:0.82rem; font-weight:500; color:var(--d-text); margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center; }
  .pm-add-btn { font-size:0.72rem; color:var(--gold); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; }
  .pm-item { display:flex; align-items:center; gap:12px; padding:0.85rem; border:1px solid var(--d-border); border-radius:9px; margin-bottom:0.6rem; cursor:pointer; transition:all 0.15s; }
  .pm-item:hover { background:var(--d-bg3); border-color:var(--d-border2); }
  .pm-item.primary-pm { border-color:rgba(200,169,110,0.3); background:rgba(200,169,110,0.04); }
  .pm-icon { width:38px; height:26px; background:var(--d-bg4); border-radius:5px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .pm-details { flex:1; }
  .pm-name { font-size:0.8rem; font-weight:500; color:var(--d-text); }
  .pm-meta { font-size:0.7rem; color:var(--d-text3); }
  .pm-badge { font-size:0.6rem; color:var(--gold); background:rgba(200,169,110,0.12); border:1px solid rgba(200,169,110,0.2); border-radius:20px; padding:2px 7px; }

  .billing-controls { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
  .billing-search { display:flex; align-items:center; gap:8px; background:var(--d-bg2); border:1px solid var(--d-border); border-radius:8px; padding:0.5rem 1rem; min-width:240px; }
  .billing-search input { border:none; outline:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:0.82rem; color:var(--d-text); flex:1; }
  .billing-search input::placeholder { color:var(--d-text3); }
  .billing-actions { display:flex; gap:0.75rem; }
  .billing-table-wrap { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); overflow:hidden; }
  .billing-table { width:100%; border-collapse:collapse; }
  .billing-table th { padding:0.85rem 1.25rem; text-align:left; font-size:0.68rem; font-weight:500; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.08em; border-bottom:1px solid var(--d-border); background:var(--d-bg3); }
  .billing-table td { padding:1rem 1.25rem; font-size:0.82rem; color:var(--d-text2); border-bottom:1px solid var(--d-border); }
  .billing-table tr:last-child td { border-bottom:none; }
  .billing-table tr:hover td { background:rgba(255,255,255,0.02); cursor:pointer; }
  .invoice-id { font-family:'Cormorant Garamond',serif; font-size:0.95rem; color:var(--gold); }
  .invoice-amount { font-family:'Cormorant Garamond',serif; font-size:1rem; color:var(--d-text); }
  .bill-action-btn { padding:0.3rem 0.7rem; border-radius:6px; border:1px solid var(--d-border2); background:var(--d-bg3); color:var(--d-text2); font-size:0.72rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .bill-action-btn:hover { background:var(--d-bg4); color:var(--d-text); }
  .bill-action-btn.send { background:rgba(200,169,110,0.1); border-color:rgba(200,169,110,0.25); color:var(--gold); }
  .bill-action-btn.send:hover { background:rgba(200,169,110,0.2); }
  .new-invoice-modal { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); z-index:500; display:flex; align-items:center; justify-content:center; animation:fadeUp 0.2s ease both; }
  .modal-box { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:16px; padding:2rem; width:500px; max-width:92vw; max-height:90vh; overflow-y:auto; }
  .modal-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--d-text); margin-bottom:0.3rem; }
  .modal-sub { font-size:0.78rem; color:var(--d-text3); margin-bottom:1.5rem; }
  .modal-form-group { margin-bottom:1rem; }
  .modal-label { display:block; font-size:0.7rem; font-weight:500; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.4rem; }
  .modal-input { width:100%; padding:0.65rem 0.9rem; background:var(--d-bg3); border:1px solid var(--d-border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--d-text); outline:none; }
  .modal-input:focus { border-color:var(--gold); }
  .modal-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .modal-actions { display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem; }
  .modal-cancel { padding:0.6rem 1.1rem; border-radius:8px; background:transparent; border:1px solid var(--d-border); color:var(--d-text2); font-family:'DM Sans',sans-serif; font-size:0.82rem; cursor:pointer; }
  .modal-cancel:hover { background:var(--d-bg3); }
  .modal-submit { padding:0.6rem 1.25rem; border-radius:8px; background:var(--gold); border:none; color:#1a1500; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; }
  .modal-submit:hover { background:var(--gold2); }

  /* Receipt Modal */
  .receipt-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--d-border); }
  .receipt-logo { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); }
  .receipt-id { font-size:0.72rem; color:var(--d-text3); }
  .receipt-party-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; }
  .receipt-party-label { font-size:0.65rem; color:var(--d-text3); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
  .receipt-party-name { font-size:0.88rem; font-weight:500; color:var(--d-text); }
  .receipt-party-sub { font-size:0.75rem; color:var(--d-text3); }
  .receipt-line { display:flex; justify-content:space-between; padding:0.55rem 0; font-size:0.82rem; color:var(--d-text2); border-bottom:1px dashed var(--d-border); }
  .receipt-total-line { display:flex; justify-content:space-between; padding:0.75rem 0 0.25rem; font-size:0.95rem; font-weight:500; color:var(--d-text); }
  .receipt-status-badge { display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:500; padding:4px 12px; border-radius:20px; margin-top:1rem; }
  .receipt-status-badge.paid { background:rgba(94,114,82,0.12); border:1px solid rgba(94,114,82,0.25); color:#6DB87A; }
  .receipt-status-badge.pending { background:rgba(200,160,80,0.12); border:1px solid rgba(200,160,80,0.25); color:#C8A040; }
  .receipt-status-badge.overdue { background:rgba(180,60,60,0.12); border:1px solid rgba(180,60,60,0.25); color:#C06060; }
  .receipt-footer { text-align:center; font-size:0.72rem; color:var(--d-text3); margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--d-border); }
  .receipt-print-btn { width:100%; padding:0.65rem; border-radius:8px; background:var(--d-bg3); border:1px solid var(--d-border); color:var(--d-text2); font-family:'DM Sans',sans-serif; font-size:0.82rem; cursor:pointer; margin-top:1.25rem; transition:all 0.15s; display:flex; align-items:center; justify-content:center; gap:6px; }
  .receipt-print-btn:hover { background:var(--d-bg4); color:var(--d-text); }
`;

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS STYLES
// ═══════════════════════════════════════════════════════════════
const NOTIFICATIONS_STYLES = `
  .notif-list { display:flex; flex-direction:column; gap:0; }
  .notif-item { display:flex; align-items:flex-start; gap:1rem; padding:1.1rem 1.5rem; border-bottom:1px solid var(--d-border); cursor:pointer; transition:background 0.15s; position:relative; }
  .notif-item:last-child { border-bottom:none; }
  .notif-item:hover { background:rgba(255,255,255,0.02); }
  .notif-item.unread { background:rgba(200,169,110,0.03); }
  .notif-dot { width:7px; height:7px; border-radius:50%; background:var(--gold); position:absolute; top:1.35rem; left:0.6rem; flex-shrink:0; }
  .notif-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .notif-icon.booking { background:rgba(94,114,82,0.12); color:#6DB87A; }
  .notif-icon.payment { background:rgba(200,169,110,0.12); color:var(--gold); }
  .notif-icon.alert   { background:rgba(192,90,40,0.12); color:var(--terracotta); }
  .notif-icon.system  { background:rgba(58,95,139,0.12); color:#5A8EC8; }
  .notif-icon.review  { background:rgba(139,58,139,0.12); color:#B87AB8; }
  .notif-body { flex:1; min-width:0; }
  .notif-title-row { display:flex; justify-content:space-between; margin-bottom:3px; }
  .notif-title { font-size:0.85rem; font-weight:500; color:var(--d-text); }
  .notif-time { font-size:0.7rem; color:var(--d-text3); white-space:nowrap; }
  .notif-desc { font-size:0.78rem; color:var(--d-text2); line-height:1.5; }
  .notif-tag { display:inline-block; margin-top:6px; font-size:0.65rem; color:var(--d-text3); background:var(--d-bg4); border:1px solid var(--d-border); border-radius:20px; padding:2px 8px; }
  .notif-filter-bar { display:flex; gap:0.5rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .notif-filter-btn { padding:0.35rem 0.9rem; border-radius:20px; border:1px solid var(--d-border); background:transparent; color:var(--d-text3); font-size:0.75rem; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; }
  .notif-filter-btn.active { background:var(--d-bg3); border-color:var(--d-border2); color:var(--d-text); }
  .notif-empty { text-align:center; padding:3rem 2rem; color:var(--d-text3); font-size:0.85rem; }
  .notif-mark-all { font-size:0.75rem; color:var(--gold); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; padding:0; }
  .notif-mark-all:hover { text-decoration:underline; }
`;

// ═══════════════════════════════════════════════════════════════
//  PROPERTY REGISTER STYLES
// ═══════════════════════════════════════════════════════════════
const REGISTER_PROP_STYLES = `
  .reg-root { background:var(--warm-white); min-height:100vh; font-family:'DM Sans',sans-serif; }
  .reg-navbar { position:sticky; top:0; z-index:100; background:rgba(250,250,246,0.94); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); height:64px; padding:0 3rem; display:flex; align-items:center; justify-content:space-between; }
  .reg-body { max-width:860px; margin:0 auto; padding:3rem 2rem 5rem; }
  .reg-header { margin-bottom:2.5rem; }
  .reg-eyebrow { display:inline-flex; align-items:center; gap:6px; font-size:0.7rem; color:var(--terracotta); font-weight:500; text-transform:uppercase; letter-spacing:0.1em; background:rgba(192,90,40,0.08); border:1px solid rgba(192,90,40,0.15); border-radius:20px; padding:4px 12px; margin-bottom:1rem; }
  .reg-title { font-family:'Cormorant Garamond',serif; font-size:2.8rem; font-weight:400; color:var(--charcoal); letter-spacing:-0.02em; line-height:1.1; margin-bottom:0.75rem; }
  .reg-title em { font-style:italic; color:var(--terracotta); }
  .reg-desc { font-size:0.9rem; color:var(--stone); line-height:1.7; font-weight:300; }
  .reg-steps { display:flex; align-items:center; gap:0; margin-bottom:2.5rem; background:var(--cream); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .reg-step-item { flex:1; padding:0.85rem 1rem; text-align:center; font-size:0.75rem; cursor:pointer; transition:all 0.2s; border-right:1px solid var(--border); display:flex; align-items:center; justify-content:center; gap:8px; color:var(--stone); }
  .reg-step-item:last-child { border-right:none; }
  .reg-step-item.active { background:var(--charcoal); color:var(--cream); }
  .reg-step-item.done { background:var(--cream2); color:var(--charcoal); font-weight:500; }
  .reg-step-num { width:20px; height:20px; border-radius:50%; border:1.5px solid currentColor; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:600; flex-shrink:0; }
  .reg-form-card { background:var(--warm-white); border:1px solid var(--border); border-radius:18px; padding:2rem; margin-bottom:1.5rem; }
  .reg-form-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:500; color:var(--charcoal); margin-bottom:0.3rem; }
  .reg-form-sub { font-size:0.8rem; color:var(--stone); margin-bottom:1.75rem; }
  .reg-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
  .reg-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1.25rem; }
  .reg-form-group { margin-bottom:0; }
  .reg-label { display:block; font-size:0.72rem; font-weight:500; color:var(--charcoal2); margin-bottom:0.45rem; letter-spacing:0.04em; text-transform:uppercase; }
  .reg-input { width:100%; padding:0.72rem 1rem; border:1.5px solid var(--border); border-radius:8px; background:var(--warm-white); font-family:'DM Sans',sans-serif; font-size:0.875rem; color:var(--charcoal); outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
  .reg-input:focus { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(192,90,40,0.08); }
  .reg-input.error { border-color:#C94040; }
  .reg-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237A7870' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:2rem; }
  .reg-textarea { resize:vertical; min-height:100px; }
  .amenity-toggles { display:grid; grid-template-columns:repeat(4,1fr); gap:0.75rem; }
  .amenity-toggle { border:1.5px solid var(--border); border-radius:10px; padding:0.75rem; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center; background:var(--warm-white); }
  .amenity-toggle:hover { border-color:var(--stone2); }
  .amenity-toggle.selected { border-color:var(--terracotta); background:rgba(192,90,40,0.04); }
  .amenity-toggle-icon { font-size:1.25rem; }
  .amenity-toggle-label { font-size:0.72rem; color:var(--charcoal); font-weight:400; }
  .photo-upload-zone { border:2px dashed var(--border); border-radius:14px; padding:3rem 2rem; text-align:center; cursor:pointer; transition:all 0.2s; }
  .photo-upload-zone:hover { border-color:var(--terracotta); background:rgba(192,90,40,0.02); }
  .photo-upload-icon { margin:0 auto 0.75rem; color:var(--stone2); }
  .photo-upload-text { font-size:0.85rem; color:var(--stone); margin-bottom:0.3rem; }
  .photo-upload-sub { font-size:0.75rem; color:var(--stone2); }
  .reg-nav { display:flex; align-items:center; justify-content:space-between; margin-top:2rem; }
  .reg-btn-back { padding:0.7rem 1.5rem; border-radius:10px; background:transparent; border:1.5px solid var(--border); color:var(--charcoal); font-family:'DM Sans',sans-serif; font-size:0.875rem; cursor:pointer; transition:all 0.15s; }
  .reg-btn-back:hover { background:var(--cream2); }
  .reg-btn-next { padding:0.7rem 1.75rem; border-radius:10px; background:var(--charcoal); color:var(--cream); border:none; font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:500; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:8px; }
  .reg-btn-next:hover { background:var(--charcoal2); transform:translateY(-1px); box-shadow:var(--shadow-lg); }
  .reg-btn-next:disabled { opacity:0.5; cursor:not-allowed; }
  .reg-success { text-align:center; padding:4rem 2rem; animation:fadeUp 0.5s ease both; }
  .reg-success-icon { width:72px; height:72px; border-radius:50%; background:rgba(94,114,82,0.1); border:2px solid rgba(94,114,82,0.25); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; }
  .reg-success-title { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:400; color:var(--charcoal); margin-bottom:0.75rem; }
  .reg-success-text { font-size:0.9rem; color:var(--stone); line-height:1.7; font-weight:300; max-width:400px; margin:0 auto 2rem; }
`;

// ═══════════════════════════════════════════════════════════════
//  TENANT DASHBOARD STYLES
// ═══════════════════════════════════════════════════════════════
const TENANT_STYLES = `
  .tenant-root { display:flex; min-height:100vh; background:var(--d-bg); color:var(--d-text); font-family:'DM Sans',sans-serif; }
  .tenant-dash-content { padding:2rem; flex:1; overflow-y:auto; }
  .my-bookings-list { display:flex; flex-direction:column; gap:1rem; }
  .booking-card-t { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:1.5rem; display:flex; align-items:center; gap:1.5rem; animation:fadeUp 0.3s ease both; }
  .booking-thumb-t { width:80px; height:80px; border-radius:10px; background:var(--d-bg3); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--d-text3); }
  .booking-info-t { flex:1; min-width:0; }
  .booking-title-t { font-size:0.95rem; font-weight:500; color:var(--d-text); margin-bottom:4px; }
  .booking-loc-t { font-size:0.78rem; color:var(--d-text2); margin-bottom:6px; display:flex; align-items:center; gap:5px; }
  .booking-dates-t { font-size:0.75rem; color:var(--d-text3); display:flex; align-items:center; gap:6px; }
  .booking-price-t { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--d-text); text-align:right; white-space:nowrap; }
  .booking-price-sub { font-size:0.7rem; color:var(--d-text3); margin-top:2px; font-family:'DM Sans',sans-serif; }
  .wishlist-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
  .wishlist-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); overflow:hidden; }
  .wishlist-img { height:120px; background:var(--d-bg3); display:flex; align-items:center; justify-content:center; color:var(--d-text3); }
  .wishlist-body { padding:0.85rem; }
  .wishlist-title { font-size:0.82rem; font-weight:500; color:var(--d-text); margin-bottom:3px; }
  .wishlist-loc { font-size:0.72rem; color:var(--d-text3); }
  .wishlist-price { font-family:'Cormorant Garamond',serif; font-size:1rem; color:var(--gold); margin-top:4px; }
  .profile-card { background:var(--d-bg2); border:1px solid var(--d-border); border-radius:var(--radius); padding:2rem; display:flex; align-items:flex-start; gap:2rem; margin-bottom:1.5rem; }
  .profile-avatar-lg { width:80px; height:80px; border-radius:50%; background:var(--d-bg4); border:2px solid var(--d-border2); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:2rem; color:var(--gold); flex-shrink:0; }
  .profile-info { flex:1; }
  .profile-name { font-family:'Cormorant Garamond',serif; font-size:1.5rem; color:var(--d-text); margin-bottom:4px; }
  .profile-email { font-size:0.82rem; color:var(--d-text3); margin-bottom:1rem; }
  .profile-edit-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .profile-input { width:100%; padding:0.6rem 0.85rem; background:var(--d-bg3); border:1px solid var(--d-border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.82rem; color:var(--d-text); outline:none; }
  .profile-input:focus { border-color:var(--gold); }
`;

// ═══════════════════════════════════════════════════════════════
//  HOME PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════
const AMENITY_LABEL_MAP = { wifi:"WiFi", ac:"AC", parking:"Parking", gym:"Gym", meals_included:"Meals", laundry:"Laundry", hot_water:"Hot Water", power_backup:"Power" };

function PropertyCard({ listing:l, idx, wishlist, toggleWishlist, onClick }) {
  return (
    <div className="prop-card" style={{animationDelay:`${idx*0.04}s`}} onClick={()=>onClick && onClick(l)}>
      <div className="prop-img">
        <svg className="prop-img-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--stone2)" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        {l.isNew && <div className="prop-badge-new">New</div>}
        <button className={`prop-wish${wishlist?" active":""}`} onClick={e=>{e.stopPropagation();toggleWishlist(l._id);}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
      </div>
      <div className="prop-body">
        <div className="prop-type-row">
          <span className="prop-type">{l.propertyType}</span>
          {l.ratings.count>0 && (
            <div className="prop-rating">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--terracotta)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {l.ratings.average}
            </div>
          )}
        </div>
        <div className="prop-title">{l.title}</div>
        <div className="prop-loc">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {l.location.city}, {l.location.state}
        </div>
        <div className="prop-amenities">
          {l.amenities.slice(0,3).map(a=><span key={a} className="prop-amenity">{AMENITY_LABEL_MAP[a]||a}</span>)}
        </div>
        <div className="prop-footer">
          <div>
            <span className="prop-price">{fmt(l.pricing.basePrice)}</span>
            <span className="prop-price-period"> /{l.pricing.priceType.replace("per_","")}</span>
          </div>
          <span className="prop-area">{l.roomInfo.areaSqFt} sqft</span>
        </div>
      </div>
    </div>
  );
}

function FiltersSidebar({ selectedAmenities, setSelectedAmenities, priceMax, setPriceMax }) {
  const toggle = v => setSelectedAmenities(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
  return (
    <div className="filters-sidebar">
      <div className="filters-sticky">
        <div className="filter-group">
          <div className="filter-group-title">Price (max)</div>
          <input type="range" min="1000" max="30000" step="500" value={priceMax} onChange={e=>setPriceMax(+e.target.value)} className="price-range" style={{width:"100%"}} />
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",color:"var(--stone)",marginTop:6}}>
            <span>₹1k</span><span style={{color:"var(--charcoal)",fontWeight:500}}>{fmt(priceMax)}</span><span>₹30k</span>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-group-title">Amenities</div>
          {AMENITY_FILTERS.map(a=>(
            <label key={a.value} className="filter-check" style={{cursor:"pointer"}}>
              <div className="filter-check-left">
                <input type="checkbox" checked={selectedAmenities.includes(a.value)} onChange={()=>toggle(a.value)} style={{accentColor:"var(--terracotta)"}} />
                {a.label}
              </div>
              <span className="filter-check-count">{a.count}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomePage({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceMax, setPriceMax] = useState(30000);
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await allListings();  
        setListings(data.data);
      } catch (error) {
        console.log("ERR:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  console.log("Listings: ", listings)

  const toggleWishlist = id => setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);

  const filtered = listings
  .filter(l=>{
    const matchCity = !city || l.location.city.toLowerCase()===city.toLowerCase();
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = category==="all" || l.propertyType===category;
    const matchPrice = l.pricing.basePrice <= priceMax;
    const matchAmen = selectedAmenities.length===0 || selectedAmenities.every(a=>l.amenities.includes(a));
    return matchCity && matchSearch && matchCat && matchPrice && matchAmen;
  });


  return (
    <div className="home-root">
      <nav className={`navbar${scrolled?" scrolled":""}`}>
        <div className="nav-brand" onClick={()=>navigate("home")}>
          <div className="nav-logo-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <span className="nav-logo-name">Nivaas</span>
        </div>
        <div className="nav-links">
          {["Browse","Cities","How it works"].map(l=><button key={l} className="nav-link">{l}</button>)}
        </div>
        <div className="nav-right">
          <button className="btn-ghost" onClick={()=>navigate("auth")}>Sign in</button>
          <button className="btn-cta" onClick={()=>navigate("register-property")}>List property</button>
          <button className="btn-ghost" onClick={()=>navigate("dashboard")}>My Bookings</button>
        </div>
      </nav>

      {loading? (
      <div className="text-center py-10">Loading listings...</div>
    ): (
      <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-inner">
          <div>
            <div className="hero-label"><span/>Zero Brokerage · Verified Listings</div>
            <h1 className="hero-headline">Find your<br/><em>perfect</em><br/>space in India</h1>
            <p className="hero-desc">From cozy PGs to heritage villas — discover verified, brokerage-free stays across India's finest cities.</p>
            <div className="hero-cta-row">
              <button className="btn-hero-primary" onClick={()=>navigate("auth")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Browse listings
              </button>
              <button className="btn-hero-secondary" onClick={()=>navigate("register-property")}>
                List your property →
              </button>
            </div>
            <div className="hero-trust">
              {["12k+ listings","48+ cities","Zero brokerage","Verified owners"].map((t,i,a)=>(
                <span key={t} className="hero-trust-item">{t}{i<a.length-1&&<span className="hero-trust-dot"/>}</span>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-card-float hcf-main">
              <div className="hcf-img">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--stone2)" strokeWidth="1.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                <div className="hcf-tag">{filtered[0].propertyType}</div>
              </div>
              <div className="hcf-title">{filtered[0].title}</div>
              <div className="hcf-loc">📍{`${filtered[0].location.city}, ${filtered[0].state}`}</div>
              <div className="hcf-price-row">
                <span className="hcf-price">{`₹ ${filtered[0].pricing.basePrice}`}/night</span>
                <span style={{fontSize:"0.7rem",color:"var(--terracotta)"}}>★ 5.0</span>
              </div>
            </div>
            <div className="hero-card-float hcf-stat">
              <div className="hcf-stat-num">12k+</div>
              <div className="hcf-stat-label">Active listings</div>
            </div>
            <div className="hero-card-float hcf-badge">
              <div className="hcf-badge-row">
                <div className="hcf-badge-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="hcf-badge-title">Verified Owner</div>
                  <div className="hcf-badge-sub">Identity & docs confirmed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="search-section">
        <div className="search-wrap">
          <div className="search-bar">
            <div className="search-field">
              <span className="sf-label">Location</span>
              <input className="sf-input" placeholder="City, area or landmark" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <div className="search-field">
              <span className="sf-label">City</span>
              <select className="sf-select" value={city} onChange={e=>setCity(e.target.value)}>
                <option value="">All cities</option>
                {CITIES.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="search-field">
              <span className="sf-label">Type</span>
              <select className="sf-select" value={category} onChange={e=>setCategory(e.target.value)}>
                {CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <button className="search-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
            </button>
          </div>
          <div className="categories">
            {CATEGORIES.map(c=>(
              <button key={c.value} className={`cat-pill${category===c.value?" active":""}`} onClick={()=>setCategory(c.value)}>{c.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities */}
      <section className="cities-section">
        <div className="cities-inner">
          <h2 className="section-heading">Browse by city</h2>
          <p className="section-subheading">Explore verified listings in India's top destinations</p>
          <div className="cities-grid">
            {filtered.map(c=>(
              <div key={c.location.city} className="city-card" onClick={()=>setCity(c.location.city)}>
                <div className="city-icon">🚀</div>
                <div className="city-name">{c.location.city}</div>
                <div className="city-count">400 listings</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <div style={{background:"var(--warm-white)",padding:"2.5rem 4rem"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="listings-header">
            <div>
              <div className="listings-title">
                {city ? `Stays in ${city}` : "Featured stays"}
              </div>
              <div className="listings-subtitle">{filtered.length} properties found</div>
            </div>
            <div className="listings-controls">
              <select className="sort-select">
                <option>Sort: Recommended</option>
                <option>Price: Low to high</option>
                <option>Price: High to low</option>
                <option>Top rated</option>
              </select>
            </div>
          </div>
          <div className="listings-layout">
            <FiltersSidebar selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities} priceMax={priceMax} setPriceMax={setPriceMax} />
            <div style={{flex:1,minWidth:0}}>
              {filtered.length===0
                ? <div className="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <p style={{marginTop:"0.75rem"}}>No listings match your filters.</p>
                    <button className="btn-ghost" style={{marginTop:"1rem"}} onClick={()=>{setSearch("");setCity("");setCategory("all");setSelectedAmenities([]);setPriceMax(30000);}}>Clear all filters</button>
                  </div>
                : <>
                    <div className="listings-grid">
                      {filtered.map((l,i)=><PropertyCard key={l._id} listing={l} idx={i} wishlist={wishlist.includes(l._id)} toggleWishlist={toggleWishlist} onClick={()=>navigate("property-detail")} />)}
                    </div>
                    <div className="pagination">
                      <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      {filtered.map(p=><button key={p} className={`page-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>{p}</button>)}
                      <button className="page-btn" onClick={()=>setPage(p=>p+1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="hiw-section">
        <div className="hiw-inner">
          <h2 className="hiw-title">Simple as it gets</h2>
          <p className="hiw-subtitle">Find and book your space in three easy steps</p>
          <div className="hiw-steps">
            {[
              { num:"01", title:"Search your city", desc:"Browse verified listings by city, type, and budget. Filter by amenities, furnishing, and more." },
              { num:"02", title:"Visit or request a tour", desc:"Schedule a visit or send a booking request directly to the owner. No middlemen involved." },
              { num:"03", title:"Move in with confidence", desc:"Owner confirms, payment is secured, and you get your keys. It's that simple." },
            ].map(s=>(
              <div className="hiw-step" key={s.num}>
                <div className="hiw-step-num">{s.num}</div>
                <div className="hiw-step-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div>
                <div className="hiw-step-title">{s.title}</div>
                <div className="hiw-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="h-footer">
        <div className="h-footer-inner">
          <div className="h-footer-top">
            <div>
              <div className="h-footer-brand-name">Nivaas</div>
              <p className="h-footer-brand-desc">Your trusted home rental platform across India. Zero brokerage, verified listings, instant bookings.</p>
            </div>
            <div><div className="h-footer-col-title">Company</div>{["About us","How it works","Careers","Press"].map(l=><a key={l} className="h-footer-link">{l}</a>)}</div>
            <div><div className="h-footer-col-title">For owners</div>{["List your property","Owner dashboard","Pricing"].map(l=><a key={l} className="h-footer-link">{l}</a>)}</div>
            <div><div className="h-footer-col-title">Support</div>{["Help centre","Contact us","Privacy policy","Terms of service"].map(l=><a key={l} className="h-footer-link">{l}</a>)}</div>
          </div>
          <div className="h-footer-bottom">
            <span>© 2025 Nivaas. All rights reserved.</span>
            <span>Made with care in India 🇮🇳</span>
          </div>
        </div>
      </footer>
      </>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  AUTH PAGE
// ═══════════════════════════════════════════════════════════════
function EyeIcon({ open }) {
  return open
    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function pwStrength(pw) {
  if (!pw) return { score:0, label:"", color:"" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [{label:"Weak",color:"#C94040"},{label:"Fair",color:"#D4882A"},{label:"Good",color:"#4A7C6A"},{label:"Strong",color:"#3A6B3A"},{label:"Very strong",color:"#2A5B2A"}];
  return { score:s, ...map[s] };
}

function LoginForm({ navigate }) {
  const [form, setFormV] = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k,v) => { setFormV(f=>({...f,[k]:v})); if (errors[k]) setErrors(e=>({...e,[k]:""})); };
  const validate = () => {
    const e = {};
    if (!form.email) e.email="Email is required"; else if (!/\S+@\S+\.\S+/.test(form.email)) e.email="Enter a valid email";
    if (!form.password) e.password="Password is required";
    return e;
  };
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoading(false);
    navigate("dashboard");
  };
  return (
    <>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to access your dashboard.</p>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className={`form-input${errors.email?" error":""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="form-input-wrap">
          <input className={`form-input${errors.password?" error":""}`} type={showPw?"text":"password"} placeholder="Your password" value={form.password} onChange={e=>set("password",e.target.value)} style={{paddingRight:"2.5rem"}} />
          <button className="input-icon" onClick={()=>setShowPw(v=>!v)} type="button"><EyeIcon open={showPw} /></button>
        </div>
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>
      <button className="btn-primary-auth" onClick={handleSubmit} disabled={loading}>
        {loading ? <><div className="spinner"/>Signing in…</> : "Sign in"}
      </button>
    </>
  );
}

function RegisterForm() {
  const [form, setFormV] = useState({ fullName:"", username:"", email:"", phone:"", password:"", confirmPassword:"", role:"tenant", agreed:false });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k,v) => { setFormV(f=>({...f,[k]:v})); if (errors[k]) setErrors(e=>({...e,[k]:""})); };
  const strength = pwStrength(form.password);
  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName="Required";
    if (!form.username) e.username="Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email="Valid email required";
    if (!form.password || form.password.length<8) e.password="Min 8 characters";
    if (form.password!==form.confirmPassword) e.confirmPassword="Passwords don't match";
    if (!form.agreed) e.agreed="Please accept the terms";
    return e;
  };
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);
    setDone(true);
  };
  if (done) return (
    <div className="success-wrap">
      <div className="success-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
      <h2 className="auth-heading">Account created!</h2>
      <p className="auth-subheading">Welcome to Nivaas. You can now sign in and start exploring.</p>
    </div>
  );
  return (
    <>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subheading">Join Nivaas — free forever. No brokerage.</p>
      <div style={{marginBottom:"1.2rem"}}>
        <label className="form-label">I am a</label>
        <div className="role-selector">
          {[{v:"tenant",icon:"🏠",label:"Tenant",desc:"Looking for a place"},{v:"owner",icon:"🏢",label:"Owner",desc:"Listing my property"}].map(r=>(
            <label key={r.v} className={`role-option${form.role===r.v?" selected":""}`}>
              <input type="radio" value={r.v} checked={form.role===r.v} onChange={()=>set("role",r.v)} />
              <div className="role-icon">{r.icon}</div>
              <div><span className="role-title">{r.label}</span><span className="role-desc">{r.desc}</span></div>
            </label>
          ))}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className={`form-input${errors.fullName?" error":""}`} placeholder="Arjun Sharma" value={form.fullName} onChange={e=>set("fullName",e.target.value)} />
          {errors.fullName && <div className="form-error">{errors.fullName}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className={`form-input${errors.username?" error":""}`} placeholder="arjun_s" value={form.username} onChange={e=>set("username",e.target.value.toLowerCase())} />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className={`form-input${errors.email?" error":""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone <span style={{color:"var(--stone)",fontWeight:300,textTransform:"none"}}>(optional)</span></label>
          <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e=>set("phone",e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrap">
            <input className={`form-input${errors.password?" error":""}`} type={showPw?"text":"password"} placeholder="Min 8 characters" value={form.password} onChange={e=>set("password",e.target.value)} style={{paddingRight:"2.5rem"}} />
            <button className="input-icon" onClick={()=>setShowPw(v=>!v)} type="button"><EyeIcon open={showPw} /></button>
          </div>
          {form.password && <><div className="strength-bar"><div className="strength-fill" style={{width:`${strength.score*25}%`,background:strength.color}}/></div><div className="strength-text" style={{color:strength.color}}>{strength.label}</div></>}
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <div className="form-input-wrap">
            <input className={`form-input${errors.confirmPassword?" error":""}`} type={showCpw?"text":"password"} placeholder="Repeat password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)} style={{paddingRight:"2.5rem"}} />
            <button className="input-icon" onClick={()=>setShowCpw(v=>!v)} type="button"><EyeIcon open={showCpw} /></button>
          </div>
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>
      </div>
      <label className="form-check">
        <input type="checkbox" checked={form.agreed} onChange={e=>set("agreed",e.target.checked)} />
        <span className="form-check-label">I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a>
          {errors.agreed && <span style={{color:"#C94040",display:"block",marginTop:2}}>{errors.agreed}</span>}
        </span>
      </label>
      <button className="btn-primary-auth" onClick={handleSubmit} disabled={loading}>
        {loading ? <><div className="spinner"/>Creating account…</> : "Create account"}
      </button>
    </>
  );
}

function AuthPage({ navigate }) {
  const [tab, setTab] = useState("login");
  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-pattern" />
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <span className="auth-logo-name">Nivaas</span>
          </div>
        </div>
        <div className="auth-left-content">
          <h1 className="auth-left-headline">Find your<br/><em>perfect</em><br/>space</h1>
          <p className="auth-left-desc">Thousands of verified rooms, PGs, flats and houses — curated for modern living across India.</p>
        </div>
        <div className="auth-left-stats">
          {[["12k+","Listings"],["48+","Cities"],["98%","Verified"]].map(([n,l])=>(
            <div className="auth-stat" key={l}><span className="auth-stat-num">{n}</span><span className="auth-stat-label">{l}</span></div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button className={`auth-tab${tab==="login"?" active":""}`} onClick={()=>setTab("login")}>Sign in</button>
            <button className={`auth-tab${tab==="register"?" active":""}`} onClick={()=>setTab("register")}>Create account</button>
            <div className="auth-tab-indicator" style={{width:"50%",left:tab==="login"?"0%":"50%"}} />
          </div>
          <div key={tab} style={{animation:"fadeUp 0.3s ease both"}}>
            {tab==="login" ? <LoginForm navigate={navigate} /> : <RegisterForm />}
          </div>
          <div className="auth-footer">
            {tab==="login"
              ? <>Don't have an account? <a onClick={()=>setTab("register")}>Sign up free</a></>
              : <>Already have an account? <a onClick={()=>setTab("login")}>Sign in</a></>
            }
          </div>
          <div style={{textAlign:"center",marginTop:"1rem"}}>
            <button onClick={()=>navigate("home")} style={{background:"none",border:"none",color:"var(--stone)",fontSize:"0.78rem",cursor:"pointer",textDecoration:"underline"}}>← Back to listings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROPERTY DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
const LISTING_DETAIL = {
  _id:"7", title:"Heritage Haveli Suite", propertyType:"villa",
  description:"Step into a world where centuries-old architecture meets refined modern comfort. This meticulously restored haveli suite in the heart of Udaipur's old city quarter offers an unparalleled experience — hand-carved marble jaalis filtering golden afternoon light, original frescoes restored by master craftsmen, and a private rooftop terrace overlooking the shimmering Lake Pichola.",
  location:{ city:"Udaipur", state:"Rajasthan", area:"Gangaur Ghat Road, Old City" },
  pricing:{ basePrice:4500, priceType:"per_night", securityDeposit:10000, cleaningFee:500 },
  ratings:{ average:5.0, count:22 },
  amenities:["wifi","ac","parking","hot_water","power_backup","meals_included","laundry","security","garden","terrace"],
  roomInfo:{ availableRooms:1, bathrooms:2, areaSqFt:600, bedrooms:2, maxGuests:4 },
  owner:{ fullName:"Vikram Singh Rathore", initials:"VS", verified:true, joinedYear:2019, responseRate:98, responseTime:"within 1 hour", totalListings:3 },
  reviews:[
    { id:1, author:"Meera P.", initials:"MP", date:"Mar 2025", rating:5, text:"An absolutely transcendent stay. The haveli breathes history — every corner tells a story." },
    { id:2, author:"Arjun S.", initials:"AS", date:"Feb 2025", rating:5, text:"The rooftop at sunset is worth the price alone. Already planning my return." },
    { id:3, author:"Priya K.", initials:"PK", date:"Jan 2025", rating:5, text:"Staying here felt like stepping into a dream." },
    { id:4, author:"Rahul M.", initials:"RM", date:"Dec 2024", rating:4, text:"Gorgeous property with a genuinely warm host. The meals were exceptional." },
  ],
};

const AMENITY_DETAIL_LABELS = { 
  wifi:"High-speed WiFi", ac:"Air conditioning", parking:"Secure parking", hot_water:"24h hot water", power_backup:"Power backup", meals_included:"Meals included", laundry:"Laundry service", security:"24h security", garden:"Private garden", terrace:"Rooftop terrace" };

function PropertyDetailPage({ navigate }) {
  const l = LISTING_DETAIL;
  const [scrolled, setScrolled] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("2025-07-15");
  const [checkOut, setCheckOut] = useState("2025-07-18");
  const [toasts, setToasts] = useState([]);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const addToast = (msg, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4000);
  };

  const nights = Math.max(1, Math.round((new Date(checkOut)-new Date(checkIn))/(1000*60*60*24)));
  const baseTotal = l.pricing.basePrice * nights;
  const total = baseTotal + l.pricing.cleaningFee;

  const handleBook = async () => {
    setBooking(true);
    await new Promise(r=>setTimeout(r,1600));
    setBooking(false);
    setBooked(true);
    addToast("Booking request sent! 🎉");
  };

  return (
    <div className="detail-root">
      <nav className={`d-navbar${scrolled?" scrolled":""}`}>
        <div className="d-nav-left">
          <button className="back-btn" onClick={()=>navigate("home")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div className="d-brand">
            <div className="d-brand-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <span className="d-brand-name">Nivaas</span>
          </div>
        </div>
        <div className="d-nav-right">
          <button className={`icon-btn${wishlisted?" wishlisted":""}`} onClick={()=>{setWishlisted(w=>!w);addToast(wishlisted?"Removed from wishlist":"Saved to wishlist ❤️");}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>
      </nav>

      {/* Gallery */}
      <div className="gallery-wrap" style={{paddingTop:"1.5rem",marginBottom:"2rem"}}>
        <div className="gallery-grid">
          <div className="gallery-main">
            <div className="gallery-img-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span style={{fontSize:"0.75rem"}}>Main entrance</span>
            </div>
            <button className="gallery-all-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Show all photos
            </button>
          </div>
          {["Bedroom","Bathroom","Terrace"].map((label,i)=>(
            <div key={i} className="gallery-thumb">
              <div className="gallery-img-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <span style={{fontSize:"0.65rem"}}>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="property-type-pill"><span style={{width:5,height:5,borderRadius:"50%",background:"var(--terracotta)"}}/>{l.propertyType.toUpperCase()}</div>
          <h1 className="property-title">{l.title}</h1>
          <div className="property-meta-row">
            <div className="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{l.location.area}, {l.location.city}</div>
            <div className="meta-dot"/>
            <div className="rating-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--terracotta)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {l.ratings.average.toFixed(1)} · <span style={{color:"var(--stone)",fontWeight:400}}>{l.ratings.count} reviews</span>
            </div>
            <div className="meta-dot"/>
            <div className="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><strong>Verified</strong></div>
          </div>

          {/* Quick facts */}
          <div className="quick-facts">
            {[
              {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, value:l.roomInfo.bedrooms, label:"Bedrooms"},
              {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>, value:l.roomInfo.bathrooms, label:"Bathrooms"},
              {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, value:l.roomInfo.maxGuests, label:"Max guests"},
              {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, value:`${l.roomInfo.areaSqFt}`, label:"Sq. ft."},
            ].map((f,i)=>(
              <div key={i} className="fact-card">
                <div className="fact-icon">{f.icon}</div>
                <div className="fact-value">{f.value}</div>
                <div className="fact-label">{f.label}</div>
              </div>
            ))}
          </div>

          <div className="section-divider"/>

          <h2 className="sec-title">About this space</h2>
          <p className={`description-text${expanded?"":" clamped"}`}>{l.description}</p>
          <button className="read-more-btn" onClick={()=>setExpanded(e=>!e)}>{expanded?"Show less ↑":"Read more ↓"}</button>

          <div className="section-divider"/>

          <h2 className="sec-title">What's included</h2>
          <div className="amenities-grid">
            {l.amenities.map(a=>(
              <div key={a} className="amenity-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>
                {AMENITY_DETAIL_LABELS[a] || a}
              </div>
            ))}
          </div>

          <div className="section-divider"/>

          <h2 className="sec-title">Hosted by</h2>
          <div className="owner-card">
            <div className="owner-top">
              <div className="owner-avatar-lg">{l.owner.initials}</div>
              <div>
                <div style={{fontSize:"1rem",fontWeight:500,color:"var(--charcoal)"}}>{l.owner.fullName}</div>
                <div style={{fontSize:"0.75rem",color:"var(--stone)"}}>Owner since {l.owner.joinedYear}</div>
                {l.owner.verified && <div className="owner-verified">✓ Verified host</div>}
              </div>
            </div>
            <div className="owner-stats">
              {[{val:l.owner.responseRate+"%",label:"Response rate"},{val:l.owner.responseTime,label:"Response time"},{val:l.owner.totalListings,label:"Listings"}].map((s,i)=>(
                <div key={i} className="owner-stat">
                  <div className="owner-stat-val">{s.val}</div>
                  <div className="owner-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <button className="contact-owner-btn">Message owner</button>
          </div>

          <div className="section-divider"/>

          <h2 className="sec-title">Guest reviews</h2>
          <div style={{display:"flex",alignItems:"center",gap:"1.5rem",marginBottom:"1.5rem"}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"3rem",color:"var(--charcoal)",lineHeight:1}}>{l.ratings.average.toFixed(1)}</div>
            <div>
              <div style={{display:"flex",gap:3,marginBottom:4}}>{[1,2,3,4,5].map(i=><svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--terracotta)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <div style={{fontSize:"0.78rem",color:"var(--stone)"}}>{l.ratings.count} reviews</div>
            </div>
          </div>
          <div className="reviews-grid">
            {l.reviews.map(r=>(
              <div key={r.id} className="review-card">
                <div className="review-author-row">
                  <div className="review-avatar">{r.initials}</div>
                  <div>
                    <div className="review-author">{r.author}</div>
                    <div className="review-date">{r.date}</div>
                  </div>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="section-divider"/>

          <h2 className="sec-title">Location</h2>
          <p style={{fontSize:"0.85rem",color:"var(--stone)",marginBottom:"1rem"}}>{l.location.area}, {l.location.city}, {l.location.state}</p>
          <div className="map-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Map — {l.location.city}, {l.location.state}
          </div>
        </div>

        {/* Booking card */}
        <div>
          <div className="booking-card">
            {booked ? (
              <div style={{textAlign:"center",padding:"1.5rem 0"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(94,114,82,0.1)",border:"2px solid rgba(94,114,82,0.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.25rem"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.5rem",color:"var(--charcoal)",marginBottom:"0.5rem"}}>Request sent!</div>
                <p style={{fontSize:"0.82rem",color:"var(--stone)"}}>The owner will respond within {l.owner.responseTime}.</p>
                <button style={{marginTop:"1.25rem",padding:"0.6rem 1.25rem",borderRadius:9,border:"1.5px solid var(--border)",background:"transparent",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem"}} onClick={()=>setBooked(false)}>Modify dates</button>
              </div>
            ) : (
              <>
                <div className="booking-price-row">
                  <span className="booking-price">{fmt(l.pricing.basePrice)}</span>
                  <span className="booking-price-period">/ night</span>
                </div>
                <div className="booking-dates">
                  <div className="date-row">
                    <div className="date-field"><div className="date-field-label">Check in</div><input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} /></div>
                    <div className="date-field"><div className="date-field-label">Check out</div><input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} /></div>
                  </div>
                </div>
                <div className="guests-field">
                  <div><div className="guests-field-label">Guests</div><div style={{fontSize:"0.875rem",color:"var(--charcoal)"}}>{guests} guest{guests>1?"s":""}</div></div>
                  <div className="guests-counter">
                    <button className="counter-btn" disabled={guests<=1} onClick={()=>setGuests(g=>g-1)}>−</button>
                    <span className="counter-val">{guests}</span>
                    <button className="counter-btn" disabled={guests>=l.roomInfo.maxGuests} onClick={()=>setGuests(g=>g+1)}>+</button>
                  </div>
                </div>
                <div className="price-breakdown">
                  <div className="breakdown-row"><span>{fmt(l.pricing.basePrice)} × {nights} night{nights>1?"s":""}</span><span className="breakdown-val">{fmt(baseTotal)}</span></div>
                  <div className="breakdown-row"><span>Cleaning fee</span><span className="breakdown-val">{fmt(l.pricing.cleaningFee)}</span></div>
                  <div className="breakdown-row total"><span>Total</span><span>{fmt(total)}</span></div>
                </div>
                <button className="book-btn" onClick={handleBook} disabled={booking}>
                  {booking ? <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Processing…</> : "Request to book"}
                </button>
                <p className="book-note">You won't be charged yet</p>
                <div style={{marginTop:"1rem",padding:"0.75rem",background:"var(--cream)",borderRadius:10,fontSize:"0.75rem",color:"var(--stone)"}}>
                  Security deposit of <strong style={{color:"var(--charcoal)"}}>{fmt(l.pricing.securityDeposit)}</strong> collected at check-in. Fully refundable.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="detail-toast-wrap">
        {toasts.map(t=>(
          <div key={t.id} className={`detail-toast ${t.type}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  OWNER DASHBOARD
// ═══════════════════════════════════════════════════════════════
function StatusPill({ status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}

function StatsBar({ listings, requests }) {
  const confirmed = requests.filter(r=>r.status==="confirmed").length;
  const revenue   = requests.filter(r=>r.status==="completed").reduce((s,r)=>s+r.priceBreakdown.totalAmount,0);
  const pending   = requests.filter(r=>r.status==="pending").length;
  const stats = [
    { label:"Total listings",   value:listings.length, change:"+2 this month", up:true },
    { label:"Pending requests", value:pending,          change:`${confirmed} confirmed`, up:false },
    { label:"Revenue (all time)",value:fmt(revenue),   change:"Completed bookings", up:true },
    { label:"Avg. rating",      value:"4.7",            change:"Across all listings", up:true },
  ];
  return (
    <div className="stats-grid">
      {stats.map((s,i)=>(
        <div className="stat-card" key={i} style={{animationDelay:`${i*0.05}s`}}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className={`stat-change ${s.up?"up":"neutral"}`}>
            {s.up && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>}
            {s.change}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsSection({ listings }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? listings : listings.filter(l=>l.propertyType===filter);
  return (
    <div className="d-section">
      <div className="section-header">
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="section-title">My listings</span>
          <span className="section-count">{listings.length}</span>
        </div>
        <div className="filter-tabs">
          {["all","flat","pg","room","hostel","villa"].map(f=>(
            <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <div className="d-empty-state"><p>No listings for this filter.</p></div>
        : filtered.map(l=>(
          <div key={l._id} className="listing-item">
            <div className="listing-thumb"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
            <div className="listing-info">
              <div className="listing-title">{l.title}</div>
              <div className="listing-meta"><span>{l.location.city}, {l.location.state}</span><span>{l.propertyType.toUpperCase()}</span><span>{l.roomInfo.availableRooms} room(s)</span></div>
              {l.ratings.count>0
                ? <div className="listing-rating"><svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>{l.ratings.average} <span style={{color:"var(--d-text3)"}}>({l.ratings.count})</span></div>
                : <div style={{fontSize:"0.7rem",color:"var(--d-text3)",marginTop:2}}>No reviews yet</div>
              }
            </div>
            <div className="listing-price">{fmt(l.pricing.basePrice)}<span style={{fontFamily:"DM Sans",fontSize:"0.7rem",color:"var(--d-text2)"}}> /{l.pricing.priceType.replace("per_","")}</span></div>
            <div className="listing-actions"><button className="btn-sm">Edit</button><button className="btn-sm">View</button></div>
          </div>
        ))
      }
    </div>
  );
}

function RequestsSection({ requests, setRequests, addToast }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? requests : requests.filter(r=>r.status===filter);
  const handle = (id, action) => {
    setRequests(prev=>prev.map(r=>r._id===id?{...r,status:action}:r));
    addToast(action==="confirmed"?"Booking accepted!":"Booking rejected.", action==="confirmed"?"success":"error");
  };
  return (
    <div className="d-section">
      <div className="section-header">
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="section-title">Booking requests</span>
          <span className="section-count">{requests.length}</span>
        </div>
        <div className="filter-tabs">
          {["all","pending","confirmed","rejected","completed"].map(f=>(
            <button key={f} className={`filter-tab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              {f==="pending"&&requests.filter(r=>r.status==="pending").length>0&&<span style={{marginLeft:4,background:"var(--d-amber)",color:"#fff",borderRadius:20,fontSize:"0.6rem",padding:"1px 5px"}}>{requests.filter(r=>r.status==="pending").length}</span>}
            </button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ? <div className="d-empty-state"><p>No requests here.</p></div>
        : <div className="requests-list">
            {filtered.map((r,i)=>(
              <div key={r._id} className="request-card" style={{animationDelay:`${i*0.05}s`}}>
                <div className="req-avatar">{initials(r.tenant.fullName)}</div>
                <div className="req-info">
                  <div className="req-tenant">{r.tenant.fullName}</div>
                  <div className="req-property">{r.property.title}</div>
                  <div className="req-meta">
                    <span className="req-meta-item">📅 {fmtDate(r.checkIn)} → {fmtDate(r.checkOut)}</span>
                    <span className="req-meta-item">👤 {r.guests.adults} guest{r.guests.adults>1?"s":""}</span>
                  </div>
                </div>
                <div className="req-divider"/>
                <div style={{textAlign:"right"}}>
                  <div className="req-amount">{fmt(r.priceBreakdown.totalAmount)}</div>
                  <div className="req-amount-label">total</div>
                  <div style={{marginTop:6}}><StatusPill status={r.status}/></div>
                </div>
                {r.status==="pending" && (
                  <><div className="req-divider"/>
                  <div className="req-actions">
                    <button className="btn-accept" onClick={()=>handle(r._id,"confirmed")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Accept</button>
                    <button className="btn-reject" onClick={()=>handle(r._id,"rejected")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Reject</button>
                  </div></>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

function EarningsSection() {
  const monthly = [
    {month:"Feb",amount:21000},{month:"Mar",amount:34500},{month:"Apr",amount:28000},
    {month:"May",amount:42000},{month:"Jun",amount:37500},{month:"Jul",amount:55000},
  ];
  const max = Math.max(...monthly.map(m=>m.amount));
  return (
    <div>
      <div className="stats-grid">
        {[{label:"This month",value:fmt(55000),change:"+46% vs last",up:true},{label:"Last month",value:fmt(37500),change:"Completed",up:false},{label:"All time",value:fmt(218000),change:"Since 2022",up:true},{label:"Avg/booking",value:fmt(11250),change:"Healthy margin",up:true}].map((s,i)=>(
          <div className="stat-card" key={i} style={{animationDelay:`${i*0.05}s`}}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up?"up":"neutral"}`}>{s.change}</div>
          </div>
        ))}
      </div>
      <div className="d-section">
        <div className="section-header"><span className="section-title">Revenue — last 6 months</span></div>
        <div style={{padding:"1.5rem",display:"flex",alignItems:"flex-end",gap:"1rem",height:200}}>
          {monthly.map(m=>(
            <div key={m.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{fontSize:"0.7rem",color:"var(--d-text3)"}}>{fmt(m.amount).replace("₹","")}</div>
              <div style={{width:"100%",background:`rgba(200,169,110,${0.3+(m.amount/max)*0.7})`,borderRadius:"6px 6px 0 0",height:`${(m.amount/max)*120}px`,transition:"height 0.5s ease"}}/>
              <div style={{fontSize:"0.72rem",color:"var(--d-text2)"}}>{m.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashSettings() {
  return (
    <div className="d-section">
      <div className="section-header"><span className="section-title">Account Settings</span></div>
      <div style={{padding:"1.5rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",maxWidth:640}}>
        {[["Full name","Rajesh Sharma"],["Email","rajesh@example.com"],["Phone","+91 98765 43210"],["City","Jaipur, Rajasthan"]].map(([label,val])=>(
          <div key={label}>
            <div style={{fontSize:"0.7rem",color:"var(--d-text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{label}</div>
            <input defaultValue={val} style={{width:"100%",padding:"0.6rem 0.9rem",background:"var(--d-bg3)",border:"1px solid var(--d-border)",borderRadius:8,color:"var(--d-text)",fontFamily:"DM Sans,sans-serif",fontSize:"0.875rem",outline:"none"}} />
          </div>
        ))}
        <div style={{gridColumn:"1/-1",paddingTop:"0.5rem"}}>
          <button style={{padding:"0.6rem 1.25rem",borderRadius:8,background:"var(--gold)",border:"none",color:"#1a1500",fontFamily:"DM Sans,sans-serif",fontWeight:500,cursor:"pointer"}}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function OwnerDashboard({ navigate }) {
  const [activeNav, setActiveNav] = useState("overview");
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [toasts, setToasts] = useState([]);
  const pendingCount = requests.filter(r=>r.status==="pending").length;
  const addToast = (msg, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  };
  const pageTitles = { overview:"Overview", listings:"My Listings", requests:"Booking Requests", earnings:"Earnings", billing:"Billing", notifications:"Notifications", settings:"Settings" };

  const NAV_ITEMS = [
    { id:"overview",  label:"Overview",         icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id:"listings",  label:"My Listings",       icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> },
    { id:"requests",  label:"Booking Requests",  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, badge: pendingCount },
    { id:"earnings",  label:"Earnings",           icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
    { id:"billing",       label:"Billing",            icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id:"notifications", label:"Notifications",      icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, badge: 3 },
    { id:"settings",      label:"Settings",           icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  ];

  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1500" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <span className="brand-name">Nivaas</span>
        </div>
        <div className="sidebar-owner">
          <div className="owner-avatar">RS</div>
          <div className="owner-name">Rajesh Sharma</div>
          <div className="owner-badge">✦ Verified Owner</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label-dash">Main</div>
          {NAV_ITEMS.slice(0,4).map(item=>(
            <button key={item.id} className={`d-nav-item${activeNav===item.id?" active":""}`} onClick={()=>setActiveNav(item.id)}>
              {item.icon}{item.label}
              {item.badge>0 && <span className="nav-badge-dash gold">{item.badge}</span>}
            </button>
          ))}
          <div className="nav-label-dash">Account</div>
          {NAV_ITEMS.slice(4).map(item=>(
            <button key={item.id} className={`d-nav-item${activeNav===item.id?" active":""}`} onClick={()=>setActiveNav(item.id)}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="d-nav-item" style={{color:"#C06060"}} onClick={()=>navigate("home")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Back to home
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <span className="topbar-title">{pageTitles[activeNav]}</span>
          <div className="topbar-actions">
            <button className="btn-icon-dash"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></button>
            <button className="btn-primary-dash" onClick={()=>navigate("register-property")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New listing
            </button>
          </div>
        </div>
        <div className="dash-content">
          {(activeNav==="overview"||activeNav==="listings"||activeNav==="requests") && <StatsBar listings={LISTINGS} requests={requests} />}
          {(activeNav==="overview"||activeNav==="listings") && <ListingsSection listings={LISTINGS} />}
          {(activeNav==="overview"||activeNav==="requests") && <RequestsSection requests={requests} setRequests={setRequests} addToast={addToast} />}
          {activeNav==="earnings" && <EarningsSection />}
          {activeNav==="billing" && <BillingPage />}
          {activeNav==="notifications" && <NotificationsPage />}
          {activeNav==="settings" && <DashSettings />}
        </div>
      </div>

      <div className="toast-wrap">
        {toasts.map(t=>(
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type==="success"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BILLING PAGE (enhanced)
// ═══════════════════════════════════════════════════════════════
const PAYMENT_METHODS = [
  { id:"pm1", type:"UPI",  name:"PhonePe UPI",    meta:"rajesh@okicici",    primary:true,  icon:"💳" },
  { id:"pm2", type:"Bank", name:"HDFC Bank",       meta:"••••  4521",        primary:false, icon:"🏦" },
  { id:"pm3", type:"Card", name:"ICICI Visa",      meta:"•••• •••• •••• 9832",primary:false,icon:"💎" },
];

const MONTHLY_REVENUE = [
  {month:"Jan",amount:18000},{month:"Feb",amount:21000},{month:"Mar",amount:34500},
  {month:"Apr",amount:28000},{month:"May",amount:42000},{month:"Jun",amount:37500},
  {month:"Jul",amount:55000},{month:"Aug",amount:48000},
];

function ReceiptModal({ invoice, onClose }) {
  const gst = Math.round(invoice.amount * 0.09);
  return (
    <div className="new-invoice-modal" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box" style={{width:440}}>
        <div className="receipt-header">
          <div>
            <div className="receipt-logo">Nivaas</div>
            <div className="receipt-id">Tax Invoice</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.1rem",color:"var(--gold)"}}>{invoice.id}</div>
            <div style={{fontSize:"0.7rem",color:"var(--d-text3)"}}>{invoice.dueDate || "—"}</div>
          </div>
        </div>

        <div className="receipt-party-row">
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

        <div className="receipt-line"><span>Rent — {invoice.period}</span><span>{fmt(invoice.amount)}</span></div>
        <div className="receipt-line"><span>CGST (9%)</span><span>{fmt(gst)}</span></div>
        <div className="receipt-line"><span>SGST (9%)</span><span>{fmt(gst)}</span></div>
        <div className="receipt-line" style={{border:"none",paddingBottom:0}}><span style={{color:"var(--d-text3)"}}>Subtotal</span><span style={{color:"var(--d-text)"}}>{fmt(invoice.amount + gst*2)}</span></div>
        <div className="receipt-total-line">
          <span>Total Due</span>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.3rem",color:"var(--gold)"}}>{fmt(invoice.amount + gst*2)}</span>
        </div>

        <div>
          <span className={`receipt-status-badge ${invoice.status}`}>
            {invoice.status === "paid" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>

        <button className="receipt-print-btn" onClick={()=>window.print()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Download / Print receipt
        </button>
        <div className="receipt-footer">Nivaas · Zero brokerage rental platform · support@nivaas.in</div>
        <div className="modal-actions" style={{marginTop:"1rem"}}>
          <button className="modal-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function BillingPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newInv, setNewInv] = useState({ tenant:"", property:"", amount:"", dueDate:"", period:"" });
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  };

  const filtered = invoices.filter(inv=>{
    const matchSearch = !search || inv.tenant.toLowerCase().includes(search.toLowerCase()) || inv.property.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus==="all" || inv.status===filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid    = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const totalPending = invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);
  const totalOverdue = invoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);
  const maxBar = Math.max(...MONTHLY_REVENUE.map(m=>m.amount));

  const handleCreate = () => {
    if (!newInv.tenant||!newInv.property||!newInv.amount) return;
    const id = `INV-00${invoices.length+1}`;
    setInvoices(prev=>[{id, ...newInv, amount:+newInv.amount, status:"pending"}, ...prev]);
    setShowModal(false);
    setNewInv({tenant:"",property:"",amount:"",dueDate:"",period:""});
    addToast("Invoice created successfully!");
  };

  const markPaid = (id, e) => {
    e && e.stopPropagation();
    setInvoices(prev=>prev.map(i=>i.id===id?{...i,status:"paid"}:i));
    addToast("Invoice marked as paid!");
  };

  const sendReminder = (inv, e) => {
    e && e.stopPropagation();
    addToast(`Reminder sent to ${inv.tenant}!`);
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="billing-summary">
        {[
          {label:"Total collected",  value:fmt(totalPaid),    sub:`${invoices.filter(i=>i.status==="paid").length} paid invoices`,     color:"#6DB87A", icon:"✓", trend:"+12%", up:true},
          {label:"Pending",          value:fmt(totalPending), sub:`${invoices.filter(i=>i.status==="pending").length} awaiting payment`, color:"#C8A040", icon:"⏳", trend:"Due soon", up:null},
          {label:"Overdue",          value:fmt(totalOverdue), sub:`${invoices.filter(i=>i.status==="overdue").length} overdue invoices`, color:"#C06060", icon:"!", trend:"Action needed", up:false},
          {label:"Total invoices",   value:invoices.length,   sub:"All time",                                                           color:"var(--d-text2)", icon:"📄", trend:"All properties", up:null},
        ].map((s,i)=>(
          <div key={i} className="billing-sum-card" style={{animationDelay:`${i*0.06}s`}}>
            <div className="billing-sum-label">
              <span>{s.icon}</span>{s.label}
            </div>
            <div className="billing-sum-value" style={{color:s.color}}>{s.value}</div>
            <div className="billing-sum-sub">
              {s.up!==null && (
                <span className={`billing-sum-trend ${s.up?"up":"down"}`}>
                  {s.up ? "▲" : "▼"} {s.trend}
                </span>
              )}
              {s.up===null && s.sub}
            </div>
            {s.up!==null && <div style={{fontSize:"0.68rem",color:"var(--d-text3)",marginTop:2}}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Chart + Payment Methods */}
      <div className="billing-two-col">
        <div className="billing-chart-card">
          <div className="billing-chart-title">Monthly Revenue</div>
          <div className="billing-chart-sub">Rent collected per month (last 8 months)</div>
          <div className="billing-bars">
            {MONTHLY_REVENUE.map(m=>(
              <div key={m.month} className="billing-bar-col">
                <div className="billing-bar-amt">{(m.amount/1000).toFixed(0)}k</div>
                <div
                  className="billing-bar"
                  style={{
                    height:`${(m.amount/maxBar)*100}px`,
                    background:`linear-gradient(to top, rgba(200,169,110,0.9), rgba(200,169,110,0.4))`,
                    border:"1px solid rgba(200,169,110,0.2)"
                  }}
                  title={`${m.month}: ${fmt(m.amount)}`}
                />
                <div className="billing-bar-label">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="payment-methods-card">
          <div className="pm-title">
            <span>Payment Methods</span>
            <button className="pm-add-btn">+ Add</button>
          </div>
          {PAYMENT_METHODS.map(pm=>(
            <div key={pm.id} className={`pm-item${pm.primary?" primary-pm":""}`}>
              <div className="pm-icon">{pm.icon}</div>
              <div className="pm-details">
                <div className="pm-name">{pm.name}</div>
                <div className="pm-meta">{pm.meta}</div>
              </div>
              {pm.primary && <span className="pm-badge">Default</span>}
            </div>
          ))}
          <div style={{marginTop:"1rem",padding:"0.85rem",background:"var(--d-bg3)",borderRadius:9,border:"1px dashed var(--d-border)",textAlign:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--d-border)"}>
            <div style={{fontSize:"0.78rem",color:"var(--d-text3)"}}>+ Add bank account or card</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="billing-controls">
        <div style={{display:"flex",gap:"0.75rem",alignItems:"center",flex:1}}>
          <div className="billing-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--d-text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search invoices…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs" style={{background:"var(--d-bg2)",border:"1px solid var(--d-border)",borderRadius:8,padding:"2px"}}>
            {["all","paid","pending","overdue"].map(s=>(
              <button key={s} className={`filter-tab${filterStatus===s?" active":""}`} onClick={()=>setFilterStatus(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        </div>
        <button className="btn-primary-dash" onClick={()=>setShowModal(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New invoice
        </button>
      </div>

      {/* Table */}
      <div className="billing-table-wrap">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Invoice</th><th>Tenant</th><th>Property</th><th>Period</th><th>Due date</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={8} style={{textAlign:"center",color:"var(--d-text3)",padding:"2.5rem"}}>No invoices found.</td></tr>
              : filtered.map(inv=>(
                <tr key={inv.id} onClick={()=>setSelectedInvoice(inv)}>
                  <td><span className="invoice-id">{inv.id}</span></td>
                  <td style={{color:"var(--d-text)",fontWeight:500}}>{inv.tenant}</td>
                  <td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.property}</td>
                  <td>{inv.period}</td>
                  <td>{inv.dueDate || "—"}</td>
                  <td><span className="invoice-amount">{fmt(inv.amount)}</span></td>
                  <td><StatusPill status={inv.status}/></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:6}}>
                      {inv.status!=="paid" && <button className="bill-action-btn send" onClick={(e)=>markPaid(inv.id,e)}>Mark paid</button>}
                      {inv.status!=="paid" && <button className="bill-action-btn send" onClick={(e)=>sendReminder(inv,e)}>Remind</button>}
                      <button className="bill-action-btn" onClick={(e)=>{e.stopPropagation();setSelectedInvoice(inv);}}>Receipt</button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div className="new-invoice-modal" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">Create invoice</div>
            <div className="modal-sub">Generate a new invoice for a tenant</div>
            <div className="modal-row">
              <div className="modal-form-group">
                <label className="modal-label">Tenant name</label>
                <input className="modal-input" placeholder="Priya Sharma" value={newInv.tenant} onChange={e=>setNewInv(v=>({...v,tenant:e.target.value}))} />
              </div>
              <div className="modal-form-group">
                <label className="modal-label">Amount (₹)</label>
                <input className="modal-input" type="number" placeholder="12000" value={newInv.amount} onChange={e=>setNewInv(v=>({...v,amount:e.target.value}))} />
              </div>
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Property</label>
              <select className="modal-input" value={newInv.property} onChange={e=>setNewInv(v=>({...v,property:e.target.value}))}>
                <option value="">Select property</option>
                {LISTINGS.slice(0,3).map(l=><option key={l._id} value={l.title}>{l.title}</option>)}
              </select>
            </div>
            <div className="modal-row">
              <div className="modal-form-group">
                <label className="modal-label">Period</label>
                <input className="modal-input" placeholder="Aug 2025" value={newInv.period} onChange={e=>setNewInv(v=>({...v,period:e.target.value}))} />
              </div>
              <div className="modal-form-group">
                <label className="modal-label">Due date</label>
                <input className="modal-input" type="date" value={newInv.dueDate} onChange={e=>setNewInv(v=>({...v,dueDate:e.target.value}))} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={handleCreate}>Create invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedInvoice && <ReceiptModal invoice={selectedInvoice} onClose={()=>setSelectedInvoice(null)} />}

      <div className="toast-wrap">
        {toasts.map(t=>(
          <div key={t.id} className={`toast ${t.type}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════════
const MOCK_NOTIFICATIONS = [
  { id:"n1",  type:"booking",  title:"New booking request",      desc:"Priya Sharma requested Sunlit Studio for Aug 1–31",              time:"2m ago",  unread:true,  tag:"Booking" },
  { id:"n2",  type:"payment",  title:"Payment received",          desc:"₹13,500 received from Rahul Mehta for Heritage Haveli Suite",   time:"1h ago",  unread:true,  tag:"Payment" },
  { id:"n3",  type:"alert",    title:"Overdue invoice",           desc:"INV-003 for Rahul Mehta is 5 days overdue — send a reminder",   time:"3h ago",  unread:true,  tag:"Invoice" },
  { id:"n4",  type:"review",   title:"New review received",       desc:"Ananya K. left a 5★ review for Sunlit Studio in Malviya Nagar", time:"5h ago",  unread:false, tag:"Review" },
  { id:"n5",  type:"system",   title:"Property verified",         desc:"Heritage Haveli Suite has been verified by the Nivaas team",    time:"1d ago",  unread:false, tag:"System" },
  { id:"n6",  type:"booking",  title:"Booking confirmed",         desc:"Your booking for Sea-facing Room, Goa was confirmed",           time:"1d ago",  unread:false, tag:"Booking" },
  { id:"n7",  type:"payment",  title:"Rent reminder sent",        desc:"Auto-reminder sent to Karan Singh for Heritage Haveli Suite",   time:"2d ago",  unread:false, tag:"Payment" },
  { id:"n8",  type:"system",   title:"Profile updated",           desc:"Your contact details were updated successfully",                time:"3d ago",  unread:false, tag:"System" },
  { id:"n9",  type:"alert",    title:"Listing expiring soon",     desc:"Cozy PG Near IIT Delhi listing expires in 7 days — renew now", time:"4d ago",  unread:false, tag:"Alert" },
  { id:"n10", type:"review",   title:"Tenant left a comment",     desc:"Karan Singh asked about parking availability for Jul booking",  time:"5d ago",  unread:false, tag:"Message" },
];

const NOTIF_ICONS = {
  booking: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  payment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  alert:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  system:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  review:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter(n=>n.unread).length;
  const filtered = activeFilter==="all" ? notifications : activeFilter==="unread" ? notifications.filter(n=>n.unread) : notifications.filter(n=>n.type===activeFilter);

  const markAllRead = () => setNotifications(prev=>prev.map(n=>({...n,unread:false})));
  const markRead    = id => setNotifications(prev=>prev.map(n=>n.id===id?{...n,unread:false}:n));
  const dismiss     = id => setNotifications(prev=>prev.filter(n=>n.id!==id));

  return (
    <div>
      {/* Header row */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
        <div>
          <div style={{fontSize:"0.82rem",color:"var(--d-text3)"}}>
            {unreadCount>0 ? `${unreadCount} unread notification${unreadCount>1?"s":""}` : "All caught up!"}
          </div>
        </div>
        {unreadCount>0 && <button className="notif-mark-all" onClick={markAllRead}>Mark all as read</button>}
      </div>

      {/* Filter bar */}
      <div className="notif-filter-bar">
        {["all","unread","booking","payment","alert","review","system"].map(f=>(
          <button key={f} className={`notif-filter-btn${activeFilter===f?" active":""}`} onClick={()=>setActiveFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
            {f==="unread"&&unreadCount>0&&<span style={{marginLeft:5,background:"var(--gold)",color:"#1a1500",borderRadius:20,fontSize:"0.62rem",padding:"1px 5px",fontWeight:600}}>{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="d-section" style={{padding:0}}>
        {filtered.length===0
          ? <div className="notif-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--d-text3)" strokeWidth="1.2" style={{margin:"0 auto 0.75rem",display:"block"}}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              No notifications here.
            </div>
          : <div className="notif-list">
              {filtered.map((n,i)=>(
                <div key={n.id} className={`notif-item${n.unread?" unread":""}`} style={{animationDelay:`${i*0.04}s`,animation:"fadeUp 0.3s ease both"}} onClick={()=>markRead(n.id)}>
                  {n.unread && <div className="notif-dot"/>}
                  <div className={`notif-icon ${n.type}`}>{NOTIF_ICONS[n.type]}</div>
                  <div className="notif-body">
                    <div className="notif-title-row">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-time">{n.time}</span>
                    </div>
                    <div className="notif-desc">{n.desc}</div>
                    <span className="notif-tag">{n.tag}</span>
                  </div>
                  <button
                    style={{marginLeft:8,width:24,height:24,borderRadius:"50%",background:"transparent",border:"1px solid var(--d-border)",color:"var(--d-text3)",fontSize:"0.8rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}
                    onClick={e=>{e.stopPropagation();dismiss(n.id);}}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--d-bg3)";e.currentTarget.style.color="var(--d-text)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--d-text3)";}}
                    title="Dismiss"
                  >×</button>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}


const AMENITY_OPTIONS = [
  {value:"wifi",icon:"📶",label:"WiFi"},{value:"ac",icon:"❄️",label:"AC"},{value:"parking",icon:"🚗",label:"Parking"},
  {value:"gym",icon:"💪",label:"Gym"},{value:"meals_included",icon:"🍽️",label:"Meals"},{value:"laundry",icon:"👕",label:"Laundry"},
  {value:"hot_water",icon:"🚿",label:"Hot water"},{value:"power_backup",icon:"⚡",label:"Power backup"},
  {value:"security",icon:"🔒",label:"Security"},{value:"terrace",icon:"🏙️",label:"Terrace"},
  {value:"garden",icon:"🌿",label:"Garden"},{value:"tv",icon:"📺",label:"TV"},
];

function PropertyRegisterPage({ navigate }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    type:"flat", title:"", desc:"", city:"", state:"", area:"", pincode:"",
    bedrooms:"1", bathrooms:"1", sqft:"", maxGuests:"2", floors:"",
    price:"", priceType:"per_month", deposit:"", amenities:[],
    contactName:"", contactPhone:"", contactEmail:"",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); if (errors[k]) setErrors(e=>({...e,[k]:""})); };
  const toggleAmenity = v => setForm(f=>({...f,amenities:f.amenities.includes(v)?f.amenities.filter(x=>x!==v):[...f.amenities,v]}));

  const steps = ["Property type","Details","Pricing","Photos","Publish"];

  const validateStep = () => {
    const e = {};
    if (step===1) {
      if (!form.title) e.title="Property title is required";
      if (!form.city) e.city="City is required";
      if (!form.area) e.area="Area/locality is required";
    }
    if (step===2) {
      if (!form.price) e.price="Price is required";
    }
    if (step===4) {
      if (!form.contactName) e.contactName="Contact name is required";
      if (!form.contactPhone) e.contactPhone="Phone is required";
      if (!form.contactEmail) e.contactEmail="Email is required";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step===steps.length-1) {
      setLoading(true);
      await new Promise(r=>setTimeout(r,1800));
      setLoading(false);
      setDone(true);
    } else {
      setStep(s=>s+1);
    }
  };

  if (done) return (
    <div className="reg-root">
      <nav className="reg-navbar">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"var(--charcoal)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.4rem",fontWeight:500,color:"var(--charcoal)"}}>Nivaas</span>
        </div>
      </nav>
      <div className="reg-body">
        <div className="reg-success">
          <div className="reg-success-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h1 className="reg-success-title">Property listed!</h1>
          <p className="reg-success-text">Your property <strong>"{form.title || "Your listing"}"</strong> has been submitted for review. Our team will verify and publish it within 24 hours.</p>
          <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button className="reg-btn-next" onClick={()=>navigate("dashboard")}>Go to dashboard →</button>
            <button className="reg-btn-back" onClick={()=>{setDone(false);setStep(0);setForm({type:"flat",title:"",desc:"",city:"",state:"",area:"",pincode:"",bedrooms:"1",bathrooms:"1",sqft:"",maxGuests:"2",floors:"",price:"",priceType:"per_month",deposit:"",amenities:[],contactName:"",contactPhone:"",contactEmail:""});}}>List another property</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reg-root">
      <nav className="reg-navbar">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="back-btn" style={{fontFamily:"DM Sans,sans-serif"}} onClick={()=>navigate("home")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div style={{width:30,height:30,borderRadius:8,background:"var(--charcoal)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.4rem",fontWeight:500,color:"var(--charcoal)"}}>Nivaas</span>
        </div>
        <div style={{fontSize:"0.78rem",color:"var(--stone)"}}>Step {step+1} of {steps.length}</div>
      </nav>

      <div className="reg-body">
        <div className="reg-header">
          <div className="reg-eyebrow"><span/>List your property</div>
          <h1 className="reg-title">Share your <em>space</em><br/>with India</h1>
          <p className="reg-desc">Zero brokerage. Instant bookings. Full control. Join 3,000+ owners on Nivaas.</p>
        </div>

        {/* Step progress */}
        <div className="reg-steps">
          {steps.map((s,i)=>(
            <div key={i} className={`reg-step-item${i===step?" active":i<step?" done":""}`} onClick={()=>i<step&&setStep(i)}>
              <div className="reg-step-num">{i<step?"✓":(i+1)}</div>
              <span style={{fontSize:"0.75rem"}}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Type */}
        {step===0 && (
          <div className="reg-form-card">
            <div className="reg-form-title">What type of property are you listing?</div>
            <div className="reg-form-sub">Choose the option that best describes your space</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem"}}>
              {[{v:"flat",icon:"🏢",label:"Flat / Apartment",desc:"A self-contained unit"},
                {v:"room",icon:"🛏️",label:"Single room",desc:"A private room"},
                {v:"pg",icon:"🏠",label:"PG / Hostel",desc:"Paying guest accommodation"},
                {v:"house",icon:"🏡",label:"Independent house",desc:"Full house or bungalow"},
                {v:"villa",icon:"🏰",label:"Villa / Farmhouse",desc:"Premium or luxury property"},
                {v:"commercial",icon:"🏪",label:"Commercial",desc:"Office or shop space"},
              ].map(t=>(
                <div key={t.v} onClick={()=>set("type",t.v)} style={{border:`1.5px solid ${form.type===t.v?"var(--terracotta)":"var(--border)"}`,borderRadius:14,padding:"1.25rem",cursor:"pointer",background:form.type===t.v?"rgba(192,90,40,0.04)":"var(--warm-white)",transition:"all 0.2s"}}>
                  <div style={{fontSize:"1.75rem",marginBottom:"0.6rem"}}>{t.icon}</div>
                  <div style={{fontSize:"0.9rem",fontWeight:500,color:"var(--charcoal)",marginBottom:4}}>{t.label}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--stone)"}}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Details */}
        {step===1 && (
          <div className="reg-form-card">
            <div className="reg-form-title">Property details</div>
            <div className="reg-form-sub">Tell tenants about your space</div>
            <div className="reg-form-group" style={{marginBottom:"1.25rem"}}>
              <label className="reg-label">Property title *</label>
              <input className={`reg-input${errors.title?" error":""}`} placeholder="e.g. Sunlit 2BHK near Metro, Indiranagar" value={form.title} onChange={e=>set("title",e.target.value)} />
              {errors.title && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.title}</div>}
            </div>
            <div className="reg-form-group" style={{marginBottom:"1.25rem"}}>
              <label className="reg-label">Description</label>
              <textarea className="reg-input reg-textarea" placeholder="Describe your space — highlight unique features, neighbourhood, nearby landmarks…" value={form.desc} onChange={e=>set("desc",e.target.value)} />
            </div>
            <div className="reg-grid" style={{marginBottom:"1.25rem"}}>
              <div className="reg-form-group">
                <label className="reg-label">City *</label>
                <select className="reg-input reg-select" value={form.city} onChange={e=>set("city",e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
                  <option value="Other">Other</option>
                </select>
                {errors.city && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.city}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-label">State</label>
                <input className="reg-input" placeholder="Rajasthan" value={form.state} onChange={e=>set("state",e.target.value)} />
              </div>
            </div>
            <div className="reg-grid" style={{marginBottom:"1.25rem"}}>
              <div className="reg-form-group">
                <label className="reg-label">Area / locality *</label>
                <input className={`reg-input${errors.area?" error":""}`} placeholder="Malviya Nagar" value={form.area} onChange={e=>set("area",e.target.value)} />
                {errors.area && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.area}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-label">Pincode</label>
                <input className="reg-input" placeholder="302001" value={form.pincode} onChange={e=>set("pincode",e.target.value)} maxLength={6} />
              </div>
            </div>
            <div className="reg-grid-3">
              {[["bedrooms","Bedrooms","1",["1","2","3","4","5+"]],["bathrooms","Bathrooms","1",["1","2","3","4+"]],["maxGuests","Max guests","2",["1","2","3","4","5","6+"]]].map(([k,label,placeholder,opts])=>(
                <div key={k} className="reg-form-group">
                  <label className="reg-label">{label}</label>
                  <select className="reg-input reg-select" value={form[k]} onChange={e=>set(k,e.target.value)}>
                    {opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="reg-grid" style={{marginTop:"1.25rem"}}>
              <div className="reg-form-group">
                <label className="reg-label">Area (sq. ft.)</label>
                <input className="reg-input" placeholder="600" type="number" value={form.sqft} onChange={e=>set("sqft",e.target.value)} />
              </div>
              <div className="reg-form-group">
                <label className="reg-label">Floor (optional)</label>
                <input className="reg-input" placeholder="3rd floor" value={form.floors} onChange={e=>set("floors",e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Pricing */}
        {step===2 && (
          <div className="reg-form-card">
            <div className="reg-form-title">Pricing & availability</div>
            <div className="reg-form-sub">Set a fair price and collect a security deposit</div>
            <div className="reg-grid" style={{marginBottom:"1.25rem"}}>
              <div className="reg-form-group">
                <label className="reg-label">Base price (₹) *</label>
                <input className={`reg-input${errors.price?" error":""}`} type="number" placeholder="12000" value={form.price} onChange={e=>set("price",e.target.value)} />
                {errors.price && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.price}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-label">Price type</label>
                <select className="reg-input reg-select" value={form.priceType} onChange={e=>set("priceType",e.target.value)}>
                  <option value="per_month">Per month</option>
                  <option value="per_night">Per night</option>
                  <option value="per_day">Per day</option>
                </select>
              </div>
            </div>
            <div className="reg-form-group" style={{marginBottom:"1.75rem"}}>
              <label className="reg-label">Security deposit (₹)</label>
              <input className="reg-input" type="number" placeholder="24000 (usually 1-2 months)" value={form.deposit} onChange={e=>set("deposit",e.target.value)} />
            </div>
            <div className="reg-form-title" style={{fontSize:"1.1rem",marginBottom:"0.3rem"}}>Amenities</div>
            <div style={{fontSize:"0.78rem",color:"var(--stone)",marginBottom:"1rem"}}>Select all that apply</div>
            <div className="amenity-toggles">
              {AMENITY_OPTIONS.map(a=>(
                <div key={a.value} className={`amenity-toggle${form.amenities.includes(a.value)?" selected":""}`} onClick={()=>toggleAmenity(a.value)}>
                  <div className="amenity-toggle-icon">{a.icon}</div>
                  <div className="amenity-toggle-label">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Photos */}
        {step===3 && (
          <div className="reg-form-card">
            <div className="reg-form-title">Add photos</div>
            <div className="reg-form-sub">Good photos attract 3x more inquiries. Add at least 5.</div>
            <div className="photo-upload-zone">
              <div className="photo-upload-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
              <div className="photo-upload-text">Drag & drop photos here, or click to browse</div>
              <div className="photo-upload-sub">JPEG, PNG or HEIC · Max 10MB each · At least 5 photos recommended</div>
            </div>
            <div style={{marginTop:"1.5rem"}}>
              <div style={{fontSize:"0.8rem",fontWeight:500,color:"var(--charcoal)",marginBottom:"0.5rem"}}>Photo tips</div>
              {["Shoot in natural daylight — open curtains and windows","Cover all rooms: entrance, living, bedroom, bathroom, kitchen","Include exteriors and any special features like terrace or garden"].map((tip,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8,fontSize:"0.8rem",color:"var(--stone)"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5" style={{marginTop:2,flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Publish */}
        {step===4 && (
          <div className="reg-form-card">
            <div className="reg-form-title">Contact & publish</div>
            <div className="reg-form-sub">Tenants will use this to reach you for inquiries</div>
            <div className="reg-grid" style={{marginBottom:"1.25rem"}}>
              <div className="reg-form-group">
                <label className="reg-label">Your name *</label>
                <input className={`reg-input${errors.contactName?" error":""}`} placeholder="Rajesh Sharma" value={form.contactName} onChange={e=>set("contactName",e.target.value)} />
                {errors.contactName && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.contactName}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-label">Phone *</label>
                <input className={`reg-input${errors.contactPhone?" error":""}`} placeholder="+91 98765 43210" value={form.contactPhone} onChange={e=>set("contactPhone",e.target.value)} />
                {errors.contactPhone && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.contactPhone}</div>}
              </div>
            </div>
            <div className="reg-form-group" style={{marginBottom:"1.75rem"}}>
              <label className="reg-label">Email *</label>
              <input className={`reg-input${errors.contactEmail?" error":""}`} type="email" placeholder="you@example.com" value={form.contactEmail} onChange={e=>set("contactEmail",e.target.value)} />
              {errors.contactEmail && <div style={{fontSize:"0.72rem",color:"#C94040",marginTop:4}}>{errors.contactEmail}</div>}
            </div>
            {/* Summary */}
            <div style={{background:"var(--cream)",borderRadius:14,padding:"1.25rem",border:"1px solid var(--border)"}}>
              <div style={{fontSize:"0.8rem",fontWeight:500,color:"var(--charcoal)",marginBottom:"1rem"}}>Listing summary</div>
              {[
                ["Type", form.type.charAt(0).toUpperCase()+form.type.slice(1)],
                ["Title", form.title || "—"],
                ["Location", [form.area,form.city,form.state].filter(Boolean).join(", ")||"—"],
                ["Price", form.price ? `${fmt(+form.price)} / ${form.priceType.replace("per_","")}` : "—"],
                ["Amenities", form.amenities.length>0 ? form.amenities.join(", ") : "None selected"],
              ].map(([label,val])=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",marginBottom:8}}>
                  <span style={{color:"var(--stone)"}}>{label}</span>
                  <span style={{color:"var(--charcoal)",fontWeight:400,textAlign:"right",maxWidth:300,overflow:"hidden",textOverflow:"ellipsis"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="reg-nav">
          <button className="reg-btn-back" onClick={()=>step===0?navigate("home"):setStep(s=>s-1)} disabled={loading}>
            {step===0?"Cancel":"← Back"}
          </button>
          <button className="reg-btn-next" onClick={handleNext} disabled={loading}>
            {loading ? <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Publishing…</> : step===steps.length-1 ? "Publish listing ✓" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TENANT DASHBOARD (new)
// ═══════════════════════════════════════════════════════════════
const TENANT_BOOKINGS = [
  { id:"b1", title:"Heritage Haveli Suite",      city:"Udaipur",    state:"Rajasthan",  checkIn:"2025-07-15", checkOut:"2025-07-18", amount:13500, status:"confirmed" },
  { id:"b2", title:"Sunlit Studio in Malviya Nagar", city:"Jaipur", state:"Rajasthan", checkIn:"2025-08-01", checkOut:"2025-08-31", amount:12000, status:"pending" },
  { id:"b3", title:"Sea-facing Room, South Goa", city:"Goa",        state:"Goa",        checkIn:"2025-06-01", checkOut:"2025-06-05", amount:16000, status:"completed" },
];

const TENANT_WISHLIST = [
  { id:"w1", title:"Hill-view Studio, Old Manali", city:"Manali", price:1800, type:"per_night" },
  { id:"w2", title:"Spacious 2BHK with Garden View", city:"Bangalore", price:22000, type:"per_month" },
  { id:"w3", title:"Premium PG — Koregaon Park", city:"Pune", price:11000, type:"per_month" },
];

function TenantDashboard({ navigate }) {
  const [activeNav, setActiveNav] = useState("bookings");
  const pageTitles = { bookings:"My Bookings", wishlist:"Wishlist", messages:"Messages", notifications:"Notifications", profile:"My Profile" };

  const NAV_ITEMS = [
    { id:"bookings",      label:"My Bookings",    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id:"wishlist",      label:"Wishlist",        icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
    { id:"messages",      label:"Messages",        icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { id:"notifications", label:"Notifications",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, badge:2 },
    { id:"profile",       label:"My Profile",      icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div className="tenant-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1500" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <span className="brand-name">Nivaas</span>
        </div>
        <div className="sidebar-owner">
          <div className="owner-avatar">AK</div>
          <div className="owner-name">Arjun Kumar</div>
          <div className="owner-badge">Tenant</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label-dash">My Account</div>
          {NAV_ITEMS.map(item=>(
            <button key={item.id} className={`d-nav-item${activeNav===item.id?" active":""}`} onClick={()=>setActiveNav(item.id)}>
              {item.icon}{item.label}
              {item.badge>0 && <span className="nav-badge-dash gold">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="d-nav-item" style={{color:"#C06060"}} onClick={()=>navigate("home")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Browse listings
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <div className="dash-topbar">
          <span className="topbar-title">{pageTitles[activeNav]}</span>
          <div className="topbar-actions">
            <button className="btn-primary-dash" onClick={()=>navigate("home")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Find new stay
            </button>
          </div>
        </div>
        <div className="tenant-dash-content">
          {/* Bookings */}
          {activeNav==="bookings" && (
            <div>
              <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                {[{label:"Total bookings",value:TENANT_BOOKINGS.length,change:"Across all stays"},{label:"Upcoming",value:TENANT_BOOKINGS.filter(b=>b.status==="confirmed"||b.status==="pending").length,change:"Confirmed & pending"},{label:"Total spent",value:fmt(TENANT_BOOKINGS.reduce((s,b)=>s+b.amount,0)),change:"All bookings"}].map((s,i)=>(
                  <div key={i} className="stat-card" style={{animationDelay:`${i*0.05}s`}}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-change neutral">{s.change}</div>
                  </div>
                ))}
              </div>
              <div className="my-bookings-list">
                {TENANT_BOOKINGS.map((b,i)=>(
                  <div key={b.id} className="booking-card-t" style={{animationDelay:`${i*0.06}s`}}>
                    <div className="booking-thumb-t"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                    <div className="booking-info-t">
                      <div className="booking-title-t">{b.title}</div>
                      <div className="booking-loc-t"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{b.city}, {b.state}</div>
                      <div className="booking-dates-t">📅 {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</div>
                    </div>
                    <div>
                      <div className="booking-price-t">{fmt(b.amount)}</div>
                      <div style={{marginTop:6}}><StatusPill status={b.status}/></div>
                      {b.status==="confirmed"&&<button style={{marginTop:8,padding:"0.3rem 0.7rem",borderRadius:6,border:"1px solid var(--d-border2)",background:"var(--d-bg3)",color:"var(--d-text2)",fontSize:"0.72rem",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}} onClick={()=>navigate("property-detail")}>View details</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist */}
          {activeNav==="wishlist" && (
            <div>
              <div style={{marginBottom:"1.25rem",fontSize:"0.82rem",color:"var(--d-text3)"}}>Properties you've saved</div>
              <div className="wishlist-grid">
                {TENANT_WISHLIST.map((w,i)=>(
                  <div key={w.id} className="wishlist-card" style={{animation:"fadeUp 0.3s ease both",animationDelay:`${i*0.06}s`}}>
                    <div className="wishlist-img"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                    <div className="wishlist-body">
                      <div className="wishlist-title">{w.title}</div>
                      <div className="wishlist-loc">{w.city}</div>
                      <div className="wishlist-price">{fmt(w.price)}<span style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.7rem",color:"var(--d-text3)"}}> /{w.type.replace("per_","")}</span></div>
                      <button style={{marginTop:8,width:"100%",padding:"0.4rem",borderRadius:6,border:"1px solid var(--d-border2)",background:"transparent",color:"var(--d-text2)",fontSize:"0.72rem",cursor:"pointer",fontFamily:"DM Sans,sans-serif"}} onClick={()=>navigate("property-detail")}>View property →</button>
                    </div>
                  </div>
                ))}
                {TENANT_WISHLIST.length===0 && <div className="d-empty-state" style={{gridColumn:"1/-1"}}><p>No saved properties yet.</p></div>}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeNav==="messages" && (
            <div className="d-section">
              <div className="section-header"><span className="section-title">Messages</span><span className="section-count">2</span></div>
              {[{name:"Vikram Singh Rathore",prop:"Heritage Haveli Suite",msg:"Thank you for your booking request! I'll confirm shortly.",time:"2h ago",unread:true},{name:"Anjali Mehra",prop:"Sunlit Studio in Malviya Nagar",msg:"Hi! The property will be available from Aug 1st.",time:"1d ago",unread:false}].map((m,i)=>(
                <div key={i} style={{display:"flex",gap:"1rem",padding:"1rem 1.5rem",borderBottom:"1px solid var(--d-border)",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"var(--d-bg4)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Cormorant Garamond,serif",fontSize:"0.95rem",color:"var(--gold)",flexShrink:0}}>{m.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontWeight:500,fontSize:"0.875rem",color:"var(--d-text)"}}>{m.name}</span>
                      <span style={{fontSize:"0.7rem",color:"var(--d-text3)"}}>{m.time}</span>
                    </div>
                    <div style={{fontSize:"0.72rem",color:"var(--d-text3)",marginBottom:3}}>{m.prop}</div>
                    <div style={{fontSize:"0.8rem",color:"var(--d-text2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.msg}</div>
                  </div>
                  {m.unread && <div style={{width:8,height:8,borderRadius:"50%",background:"var(--gold)",marginTop:6,flexShrink:0}}/>}
                </div>
              ))}
            </div>
          )}

          {/* Notifications */}
          {activeNav==="notifications" && <NotificationsPage />}

          {/* Profile */}
          {activeNav==="profile" && (
            <div>
              <div className="profile-card">
                <div className="profile-avatar-lg">AK</div>
                <div className="profile-info">
                  <div className="profile-name">Arjun Kumar</div>
                  <div className="profile-email">arjun.kumar@example.com</div>
                  <div className="profile-edit-grid">
                    {[["Full name","Arjun Kumar"],["Username","arjun_k"],["Email","arjun.kumar@example.com"],["Phone","+91 98765 43210"],["City","Jaipur, Rajasthan"],["About","Looking for a cozy flat near city centre."]].map(([label,val])=>(
                      <div key={label} style={label==="About"?{gridColumn:"1/-1"}:{}}>
                        <div style={{fontSize:"0.68rem",color:"var(--d-text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{label}</div>
                        {label==="About"
                          ? <textarea defaultValue={val} style={{width:"100%",padding:"0.6rem 0.9rem",background:"var(--d-bg3)",border:"1px solid var(--d-border)",borderRadius:8,color:"var(--d-text)",fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem",outline:"none",resize:"vertical",minHeight:80}}/>
                          : <input defaultValue={val} className="profile-input" />
                        }
                      </div>
                    ))}
                    <div style={{gridColumn:"1/-1"}}>
                      <button style={{padding:"0.6rem 1.25rem",borderRadius:8,background:"var(--gold)",border:"none",color:"#1a1500",fontFamily:"DM Sans,sans-serif",fontWeight:500,cursor:"pointer"}}>Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function NivaasApp() {
  const [page, setPage] = useState("home");

  const ALL_STYLES = [
    GLOBAL_STYLES, HOME_STYLES, AUTH_STYLES, DASH_STYLES,
    DETAIL_STYLES, BILLING_STYLES, NOTIFICATIONS_STYLES, REGISTER_PROP_STYLES, TENANT_STYLES
  ].join("\n");

  return (
    <>
      <style>{ALL_STYLES}</style>
      {page === "home"              && <HomePage              navigate={setPage} />}
      {page === "auth"              && <AuthPage              navigate={setPage} />}
      {page === "dashboard"         && <OwnerDashboard        navigate={setPage} />}
      {page === "property-detail"   && <PropertyDetailPage    navigate={setPage} />}
      {page === "register-property" && <PropertyRegisterPage  navigate={setPage} />}
      {page === "tenant-dashboard"  && <TenantDashboard       navigate={setPage} />}
    </>
  );
}

import { useState, useEffect, useRef } from "react";

// ─── Mock listing data (matches your LISTINGS array shape) ───────
const LISTING = {
  _id: "7",
  title: "Heritage Haveli Suite",
  propertyType: "villa",
  description:
    "Step into a world where centuries-old architecture meets refined modern comfort. This meticulously restored haveli suite in the heart of Udaipur's old city quarter offers an unparalleled experience — hand-carved marble jaalis filtering golden afternoon light, original frescoes restored by master craftsmen, and a private rooftop terrace overlooking the shimmering Lake Pichola. Each morning begins with birdsong and a panoramic skyline of whitewashed havelis; each evening dissolves into a canvas of amber and violet above the Aravalli hills. A stay here is not merely accommodation — it is immersion.",
  location: {
    city: "Udaipur",
    state: "Rajasthan",
    area: "Gangaur Ghat Road, Old City",
    lat: 24.5754,
    lng: 73.6835,
  },
  pricing: {
    basePrice: 4500,
    priceType: "per_night",
    securityDeposit: 10000,
    cleaningFee: 500,
  },
  ratings: { average: 5.0, count: 22 },
  amenities: [
    "wifi", "ac", "parking", "hot_water", "power_backup",
    "meals_included", "laundry", "security", "garden", "terrace",
  ],
  roomInfo: { availableRooms: 1, bathrooms: 2, areaSqFt: 600, bedrooms: 2, maxGuests: 4 },
  owner: {
    fullName: "Vikram Singh Rathore",
    initials: "VS",
    verified: true,
    joinedYear: 2019,
    responseRate: 98,
    responseTime: "within 1 hour",
    totalListings: 3,
  },
  reviews: [
    { id: 1, author: "Meera P.",    initials: "MP", date: "Mar 2025", rating: 5, text: "An absolutely transcendent stay. The haveli breathes history — every corner, every carved window tells a story. Vikram was an exceptional host." },
    { id: 2, author: "Arjun S.",    initials: "AS", date: "Feb 2025", rating: 5, text: "The rooftop at sunset is worth the price alone. Utterly magical. Already planning my return." },
    { id: 3, author: "Priya K.",    initials: "PK", date: "Jan 2025", rating: 5, text: "Staying here felt like stepping into a dream. The details — the frescoes, the jaalis, the smell of old stone — I'll never forget it." },
    { id: 4, author: "Rahul M.",    initials: "RM", date: "Dec 2024", rating: 4, text: "Gorgeous property with a genuinely warm host. The meals were exceptional. Only minor gripe: the street outside gets lively after midnight." },
  ],
  images: ["hero", "room", "bath", "terrace", "garden"],
  isNew: false,
  available: true,
};

const AMENITY_LABELS = {
  wifi: "High-speed WiFi", ac: "Air conditioning", parking: "Secure parking",
  hot_water: "24h hot water", power_backup: "Power backup", meals_included: "Meals included",
  laundry: "Laundry service", security: "24h security", garden: "Private garden", terrace: "Rooftop terrace",
};

const AMENITY_ICONS = {
  wifi: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>,
  ac: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="20" height="8" rx="2"/><path d="M8 14v4m4-4v4m4-4v4"/></svg>,
  parking: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>,
  hot_water: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2v6m-4-4l2 2m6-2l-2 2M5 12a7 7 0 0014 0"/></svg>,
  power_backup: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  meals_included: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  laundry: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="8" cy="7" r="1"/></svg>,
  security: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  garden: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22V12m0 0C12 7 8 4 3 5c0 5 4 8 9 7zm0 0c0-5 4-8 9-7-1 5-4 8-9 7"/></svg>,
  terrace: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const fmt = n => "₹" + n.toLocaleString("en-IN");

// ─── Styles ──────────────────────────────────────────────────────
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:      #F7F3EC;
    --cream2:     #EDE8DF;
    --cream3:     #E4DDD3;
    --warm-white: #FAFAF6;
    --charcoal:   #1A1A18;
    --charcoal2:  #2C2C29;
    --stone:      #7A7870;
    --stone2:     #B8B4AB;
    --terracotta: #C05A28;
    --terra2:     #E07848;
    --sage:       #5E7252;
    --border:     rgba(26,26,24,0.10);
    --border2:    rgba(26,26,24,0.06);
    --shadow-sm:  0 1px 4px rgba(26,26,24,0.06);
    --shadow-md:  0 4px 20px rgba(26,26,24,0.08);
    --shadow-lg:  0 12px 48px rgba(26,26,24,0.12);
    --shadow-xl:  0 24px 80px rgba(26,26,24,0.18);
  }

  html { scroll-behavior: smooth; }

  body, .detail-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--warm-white);
    color: var(--charcoal);
    min-height: 100vh;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes toastSlide {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ─── Navbar ────────────────────────────────── */
  .d-navbar {
    position: sticky; top: 0; z-index: 200;
    background: rgba(250,250,246,0.94);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    height: 64px; padding: 0 3rem;
    display: flex; align-items: center; justify-content: space-between;
    transition: box-shadow 0.3s;
  }
  .d-navbar.scrolled { box-shadow: var(--shadow-md); }
  .d-nav-left { display: flex; align-items: center; gap: 1rem; }
  .back-btn {
    display: flex; align-items: center; gap: 7px;
    background: none; border: 1.5px solid var(--border);
    border-radius: 8px; padding: 0.4rem 0.85rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    color: var(--stone); cursor: pointer; transition: all 0.15s;
  }
  .back-btn:hover { background: var(--cream); color: var(--charcoal); border-color: var(--stone2); }
  .d-brand { display: flex; align-items: center; gap: 9px; }
  .d-brand-icon { width: 30px; height: 30px; border-radius: 8px; background: var(--charcoal); display: flex; align-items: center; justify-content: center; }
  .d-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; color: var(--charcoal); }
  .d-nav-right { display: flex; align-items: center; gap: 0.75rem; }
  .icon-btn {
    width: 38px; height: 38px; border-radius: 9px;
    border: 1.5px solid var(--border); background: transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--stone); transition: all 0.15s;
  }
  .icon-btn:hover { background: var(--cream); color: var(--charcoal); }
  .icon-btn.wishlisted { background: var(--cream); border-color: var(--terracotta); color: var(--terracotta); }
  .icon-btn.wishlisted svg { fill: var(--terracotta); stroke: var(--terracotta); }

  /* ─── Hero Gallery ───────────────────────────── */
  .gallery-grid {
    display: grid;
    grid-template-columns: 1.65fr 1fr;
    grid-template-rows: 260px 220px;
    gap: 4px;
    height: 488px;
    padding: 0 3rem;
    max-width: 1320px;
    margin: 0 auto;
    animation: fadeUp 0.5s ease both;
  }

  .gallery-main {
    grid-row: span 2;
    border-radius: 18px 0 0 18px;
    overflow: hidden;
    position: relative;
    background: var(--cream2);
    cursor: pointer;
  }

  .gallery-thumb {
    border-radius: 0;
    overflow: hidden;
    background: var(--cream2);
    position: relative;
    cursor: pointer;
  }
  .gallery-thumb:first-of-type { border-top-right-radius: 18px; }
  .gallery-thumb:last-of-type { border-bottom-right-radius: 18px; }

  .gallery-img-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; color: var(--stone2);
    transition: all 0.3s;
  }
  .gallery-main:hover .gallery-img-placeholder,
  .gallery-thumb:hover .gallery-img-placeholder { opacity: 0.7; }

  .gallery-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(26,26,24,0.35) 100%);
    opacity: 0; transition: opacity 0.3s;
  }
  .gallery-main:hover .gallery-overlay { opacity: 1; }

  .gallery-all-btn {
    position: absolute; bottom: 14px; right: 14px;
    background: rgba(250,250,246,0.95); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 0.45rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
    color: var(--charcoal); cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 6px;
    backdrop-filter: blur(8px);
  }
  .gallery-all-btn:hover { background: #fff; box-shadow: var(--shadow-md); }

  /* palette dots on thumb */
  .thumb-label {
    position: absolute; top: 10px; left: 10px;
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.07em;
    background: rgba(26,26,24,0.55); color: #eee;
    border-radius: 4px; padding: 3px 8px;
    backdrop-filter: blur(4px);
  }

  /* ─── Layout ─────────────────────────────────── */
  .detail-layout {
    max-width: 1320px; margin: 0 auto;
    padding: 2.5rem 3rem 5rem;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 3.5rem;
    align-items: start;
  }

  /* ─── Left col ───────────────────────────────── */
  .detail-left { min-width: 0; }

  .property-type-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--terracotta); font-weight: 500;
    background: rgba(192,90,40,0.08); border: 1px solid rgba(192,90,40,0.15);
    border-radius: 20px; padding: 4px 12px; margin-bottom: 1rem;
    animation: fadeUp 0.5s ease 0.1s both;
  }

  .property-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem; font-weight: 400; line-height: 1.1;
    color: var(--charcoal); letter-spacing: -0.02em;
    margin-bottom: 1rem;
    animation: fadeUp 0.5s ease 0.15s both;
  }

  .property-meta-row {
    display: flex; align-items: center; gap: 1.5rem;
    flex-wrap: wrap; margin-bottom: 1.75rem;
    animation: fadeUp 0.5s ease 0.2s both;
  }

  .meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.83rem; color: var(--stone);
  }
  .meta-item strong { color: var(--charcoal); font-weight: 500; }
  .meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--stone2); }

  .rating-badge {
    display: flex; align-items: center; gap: 5px;
    background: var(--cream); border: 1px solid var(--border);
    border-radius: 8px; padding: 4px 10px;
    font-size: 0.83rem; font-weight: 500; color: var(--charcoal);
  }

  /* ─── Section headings ───────────────────────── */
  .section-divider { height: 1px; background: var(--border); margin: 2rem 0; }

  .sec-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 500; color: var(--charcoal);
    letter-spacing: -0.01em; margin-bottom: 1rem;
  }

  /* ─── Description ────────────────────────────── */
  .description-text {
    font-size: 0.93rem; color: var(--stone); line-height: 1.9;
    font-weight: 300; max-width: 640px;
  }
  .description-text.clamped {
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
  }
  .read-more-btn {
    background: none; border: none; color: var(--charcoal); font-weight: 500;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer;
    margin-top: 0.6rem; display: flex; align-items: center; gap: 4px;
    padding: 0; text-decoration: underline; text-underline-offset: 3px;
  }

  /* ─── Quick facts ────────────────────────────── */
  .quick-facts {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .fact-card {
    background: var(--cream); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.1rem 1rem;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    text-align: center;
  }
  .fact-icon { color: var(--terracotta); }
  .fact-value { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: var(--charcoal); }
  .fact-label { font-size: 0.7rem; color: var(--stone); text-transform: uppercase; letter-spacing: 0.07em; }

  /* ─── Amenities ──────────────────────────────── */
  .amenities-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
  .amenity-item {
    display: flex; align-items: center; gap: 10px;
    padding: 0.65rem 0.9rem; border-radius: 10px;
    border: 1px solid var(--border2); background: var(--cream);
    font-size: 0.83rem; color: var(--charcoal); font-weight: 400;
  }
  .amenity-item svg { color: var(--terracotta); flex-shrink: 0; }

  /* ─── Owner card ─────────────────────────────── */
  .owner-card {
    border: 1px solid var(--border); border-radius: 18px;
    padding: 1.5rem; background: var(--cream);
  }
  .owner-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .owner-avatar-lg {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--charcoal); display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: var(--cream);
    flex-shrink: 0;
  }
  .owner-name { font-size: 1rem; font-weight: 500; color: var(--charcoal); margin-bottom: 2px; }
  .owner-since { font-size: 0.75rem; color: var(--stone); }
  .owner-verified {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.68rem; color: var(--sage); font-weight: 500;
    background: rgba(94,114,82,0.08); border: 1px solid rgba(94,114,82,0.2);
    border-radius: 20px; padding: 2px 8px; margin-top: 4px;
  }
  .owner-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; }
  .owner-stat { text-align: center; }
  .owner-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--charcoal); }
  .owner-stat-label { font-size: 0.68rem; color: var(--stone); text-transform: uppercase; letter-spacing: 0.06em; }
  .contact-owner-btn {
    width: 100%; margin-top: 1.25rem;
    padding: 0.65rem; border-radius: 9px;
    border: 1.5px solid var(--charcoal); background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 500;
    color: var(--charcoal); cursor: pointer; transition: all 0.2s;
  }
  .contact-owner-btn:hover { background: var(--charcoal); color: var(--cream); }

  /* ─── Reviews ────────────────────────────────── */
  .reviews-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
  .reviews-rating-big { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 400; color: var(--charcoal); line-height: 1; }
  .reviews-stars { display: flex; gap: 3px; }
  .reviews-count { font-size: 0.8rem; color: var(--stone); margin-top: 3px; }
  .reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .review-card {
    background: var(--cream); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.2rem;
    animation: fadeUp 0.4s ease both;
  }
  .review-top { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; }
  .review-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--charcoal2); display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; color: var(--cream); flex-shrink: 0;
  }
  .review-author { font-size: 0.83rem; font-weight: 500; color: var(--charcoal); }
  .review-date { font-size: 0.7rem; color: var(--stone); margin-top: 1px; }
  .review-stars { display: flex; gap: 2px; margin-left: auto; }
  .review-text { font-size: 0.82rem; color: var(--stone); line-height: 1.7; font-weight: 300; }

  /* ─── Map placeholder ────────────────────────── */
  .map-wrap {
    height: 260px; border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border); background: var(--cream2);
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .map-grid {
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(26,26,24,0.05) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(26,26,24,0.05) 40px);
  }
  .map-pin {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .map-pin-dot {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--charcoal); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 8px rgba(26,26,24,0.1), var(--shadow-lg);
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 8px rgba(26,26,24,0.1), var(--shadow-lg); }
    50%      { box-shadow: 0 0 0 16px rgba(26,26,24,0.05), var(--shadow-lg); }
  }
  .map-label {
    background: var(--charcoal); color: var(--cream);
    font-size: 0.75rem; font-weight: 500; border-radius: 6px; padding: 4px 12px;
    white-space: nowrap;
  }

  /* ─── Sticky booking card ─────────────────────── */
  .booking-card {
    position: sticky; top: 80px;
    background: var(--warm-white); border: 1.5px solid var(--border);
    border-radius: 20px; padding: 1.75rem;
    box-shadow: var(--shadow-xl);
    animation: fadeUp 0.5s ease 0.3s both;
  }

  .booking-price-row {
    display: flex; align-items: baseline; gap: 6px; margin-bottom: 1.5rem;
  }
  .booking-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 500; color: var(--charcoal);
    line-height: 1;
  }
  .booking-price-period { font-size: 0.83rem; color: var(--stone); font-weight: 300; }

  /* Date inputs */
  .booking-dates {
    border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden;
    margin-bottom: 1rem;
  }
  .date-row {
    display: grid; grid-template-columns: 1fr 1fr;
  }
  .date-field {
    padding: 0.75rem 1rem;
    border-right: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
  }
  .date-field:last-child { border-right: none; }
  .date-field:hover { background: var(--cream); }
  .date-field:focus-within { background: var(--cream); }
  .date-field-label { font-size: 0.62rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.09em; color: var(--charcoal); margin-bottom: 3px; }
  .date-field input {
    width: 100%; border: none; outline: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--charcoal);
    cursor: pointer;
  }
  .date-field input::-webkit-calendar-picker-indicator { opacity: 0; width: 0; }

  /* Guests */
  .guests-field {
    border: 1.5px solid var(--border); border-radius: 12px;
    padding: 0.75rem 1rem; margin-bottom: 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: border-color 0.15s, background 0.15s;
  }
  .guests-field:hover { background: var(--cream); border-color: var(--stone2); }
  .guests-field-label { font-size: 0.62rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.09em; color: var(--charcoal); margin-bottom: 3px; }
  .guests-value { font-size: 0.875rem; color: var(--charcoal); }
  .guests-counter { display: flex; align-items: center; gap: 10px; }
  .counter-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid var(--border); background: var(--warm-white);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--charcoal); font-size: 1rem;
    transition: all 0.15s; line-height: 1;
  }
  .counter-btn:hover:not(:disabled) { background: var(--cream2); border-color: var(--stone2); }
  .counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .counter-val { font-size: 0.93rem; font-weight: 500; color: var(--charcoal); min-width: 18px; text-align: center; }

  /* Price breakdown */
  .price-breakdown {
    background: var(--cream); border-radius: 12px;
    padding: 1rem 1.1rem; margin-bottom: 1.25rem;
  }
  .breakdown-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.82rem; color: var(--stone); margin-bottom: 0.6rem;
  }
  .breakdown-row:last-child { margin-bottom: 0; }
  .breakdown-row.total {
    border-top: 1px solid var(--border); padding-top: 0.6rem; margin-top: 0.6rem;
    color: var(--charcoal); font-weight: 500; font-size: 0.88rem;
  }
  .breakdown-val { color: var(--charcoal); }

  /* Book button */
  .book-btn {
    width: 100%; padding: 0.9rem;
    background: var(--charcoal); color: var(--cream);
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .book-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
    transform: translateX(-100%); transition: transform 0.4s;
  }
  .book-btn:hover { background: var(--charcoal2); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .book-btn:hover::after { transform: translateX(100%); }
  .book-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .book-btn.loading { background: var(--charcoal2); }

  .btn-spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .book-note {
    text-align: center; font-size: 0.72rem; color: var(--stone);
    margin-top: 0.75rem;
  }

  /* Booking steps */
  .booking-steps {
    display: flex; gap: 0.5rem; margin-bottom: 1.25rem;
  }
  .booking-step {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--cream2); transition: background 0.3s;
  }
  .booking-step.done { background: var(--terracotta); }

  /* Success state */
  .booking-success {
    text-align: center; padding: 1rem 0;
    animation: fadeUp 0.4s ease both;
  }
  .success-icon-wrap {
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(94,114,82,0.1); border: 2px solid rgba(94,114,82,0.25);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }
  .booking-success h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 400; color: var(--charcoal);
    margin-bottom: 0.4rem;
  }
  .booking-success p { font-size: 0.82rem; color: var(--stone); line-height: 1.6; }

  /* ─── Validation errors ──────────────── */
  .field-error { font-size: 0.72rem; color: #C94040; margin-top: 4px; }
  .date-field.error { border-bottom: 2px solid #C94040; }
  .guests-field.error { border-color: #C94040; }

  /* ─── Toast ──────────────────────────── */
  .toast-wrap {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    z-index: 9999; display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 0.75rem 1.25rem; border-radius: 10px;
    font-size: 0.82rem; font-weight: 500; min-width: 240px;
    animation: toastSlide 0.3s ease both;
    box-shadow: var(--shadow-xl);
  }
  .toast.success { background: #1B2E1B; border: 1px solid rgba(94,114,82,0.3); color: #7AC97A; }
  .toast.error   { background: #2A1818; border: 1px solid rgba(192,90,40,0.3); color: #E07848; }

  /* ─── Responsive ─────────────────────── */
  @media (max-width: 1060px) {
    .detail-layout { grid-template-columns: 1fr; }
    .booking-card { position: static; }
    .gallery-grid { grid-template-columns: 1fr 1fr; height: 360px; padding: 0 1.5rem; }
    .reviews-grid { grid-template-columns: 1fr; }
    .quick-facts { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 680px) {
    .gallery-grid { grid-template-columns: 1fr; grid-template-rows: 260px; height: 260px; padding: 0 1rem; }
    .gallery-thumb { display: none; }
    .gallery-main { border-radius: 14px; }
    .detail-layout { padding: 1.5rem 1rem 4rem; }
    .property-title { font-size: 2rem; }
    .d-navbar { padding: 0 1.25rem; }
    .amenities-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────

function StarRow({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "var(--terracotta)" : "none"}
          stroke="var(--terracotta)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function GallerySection() {
  const COLORS = {
    hero:    ["#C4B5A5", "#D4C5B5"],
    room:    ["#B5C4B5", "#C5D4C5"],
    bath:    ["#A5B5C4", "#B5C5D4"],
    terrace: ["#C4A595", "#D4B5A5"],
    garden:  ["#A5C4A5", "#B5D4B5"],
  };
  const LABELS = { hero:"Living area", room:"Bedroom", bath:"Bathroom", terrace:"Rooftop terrace", garden:"Garden" };
  const keys = Object.keys(COLORS);

  return (
    <div className="gallery-grid">
      {keys.map((k, i) => {
        const [c1, c2] = COLORS[k];
        const cls = i === 0 ? "gallery-main" : "gallery-thumb";
        return (
          <div key={k} className={cls}>
            <div className="gallery-img-placeholder" style={{
              background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(26,26,24,0.3)" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontSize: "0.7rem", color: "rgba(26,26,24,0.4)" }}>{LABELS[k]}</span>
            </div>
            <div className="gallery-overlay" />
            {i > 0 && <span className="thumb-label">{LABELS[k]}</span>}
            {i === 0 && (
              <button className="gallery-all-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                All photos
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function QuickFacts({ l }) {
  const facts = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, value: l.roomInfo.bedrooms,      label: "Bedrooms" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12h16M4 12a8 8 0 0016 0"/><path d="M8 12V8a4 4 0 018 0v4"/></svg>, value: l.roomInfo.bathrooms,     label: "Bathrooms" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, value: l.roomInfo.maxGuests, label: "Max guests" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>, value: `${l.roomInfo.areaSqFt}`, label: "sq. ft." },
  ];
  return (
    <div className="quick-facts">
      {facts.map(f => (
        <div key={f.label} className="fact-card">
          <div className="fact-icon">{f.icon}</div>
          <div className="fact-value">{f.value}</div>
          <div className="fact-label">{f.label}</div>
        </div>
      ))}
    </div>
  );
}

function OwnerSection({ owner }) {
  return (
    <div className="owner-card">
      <div className="owner-top">
        <div className="owner-avatar-lg">{owner.initials}</div>
        <div>
          <div className="owner-name">{owner.fullName}</div>
          <div className="owner-since">Owner since {owner.joinedYear}</div>
          {owner.verified && (
            <div className="owner-verified">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Verified owner
            </div>
          )}
        </div>
      </div>
      <div className="owner-stats">
        <div className="owner-stat">
          <div className="owner-stat-val">{owner.responseRate}%</div>
          <div className="owner-stat-label">Response rate</div>
        </div>
        <div className="owner-stat">
          <div className="owner-stat-val">{owner.responseTime}</div>
          <div className="owner-stat-label">Responds</div>
        </div>
        <div className="owner-stat">
          <div className="owner-stat-val">{owner.totalListings}</div>
          <div className="owner-stat-label">Listings</div>
        </div>
      </div>
      <button className="contact-owner-btn">Contact owner</button>
    </div>
  );
}

function ReviewsSection({ reviews, ratings }) {
  return (
    <>
      <div className="reviews-header">
        <div>
          <div className="reviews-rating-big">{ratings.average.toFixed(1)}</div>
          <StarRow rating={ratings.average} size={16} />
          <div className="reviews-count">{ratings.count} reviews</div>
        </div>
      </div>
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={r.id} className="review-card" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="review-top">
              <div className="review-avatar">{r.initials}</div>
              <div>
                <div className="review-author">{r.author}</div>
                <div className="review-date">{r.date}</div>
              </div>
              <div className="review-stars"><StarRow rating={r.rating} size={11} /></div>
            </div>
            <div className="review-text">"{r.text}"</div>
          </div>
        ))}
      </div>
    </>
  );
}

function MapSection({ location }) {
  return (
    <div className="map-wrap">
      <div className="map-grid" />
      <div className="map-pin">
        <div className="map-pin-dot">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div className="map-label">{location.area}</div>
      </div>
    </div>
  );
}

// ─── Booking Form ─────────────────────────────────────────────────
function BookingCard({ listing, addToast }) {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests,   setGuests]   = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [step,     setStep]     = useState(0); // 0 = pick dates, 1 = guests, 2 = confirm

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const d = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return d > 0 ? d : 0;
  })();

  const baseTotal    = nights * listing.pricing.basePrice;
  const cleaningFee  = listing.pricing.cleaningFee;
  const tax          = Math.round(baseTotal * 0.18);
  const grandTotal   = baseTotal + cleaningFee + tax;

  const validate = () => {
    const e = {};
    if (!checkIn)  e.checkIn  = "Select a check-in date";
    if (!checkOut) e.checkOut = "Select a check-out date";
    else if (checkOut <= checkIn) e.checkOut = "Check-out must be after check-in";
    if (nights === 0 && checkIn && checkOut) e.checkOut = "Check-out must be after check-in";
    return e;
  };

  const handleBook = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    addToast("Booking request sent! Owner will respond within 1 hour.", "success");
  };

  const reset = () => { setSuccess(false); setCheckIn(""); setCheckOut(""); setGuests(1); setStep(0); };

  if (success) return (
    <div className="booking-card">
      <div className="booking-success">
        <div className="success-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Request sent!</h3>
        <p style={{ marginBottom: "1.25rem" }}>
          Your booking request for <strong>{nights} night{nights !== 1 ? "s" : ""}</strong> has been sent to {listing.owner.fullName}. You'll hear back within 1 hour.
        </p>
        <div style={{ background: "var(--cream)", borderRadius: 12, padding: "1rem", marginBottom: "1.25rem", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--stone)", marginBottom: 6 }}>
            <span>Check-in</span><strong style={{ color: "var(--charcoal)" }}>{checkIn}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--stone)", marginBottom: 6 }}>
            <span>Check-out</span><strong style={{ color: "var(--charcoal)" }}>{checkOut}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--stone)" }}>
            <span>Guests</span><strong style={{ color: "var(--charcoal)" }}>{guests}</strong>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>
            <span>Total</span><span>{fmt(grandTotal)}</span>
          </div>
        </div>
        <button onClick={reset} style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 9, padding: "0.6rem 1.25rem", fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", cursor: "pointer", color: "var(--stone)", transition: "all 0.15s" }}
          onMouseOver={e => e.target.style.background = "var(--cream)"}
          onMouseOut={e => e.target.style.background = "none"}>
          Book another date
        </button>
      </div>
    </div>
  );

  return (
    <div className="booking-card">
      {/* Price header */}
      <div className="booking-price-row">
        <span className="booking-price">{fmt(listing.pricing.basePrice)}</span>
        <span className="booking-price-period">/ night</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <StarRow rating={listing.ratings.average} size={12} />
          <span style={{ fontSize: "0.78rem", color: "var(--stone)" }}>({listing.ratings.count})</span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="booking-steps">
        <div className={`booking-step${step >= 0 ? " done" : ""}`} />
        <div className={`booking-step${step >= 1 ? " done" : ""}`} />
        <div className={`booking-step${step >= 2 ? " done" : ""}`} />
      </div>

      {/* Date fields */}
      <div className={`booking-dates`}>
        <div className="date-row">
          <div className={`date-field${errors.checkIn ? " error" : ""}`}>
            <div className="date-field-label">Check-in</div>
            <input type="date" value={checkIn} min={today}
              onChange={e => { setCheckIn(e.target.value); setErrors(v => ({ ...v, checkIn: "" })); setStep(s => Math.max(s, 1)); }}
            />
          </div>
          <div className={`date-field${errors.checkOut ? " error" : ""}`}>
            <div className="date-field-label">Check-out</div>
            <input type="date" value={checkOut} min={checkIn || today}
              onChange={e => { setCheckOut(e.target.value); setErrors(v => ({ ...v, checkOut: "" })); setStep(s => Math.max(s, 2)); }}
            />
          </div>
        </div>
      </div>
      {errors.checkIn  && <div className="field-error">{errors.checkIn}</div>}
      {errors.checkOut && <div className="field-error" style={{ marginBottom: 4 }}>{errors.checkOut}</div>}

      {/* Guests */}
      <div className="guests-field">
        <div>
          <div className="guests-field-label">Guests</div>
          <div className="guests-value">{guests} guest{guests !== 1 ? "s" : ""}</div>
        </div>
        <div className="guests-counter">
          <button className="counter-btn" disabled={guests <= 1}
            onClick={() => setGuests(g => Math.max(1, g - 1))}>−</button>
          <span className="counter-val">{guests}</span>
          <button className="counter-btn" disabled={guests >= listing.roomInfo.maxGuests}
            onClick={() => setGuests(g => Math.min(listing.roomInfo.maxGuests, g + 1))}>+</button>
        </div>
      </div>

      {/* Price breakdown (only if nights selected) */}
      {nights > 0 && (
        <div className="price-breakdown">
          <div className="breakdown-row">
            <span>{fmt(listing.pricing.basePrice)} × {nights} night{nights !== 1 ? "s" : ""}</span>
            <span className="breakdown-val">{fmt(baseTotal)}</span>
          </div>
          <div className="breakdown-row">
            <span>Cleaning fee</span>
            <span className="breakdown-val">{fmt(cleaningFee)}</span>
          </div>
          <div className="breakdown-row">
            <span>GST (18%)</span>
            <span className="breakdown-val">{fmt(tax)}</span>
          </div>
          <div className="breakdown-row total">
            <span>Total</span>
            <span>{fmt(grandTotal)}</span>
          </div>
        </div>
      )}

      {/* Book button */}
      <button className={`book-btn${loading ? " loading" : ""}`} onClick={handleBook} disabled={loading}>
        {loading
          ? <><div className="btn-spinner" /> Sending request…</>
          : nights > 0
            ? `Reserve · ${fmt(grandTotal)}`
            : "Check availability"
        }
      </button>

      <div className="book-note">You won't be charged yet · Free cancellation for 24h</div>

      {/* Security deposit note */}
      <div style={{ marginTop: "1rem", background: "var(--cream)", borderRadius: 10, padding: "0.75rem 0.9rem", fontSize: "0.75rem", color: "var(--stone)", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--stone2)" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Security deposit of <strong style={{ color: "var(--charcoal)" }}>{fmt(listing.pricing.securityDeposit)}</strong> is collected by owner at check-in and fully refundable.</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function PropertyDetail({ navigate }) {
  const l = LISTING;
  const [scrolled,  setScrolled]  = useState(false);
  const [wishlisted,setWishlisted]= useState(false);
  const [expanded,  setExpanded]  = useState(false);
  const [toasts,    setToasts]    = useState([]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  return (
    <>
      <style>{S}</style>
      <div className="detail-root">

        {/* Navbar */}
        <nav className={`d-navbar${scrolled ? " scrolled" : ""}`}>
          <div className="d-nav-left">
            <button className="back-btn" onClick={() => navigate ? navigate("home") : window.history.back()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <div className="d-brand">
              <div className="d-brand-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span className="d-brand-name">Nivaas</span>
            </div>
          </div>
          <div className="d-nav-right">
            <button className="icon-btn" title="Share">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button className={`icon-btn${wishlisted ? " wishlisted" : ""}`} title="Save" onClick={() => { setWishlisted(w => !w); addToast(wishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️", "success"); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
          </div>
        </nav>

        {/* Gallery */}
        <div style={{ paddingTop: "1.5rem", marginBottom: "2rem" }}>
          <GallerySection />
        </div>

        {/* Main layout */}
        <div className="detail-layout">

          {/* ── Left column ── */}
          <div className="detail-left">

            {/* Type pill + title */}
            <div className="property-type-pill">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--terracotta)" }} />
              {l.propertyType.toUpperCase()}
            </div>
            <h1 className="property-title">{l.title}</h1>

            {/* Meta row */}
            <div className="property-meta-row">
              <div className="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {l.location.area}, {l.location.city}
              </div>
              <div className="meta-dot" />
              <div className="rating-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--terracotta)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {l.ratings.average.toFixed(1)} · <span style={{ color: "var(--stone)", fontWeight: 400 }}>{l.ratings.count} reviews</span>
              </div>
              <div className="meta-dot" />
              <div className="meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <strong>Verified</strong>
              </div>
            </div>

            {/* Quick facts */}
            <QuickFacts l={l} />

            <div className="section-divider" />

            {/* Description */}
            <h2 className="sec-title">About this space</h2>
            <p className={`description-text${expanded ? "" : " clamped"}`}>{l.description}</p>
            <button className="read-more-btn" onClick={() => setExpanded(e => !e)}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>

            <div className="section-divider" />

            {/* Amenities */}
            <h2 className="sec-title">What's included</h2>
            <div className="amenities-grid">
              {l.amenities.map(a => (
                <div key={a} className="amenity-item">
                  {AMENITY_ICONS[a] || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="20 6 9 17 4 12"/></svg>}
                  {AMENITY_LABELS[a] || a}
                </div>
              ))}
            </div>

            <div className="section-divider" />

            {/* Owner */}
            <h2 className="sec-title">Hosted by</h2>
            <OwnerSection owner={l.owner} />

            <div className="section-divider" />

            {/* Reviews */}
            <h2 className="sec-title">Guest reviews</h2>
            <ReviewsSection reviews={l.reviews} ratings={l.ratings} />

            <div className="section-divider" />

            {/* Map */}
            <h2 className="sec-title">Location</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--stone)", marginBottom: "1rem" }}>
              {l.location.area}, {l.location.city}, {l.location.state}
            </p>
            <MapSection location={l.location} />
          </div>

          {/* ── Right column: Booking card ── */}
          <div>
            <BookingCard listing={l} addToast={addToast} />
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

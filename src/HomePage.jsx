import { useState, useEffect, useRef } from "react";

const S = `
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
  }

  html { scroll-behavior: smooth; }

  body, .home-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--warm-white);
    color: var(--charcoal);
    min-height: 100vh;
  }

  /* ── Navbar ── */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(250,250,246,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 4rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    transition: box-shadow 0.3s;
  }

  .navbar.scrolled { box-shadow: var(--shadow-md); }

  .nav-brand {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }

  .nav-logo-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--charcoal);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .nav-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 500; color: var(--charcoal);
    letter-spacing: 0.02em;
  }

  .nav-links {
    display: flex; align-items: center; gap: 0.25rem;
  }

  .nav-link {
    padding: 0.45rem 0.9rem; border-radius: 8px;
    font-size: 0.85rem; color: var(--stone); font-weight: 400;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
    text-decoration: none;
  }
  .nav-link:hover { background: var(--cream); color: var(--charcoal); }
  .nav-link.active { color: var(--charcoal); font-weight: 500; }

  .nav-right { display: flex; align-items: center; gap: 0.75rem; }

  .btn-ghost {
    padding: 0.45rem 1rem; border-radius: 8px;
    border: 1.5px solid var(--border);
    background: transparent; color: var(--charcoal);
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .btn-ghost:hover { background: var(--cream2); border-color: var(--border); }

  .btn-cta {
    padding: 0.45rem 1.1rem; border-radius: 8px;
    background: var(--charcoal); color: var(--cream);
    border: none; font-size: 0.82rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .btn-cta:hover { background: var(--charcoal2); transform: translateY(-1px); box-shadow: var(--shadow-md); }

  /* ── Hero ── */
  .hero {
    position: relative; overflow: hidden;
    padding: 5rem 4rem 4rem;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
  }

  .hero-bg-pattern {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      radial-gradient(circle at 15% 50%, rgba(192,90,40,0.06) 0%, transparent 50%),
      radial-gradient(circle at 85% 20%, rgba(94,114,82,0.07) 0%, transparent 45%),
      repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(26,26,24,0.025) 80px),
      repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(26,26,24,0.025) 80px);
  }

  .hero-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
    position: relative; z-index: 1;
  }

  .hero-label {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.7rem; color: var(--terracotta); font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.1em;
    background: rgba(192,90,40,0.08); border: 1px solid rgba(192,90,40,0.15);
    border-radius: 20px; padding: 4px 12px; margin-bottom: 1.25rem;
    animation: fadeUp 0.6s ease both;
  }

  .hero-label span { width: 5px; height: 5px; border-radius: 50%; background: var(--terracotta); }

  .hero-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.8rem; font-weight: 400; line-height: 1.1;
    color: var(--charcoal); letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  .hero-headline em { font-style: italic; color: var(--terracotta); }

  .hero-desc {
    font-size: 1rem; color: var(--stone); line-height: 1.7;
    font-weight: 300; max-width: 420px; margin-bottom: 2rem;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .hero-cta-row {
    display: flex; align-items: center; gap: 1rem;
    animation: fadeUp 0.6s ease 0.3s both;
  }

  .btn-hero-primary {
    padding: 0.75rem 1.75rem; border-radius: 10px;
    background: var(--charcoal); color: var(--cream);
    border: none; font-size: 0.9rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .btn-hero-primary:hover { background: var(--charcoal2); transform: translateY(-2px); box-shadow: var(--shadow-lg); }

  .btn-hero-secondary {
    padding: 0.75rem 1.5rem; border-radius: 10px;
    background: transparent; color: var(--charcoal);
    border: 1.5px solid var(--border); font-size: 0.9rem; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; gap: 8px; font-weight: 400;
  }
  .btn-hero-secondary:hover { background: var(--cream2); border-color: var(--stone2); }

  .hero-trust {
    display: flex; align-items: center; gap: 1.25rem; margin-top: 2rem;
    animation: fadeUp 0.6s ease 0.4s both;
  }

  .hero-trust-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; color: var(--stone);
  }

  .hero-trust-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--stone2); }

  /* Hero right — floating cards */
  .hero-right {
    position: relative; height: 380px;
    animation: fadeUp 0.7s ease 0.2s both;
  }

  .hero-card-float {
    position: absolute; background: var(--warm-white);
    border: 1px solid var(--border); border-radius: 16px;
    padding: 1.25rem; box-shadow: var(--shadow-xl);
  }

  .hcf-main { width: 280px; top: 20px; left: 0; }
  .hcf-stat { width: 160px; top: 200px; right: 0; padding: 1rem 1.25rem; }
  .hcf-badge { width: 180px; top: 0; right: 20px; padding: 0.9rem 1.1rem; }

  .hcf-img {
    height: 130px; border-radius: 10px; background: var(--cream2);
    margin-bottom: 0.9rem; overflow: hidden; position: relative;
    display: flex; align-items: center; justify-content: center;
  }

  .hcf-tag {
    position: absolute; top: 8px; left: 8px;
    background: var(--charcoal); color: var(--cream);
    font-size: 0.62rem; font-weight: 500; border-radius: 20px;
    padding: 3px 9px; text-transform: uppercase; letter-spacing: 0.06em;
  }

  .hcf-title { font-size: 0.85rem; font-weight: 500; color: var(--charcoal); margin-bottom: 0.25rem; }
  .hcf-loc { font-size: 0.72rem; color: var(--stone); display: flex; align-items: center; gap: 4px; margin-bottom: 0.75rem; }
  .hcf-price-row { display: flex; align-items: center; justify-content: space-between; }
  .hcf-price { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 500; color: var(--charcoal); }
  .hcf-price sup { font-size: 0.6rem; font-family: 'DM Sans', sans-serif; color: var(--stone); }
  .hcf-stars { display: flex; gap: 2px; }

  .hcf-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--charcoal); font-weight: 400; }
  .hcf-stat-label { font-size: 0.7rem; color: var(--stone); margin-top: 2px; }

  .hcf-badge-row { display: flex; align-items: center; gap: 8px; }
  .hcf-badge-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(192,90,40,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .hcf-badge-title { font-size: 0.78rem; font-weight: 500; color: var(--charcoal); }
  .hcf-badge-sub { font-size: 0.66rem; color: var(--stone); margin-top: 1px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

  .hcf-main  { animation: float 6s ease-in-out infinite; }
  .hcf-badge { animation: float 6s ease-in-out 1s infinite; }
  .hcf-stat  { animation: float 6s ease-in-out 2s infinite; }

  /* ── Search Bar ── */
  .search-section {
    background: var(--warm-white); padding: 2rem 4rem;
    border-bottom: 1px solid var(--border2);
  }

  .search-wrap { max-width: 1200px; margin: 0 auto; }

  .search-bar {
    display: flex; align-items: stretch;
    background: var(--warm-white);
    border: 1.5px solid var(--border);
    border-radius: 14px; overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .search-bar:focus-within { border-color: var(--charcoal); box-shadow: var(--shadow-lg); }

  .search-field {
    flex: 1; display: flex; flex-direction: column;
    padding: 0.875rem 1.25rem; border-right: 1px solid var(--border2);
    cursor: text;
  }
  .search-field:last-of-type { border-right: none; }

  .sf-label { font-size: 0.65rem; font-weight: 500; color: var(--charcoal); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }

  .sf-input {
    border: none; outline: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    color: var(--charcoal); font-weight: 300;
  }
  .sf-input::placeholder { color: var(--stone2); }

  .sf-select {
    border: none; outline: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    color: var(--charcoal); font-weight: 300; cursor: pointer;
    -webkit-appearance: none; width: 100%;
  }

  .search-btn {
    padding: 0 1.75rem; background: var(--charcoal);
    border: none; cursor: pointer; color: var(--cream);
    display: flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500;
    transition: background 0.15s; white-space: nowrap; flex-shrink: 0;
  }
  .search-btn:hover { background: var(--charcoal2); }

  /* ── Category Pills ── */
  .categories {
    display: flex; gap: 0.6rem; margin-top: 1.25rem;
    flex-wrap: wrap;
  }

  .cat-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 0.4rem 1rem; border-radius: 20px;
    border: 1.5px solid var(--border);
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
    color: var(--stone); font-weight: 400; transition: all 0.15s;
  }
  .cat-pill:hover { border-color: var(--charcoal); color: var(--charcoal); background: var(--cream); }
  .cat-pill.active { border-color: var(--charcoal); color: var(--charcoal); background: var(--cream); font-weight: 500; }

  /* ── Listings Section ── */
  .listings-section { padding: 3rem 4rem; max-width: 1280px; margin: 0 auto; }

  .listings-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .listings-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 400; color: var(--charcoal);
    letter-spacing: -0.01em;
  }

  .listings-subtitle { font-size: 0.83rem; color: var(--stone); margin-top: 3px; }

  .listings-controls { display: flex; align-items: center; gap: 0.75rem; }

  .sort-select {
    padding: 0.4rem 0.85rem; border: 1.5px solid var(--border);
    border-radius: 8px; background: var(--warm-white);
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
    color: var(--charcoal); cursor: pointer; outline: none;
  }

  .view-toggle { display: flex; border: 1.5px solid var(--border); border-radius: 8px; overflow: hidden; }
  .view-btn {
    padding: 0.4rem 0.65rem; background: none; border: none;
    cursor: pointer; color: var(--stone2); transition: all 0.15s; display: flex;
  }
  .view-btn.active { background: var(--cream); color: var(--charcoal); }

  /* ── Cards ── */
  .listings-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .listings-grid.list-view { grid-template-columns: 1fr; }

  .prop-card {
    background: var(--warm-white); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden; cursor: pointer;
    transition: all 0.25s; animation: fadeUp 0.5s ease both;
  }
  .prop-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--border); }

  .listings-grid.list-view .prop-card {
    display: flex; border-radius: 14px;
  }

  .card-img {
    height: 210px; background: var(--cream2);
    position: relative; overflow: hidden; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  .listings-grid.list-view .card-img { width: 260px; height: auto; border-radius: 0; }

  .card-img-bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 6px; color: var(--stone2);
  }

  .card-badge {
    position: absolute; top: 12px; left: 12px;
    font-size: 0.62rem; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.07em; border-radius: 20px; padding: 4px 10px;
  }

  .badge-room    { background: rgba(26,26,24,0.75); color: #E8E4DC; }
  .badge-flat    { background: rgba(192,90,40,0.85); color: #fff; }
  .badge-pg      { background: rgba(94,114,82,0.85); color: #fff; }
  .badge-hostel  { background: rgba(58,95,139,0.85); color: #fff; }
  .badge-house   { background: rgba(139,107,46,0.85); color: #fff; }
  .badge-villa   { background: rgba(94,58,139,0.85); color: #fff; }

  .card-wishlist {
    position: absolute; top: 12px; right: 12px;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(250,250,246,0.9); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; backdrop-filter: blur(4px);
  }
  .card-wishlist:hover { background: #fff; transform: scale(1.1); }
  .card-wishlist.wishlisted { background: #fff; }
  .card-wishlist.wishlisted svg { fill: var(--terracotta); stroke: var(--terracotta); }

  .card-body { padding: 1.1rem 1.25rem 1.25rem; flex: 1; }

  .card-location {
    font-size: 0.72rem; color: var(--stone);
    display: flex; align-items: center; gap: 4px; margin-bottom: 0.35rem;
  }

  .card-title {
    font-size: 0.93rem; font-weight: 500; color: var(--charcoal);
    margin-bottom: 0.5rem; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .card-amenities {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 0.85rem;
  }

  .amenity-tag {
    font-size: 0.66rem; color: var(--stone); background: var(--cream2);
    border-radius: 4px; padding: 2px 7px; font-weight: 400;
  }

  .card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 0.85rem; border-top: 1px solid var(--border2);
  }

  .card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 500; color: var(--charcoal);
  }
  .card-price-period { font-size: 0.72rem; color: var(--stone); font-family: 'DM Sans', sans-serif; font-weight: 300; }

  .card-rating {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: var(--charcoal); font-weight: 500;
  }

  .card-rating-count { color: var(--stone); font-weight: 400; }

  .card-info-row {
    display: flex; align-items: center; gap: 12px; margin-bottom: 0.75rem;
  }

  .card-info-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.72rem; color: var(--stone);
  }

  /* ── Filters sidebar ── */
  .listings-layout { display: flex; gap: 2rem; }

  .filters-sidebar {
    width: 240px; flex-shrink: 0;
  }

  .filters-sticky { position: sticky; top: 80px; }

  .filter-group { margin-bottom: 1.75rem; }

  .filter-group-title {
    font-size: 0.72rem; font-weight: 500; color: var(--charcoal);
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem;
  }

  .filter-check {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.35rem 0; cursor: pointer;
  }

  .filter-check-left { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--charcoal); }

  .filter-check input[type="checkbox"] { accent-color: var(--charcoal); cursor: pointer; }

  .filter-count { font-size: 0.7rem; color: var(--stone2); }

  .price-range-wrap { display: flex; flex-direction: column; gap: 8px; }

  .price-range-input {
    width: 100%; accent-color: var(--charcoal);
    -webkit-appearance: none; height: 3px;
    background: linear-gradient(to right, var(--charcoal) 0%, var(--charcoal) 60%, var(--cream2) 60%);
    border-radius: 2px; outline: none; cursor: pointer;
  }

  .price-range-labels { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--stone); }

  .filter-divider { height: 1px; background: var(--border); margin: 1.25rem 0; }

  /* ── City showcase ── */
  .cities-section {
    padding: 3rem 4rem; background: var(--cream);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }

  .cities-inner { max-width: 1200px; margin: 0 auto; }

  .cities-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 400; color: var(--charcoal);
    margin-bottom: 1.25rem; letter-spacing: -0.01em;
  }

  .cities-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 0.75rem; }

  .city-card {
    border-radius: 12px; overflow: hidden; cursor: pointer;
    border: 1.5px solid var(--border); background: var(--warm-white);
    transition: all 0.2s; padding: 1.1rem 0.9rem;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .city-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--stone2); }

  .city-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--cream2); display: flex; align-items: center;
    justify-content: center; font-size: 18px; margin-bottom: 2px;
  }

  .city-name { font-size: 0.8rem; font-weight: 500; color: var(--charcoal); }
  .city-count { font-size: 0.68rem; color: var(--stone); }

  /* ── How it works ── */
  .hiw-section { padding: 4rem; }
  .hiw-inner { max-width: 900px; margin: 0 auto; text-align: center; }

  .hiw-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 400; color: var(--charcoal);
    margin-bottom: 0.5rem; letter-spacing: -0.01em;
  }

  .hiw-subtitle { font-size: 0.875rem; color: var(--stone); margin-bottom: 3rem; }

  .hiw-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }

  .hiw-step { padding: 2rem 1.5rem; border-radius: 16px; border: 1px solid var(--border); background: var(--warm-white); }

  .hiw-step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem; font-weight: 300; color: var(--cream2);
    line-height: 1; margin-bottom: 1rem;
  }

  .hiw-step-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--cream); display: flex; align-items: center;
    justify-content: center; margin: 0 auto 1rem;
  }

  .hiw-step-title { font-size: 0.95rem; font-weight: 500; color: var(--charcoal); margin-bottom: 0.5rem; }
  .hiw-step-desc { font-size: 0.82rem; color: var(--stone); line-height: 1.6; }

  /* ── Footer ── */
  .footer {
    background: var(--charcoal); color: var(--stone2);
    padding: 3rem 4rem 2rem;
  }

  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 2.5rem; }

  .footer-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; color: var(--cream); margin-bottom: 0.6rem;
  }
  .footer-brand-desc { font-size: 0.8rem; line-height: 1.7; color: var(--stone); max-width: 260px; }

  .footer-col-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--stone); margin-bottom: 1rem; }
  .footer-link { display: block; font-size: 0.8rem; color: var(--stone); margin-bottom: 0.6rem; text-decoration: none; cursor: pointer; transition: color 0.15s; }
  .footer-link:hover { color: var(--cream); }

  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
  .footer-copy { font-size: 0.75rem; }

  /* ── Pagination ── */
  .pagination {
    display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 3rem;
  }
  .page-btn {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1.5px solid var(--border); background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    color: var(--stone); cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .page-btn:hover { background: var(--cream); color: var(--charcoal); }
  .page-btn.active { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── Misc ── */
  .tag-new {
    position: absolute; top: 12px; right: 48px;
    background: #3A6B3A; color: #fff; font-size: 0.6rem;
    font-weight: 500; border-radius: 20px; padding: 3px 8px; letter-spacing: 0.05em;
  }

  .empty-state { text-align: center; padding: 5rem 1rem; color: var(--stone); }
  .empty-state p { font-size: 0.9rem; margin-top: 0.5rem; }

  @media (max-width: 1100px) {
    .navbar, .hero, .search-section, .listings-section, .cities-section, .hiw-section, .footer { padding-left: 2rem; padding-right: 2rem; }
    .hero-inner { grid-template-columns: 1fr; }
    .hero-right { display: none; }
    .listings-grid { grid-template-columns: repeat(2,1fr); }
    .cities-grid { grid-template-columns: repeat(3,1fr); }
    .footer-top { grid-template-columns: 1fr 1fr; }
    .filters-sidebar { display: none; }
  }

  @media (max-width: 640px) {
    .navbar { padding: 0 1.25rem; }
    .nav-links { display: none; }
    .hero { padding: 3rem 1.25rem; }
    .search-section, .listings-section, .cities-section, .hiw-section, .footer { padding-left: 1.25rem; padding-right: 1.25rem; }
    .listings-grid { grid-template-columns: 1fr; }
    .cities-grid { grid-template-columns: repeat(2,1fr); }
    .hiw-steps { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; }
    .search-bar { flex-direction: column; border-radius: 12px; }
    .search-field { border-right: none; border-bottom: 1px solid var(--border2); }
    .search-btn { border-radius: 0 0 10px 10px; padding: 0.9rem; justify-content: center; }
  }
`;

// ── Mock data ──────────────────────────────────────────────────
const LISTINGS = [
  { _id:"1", title:"Sunlit Studio in Malviya Nagar", propertyType:"flat",   location:{city:"Jaipur",  state:"Rajasthan"},  pricing:{basePrice:12000,priceType:"per_month"}, ratings:{average:4.8,count:32}, amenities:["wifi","ac","parking"], roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:380}, isNew:true  },
  { _id:"2", title:"Cozy PG Near IIT Delhi",          propertyType:"pg",     location:{city:"Delhi",   state:"Delhi"},      pricing:{basePrice:8500, priceType:"per_month"}, ratings:{average:4.3,count:18}, amenities:["wifi","meals_included","laundry"], roomInfo:{availableRooms:3,bathrooms:2,areaSqFt:120} },
  { _id:"3", title:"Spacious 2BHK with Garden View",  propertyType:"flat",   location:{city:"Bangalore",state:"Karnataka"}, pricing:{basePrice:22000,priceType:"per_month"}, ratings:{average:4.9,count:47}, amenities:["wifi","ac","gym","parking"], roomInfo:{availableRooms:1,bathrooms:2,areaSqFt:950}, isNew:false },
  { _id:"4", title:"Sea-facing Room, South Goa",      propertyType:"room",   location:{city:"Goa",     state:"Goa"},        pricing:{basePrice:3200, priceType:"per_night"}, ratings:{average:4.7,count:89}, amenities:["wifi","ac"],             roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:280} },
  { _id:"5", title:"Minimalist Hostel — Lower Parel", propertyType:"hostel", location:{city:"Mumbai",  state:"Maharashtra"},pricing:{basePrice:6000, priceType:"per_month"}, ratings:{average:4.1,count:14}, amenities:["wifi","laundry"],        roomInfo:{availableRooms:5,bathrooms:3,areaSqFt:80}  },
  { _id:"6", title:"Hill-view Studio, Old Manali",    propertyType:"room",   location:{city:"Manali",  state:"Himachal"},   pricing:{basePrice:1800, priceType:"per_night"}, ratings:{average:4.6,count:61}, amenities:["wifi","hot_water"],      roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:220}, isNew:true },
  { _id:"7", title:"Heritage Haveli Suite",           propertyType:"villa",  location:{city:"Udaipur", state:"Rajasthan"},  pricing:{basePrice:4500, priceType:"per_night"}, ratings:{average:5.0,count:22}, amenities:["wifi","ac","parking"],   roomInfo:{availableRooms:1,bathrooms:2,areaSqFt:600} },
  { _id:"8", title:"Furnished Room in HSR Layout",    propertyType:"room",   location:{city:"Bangalore",state:"Karnataka"}, pricing:{basePrice:9500, priceType:"per_month"}, ratings:{average:4.4,count:9 }, amenities:["wifi","ac"],             roomInfo:{availableRooms:1,bathrooms:1,areaSqFt:200} },
  { _id:"9", title:"Premium PG — Koregaon Park",      propertyType:"pg",     location:{city:"Pune",    state:"Maharashtra"},pricing:{basePrice:11000,priceType:"per_month"}, ratings:{average:4.6,count:28}, amenities:["wifi","ac","gym","meals_included"], roomInfo:{availableRooms:2,bathrooms:2,areaSqFt:180} },
];

const CITIES = [
  { name:"Jaipur",    icon:"🏯", count:142 },
  { name:"Delhi",     icon:"🌆", count:389 },
  { name:"Mumbai",    icon:"🌊", count:512 },
  { name:"Bangalore", icon:"🌿", count:448 },
  { name:"Goa",       icon:"🏖️", count:96  },
  { name:"Pune",      icon:"🎓", count:203 },
];

const CATEGORIES = [
  { label:"All",     value:"all"    },
  { label:"Room",    value:"room"   },
  { label:"Flat",    value:"flat"   },
  { label:"PG",      value:"pg"     },
  { label:"Hostel",  value:"hostel" },
  { label:"House",   value:"house"  },
  { label:"Villa",   value:"villa"  },
];

const AMENITY_FILTERS = [
  { label:"WiFi",         value:"wifi",          count:387 },
  { label:"AC",           value:"ac",            count:241 },
  { label:"Parking",      value:"parking",       count:198 },
  { label:"Gym",          value:"gym",           count:84  },
  { label:"Meals",        value:"meals_included",count:112 },
  { label:"Laundry",      value:"laundry",       count:156 },
  { label:"Hot Water",    value:"hot_water",     count:329 },
];

// ── Helpers ────────────────────────────────────────────────────
const fmt  = n => "₹" + n.toLocaleString("en-IN");
const stars = n => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

const BADGE_CLS = { room:"badge-room", flat:"badge-flat", pg:"badge-pg", hostel:"badge-hostel", house:"badge-house", villa:"badge-villa" };

function StarRating({ n }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#C05A28" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function Navbar({ scrolled }) {
  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <a className="nav-brand" href="#">
        <div className="nav-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span className="nav-logo-name">Nivaas</span>
      </a>

      <div className="nav-links">
        <a className="nav-link active" href="#">Browse</a>
        <a className="nav-link" href="#">How it works</a>
        <a className="nav-link" href="#">List your space</a>
        <a className="nav-link" href="#">About</a>
      </div>

      <div className="nav-right">
        <button className="btn-ghost">Sign in</button>
        <button className="btn-cta">Get started</button>
      </div>
    </nav>
  );
}

function HeroSection({ onSearch }) {
  return (
    <section className="hero">
      <div className="hero-bg-pattern" />
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-label">
            <span />
            12,000+ verified listings
          </div>
          <h1 className="hero-headline">
            Your <em>perfect</em><br />home awaits
          </h1>
          <p className="hero-desc">
            Discover verified rooms, PGs, flats and villas across India. 
            No brokerage. No hassle. Just your next home.
          </p>
          <div className="hero-cta-row">
            <button className="btn-hero-primary" onClick={onSearch}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Browse listings
            </button>
            <button className="btn-hero-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              See how it works
            </button>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Zero brokerage
            </div>
            <div className="hero-trust-dot" />
            <div className="hero-trust-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Verified owners
            </div>
            <div className="hero-trust-dot" />
            <div className="hero-trust-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Instant booking
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-float hcf-main">
            <div className="hcf-img">
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#EDE8DF,#DDD8CE)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--stone2)" strokeWidth="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div className="hcf-tag">Flat</div>
            </div>
            <div className="hcf-title">Sunlit Studio, Malviya Nagar</div>
            <div className="hcf-loc">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Jaipur, Rajasthan
            </div>
            <div className="hcf-price-row">
              <div className="hcf-price">₹12,000 <sup>/ month</sup></div>
              <div className="hcf-stars">
                {[1,2,3,4,5].map(i => <StarRating key={i} />)}
              </div>
            </div>
          </div>

          <div className="hero-card-float hcf-badge">
            <div className="hcf-badge-row">
              <div className="hcf-badge-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <div className="hcf-badge-title">Verified listing</div>
                <div className="hcf-badge-sub">Owner ID confirmed</div>
              </div>
            </div>
          </div>

          <div className="hero-card-float hcf-stat">
            <div className="hcf-stat-num">48+</div>
            <div className="hcf-stat-label">Cities across India</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar({ search, setSearch, city, setCity, type, setType, onSearch }) {
  return (
    <div className="search-section" id="search">
      <div className="search-wrap">
        <div className="search-bar">
          <div className="search-field">
            <span className="sf-label">Location</span>
            <input className="sf-input" placeholder="City, area or landmark…"
              value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="search-field" style={{ maxWidth: 160 }}>
            <span className="sf-label">Property type</span>
            <select className="sf-select" value={type} onChange={e => setType(e.target.value)}>
              <option value="all">Any type</option>
              <option value="room">Room</option>
              <option value="flat">Flat</option>
              <option value="pg">PG</option>
              <option value="hostel">Hostel</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
          </div>
          <div className="search-field">
            <span className="sf-label">Keyword</span>
            <input className="sf-input" placeholder="WiFi, AC, furnished…"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch()} />
          </div>
          <button className="search-btn" onClick={onSearch}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </button>
        </div>

        <div className="categories">
          {CITIES.slice(0,6).map(c => (
            <button key={c.name} className="cat-pill" onClick={() => setCity(c.name)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FiltersSidebar({ selectedAmenities, setSelectedAmenities, priceMax, setPriceMax, furnishing, setFurnishing }) {
  const toggleAmenity = a => setSelectedAmenities(prev =>
    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
  );

  return (
    <aside className="filters-sidebar">
      <div className="filters-sticky">
        <div className="filter-group">
          <div className="filter-group-title">Price range</div>
          <div className="price-range-wrap">
            <input type="range" className="price-range-input" min="1000" max="50000" step="500"
              value={priceMax} onChange={e => setPriceMax(+e.target.value)}
              style={{ background: `linear-gradient(to right, var(--charcoal) 0%, var(--charcoal) ${((priceMax-1000)/49000*100).toFixed(0)}%, var(--cream2) ${((priceMax-1000)/49000*100).toFixed(0)}%)` }} />
            <div className="price-range-labels"><span>₹1,000</span><span>Up to {fmt(priceMax)}</span></div>
          </div>
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <div className="filter-group-title">Furnishing</div>
          {["unfurnished","semi_furnished","fully_furnished"].map(f => (
            <label key={f} className="filter-check">
              <div className="filter-check-left">
                <input type="checkbox" checked={furnishing.includes(f)} onChange={() =>
                  setFurnishing(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev,f])} />
                {f.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
              </div>
            </label>
          ))}
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <div className="filter-group-title">Amenities</div>
          {AMENITY_FILTERS.map(a => (
            <label key={a.value} className="filter-check">
              <div className="filter-check-left">
                <input type="checkbox" checked={selectedAmenities.includes(a.value)}
                  onChange={() => toggleAmenity(a.value)} />
                {a.label}
              </div>
              <span className="filter-count">{a.count}</span>
            </label>
          ))}
        </div>

        <div className="filter-divider" />

        <div className="filter-group">
          <div className="filter-group-title">Rating</div>
          {[4, 3].map(r => (
            <label key={r} className="filter-check">
              <div className="filter-check-left">
                <input type="checkbox" />
                {"★".repeat(r)}{"☆".repeat(5-r)} & above
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

function PropertyCard({ listing, wishlist, toggleWishlist, idx }) {
  return (
    <div className="prop-card" style={{ animationDelay: `${idx * 0.06}s` }}>
      <div className="card-img">
        <div className="card-img-bg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize:"0.68rem", opacity:0.35 }}>No image</span>
        </div>

        <span className={`card-badge ${BADGE_CLS[listing.propertyType] || "badge-room"}`}>
          {listing.propertyType}
        </span>
        {listing.isNew && <span className="tag-new">New</span>}

        <button className={`card-wishlist${wishlist ? " wishlisted" : ""}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(listing._id); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlist ? "var(--terracotta)" : "none"} stroke={wishlist ? "var(--terracotta)" : "currentColor"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="card-body">
        <div className="card-location">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.location.city}, {listing.location.state}
        </div>
        <div className="card-title">{listing.title}</div>

        <div className="card-info-row">
          {listing.roomInfo.bathrooms && (
            <div className="card-info-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v4M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/></svg>
              {listing.roomInfo.bathrooms} bath
            </div>
          )}
          {listing.roomInfo.areaSqFt && (
            <div className="card-info-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              {listing.roomInfo.areaSqFt} sq.ft
            </div>
          )}
          {listing.roomInfo.availableRooms > 0 && (
            <div className="card-info-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 8h22M1 8l3-5h14l3 5M1 8v12h22V8"/></svg>
              {listing.roomInfo.availableRooms} available
            </div>
          )}
        </div>

        {listing.amenities.length > 0 && (
          <div className="card-amenities">
            {listing.amenities.slice(0, 3).map(a => (
              <span key={a} className="amenity-tag">{a.replace(/_/g," ")}</span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="amenity-tag">+{listing.amenities.length - 3}</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <div>
            <div className="card-price">
              {fmt(listing.pricing.basePrice)}
              <span className="card-price-period"> / {listing.pricing.priceType.replace("per_","")}</span>
            </div>
          </div>
          {listing.ratings.count > 0 ? (
            <div className="card-rating">
              <StarRating />
              {listing.ratings.average}
              <span className="card-rating-count">({listing.ratings.count})</span>
            </div>
          ) : (
            <span style={{ fontSize:"0.7rem", color:"var(--stone2)" }}>New listing</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled,          setScrolled]          = useState(false);
  const [search,            setSearch]            = useState("");
  const [city,              setCity]              = useState("");
  const [type,              setType]              = useState("all");
  const [category,          setCategory]          = useState("all");
  const [sort,              setSort]              = useState("relevance");
  const [viewMode,          setViewMode]          = useState("grid");
  const [wishlist,          setWishlist]          = useState([]);
  const [priceMax,          setPriceMax]          = useState(30000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [furnishing,        setFurnishing]        = useState([]);
  const [page,              setPage]              = useState(1);
  const listingsRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleWishlist = id =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const onSearch = () => listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Filter & sort listings
  const filtered = LISTINGS
    .filter(l => {
      if (category !== "all" && l.propertyType !== category) return false;
      if (type !== "all" && l.propertyType !== type) return false;
      if (city && !l.location.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
          !l.amenities.some(a => a.includes(search.toLowerCase()))) return false;
      if (l.pricing.basePrice > priceMax) return false;
      if (selectedAmenities.length && !selectedAmenities.every(a => l.amenities.includes(a))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc")  return a.pricing.basePrice - b.pricing.basePrice;
      if (sort === "price_desc") return b.pricing.basePrice - a.pricing.basePrice;
      if (sort === "rating")     return b.ratings.average  - a.ratings.average;
      return 0;
    });

  return (
    <>
      <style>{S}</style>
      <div className="home-root">
        <Navbar scrolled={scrolled} />

        <HeroSection onSearch={onSearch} />

        <SearchBar search={search} setSearch={setSearch}
          city={city} setCity={setCity}
          type={type} setType={setType}
          onSearch={onSearch} />

        {/* Cities */}
        <section className="cities-section">
          <div className="cities-inner">
            <h2 className="cities-title">Popular cities</h2>
            <div className="cities-grid">
              {CITIES.map(c => (
                <div className="city-card" key={c.name} onClick={() => { setCity(c.name); onSearch(); }}>
                  <div className="city-icon">{c.icon}</div>
                  <div className="city-name">{c.name}</div>
                  <div className="city-count">{c.count} listings</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Listings */}
        <div ref={listingsRef} style={{ padding: "0 4rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ paddingTop: "2.5rem", paddingBottom: "1.5rem" }}>
              <div className="listings-header">
                <div>
                  <h2 className="listings-title">All listings</h2>
                  <p className="listings-subtitle">{filtered.length} properties found{city ? ` in ${city}` : ""}</p>
                </div>
                <div className="listings-controls">
                  <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="relevance">Most relevant</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                    <option value="rating">Top rated</option>
                  </select>
                  <div className="view-toggle">
                    <button className={`view-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </button>
                    <button className={`view-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category pills */}
              <div className="categories" style={{ marginBottom: "1.5rem" }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} className={`cat-pill${category === c.value ? " active" : ""}`}
                    onClick={() => setCategory(c.value)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="listings-layout">
              <FiltersSidebar
                selectedAmenities={selectedAmenities} setSelectedAmenities={setSelectedAmenities}
                priceMax={priceMax} setPriceMax={setPriceMax}
                furnishing={furnishing} setFurnishing={setFurnishing}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <p>No listings match your filters.</p>
                    <button className="btn-ghost" style={{ marginTop:"1rem" }}
                      onClick={() => { setSearch(""); setCity(""); setType("all"); setCategory("all"); setSelectedAmenities([]); setPriceMax(30000); }}>
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`listings-grid${viewMode === "list" ? " list-view" : ""}`}>
                      {filtered.map((l, i) => (
                        <PropertyCard key={l._id} listing={l} idx={i}
                          wishlist={wishlist.includes(l._id)}
                          toggleWishlist={toggleWishlist} />
                      ))}
                    </div>

                    <div className="pagination">
                      <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p-1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      {[1,2,3].map(p => (
                        <button key={p} className={`page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                      ))}
                      <button className="page-btn" onClick={() => setPage(p => p+1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  </>
                )}
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
                { num:"01", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title:"Search your city", desc:"Browse verified listings by city, type, and budget. Filter by amenities, furnishing, and more." },
                { num:"02", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>, title:"Visit or request a tour", desc:"Schedule a visit or send a booking request directly to the owner. No middlemen involved." },
                { num:"03", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>, title:"Move in with confidence", desc:"Owner confirms, payment is secured, and you get your keys. It's that simple." },
              ].map(s => (
                <div className="hiw-step" key={s.num}>
                  <div className="hiw-step-num">{s.num}</div>
                  <div className="hiw-step-icon">{s.icon}</div>
                  <div className="hiw-step-title">{s.title}</div>
                  <div className="hiw-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand-name">Nivaas</div>
                <p className="footer-brand-desc">Your trusted home rental platform across India. Zero brokerage, verified listings, instant bookings.</p>
              </div>
              <div>
                <div className="footer-col-title">Company</div>
                <a className="footer-link">About us</a>
                <a className="footer-link">How it works</a>
                <a className="footer-link">Careers</a>
                <a className="footer-link">Press</a>
              </div>
              <div>
                <div className="footer-col-title">For owners</div>
                <a className="footer-link">List your property</a>
                <a className="footer-link">Owner dashboard</a>
                <a className="footer-link">Pricing</a>
              </div>
              <div>
                <div className="footer-col-title">Support</div>
                <a className="footer-link">Help centre</a>
                <a className="footer-link">Contact us</a>
                <a className="footer-link">Privacy policy</a>
                <a className="footer-link">Terms of service</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2025 Nivaas. All rights reserved.</span>
              <span>Made with care in India 🇮🇳</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

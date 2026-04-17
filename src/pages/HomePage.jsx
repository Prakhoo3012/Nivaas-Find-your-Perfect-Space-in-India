import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allListings } from "../api/listings.js";
import { CITIES, CITY_ICONS, CATEGORIES, AMENITY_LABEL_MAP } from "../constants/index.js";
import PropertyCard from "../components/home/PropertyCard.jsx";
import FiltersSidebar from "../components/home/FiltersSidebar.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Navbar from "../components/home/Navbar.jsx";

export default function HomePage() {
  const navigate = useNavigate();

  const [scrolled, setScrolled]               = useState(false);
  const [search, setSearch]                   = useState("");
  const [city, setCity]                       = useState("");
  const [category, setCategory]               = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceMax, setPriceMax]               = useState(30000);
  const [wishlist, setWishlist]               = useState([]);
  const [page, setPage]                       = useState(1);
  const [listings, setListings]               = useState([]);
  const [loading, setLoading]                 = useState(true);

  const ITEMS_PER_PAGE = 9;

  // scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // fetch listings
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await allListings();
        console.log("Home Res: ",res.data)
        setListings(res.data.data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, city, category, selectedAmenities, priceMax]);

  const toggleWishlist = (id) =>
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  // ── Filter ─────────────────────────────────────────────────────
  const filtered = listings.filter((l) => {
    const matchCity   = !city || l.location.city.toLowerCase() === city.toLowerCase();
    const matchSearch = !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.city.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "all" || l.propertyType === category;
    const matchPrice  = l.pricing.basePrice <= priceMax;
    const matchAmen   = selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => l.amenities.includes(a));
    return matchCity && matchSearch && matchCat && matchPrice && matchAmen;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // unique cities from real listings — naam, real count, aur icon map se icon
  const uniqueCities = Object.values(
    listings.reduce((acc, l) => {
      const city = l.location?.city;
      if (!city) return acc;
      if (!acc[city]) acc[city] = { name: city, count: 0, icon: CITY_ICONS[city] || "🏙️" };
      acc[city].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count); // sabse zyada listings wali city pehle

  return (
    <div className="home-root">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar scrolled={scrolled}/>

      {loading ? (
        <div style={{ textAlign:"center", padding:"4rem", color:"var(--stone)" }}>
          Loading listings…
        </div>
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="hero">
            <div className="hero-bg-pattern" />
            <div className="hero-inner">
              <div>
                <div className="hero-label"><span />Zero Brokerage · Verified Listings</div>
                <h1 className="hero-headline">Find your<br /><em>perfect</em><br />space in India</h1>
                <p className="hero-desc">
                  From cozy PGs to heritage villas — discover verified, brokerage-free stays across India's finest cities.
                </p>
                <div className="hero-cta-row">
                  <button className="btn-hero-primary" onClick={() => navigate("/")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Browse listings
                  </button>
                  <button className="btn-hero-secondary" onClick={() => navigate("/register-property")}>
                    List your property →
                  </button>
                </div>
                <div className="hero-trust">
                  {["12k+ listings","48+ cities","Zero brokerage","Verified owners"].map((t, i, a) => (
                    <span key={t} className="hero-trust-item">
                      {t}{i < a.length - 1 && <span className="hero-trust-dot" />}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-right">
                <div className="hero-card-float hcf-main">
                  <div className="hcf-img">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--stone2)" strokeWidth="1.2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <div className="hcf-tag">{filtered[0]?.propertyType}</div>
                  </div>
                  <div className="hcf-title">{filtered[0]?.title}</div>
                  <div className="hcf-loc">📍{filtered[0]?.location?.city}, {filtered[0]?.location?.state}</div>
                  <div className="hcf-price-row">
                    <span className="hcf-price">₹ {filtered[0]?.pricing?.basePrice}/night</span>
                    <span style={{ fontSize:"0.7rem", color:"var(--terracotta)" }}>★ 5.0</span>
                  </div>
                </div>
                <div className="hero-card-float hcf-stat">
                  <div className="hcf-stat-num">12k+</div>
                  <div className="hcf-stat-label">Active listings</div>
                </div>
                <div className="hero-card-float hcf-badge">
                  <div className="hcf-badge-row">
                    <div className="hcf-badge-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
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

          {/* ── Search ───────────────────────────────────────── */}
          <div className="search-section">
            <div className="search-wrap">
              <div className="search-bar">
                <div className="search-field">
                  <span className="sf-label">Location</span>
                  <input className="sf-input" placeholder="City, area or landmark"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="search-field">
                  <span className="sf-label">City</span>
                  <select className="sf-select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">All cities</option>
                    {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="search-field">
                  <span className="sf-label">Type</span>
                  <select className="sf-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <button className="search-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Search
                </button>
              </div>
              <div className="categories">
                {CATEGORIES.map((c) => (
                  <button key={c.value}
                    className={`cat-pill${category === c.value ? " active" : ""}`}
                    onClick={() => setCategory(c.value)}
                  >{c.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Cities Strip ─────────────────────────────────── */}
          <section className="cities-section">
            <div className="cities-inner">
              <h2 className="section-heading">Browse by city</h2>
              <p className="section-subheading">Explore verified listings in India's top destinations</p>
              <div className="cities-grid">
                {uniqueCities.map((c) => (
                  <div key={c.name} className="city-card" onClick={() => setCity(c.name)}>
                    <div className="city-icon">{c.icon}</div>
                    <div className="city-name">{c.name}</div>
                    <div className="city-count">{c.count} listing{c.count !== 1 ? "s" : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Listings ─────────────────────────────────────── */}
          <div id="listings" style={{ background:"var(--warm-white)", padding:"2.5rem 4rem" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <div className="listings-header">
                <div>
                  <div className="listings-title">{city ? `Stays in ${city}` : "Featured stays"}</div>
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
                <FiltersSidebar
                  selectedAmenities={selectedAmenities}
                  setSelectedAmenities={setSelectedAmenities}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
                />
                <div style={{ flex:1, minWidth:0 }}>
                  {filtered.length === 0 ? (
                    <div className="empty-state">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <p style={{ marginTop:"0.75rem" }}>No listings match your filters.</p>
                      <button className="btn-ghost" style={{ marginTop:"1rem" }}
                        onClick={() => { setSearch(""); setCity(""); setCategory("all"); setSelectedAmenities([]); setPriceMax(30000); }}>
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="listings-grid">
                        {paginated.map((l, i) => (
                          <PropertyCard
                            key={l._id}
                            listing={l}
                            idx={i}
                            wishlist={wishlist.includes(l._id)}
                            toggleWishlist={toggleWishlist}
                          />
                        ))}
                      </div>
                      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── How it works ─────────────────────────────────── */}
          <section className="hiw-section">
            <div className="hiw-inner">
              <h2 className="hiw-title">Simple as it gets</h2>
              <p className="hiw-subtitle">Find and book your space in three easy steps</p>
              <div className="hiw-steps">
                {[
                  { num:"01", title:"Search your city", desc:"Browse verified listings by city, type, and budget. Filter by amenities, furnishing, and more." },
                  { num:"02", title:"Visit or request a tour", desc:"Schedule a visit or send a booking request directly to the owner. No middlemen involved." },
                  { num:"03", title:"Move in with confidence", desc:"Owner confirms, payment is secured, and you get your keys. It's that simple." },
                ].map((s) => (
                  <div className="hiw-step" key={s.num}>
                    <div className="hiw-step-num">{s.num}</div>
                    <div className="hiw-step-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="1.8">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="hiw-step-title">{s.title}</div>
                    <div className="hiw-step-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────────── */}
          <footer className="h-footer">
            <div className="h-footer-inner">
              <div className="h-footer-top">
                <div>
                  <div className="h-footer-brand-name">Nivaas</div>
                  <p className="h-footer-brand-desc">Your trusted home rental platform across India. Zero brokerage, verified listings, instant bookings.</p>
                </div>
                <div>
                  <div className="h-footer-col-title">Company</div>
                  {["About us","How it works","Careers","Press"].map((l) => <a key={l} className="h-footer-link">{l}</a>)}
                </div>
                <div>
                  <div className="h-footer-col-title">For owners</div>
                  {["List your property","Owner dashboard","Pricing"].map((l) => <a key={l} className="h-footer-link">{l}</a>)}
                </div>
                <div>
                  <div className="h-footer-col-title">Support</div>
                  {["Help centre","Contact us","Privacy policy","Terms of service"].map((l) => <a key={l} className="h-footer-link">{l}</a>)}
                </div>
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

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../api/listings";
import { fmt } from "../utils/helpers";
import { AMENITY_DETAIL_LABELS } from "../constants";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function PropertyDetailPage() {
  const { id } = useParams(); // /property/:id  ← id comes from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const currDate = new Date()
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(currDate);
  const [checkOut, setCheckOut] = useState(currDate);
  const [toasts, setToasts] = useState([]);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [priceType, setPriceType] = useState("per_month");

  const getBookingData = () => {
    return {
      propertyId: listing._id,
      checkIn,
      checkOut,
      adults: guests,

      // pricing (optional but recommended)
      pricePerNight: listing.pricing?.basePrice || 0,
      nights,
      baseTotal,
      cleaningFee: cleanFee,
      total,

      // optional metadata
      bookingType: priceType,
    };
  };

  // ── Fetch listing by ID from URL ─────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getListingById(id); // GET /property/:id via axios
        setListing(res.data.data ?? res.data); // adjust to your API shape
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Property not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 4000);
  };

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      addToast("Please select dates ❌");
      return;
    }

    if(!user) {
      navigate("/auth");
      return;
    }

    try {
      setBooking(true);

      const bookingData = getBookingData();

      const res = await api.post("booking/create-booking", bookingData);

      setBooked(true);
      addToast("Booking request sent! 🎉");
    } catch (err) {
      console.error(err);
      addToast("Booking failed ❌");
    } finally {
      setBooking(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="detail-root">
        <div className="detail-loading">
          <svg
            className="spinner-icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>Loading property…</span>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (error || !listing) {
    return (
      <div className="detail-root">
        <div className="detail-loading">
          <p style={{ color: "var(--terracotta)" }}>
            {error || "Property not found."}
          </p>
          <button
            className="btn-ghost"
            style={{ marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            ← Back to listings
          </button>
        </div>
      </div>
    );
  }

  // ── Booking calc ─────────────────────────────────────────────
  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000),
  );
  const baseTotal = (listing.pricing?.basePrice || 0) * nights;
  const cleanFee = listing.pricing?.cleaningFee || 0;
  const total = baseTotal + cleanFee;

  return (
    <div className="detail-root">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className={`d-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="d-nav-left">
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="d-brand">
            <div className="d-brand-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F7F3EC"
                strokeWidth="2.2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="d-brand-name">Nivaas</span>
          </div>
        </div>
        <div className="d-nav-right">
          <button
            className={`icon-btn${wishlisted ? " wishlisted" : ""}`}
            onClick={() => {
              setWishlisted((w) => !w);
              addToast(
                wishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️",
              );
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Gallery ──────────────────────────────────────────── */}
      <div
        className="gallery-wrap"
        style={{ paddingTop: "1.5rem", marginBottom: "2rem" }}
      >
        <div className="gallery-grid">
          {/* Main */}
          <div className="gallery-main">
            <img src={listing.images[0].url} className="gallery-img" />
            <button className="gallery-all-btn">Show all photos</button>
          </div>

          {/* Right side images (only 2 needed) */}
          {listing?.images?.slice(1, 3).map((img, i) => (
            <div key={i} className="gallery-thumb">
              <img src={img.url} className="gallery-img" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Detail Layout ─────────────────────────────────────── */}
      <div className="detail-layout">
        <div className="detail-left">
          {/* Header */}
          <div className="property-type-pill">{listing.propertyType}</div>
          <h1 className="property-title">{listing.title}</h1>
          <div className="property-meta-row">
            <div className="meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {listing.location?.address && `${listing.location.address}, `}
              {listing.location?.city}, {listing.location?.state}
            </div>
            <span className="meta-dot" />
            {listing.ratings?.count > 0 && (
              <div className="rating-badge">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="var(--terracotta)"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {listing.ratings.average} · {listing.ratings.count} reviews
              </div>
            )}
          </div>

          {/* Quick facts */}
          <div className="quick-facts" style={{ marginBottom: "1.75rem" }}>
            {[
              {
                label: "Bedrooms",
                value:
                  listing.roomInfo?.totalRooms ??
                  listing.roomInfo?.availableRooms ??
                  "—",
              },
              { label: "Bathrooms", value: listing.roomInfo?.bathrooms ?? "—" },
              {
                label: "Max Guests",
                value: listing.roomInfo?.maxGuests ?? "—",
              },
              { label: "Sq. ft.", value: listing.roomInfo?.areaSqFt ?? "—" },
            ].map((f) => (
              <div key={f.label} className="fact-card">
                <div className="fact-value">{f.value}</div>
                <div className="fact-label">{f.label}</div>
              </div>
            ))}
          </div>

          <div className="section-divider" />

          {/* Description */}
          {listing.description && (
            <>
              <h2 className="sec-title">About this space</h2>
              <p className={`description-text${expanded ? "" : " clamped"}`}>
                {listing.description}
              </p>
              <button
                className="read-more-btn"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? "Show less ↑" : "Read more ↓"}
              </button>
              <div className="section-divider" />
            </>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <>
              <h2 className="sec-title">What's included</h2>
              <div className="amenities-grid">
                {listing.amenities.map((a) => (
                  <div key={a} className="amenity-item">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {AMENITY_DETAIL_LABELS[a] || a}
                  </div>
                ))}
              </div>
              <div className="section-divider" />
            </>
          )}

          {/* Owner */}
          {listing.owner && (
            <>
              <h2 className="sec-title">Hosted by</h2>
              <div className="owner-card">
                <div className="owner-top">
                  <div className="owner-avatar-lg">
                    {listing.owner.initials ||
                      listing.owner.fullName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: "var(--charcoal)",
                      }}
                    >
                      {listing.owner.fullName}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--stone)" }}>
                      Owner since {listing.owner.createdAt.split("T")[0]}
                    </div>
                    {listing.owner.isVerified && (
                      <div className="owner-verified">✓ Verified host</div>
                    )}
                  </div>
                </div>
                <div className="owner-stats">
                  {[
                    {
                      val: listing.owner?.responseRate || "00:00" + "%",
                      label: "Response rate",
                    },
                    {
                      val: listing.owner.responseTime || "00:00",
                      label: "Response time",
                    },
                    {
                      val: listing.owner.totalListings || "00:00",
                      label: "Listings",
                    },
                  ].map((s, i) => (
                    <div key={i} className="owner-stat">
                      <div className="owner-stat-val">{s.val}</div>
                      <div className="owner-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <button className="contact-owner-btn">Message owner</button>
              </div>
              <div className="section-divider" />
            </>
          )}

          {/* Reviews */}
          {listing.reviews?.length > 0 && (
            <>
              <h2 className="sec-title">Guest reviews</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "Cormorant Garamond,serif",
                    fontSize: "3rem",
                    color: "var(--charcoal)",
                    lineHeight: 1,
                  }}
                >
                  {listing.ratings.average.toFixed(1)}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="var(--terracotta)"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--stone)" }}>
                    {listing.ratings.count} reviews
                  </div>
                </div>
              </div>
              <div className="reviews-grid">
                {listing.reviews.map((r) => (
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
              <div className="section-divider" />
            </>
          )}

          {/* Location */}
          <h2 className="sec-title">Location</h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--stone)",
              marginBottom: "1rem",
            }}
          >
            {listing.location?.address && `${listing.location.address}, `}
            {listing.location?.city}, {listing.location?.state}
          </p>
          <div className="map-placeholder">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Map — {listing.location?.city}, {listing.location?.state}
          </div>
        </div>

        {/* ── Booking Card ────────────────────────────────────── */}
        <div>
          <div className="booking-card">
            {booked ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(94,114,82,0.1)",
                    border: "2px solid rgba(94,114,82,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--sage)"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond,serif",
                    fontSize: "1.5rem",
                    color: "var(--charcoal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Request sent!
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
                  The owner will respond{" "}
                  {listing.owner?.responseTime
                    ? `within ${listing.owner.responseTime}`
                    : "shortly"}
                  .
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
                  Visit your dashboard
                </p>
                <button
                  style={{
                    marginTop: "1.25rem",
                    padding: "0.6rem 1.25rem",
                    borderRadius: 9,
                    border: "1.5px solid var(--border)",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                    fontSize: "0.82rem",
                  }}
                  onClick={() => setBooked(false)}
                >
                  Modify dates
                </button>
              </div>
            ) : (
              <>
                <div className="booking-price-row">
                  <span className="booking-price">
                    {fmt(listing.pricing?.basePrice || 0)}
                  </span>
                  <span className="booking-price-period">
                    /{" "}
                    {listing.pricing?.priceType?.replace("per_", "") || "night"}
                  </span>
                </div>
                <div className="booking-dates">
                  <div className="date-row">
                    <div className="date-field">
                      <div className="date-field-label">Check in</div>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div className="date-field">
                      <div className="date-field-label">Check out</div>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="guests-field">
                  <div>
                    <div className="guests-field-label">Guests</div>
                    <div
                      style={{ fontSize: "0.875rem", color: "var(--charcoal)" }}
                    >
                      {guests} guest{guests > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="guests-counter">
                    <button
                      className="counter-btn"
                      disabled={guests <= 1}
                      onClick={() => setGuests((g) => g - 1)}
                    >
                      −
                    </button>
                    <span className="counter-val">{guests}</span>
                    <button
                      className="counter-btn"
                      disabled={guests >= (listing.roomInfo?.maxGuests || 10)}
                      onClick={() => setGuests((g) => g + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="guests-field">
                  <div>
                    <div className="guests-field-label">Pricing Type: </div>
                    <div
                      style={{ fontSize: "0.875rem", color: "var(--charcoal)" }}
                    >
                      {priceType.replace("per_", "").toUpperCase()}
                    </div>
                  </div>

                  <div className="price-type-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="priceType"
                        value="per_night"
                        checked={priceType === "per_night"}
                        onChange={(e) => setPriceType(e.target.value)}
                      />
                      Per Night
                    </label>

                    <label className="radio-option">
                      <input
                        type="radio"
                        name="priceType"
                        value="per_day"
                        checked={priceType === "per_day"}
                        onChange={(e) => setPriceType(e.target.value)}
                      />
                      Per Day
                    </label>

                    <label className="radio-option">
                      <input
                        type="radio"
                        name="priceType"
                        value="per_month"
                        checked={priceType === "per_month"}
                        onChange={(e) => setPriceType(e.target.value)}
                      />
                      Per Month
                    </label>
                  </div>
                </div>
                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>
                      {fmt(listing.pricing?.basePrice || 0)} × {nights} night
                      {nights > 1 ? "s" : ""}
                    </span>
                    <span>{fmt(baseTotal)}</span>
                  </div>
                  {cleanFee > 0 && (
                    <div className="breakdown-row">
                      <span>Cleaning fee</span>
                      <span>{fmt(cleanFee)}</span>
                    </div>
                  )}
                  <div className="breakdown-row total">
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
                <button
                  className="book-btn"
                  onClick={handleBook}
                  disabled={booking}
                >
                  {booking ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Processing…
                    </>
                  ) : (
                    "Request to book"
                  )}
                </button>
                <p className="book-note">You won't be charged yet</p>
                {listing.pricing?.securityDeposit > 0 && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem",
                      background: "var(--cream)",
                      borderRadius: 10,
                      fontSize: "0.75rem",
                      color: "var(--stone)",
                    }}
                  >
                    Security deposit of{" "}
                    <strong style={{ color: "var(--charcoal)" }}>
                      {fmt(listing.pricing.securityDeposit)}
                    </strong>{" "}
                    collected at check-in. Fully refundable.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Toasts ───────────────────────────────────────────── */}
      <div className="detail-toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`detail-toast ${t.type}`}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

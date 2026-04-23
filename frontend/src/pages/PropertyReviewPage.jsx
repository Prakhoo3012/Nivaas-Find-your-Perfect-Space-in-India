import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { fmtDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

// ─── Star Rating ───────────────────────────────────────────────
function StarRating({ value, onChange, size = "2rem", readonly = false }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          style={{
            background: "none",
            border: "none",
            cursor: readonly ? "default" : "pointer",
            fontSize: size,
            color: star <= (hovered ?? value) ? "#E8C96E" : "var(--d-bg4, #2a2a2a)",
            transition: "color 0.12s, transform 0.1s",
            transform: !readonly && hovered === star ? "scale(1.2)" : "scale(1)",
            padding: "0 2px",
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Category Rating Row ───────────────────────────────────────
function CategoryRow({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.65rem 0",
        borderBottom: "1px solid var(--d-border, #222)",
      }}
    >
      <span style={{ fontSize: "0.82rem", color: "var(--d-text2, #aaa)" }}>
        {label}
      </span>
      <StarRating value={value} onChange={onChange} size="1.2rem" />
    </div>
  );
}

// ─── Existing Review Card ──────────────────────────────────────
function ReviewCard({ review, index }) {
  const initials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        background: "var(--d-bg2, #141414)",
        border: "1px solid var(--d-border, #222)",
        borderRadius: 14,
        padding: "1.25rem 1.5rem",
        animation: `fadeUp 0.4s ease ${index * 0.07}s both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: "0.85rem" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.1)",
            border: "1.5px solid rgba(200,169,110,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1rem",
            color: "var(--gold, #C8A96E)",
            flexShrink: 0,
          }}
        >
          {initials(review.tenant?.fullName || review.author || "A")}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--d-text, #f0f0f0)", marginBottom: 2 }}>
                {review.tenant?.fullName || review.author || "Anonymous"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--d-text3, #666)" }}>
                {review.createdAt ? fmtDate(review.createdAt) : ""}
              </div>
            </div>
            <StarRating value={review.rating} size="0.95rem" readonly />
          </div>
        </div>
      </div>

      {review.text && (
        <p style={{ fontSize: "0.84rem", color: "var(--d-text2, #aaa)", lineHeight: 1.7, margin: 0 }}>
          {review.text}
        </p>
      )}

      {/* Category breakdowns if present */}
      {review.categories && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.85rem",
          }}
        >
          {Object.entries(review.categories).map(([k, v]) => (
            <span
              key={k}
              style={{
                fontSize: "0.68rem",
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--d-bg3, #1a1a1a)",
                border: "1px solid var(--d-border, #222)",
                color: "var(--d-text3, #666)",
              }}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}: {v}★
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isOk = toast.type !== "error";
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "0.75rem 1.2rem",
        borderRadius: 11,
        background: isOk ? "rgba(78,124,95,0.96)" : "rgba(139,64,64,0.96)",
        border: `1px solid ${isOk ? "rgba(78,124,95,0.45)" : "rgba(139,64,64,0.45)"}`,
        color: "#fff",
        fontSize: "0.82rem",
        fontWeight: 500,
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        animation: "toastIn 0.3s ease both",
        fontFamily: "DM Sans, sans-serif",
        maxWidth: 320,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: isOk ? "rgba(106,191,133,0.25)" : "rgba(224,112,112,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6rem",
          flexShrink: 0,
        }}
      >
        {isOk ? "✓" : "✕"}
      </span>
      {toast.msg}
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────
function Skeleton({ h = 16, w = "100%", r = 6, style: sx }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: r,
        background: "linear-gradient(90deg,var(--d-bg3,#1a1a1a) 25%,var(--d-bg4,#222) 50%,var(--d-bg3,#1a1a1a) 75%)",
        backgroundSize: "400px 100%",
        animation: "shimmer 1.4s infinite",
        ...sx,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function PropertyReviewPage() {
  const { id } = useParams(); // /review/:id  (propertyId)
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Property info ────────────────────────────────────────────
  const [property, setProperty] = useState(null);
  const [propLoading, setPropLoading] = useState(true);

  // ── Existing reviews ─────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ── Form state ───────────────────────────────────────────────
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [categories, setCategories] = useState({
    cleanliness: 0,
    location: 0,
    value: 0,
    amenities: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Toast ────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch property ───────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setPropLoading(true);
      try {
        const res = await api.get(`/properties/get-property/${id}`);
        setProperty(res.data?.data ?? res.data);
      } catch {
        // silently fallback — property info is decorative
      } finally {
        setPropLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Fetch existing reviews ────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setReviewsLoading(true);
      try {
        const res = await api.get(`/review/property/${id}`);
        const data = res.data?.data ?? res.data;
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Avg rating ───────────────────────────────────────────────
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!rating) return showToast("Please select an overall rating ★", "error");
    if (!text.trim()) return showToast("Please write a short review", "error");
    if (!user) {
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        propertyId: id,
        rating,
        text: text.trim(),
        categories: Object.values(categories).some((v) => v > 0) ? categories : undefined,
      };
      const res = await api.post("/review/create", payload);
      const newReview = res.data?.data ?? { ...payload, tenant: { fullName: user.fullName }, createdAt: new Date().toISOString() };
      setReviews((prev) => [newReview, ...prev]);
      setSubmitted(true);
      showToast("Review submitted! Thank you 🎉");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit review.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabel = ["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating] || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--d-bg, #0E0F0D)",
        color: "var(--d-text, #F0EDE6)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { background-position: -400px 0; }
          to   { background-position: 400px 0; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .review-textarea:focus { outline: none; border-color: rgba(200,169,110,0.5) !important; box-shadow: 0 0 0 3px rgba(200,169,110,0.08); }
        .review-textarea::placeholder { color: var(--d-text3, #555); }
      `}</style>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 58,
          borderBottom: "1px solid var(--d-border, #222)",
          background: "rgba(14,15,13,0.95)",
          backdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          padding: "0 2rem",
          gap: 14,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "1px solid var(--d-border, #222)",
            borderRadius: 8,
            padding: "0.32rem 0.8rem",
            color: "var(--d-text2, #aaa)",
            cursor: "pointer",
            fontSize: "0.76rem",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.15s",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div style={{ width: 1, height: 16, background: "var(--d-border, #222)" }} />

        <span
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.05rem",
            color: "var(--d-text, #f0f0f0)",
          }}
        >
          Reviews
        </span>

        {property && (
          <>
            <div style={{ width: 1, height: 16, background: "var(--d-border, #222)" }} />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--d-text3, #666)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 220,
              }}
            >
              {property.title}
            </span>
          </>
        )}

        <div style={{ flex: 1 }} />

        {avgRating && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.78rem",
              color: "var(--gold, #C8A96E)",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>★</span>
            {avgRating}
            <span style={{ color: "var(--d-text3, #666)", fontWeight: 400 }}>
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "2.5rem 1.75rem 6rem",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "2rem",
          alignItems: "start",
        }}
      >

        {/* ══ LEFT — existing reviews ══ */}
        <div>
          {/* Property header */}
          <div style={{ marginBottom: "2rem", animation: "fadeUp 0.4s ease both" }}>
            {propLoading ? (
              <>
                <Skeleton h={14} w="40%" sx={{ marginBottom: 10 }} />
                <Skeleton h={28} w="75%" sx={{ marginBottom: 8 }} />
                <Skeleton h={12} w="35%" />
              </>
            ) : property ? (
              <>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--terracotta, #C05A28)",
                    background: "rgba(192,90,40,0.08)",
                    border: "1px solid rgba(192,90,40,0.18)",
                    borderRadius: 20,
                    padding: "2px 10px",
                    display: "inline-block",
                    marginBottom: 10,
                  }}
                >
                  {property.propertyType}
                </span>
                <h1
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--d-text, #f0f0f0)",
                    lineHeight: 1.15,
                    margin: "0 0 8px",
                  }}
                >
                  {property.title}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.76rem", color: "var(--d-text3, #666)" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {[property.location?.area, property.location?.city, property.location?.state].filter(Boolean).join(", ")}
                </div>
              </>
            ) : null}
          </div>

          {/* Reviews list header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--d-text3, #666)",
              }}
            >
              {reviewsLoading ? "Loading reviews…" : `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}`}
            </div>

            {avgRating && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StarRating value={Math.round(avgRating)} size="1rem" readonly />
                <span style={{ fontSize: "0.82rem", color: "var(--d-text2, #aaa)" }}>
                  {avgRating} avg
                </span>
              </div>
            )}
          </div>

          {/* Reviews */}
          {reviewsLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--d-bg2, #141414)",
                    border: "1px solid var(--d-border, #222)",
                    borderRadius: 14,
                    padding: "1.25rem 1.5rem",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <Skeleton h={40} w={40} r={50} />
                    <div style={{ flex: 1 }}>
                      <Skeleton h={13} w="40%" sx={{ marginBottom: 6 }} />
                      <Skeleton h={10} w="25%" />
                    </div>
                  </div>
                  <Skeleton h={11} w="100%" sx={{ marginBottom: 6 }} />
                  <Skeleton h={11} w="80%" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                background: "var(--d-bg2, #141414)",
                border: "1px solid var(--d-border, #222)",
                borderRadius: 14,
                padding: "3rem 2rem",
                textAlign: "center",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>✦</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--d-text, #f0f0f0)", marginBottom: 6 }}>
                No reviews yet
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--d-text3, #666)" }}>
                Be the first to share your experience.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map((r, i) => (
                <ReviewCard key={r._id || i} review={r} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ══ RIGHT — write a review ══ */}
        <div style={{ position: "sticky", top: 72 }}>
          {submitted ? (
            /* Success state */
            <div
              style={{
                background: "var(--d-bg2, #141414)",
                border: "1px solid var(--d-border, #222)",
                borderRadius: 14,
                padding: "2.5rem 1.75rem",
                textAlign: "center",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(78,124,95,0.12)",
                  border: "2px solid rgba(78,124,95,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  animation: "popIn 0.5s ease both",
                  fontSize: "1.6rem",
                  color: "#6abf85",
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.4rem",
                  color: "var(--d-text, #f0f0f0)",
                  marginBottom: 8,
                }}
              >
                Review submitted!
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--d-text3, #666)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                Thank you for sharing your experience. Your feedback helps others make informed decisions.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setText("");
                  setCategories({ cleanliness: 0, location: 0, value: 0, amenities: 0 });
                }}
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  borderRadius: 9,
                  background: "var(--d-bg3, #1a1a1a)",
                  border: "1px solid var(--d-border, #222)",
                  color: "var(--d-text2, #aaa)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Write another review
              </button>
            </div>
          ) : (
            /* Form */
            <div
              style={{
                background: "var(--d-bg2, #141414)",
                border: "1px solid var(--d-border, #222)",
                borderRadius: 14,
                overflow: "hidden",
                animation: "fadeUp 0.4s ease 0.1s both",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--d-border, #222)",
                  background: "var(--d-bg3, #1a1a1a)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--d-text3, #666)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 3,
                  }}
                >
                  Share your experience
                </div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.25rem",
                    color: "var(--d-text, #f0f0f0)",
                  }}
                >
                  Write a Review
                </div>
              </div>

              <div style={{ padding: "1.25rem 1.5rem" }}>

                {/* Overall rating */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--d-text3, #666)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 10,
                    }}
                  >
                    Overall rating *
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <StarRating value={rating} onChange={setRating} size="1.75rem" />
                    {ratingLabel && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--gold, #C8A96E)",
                          fontWeight: 500,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {ratingLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category ratings */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--d-text3, #666)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                    }}
                  >
                    Rate by category
                  </div>
                  <CategoryRow
                    label="Cleanliness"
                    value={categories.cleanliness}
                    onChange={(v) => setCategories((c) => ({ ...c, cleanliness: v }))}
                  />
                  <CategoryRow
                    label="Location"
                    value={categories.location}
                    onChange={(v) => setCategories((c) => ({ ...c, location: v }))}
                  />
                  <CategoryRow
                    label="Value for money"
                    value={categories.value}
                    onChange={(v) => setCategories((c) => ({ ...c, value: v }))}
                  />
                  <CategoryRow
                    label="Amenities"
                    value={categories.amenities}
                    onChange={(v) => setCategories((c) => ({ ...c, amenities: v }))}
                  />
                </div>

                {/* Review text */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--d-text3, #666)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 8,
                    }}
                  >
                    Your review *
                  </div>
                  <textarea
                    className="review-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share what you loved, what could be better, and tips for future guests…"
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "0.75rem 0.9rem",
                      background: "var(--d-bg3, #1a1a1a)",
                      border: "1px solid var(--d-border, #222)",
                      borderRadius: 10,
                      color: "var(--d-text, #f0f0f0)",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "0.84rem",
                      resize: "vertical",
                      boxSizing: "border-box",
                      lineHeight: 1.65,
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: text.length > 480 ? "#e07070" : "var(--d-text3, #666)",
                      textAlign: "right",
                      marginTop: 4,
                    }}
                  >
                    {text.length}/500
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !rating || !text.trim()}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    background:
                      submitting || !rating || !text.trim()
                        ? "var(--d-bg3, #1a1a1a)"
                        : "var(--gold, #C8A96E)",
                    border: "none",
                    color:
                      submitting || !rating || !text.trim()
                        ? "var(--d-text3, #666)"
                        : "#1a1200",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor:
                      submitting || !rating || !text.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {submitting ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      >
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </button>

                {!user && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--d-text3, #666)",
                      textAlign: "center",
                      marginTop: "0.75rem",
                    }}
                  >
                    You'll be asked to{" "}
                    <span
                      style={{ color: "var(--gold, #C8A96E)", cursor: "pointer" }}
                      onClick={() => navigate("/auth")}
                    >
                      sign in
                    </span>{" "}
                    before submitting.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

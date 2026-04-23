import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { fmt, fmtDate } from "../utils/helpers";

// ─── Helpers ──────────────────────────────────────────────────
function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function daysBetween(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}

// ─── Status config ────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: {
    color: "#3A5F8B",
    label: "Confirmed",
    dot: "#4A8FC8",
    bg: "rgba(58,95,139,0.1)",
    border: "rgba(58,95,139,0.25)",
  },
  pending: {
    color: "#8B6B2E",
    label: "Pending",
    dot: "#C4912A",
    bg: "rgba(139,107,46,0.1)",
    border: "rgba(139,107,46,0.25)",
  },
  completed: {
    color: "#4E7C5F",
    label: "Completed",
    dot: "#6abf85",
    bg: "rgba(78,124,95,0.1)",
    border: "rgba(78,124,95,0.25)",
  },
  cancelled: {
    color: "#8B4040",
    label: "Cancelled",
    dot: "#e07070",
    bg: "rgba(139,64,64,0.1)",
    border: "rgba(139,64,64,0.25)",
  },
  rejected: {
    color: "#8B4040",
    label: "Rejected",
    dot: "#e07070",
    bg: "rgba(139,64,64,0.1)",
    border: "rgba(139,64,64,0.25)",
  },
};

// ─── Mock booking fallback ─────────────────────────────────────
const MOCK_BOOKING = {
  _id: "664f2a1b3e9c8a001b2c3d4e",
  status: "confirmed",
  bookingType: "per_month",
  checkIn: "2025-09-01",
  checkOut: "2025-09-30",
  createdAt: "2025-08-12T09:15:00Z",
  guests: { adults: 2, children: 1 },
  priceBreakdown: {
    baseAmount: 14000,
    cleaningFee: 800,
    securityDeposit: 7000,
    totalAmount: 21800,
  },
  property: {
    _id: "prop_01",
    title: "Sunlit Studio in Malviya Nagar",
    propertyType: "flat",
    location: { city: "Jaipur", state: "Rajasthan", area: "Malviya Nagar" },
    pricing: { basePrice: 14000, priceType: "per_month" },
    amenities: ["wifi", "ac", "parking", "power_backup", "hot_water"],
    roomInfo: { areaSqFt: 480, bathrooms: 2, bedrooms: 2, totalRooms: 4 },
    owner: {
      fullName: "Anjali Mehra",
      phone: "+91 98765 43210",
      email: "anjali.mehra@example.com",
    },
  },
  tenant: {
    fullName: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    phone: "+91 91234 56789",
  },
  review: null,
};

const AMENITY_META = {
  wifi: { icon: "◈", label: "WiFi" },
  ac: { icon: "❄", label: "AC" },
  parking: { icon: "⊡", label: "Parking" },
  gym: { icon: "◉", label: "Gym" },
  meals_included: { icon: "⊕", label: "Meals" },
  laundry: { icon: "○", label: "Laundry" },
  hot_water: { icon: "◎", label: "Hot Water" },
  power_backup: { icon: "⚡", label: "Power Backup" },
  security: { icon: "◈", label: "Security" },
};

// ─── Primitives ───────────────────────────────────────────────
function StatusBadge({ status, large }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: large ? "6px 16px" : "4px 12px",
        borderRadius: 20,
        fontSize: large ? "0.78rem" : "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        background: cfg.bg,
        color: cfg.dot,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value, accent, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.55rem 0",
        borderBottom: "1px solid var(--d-border)",
      }}
    >
      <span
        style={{ fontSize: "0.76rem", color: "var(--d-text3)", flexShrink: 0 }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.82rem",
          fontWeight: 500,
          color: accent || "var(--d-text)",
          fontFamily: mono ? "monospace" : "inherit",
          textAlign: "right",
          marginLeft: "1rem",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Card({ children, style, delay = 0 }) {
  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: "1.25rem",
        animation: `fadeUp 0.4s ease ${delay}s both`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, right, icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.9rem 1.25rem",
        borderBottom: "1px solid var(--d-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && (
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "var(--d-bg3)",
              border: "1px solid var(--d-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.65rem",
              color: "var(--d-text3)",
            }}
          >
            {icon}
          </span>
        )}
        <span
          style={{
            fontSize: "0.84rem",
            fontWeight: 500,
            color: "var(--d-text)",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

function CardBody({ children, pad = "1rem 1.25rem" }) {
  return <div style={{ padding: pad }}>{children}</div>;
}

// ─── Skeleton ─────────────────────────────────────────────────
function Skeleton({ h = 18, w = "100%", r = 6, style }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: r,
        background:
          "linear-gradient(90deg,var(--d-bg3) 25%,var(--d-bg4) 50%,var(--d-bg3) 75%)",
        backgroundSize: "400px 100%",
        animation: "shimmer 1.4s infinite",
        ...style,
      }}
    />
  );
}

function SkeletonCard({ lines = 4 }) {
  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        padding: "1.25rem",
        marginBottom: "1.25rem",
      }}
    >
      <Skeleton h={14} w="38%" style={{ marginBottom: 18 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          h={12}
          w={i % 3 === 2 ? "70%" : "100%"}
          style={{ marginBottom: 10 }}
        />
      ))}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────
function TimelineStep({ label, date, done, active, last }) {
  const color = done ? "#6abf85" : active ? "var(--gold)" : "var(--d-text3)";
  return (
    <div style={{ display: "flex", gap: 12, position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          width: 28,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: done
              ? "rgba(78,124,95,0.12)"
              : active
                ? "rgba(200,169,110,0.12)"
                : "var(--d-bg3)",
            border: `1.5px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.68rem",
            color,
            fontWeight: 700,
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          {done ? "✓" : active ? "●" : "○"}
        </div>
        {!last && (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 20,
              marginTop: 4,
              background: done ? "rgba(106,191,133,0.3)" : "var(--d-border)",
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: 5, paddingBottom: last ? 0 : 16 }}>
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: done || active ? 500 : 400,
            color,
          }}
        >
          {label}
        </div>
        {date && (
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--d-text3)",
              marginTop: 3,
            }}
          >
            {date}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Avatar circle ────────────────────────────────────────────
function Avatar({ name, accent = "gold", size = 44 }) {
  const colors = {
    gold: {
      bg: "rgba(200,169,110,0.12)",
      border: "rgba(200,169,110,0.28)",
      text: "var(--gold)",
    },
    terracotta: {
      bg: "rgba(192,90,40,0.12)",
      border: "rgba(192,90,40,0.28)",
      text: "var(--terracotta)",
    },
    sage: {
      bg: "rgba(94,114,82,0.12)",
      border: "rgba(94,114,82,0.28)",
      text: "var(--sage2)",
    },
  };
  const c = colors[accent] || colors.gold;
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: "50%",
        background: "rgba(192,90,40,0.12)",
        border: "1.5px solid rgba(192,90,40,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "1.1rem",
        color: "var(--terracotta)",
      }}
    >
      {initials(name)}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "0.85rem 0",
      }}
    >
      {label && (
        <span
          style={{
            fontSize: "0.65rem",
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      )}
      <div style={{ height: 1, flex: 1, background: "var(--d-border)" }} />
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────
function StarRating({ value, onChange, size = "1.4rem" }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: "none",
            border: "none",
            cursor: onChange ? "pointer" : "default",
            fontSize: size,
            color: star <= (hovered ?? value) ? "#E8C96E" : "var(--d-bg4)",
            transition: "color 0.12s, transform 0.1s",
            transform: hovered === star ? "scale(1.15)" : "scale(1)",
            padding: "0 1px",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
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
          background: isOk
            ? "rgba(106,191,133,0.25)"
            : "rgba(224,112,112,0.25)",
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

// ─── Cancel Modal ─────────────────────────────────────────────
function CancelModal({ property, onConfirm, onClose, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(5px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "var(--d-bg2)",
          border: "1px solid var(--d-border)",
          borderRadius: 18,
          padding: "2rem 1.75rem",
          width: 420,
          maxWidth: "100%",
          animation: "fadeUp 0.2s ease both",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(139,64,64,0.12)",
            border: "1px solid rgba(139,64,64,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            fontSize: "1.1rem",
          }}
        >
          ✕
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.5rem",
            color: "var(--d-text)",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          Cancel this booking?
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--d-text2)",
            lineHeight: 1.65,
            marginBottom: "1.5rem",
          }}
        >
          You are about to cancel your booking at{" "}
          <strong style={{ color: "var(--d-text)", fontWeight: 500 }}>
            {property?.title}
          </strong>
          . This action is permanent and cannot be undone.
        </p>

        <div
          style={{
            background: "rgba(139,64,64,0.07)",
            border: "1px solid rgba(139,64,64,0.15)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#e07070",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            ⚠ Cancellation notice
          </div>
          <div
            style={{
              fontSize: "0.76rem",
              color: "var(--d-text3)",
              lineHeight: 1.55,
            }}
          >
            Refunds are subject to the property's cancellation policy. Please
            review the terms before proceeding.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: 10,
              background: "var(--d-bg3)",
              border: "1px solid var(--d-border)",
              color: "var(--d-text2)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Keep booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: 10,
              background: loading ? "var(--d-bg4)" : "rgba(139,64,64,0.85)",
              border: "none",
              color: loading ? "var(--d-text3)" : "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Cancelling…" : "Yes, cancel booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Confirm Modal ─────────────────────────────────────
function RejectModal({ property, onConfirm, onClose, loading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(5px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "var(--d-bg2)",
          border: "1px solid var(--d-border)",
          borderRadius: 18,
          padding: "2rem 1.75rem",
          width: 420,
          maxWidth: "100%",
          animation: "fadeUp 0.2s ease both",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(139,64,64,0.12)",
            border: "1px solid rgba(139,64,64,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            fontSize: "1.1rem",
            color: "#e07070",
          }}
        >
          ✕
        </div>

        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.5rem",
            color: "var(--d-text)",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          Reject this booking?
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--d-text2)",
            lineHeight: 1.65,
            marginBottom: "1.5rem",
          }}
        >
          You are about to reject the booking request for{" "}
          <strong style={{ color: "var(--d-text)", fontWeight: 500 }}>
            {property?.title}
          </strong>
          . The tenant will be notified of this decision.
        </p>

        <div
          style={{
            background: "rgba(139,64,64,0.07)",
            border: "1px solid rgba(139,64,64,0.15)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#e07070",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            ⚠ Note
          </div>
          <div
            style={{
              fontSize: "0.76rem",
              color: "var(--d-text3)",
              lineHeight: 1.55,
            }}
          >
            Rejected bookings cannot be reinstated. The tenant may submit a new
            request if the property remains available.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: 10,
              background: "var(--d-bg3)",
              border: "1px solid var(--d-border)",
              color: "var(--d-text2)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: 10,
              background: loading ? "var(--d-bg4)" : "rgba(139,64,64,0.85)",
              border: "none",
              color: loading ? "var(--d-text3)" : "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Rejecting…" : "Yes, reject booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BOOKING DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTenant } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'confirmed' | 'rejected'
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState({ rating: 5, text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`booking/get-booking/${id}`);
        const data = res.data?.data ?? res.data;
        console.log("Data from Bill detail: ", data);
        if (!cancelled) setBooking(data);
      } catch {
        if (!cancelled) setBooking(MOCK_BOOKING);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Toast ────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Accept / Reject (owner) ──────────────────────────────────
  const handleStatusAction = async (newStatus) => {
    setActionLoading(newStatus);
    try {
      const res = await api.patch(`booking/update-status/${booking._id}`, {
        status: newStatus,
        paymentStatus: "unpaid",
      });
      console.log(res.data.data);
      setBooking((b) => ({ ...b, status: newStatus }));
      showToast(
        newStatus === "confirmed"
          ? "Booking confirmed successfully."
          : "Booking rejected.",
        newStatus === "confirmed" ? "success" : "error",
      );
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          `Failed to ${newStatus === "confirmed" ? "accept" : "reject"} booking.`,
        "error",
      );
    } finally {
      setActionLoading(null);
      setShowReject(false);
    }
  };

  // ── Cancel ───────────────────────────────────────────────────
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/booking/update-status/${booking._id}`, {
        status: "cancelled",
      });
      setBooking((b) => ({ ...b, status: "cancelled" }));
      showToast("Booking cancelled successfully.");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to cancel booking.",
        "error",
      );
    } finally {
      setCancelling(false);
      setShowCancel(false);
    }
  };

  // ── Review ───────────────────────────────────────────────────
  const handleReviewSubmit = async () => {
    if (!review.text.trim()) return;
    setSubmittingReview(true);
    try {
      await api.post(`/review/create`, {
        bookingId: booking._id,
        propertyId: booking.property._id,
        ...review,
      });
      setBooking((b) => ({ ...b, review }));
      showToast("Review submitted! Thank you.");
      setShowReview(false);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to submit review.",
        "error",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────
  const b = booking;
  const nights = b ? daysBetween(b.checkIn, b.checkOut) : 0;
  const daysToGo = b
    ? Math.max(0, Math.round((new Date(b.checkIn) - new Date()) / 86400000))
    : 0;
  const isOwner = !isTenant;
  const canCancel = ["pending", "confirmed"].includes(b?.status);
  const canReview = isTenant && b?.status === "completed" && !b?.review;
  const canOwnerAct = isOwner && b?.status === "pending";
  const unitLabel = b?.bookingType?.includes("night") ? "night" : "month";
  const paymentDone = b?.paymentStatus === "paid" || b?.status === "payment_done";

  // ── Timeline ─────────────────────────────────────────────────
  const timeline = b
    ? [
        {
          label: "Booking requested",
          date: fmtDate(b.createdAt),
          done: true,
          active: false,
        },
        {
          label: "Owner confirmation",
          date: "",
          done: ["confirmed", "payment_done", "completed"].includes(b.status),
          active: b.status === "pending",
        },
        {
          label: "Payment",
          date: paymentDone
            ? "Paid ✓"
            : b.status === "confirmed"
              ? "Awaiting payment"
              : "",
          done: paymentDone,
          active: b.status === "confirmed" && !paymentDone && isTenant,
        },
        {
          label: "Check-in",
          date: fmtDate(b.checkIn),
          done:
            b.status === "payment_done" ||
            (["payment_done", "completed"].includes(b.status) &&
              new Date() > new Date(b.checkIn)),
          active:
            b.status === "payment_done" &&
            new Date().toDateString() === new Date(b.checkIn).toDateString(),
        },
        {
          label: "Stay completed",
          date: fmtDate(b.checkOut),
          done: b.status === "completed",
          active: false,
        },
      ]
    : [];

  // ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--d-bg)",
        color: "var(--d-text)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ── Topbar ──────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 58,
          borderBottom: "1px solid var(--d-border)",
          background: "rgba(14,15,13,0.95)",
          backdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/smart-dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "1px solid var(--d-border)",
              borderRadius: 8,
              padding: "0.32rem 0.8rem",
              color: "var(--d-text2)",
              cursor: "pointer",
              fontSize: "0.76rem",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.15s",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{ width: 1, height: 16, background: "var(--d-border)" }}
            />
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.05rem",
                color: "var(--d-text)",
                letterSpacing: "0.01em",
              }}
            >
              Booking Details
            </span>
            {b && (
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--d-text3)",
                  fontFamily: "monospace",
                  background: "var(--d-bg3)",
                  border: "1px solid var(--d-border)",
                  borderRadius: 5,
                  padding: "1px 7px",
                }}
              >
                #{b._id?.slice(-8).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* ── Inline owner action buttons in topbar for quick access ── */}
          {canOwnerAct && (
            <>
              <button
                onClick={() => setShowReject(true)}
                disabled={actionLoading !== null}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.3rem 0.9rem",
                  borderRadius: 8,
                  background: "rgba(139,64,64,0.1)",
                  border: "1px solid rgba(139,64,64,0.28)",
                  color: "#e07070",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  cursor: actionLoading !== null ? "not-allowed" : "pointer",
                  opacity: actionLoading !== null ? 0.6 : 1,
                  transition: "all 0.15s",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Reject
              </button>
              <button
                onClick={() => handleStatusAction("confirmed")}
                disabled={actionLoading !== null}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0.3rem 0.9rem",
                  borderRadius: 8,
                  background:
                    actionLoading === "confirmed"
                      ? "var(--d-bg4)"
                      : "rgba(78,124,95,0.88)",
                  border: "none",
                  color:
                    actionLoading === "confirmed" ? "var(--d-text3)" : "#fff",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  cursor: actionLoading !== null ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                {actionLoading === "confirmed" ? (
                  "Accepting…"
                ) : (
                  <>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Accept
                  </>
                )}
              </button>
            </>
          )}
          {b && <StatusBadge status={b.status} />}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "2rem 1.75rem 6rem",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "1.5rem",
            }}
          >
            <div>
              <SkeletonCard lines={5} />
              <SkeletonCard lines={4} />
              <SkeletonCard lines={3} />
            </div>
            <div>
              <SkeletonCard lines={4} />
              <SkeletonCard lines={3} />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* ══ LEFT COLUMN ══════════════════════════════════ */}
            <div>
              {/* ── Owner action banner (pending bookings) ─── */}
              {canOwnerAct && (
                <div
                  style={{
                    background: "rgba(139,107,46,0.07)",
                    border: "1px solid rgba(139,107,46,0.22)",
                    borderRadius: 14,
                    padding: "1rem 1.25rem",
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    animation: "fadeUp 0.35s ease both",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "rgba(196,145,42,0.12)",
                        border: "1px solid rgba(196,145,42,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      ◎
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          color: "var(--d-text)",
                          marginBottom: 2,
                        }}
                      >
                        Awaiting your response
                      </div>
                      <div
                        style={{ fontSize: "0.72rem", color: "var(--d-text3)" }}
                      >
                        {b.tenant?.fullName} has requested to book this
                        property.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setShowReject(true)}
                      disabled={actionLoading !== null}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0.55rem 1.1rem",
                        borderRadius: 9,
                        background: "rgba(139,64,64,0.08)",
                        border: "1px solid rgba(139,64,64,0.22)",
                        color: "#e07070",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor:
                          actionLoading !== null ? "not-allowed" : "pointer",
                        opacity: actionLoading !== null ? 0.6 : 1,
                        transition: "all 0.15s",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Reject
                    </button>

                    <button
                      onClick={() => handleStatusAction("confirmed")}
                      disabled={actionLoading !== null}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0.55rem 1.25rem",
                        borderRadius: 9,
                        background:
                          actionLoading === "confirmed"
                            ? "var(--d-bg4)"
                            : "rgba(78,124,95,0.88)",
                        border: "none",
                        color:
                          actionLoading === "confirmed"
                            ? "var(--d-text3)"
                            : "#fff",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor:
                          actionLoading !== null ? "not-allowed" : "pointer",
                        transition: "all 0.15s",
                        boxShadow:
                          actionLoading !== "confirmed"
                            ? "0 2px 12px rgba(78,124,95,0.25)"
                            : "none",
                      }}
                    >
                      {actionLoading === "confirmed" ? (
                        "Accepting…"
                      ) : (
                        <>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Accept booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Hero card ─── */}
              <Card delay={0}>
                {isTenant && b.status === "confirmed" && !paymentDone && (
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: "rgba(200,169,110,0.07)",
                      border: "1px solid rgba(200,169,110,0.28)",
                      borderRadius: 12,
                      padding: "0.9rem 1.1rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          color: "var(--d-text)",
                          marginBottom: 2,
                        }}
                      >
                        Payment pending
                      </div>
                      <div
                        style={{ fontSize: "0.72rem", color: "var(--d-text3)" }}
                      >
                        Booking confirmed. Complete payment to secure your stay.
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/payment", {
                          state: {
                            invoice: {
                              id: `INV-${b._id?.slice(-6).toUpperCase()}`,
                              tenant: b.tenant?.fullName,
                              property: b.property?.title,
                              amount: b.priceBreakdown?.totalAmount ?? 0,
                              dueDate: fmtDate(b.checkIn),
                              status: "pending",
                              period: `${fmtDate(b.checkIn)} – ${fmtDate(b.checkOut)}`,
                              bookingId: b._id,
                            },
                          },
                        })
                      }
                      style={{
                        padding: "0.55rem 1.25rem",
                        borderRadius: 9,
                        background: "var(--gold)",
                        border: "none",
                        color: "#1a1500",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Pay Now
                    </button>
                  </div>
                )}
                <div style={{ padding: "1.5rem 1.5rem 1.35rem" }}>
                  {/* Property badge + title */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                      marginBottom: "1.35rem",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--terracotta)",
                          background: "rgba(192,90,40,0.08)",
                          border: "1px solid rgba(192,90,40,0.18)",
                          borderRadius: 20,
                          padding: "2px 10px",
                          display: "inline-block",
                          marginBottom: 8,
                        }}
                      >
                        {b.property?.propertyType}
                      </span>

                      <h1
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.65rem",
                          fontWeight: 400,
                          color: "var(--d-text)",
                          lineHeight: 1.15,
                          margin: "0 0 6px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {b.property?.title}
                      </h1>

                      <div
                        style={{
                          fontSize: "0.76rem",
                          color: "var(--d-text3)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {[
                          b.property?.location?.area,
                          b.property?.location?.city,
                          b.property?.location?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                    <StatusBadge status={b.status} large />
                  </div>

                  {/* Date strip */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 60px 1fr 1px 120px",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "var(--d-bg3)",
                      borderRadius: 12,
                      padding: "1rem 1.25rem",
                      border: "1px solid var(--d-border)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--d-text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 5,
                        }}
                      >
                        Check-in
                      </div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.2rem",
                          color: "var(--d-text)",
                        }}
                      >
                        {fmtDate(b.checkIn)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--d-text3)",
                          marginTop: 2,
                        }}
                      >
                        {new Date(b.checkIn).toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "0.62rem",
                          color: "var(--d-text3)",
                          marginBottom: 4,
                        }}
                      >
                        {nights} {unitLabel}
                        {nights > 1 ? "s" : ""}
                      </div>
                      <div
                        style={{
                          height: 1,
                          background: "var(--d-border)",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%,-50%)",
                            fontSize: "0.55rem",
                            color: "var(--d-text3)",
                            background: "var(--d-bg3)",
                            padding: "0 4px",
                          }}
                        >
                          →
                        </span>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--d-text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 5,
                        }}
                      >
                        Check-out
                      </div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.2rem",
                          color: "var(--d-text)",
                        }}
                      >
                        {fmtDate(b.checkOut)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--d-text3)",
                          marginTop: 2,
                        }}
                      >
                        {new Date(b.checkOut).toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </div>
                    </div>

                    <div
                      style={{ height: 36, background: "var(--d-border)" }}
                    />

                    <div style={{ textAlign: "right", paddingLeft: "0.75rem" }}>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--d-text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 5,
                        }}
                      >
                        Guests
                      </div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.2rem",
                          color: "var(--d-text)",
                        }}
                      >
                        {b.guests?.adults ?? 1} adult
                        {(b.guests?.adults ?? 1) > 1 ? "s" : ""}
                      </div>
                      {b.guests?.children > 0 && (
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--d-text3)",
                            marginTop: 2,
                          }}
                        >
                          +{b.guests.children} child
                          {b.guests.children > 1 ? "ren" : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Countdown chip */}
                  {b.status === "confirmed" && daysToGo > 0 && (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(192,90,40,0.07)",
                        border: "1px solid rgba(192,90,40,0.18)",
                        borderRadius: 10,
                        padding: "0.6rem 1rem",
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--terracotta)"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span
                        style={{
                          fontSize: "0.76rem",
                          color: "var(--terracotta)",
                          fontWeight: 500,
                        }}
                      >
                        {daysToGo} day{daysToGo > 1 ? "s" : ""} until check-in
                      </span>
                    </div>
                  )}

                  {/* Completed banner */}
                  {b.status === "completed" && (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(78,124,95,0.07)",
                        border: "1px solid rgba(78,124,95,0.2)",
                        borderRadius: 10,
                        padding: "0.6rem 1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "#6abf85",
                          fontWeight: 500,
                        }}
                      >
                        ✓ Stay completed — we hope you had a wonderful
                        experience!
                      </span>
                    </div>
                  )}

                  {/* Cancelled banner */}
                  {b.status === "cancelled" && (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(139,64,64,0.07)",
                        border: "1px solid rgba(139,64,64,0.2)",
                        borderRadius: 10,
                        padding: "0.6rem 1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.76rem",
                          color: "#e07070",
                          fontWeight: 500,
                        }}
                      >
                        This booking has been cancelled.
                      </span>
                    </div>
                  )}

                  {/* Rejected banner */}
                  {b.status === "rejected" && (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "rgba(139,64,64,0.07)",
                        border: "1px solid rgba(139,64,64,0.2)",
                        borderRadius: 10,
                        padding: "0.6rem 1rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.76rem",
                          color: "#e07070",
                          fontWeight: 500,
                        }}
                      >
                        This booking request was rejected by the owner.
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* ── Property details ─── */}
              <Card delay={0.05}>
                <CardHeader title="Property details" icon="⊡" />
                <CardBody>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0 2rem",
                    }}
                  >
                    <InfoRow
                      label="Type"
                      value={b.property?.propertyType?.toUpperCase() || "—"}
                    />
                    <InfoRow
                      label="Booking type"
                      value={b.bookingType?.replace("per_", "Per ") || "—"}
                    />
                    <InfoRow
                      label="Area"
                      value={
                        b.property?.roomInfo?.areaSqFt
                          ? `${b.property.roomInfo.areaSqFt} sq ft`
                          : "—"
                      }
                    />
                    <InfoRow
                      label="Bedrooms"
                      value={b.property?.roomInfo?.bedrooms ?? "—"}
                    />
                    <InfoRow
                      label="Bathrooms"
                      value={b.property?.roomInfo?.bathrooms ?? "—"}
                    />
                    <InfoRow
                      label="Total rooms"
                      value={b.property?.roomInfo?.totalRooms ?? "—"}
                    />
                  </div>

                  {b.property?.amenities?.length > 0 && (
                    <>
                      <Divider label="Amenities" />
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
                      >
                        {b.property.amenities.map((a) => {
                          const meta = AMENITY_META[a];
                          return (
                            <span
                              key={a}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: "0.72rem",
                                padding: "4px 11px",
                                borderRadius: 20,
                                background: "var(--d-bg3)",
                                border: "1px solid var(--d-border)",
                                color: "var(--d-text2)",
                              }}
                            >
                              {meta?.label || a}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>

              {/* ── Booking timeline ─── */}
              <Card delay={0.1}>
                <CardHeader title="Booking timeline" icon="◈" />
                <CardBody pad="1.1rem 1.25rem">
                  {timeline.map((step, i) => (
                    <TimelineStep
                      key={i}
                      {...step}
                      last={i === timeline.length - 1}
                    />
                  ))}
                </CardBody>
              </Card>

              {/* ── Tenant info (owner view) ─── */}
              {isOwner && b.tenant && (
                <Card delay={0.15}>
                  <CardHeader title="Tenant information" icon="◉" />
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: "1rem",
                      }}
                    >
                      <Avatar name={b.tenant.fullName} accent="terracotta" />
                      <div>
                        <div
                          style={{
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            color: "var(--d-text)",
                          }}
                        >
                          {b.tenant.fullName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--d-text3)",
                            marginTop: 2,
                          }}
                        >
                          Tenant
                        </div>
                      </div>
                    </div>
                    <InfoRow label="Email" value={b.tenant.email || "—"} />
                    <InfoRow label="Phone" value={b.tenant.phone || "—"} />
                  </CardBody>
                </Card>
              )}

              {/* ── Owner info (tenant view) ─── */}
              {isTenant && b.property?.owner && (
                <Card delay={0.15}>
                  <CardHeader title="Property owner" icon="◉" />
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: "1rem",
                      }}
                    >
                      <Avatar name={b.owner.fullName} accent="gold" />
                      <div>
                        <div
                          style={{
                            fontSize: "0.92rem",
                            fontWeight: 500,
                            color: "var(--d-text)",
                          }}
                        >
                          {b.owner.fullName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--d-text3)",
                            marginTop: 2,
                          }}
                        >
                          Property owner
                        </div>
                      </div>
                    </div>
                    <InfoRow label="Email" value={b.owner.email || "—"} />
                    <InfoRow label="Phone" value={b.owner.phone || "—"} />
                    <button
                      style={{
                        marginTop: "1rem",
                        width: "100%",
                        padding: "0.6rem",
                        borderRadius: 9,
                        background: "var(--d-bg3)",
                        border: "1px solid var(--d-border)",
                        color: "var(--d-text2)",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        transition: "all 0.15s",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      Message owner
                    </button>
                  </CardBody>
                </Card>
              )}

              {/* ── Write review prompt ─── */}
              {canReview && !showReview && (
                <Card delay={0.2}>
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            color: "var(--d-text)",
                            marginBottom: 3,
                          }}
                        >
                          How was your stay?
                        </div>
                        <div
                          style={{
                            fontSize: "0.74rem",
                            color: "var(--d-text3)",
                          }}
                        >
                          Your review helps other renters make informed
                          decisions.
                        </div>
                      </div>
                      <button
                        onClick={() => setShowReview(true)}
                        style={{
                          padding: "0.5rem 1.1rem",
                          borderRadius: 8,
                          flexShrink: 0,
                          background: "rgba(200,169,110,0.1)",
                          border: "1px solid rgba(200,169,110,0.22)",
                          color: "var(--gold)",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Write review
                      </button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* ── Review form ─── */}
              {showReview && (
                <Card delay={0}>
                  <CardHeader
                    title="Leave a review"
                    right={
                      <button
                        onClick={() => setShowReview(false)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--d-text3)",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          padding: "0 2px",
                        }}
                      >
                        ✕
                      </button>
                    }
                  />
                  <CardBody>
                    <div style={{ marginBottom: "1.1rem" }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--d-text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 8,
                        }}
                      >
                        Rating
                      </div>
                      <StarRating
                        value={review.rating}
                        onChange={(r) =>
                          setReview((prev) => ({ ...prev, rating: r }))
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--d-text3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 8,
                        }}
                      >
                        Your review
                      </div>
                      <textarea
                        value={review.text}
                        onChange={(e) =>
                          setReview((prev) => ({
                            ...prev,
                            text: e.target.value,
                          }))
                        }
                        placeholder="Share your experience — what did you love, what could be better?"
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "0.75rem 0.9rem",
                          background: "var(--d-bg3)",
                          border: "1px solid var(--d-border)",
                          borderRadius: 9,
                          color: "var(--d-text)",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.84rem",
                          outline: "none",
                          resize: "vertical",
                          boxSizing: "border-box",
                          lineHeight: 1.6,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setShowReview(false)}
                        style={{
                          flex: 1,
                          padding: "0.65rem",
                          borderRadius: 8,
                          background: "var(--d-bg3)",
                          border: "1px solid var(--d-border)",
                          color: "var(--d-text2)",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReviewSubmit}
                        disabled={submittingReview || !review.text.trim()}
                        style={{
                          flex: 2,
                          padding: "0.65rem",
                          borderRadius: 8,
                          background:
                            submittingReview || !review.text.trim()
                              ? "var(--d-bg3)"
                              : "var(--gold)",
                          border: "none",
                          color:
                            submittingReview || !review.text.trim()
                              ? "var(--d-text3)"
                              : "#1a1500",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          cursor:
                            submittingReview || !review.text.trim()
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {submittingReview ? "Submitting…" : "Submit review"}
                      </button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* ── Existing review ─── */}
              {b.review && (
                <Card delay={0.2}>
                  <CardHeader
                    title="Your review"
                    right={<StarRating value={b.review.rating} size="1rem" />}
                  />
                  <CardBody>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--d-text2)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {b.review.text}
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* ══ RIGHT COLUMN ═════════════════════════════════ */}
            <div style={{ position: "sticky", top: 72 }}>
              {/* ── Price breakdown ─── */}
              <Card delay={0.05}>
                <CardHeader title="Price breakdown" />
                <CardBody>
                  <InfoRow
                    label={`${fmt(b.property?.pricing?.basePrice ?? 0)} × ${nights} ${unitLabel}${nights > 1 ? "s" : ""}`}
                    value={fmt(b.priceBreakdown?.baseAmount ?? 0)}
                  />
                  {b.priceBreakdown?.cleaningFee > 0 && (
                    <InfoRow
                      label="Cleaning fee"
                      value={fmt(b.priceBreakdown.cleaningFee)}
                    />
                  )}
                  {b.priceBreakdown?.securityDeposit > 0 && (
                    <InfoRow
                      label="Security deposit"
                      value={fmt(b.priceBreakdown.securityDeposit)}
                      accent="var(--d-text3)"
                    />
                  )}

                  {/* Total */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginTop: "0.85rem",
                      paddingTop: "0.85rem",
                      borderTop: "1px solid var(--d-border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        color: "var(--d-text)",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "1.6rem",
                        color: "var(--d-text)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {fmt(b.priceBreakdown?.totalAmount ?? 0)}
                    </span>
                  </div>

                  {b.priceBreakdown?.securityDeposit > 0 && (
                    <p
                      style={{
                        fontSize: "0.67rem",
                        color: "var(--d-text3)",
                        marginTop: "0.5rem",
                        lineHeight: 1.55,
                      }}
                    >
                      * Security deposit is fully refundable upon check-out.
                    </p>
                  )}
                </CardBody>
              </Card>

              {/* ── Quick info ─── */}
              <Card delay={0.1}>
                <CardHeader title="Quick info" />
                <CardBody>
                  <InfoRow label="Booked on" value={fmtDate(b.createdAt)} />
                  <InfoRow
                    label="Booking type"
                    value={b.bookingType?.replace("per_", "Per ") || "—"}
                  />
                  <InfoRow
                    label="Duration"
                    value={`${nights} ${unitLabel}${nights > 1 ? "s" : ""}`}
                  />
                  <InfoRow
                    label="Booking ID"
                    value={`#${b._id?.slice(-8).toUpperCase()}`}
                    accent="var(--d-text3)"
                    mono
                  />
                </CardBody>
              </Card>

              {/* ── Status card ─── */}
              <Card delay={0.15}>
                <CardHeader title="Status" />
                <CardBody>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[
                      "pending",
                      "confirmed",
                      "completed",
                      "cancelled",
                      "rejected",
                    ].map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const active = b.status === s;
                      return (
                        <div
                          key={s}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "0.55rem 0.75rem",
                            borderRadius: 8,
                            background: active ? cfg.bg : "transparent",
                            border: active
                              ? `1px solid ${cfg.border}`
                              : "1px solid transparent",
                            transition: "all 0.15s",
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: active ? cfg.dot : "var(--d-bg4)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: active ? cfg.dot : "var(--d-text3)",
                              fontWeight: active ? 500 : 400,
                            }}
                          >
                            {cfg.label}
                          </span>
                          {active && (
                            <span
                              style={{
                                marginLeft: "auto",
                                fontSize: "0.6rem",
                                color: cfg.dot,
                              }}
                            >
                              current
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* ── Actions ─── */}
              <Card delay={0.2}>
                <CardHeader title="Actions" />
                <CardBody>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/properties/get-property/${b.property?._id}`)
                      }
                      style={{
                        padding: "0.65rem",
                        borderRadius: 9,
                        background: "var(--d-bg3)",
                        border: "1px solid var(--d-border)",
                        color: "var(--d-text)",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      View property listing
                    </button>

                    {/* ── Owner Accept / Reject in Actions sidebar ─── */}
                    {canOwnerAct && (
                      <>
                        <button
                          onClick={() => handleStatusAction("confirmed")}
                          disabled={actionLoading !== null}
                          style={{
                            padding: "0.65rem",
                            borderRadius: 9,
                            background:
                              actionLoading === "confirmed"
                                ? "var(--d-bg4)"
                                : "rgba(78,124,95,0.12)",
                            border: "1px solid rgba(78,124,95,0.3)",
                            color:
                              actionLoading === "confirmed"
                                ? "var(--d-text3)"
                                : "#6abf85",
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            cursor:
                              actionLoading !== null
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "all 0.15s",
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {actionLoading === "confirmed"
                            ? "Accepting…"
                            : "Accept booking"}
                        </button>

                        <button
                          onClick={() => setShowReject(true)}
                          disabled={actionLoading !== null}
                          style={{
                            padding: "0.65rem",
                            borderRadius: 9,
                            background: "rgba(139,64,64,0.08)",
                            border: "1px solid rgba(139,64,64,0.22)",
                            color: "#e07070",
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "0.82rem",
                            cursor:
                              actionLoading !== null
                                ? "not-allowed"
                                : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            opacity: actionLoading !== null ? 0.6 : 1,
                            transition: "all 0.15s",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Reject booking
                        </button>
                      </>
                    )}

                    {isTenant && b.status === "confirmed" && !paymentDone && (
                      <button
                        onClick={() => navigate("/payment")}
                        style={{
                          padding: "0.65rem",
                          borderRadius: 9,
                          background: "var(--gold)",
                          border: "none",
                          color: "#1a1500",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        Pay Now
                      </button>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => setShowCancel(true)}
                        style={{
                          padding: "0.65rem",
                          borderRadius: 9,
                          background: "rgba(139,64,64,0.08)",
                          border: "1px solid rgba(139,64,64,0.22)",
                          color: "#e07070",
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          transition: "all 0.15s",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel booking
                      </button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* ── Cancel modal ─────────────────────────────────────── */}
      {showCancel && ["pending", "confirmed"].includes(b.status) && (
        <CancelModal
          property={b?.property}
          onConfirm={handleCancel}
          onClose={() => setShowCancel(false)}
          loading={cancelling}
        />
      )}

      {/* ── Reject modal ─────────────────────────────────────── */}
      {showReject && (
        <RejectModal
          property={b?.property}
          onConfirm={() => handleStatusAction("rejected")}
          onClose={() => setShowReject(false)}
          loading={actionLoading === "rejected"}
        />
      )}

      {/* ── Toast ────────────────────────────────────────────── */}
      <Toast toast={toast} />
    </div>
  );
}

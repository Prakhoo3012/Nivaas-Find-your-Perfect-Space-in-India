import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fmt } from "../utils/helpers";
import api from "../api/axiosInstance";

// ─── Utility ──────────────────────────────────────────────────────────────────
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  return { toasts, add };
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Review", "Payment", "Confirm"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: "2rem",
      }}
    >
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? 1 : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  transition: "all 0.3s",
                  background: done
                    ? "var(--d-green)"
                    : active
                      ? "var(--gold)"
                      : "var(--d-bg3)",
                  border: done
                    ? "1.5px solid var(--d-green)"
                    : active
                      ? "1.5px solid var(--gold)"
                      : "1.5px solid var(--d-border)",
                  color: done || active ? "#0E0F0D" : "var(--d-text3)",
                }}
              >
                {done ? (
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
                ) : (
                  idx
                )}
              </div>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: active ? 600 : 400,
                  color: active
                    ? "var(--gold)"
                    : done
                      ? "var(--d-green)"
                      : "var(--d-text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: "0 0.75rem",
                  marginBottom: 22,
                  background: done ? "var(--d-green)" : "var(--d-border)",
                  transition: "background 0.4s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Summary Card ────────────────────────────────────────────────────────
function OrderSummary({ invoice }) {
  const gst = Math.round(invoice.amount * 0.09);
  const total = invoice.amount + gst * 2;

  return (
    <div
      style={{
        background: "var(--d-bg2)",
        border: "1px solid var(--d-border)",
        borderRadius: 14,
        overflow: "hidden",
        position: "sticky",
        top: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--d-border)",
          background: "var(--d-bg3)",
        }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          Payment Summary
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.4rem",
            color: "var(--d-text)",
            fontWeight: 400,
          }}
        >
          {invoice.id}
        </div>
      </div>

      {/* Property info */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--d-border)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "rgba(200,169,110,0.1)",
              border: "1px solid rgba(200,169,110,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.8"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--d-text)",
                marginBottom: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {invoice.property}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--d-text3)" }}>
              Tenant: {invoice.tenant}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--d-text3)" }}>
              Period: {invoice.period}
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        {[
          { label: `Rent — ${invoice.period}`, val: fmt(invoice.amount) },
          { label: "CGST (9%)", val: fmt(gst) },
          { label: "SGST (9%)", val: fmt(gst) },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
              fontSize: "0.82rem",
              color: "var(--d-text2)",
            }}
          >
            <span>{row.label}</span>
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "0.95rem",
              }}
            >
              {row.val}
            </span>
          </div>
        ))}

        <div
          style={{
            borderTop: "1px solid var(--d-border)",
            paddingTop: "0.875rem",
            marginTop: "0.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--d-text)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Total Due
          </span>
          <span
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.7rem",
              color: "var(--gold)",
              fontWeight: 400,
            }}
          >
            {fmt(total)}
          </span>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.68rem",
            color: "var(--d-text3)",
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          256-bit SSL encrypted · PCI DSS compliant
        </div>
      </div>

      {invoice.dueDate && (
        <div
          style={{
            padding: "0.75rem 1.5rem",
            borderTop: "1px solid var(--d-border)",
            background: "rgba(139,64,64,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C06060"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: "0.72rem", color: "#C06060" }}>
            Due by {invoice.dueDate}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── UPI Section ──────────────────────────────────────────────────────────────
function UpiSection({ upiId, setUpiId, onPay, loading }) {
  const valid = /^[\w.\-]+@[\w]+$/.test(upiId);
  return (
    <div>
      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--d-text2)",
          marginBottom: "1.25rem",
          lineHeight: 1.6,
        }}
      >
        Enter your UPI ID to pay instantly. Supported: PhonePe, Google Pay,
        Paytm, BHIM & more.
      </p>
      <label
        style={{
          fontSize: "0.68rem",
          color: "var(--d-text3)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          display: "block",
          marginBottom: 6,
        }}
      >
        UPI ID
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="billing-input"
          style={{ flex: 1 }}
          placeholder="yourname@okicici"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
        <button
          className="btn-primary-dash"
          disabled={!valid || loading}
          style={{
            opacity: valid && !loading ? 1 : 0.4,
            cursor: valid && !loading ? "pointer" : "not-allowed",
            padding: "0 1.25rem",
            flexShrink: 0,
          }}
          onClick={onPay}
        >
          {loading ? "Verifying…" : "Pay now"}
        </button>
      </div>
      {upiId && !valid && (
        <div style={{ fontSize: "0.72rem", color: "#C06060", marginTop: 6 }}>
          Enter a valid UPI ID (e.g. name@okicici)
        </div>
      )}

      {/* UPI apps row */}
      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { name: "PhonePe", icon: "📱", color: "#6739B7" },
          { name: "GPay", icon: "🎨", color: "#1A73E8" },
          { name: "Paytm", icon: "💙", color: "#00BAF2" },
          { name: "BHIM", icon: "🇮🇳", color: "#00875A" },
        ].map((app) => (
          <div
            key={app.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "0.45rem 0.9rem",
              borderRadius: 8,
              border: "1px solid var(--d-border)",
              background: "var(--d-bg3)",
              cursor: "pointer",
              transition: "all 0.15s",
              fontSize: "0.75rem",
              color: "var(--d-text2)",
            }}
            onClick={() => setUpiId(`yourname@ok${app.name.toLowerCase()}`)}
          >
            <span>{app.icon}</span>
            {app.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card Section ─────────────────────────────────────────────────────────────
function CardSection({ card, setCard, onPay, loading }) {
  const set = (k, v) => setCard((c) => ({ ...c, [k]: v }));

  const formatCard = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const valid =
    card.number.replace(/\s/g, "").length === 16 &&
    card.name.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvv.length === 3;

  // Detect card type
  const raw = card.number.replace(/\s/g, "");
  const cardType = raw.startsWith("4")
    ? "Visa"
    : raw.startsWith("5")
      ? "Mastercard"
      : raw.startsWith("6")
        ? "RuPay"
        : null;

  return (
    <div>
      {/* Fake card preview */}
      <div
        style={{
          height: 140,
          borderRadius: 14,
          background: "linear-gradient(135deg, var(--d-bg4) 0%, #1a1800 100%)",
          border: "1px solid rgba(200,169,110,0.2)",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.05)",
            border: "1px solid rgba(200,169,110,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(200,169,110,0.04)",
            border: "1px solid rgba(200,169,110,0.06)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1rem",
              color: "var(--gold)",
              letterSpacing: "0.05em",
            }}
          >
            Nivaas
          </div>
          {cardType && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--d-text2)",
                fontWeight: 500,
              }}
            >
              {cardType}
            </div>
          )}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "1.1rem",
            color: "var(--d-text)",
            letterSpacing: "0.2em",
            marginTop: "1.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {card.number || "•••• •••• •••• ••••"}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: "0.68rem",
              color: "var(--d-text3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {card.name || "Card Holder"}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--d-text3)" }}>
            {card.expiry || "MM/YY"}
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="billing-label">Card number</label>
          <input
            className="billing-input"
            placeholder="1234 5678 9012 3456"
            value={card.number}
            onChange={(e) => set("number", formatCard(e.target.value))}
            maxLength={19}
            style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="billing-label">Cardholder name</label>
          <input
            className="billing-input"
            placeholder="As on card"
            value={card.name}
            onChange={(e) => set("name", e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label className="billing-label">Expiry</label>
          <input
            className="billing-input"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => set("expiry", formatExpiry(e.target.value))}
            maxLength={5}
          />
        </div>
        <div>
          <label className="billing-label">CVV</label>
          <input
            className="billing-input"
            placeholder="•••"
            type="password"
            value={card.cvv}
            onChange={(e) =>
              set("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))
            }
            maxLength={3}
          />
        </div>
      </div>

      <button
        className="btn-primary-dash"
        disabled={!valid || loading}
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "1.5rem",
          padding: "0.75rem",
          opacity: valid && !loading ? 1 : 0.4,
          cursor: valid && !loading ? "pointer" : "not-allowed",
          fontSize: "0.875rem",
        }}
        onClick={onPay}
      >
        {loading ? (
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
            Processing…
          </>
        ) : (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Pay securely
          </>
        )}
      </button>
    </div>
  );
}

// ─── Net Banking Section ───────────────────────────────────────────────────────
function NetBankingSection({ bank, setBank, onPay, loading }) {
  const banks = [
    { id: "sbi", name: "State Bank of India", abbr: "SBI" },
    { id: "hdfc", name: "HDFC Bank", abbr: "HDFC" },
    { id: "icici", name: "ICICI Bank", abbr: "ICICI" },
    { id: "axis", name: "Axis Bank", abbr: "AXIS" },
    { id: "kotak", name: "Kotak Mahindra", abbr: "KMB" },
    { id: "pnb", name: "Punjab National Bank", abbr: "PNB" },
  ];

  return (
    <div>
      <p
        style={{
          fontSize: "0.82rem",
          color: "var(--d-text2)",
          marginBottom: "1.25rem",
          lineHeight: 1.6,
        }}
      >
        Select your bank to continue to the bank's secure payment gateway.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.6rem",
          marginBottom: "1.5rem",
        }}
      >
        {banks.map((b) => (
          <button
            key={b.id}
            onClick={() => setBank(b.id)}
            style={{
              padding: "0.9rem 0.75rem",
              borderRadius: 10,
              border:
                bank === b.id
                  ? "1.5px solid var(--gold)"
                  : "1px solid var(--d-border)",
              background:
                bank === b.id ? "rgba(200,169,110,0.08)" : "var(--d-bg3)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background:
                  bank === b.id ? "rgba(200,169,110,0.15)" : "var(--d-bg4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: bank === b.id ? "var(--gold)" : "var(--d-text2)",
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              {b.abbr}
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                color: bank === b.id ? "var(--gold)" : "var(--d-text3)",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {b.name}
            </span>
          </button>
        ))}
      </div>
      <button
        className="btn-primary-dash"
        disabled={!bank || loading}
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "0.75rem",
          opacity: bank && !loading ? 1 : 0.4,
          cursor: bank && !loading ? "pointer" : "not-allowed",
          fontSize: "0.875rem",
        }}
        onClick={onPay}
      >
        {loading ? "Redirecting…" : "Continue to bank"}
      </button>
    </div>
  );
}

// ─── Wallet Section ───────────────────────────────────────────────────────────
function WalletSection({ wallet, setWallet, onPay, loading }) {
  const wallets = [
    { id: "paytm", name: "Paytm", balance: "₹2,340", icon: "💙" },
    { id: "phonepe", name: "PhonePe", balance: "₹8,120", icon: "💜" },
    { id: "amazon", name: "Amazon Pay", balance: "₹450", icon: "🟡" },
    { id: "mobikwik", name: "MobiKwik", balance: "₹780", icon: "🔵" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          marginBottom: "1.5rem",
        }}
      >
        {wallets.map((w) => (
          <button
            key={w.id}
            onClick={() => setWallet(w.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0.9rem 1rem",
              borderRadius: 10,
              border:
                wallet === w.id
                  ? "1.5px solid var(--gold)"
                  : "1px solid var(--d-border)",
              background:
                wallet === w.id ? "rgba(200,169,110,0.06)" : "var(--d-bg3)",
              cursor: "pointer",
              transition: "all 0.15s",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>{w.icon}</span>
            <span
              style={{
                flex: 1,
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--d-text)",
              }}
            >
              {w.name}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--d-text3)" }}>
              Bal: {w.balance}
            </span>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                border:
                  wallet === w.id
                    ? "4px solid var(--gold)"
                    : "1.5px solid var(--d-border)",
                transition: "all 0.15s",
                background: "transparent",
                flexShrink: 0,
              }}
            />
          </button>
        ))}
      </div>
      <button
        className="btn-primary-dash"
        disabled={!wallet || loading}
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "0.75rem",
          opacity: wallet && !loading ? 1 : 0.4,
          cursor: wallet && !loading ? "pointer" : "not-allowed",
          fontSize: "0.875rem",
        }}
        onClick={onPay}
      >
        {loading ? "Processing…" : "Pay from wallet"}
      </button>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ invoice, navigate }) {
  const gst = Math.round(invoice.amount * 0.09);
  const total = invoice.amount + gst * 2;
  const txnId = `TXN${Date.now().toString().slice(-10)}`;

  useEffect(() => {
    const confetti = () => {
      // simple CSS-only burst via multiple box-shadows
    };
    confetti();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        animation: "fadeUp 0.5s ease both",
      }}
    >
      {/* Success icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(78,124,95,0.15)",
          border: "2px solid var(--d-green)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--d-green)"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "2rem",
          color: "var(--d-text)",
          fontWeight: 400,
          marginBottom: "0.5rem",
        }}
      >
        Payment Successful
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--d-text3)",
          marginBottom: "2rem",
        }}
      >
        Your rent payment has been processed.
      </div>

      {/* Receipt box */}
      <div
        style={{
          background: "var(--d-bg2)",
          border: "1px solid var(--d-border)",
          borderRadius: 14,
          padding: "1.75rem 2rem",
          width: "100%",
          maxWidth: 420,
          marginBottom: "1.5rem",
          textAlign: "left",
        }}
      >
        {[
          { label: "Transaction ID", val: txnId, mono: true },
          { label: "Invoice", val: invoice.id },
          { label: "Property", val: invoice.property },
          { label: "Period", val: invoice.period },
          { label: "Amount paid", val: fmt(total), accent: true },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "0.75rem",
              marginBottom: "0.75rem",
              borderBottom: "1px solid var(--d-border)",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--d-text3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: row.accent ? "1.1rem" : "0.82rem",
                fontFamily: row.accent
                  ? "Cormorant Garamond, serif"
                  : row.mono
                    ? "monospace"
                    : "DM Sans, sans-serif",
                color: row.accent ? "var(--gold)" : "var(--d-text)",
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              {row.val}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
            color: "var(--d-green)",
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
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Verified & confirmed
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          className="billing-btn-secondary"
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: 7 }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print receipt
        </button>
        <button
          className="btn-primary-dash"
          onClick={() => navigate("/billing")}
        >
          Back to Billing
        </button>
      </div>
    </div>
  );
}

// ─── Main PaymentPage ──────────────────────────────────────────────────────────
export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, add: addToast } = useToast();

  // The invoice can be passed via router state, or we use a fallback mock
  const invoice = location.state?.invoice ?? {
    id: "INV-003",
    tenant: "Rahul Mehta",
    property: "Heritage Haveli Suite",
    amount: 13500,
    dueDate: "2025-07-20",
    status: "overdue",
    period: "Jul 2025",
  };

  const [step, setStep] = useState(1); // 1=Review, 2=Payment, 3=Confirm
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  // UPI
  const [upiId, setUpiId] = useState("");
  // Card
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  // Net banking
  const [bank, setBank] = useState("");
  // Wallet
  const [wallet, setWallet] = useState("");

  const simulatePay = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Hit update-status API if bookingId exists
      if (invoice.bookingId) {
        await api.patch(`booking/update-status/${invoice.bookingId}`, {
          status: "payment_done", // booking confirmed rehe
          paymentStatus: "paid", // payment mark as paid
        });
      }

      setStep(3); // Success screen
    } catch (err) {
      addToast(
        err?.response?.data?.message ||
          "Payment processed but status update failed.",
        "error",
      );
      setStep(3); // Still show success (payment happened)
    } finally {
      setLoading(false);
    }
  };

  const METHODS = [
    {
      id: "upi",
      label: "UPI",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "card",
      label: "Card",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      id: "netbanking",
      label: "Net Banking",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M21 12V7H5a2 2 0 010-4h14v4" />
          <path d="M3 5v14a2 2 0 002 2h16v-5" />
          <path d="M18 12a2 2 0 000 4h4v-4z" />
        </svg>
      ),
    },
  ];

  if (step === 3) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--d-bg)",
          fontFamily: "DM Sans, sans-serif",
          color: "var(--d-text)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Minimal topbar */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 2rem",
            borderBottom: "1px solid var(--d-border)",
            background: "var(--d-bg2)",
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.25rem",
              color: "var(--gold)",
            }}
          >
            Nivaas
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.72rem",
              color: "var(--d-text3)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--d-green)"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Secure Payment
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ width: "100%", maxWidth: 560 }}>
            <StepBar step={3} />
            <SuccessScreen invoice={invoice} navigate={navigate} />
          </div>
        </div>
        <div
          style={{
            height: 48,
            borderTop: "1px solid var(--d-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "0.68rem", color: "var(--d-text3)" }}>
            Nivaas · Zero brokerage rental platform · support@nivaas.in
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--d-bg)",
        fontFamily: "DM Sans, sans-serif",
        color: "var(--d-text)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Topbar */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 2rem",
          borderBottom: "1px solid var(--d-border)",
          background: "var(--d-bg2)",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/billing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--d-text3)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontFamily: "DM Sans, sans-serif",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--d-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--d-text3)")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Billing
        </button>
        <div style={{ width: 1, height: 16, background: "var(--d-border)" }} />
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.25rem",
            color: "var(--gold)",
          }}
        >
          Nivaas
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
            color: "var(--d-text3)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--d-green)"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure & Encrypted
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          maxWidth: 1000,
          width: "100%",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Left – main flow */}
        <div>
          <StepBar step={step} />

          {/* ── Step 1: Review ── */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div className="d-section" style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--d-border)",
                    background: "var(--d-bg3)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--d-text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                    }}
                  >
                    Step 1
                  </div>
                  <div
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "1.3rem",
                      color: "var(--d-text)",
                    }}
                  >
                    Review Invoice Details
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.25rem",
                    }}
                  >
                    {[
                      { label: "Invoice ID", val: invoice.id },
                      { label: "Status", val: invoice.status },
                      { label: "Tenant", val: invoice.tenant },
                      { label: "Period", val: invoice.period },
                      { label: "Property", val: invoice.property, full: true },
                      { label: "Due Date", val: invoice.dueDate || "—" },
                    ].map((f) => (
                      <div
                        key={f.label}
                        style={{ gridColumn: f.full ? "1 / -1" : undefined }}
                      >
                        <div
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--d-text3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.07em",
                            marginBottom: 4,
                          }}
                        >
                          {f.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--d-text)",
                            fontWeight: 400,
                          }}
                        >
                          {f.label === "Status" ? (
                            <span className={`status-pill status-${f.val}`}>
                              {f.val}
                            </span>
                          ) : (
                            f.val
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: "1.5rem",
                      padding: "1rem",
                      borderRadius: 10,
                      background: "rgba(200,169,110,0.05)",
                      border: "1px solid rgba(200,169,110,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span
                      style={{ fontSize: "0.78rem", color: "var(--d-text2)" }}
                    >
                      Please verify the invoice details before proceeding to
                      payment.
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="btn-primary-dash"
                  onClick={() => setStep(2)}
                  style={{ padding: "0.65rem 1.5rem", fontSize: "0.875rem" }}
                >
                  Proceed to Payment
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.35s ease both" }}>
              <div className="d-section">
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid var(--d-border)",
                    background: "var(--d-bg3)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--d-text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                    }}
                  >
                    Step 2
                  </div>
                  <div
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "1.3rem",
                      color: "var(--d-text)",
                    }}
                  >
                    Choose Payment Method
                  </div>
                </div>

                {/* Method tabs */}
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid var(--d-border)",
                    overflow: "hidden",
                  }}
                >
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "0.9rem 0.5rem",
                        background:
                          method === m.id
                            ? "rgba(200,169,110,0.06)"
                            : "transparent",
                        border: "none",
                        borderBottom:
                          method === m.id
                            ? "2px solid var(--gold)"
                            : "2px solid transparent",
                        color:
                          method === m.id ? "var(--gold)" : "var(--d-text3)",
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: method === m.id ? 500 : 400,
                        transition: "all 0.15s",
                      }}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {method === "upi" && (
                    <UpiSection
                      upiId={upiId}
                      setUpiId={setUpiId}
                      onPay={simulatePay}
                      loading={loading}
                    />
                  )}
                  {method === "card" && (
                    <CardSection
                      card={card}
                      setCard={setCard}
                      onPay={simulatePay}
                      loading={loading}
                    />
                  )}
                  {method === "netbanking" && (
                    <NetBankingSection
                      bank={bank}
                      setBank={setBank}
                      onPay={simulatePay}
                      loading={loading}
                    />
                  )}
                  {method === "wallet" && (
                    <WalletSection
                      wallet={wallet}
                      setWallet={setWallet}
                      onPay={simulatePay}
                      loading={loading}
                    />
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                style={{
                  marginTop: "0.5rem",
                  background: "none",
                  border: "none",
                  color: "var(--d-text3)",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 0,
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
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to review
              </button>
            </div>
          )}
        </div>

        {/* Right – Order Summary */}
        <OrderSummary invoice={invoice} />
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid var(--d-border)",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "0.68rem", color: "var(--d-text3)" }}>
          Nivaas · Zero brokerage rental platform · support@nivaas.in
        </span>
        <div style={{ display: "flex", gap: "1rem" }}>
          {["Privacy Policy", "Terms", "Refund Policy"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: "0.68rem",
                color: "var(--d-text3)",
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? (
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
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

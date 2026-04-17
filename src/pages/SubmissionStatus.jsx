import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─── Keyframe injection ─────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --success-bg: #0a1a0f;
    --success-accent: #22c55e;
    --success-glow: #16a34a;
    --failure-bg: #1a0a0a;
    --failure-accent: #ef4444;
    --failure-glow: #dc2626;
    --text-primary: #f1f5f9;
    --text-muted: #94a3b8;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    0%   { opacity: 0; transform: scale(0.4) rotate(-15deg); }
    70%  { transform: scale(1.1) rotate(3deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes ringPulse {
    0%, 100% { transform: scale(1);   opacity: 0.6; }
    50%       { transform: scale(1.18); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes countDown {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 283; }
  }
  @keyframes shakeX {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-10px); }
    40%     { transform: translateX(10px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
  @keyframes gridMove {
    from { background-position: 0 0; }
    to   { background-position: 40px 40px; }
  }

  .status-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Poppins", sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── Success bg ── */
  .status-root.success {
    background: var(--success-bg);
  }
  .status-root.success::before {
    content: '';
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: gridMove 4s linear infinite;
  }
  .status-root.success::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* ── Failure bg ── */
  .status-root.failure {
    background: var(--failure-bg);
  }
  .status-root.failure::before {
    content: '';
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(239,68,68,0.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(239,68,68,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: gridMove 4s linear infinite;
  }
  .status-root.failure::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* ── Card ── */
  .status-card {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center;
    gap: 28px;
    padding: 56px 48px;
    max-width: 480px; width: 90%;
    border-radius: 24px;
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }
  .success .status-card {
    background: rgba(10,26,15,0.85);
    border: 1px solid rgba(34,197,94,0.25);
    box-shadow: 0 0 60px rgba(34,197,94,0.08), 0 2px 0 rgba(34,197,94,0.3) inset;
    backdrop-filter: blur(16px);
  }
  .failure .status-card {
    background: rgba(26,10,10,0.85);
    border: 1px solid rgba(239,68,68,0.25);
    box-shadow: 0 0 60px rgba(239,68,68,0.08), 0 2px 0 rgba(239,68,68,0.3) inset;
    backdrop-filter: blur(16px);
    animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both, shakeX 0.6s 0.5s ease both;
  }

  /* ── Icon wrapper ── */
  .icon-wrap {
    position: relative;
    width: 110px; height: 110px;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    animation: ringPulse 2s ease-in-out infinite;
  }
  .success .icon-ring { background: radial-gradient(circle, rgba(34,197,94,0.3), transparent 70%); }
  .failure .icon-ring { background: radial-gradient(circle, rgba(239,68,68,0.3), transparent 70%); }

  .icon-circle {
    width: 90px; height: 90px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 38px;
    animation: scaleIn 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
    position: relative; z-index: 1;
  }
  .success .icon-circle {
    background: linear-gradient(135deg, #166534, #15803d);
    border: 2px solid rgba(34,197,94,0.5);
    box-shadow: 0 0 30px rgba(34,197,94,0.4);
  }
  .failure .icon-circle {
    background: linear-gradient(135deg, #7f1d1d, #991b1b);
    border: 2px solid rgba(239,68,68,0.5);
    box-shadow: 0 0 30px rgba(239,68,68,0.4);
  }

  /* ── Text ── */
  .status-label {
   font-family: "Poppins", sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    padding: 4px 14px; border-radius: 100px;
    animation: fadeUp 0.5s 0.35s both;
  }
  .success .status-label { color: #4ade80; background: rgba(34,197,94,0.12); }
  .failure .status-label { color: #f87171; background: rgba(239,68,68,0.12); }

  .status-title {
    font-family: "Poppins", sans-serif;
    font-size: 28px; font-weight: 800;
    color: var(--text-primary);
    text-align: center; line-height: 1.2;
    animation: fadeUp 0.5s 0.45s both;
  }
  .status-desc {
    font-size: 15px; font-weight: 300;
    color: var(--text-muted);
    text-align: center; line-height: 1.7;
    animation: fadeUp 0.5s 0.55s both;
  }

  /* ── Countdown ── */
  .countdown-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    animation: fadeUp 0.5s 0.65s both;
  }
  .countdown-svg { transform: rotate(-90deg); }
  .countdown-track { fill: none; stroke: rgba(34,197,94,0.12); stroke-width: 4; }
  .countdown-bar {
    fill: none; stroke: #22c55e; stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 283;
    animation: countDown 5s linear forwards;
  }
  .countdown-num {
    position: absolute;
    font-family: "Poppins", sans-serif;
    font-size: 22px; font-weight: 800;
    color: #4ade80;
  }
  .countdown-text {
    font-size: 13px; color: var(--text-muted);
    font-weight: 400; letter-spacing: 0.5px;
  }

  /* ── Divider ── */
  .divider {
    width: 100%; height: 1px;
    animation: fadeUp 0.5s 0.7s both;
  }
  .success .divider { background: linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent); }
  .failure .divider { background: linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent); }

  /* ── Button ── */
  .retry-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 12px;
    border: none; cursor: pointer;
    font-family: "Poppins", sans-serif;
    font-size: 15px; font-weight: 700;
    letter-spacing: 0.3px;
    transition: all 0.25s ease;
    animation: fadeUp 0.5s 0.75s both;
    text-decoration: none;
  }
  .retry-btn {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #fff;
    box-shadow: 0 4px 20px rgba(239,68,68,0.35);
  }
  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(239,68,68,0.5);
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }
  .retry-btn:active { transform: translateY(0); }
  .btn-arrow { font-size: 18px; transition: transform 0.2s; }
  .retry-btn:hover .btn-arrow { transform: translateX(-3px); }

  /* ── Error code badge ── */
  .error-code {
    font-size: 12px; color: rgba(239,68,68,0.6);
    font-family: "Poppins", sans-serif;
    letter-spacing: 1px;
    animation: fadeUp 0.5s 0.85s both;
  }
`;

/* ─── Component ─────────────────────────────────────────── */
export default function SubmissionStatus({ status, errorCode, successMessage, failureMessage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(5);
  const intervalRef = useRef(null);

  // Allow overriding status via location.state (from navigate calls)
  const resolvedStatus = location.state?.status ?? status ?? "success";
  const resolvedError = location.state?.errorCode ?? errorCode;
  const isSuccess = resolvedStatus === "success" || resolvedStatus === 200 || resolvedStatus === true;

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  /* ── 5-sec redirect on success ── */
  useEffect(() => {
    if (!isSuccess) return;
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          navigate("/", { replace: true });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isSuccess, navigate]);

  const handleRetry = () => navigate("/register-property");

  /* ── Success Page ── */
  if (isSuccess) {
    return (
      <div className="status-root success">
        <div className="status-card">
          {/* Icon */}
          <div className="icon-wrap">
            <div className="icon-ring" />
            <div className="icon-circle">✓</div>
          </div>

          {/* Label + text */}
          <span className="status-label">Submission Successful</span>
          <h1 className="status-title">
            {successMessage || "Property Registered\nSuccessfully!"}
          </h1>
          <p className="status-desc">
            Your submission has been received and is being processed.
            You'll be redirected to the home page shortly.
          </p>

          <div className="divider" />

          {/* Countdown ring */}
          <div className="countdown-wrap">
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg className="countdown-svg" width="72" height="72" viewBox="0 0 96 96">
                <circle className="countdown-track" cx="48" cy="48" r="45" />
                <circle className="countdown-bar" cx="48" cy="48" r="45" />
              </svg>
              <span className="countdown-num">{count}</span>
            </div>
            <p className="countdown-text">Redirecting in {count} second{count !== 1 ? "s" : ""}…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Failure Page ── */
  return (
    <div className="status-root failure">
      <div className="status-card">
        {/* Icon */}
        <div className="icon-wrap">
          <div className="icon-ring" />
          <div className="icon-circle">✕</div>
        </div>

        {/* Label + text */}
        <span className="status-label">Submission Failed</span>
        <h1 className="status-title">
          {failureMessage || "Something Went Wrong"}
        </h1>
        <p className="status-desc">
          We couldn't process your property registration. Please review your
          details and try again. If the issue persists, contact support.
        </p>

        <div className="divider" />

        {/* Retry button */}
        <button className="retry-btn" onClick={handleRetry}>
          <span className="btn-arrow">←</span>
          Back to Property Register
        </button>

        {resolvedError && (
          <span className="error-code">Error Code: {resolvedError}</span>
        )}
      </div>
    </div>
  );
}

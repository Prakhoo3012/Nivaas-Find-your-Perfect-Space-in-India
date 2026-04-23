import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function pwStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Weak", color: "#C94040" },
    { label: "Fair", color: "#D4882A" },
    { label: "Good", color: "#4A7C6A" },
    { label: "Strong", color: "#3A6B3A" },
    { label: "Very strong", color: "#2A5B2A" },
  ];
  return { score: s, ...map[s] };
}

function LoginForm() {
  const navigate = useNavigate();
  const [form, setFormV] = useState({ email: "", password: "", username: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { login } = useAuth();

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 4000);
  };

  const handleApiError = (err) => {
    if (!err.response) return addToast("Server not reachable 🚫");

    switch (err.response.status) {
      case 400:
        return addToast("Invalid input ❌");
      case 401:
        return addToast("Invalid credentials ❌");
      case 404:
        return addToast("API not found ❌");
      case 500:
        return addToast("Server error ⚠️");
      default:
        return addToast(err.response.data?.message || "Error ❌");
    }
  };

  const set = (k, v) => {
    setFormV((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    if (!form.username) e.username = "Username is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      // login() handles token storage; returns the userData object
      const userData = await login(form);

      // Redirect based on role
      navigate("/smart-dashboard");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to access your dashboard.</p>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className={`form-input${errors.username ? " error" : ""}`}
          type="text"
          placeholder="example"
          value={form.username}
          onChange={(e) => set("username", e.target.value)}
        />
        {errors.username && <div className="form-error">{errors.username}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className={`form-input${errors.email ? " error" : ""}`}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="form-input-wrap">
          <input
            className={`form-input${errors.password ? " error" : ""}`}
            type={showPw ? "text" : "password"}
            placeholder="Your password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            className="input-icon"
            onClick={() => setShowPw((v) => !v)}
            type="button"
          >
            <EyeIcon open={showPw} />
          </button>
        </div>
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>
      <button
        className="btn-primary-auth"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

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
    </>
  );
}

function RegisterForm() {
  const [form, setFormV] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => {
    setFormV((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const strength = pwStrength(form.password);
  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = "Required";
    if (!form.username) e.username = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.password || form.password.length < 8)
      e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    if (!form.agreed) e.agreed = "Please accept the terms";
    return e;
  };
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, agreed, ...payload } = form;
      await api.post("/auth/register", payload);
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors((prev) => ({ ...prev, _form: msg }));
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
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
        <h2 className="auth-heading">Account created!</h2>
        <p className="auth-subheading">
          Welcome to Nivaas. You can now sign in and start exploring.
        </p>
      </div>
    );

  return (
    <>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subheading">
        Join Nivaas — free forever. No brokerage.
      </p>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input
            className={`form-input${errors.fullName ? " error" : ""}`}
            placeholder="Arjun Sharma"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          {errors.fullName && (
            <div className="form-error">{errors.fullName}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className={`form-input${errors.username ? " error" : ""}`}
            placeholder="arjun_s"
            value={form.username}
            onChange={(e) => set("username", e.target.value.toLowerCase())}
          />
          {errors.username && (
            <div className="form-error">{errors.username}</div>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input${errors.email ? " error" : ""}`}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            Phone{" "}
            <span
              style={{
                color: "var(--stone)",
                fontWeight: 300,
                textTransform: "none",
              }}
            >
              (optional)
            </span>
          </label>
          <input
            className="form-input"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrap">
            <input
              className={`form-input${errors.password ? " error" : ""}`}
              type={showPw ? "text" : "password"}
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              className="input-icon"
              onClick={() => setShowPw((v) => !v)}
              type="button"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {form.password && (
            <>
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${strength.score * 25}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <div className="strength-text" style={{ color: strength.color }}>
                {strength.label}
              </div>
            </>
          )}
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <div className="form-input-wrap">
            <input
              className={`form-input${errors.confirmPassword ? " error" : ""}`}
              type={showCpw ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              style={{ paddingRight: "2.5rem" }}
            />
            <button
              className="input-icon"
              onClick={() => setShowCpw((v) => !v)}
              type="button"
            >
              <EyeIcon open={showCpw} />
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="form-error">{errors.confirmPassword}</div>
          )}
        </div>
      </div>
      <label className="form-check">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => set("agreed", e.target.checked)}
        />
        <span className="form-check-label">
          I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a>
          {errors.agreed && (
            <span style={{ color: "#C94040", display: "block", marginTop: 2 }}>
              {errors.agreed}
            </span>
          )}
        </span>
      </label>
      <button
        className="btn-primary-auth"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </button>
    </>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-left-pattern" />
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5F0E8"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="auth-logo-name">Nivaas</span>
          </div>
        </div>
        <div className="auth-left-content">
          <h1 className="auth-left-headline">
            Find your
            <br />
            <em>perfect</em>
            <br />
            space
          </h1>
          <p className="auth-left-desc">
            Thousands of verified rooms, PGs, flats and houses — curated for
            modern living across India.
          </p>
        </div>
        <div className="auth-left-stats">
          {[
            ["12k+", "Listings"],
            ["48+", "Cities"],
            ["98%", "Verified"],
          ].map(([n, l]) => (
            <div className="auth-stat" key={l}>
              <span className="auth-stat-num">{n}</span>
              <span className="auth-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === "login" ? " active" : ""}`}
              onClick={() => setTab("login")}
            >
              Sign in
            </button>
            <button
              className={`auth-tab${tab === "register" ? " active" : ""}`}
              onClick={() => setTab("register")}
            >
              Create account
            </button>
            <div
              className="auth-tab-indicator"
              style={{ width: "50%", left: tab === "login" ? "0%" : "50%" }}
            />
          </div>
          <div key={tab} style={{ animation: "fadeUp 0.3s ease both" }}>
            {tab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
          <div className="auth-footer">
            {tab === "login" ? (
              <>
                Don't have an account?{" "}
                <a onClick={() => setTab("register")}>Sign up free</a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a onClick={() => setTab("login")}>Sign in</a>
              </>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: "var(--stone)",
                fontSize: "0.78rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              ← Back to listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

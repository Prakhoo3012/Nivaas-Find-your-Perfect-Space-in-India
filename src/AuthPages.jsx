import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F5F0E8;
    --warm-white: #FAFAF7;
    --charcoal: #1C1C1A;
    --charcoal-soft: #2E2E2B;
    --stone: #8A8579;
    --stone-light: #C4BFB6;
    --terracotta: #C4622D;
    --terracotta-light: #E8845A;
    --sage: #6B7C5C;
    --border: rgba(28,28,26,0.12);
    --shadow-sm: 0 1px 3px rgba(28,28,26,0.08);
    --shadow-md: 0 4px 24px rgba(28,28,26,0.10);
  }

  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    background: var(--warm-white);
  }

  .auth-left {
    background: var(--charcoal);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(196,98,45,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 20%, rgba(107,124,92,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .auth-left-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .auth-brand { position: relative; z-index: 1; }

  .auth-logo { display: flex; align-items: center; gap: 10px; }

  .auth-logo-icon {
    width: 36px; height: 36px;
    background: var(--terracotta);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }

  .auth-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 500;
    color: var(--cream); letter-spacing: 0.02em;
  }

  .auth-left-content { position: relative; z-index: 1; }

  .auth-left-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem; font-weight: 300;
    color: var(--cream); line-height: 1.2;
    margin-bottom: 1.25rem; letter-spacing: -0.01em;
  }

  .auth-left-headline em { font-style: italic; color: var(--terracotta-light); }

  .auth-left-desc {
    font-size: 0.9rem; color: var(--stone-light);
    line-height: 1.7; max-width: 300px; font-weight: 300;
  }

  .auth-left-stats { display: flex; gap: 2rem; position: relative; z-index: 1; }

  .auth-stat { border-top: 1px solid rgba(255,255,255,0.12); padding-top: 1rem; }

  .auth-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 400; color: var(--cream); display: block;
  }

  .auth-stat-label {
    font-size: 0.75rem; color: var(--stone);
    text-transform: uppercase; letter-spacing: 0.08em; font-weight: 400;
  }

  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem; background: var(--warm-white);
    overflow-y: auto;
  }

  .auth-form-container {
    width: 100%; max-width: 420px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-tabs {
    display: flex; margin-bottom: 2.5rem;
    border-bottom: 1.5px solid var(--border);
    position: relative;
  }

  .auth-tab {
    flex: 1; padding: 0.75rem 1rem;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 400;
    color: var(--stone); transition: color 0.2s; letter-spacing: 0.02em;
  }

  .auth-tab.active { color: var(--charcoal); font-weight: 500; }

  .auth-tab-indicator {
    position: absolute; bottom: -1.5px; height: 2px;
    background: var(--terracotta);
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .auth-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 400; color: var(--charcoal);
    margin-bottom: 0.4rem; letter-spacing: -0.01em;
  }

  .auth-subheading {
    font-size: 0.85rem; color: var(--stone);
    margin-bottom: 2rem; font-weight: 300; line-height: 1.5;
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .form-group { margin-bottom: 1.2rem; }

  .form-label {
    display: block; font-size: 0.75rem; font-weight: 500;
    color: var(--charcoal-soft); margin-bottom: 0.45rem;
    letter-spacing: 0.04em; text-transform: uppercase;
  }

  .form-input-wrap { position: relative; }

  .form-input {
    width: 100%; padding: 0.72rem 1rem;
    border: 1.5px solid var(--border); border-radius: 8px;
    background: var(--warm-white);
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    color: var(--charcoal); transition: border-color 0.2s, box-shadow 0.2s;
    outline: none; -webkit-appearance: none;
  }

  .form-input::placeholder { color: var(--stone-light); }

  .form-input:focus {
    border-color: var(--terracotta);
    box-shadow: 0 0 0 3px rgba(196,98,45,0.1);
  }

  .form-input.error {
    border-color: #C94040;
    box-shadow: 0 0 0 3px rgba(201,64,64,0.08);
  }

  .form-error { font-size: 0.73rem; color: #C94040; margin-top: 0.3rem; }

  .input-icon {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: var(--stone); cursor: pointer; background: none; border: none;
    padding: 2px; display: flex; align-items: center;
  }

  .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  .role-option {
    border: 1.5px solid var(--border); border-radius: 8px;
    padding: 0.75rem 1rem; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
    background: var(--warm-white);
  }

  .role-option:hover { border-color: var(--stone-light); }

  .role-option.selected {
    border-color: var(--terracotta);
    background: rgba(196,98,45,0.04);
  }

  .role-option input { display: none; }

  .role-icon {
    width: 28px; height: 28px; border-radius: 6px;
    background: var(--cream); display: flex; align-items: center;
    justify-content: center; font-size: 14px; flex-shrink: 0;
  }

  .role-option.selected .role-icon { background: rgba(196,98,45,0.1); }

  .role-title { font-size: 0.8rem; font-weight: 500; color: var(--charcoal); display: block; }
  .role-desc { font-size: 0.7rem; color: var(--stone); display: block; }

  .btn-primary {
    width: 100%; padding: 0.82rem 1.5rem;
    background: var(--charcoal); color: var(--cream);
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
    margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .btn-primary:hover {
    background: var(--charcoal-soft);
    transform: translateY(-1px); box-shadow: var(--shadow-md);
  }

  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(245,240,232,0.3);
    border-top-color: var(--cream); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.5rem 0; color: var(--stone-light);
    font-size: 0.75rem; letter-spacing: 0.04em;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  .btn-social {
    width: 100%; padding: 0.72rem 1rem;
    border: 1.5px solid var(--border); border-radius: 8px;
    background: var(--warm-white);
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    color: var(--charcoal-soft); cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }

  .btn-social:hover { border-color: var(--stone-light); box-shadow: var(--shadow-sm); }

  .auth-footer {
    margin-top: 1.5rem; text-align: center;
    font-size: 0.8rem; color: var(--stone);
  }

  .auth-footer a {
    color: var(--terracotta); text-decoration: none;
    font-weight: 500; cursor: pointer;
  }

  .auth-footer a:hover { text-decoration: underline; }

  .form-check {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 1.25rem; cursor: pointer;
  }

  .form-check input[type="checkbox"] {
    width: 15px; height: 15px; margin-top: 2px;
    accent-color: var(--terracotta); cursor: pointer; flex-shrink: 0;
  }

  .form-check-label { font-size: 0.8rem; color: var(--stone); line-height: 1.5; }
  .form-check-label a { color: var(--terracotta); text-decoration: none; }

  .forgot-link {
    float: right; font-size: 0.75rem; color: var(--terracotta);
    text-decoration: none; cursor: pointer; font-weight: 400; text-transform: none; letter-spacing: 0;
  }

  .api-error-banner {
    background: rgba(201,64,64,0.06); border: 1px solid rgba(201,64,64,0.2);
    border-radius: 8px; padding: 0.72rem 1rem;
    font-size: 0.82rem; color: #C94040;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 1rem; animation: fadeUp 0.3s ease both;
  }

  .strength-bar {
    height: 3px; background: var(--border);
    border-radius: 2px; margin-top: 5px; overflow: hidden;
  }
  .strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
  .strength-text { font-size: 0.7rem; margin-top: 3px; }

  .success-wrap {
    text-align: center; padding: 2rem 0;
    animation: fadeUp 0.4s ease both;
  }

  .success-icon {
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(107,124,92,0.12);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.25rem;
  }

  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 2rem 1.5rem; align-items: flex-start; padding-top: 3rem; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const lvl = [
    { label: "", color: "" },
    { label: "Weak", color: "#C94040" },
    { label: "Fair", color: "#E08A2A" },
    { label: "Good", color: "#6B7C5C" },
    { label: "Strong", color: "#3A6B3A" },
  ];
  return { score: s, ...lvl[s] };
}

function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setApiError(""); setLoading(true);
    // TODO: replace with → const res = await axios.post("/api/auth/login", form);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setApiError("Invalid email or password. Please try again.");
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
    if (apiError) setApiError("");
  };

  return (
    <>
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to manage your listings or find your next home.</p>

      {apiError && (
        <div className="api-error-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {apiError}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Email address</label>
        <input className={`form-input${errors.email ? " error" : ""}`} type="email"
          placeholder="you@example.com" value={form.email}
          onChange={e => set("email", e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Password
          <span className="forgot-link">Forgot password?</span>
        </label>
        <div className="form-input-wrap">
          <input className={`form-input${errors.password ? " error" : ""}`}
            type={showPw ? "text" : "password"} placeholder="Your password"
            value={form.password} onChange={e => set("password", e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ paddingRight: "2.5rem" }} />
          <button className="input-icon" onClick={() => setShowPw(v => !v)} type="button">
            <EyeIcon open={showPw} />
          </button>
        </div>
        {errors.password && <div className="form-error">{errors.password}</div>}
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? <><div className="spinner" />Signing in…</> : "Sign in"}
      </button>

      <div className="divider">or continue with</div>

      <button className="btn-social">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>
    </>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", phone: "",
    password: "", confirmPassword: "", role: "tenant", agreed: false
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Min 3 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreed) e.agreed = "You must accept the terms";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    // TODO: replace with → const res = await axios.post("/api/auth/register", { ...form });
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
  };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  if (success) return (
    <div className="success-wrap">
      <div className="success-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B7C5C" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="auth-heading" style={{ marginBottom: "0.5rem" }}>Account created!</h2>
      <p className="auth-subheading" style={{ margin: "0 auto 1.5rem", maxWidth: 280 }}>
        Welcome to Nivaas. Check your email to verify your account before signing in.
      </p>
      <button className="btn-primary" onClick={() => { setSuccess(false); onSwitch(); }}
        style={{ maxWidth: 220, margin: "0 auto" }}>
        Go to Sign in
      </button>
    </div>
  );

  return (
    <>
      <h2 className="auth-heading">Create account</h2>
      <p className="auth-subheading">Join thousands finding their perfect space.</p>

      <div className="form-group">
        <label className="form-label">I am a</label>
        <div className="role-selector">
          {[
            { value: "tenant", icon: "🔑", title: "Tenant", desc: "Looking for a place" },
            { value: "owner", icon: "🏠", title: "Owner", desc: "Listing my property" },
          ].map(r => (
            <label key={r.value} className={`role-option${form.role === r.value ? " selected" : ""}`}>
              <input type="radio" name="role" value={r.value} onChange={() => set("role", r.value)} />
              <div className="role-icon">{r.icon}</div>
              <div>
                <span className="role-title">{r.title}</span>
                <span className="role-desc">{r.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className={`form-input${errors.fullName ? " error" : ""}`} placeholder="Arjun Sharma"
            value={form.fullName} onChange={e => set("fullName", e.target.value)} />
          {errors.fullName && <div className="form-error">{errors.fullName}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className={`form-input${errors.username ? " error" : ""}`} placeholder="arjun_s"
            value={form.username} onChange={e => set("username", e.target.value.toLowerCase())} />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className={`form-input${errors.email ? " error" : ""}`} type="email"
            placeholder="you@example.com" value={form.email}
            onChange={e => set("email", e.target.value)} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            Phone
            <span style={{ color: "var(--stone)", fontWeight: 300, textTransform: "none", letterSpacing: 0 }}> (optional)</span>
          </label>
          <input className="form-input" placeholder="+91 98765 43210"
            value={form.phone} onChange={e => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="form-input-wrap">
            <input className={`form-input${errors.password ? " error" : ""}`}
              type={showPw ? "text" : "password"} placeholder="Min 8 characters"
              value={form.password} onChange={e => set("password", e.target.value)}
              style={{ paddingRight: "2.5rem" }} />
            <button className="input-icon" onClick={() => setShowPw(v => !v)} type="button">
              <EyeIcon open={showPw} />
            </button>
          </div>
          {form.password && (
            <>
              <div className="strength-bar">
                <div className="strength-fill" style={{ width: `${strength.score * 25}%`, background: strength.color }} />
              </div>
              <div className="strength-text" style={{ color: strength.color }}>{strength.label}</div>
            </>
          )}
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm password</label>
          <div className="form-input-wrap">
            <input className={`form-input${errors.confirmPassword ? " error" : ""}`}
              type={showCpw ? "text" : "password"} placeholder="Repeat password"
              value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
              style={{ paddingRight: "2.5rem" }} />
            <button className="input-icon" onClick={() => setShowCpw(v => !v)} type="button">
              <EyeIcon open={showCpw} />
            </button>
          </div>
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>
      </div>

      <label className="form-check">
        <input type="checkbox" checked={form.agreed} onChange={e => set("agreed", e.target.checked)} />
        <span className="form-check-label">
          I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          {errors.agreed && <span style={{ color: "#C94040", display: "block", marginTop: 2 }}>{errors.agreed}</span>}
        </span>
      </label>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? <><div className="spinner" />Creating account…</> : "Create account"}
      </button>
    </>
  );
}

export default function AuthPages() {
  const [tab, setTab] = useState("login");

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">

        <div className="auth-left">
          <div className="auth-left-pattern" />
          <div className="auth-brand">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="auth-logo-name">Nivaas</span>
            </div>
          </div>

          <div className="auth-left-content">
            <h1 className="auth-left-headline">
              Find your<br /><em>perfect</em><br />space
            </h1>
            <p className="auth-left-desc">
              Thousands of verified rooms, PGs, flats and houses — curated for modern living across India.
            </p>
          </div>

          <div className="auth-left-stats">
            {[["12k+", "Listings"], ["48+", "Cities"], ["98%", "Verified"]].map(([n, l]) => (
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
              <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Sign in</button>
              <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Create account</button>
              <div className="auth-tab-indicator" style={{ width: "50%", left: tab === "login" ? "0%" : "50%" }} />
            </div>

            <div key={tab} style={{ animation: "fadeUp 0.3s ease both" }}>
              {tab === "login"
                ? <LoginForm onSwitch={() => setTab("register")} />
                : <RegisterForm onSwitch={() => setTab("login")} />
              }
            </div>

            <div className="auth-footer">
              {tab === "login"
                ? <>Don't have an account? <a onClick={() => setTab("register")}>Sign up free</a></>
                : <>Already have an account? <a onClick={() => setTab("login")}>Sign in</a></>
              }
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

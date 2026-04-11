import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIES } from "../constants";

// ─── Amenity options ──────────────────────────────────────────────────────────
const AMENITY_OPTIONS = [
  { value:"wifi",          icon:"📶", label:"WiFi"         },
  { value:"ac",            icon:"❄️", label:"AC"           },
  { value:"parking",       icon:"🚗", label:"Parking"      },
  { value:"gym",           icon:"💪", label:"Gym"          },
  { value:"meals_included",icon:"🍽️", label:"Meals"        },
  { value:"laundry",       icon:"👕", label:"Laundry"      },
  { value:"hot_water",     icon:"🚿", label:"Hot water"    },
  { value:"power_backup",  icon:"⚡", label:"Power backup" },
  { value:"security",      icon:"🔒", label:"Security"     },
  { value:"terrace",       icon:"🏙️", label:"Terrace"      },
  { value:"garden",        icon:"🌿", label:"Garden"       },
  { value:"tv",            icon:"📺", label:"TV"           },
];

const PROPERTY_TYPES = [
  { v:"flat",       icon:"🏢", label:"Flat / Apartment",   desc:"A self-contained unit"        },
  { v:"room",       icon:"🛏️", label:"Single room",        desc:"A private room"               },
  { v:"pg",         icon:"🏠", label:"PG / Hostel",        desc:"Paying guest accommodation"   },
  { v:"house",      icon:"🏡", label:"Independent house",  desc:"Full house or bungalow"       },
  { v:"villa",      icon:"🏰", label:"Villa / Farmhouse",  desc:"Premium or luxury property"   },
  { v:"commercial", icon:"🏪", label:"Commercial",         desc:"Office or shop space"         },
];

const STEPS = ["Property type", "Details", "Pricing", "Photos", "Publish"];

const INIT_FORM = {
  type:"flat", title:"", desc:"", city:"", state:"", area:"", pincode:"",
  bedrooms:"1", bathrooms:"1", sqft:"", maxGuests:"2", floors:"",
  price:"", priceType:"per_month", deposit:"", amenities:[],
  contactName:"", contactPhone:"", contactEmail:"",
};

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, error, children, full }) {
  return (
    <div className={`reg-field${full ? " reg-field-full" : ""}`}>
      <label className="reg-label">{label}</label>
      {children}
      {error && <div className="reg-error">{error}</div>}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div className="reg-steps">
      {STEPS.map((s, i) => (
        <div key={i} className={`reg-step-item${i === step ? " active" : i < step ? " done" : ""}`}>
          <div className="reg-step-num">{i < step ? "✓" : i + 1}</div>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main PropertyRegisterPage ────────────────────────────────────────────────
export default function PropertyRegisterPage() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState(0);
  const [form,    setForm]    = useState(INIT_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const toggleAmenity = (v) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(v)
        ? f.amenities.filter((x) => x !== v)
        : [...f.amenities, v],
    }));

  // ── Validation per step ──────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.title)  e.title  = "Property title is required";
      if (!form.city)   e.city   = "City is required";
      if (!form.area)   e.area   = "Area / locality is required";
    }
    if (step === 2) {
      if (!form.price)  e.price  = "Price is required";
    }
    if (step === 4) {
      if (!form.contactName)  e.contactName  = "Contact name is required";
      if (!form.contactPhone) e.contactPhone = "Contact phone is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step === STEPS.length - 1) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1800));
      setLoading(false);
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  // ── Input/Select shared style ──────────────────────────────────────
  const inp = (extra) => ({ ...extra });

  // ── Success screen ─────────────────────────────────────────────────
  if (done) return (
    <div className="reg-root">
      <nav className="reg-navbar">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="reg-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="reg-brand-name">Nivaas</span>
        </div>
      </nav>
      <div className="reg-body">
        <div className="reg-success">
          <div className="reg-success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="reg-success-title">Property listed!</h1>
          <p className="reg-success-desc">
            <strong>"{form.title || "Your listing"}"</strong> has been submitted for review.
            Our team will verify and publish it within 24 hours.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="reg-btn-primary" onClick={() => navigate("/dashboard")}>Go to dashboard →</button>
            <button className="reg-btn-secondary" onClick={() => { setDone(false); setStep(0); setForm(INIT_FORM); }}>
              List another property
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reg-root">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="reg-navbar">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="reg-back-link" onClick={handleBack}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <div className="reg-logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="reg-brand-name">Nivaas</span>
        </div>
        <div style={{ fontSize:"0.78rem", color:"var(--stone)" }}>Step {step + 1} of {STEPS.length}</div>
      </nav>

      <div className="reg-body">
        {/* Header */}
        <div className="reg-header">
          <div className="reg-eyebrow"><span />List your property</div>
          <h1 className="reg-title">Share your <em>space</em><br />with India</h1>
          <p className="reg-desc">Zero brokerage. Instant bookings. Full control. Join 3,000+ owners on Nivaas.</p>
        </div>

        {/* Step bar */}
        <StepBar step={step} />

        {/* ── STEP 0 — Property type ───────────────────────────────── */}
        {step === 0 && (
          <div className="reg-card">
            <h2 className="reg-card-title">What type of property are you listing?</h2>
            <p className="reg-card-sub">Choose the option that best describes your space</p>
            <div className="reg-type-grid">
              {PROPERTY_TYPES.map((t) => (
                <div
                  key={t.v}
                  className={`reg-type-card${form.type === t.v ? " selected" : ""}`}
                  onClick={() => set("type", t.v)}
                >
                  <div className="reg-type-icon">{t.icon}</div>
                  <div className="reg-type-label">{t.label}</div>
                  <div className="reg-type-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 — Details ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Property details</h2>
            <p className="reg-card-sub">Tell tenants about your space</p>

            <Field label="Property title *" error={errors.title} full>
              <input
                className={`reg-input${errors.title ? " error" : ""}`}
                placeholder="e.g. Sunlit 2BHK near Metro, Indiranagar"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>

            <Field label="Description" full>
              <textarea
                className="reg-input reg-textarea"
                placeholder="Describe your space — highlight unique features, neighbourhood, nearby landmarks…"
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
              />
            </Field>

            <div className="reg-grid-2">
              <Field label="City *" error={errors.city}>
                <select className={`reg-input reg-select${errors.city ? " error" : ""}`} value={form.city} onChange={(e) => set("city", e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="State">
                <input className="reg-input" placeholder="Rajasthan" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
            </div>

            <div className="reg-grid-2">
              <Field label="Area / locality *" error={errors.area}>
                <input className={`reg-input${errors.area ? " error" : ""}`} placeholder="Malviya Nagar" value={form.area} onChange={(e) => set("area", e.target.value)} />
              </Field>
              <Field label="Pincode">
                <input className="reg-input" placeholder="302001" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} />
              </Field>
            </div>

            <div className="reg-grid-3">
              {[
                ["bedrooms",  "Bedrooms",   "1", ["1","2","3","4","5+"]],
                ["bathrooms", "Bathrooms",  "1", ["1","2","3","4+"]],
                ["maxGuests", "Max guests", "2", ["1","2","3","4","5","6+"]],
              ].map(([k, label, placeholder, opts]) => (
                <Field key={k} label={label}>
                  <select className="reg-input reg-select" value={form[k]} onChange={(e) => set(k, e.target.value)}>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              ))}
            </div>

            <div className="reg-grid-2">
              <Field label="Area (sqft)">
                <input className="reg-input" type="number" placeholder="500" value={form.sqft} onChange={(e) => set("sqft", e.target.value)} />
              </Field>
              <Field label="Floor number">
                <input className="reg-input" placeholder="Ground / 2nd / Top" value={form.floors} onChange={(e) => set("floors", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Pricing ─────────────────────────────────────── */}
        {step === 2 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Pricing & availability</h2>
            <p className="reg-card-sub">Set your rent and deposit requirements</p>

            <div className="reg-grid-2">
              <Field label="Monthly / nightly price *" error={errors.price}>
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input
                    className={`reg-input reg-input-prefixed${errors.price ? " error" : ""}`}
                    type="number"
                    placeholder="12000"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Price type">
                <select className="reg-input reg-select" value={form.priceType} onChange={(e) => set("priceType", e.target.value)}>
                  <option value="per_month">Per month</option>
                  <option value="per_night">Per night</option>
                  <option value="per_day">Per day</option>
                </select>
              </Field>
            </div>

            <Field label="Security deposit" full>
              <div className="reg-input-prefix-wrap">
                <span className="reg-input-prefix">₹</span>
                <input className="reg-input reg-input-prefixed" type="number" placeholder="One or two months rent" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} />
              </div>
            </Field>

            {/* Pricing preview */}
            {form.price && (
              <div className="reg-price-preview">
                <div className="reg-price-preview-label">Pricing preview</div>
                <div style={{ display:"flex", gap:"2rem", marginTop:"0.75rem" }}>
                  <div>
                    <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", color:"var(--charcoal)" }}>
                      ₹{Number(form.price).toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize:"0.75rem", color:"var(--stone)" }}>/{form.priceType.replace("per_","")}</div>
                  </div>
                  {form.deposit && (
                    <div>
                      <div style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"1.8rem", color:"var(--stone)" }}>
                        ₹{Number(form.deposit).toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize:"0.75rem", color:"var(--stone)" }}>security deposit</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div style={{ marginTop:"1.5rem" }}>
              <div className="reg-label" style={{ marginBottom:"0.75rem" }}>Amenities</div>
              <div className="reg-amenity-grid">
                {AMENITY_OPTIONS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    className={`reg-amenity-btn${form.amenities.includes(a.value) ? " selected" : ""}`}
                    onClick={() => toggleAmenity(a.value)}
                  >
                    <span className="reg-amenity-icon">{a.icon}</span>
                    <span className="reg-amenity-label">{a.label}</span>
                    {form.amenities.includes(a.value) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2.5" style={{ position:"absolute", top:6, right:6 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Photos ──────────────────────────────────────── */}
        {step === 3 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Add photos</h2>
            <p className="reg-card-sub">Properties with 5+ photos get 3× more inquiries</p>

            <div className="reg-upload-zone" onClick={() => alert("File picker — connect your storage API")}>
              <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>📸</div>
              <div className="reg-upload-text">Click to upload or drag photos here</div>
              <div className="reg-upload-sub">JPG, PNG or WEBP · Max 10 MB each · Up to 20 photos</div>
              <button type="button" className="reg-btn-primary" style={{ marginTop:"1.25rem", display:"inline-flex" }} onClick={(e) => { e.stopPropagation(); }}>
                Choose files
              </button>
            </div>

            <div style={{ marginTop:"1.25rem", padding:"1rem 1.25rem", background:"rgba(200,169,110,0.06)", border:"1px solid rgba(200,169,110,0.15)", borderRadius:10, fontSize:"0.8rem", color:"var(--stone)", lineHeight:1.6 }}>
              <strong style={{ color:"var(--charcoal)" }}>Tips for great photos:</strong>
              <ul style={{ marginTop:"0.4rem", paddingLeft:"1.1rem" }}>
                <li>Shoot during daytime for natural lighting</li>
                <li>Include all rooms: bedroom, bathroom, kitchen, living area</li>
                <li>Add exterior / building photo and nearby landmarks</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Publish ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Contact & publish</h2>
            <p className="reg-card-sub">Your details stay private until a tenant sends a request</p>

            <div className="reg-grid-2">
              <Field label="Contact name *" error={errors.contactName}>
                <input className={`reg-input${errors.contactName ? " error" : ""}`} placeholder="Rajesh Sharma" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
              </Field>
              <Field label="Phone number *" error={errors.contactPhone}>
                <input className={`reg-input${errors.contactPhone ? " error" : ""}`} type="tel" placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
              </Field>
            </div>
            <Field label="Email (optional)" full>
              <input className="reg-input" type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </Field>

            {/* Summary */}
            <div className="reg-summary">
              <div className="reg-summary-title">Listing summary</div>
              {[
                ["Type",     form.type],
                ["Title",    form.title    || "—"],
                ["Location", form.city ? `${form.area}, ${form.city}` : "—"],
                ["Price",    form.price    ? `₹${Number(form.price).toLocaleString("en-IN")} / ${form.priceType.replace("per_","")}` : "—"],
                ["Amenities",form.amenities.length > 0 ? `${form.amenities.length} selected` : "None"],
              ].map(([k, v]) => (
                <div key={k} className="reg-summary-row">
                  <span className="reg-summary-key">{k}</span>
                  <span className="reg-summary-val">{v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:"0.85rem 1rem", background:"rgba(94,114,82,0.06)", border:"1px solid rgba(94,114,82,0.15)", borderRadius:10, fontSize:"0.78rem", color:"var(--stone)", lineHeight:1.6, marginTop:"1rem" }}>
              ✅ By publishing, you agree to Nivaas's <a href="#" style={{ color:"var(--terracotta)" }}>Listing Terms</a> and confirm the information is accurate.
            </div>
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────────────── */}
        <div className="reg-nav-row">
          <button className="reg-btn-secondary" onClick={handleBack} disabled={loading}>
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button className="reg-btn-primary" onClick={handleNext} disabled={loading}>
            {loading
              ? <><div className="reg-spinner" />Publishing…</>
              : step === STEPS.length - 1 ? "Publish listing ✓" : "Continue →"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

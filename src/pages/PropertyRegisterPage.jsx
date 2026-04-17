import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CITIES } from "../constants";
import api from "../api/axiosInstance";
import PhotoUpload from "./PhotoUpload";

// ─── Constants ────────────────────────────────────────────────────────────────

const NEARBY_PLACE_TYPES = [
  { v: "metro", icon: "🚇", label: "Metro" },
  { v: "bus_stop", icon: "🚌", label: "Bus Stop" },
  { v: "hospital", icon: "🏥", label: "Hospital" },
  { v: "college", icon: "🎓", label: "College" },
  { v: "market", icon: "🛒", label: "Market" },
  { v: "restaurant", icon: "🍽️", label: "Restaurant" },
];

const AVAILABILITY_STATUS_OPTIONS = [
  { v: "active", icon: "✅", label: "Active", desc: "Visible to tenants" },
  {
    v: "inactive",
    icon: "⏸️",
    label: "Inactive",
    desc: "Hidden from listings",
  },
  { v: "rented", icon: "🔑", label: "Rented", desc: "Currently occupied" },
];

const AMENITY_OPTIONS = [
  { value: "wifi", icon: "📶", label: "WiFi" },
  { value: "ac", icon: "❄️", label: "AC" },
  { value: "parking", icon: "🚗", label: "Parking" },
  { value: "gym", icon: "💪", label: "Gym" },
  { value: "meals_included", icon: "🍽️", label: "Meals" },
  { value: "laundry", icon: "👕", label: "Laundry" },
  { value: "hot_water", icon: "🚿", label: "Hot water" },
  { value: "power_backup", icon: "⚡", label: "Power backup" },
  { value: "security", icon: "🔒", label: "Security" },
  { value: "terrace", icon: "🏙️", label: "Terrace" },
  { value: "garden", icon: "🌿", label: "Garden" },
  { value: "tv", icon: "📺", label: "TV" },
];

const PROPERTY_TYPES = [
  {
    v: "flat",
    icon: "🏢",
    label: "Flat / Apartment",
    desc: "A self-contained unit",
  },
  { v: "room", icon: "🛏️", label: "Single room", desc: "A private room" },
  {
    v: "pg",
    icon: "🏠",
    label: "PG / Hostel",
    desc: "Paying guest accommodation",
  },
  {
    v: "house",
    icon: "🏡",
    label: "Independent house",
    desc: "Full house or bungalow",
  },
  {
    v: "villa",
    icon: "🏰",
    label: "Villa / Farmhouse",
    desc: "Premium or luxury property",
  },
  {
    v: "hostel",
    icon: "🏪",
    label: "Commercial",
    desc: "Office or shop space",
  },
];

const FURNISHING_OPTIONS = [
  {
    v: "unfurnished",
    icon: "🪑",
    label: "Unfurnished",
    desc: "Empty space, no furniture",
  },
  {
    v: "semi_furnished",
    icon: "🛋️",
    label: "Semi-furnished",
    desc: "Basic furniture provided",
  },
  {
    v: "fully_furnished",
    icon: "🏠",
    label: "Fully furnished",
    desc: "Everything ready to move in",
  },
];

const GENDER_OPTIONS = [
  { v: "any", icon: "👥", label: "Any", desc: "Open to all" },
  { v: "male", icon: "👨", label: "Boys only", desc: "Male tenants only" },
  { v: "female", icon: "👩", label: "Girls only", desc: "Female tenants only" },
];

const STEPS = [
  "Property type",
  "Details",
  "Furnishing & Rules",
  "Pricing",
  "Photos",
  "Publish",
];

const INIT_FORM = {
  // Step 0
  propertyType: "flat",
  // Step 1
  title: "",
  description: "",
  city: "",
  state: "",
  address: "",
  pincode: "",
  landmark: "",
  totalRooms: "1",
  bathrooms: "1",
  balcony: false,
  floorNumber: "",
  totalFloors: "",
  areaSqFt: "",
  // Step 2
  furnishingStatus: "unfurnished",
  gender: "any",
  rules: {
    petsAllowed: false,
    smokingAllowed: false,
    alcoholAllowed: false,
    guestsAllowed: true,
    additionalRules: [],
  },
  // Step 3
  basePrice: "",
  priceType: "per_month",
  securityDeposit: "",
  maintenanceCharges: "",
  amenities: [],
  // Step 4 — images handled separately
  // Step 5
  availableFrom: "",
  minimumStay: "1",
  maximumStay: "",
  nearbyPlaces: [],
  status: "active",
};

// ─── Reusable components ──────────────────────────────────────────────────────

function Field({ label, error, children, full, hint }) {
  return (
    <div className={`reg-field${full ? " reg-field-full" : ""}`}>
      <label className="reg-label">{label}</label>
      {hint && <div className="reg-hint">{hint}</div>}
      {children}
      {error && <div className="reg-error">⚠ {error}</div>}
    </div>
  );
}

function StepBar({ step }) {
  return (
    <div className="reg-steps">
      {STEPS.map((s, i) => (
        <div
          key={i}
          className={`reg-step-item${i === step ? " active" : i < step ? " done" : ""}`}
        >
          <div className="reg-step-num">{i < step ? "✓" : i + 1}</div>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

/** Reusable radio-card grid for single-select enums */
function RadioCardGrid({ options, value, onChange, cols = 3 }) {
  return (
    <div
      className="reg-type-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {options.map((o) => (
        <div
          key={o.v}
          className={`reg-type-card${value === o.v ? " selected" : ""}`}
          onClick={() => onChange(o.v)}
        >
          <div className="reg-type-icon">{o.icon}</div>
          <div className="reg-type-label">{o.label}</div>
          {o.desc && <div className="reg-type-desc">{o.desc}</div>}
        </div>
      ))}
    </div>
  );
}

/** Toggle button for boolean rules */
function RuleToggle({ label, icon, value, onChange }) {
  return (
    <button
      type="button"
      className={`reg-rule-btn${value ? " allowed" : " denied"}`}
      onClick={() => onChange(!value)}
    >
      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      <span className="reg-rule-label">{label}</span>
      <span className={`reg-rule-badge${value ? " yes" : " no"}`}>
        {value ? "Allowed" : "Not allowed"}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INIT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [addRule, setAddRule] = useState("");
  const [propertyPhotos, setPropertyPhotos] = useState([]);

  // ── Setters ──────────────────────────────────────────────────────
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const setRule = (k, v) =>
    setForm((f) => ({ ...f, rules: { ...f.rules, [k]: v } }));

  const addAdditionalRule = () => {
    if (!addRule.trim()) return;
    setForm((f) => ({
      ...f,
      rules: {
        ...f.rules,
        additionalRules: [...f.rules.additionalRules, addRule.trim()],
      },
    }));
    setAddRule("");
  };

  const removeAdditionalRule = (i) =>
    setForm((f) => ({
      ...f,
      rules: {
        ...f.rules,
        additionalRules: f.rules.additionalRules.filter((_, idx) => idx !== i),
      },
    }));

  const toggleAmenity = (v) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(v)
        ? f.amenities.filter((x) => x !== v)
        : [...f.amenities, v],
    }));

  // ── Validation ───────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.title) e.title = "Property title is required";
      if (!form.city) e.city = "City is required";
      if (!form.address) e.address = "Area / locality is required";
    }
    if (step === 3) {
      if (!form.basePrice) e.basePrice = "Price is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Existing handlers ke neeche ye add karo

  const addNearbyPlace = () => {
    setForm((f) => ({
      ...f,
      nearbyPlaces: [
        ...f.nearbyPlaces,
        { name: "", type: "metro", distanceInKm: "" },
      ],
    }));
  };

  const updateNearbyPlace = (i, key, val) => {
    setForm((f) => {
      const updated = [...f.nearbyPlaces];
      updated[i] = { ...updated[i], [key]: val };
      return { ...f, nearbyPlaces: updated };
    });
  };

  const removeNearbyPlace = (i) => {
    setForm((f) => ({
      ...f,
      nearbyPlaces: f.nearbyPlaces.filter((_, idx) => idx !== i),
    }));
  };

  // ── Build schema-aligned payload ─────────────────────────────────
  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    propertyType: form.propertyType,
    furnishingStatus: form.furnishingStatus,
    gender: form.gender,
    pricing: {
      basePrice: Number(form.basePrice),
      priceType: form.priceType,
      securityDeposit: Number(form.securityDeposit) || 0,
      maintenanceCharges: Number(form.maintenanceCharges) || 0,
    },
    roomInfo: {
      totalRooms: Number(form.totalRooms) || 1,
      availableRooms: Number(form.totalRooms) || 1,
      bathrooms: Number(form.bathrooms) || 1,
      balcony: form.balcony,
      floorNumber: Number(form.floorNumber) || 0,
      totalFloors: Number(form.totalFloors) || 1,
      areaSqFt: Number(form.areaSqFt) || undefined,
    },
    location: {
      address: form.address,
      city: form.city,
      state: form.state,
      country: "India",
      pincode: form.pincode,
      landmark: form.landmark,
    },
    amenities: form.amenities,
    rules: form.rules,
    availability: {
      isAvailable: true,
      availableFrom: form.availableFrom
        ? new Date(form.availableFrom)
        : new Date(),
      minimumStay: Number(form.minimumStay) || 1,
      maximumStay: form.maximumStay ? Number(form.maximumStay) : undefined,
    },
    status: form.status,
    nearbyPlaces: form.nearbyPlaces
      .filter((p) => p.name.trim()) // empty entries skip karo
      .map((p) => ({
        name: p.name.trim(),
        type: p.type,
        distanceInKm: Number(p.distanceInKm) || 0,
      })),
  });

  // ── Navigation ───────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validate()) return;
    if (step === STEPS.length - 1) {
      setLoading(true);
      try {
        console.log("Hello1");
        const payload = buildPayload();

        // ✅ FormData banao aur JSON data string mein daalo
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload)); // baaki fields

        // ✅ Images attach karo
        if (propertyPhotos.length === 0) {
          setErrors((e) => ({
            ...e,
            _form: "Please upload at least one photo.",
          }));
          setLoading(false);
          return;
        }
        propertyPhotos.forEach((file) => formData.append("images", file));
        console.log("Data: ", formData);

        const res = await api.post("/properties/register-property", formData);
        console.log("RES FROM REG: ", res);
        setDone(true);
        if (res.data.statusCode === 200) {
          // 2xx  →  success
          navigate("/submission-status", {
            state: { status: "success" },
          });
        } else {
          // 4xx / 5xx  →  failure
          navigate("/submission-status", {
            state: { status: "failure", errorCode: res.status },
          });
        }
      } catch (err) {
        console.log("ERR FROM SUBMIT: ", err);
        const msg =
          err.response?.data?.message || "Failed to publish. Please try again.";
        setErrors((e) => ({ ...e, _form: msg }));
        navigate("/submission-status", {
          state: { status: "failure", errorCode: "NETWORK_ERROR" },
        });
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  // ── Success screen ────────────────────────────────────────────────
  if (done)
    return (
      <div className="reg-root">
        <nav className="reg-navbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="reg-logo-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F7F3EC"
                strokeWidth="2.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="reg-brand-name">Nivaas</span>
          </div>
        </nav>
        <div className="reg-body">
          <div className="reg-success">
            <div className="reg-success-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="reg-success-title">Property listed!</h1>
            <p className="reg-success-desc">
              <strong>"{form.title || "Your listing"}"</strong> has been
              submitted for review. Our team will verify and publish it within
              24 hours.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                className="reg-btn-primary"
                onClick={() => navigate("/smart-dashboard")}
              >
                Go to dashboard →
              </button>
              <button
                className="reg-btn-secondary"
                onClick={() => {
                  setDone(false);
                  setStep(0);
                  setForm(INIT_FORM);
                }}
              >
                List another property
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="reg-root">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="reg-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="reg-back-link" onClick={handleBack}>
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
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <div className="reg-logo-icon">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F7F3EC"
              strokeWidth="2.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="reg-brand-name">Nivaas</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--stone)" }}>
          Step {step + 1} of {STEPS.length}
        </div>
      </nav>

      <div className="reg-body">
        {/* Header */}
        <div className="reg-header">
          <div className="reg-eyebrow">
            <span />
            List your property
          </div>
          <h1 className="reg-title">
            Share your <em>space</em>
            <br />
            with India
          </h1>
          <p className="reg-desc">
            Zero brokerage. Instant bookings. Full control. Join 3,000+ owners
            on Nivaas.
          </p>
        </div>

        <StepBar step={step} />

        {/* ── STEP 0 — Property type ──────────────────────────── */}
        {step === 0 && (
          <div className="reg-card">
            <h2 className="reg-card-title">
              What type of property are you listing?
            </h2>
            <p className="reg-card-sub">
              Choose the option that best describes your space
            </p>
            <RadioCardGrid
              options={PROPERTY_TYPES}
              value={form.propertyType}
              onChange={(v) => set("propertyType", v)}
              cols={3}
            />
          </div>
        )}

        {/* ── STEP 1 — Details ────────────────────────────────── */}
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
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>

            <div className="reg-grid-2">
              <Field label="City *" error={errors.city}>
                <select
                  className={`reg-input reg-select${errors.city ? " error" : ""}`}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="State">
                <input
                  className="reg-input"
                  placeholder="Rajasthan"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                />
              </Field>
            </div>

            <div className="reg-grid-2">
              <Field label="Area / locality *" error={errors.address}>
                <input
                  className={`reg-input${errors.address ? " error" : ""}`}
                  placeholder="Malviya Nagar"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
              <Field label="Pincode">
                <input
                  className="reg-input"
                  placeholder="302001"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value)}
                  maxLength={6}
                />
              </Field>
            </div>

            <Field label="Landmark (optional)" full>
              <input
                className="reg-input"
                placeholder="e.g. Near City Mall, Opposite SBI Bank"
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
              />
            </Field>

            {/* Nearby Places */}
            <div style={{ marginTop: "1.5rem" }}>
              <div
                className="reg-section-label"
                style={{ marginBottom: "0.75rem" }}
              >
                Nearby places
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    color: "var(--stone)",
                    marginLeft: "0.5rem",
                  }}
                >
                  (optional)
                </span>
              </div>

              {form.nearbyPlaces.map((place, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "0.5rem",
                    marginBottom: "0.6rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="reg-input"
                    placeholder="Name e.g. Ajmer Road Metro"
                    value={place.name}
                    onChange={(e) =>
                      updateNearbyPlace(i, "name", e.target.value)
                    }
                  />
                  <select
                    className="reg-input reg-select"
                    value={place.type}
                    onChange={(e) =>
                      updateNearbyPlace(i, "type", e.target.value)
                    }
                  >
                    {NEARBY_PLACE_TYPES.map((t) => (
                      <option key={t.v} value={t.v}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="reg-input-prefix-wrap">
                    <span className="reg-input-prefix">km</span>
                    <input
                      className="reg-input reg-input-prefixed"
                      type="number"
                      placeholder="0.5"
                      step="0.1"
                      min="0"
                      value={place.distanceInKm}
                      onChange={(e) =>
                        updateNearbyPlace(i, "distanceInKm", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNearbyPlace(i)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--terracotta)",
                      fontSize: "1.1rem",
                      padding: "0 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Quick type pills */}
              {form.nearbyPlaces.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {NEARBY_PLACE_TYPES.map((t) => (
                    <button
                      key={t.v}
                      type="button"
                      className="reg-amenity-btn"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          nearbyPlaces: [
                            ...f.nearbyPlaces,
                            { name: t.label, type: t.v, distanceInKm: "" },
                          ],
                        }))
                      }
                    >
                      <span className="reg-amenity-icon">{t.icon}</span>
                      <span className="reg-amenity-label">{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="reg-btn-secondary"
                style={{ fontSize: "0.82rem", padding: "0.4rem 1rem" }}
                onClick={addNearbyPlace}
              >
                + Add nearby place
              </button>
            </div>

            <div className="reg-grid-3">
              {[
                ["totalRooms", "Total rooms", ["1", "2", "3", "4", "5", "6+"]],
                ["bathrooms", "Bathrooms", ["1", "2", "3", "4+"]],
                [
                  "totalFloors",
                  "Total floors",
                  ["1", "2", "3", "4", "5", "6", "7+"],
                ],
              ].map(([k, label, opts]) => (
                <Field key={k} label={label}>
                  <select
                    className="reg-input reg-select"
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                  >
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>

            <div className="reg-grid-2">
              <Field label="Area (sqft)">
                <input
                  className="reg-input"
                  type="number"
                  placeholder="500"
                  value={form.areaSqFt}
                  onChange={(e) => set("areaSqFt", e.target.value)}
                />
              </Field>
              <Field label="Floor number">
                <input
                  className="reg-input"
                  type="number"
                  placeholder="0 = Ground"
                  value={form.floorNumber}
                  onChange={(e) => set("floorNumber", e.target.value)}
                />
              </Field>
            </div>

            {/* Balcony — boolean toggle */}
            <div style={{ marginTop: "0.5rem" }}>
              <div className="reg-label" style={{ marginBottom: "0.6rem" }}>
                Balcony
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`reg-bool-btn${form.balcony === v ? " selected" : ""}`}
                    onClick={() => set("balcony", v)}
                  >
                    {v ? "✅ Yes" : "❌ No"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Furnishing & Rules ─────────────────────── */}
        {step === 2 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Furnishing & house rules</h2>
            <p className="reg-card-sub">Help tenants know what to expect</p>

            {/* Furnishing status */}
            <div style={{ marginBottom: "2rem" }}>
              <div className="reg-section-label">Furnishing status</div>
              <RadioCardGrid
                options={FURNISHING_OPTIONS}
                value={form.furnishingStatus}
                onChange={(v) => set("furnishingStatus", v)}
                cols={3}
              />
            </div>

            {/* Gender preference */}
            <div style={{ marginBottom: "2rem" }}>
              <div className="reg-section-label">Preferred tenants</div>
              <RadioCardGrid
                options={GENDER_OPTIONS}
                value={form.gender}
                onChange={(v) => set("gender", v)}
                cols={3}
              />
            </div>

            {/* House rules */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="reg-section-label">House rules</div>
              <div className="reg-rules-grid">
                <RuleToggle
                  label="Pets"
                  icon="🐾"
                  value={form.rules.petsAllowed}
                  onChange={(v) => setRule("petsAllowed", v)}
                />
                <RuleToggle
                  label="Smoking"
                  icon="🚬"
                  value={form.rules.smokingAllowed}
                  onChange={(v) => setRule("smokingAllowed", v)}
                />
                <RuleToggle
                  label="Alcohol"
                  icon="🍷"
                  value={form.rules.alcoholAllowed}
                  onChange={(v) => setRule("alcoholAllowed", v)}
                />
                <RuleToggle
                  label="Guests"
                  icon="👤"
                  value={form.rules.guestsAllowed}
                  onChange={(v) => setRule("guestsAllowed", v)}
                />
              </div>
            </div>

            {/* Additional rules */}
            <div>
              <div className="reg-section-label">
                Additional rules{" "}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    color: "var(--stone)",
                  }}
                >
                  (optional)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <input
                  className="reg-input"
                  style={{ flex: 1 }}
                  placeholder="e.g. No loud music after 10 PM"
                  value={addRule}
                  onChange={(e) => setAddRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAdditionalRule()}
                />
                <button
                  type="button"
                  className="reg-btn-secondary"
                  style={{ whiteSpace: "nowrap", padding: "0 1rem" }}
                  onClick={addAdditionalRule}
                >
                  + Add
                </button>
              </div>
              {form.rules.additionalRules.length > 0 && (
                <div className="reg-tag-list">
                  {form.rules.additionalRules.map((r, i) => (
                    <div key={i} className="reg-tag">
                      {r}
                      <button
                        type="button"
                        onClick={() => removeAdditionalRule(i)}
                        style={{
                          marginLeft: 6,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--terracotta)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3 — Pricing ────────────────────────────────── */}
        {step === 3 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Pricing & availability</h2>
            <p className="reg-card-sub">
              Set your rent, deposit, and move-in details
            </p>

            <div className="reg-grid-2">
              <Field label="Monthly / nightly price *" error={errors.basePrice}>
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input
                    className={`reg-input reg-input-prefixed${errors.basePrice ? " error" : ""}`}
                    type="number"
                    placeholder="12000"
                    value={form.basePrice}
                    onChange={(e) => set("basePrice", e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Price type">
                <select
                  className="reg-input reg-select"
                  value={form.priceType}
                  onChange={(e) => set("priceType", e.target.value)}
                >
                  <option value="per_month">Per month</option>
                  <option value="per_night">Per night</option>
                  <option value="per_day">Per day</option>
                </select>
              </Field>
            </div>

            <div className="reg-grid-2">
              <Field label="Security deposit">
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input
                    className="reg-input reg-input-prefixed"
                    type="number"
                    placeholder="One or two months rent"
                    value={form.securityDeposit}
                    onChange={(e) => set("securityDeposit", e.target.value)}
                  />
                </div>
              </Field>
              <Field
                label="Maintenance charges"
                hint="Monthly society / maintenance fee"
              >
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input
                    className="reg-input reg-input-prefixed"
                    type="number"
                    placeholder="0"
                    value={form.maintenanceCharges}
                    onChange={(e) => set("maintenanceCharges", e.target.value)}
                  />
                </div>
              </Field>
            </div>

            {/* Pricing preview */}
            {form.basePrice && (
              <div className="reg-price-preview">
                <div className="reg-price-preview-label">Pricing preview</div>
                <div
                  style={{
                    display: "flex",
                    gap: "2rem",
                    marginTop: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "Cormorant Garamond,serif",
                        fontSize: "1.8rem",
                        color: "var(--charcoal)",
                      }}
                    >
                      ₹{Number(form.basePrice).toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--stone)" }}>
                      /{form.priceType.replace("per_", "")}
                    </div>
                  </div>
                  {form.securityDeposit && (
                    <div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond,serif",
                          fontSize: "1.8rem",
                          color: "var(--stone)",
                        }}
                      >
                        ₹{Number(form.securityDeposit).toLocaleString("en-IN")}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--stone)" }}
                      >
                        security deposit
                      </div>
                    </div>
                  )}
                  {form.maintenanceCharges && (
                    <div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond,serif",
                          fontSize: "1.8rem",
                          color: "var(--stone)",
                        }}
                      >
                        ₹
                        {Number(form.maintenanceCharges).toLocaleString(
                          "en-IN",
                        )}
                      </div>
                      <div
                        style={{ fontSize: "0.75rem", color: "var(--stone)" }}
                      >
                        maintenance / month
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div style={{ marginTop: "1.5rem" }}>
              <div
                className="reg-section-label"
                style={{ marginBottom: "0.75rem" }}
              >
                Amenities
              </div>
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--terracotta)"
                        strokeWidth="2.5"
                        style={{ position: "absolute", top: 6, right: 6 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginTop: "1.75rem" }}>
              <div
                className="reg-section-label"
                style={{ marginBottom: "0.75rem" }}
              >
                Availability
              </div>
              <div className="reg-grid-3">
                <Field label="Available from">
                  <input
                    className="reg-input"
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => set("availableFrom", e.target.value)}
                  />
                </Field>
                <Field label="Minimum stay (months)">
                  <select
                    className="reg-input reg-select"
                    value={form.minimumStay}
                    onChange={(e) => set("minimumStay", e.target.value)}
                  >
                    {["1", "2", "3", "6", "11", "12", "24"].map((m) => (
                      <option key={m} value={m}>
                        {m} month{m !== "1" ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Maximum stay (months)"
                  hint="Leave blank for no limit"
                >
                  <input
                    className="reg-input"
                    type="number"
                    placeholder="e.g. 24"
                    value={form.maximumStay}
                    onChange={(e) => set("maximumStay", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Photos ─────────────────────────────────── */}
        {step === 4 && <PhotoUpload onFilesChange={setPropertyPhotos} />}

        {/* ── STEP 5 — Publish ────────────────────────────────── */}
        {step === 5 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Review & publish</h2>
            <p className="reg-card-sub">
              Your listing goes live after a quick verification
            </p>

            {/* Status selector — ADD THIS */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                className="reg-section-label"
                style={{ marginBottom: "0.75rem" }}
              >
                Listing status
              </div>
              <RadioCardGrid
                options={AVAILABILITY_STATUS_OPTIONS}
                value={form.status}
                onChange={(v) => set("status", v)}
                cols={3}
              />
            </div>

            <div className="reg-summary">
              <div className="reg-summary-title">Listing summary</div>
              {[
                [
                  "Type",
                  PROPERTY_TYPES.find((t) => t.v === form.propertyType)
                    ?.label || form.propertyType,
                ],
                ["Title", form.title || "—"],
                ["Location", form.city ? `${form.address}, ${form.city}` : "—"],
                [
                  "Furnishing",
                  FURNISHING_OPTIONS.find((f) => f.v === form.furnishingStatus)
                    ?.label || "—",
                ],
                [
                  "Preferred for",
                  GENDER_OPTIONS.find((g) => g.v === form.gender)?.label || "—",
                ],
                [
                  "Price",
                  form.basePrice
                    ? `₹${Number(form.basePrice).toLocaleString("en-IN")} / ${form.priceType.replace("per_", "")}`
                    : "—",
                ],
                [
                  "Deposit",
                  form.securityDeposit
                    ? `₹${Number(form.securityDeposit).toLocaleString("en-IN")}`
                    : "None",
                ],
                [
                  "Maintenance",
                  form.maintenanceCharges
                    ? `₹${Number(form.maintenanceCharges).toLocaleString("en-IN")} / month`
                    : "None",
                ],
                [
                  "Amenities",
                  form.amenities.length > 0
                    ? `${form.amenities.length} selected`
                    : "None",
                ],
                ["Min stay", `${form.minimumStay} month(s)`],
                [
                  "Status",
                  AVAILABILITY_STATUS_OPTIONS.find((s) => s.v === form.status)
                    ?.label || "Active",
                ],
                [
                  "Nearby",
                  form.nearbyPlaces.length > 0
                    ? `${form.nearbyPlaces.length} place(s) added`
                    : "None",
                ],
              ].map(([k, v]) => (
                <div key={k} className="reg-summary-row">
                  <span className="reg-summary-key">{k}</span>
                  <span className="reg-summary-val">{v}</span>
                </div>
              ))}
            </div>

            {errors._form && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem 1rem",
                  background: "rgba(220,60,60,0.06)",
                  border: "1px solid rgba(220,60,60,0.2)",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                  color: "#c0392b",
                }}
              >
                ⚠ {errors._form}
              </div>
            )}

            <div
              style={{
                padding: "0.85rem 1rem",
                background: "rgba(94,114,82,0.06)",
                border: "1px solid rgba(94,114,82,0.15)",
                borderRadius: 10,
                fontSize: "0.78rem",
                color: "var(--stone)",
                lineHeight: 1.6,
                marginTop: "1rem",
              }}
            >
              ✅ By publishing, you agree to Nivaas's{" "}
              <a href="#" style={{ color: "var(--terracotta)" }}>
                Listing Terms
              </a>{" "}
              and confirm the information is accurate.
            </div>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────────────── */}
        <div className="reg-nav-row">
          <button
            className="reg-btn-secondary"
            onClick={handleBack}
            disabled={loading}
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button
            className="reg-btn-primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="reg-spinner" />
                Publishing…
              </>
            ) : step === STEPS.length - 1 ? (
              "Publish listing ✓"
            ) : (
              "Continue →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

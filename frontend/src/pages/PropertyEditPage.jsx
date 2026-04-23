import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CITIES } from "../constants";
import api from "../api/axiosInstance";

// ─── Same constants as RegisterPage ──────────────────────────────────────────

const NEARBY_PLACE_TYPES = [
  { v: "metro",      icon: "🚇", label: "Metro" },
  { v: "bus_stop",   icon: "🚌", label: "Bus Stop" },
  { v: "hospital",   icon: "🏥", label: "Hospital" },
  { v: "college",    icon: "🎓", label: "College" },
  { v: "market",     icon: "🛒", label: "Market" },
  { v: "restaurant", icon: "🍽️", label: "Restaurant" },
];

const AMENITY_OPTIONS = [
  { value: "wifi",           icon: "📶", label: "WiFi" },
  { value: "ac",             icon: "❄️", label: "AC" },
  { value: "parking",        icon: "🚗", label: "Parking" },
  { value: "gym",            icon: "💪", label: "Gym" },
  { value: "meals_included", icon: "🍽️", label: "Meals" },
  { value: "laundry",        icon: "👕", label: "Laundry" },
  { value: "hot_water",      icon: "🚿", label: "Hot water" },
  { value: "power_backup",   icon: "⚡", label: "Power backup" },
  { value: "security",       icon: "🔒", label: "Security" },
  { value: "terrace",        icon: "🏙️", label: "Terrace" },
  { value: "garden",         icon: "🌿", label: "Garden" },
  { value: "tv",             icon: "📺", label: "TV" },
];

const PROPERTY_TYPES = [
  { v: "flat",   icon: "🏢", label: "Flat / Apartment",    desc: "A self-contained unit" },
  { v: "room",   icon: "🛏️", label: "Single room",         desc: "A private room" },
  { v: "pg",     icon: "🏠", label: "PG / Hostel",         desc: "Paying guest accommodation" },
  { v: "house",  icon: "🏡", label: "Independent house",   desc: "Full house or bungalow" },
  { v: "villa",  icon: "🏰", label: "Villa / Farmhouse",   desc: "Premium or luxury property" },
  { v: "hostel", icon: "🏪", label: "Commercial",          desc: "Office or shop space" },
];

const FURNISHING_OPTIONS = [
  { v: "unfurnished",    icon: "🪑", label: "Unfurnished",    desc: "Empty space, no furniture" },
  { v: "semi_furnished", icon: "🛋️", label: "Semi-furnished", desc: "Basic furniture provided" },
  { v: "fully_furnished",icon: "🏠", label: "Fully furnished", desc: "Everything ready to move in" },
];

const GENDER_OPTIONS = [
  { v: "any",    icon: "👥", label: "Any",        desc: "Open to all" },
  { v: "male",   icon: "👨", label: "Boys only",  desc: "Male tenants only" },
  { v: "female", icon: "👩", label: "Girls only", desc: "Female tenants only" },
];

const AVAILABILITY_STATUS_OPTIONS = [
  { v: "active",   icon: "✅", label: "Active",   desc: "Visible to tenants" },
  { v: "inactive", icon: "⏸️", label: "Inactive", desc: "Hidden from listings" },
  { v: "rented",   icon: "🔑", label: "Rented",   desc: "Currently occupied" },
];

const TABS = ["Basic Info", "Details", "Furnishing & Rules", "Pricing", "Availability & Status"];

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

function RadioCardGrid({ options, value, onChange, cols = 3 }) {
  return (
    <div className="reg-type-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
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

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function TabBar({ activeTab, setActiveTab, savedTabs }) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--border)",
      marginBottom: "1.75rem",
      overflowX: "auto",
      paddingBottom: 0,
    }}>
      {TABS.map((tab, i) => {
        const isActive = activeTab === i;
        const isSaved = savedTabs.includes(i);
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "0.65rem 1.1rem",
              border: "none",
              borderBottom: isActive ? "2px solid var(--terracotta)" : "2px solid transparent",
              background: "none",
              color: isActive ? "var(--terracotta)" : "var(--stone)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.82rem",
              fontWeight: isActive ? 500 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
              marginBottom: -1,
            }}
          >
            {isSaved && !isActive && (
              <span style={{ color: "var(--sage)", fontSize: "0.65rem" }}>✓</span>
            )}
            {tab}
          </button>
        );
      })}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      display: "flex", flexDirection: "column", gap: 8, zIndex: 999,
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0.75rem 1.25rem", borderRadius: 10, fontSize: "0.82rem",
          background: t.type === "success" ? "var(--sage)" : "var(--terracotta)",
          color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "fadeUp 0.3s ease both",
          fontFamily: "DM Sans, sans-serif",
        }}>
          {t.type === "success" ? "✓" : "✕"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PropertyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState(0);
  const [savedTabs, setSavedTabs]   = useState([]);
  const [fetching, setFetching]     = useState(true);
  const [saving, setSaving]         = useState(false);
  const [errors, setErrors]         = useState({});
  const [toasts, setToasts]         = useState([]);
  const [addRule, setAddRule]       = useState("");
  const [originalTitle, setOriginalTitle] = useState("");

  const [form, setForm] = useState({
    propertyType: "flat",
    title: "", description: "",
    city: "", state: "", address: "", pincode: "", landmark: "",
    totalRooms: "1", bathrooms: "1", balcony: false,
    floorNumber: "", totalFloors: "", areaSqFt: "",
    furnishingStatus: "unfurnished", gender: "any",
    rules: { petsAllowed: false, smokingAllowed: false, alcoholAllowed: false, guestsAllowed: true, additionalRules: [] },
    basePrice: "", priceType: "per_month",
    securityDeposit: "", maintenanceCharges: "",
    amenities: [],
    availableFrom: "", minimumStay: "1", maximumStay: "",
    nearbyPlaces: [],
    status: "active",
  });

  // ── Toast helper ─────────────────────────────────────────────────
  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3500);
  };

  // ── Fetch existing listing ────────────────────────────────────────
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/properties/get-property/${id}`);
        const p = res.data.data || res.data;
        setOriginalTitle(p.title || "");

        // Flatten API response into form shape
        setForm({
          propertyType:    p.propertyType      || "flat",
          title:           p.title             || "",
          description:     p.description       || "",
          city:            p.location?.city    || "",
          state:           p.location?.state   || "",
          address:         p.location?.address || "",
          pincode:         p.location?.pincode || "",
          landmark:        p.location?.landmark|| "",
          totalRooms:      String(p.roomInfo?.totalRooms   || 1),
          bathrooms:       String(p.roomInfo?.bathrooms    || 1),
          balcony:         p.roomInfo?.balcony  ?? false,
          floorNumber:     String(p.roomInfo?.floorNumber  || ""),
          totalFloors:     String(p.roomInfo?.totalFloors  || ""),
          areaSqFt:        String(p.roomInfo?.areaSqFt     || ""),
          furnishingStatus: p.furnishingStatus  || "unfurnished",
          gender:           p.gender            || "any",
          rules: {
            petsAllowed:      p.rules?.petsAllowed      ?? false,
            smokingAllowed:   p.rules?.smokingAllowed   ?? false,
            alcoholAllowed:   p.rules?.alcoholAllowed   ?? false,
            guestsAllowed:    p.rules?.guestsAllowed    ?? true,
            additionalRules:  p.rules?.additionalRules  || [],
          },
          basePrice:          String(p.pricing?.basePrice          || ""),
          priceType:          p.pricing?.priceType                 || "per_month",
          securityDeposit:    String(p.pricing?.securityDeposit    || ""),
          maintenanceCharges: String(p.pricing?.maintenanceCharges || ""),
          amenities:          p.amenities   || [],
          availableFrom:      p.availability?.availableFrom
                                ? new Date(p.availability.availableFrom).toISOString().split("T")[0]
                                : "",
          minimumStay:        String(p.availability?.minimumStay || 1),
          maximumStay:        String(p.availability?.maximumStay || ""),
          nearbyPlaces:       (p.nearbyPlaces || []).map((np) => ({
                                name: np.name || "",
                                type: np.type || "metro",
                                distanceInKm: String(np.distanceInKm || ""),
                              })),
          status:             p.status || "active",
        });
      } catch (err) {
        addToast("Failed to load listing. Please go back.", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchListing();
  }, [id]);

  // ── Setters ──────────────────────────────────────────────────────
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const setRule = (k, v) => setForm((f) => ({ ...f, rules: { ...f.rules, [k]: v } }));

  const toggleAmenity = (v) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(v)
        ? f.amenities.filter((x) => x !== v)
        : [...f.amenities, v],
    }));

  const addAdditionalRule = () => {
    if (!addRule.trim()) return;
    setForm((f) => ({ ...f, rules: { ...f.rules, additionalRules: [...f.rules.additionalRules, addRule.trim()] } }));
    setAddRule("");
  };
  const removeAdditionalRule = (i) =>
    setForm((f) => ({ ...f, rules: { ...f.rules, additionalRules: f.rules.additionalRules.filter((_, idx) => idx !== i) } }));

  const addNearbyPlace = () =>
    setForm((f) => ({ ...f, nearbyPlaces: [...f.nearbyPlaces, { name: "", type: "metro", distanceInKm: "" }] }));
  const updateNearbyPlace = (i, key, val) =>
    setForm((f) => { const updated = [...f.nearbyPlaces]; updated[i] = { ...updated[i], [key]: val }; return { ...f, nearbyPlaces: updated }; });
  const removeNearbyPlace = (i) =>
    setForm((f) => ({ ...f, nearbyPlaces: f.nearbyPlaces.filter((_, idx) => idx !== i) }));

  // ── Validation ───────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title)     e.title    = "Property title is required";
    if (!form.city)      e.city     = "City is required";
    if (!form.address)   e.address  = "Area / locality is required";
    if (!form.basePrice) e.basePrice= "Price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build payload ────────────────────────────────────────────────
  const buildPayload = () => ({
    title:           form.title,
    description:     form.description,
    propertyType:    form.propertyType,
    furnishingStatus:form.furnishingStatus,
    gender:          form.gender,
    pricing: {
      basePrice:          Number(form.basePrice),
      priceType:          form.priceType,
      securityDeposit:    Number(form.securityDeposit)    || 0,
      maintenanceCharges: Number(form.maintenanceCharges) || 0,
    },
    roomInfo: {
      totalRooms:     Number(form.totalRooms)  || 1,
      availableRooms: Number(form.totalRooms)  || 1,
      bathrooms:      Number(form.bathrooms)   || 1,
      balcony:        form.balcony,
      floorNumber:    Number(form.floorNumber) || 0,
      totalFloors:    Number(form.totalFloors) || 1,
      areaSqFt:       Number(form.areaSqFt)    || undefined,
    },
    location: {
      address:  form.address,
      city:     form.city,
      state:    form.state,
      country:  "India",
      pincode:  form.pincode,
      landmark: form.landmark,
    },
    amenities: form.amenities,
    rules:     form.rules,
    availability: {
      isAvailable:  form.status === "active",
      availableFrom: form.availableFrom ? new Date(form.availableFrom) : new Date(),
      minimumStay:   Number(form.minimumStay) || 1,
      maximumStay:   form.maximumStay ? Number(form.maximumStay) : undefined,
    },
    status: form.status,
    nearbyPlaces: form.nearbyPlaces
      .filter((p) => p.name.trim())
      .map((p) => ({ name: p.name.trim(), type: p.type, distanceInKm: Number(p.distanceInKm) || 0 })),
  });

  // ── Save current tab ──────────────────────────────────────────────
  const handleSaveTab = async () => {
    if (activeTab === 0 || activeTab === 2) {
      // basic validation only for critical tabs
      if (activeTab === 0 && (!form.title || !form.city || !form.address)) {
        if (!form.title)   setErrors((e) => ({ ...e, title: "Required" }));
        if (!form.city)    setErrors((e) => ({ ...e, city: "Required" }));
        if (!form.address) setErrors((e) => ({ ...e, address: "Required" }));
        return;
      }
    }
    setSavedTabs((prev) => prev.includes(activeTab) ? prev : [...prev, activeTab]);
    if (activeTab < TABS.length - 1) setActiveTab((t) => t + 1);
  };

  // ── Final save ────────────────────────────────────────────────────
  const handleSaveAll = async () => {
    if (!validate()) {
      addToast("Please fix the errors before saving.", "error");
      setActiveTab(0);
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/properties/update-property/${id}`, buildPayload());
      addToast("Listing updated successfully! ✓");
      setTimeout(() => navigate("/smart-dashboard"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update. Please try again.";
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="reg-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="reg-spinner" style={{ margin: "0 auto 1rem", width: 32, height: 32 }} />
          <p style={{ color: "var(--stone)", fontSize: "0.88rem", fontFamily: "DM Sans, sans-serif" }}>Loading listing…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-root">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="reg-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="reg-back-link" onClick={() => navigate("/smart-dashboard")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to dashboard
          </button>
          <div className="reg-logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="reg-brand-name">Nivaas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--stone)", fontFamily: "DM Sans, sans-serif" }}>
            Editing listing
          </span>
          <button
            className="reg-btn-primary"
            onClick={handleSaveAll}
            disabled={saving}
            style={{ padding: "0.45rem 1.1rem", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving ? <><div className="reg-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : "Save changes ✓"}
          </button>
        </div>
      </nav>

      <div className="reg-body">
        {/* Header */}
        <div className="reg-header" style={{ marginBottom: "1.5rem" }}>
          <div className="reg-eyebrow"><span />Edit listing</div>
          <h1 className="reg-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
            {originalTitle || "Your listing"}
          </h1>
          <p className="reg-desc">
            Changes save instantly to your listing. Use the tabs to jump between sections.
          </p>
        </div>

        {/* Tab bar */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} savedTabs={savedTabs} />

        {/* ── TAB 0 — Basic Info ────────────────────────────────── */}
        {activeTab === 0 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Basic information</h2>
            <p className="reg-card-sub">Property type, title, location</p>

            <div style={{ marginBottom: "1.5rem" }}>
              <div className="reg-section-label" style={{ marginBottom: "0.75rem" }}>Property type</div>
              <RadioCardGrid options={PROPERTY_TYPES} value={form.propertyType} onChange={(v) => set("propertyType", v)} cols={3} />
            </div>

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
                placeholder="Describe your space…"
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
                  {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="State">
                <input className="reg-input" placeholder="Rajasthan" value={form.state} onChange={(e) => set("state", e.target.value)} />
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
                <input className="reg-input" placeholder="302001" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} />
              </Field>
            </div>

            <Field label="Landmark (optional)" full>
              <input className="reg-input" placeholder="e.g. Near City Mall" value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
            </Field>
          </div>
        )}

        {/* ── TAB 1 — Details ───────────────────────────────────── */}
        {activeTab === 1 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Property details</h2>
            <p className="reg-card-sub">Rooms, floors, nearby places</p>

            <div className="reg-grid-3">
              {[
                ["totalRooms",  "Total rooms",  ["1","2","3","4","5","6+"]],
                ["bathrooms",   "Bathrooms",    ["1","2","3","4+"]],
                ["totalFloors", "Total floors", ["1","2","3","4","5","6","7+"]],
              ].map(([k, label, opts]) => (
                <Field key={k} label={label}>
                  <select className="reg-input reg-select" value={form[k]} onChange={(e) => set(k, e.target.value)}>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              ))}
            </div>

            <div className="reg-grid-2">
              <Field label="Area (sqft)">
                <input className="reg-input" type="number" placeholder="500" value={form.areaSqFt} onChange={(e) => set("areaSqFt", e.target.value)} />
              </Field>
              <Field label="Floor number">
                <input className="reg-input" type="number" placeholder="0 = Ground" value={form.floorNumber} onChange={(e) => set("floorNumber", e.target.value)} />
              </Field>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <div className="reg-label" style={{ marginBottom: "0.6rem" }}>Balcony</div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[true, false].map((v) => (
                  <button key={String(v)} type="button"
                    className={`reg-bool-btn${form.balcony === v ? " selected" : ""}`}
                    onClick={() => set("balcony", v)}
                  >
                    {v ? "✅ Yes" : "❌ No"}
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby places */}
            <div style={{ marginTop: "1.75rem" }}>
              <div className="reg-section-label" style={{ marginBottom: "0.75rem" }}>
                Nearby places <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "var(--stone)", marginLeft: "0.5rem" }}>(optional)</span>
              </div>
              {form.nearbyPlaces.map((place, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem", marginBottom: "0.6rem", alignItems: "center" }}>
                  <input className="reg-input" placeholder="Name e.g. Ajmer Road Metro" value={place.name} onChange={(e) => updateNearbyPlace(i, "name", e.target.value)} />
                  <select className="reg-input reg-select" value={place.type} onChange={(e) => updateNearbyPlace(i, "type", e.target.value)}>
                    {NEARBY_PLACE_TYPES.map((t) => <option key={t.v} value={t.v}>{t.icon} {t.label}</option>)}
                  </select>
                  <div className="reg-input-prefix-wrap">
                    <span className="reg-input-prefix">km</span>
                    <input className="reg-input reg-input-prefixed" type="number" placeholder="0.5" step="0.1" min="0"
                      value={place.distanceInKm} onChange={(e) => updateNearbyPlace(i, "distanceInKm", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removeNearbyPlace(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--terracotta)", fontSize: "1.1rem", padding: "0 4px" }}>×</button>
                </div>
              ))}
              <button type="button" className="reg-btn-secondary" style={{ fontSize: "0.82rem", padding: "0.4rem 1rem" }} onClick={addNearbyPlace}>
                + Add nearby place
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2 — Furnishing & Rules ────────────────────────── */}
        {activeTab === 2 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Furnishing & house rules</h2>
            <p className="reg-card-sub">Help tenants know what to expect</p>

            <div style={{ marginBottom: "2rem" }}>
              <div className="reg-section-label">Furnishing status</div>
              <RadioCardGrid options={FURNISHING_OPTIONS} value={form.furnishingStatus} onChange={(v) => set("furnishingStatus", v)} cols={3} />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <div className="reg-section-label">Preferred tenants</div>
              <RadioCardGrid options={GENDER_OPTIONS} value={form.gender} onChange={(v) => set("gender", v)} cols={3} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div className="reg-section-label">House rules</div>
              <div className="reg-rules-grid">
                <RuleToggle label="Pets"    icon="🐾" value={form.rules.petsAllowed}    onChange={(v) => setRule("petsAllowed", v)} />
                <RuleToggle label="Smoking" icon="🚬" value={form.rules.smokingAllowed} onChange={(v) => setRule("smokingAllowed", v)} />
                <RuleToggle label="Alcohol" icon="🍷" value={form.rules.alcoholAllowed} onChange={(v) => setRule("alcoholAllowed", v)} />
                <RuleToggle label="Guests"  icon="👤" value={form.rules.guestsAllowed}  onChange={(v) => setRule("guestsAllowed", v)} />
              </div>
            </div>

            <div>
              <div className="reg-section-label">
                Additional rules <span style={{ fontWeight: 400, fontSize: "0.75rem", color: "var(--stone)" }}>(optional)</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  className="reg-input" style={{ flex: 1 }}
                  placeholder="e.g. No loud music after 10 PM"
                  value={addRule}
                  onChange={(e) => setAddRule(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAdditionalRule()}
                />
                <button type="button" className="reg-btn-secondary" style={{ whiteSpace: "nowrap", padding: "0 1rem" }} onClick={addAdditionalRule}>+ Add</button>
              </div>
              {form.rules.additionalRules.length > 0 && (
                <div className="reg-tag-list">
                  {form.rules.additionalRules.map((r, i) => (
                    <div key={i} className="reg-tag">
                      {r}
                      <button type="button" onClick={() => removeAdditionalRule(i)}
                        style={{ marginLeft: 6, background: "none", border: "none", cursor: "pointer", color: "var(--terracotta)", fontWeight: 700, fontSize: "0.85rem" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3 — Pricing ───────────────────────────────────── */}
        {activeTab === 3 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Pricing & amenities</h2>
            <p className="reg-card-sub">Set your rent, deposit and what's included</p>

            <div className="reg-grid-2">
              <Field label="Monthly / nightly price *" error={errors.basePrice}>
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input
                    className={`reg-input reg-input-prefixed${errors.basePrice ? " error" : ""}`}
                    type="number" placeholder="12000"
                    value={form.basePrice}
                    onChange={(e) => set("basePrice", e.target.value)}
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

            <div className="reg-grid-2">
              <Field label="Security deposit">
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input className="reg-input reg-input-prefixed" type="number" placeholder="One or two months rent"
                    value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} />
                </div>
              </Field>
              <Field label="Maintenance charges" hint="Monthly society / maintenance fee">
                <div className="reg-input-prefix-wrap">
                  <span className="reg-input-prefix">₹</span>
                  <input className="reg-input reg-input-prefixed" type="number" placeholder="0"
                    value={form.maintenanceCharges} onChange={(e) => set("maintenanceCharges", e.target.value)} />
                </div>
              </Field>
            </div>

            {/* Live price preview */}
            {form.basePrice && (
              <div className="reg-price-preview">
                <div className="reg-price-preview-label">Pricing preview</div>
                <div style={{ display: "flex", gap: "2rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                  {[
                    [form.basePrice, form.priceType.replace("per_", "")],
                    form.securityDeposit && [form.securityDeposit, "security deposit"],
                    form.maintenanceCharges && [form.maintenanceCharges, "maintenance / mo"],
                  ].filter(Boolean).map(([amt, label]) => (
                    <div key={label}>
                      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "1.8rem", color: "var(--charcoal)" }}>
                        ₹{Number(amt).toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--stone)" }}>/{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <div className="reg-section-label" style={{ marginBottom: "0.75rem" }}>Amenities</div>
              <div className="reg-amenity-grid">
                {AMENITY_OPTIONS.map((a) => (
                  <button key={a.value} type="button"
                    className={`reg-amenity-btn${form.amenities.includes(a.value) ? " selected" : ""}`}
                    onClick={() => toggleAmenity(a.value)}
                  >
                    <span className="reg-amenity-icon">{a.icon}</span>
                    <span className="reg-amenity-label">{a.label}</span>
                    {form.amenities.includes(a.value) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2.5"
                        style={{ position: "absolute", top: 6, right: 6 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4 — Availability & Status ─────────────────────── */}
        {activeTab === 4 && (
          <div className="reg-card">
            <h2 className="reg-card-title">Availability & status</h2>
            <p className="reg-card-sub">Control who sees your listing and when</p>

            <div style={{ marginBottom: "2rem" }}>
              <div className="reg-section-label" style={{ marginBottom: "0.75rem" }}>Listing status</div>
              <RadioCardGrid options={AVAILABILITY_STATUS_OPTIONS} value={form.status} onChange={(v) => set("status", v)} cols={3} />
            </div>

            <div className="reg-grid-3">
              <Field label="Available from">
                <input className="reg-input" type="date" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} />
              </Field>
              <Field label="Minimum stay (months)">
                <select className="reg-input reg-select" value={form.minimumStay} onChange={(e) => set("minimumStay", e.target.value)}>
                  {["1","2","3","6","11","12","24"].map((m) => (
                    <option key={m} value={m}>{m} month{m !== "1" ? "s" : ""}</option>
                  ))}
                </select>
              </Field>
              <Field label="Maximum stay (months)" hint="Leave blank for no limit">
                <input className="reg-input" type="number" placeholder="e.g. 24" value={form.maximumStay} onChange={(e) => set("maximumStay", e.target.value)} />
              </Field>
            </div>

            {/* Summary card */}
            <div className="reg-summary" style={{ marginTop: "1.5rem" }}>
              <div className="reg-summary-title">Current listing summary</div>
              {[
                ["Type",        PROPERTY_TYPES.find((t) => t.v === form.propertyType)?.label || form.propertyType],
                ["Title",       form.title || "—"],
                ["Location",    form.city ? `${form.address}, ${form.city}` : "—"],
                ["Furnishing",  FURNISHING_OPTIONS.find((f) => f.v === form.furnishingStatus)?.label || "—"],
                ["Price",       form.basePrice ? `₹${Number(form.basePrice).toLocaleString("en-IN")} / ${form.priceType.replace("per_", "")}` : "—"],
                ["Amenities",   form.amenities.length > 0 ? `${form.amenities.length} selected` : "None"],
                ["Status",      AVAILABILITY_STATUS_OPTIONS.find((s) => s.v === form.status)?.label || "Active"],
              ].map(([k, v]) => (
                <div key={k} className="reg-summary-row">
                  <span className="reg-summary-key">{k}</span>
                  <span className="reg-summary-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom navigation ──────────────────────────────────── */}
        <div className="reg-nav-row">
          <button className="reg-btn-secondary" onClick={() => activeTab === 0 ? navigate("/smart-dashboard") : setActiveTab((t) => t - 1)}>
            {activeTab === 0 ? "Cancel" : "← Back"}
          </button>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {activeTab < TABS.length - 1 ? (
              <button className="reg-btn-primary" onClick={handleSaveTab}>
                Next →
              </button>
            ) : (
              <button className="reg-btn-primary" onClick={handleSaveAll} disabled={saving}>
                {saving
                  ? <><div className="reg-spinner" /> Saving…</>
                  : "Save all changes ✓"
                }
              </button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

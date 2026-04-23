import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosInstance";
import { Section } from "../Section";

function OwnerSettingsTab({ user }) {
  console.log("Hello from settings user: ", user);
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName || "Prakhar",
    email: user.email || "",
    phone: user.phone || "",
    username: user.username || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fieldLabels = [
    ["Full name", "fullName"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Username", "username"],
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/users/update-profile", form);
      updateUser(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silently fail — in production show a toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Account Settings">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: 600,
        }}
      >
        {fieldLabels.map(([label, key]) => (
          <div key={key}>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--d-text3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
            <input
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                background: "var(--d-bg3)",
                border: "1px solid var(--d-border)",
                borderRadius: 8,
                color: "var(--d-text)",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>
        ))}
        <div
          style={{
            gridColumn: "1/-1",
            paddingTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: 8,
              background: "var(--gold)",
              border: "none",
              color: "#1a1500",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "0.85rem",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span style={{ fontSize: "0.78rem", color: "var(--d-green)" }}>
              ✓ Saved!
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}

export {OwnerSettingsTab}
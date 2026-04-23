import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";

function Sidebar({ user, nav, activeTab, setActiveTab, logout }) {
  const navigate = useNavigate();
  const isTenant = user.role === "tenant";
  const accentCol = isTenant ? "var(--terracotta)" : "var(--gold)";

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--d-bg2)",
        borderRight: "1px solid var(--d-border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "1.25rem 1.25rem 1rem",
          cursor: "pointer",
          borderBottom: "1px solid var(--d-border)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "var(--d-bg4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--d-border2)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentCol}
            strokeWidth="2.2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.3rem",
            fontWeight: 500,
            color: "var(--d-text)",
            letterSpacing: "0.02em",
          }}
        >
          Nivaas
        </span>
      </div>

      {/* User pill */}
      <div
        style={{
          margin: "1rem 0.875rem",
          background: "var(--d-bg3)",
          borderRadius: 12,
          padding: "0.875rem",
          border: "1px solid var(--d-border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => navigate("/user-profile")}
      >
        <Avatar name={user.fullName || user.username} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--d-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.fullName || user.username}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 2,
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: accentCol,
                padding: "1px 7px",
                background: `${accentCol}18`,
                borderRadius: 20,
                border: `1px solid ${accentCol}33`,
              }}
            >
              {user.role}
            </span>
            {!user.isVerified && (
              <span style={{ fontSize: "0.6rem", color: "var(--d-text3)" }}>
                · Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 0.875rem" }}>
        <div
          style={{
            fontSize: "0.62rem",
            fontWeight: 500,
            color: "var(--d-text3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
            paddingLeft: "0.25rem",
          }}
        >
          Menu
        </div>
        {nav.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => item.id === "billing" ? navigate("/billing") : setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0.55rem 0.75rem",
                borderRadius: 9,
                marginBottom: 2,
                background: isActive ? `${accentCol}18` : "transparent",
                border: isActive
                  ? `1px solid ${accentCol}33`
                  : "1px solid transparent",
                color: isActive ? accentCol : "var(--d-text2)",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: isActive ? 500 : 400,
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span
                  style={{
                    background: accentCol,
                    color: "#fff",
                    borderRadius: 20,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    padding: "1px 6px",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{ padding: "0.875rem", borderTop: "1px solid var(--d-border)" }}
      >
        <button
          onClick={() => {
            logout();
            navigate("/auth");
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0.55rem 0.75rem",
            borderRadius: 9,
            background: "transparent",
            border: "1px solid var(--d-border)",
            color: "var(--d-text3)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.15s",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export {Sidebar}
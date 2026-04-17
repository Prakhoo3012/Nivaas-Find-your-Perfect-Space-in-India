import { Link } from "react-router-dom";
import { fmt } from "../../../utils/helpers";
import { EmptyState } from "../EmptyState";
import { Section } from "../Section";
import { SmBtn } from "../SmBtn";

function TenantWishlistTab({ wishlist, onRemove }) {
  return (
    <Section title="Saved Properties" count={wishlist.length}>
      {wishlist.length === 0 ? (
        <EmptyState
          icon="❤️"
          text="Your wishlist is empty."
          cta={
            <Link to="/">
              <button
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 1.25rem",
                  borderRadius: 9,
                  background: "var(--d-bg3)",
                  border: "1px solid var(--d-border)",
                  color: "var(--d-text)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                }}
              >
                Browse listings
              </button>
            </Link>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "1rem",
          }}
        >
          {wishlist.map((p) => (
            <div
              key={p._id}
              style={{
                background: "var(--d-bg3)",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--d-border)",
              }}
            >
              <div
                style={{
                  height: 100,
                  background: "var(--d-bg4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--d-text3)"
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <button
                  onClick={() => onRemove(p._id)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.4)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div style={{ padding: "0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--d-text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 3,
                  }}
                >
                  {p.propertyType}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--d-text)",
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--d-text3)",
                    marginBottom: "0.5rem",
                  }}
                >
                  📍 {p.location.city}
                </div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.05rem",
                    color: "var(--d-text)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {fmt(p.pricing.basePrice)}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--d-text3)",
                      fontFamily: "DM Sans",
                    }}
                  >
                    {" "}
                    /{p.pricing.priceType.replace("per_", "")}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link
                    to={`/properties/get-property/${p._id}`}
                    style={{ flex: 1 }}
                  >
                    <SmBtn style={{ width: "100%" }}>View</SmBtn>
                  </Link>
                  <SmBtn accent>Book</SmBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export {TenantWishlistTab}
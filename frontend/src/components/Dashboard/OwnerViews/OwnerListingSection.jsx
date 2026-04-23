import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Section } from "../Section";
import { FilterTabs } from "../FilterTabs";
import { EmptyState } from "../EmptyState";
import { fmt } from "../../../utils/helpers";
import { SmBtn } from "../SmBtn";

function OwnerListingsSection({ listings }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const types = ["all", "flat", "pg", "room", "hostel", "villa"];
  const filtered =
    filter === "all"
      ? listings
      : listings.filter((l) => l.propertyType === filter);
  return (
    <Section title="My Listings" count={listings.length}>
      <FilterTabs
        filters={types}
        active={filter}
        setActive={setFilter}
        accent="var(--gold)"
      />
      {filtered.length === 0 ? (
        <EmptyState icon="🏘️" text="No listings for this type." />
      ) : (
        filtered.map((l) => (
          <div
            key={l._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              padding: "0.875rem 0",
              borderBottom: "1px solid var(--d-border)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "var(--d-bg3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid var(--d-border)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--d-text3)"
                strokeWidth="1.2"
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
                  marginBottom: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {l.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[
                  `📍 ${l.location.city}`,
                  `${l.propertyType.toUpperCase()}`,
                  `${l.roomInfo.availableRooms} room(s)`,
                ].map((m) => (
                  <span
                    key={m}
                    style={{ fontSize: "0.7rem", color: "var(--d-text3)" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              {l.ratings.count > 0 && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--gold)",
                    marginTop: 2,
                  }}
                >
                  ⭐ {l.ratings.average}{" "}
                  <span style={{ color: "var(--d-text3)" }}>
                    ({l.ratings.count})
                  </span>
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.05rem",
                  color: "var(--d-text)",
                }}
              >
                {fmt(l.pricing.basePrice)}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--d-text3)",
                    fontFamily: "DM Sans",
                  }}
                >
                  {" "}
                  /{l.pricing.priceType.replace("per_", "")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 6,
                  justifyContent: "flex-end",
                }}
              >
                <SmBtn onClick={() => navigate(`/edit-property/${l._id}`)}>
                  Edit
                </SmBtn>
                <SmBtn
                  onClick={() => navigate(`/properties/get-property/${l._id}`)}
                >
                  View
                </SmBtn>
              </div>
            </div>
          </div>
        ))
      )}
    </Section>
  );
}

export {OwnerListingsSection}

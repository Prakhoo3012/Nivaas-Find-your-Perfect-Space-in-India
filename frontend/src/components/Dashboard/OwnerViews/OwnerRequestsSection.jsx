import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { Section } from "../Section";
import { FilterTabs } from "../FilterTabs";
import { Avatar } from "../Avatar";
import { fmt, fmtDate } from "../../../utils/helpers";
import { SmBtn } from "../SmBtn";
import { StatusPill } from "../StatusPill";
import { EmptyState } from "../EmptyState";

function OwnerRequestsSection({ allRequests }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(allRequests);
  const [filter, setFilter] = useState("all");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setRequests(allRequests);
  }, [allRequests]);

  const addToast = (msg, type = "success") => {
    const tid = Date.now();
    setToasts((t) => [...t, { id: tid, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3000);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  console.log("RS2:", pendingCount);
  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending", badge: pendingCount },
    { label: "Confirmed", value: "confirmed" },
    { label: "Payment Done", value: "payment_done" },
    { label: "Rejected", value: "rejected" },
    { label: "Completed", value: "completed" },
  ];

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handle = async (id, action) => {
    try {
      await api.patch(`/booking/update-status/${id}`, { status: action });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: action } : r)),
      );
      addToast(
        action === "confirmed" ? "Booking accepted!" : "Booking rejected.",
        action === "confirmed" ? "success" : "error",
      );
    } catch {
      addToast("Something went wrong.", "error");
    }
  };

  return (
    <>
      <Section
        title="Booking Requests"
        count={requests.length}
        badge={pendingCount}
      >
        <FilterTabs
          filters={filters}
          active={filter}
          setActive={setFilter}
          accent="var(--gold)"
        />
        {filtered.length === 0 ? (
          <EmptyState icon="📥" text="No requests here." />
        ) : (
          filtered.map((r) => (
            <div
              key={r._id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.875rem",
                padding: "0.875rem 0",
                borderBottom: "1px solid var(--d-border)",
              }}
            >
              <Avatar name={r.tenant.fullName} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--d-text)",
                    marginBottom: 2,
                  }}
                >
                  {r.tenant.fullName}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--d-text2)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.property.title}
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {[
                    `📅 ${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`,
                    `👤 ${r.guests.adults} guest${r.guests.adults > 1 ? "s" : ""}`,
                  ].map((m) => (
                    <span
                      key={m}
                      style={{ fontSize: "0.7rem", color: "var(--d-text3)" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "1.05rem",
                    color: "var(--d-text)",
                  }}
                >
                  {fmt(r.priceBreakdown.totalAmount)}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <SmBtn
                    onClick={() => navigate(`/booking/get-booking/${r._id}`)}
                  >
                    View
                  </SmBtn>
                  <StatusPill status={r.status} />
                </div>
                {r.status === "pending" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginTop: 6,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handle(r._id, "confirmed")}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 7,
                        fontSize: "0.72rem",
                        background: "rgba(78,124,95,0.2)",
                        border: "1px solid rgba(78,124,95,0.4)",
                        color: "#6abf85",
                        cursor: "pointer",
                      }}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handle(r._id, "rejected")}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 7,
                        fontSize: "0.72rem",
                        background: "rgba(139,64,64,0.15)",
                        border: "1px solid rgba(139,64,64,0.3)",
                        color: "#e07070",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </Section>

      {/* Toasts */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.65rem 1rem",
              borderRadius: 10,
              fontSize: "0.82rem",
              background:
                t.type === "success"
                  ? "rgba(78,124,95,0.95)"
                  : "rgba(139,64,64,0.95)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              animation: "fadeUp 0.3s ease both",
            }}
          >
            {t.type === "success" ? "✓" : "✕"} {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}

export {OwnerRequestsSection}
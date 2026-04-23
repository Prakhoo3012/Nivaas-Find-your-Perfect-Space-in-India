import { fmt } from "../../../utils/helpers";
import { StatCard } from "../StatCard";
import { OwnerBookingsSection } from "./OwnerBookingSection";
import { OwnerListingsSection } from "./OwnerListingSection";
import { OwnerRequestsSection } from "./OwnerRequestsSection";

function OwnerOverview({ listings, requests, bookings }) {
  console.log(Object.values(requests || {}))
  const confirmed = Object.values(requests || {}).filter((r) => r.status === "confirmed" || r.status === "payment_done").length;
  const revenue = Object.values(requests || {})
    .filter(b => ["payment_done", "completed"].includes(b.status))
    .reduce((s, b) => s + b.priceBreakdown.totalAmount, 0);
  const pending = Object.values(requests || {}).filter((b) => b.status === "pending").length;
  console.log("rev: ",revenue)

  const thisMonth = listings.filter((l) => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard
          label="Total listings"
          value={listings.length}
          sub={
            thisMonth > 0
              ? `+${thisMonth} this month`
              : "No new listings this month"
          }
          icon="🏠"
          accent="var(--gold)"
        />
        <StatCard
          label="Pending requests"
          value={pending}
          sub={`${confirmed} confirmed`}
          icon="📥"
          accent="var(--gold)"
        />
        <StatCard
          label="Revenue"
          value={fmt(revenue)}
          sub="From completed bookings"
          icon="💰"
          accent="var(--gold)"
        />
        <StatCard
          label="Avg. rating"
          value="4.7"
          sub="Across all listings"
          icon="⭐"
          accent="var(--gold)"
        />
      </div>
      <OwnerListingsSection listings={listings} />
      <OwnerRequestsSection allRequests={requests} />
      <OwnerBookingsSection bookings={bookings} />
    </div>
  );
}

export {OwnerOverview}
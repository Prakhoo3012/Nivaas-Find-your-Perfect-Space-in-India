import { useState } from "react";
import { FilterTabs } from "../FilterTabs";
import { TenantBookingRow } from "./TenantBookingRow";
import { EmptyState } from "../EmptyState";
import { Section } from "../Section";

function TenantBookingsTab({ bookings }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "confirmed", "pending", "completed", "cancelled"];
  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  return (
    <Section title="My Bookings" count={bookings.length}>
      <FilterTabs
        filters={filters}
        active={filter}
        setActive={setFilter}
        accent="var(--terracotta)"
      />
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          text={`No ${filter !== "all" ? filter : ""} bookings found.`}
        />
      ) : (
        filtered.map((b) => (
          <TenantBookingRow key={b._id} booking={b} showActions={true} />
        ))
      )}
    </Section>
  );
}

export {TenantBookingsTab}
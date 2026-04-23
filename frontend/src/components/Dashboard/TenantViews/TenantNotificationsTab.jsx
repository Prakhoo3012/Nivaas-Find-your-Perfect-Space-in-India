import { useState } from "react";
import { Section } from "../Section";
import { FilterTabs } from "../FilterTabs";
import { EmptyState } from "../EmptyState";
import { NotifRow } from "./NotifRow";

function TenantNotificationsTab({ notifications, onMarkAll }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "unread", "booking", "payment", "message"];
  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => n.unread)
        : notifications.filter((n) => n.type === filter);
  return (
    <Section
      title="Notifications"
      badge={notifications.filter((n) => n.unread).length}
      action={
        <button
          onClick={onMarkAll}
          style={{
            fontSize: "0.72rem",
            color: "var(--terracotta)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Mark all read
        </button>
      }
    >
      <FilterTabs
        filters={filters}
        active={filter}
        setActive={setFilter}
        accent="var(--terracotta)"
      />
      {filtered.length === 0 ? (
        <EmptyState icon="🔔" text="No notifications here." />
      ) : (
        filtered.map((n) => <NotifRow key={n._id} notif={n} />)
      )}
    </Section>
  );
}

export {TenantNotificationsTab}
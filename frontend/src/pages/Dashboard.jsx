import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TENANT_WISHLIST, TENANT_NOTIFICATIONS } from "../constants/tenant";
import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../api/listings";
import { Avatar } from "../components/Dashboard/Avatar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Section } from "../components/Dashboard/Section";
import { Topbar } from "../components/Dashboard/Topbar";
import { TenantOverview } from "../components/Dashboard/TenantViews/TenantOverview";
import { TenantBookingsTab } from "../components/Dashboard/TenantViews/TenantBookingsTab";
import { TenantWishlistTab } from "../components/Dashboard/TenantViews/TenantWishlistTab";
import { TenantNotificationsTab } from "../components/Dashboard/TenantViews/TenantNotificationsTab";
import { OwnerSettingsTab } from "../components/Dashboard/OwnerViews/OwnerSettings";
import { OwnerOverview } from "../components/Dashboard/OwnerViews/OwnerOverview";
import { OwnerListingsSection } from "../components/Dashboard/OwnerViews/OwnerListingSection";
import { OwnerRequestsSection } from "../components/Dashboard/OwnerViews/OwnerRequestsSection";
import { EmptyState } from "../components/Dashboard/EmptyState";
import { OwnerBookingsSection } from "../components/Dashboard/OwnerViews/OwnerBookingSection";
import { RoleBanner } from "../components/Dashboard/RoleBanner";

// ─── Shared primitives ────────────────────────────────────────────────────────
function Icon({ d, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export default function Dashboard() {
  // ── Auth context — single source of truth for user ───────────────────────
  const { user, isTenant, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [wishlist, setWishlist] = useState(TENANT_WISHLIST);
  const [notifs, setNotifs] = useState(TENANT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDashboardData();
        console.log("DASH Res: ", res.data.data);
        setUserData(res.data.data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ProtectedRoute already handles loading + redirect, so user is always defined here
  const unread = notifs.filter((n) => n.unread).length;

  // ── Nav configs per role ──────────────────────────────────────────────────
   const tenantNav = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "bookings", label: "My Bookings", icon: "📋" },
    { id: "wishlist", label: "Wishlist", icon: "❤️", badge: wishlist.length },
    { id: "notifications", label: "Notifications", icon: "🔔", badge: unread },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const ownerNav = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "listings", label: "Listings", icon: "🏠" },
    { id: "bookings", label: "My Bookings", icon: "📋" },
    {
      id: "requests",
      label: "Booking Requests",
      icon: "📥",
      badge: (userData?.allReq ?? []).filter((r) => r.status === "pending")
        .length,
    },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "billing", label: "Billing", icon: "🧾" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const nav = isTenant ? tenantNav : ownerNav;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--d-bg)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <Sidebar
        user={user}
        nav={nav}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <RoleBanner isTenant={isTenant} isVerified={user?.isVerified} />
        <Topbar
          title={nav.find((n) => n.id === activeTab)?.label || "Dashboard"}
          user={user}
          actions={
            isTenant ? (
              <Link to="/">
                <button
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: 8,
                    background: "rgba(192,90,40,0.1)",
                    border: "1px solid rgba(192,90,40,0.2)",
                    color: "var(--terracotta)",
                    fontFamily: "DM Sans",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  Browse listings
                </button>
              </Link>
            ) : (
              <button
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 8,
                  background: "var(--gold)",
                  border: "none",
                  color: "#1a1500",
                  fontFamily: "DM Sans",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onClick={() => navigate("/register-property")}
              >
                + New listing
              </button>
            )
          }
        />

        <div style={{ flex: 1, padding: "1.75rem", overflowY: "auto" }}>
          {/* ── TENANT VIEWS ─────────────────────────────────── */}
          {isTenant && activeTab === "overview" && (
            <TenantOverview
              bookings={userData?.allBookings ?? []}
              wishlist={wishlist}
              notifications={notifs}
              setTab={setActiveTab}
            />
          )}

          {isTenant && activeTab === "bookings" && (
            <TenantBookingsTab bookings={userData?.allBookings ?? []} />
          )}

          {isTenant && activeTab === "wishlist" && (
            <TenantWishlistTab
              wishlist={wishlist}
              onRemove={(id) =>
                setWishlist((w) => w.filter((p) => p._id !== id))
              }
            />
          )}

          {isTenant && activeTab === "notifications" && (
            <TenantNotificationsTab
              notifications={notifs}
              onMarkAll={() =>
                setNotifs((n) => n.map((x) => ({ ...x, unread: false })))
              }
            />
          )}

          {isTenant && activeTab === "settings" && (
            <OwnerSettingsTab user={user} />
          )}

          {/* ── OWNER VIEWS ──────────────────────────────────── */}
          {!isTenant && activeTab === "overview" && (
            <OwnerOverview
              listings={userData?.allListings ?? []}
              requests={userData?.allReq ?? []}
              bookings={userData?.allBookings ?? []}
            />
          )}

          {!isTenant && activeTab === "listings" && (
            <OwnerListingsSection listings={userData?.allListings ?? []} />
          )}

          {!isTenant && activeTab === "requests" && (
            <OwnerRequestsSection allRequests={userData?.allReq ?? []} />
          )}

          {!isTenant && activeTab === "earnings" && (
            <Section title="Earnings">
              <EmptyState icon="💰" text="Earnings chart coming soon." />
            </Section>
          )}

          {!isTenant &&
            activeTab === "billing" &&
            (() => {
              navigate("/billing");
              return null;
            })()}

          {!isTenant && activeTab === "bookings" && (
            <OwnerBookingsSection bookings={userData?.allBookings ?? []} />
          )}

          {!isTenant && activeTab === "settings" && (
            <OwnerSettingsTab user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

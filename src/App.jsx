import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/tenant.css";

import HomePage             from "./pages/HomePage";
import PropertyDetailPage   from "./pages/PropertyDetailPage";
import AuthPage             from "./pages/AuthPage";
import OwnerDashboard       from "./pages/OwnerDashboard";
import BillingPage          from "./pages/BillingPage";
import PropertyRegisterPage from "./pages/PropertyRegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import TenantDashboard from "./pages/TenantDashboard";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"                   element={<HomePage />} />
        <Route path="/auth"               element={<AuthPage />} />

        {/* Property detail — id from URL, page fetches via axios */}
        <Route path="/properties/get-property/:id"       element={<PropertyDetailPage />} />

        {/* Owner dashboard */}
        <Route path="/dashboard"          element={<OwnerDashboard />} />

        {/* Tenant dashboard */}
        <Route path="/tenant-dashboard"          element={<TenantDashboard />} />

        {/* Billing — standalone page with own sidebar */}
        <Route path="/billing"            element={<BillingPage />} />

        {/* List a property — multi-step form */}
        <Route path="/register-property"  element={<PropertyRegisterPage />} />

        {/* User Profile Page */}
        <Route path="/user-profile"  element={<UserProfilePage />} />

        {/* Unified role-aware dashboard */}
        <Route path="/smart-dashboard"    element={<Dashboard />} />

        {/* Catch-all */}
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

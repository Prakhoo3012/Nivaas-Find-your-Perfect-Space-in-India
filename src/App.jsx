import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/tenant.css";

import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AuthPage from "./pages/AuthPage";
import BillingPage from "./pages/BillingPage";
import PropertyRegisterPage from "./pages/PropertyRegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import Dashboard from "./pages/Dashboard";
import SubmissionStatus from "./pages/SubmissionStatus";
import PropertyEditPage from "./pages/PropertyEditPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import PaymentPage from "./pages/PaymentPage";
import PropertyReviewPage from "./pages/PropertyReviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Property detail */}
        <Route
          path="/properties/get-property/:id"
          element={<PropertyDetailPage />}
        />

        {/* Protected routes */}
        <Route
          path="/smart-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-property"
          element={
            <ProtectedRoute>
              <PropertyRegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <PropertyReviewPage />
            </ProtectedRoute>
          }
        />

        <Route path="/submission-status" element={<SubmissionStatus />} />

        {/* Legacy dashboard redirects → unified dashboard */}
        <Route
          path="/dashboard"
          element={<Navigate to="/smart-dashboard" replace />}
        />

        <Route
          path="/tenant-dashboard"
          element={<Navigate to="/smart-dashboard" replace />}
        />

        <Route
          path="/edit-property/:id"
          element={
            <ProtectedRoute>
              <PropertyEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/get-booking/:id"
          element={
            <ProtectedRoute>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

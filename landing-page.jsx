import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { GlobalStyles } from "./src/styles/GlobalStyles";
import { LandingPage } from "./src/pages/LandingPage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { MarketplacePage } from "./src/pages/MarketplacePage";
import { ProductDetailPage } from "./src/pages/ProductDetailPage";
import { CheckoutPage } from "./src/pages/CheckoutPage";
import { LoginPage } from "./src/pages/LoginPage";
import { AdminDashboardPage } from "./src/pages/AdminDashboardPage";
import { FeaturesPage } from "./src/pages/FeaturesPage";
import { FarmerGuidePage } from "./src/pages/FarmerGuidePage";

function AdminRouteGuard({ onBack }) {
  const savedUser = localStorage.getItem("tanipintar_user");
  let user = null;
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {}
  }
  const isAdmin = user && (user.role === "admin" || user.role === "super_admin");

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboardPage onBackToUserApp={onBack} />;
}

function getStoredAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("tanipintar_user");
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

function DashboardRouteGuard({ user, onLogout }) {
  const currentUser = user || getStoredAuthUser();

  if (!currentUser) {
    return <Navigate to="/login?redirect=/dashboard" replace />;
  }

  return (
    <DashboardPage
      name={currentUser.full_name || currentUser.email || "Pak Joko Slamet"}
      onLogout={onLogout}
    />
  );
}

function LandingPageWrapper({ isLoggedIn, userName }) {
  const navigate = useNavigate();
  return (
    <LandingPage
      isLoggedIn={isLoggedIn}
      userName={userName}
      onLoginClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
      onNavigate={(path) => navigate(path)}
    />
  );
}

export default function TaniPintarApp() {
  // Synchronously initialize user session from localStorage so refresh never redirects to login
  const [user, setUser] = useState(getStoredAuthUser);
  const isLoggedIn = !!user;
  const userName = user?.full_name || user?.email || "Pak Joko Slamet";

  // Keep state synchronized with localStorage across windows/events
  useEffect(() => {
    const onStorageChange = () => {
      setUser(getStoredAuthUser());
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLoginSuccess = (userObj) => {
    if (userObj) {
      setUser(userObj);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tanipintar_user");
    localStorage.removeItem("tanipintar_token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="tp-app min-h-screen">
        <GlobalStyles />
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <LandingPageWrapper
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            }
          />

          {/* Fitur Utama Page */}
          <Route
            path="/fitur"
            element={
              <FeaturesPage
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            }
          />

          {/* Panduan Petani Page */}
          <Route
            path="/panduan"
            element={
              <FarmerGuidePage
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Marketplace Page */}
          <Route
            path="/marketplace"
            element={
              <MarketplacePage
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            }
          />

          {/* Dedicated Product Detail Page */}
          <Route
            path="/marketplace/product/:id"
            element={<ProductDetailPage isLoggedIn={isLoggedIn} />}
          />

          {/* Dedicated Checkout Page */}
          <Route
            path="/checkout/:id"
            element={<CheckoutPage isLoggedIn={isLoggedIn} />}
          />

          {/* Dashboard Page - Protected with persistent session guard */}
          <Route
            path="/dashboard"
            element={
              <DashboardRouteGuard
                user={user}
                onLogout={handleLogout}
              />
            }
          />

          {/* Admin Verification Portal */}
          <Route
            path="/admin"
            element={<AdminRouteGuard onBack={() => window.location.href = "/dashboard"} />}
          />

          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


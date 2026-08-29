import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./src/styles/GlobalStyles";
import { LandingPage } from "./src/pages/LandingPage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { MarketplacePage } from "./src/pages/MarketplacePage";
import { ProductDetailPage } from "./src/pages/ProductDetailPage";
import { CheckoutPage } from "./src/pages/CheckoutPage";
import { LoginPage } from "./src/pages/LoginPage";

export default function TaniPintarApp() {
  const [userName, setUserName] = useState("Pak Joko Slamet");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("tanipintar_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUserName(u.full_name || u.email || "Pak Joko Slamet");
        setIsLoggedIn(true);
      } catch (e) {}
    }
  }, []);

  const handleLoginSuccess = (userObj) => {
    if (userObj) {
      setUserName(userObj.full_name || userObj.email || "Pak Joko Slamet");
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tanipintar_user");
    setIsLoggedIn(false);
    setUserName("Pak Joko Slamet");
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
              <LandingPage
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

          {/* Dashboard Page */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <DashboardPage name={userName} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login?redirect=/dashboard" replace />
              )
            }
          />

          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

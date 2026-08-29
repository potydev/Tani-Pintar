import React, { useState, useEffect } from "react";
import { GlobalStyles } from "./src/styles/GlobalStyles";
import { LandingPage } from "./src/pages/LandingPage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { MarketplacePage } from "./src/pages/MarketplacePage";
import { LoginModal } from "./src/components/landing/LoginModal";

export default function TaniPintarApp() {
  // viewState: "landing" | "dashboard" | "marketplace"
  const [viewState, setViewState] = useState("landing");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState("Koko Petani");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("tanipintar_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUserName(u.full_name || u.email || "Petani Pintar");
        setIsLoggedIn(true);
      } catch (e) {}
    }
  }, []);

  const handleLoginSuccess = (name) => {
    setUserName(name);
    setShowLoginModal(false);
    setIsLoggedIn(true);
    setViewState("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("tanipintar_user");
    setIsLoggedIn(false);
    setUserName("Koko Petani");
    setViewState("landing");
  };

  const handleNavigate = (page) => {
    if (page === "marketplace") {
      setViewState("marketplace");
    } else if (page === "dashboard") {
      if (isLoggedIn) {
        setViewState("dashboard");
      } else {
        setShowLoginModal(true);
      }
    } else {
      setViewState("landing");
    }
  };

  return (
    <div className="tp-app min-h-screen">
      <GlobalStyles />

      {viewState === "landing" && (
        <LandingPage
          onLoginClick={() => setShowLoginModal(true)}
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      )}

      {viewState === "dashboard" && (
        <DashboardPage
          name={userName}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {viewState === "marketplace" && (
        <MarketplacePage
          onNavigate={handleNavigate}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLoginClick={() => setShowLoginModal(true)}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
}

import React, { useState } from "react";
import { GlobalStyles } from "./src/styles/GlobalStyles";
import { LandingPage } from "./src/pages/LandingPage";
import { DashboardPage } from "./src/pages/DashboardPage";
import { LoginModal } from "./src/components/landing/LoginModal";

export default function TaniPintarApp() {
  const [viewState, setViewState] = useState("landing"); // "landing" | "dashboard"
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState("Koko Petani");

  const handleLoginSuccess = (name) => {
    setUserName(name);
    setShowLoginModal(false);
    setViewState("dashboard");
  };

  return (
    <div className="tp-app min-h-screen">
      <GlobalStyles />

      {viewState === "landing" && (
        <LandingPage onLoginClick={() => setShowLoginModal(true)} />
      )}

      {viewState === "dashboard" && (
        <DashboardPage
          name={userName}
          onLogout={() => setViewState("landing")}
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

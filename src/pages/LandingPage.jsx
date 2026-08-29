import React from "react";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingTicker } from "../components/landing/LandingTicker";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingFeatures } from "../components/landing/LandingFeatures";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingTestimonials } from "../components/landing/LandingTestimonials";
import { LandingCta } from "../components/landing/LandingCta";
import { LandingFooter } from "../components/landing/LandingFooter";

export function LandingPage({ onLoginClick, onNavigate, isLoggedIn, userName }) {
  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <LandingTicker />
      <LandingHeader
        onLoginClick={onLoginClick}
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      <main>
        <LandingHero onLoginClick={onLoginClick} onNavigate={onNavigate} />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCta onLoginClick={onLoginClick} />
      </main>
      <LandingFooter />
    </div>
  );
}

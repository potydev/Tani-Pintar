import React from "react";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingTicker } from "../components/landing/LandingTicker";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingFeatures } from "../components/landing/LandingFeatures";
import { LandingFooter } from "../components/landing/LandingFooter";

export function LandingPage({ onLoginClick }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader onLoginClick={onLoginClick} />
      <LandingTicker />
      <main className="flex-1">
        <LandingHero onLoginClick={onLoginClick} />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}

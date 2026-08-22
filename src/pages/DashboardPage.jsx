import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MetricCardsGrid } from "../components/dashboard/MetricCardsGrid";
import { FeaturedRecommendationCard } from "../components/dashboard/FeaturedRecommendationCard";
import { CompactRecommendationCards } from "../components/dashboard/CompactRecommendationCards";
import { PriceTrendPanel } from "../components/dashboard/PriceTrendPanel";
import { DemandRegionPanel } from "../components/dashboard/DemandRegionPanel";
import { SupplyStatusPanel } from "../components/dashboard/SupplyStatusPanel";
import { AIAssistantChatPanel } from "../components/dashboard/AIAssistantChatPanel";
import { RecentOrdersPanel } from "../components/dashboard/RecentOrdersPanel";
import { BottomBannerPanel } from "../components/dashboard/BottomBannerPanel";
import { AuthModal } from "../components/auth/AuthModal";

// Import Sub-Pages
import { SalesOpportunitiesPage } from "./SalesOpportunitiesPage";
import { PriceForecastingPage } from "./PriceForecastingPage";
import { TopBuyersPage } from "./TopBuyersPage";
import { PriceRecommendationPage } from "./PriceRecommendationPage";
import { ProfitCalculatorPage } from "./ProfitCalculatorPage";
import { MarketAnalyticsPage } from "./MarketAnalyticsPage";

export function DashboardPage({ name, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("tanipintar_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem("tanipintar_user");
    setUser(null);
    if (onLogout) onLogout();
  };

  const displayName = user?.full_name || name || "Pak Joko Slamet";

  const renderContent = () => {
    switch (activeTab) {
      case "peluang":
        return <SalesOpportunitiesPage originLocation={user?.farm_location || "Jawa Tengah"} />;
      case "prediksi":
        return <PriceForecastingPage />;
      case "pembeli":
        return <TopBuyersPage />;
      case "rekomendasi":
        return <PriceRecommendationPage />;
      case "hitung":
        return <ProfitCalculatorPage />;
      case "analytics":
        return <MarketAnalyticsPage />;
      case "dashboard":
      default:
        return (
          <>
            {/* Horizontal Metric Cards (5 Cards) */}
            <MetricCardsGrid />

            {/* Main Content Grid: Left Analysis & Right Assistant */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column (8 Cols): Recommendations, Charts & Orders */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Peluang Penjualan Terbaik untuk Anda
                  </h3>
                  <button
                    onClick={() => setActiveTab("peluang")}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    Lihat Semua Peluang &rarr;
                  </button>
                </div>

                {/* Featured AI Recommendation (#1 Bandung) */}
                <FeaturedRecommendationCard />

                {/* Compact AI Recommendations (#2 Purwokerto & #3 Yogyakarta) */}
                <CompactRecommendationCards />

                {/* 3 Panels Analytics Row */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <PriceTrendPanel />
                  <DemandRegionPanel />
                </div>

                {/* Supply Status Card */}
                <SupplyStatusPanel />
              </div>

              {/* Right Column (4 Cols): AI Chat Assistant & Recent Orders */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <AIAssistantChatPanel name={displayName} />
                <RecentOrdersPanel />
              </div>
            </div>

            {/* Full-width Bottom Feature Banner */}
            <BottomBannerPanel />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Fixed Left Navigation Sidebar */}
      <DashboardSidebar
        name={displayName}
        user={user}
        onLogout={handleLogoutUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Scrollable Main Workspace */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto tp-scrollbar">
        {/* Top Greeting & Action Header */}
        <DashboardHeader name={displayName} user={user} onOpenAuth={() => setIsAuthOpen(true)} />

        {/* Dynamic Workspace Render */}
        {renderContent()}
      </main>

      {/* Real User Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}


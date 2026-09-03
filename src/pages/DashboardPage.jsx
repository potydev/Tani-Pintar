import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { UserProfileModal } from "../components/auth/UserProfileModal";
import { SellerOnboardingModal } from "../components/auth/SellerOnboardingModal";
import { OnboardingWizardModal } from "../components/auth/OnboardingWizardModal";
import { SellProductModal } from "../components/dashboard/SellProductModal";

// Import Sub-Pages
import { SalesOpportunitiesPage } from "./SalesOpportunitiesPage";
import { PriceForecastingPage } from "./PriceForecastingPage";
import { TopBuyersPage } from "./TopBuyersPage";
import { PriceRecommendationPage } from "./PriceRecommendationPage";
import { ProfitCalculatorPage } from "./ProfitCalculatorPage";
import { MarketAnalyticsPage } from "./MarketAnalyticsPage";
import { OrdersManagementPage } from "./OrdersManagementPage";
import { MarketplacePage } from "./MarketplacePage";

export function DashboardPage({ name, onLogout }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Surabaya, Jatim");
  const [selectedCommodity, setSelectedCommodity] = useState("Cabai Merah");

  useEffect(() => {
    const savedUser = localStorage.getItem("tanipintar_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        if (u.farm_location) setSelectedLocation(u.farm_location);
        if (u.needsOnboarding) {
          setIsOnboardingOpen(true);
        }
      } catch (e) {}
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.farm_location) setSelectedLocation(userData.farm_location);
    if (userData.needsOnboarding) {
      setIsOnboardingOpen(true);
    }
  };

  const handleOnboardingComplete = (updatedUser, redirectUrl) => {
    setUser(updatedUser);
    if (updatedUser.farm_location) setSelectedLocation(updatedUser.farm_location);
    setIsOnboardingOpen(false);
    if (redirectUrl && redirectUrl !== "/dashboard") {
      navigate(redirectUrl);
    }
  };

  const handleUpgradeSuccess = (updatedUserData) => {
    setUser(updatedUserData);
    if (updatedUserData.farm_location) setSelectedLocation(updatedUserData.farm_location);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem("tanipintar_user");
    setUser(null);
    if (onLogout) onLogout();
  };

  const handleOpenAccount = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleTabChange = (tabId) => {
    if (tabId === "sell_product") {
      setIsSellModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const displayName = user?.full_name || name || "Pak Joko Slamet";

  const renderContent = () => {
    switch (activeTab) {
      case "peluang":
        return <SalesOpportunitiesPage originLocation={selectedLocation} selectedDate={selectedDate} />;
      case "prediksi":
        return <PriceForecastingPage originLocation={selectedLocation} selectedDate={selectedDate} />;
      case "pembeli":
        return <TopBuyersPage />;
      case "rekomendasi":
        return <PriceRecommendationPage originLocation={selectedLocation} selectedDate={selectedDate} />;
      case "hitung":
        return <ProfitCalculatorPage />;
      case "analytics":
        return <MarketAnalyticsPage />;
      case "orders":
        return <OrdersManagementPage user={user} />;
      case "marketplace_view":
        return (
          <MarketplacePage isLoggedIn={true} userName={displayName} isEmbedded={true} />
        );
      case "dashboard":
      default:
        return (
          <>
            {/* Horizontal Metric Cards (4 Executive B2B Cards) */}
            <MetricCardsGrid originLocation={selectedLocation} isVerifiedFarmer={true} onOpenUpgrade={() => setIsUpgradeOpen(true)} />

            {/* Main Content Grid: Left Analysis & Right Assistant */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column (8 Cols): Recommendations, Charts & Orders */}
              <div className="lg:col-span-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base">
                      Peluang Arbitrase Komoditas Unggulan ({selectedLocation})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Perbandingan harga pasar induk nasional terhadap sentra produksi {selectedCommodity}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("peluang")}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    Lihat Semua Rute &rarr;
                  </button>
                </div>

                {/* Commodity Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs tp-scrollbar">
                  {[
                    "Cabai Merah",
                    "Cabai Rawit",
                    "Bawang Merah",
                    "Beras",
                    "Daging Ayam",
                    "Daging Sapi",
                    "Telur Ayam"
                  ].map((comm) => (
                    <button
                      key={comm}
                      type="button"
                      onClick={() => setSelectedCommodity(comm)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer text-xs ${
                        selectedCommodity === comm
                          ? "bg-emerald-800 text-white shadow-xs font-extrabold"
                          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90"
                      }`}
                    >
                      {comm}
                    </button>
                  ))}
                </div>

                {/* Featured AI Recommendation */}
                <FeaturedRecommendationCard
                  originLocation={selectedLocation}
                  selectedDate={selectedDate}
                  commodity={selectedCommodity}
                  isVerifiedFarmer={true}
                  onOpenUpgrade={() => setIsUpgradeOpen(true)}
                />

                {/* Compact AI Recommendations */}
                <CompactRecommendationCards
                  originLocation={selectedLocation}
                  selectedDate={selectedDate}
                  commodity={selectedCommodity}
                  isVerifiedFarmer={true}
                  onOpenUpgrade={() => setIsUpgradeOpen(true)}
                />

                {/* 3 Panels Analytics Row */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <PriceTrendPanel
                    originLocation={selectedLocation}
                    selectedDate={selectedDate}
                    commodity={selectedCommodity}
                    isVerifiedFarmer={true}
                    onOpenUpgrade={() => setIsUpgradeOpen(true)}
                  />
                  <DemandRegionPanel isVerifiedFarmer={true} onOpenUpgrade={() => setIsUpgradeOpen(true)} />
                </div>

                {/* Supply Status Card */}
                <SupplyStatusPanel />
              </div>

              {/* Right Column (4 Cols): AI Chat Assistant & Recent Orders */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <AIAssistantChatPanel name={displayName} user={user} location={selectedLocation} />
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
        onOpenAuth={handleOpenAccount}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenSellProduct={() => setIsSellModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Scrollable Main Workspace */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto tp-scrollbar">
        {/* Top Greeting & Action Header */}
        <DashboardHeader
          name={displayName}
          user={user}
          onOpenAuth={handleOpenAccount}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />

        {/* Dynamic Workspace Render */}
        {renderContent()}
      </main>

      {/* Fiverr-style Onboarding Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        user={user}
        redirectUrl={redirectTarget}
        onComplete={handleOnboardingComplete}
      />

      {/* Modal Mulai Menjual (Pasang Panen) */}
      <SellProductModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        user={user}
        onSuccess={() => {
          setActiveTab("orders");
        }}
      />

      {/* Real User Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Logged in User Profile Detail Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={handleLogoutUser}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      {/* Progressive Onboarding Seller Upgrade Modal */}
      <SellerOnboardingModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        user={user}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
}


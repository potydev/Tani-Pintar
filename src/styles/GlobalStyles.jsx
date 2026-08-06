import React from "react";

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

    .tp-app {
      --tp-primary: #00875A;
      --tp-primary-hover: #00704A;
      --tp-primary-light: #E8F5E9;
      --tp-forest-dark: #092C1E;
      --tp-forest-nav: #0D3623;
      --tp-accent-gold: #E3A72B;
      --tp-accent-orange: #F97316;
      --tp-accent-purple: #7C3AED;
      --tp-accent-blue: #2563EB;
      --tp-accent-red: #EF4444;
      
      --tp-bg-main: #F4F6F8;
      --tp-bg-card: #FFFFFF;
      --tp-border: #E2E8F0;
      --tp-border-light: #F1F5F9;
      
      --tp-text-dark: #0F172A;
      --tp-text-body: #334155;
      --tp-text-muted: #64748B;
      --tp-text-subtle: #94A3B8;

      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--tp-text-body);
      background-color: var(--tp-bg-main);
    }

    .font-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Buttons */
    .tp-btn-primary {
      background-color: var(--tp-primary);
      color: #FFFFFF;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .tp-btn-primary:hover {
      background-color: var(--tp-primary-hover);
      box-shadow: 0 4px 12px rgba(0, 135, 90, 0.25);
    }

    .tp-btn-outline {
      border: 1px solid var(--tp-border);
      background-color: #FFFFFF;
      color: var(--tp-text-body);
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .tp-btn-outline:hover {
      background-color: #F8FAFC;
      border-color: #CBD5E1;
      color: var(--tp-text-dark);
    }

    /* Cards */
    .tp-card {
      background: var(--tp-bg-card);
      border: 1px solid var(--tp-border);
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    /* Ticker animation */
    .tp-ticker-container {
      display: flex;
      overflow: hidden;
      user-select: none;
    }
    .tp-ticker-track {
      display: flex;
      white-space: nowrap;
      animation: tp-scroll 35s linear infinite;
    }
    .tp-ticker-track:hover {
      animation-play-state: paused;
    }
    @keyframes tp-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* Scrollbars */
    .tp-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .tp-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .tp-scrollbar::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 999px;
    }
    .tp-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }

    /* Badges */
    .tp-badge-green {
      background-color: #DCFCE7;
      color: #15803D;
    }
    .tp-badge-yellow {
      background-color: #FEF9C3;
      color: #854D0E;
    }
    .tp-badge-orange {
      background-color: #FFEDD5;
      color: #C2410C;
    }
    .tp-badge-purple {
      background-color: #F3E8FF;
      color: #6B21A8;
    }
  `}</style>
);

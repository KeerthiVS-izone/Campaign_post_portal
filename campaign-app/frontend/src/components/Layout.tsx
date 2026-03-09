import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isPostsPage = location.pathname === '/posts';

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">த</div>
            <div className="header-title">
              <h1>DMK Campaign Portal</h1>
              <p>திமுக தேர்தல் பிரச்சார தளம்</p>
            </div>
          </div>
          <span className="header-badge">2026 தேர்தல்</span>
        </div>
      </header>

      {/* Hero */}
      <div className="hero-banner">
        {isPostsPage ? (
          <>
            <h2>📢 பிரச்சார இடுகைகள்</h2>
            <p>கீழே உள்ள இடுகைகளை X (Twitter)-இல் பகிரவும்</p>
          </>
        ) : (
          <>
            <h2>🗳️ தன்னார்வலர் பதிவு</h2>
            <p>உங்கள் தகவல்களை நிரப்பி பிரச்சாரத்தில் இணையுங்கள்</p>
          </>
        )}
      </div>

      {/* Main */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p>© 2026 DMK Campaign Portal &nbsp;|&nbsp; <span>வெற்றி நிச்சயம் #StalinWave2026</span></p>
      </footer>
    </div>
  );
}

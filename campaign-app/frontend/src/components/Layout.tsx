import React from 'react';
import { useLocation } from 'react-router-dom';

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
              <h1>Campaign Portal</h1>
              <p>தேர்தல் பிரச்சார தளம்</p>
            </div>
          </div>
          <span className="header-badge">2026 தேர்தல்</span>
        </div>
      </header>

      {/* Hero */}
      <div className="hero-banner">
        {isPostsPage ? (
          <>
            <h2>📢 ஸ்டாலின் தொடரட்டும், தமிழ்நாடு வெல்லட்டும்</h2>
            <p>திமுக தகவல் தொழில்நுட்ப அணி - Tweet bank</p>
          </>
        ) : (
          <>
            <h2>ஸ்டாலின் தொடரட்டும், தமிழ்நாடு வெல்லட்டும்.</h2>
            <p>திமுக தகவல் தொழில்நுட்ப அணி - Tweet bank</p>
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

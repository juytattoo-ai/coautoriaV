import React from 'react';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';

export default function AppLayout({ children }) {
  return (
    <div className="coautoria-app-shell">
      {/* Background notebook lines & futuristic subtle dots */}
      <div className="bg-notebook-overlay" aria-hidden="true">
        <div className="bg-corner-lines"></div>
        <div className="bg-corner-dots"></div>
      </div>

      <Navigation />

      <main className="coautoria-main-content">
        {children}

        {/* Mobile footer with theme slide and version text */}
        <footer className="mobile-app-footer">
          <span className="mobile-version-text">Versão 1.0 · Mobile First</span>
          <ThemeToggle />
        </footer>
      </main>
    </div>
  );
}

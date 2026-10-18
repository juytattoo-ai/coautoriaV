import React from 'react';
import Navigation from './Navigation';

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
      </main>
    </div>
  );
}

/**
 * App.jsx — application shell
 * ===========================
 * Holds the persistent sidebar and the routed main area. Applies the
 * sidebar-collapsed / mobile-open classes on the .app-shell exactly like the
 * original, and closes the mobile drawer when the backdrop is clicked.
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { EntityPage } from './pages/EntityPage.jsx';
import { useLayout } from './components/LayoutContext.jsx';

export default function App() {
  const { collapsed, mobileOpen, setMobileOpen } = useLayout();

  const shellClass =
    'app-shell' + (collapsed ? ' sidebar-collapsed' : '') + (mobileOpen ? ' mobile-open' : '');

  return (
    <div
      className={shellClass}
      onClick={(e) => {
        // Click on the dimmed backdrop (the ::after area) closes the drawer.
        if (mobileOpen && e.target === e.currentTarget) setMobileOpen(false);
      }}
    >
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:entityKey" element={<EntityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/**
 * LayoutContext.jsx — shared chrome state (sidebar collapse + mobile drawer)
 * =========================================================================
 * The sidebar lives in App while the mobile-menu button lives in each page's
 * Topbar, so this small context shares the toggle state between them.
 */
import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext(null);
export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <LayoutContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </LayoutContext.Provider>
  );
}

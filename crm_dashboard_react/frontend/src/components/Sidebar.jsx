/**
 * Sidebar.jsx — left navigation (port of buildSidebar in app.js)
 * =============================================================
 * Renders the brand header, grouped nav items from NAV_ORDER, and the user
 * card footer. Uses NavLink so the active item gets the .active class. Tapping
 * a link closes the mobile drawer.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ORDER } from '../config/nav.js';
import { Icon } from '../config/icons.jsx';
import { useLayout } from './LayoutContext.jsx';

export function Sidebar() {
  const { collapsed, setCollapsed, setMobileOpen } = useLayout();

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src="/logo.svg" alt="Cyient" />
          <div className="logo-text">
            <div className="brand">Cyient Foundation</div>
            <div className="brand-sub">CRM Dashboard</div>
          </div>
        </div>
        <button
          className="sidebar-toggle"
          title="Collapse sidebar"
          onClick={() => setCollapsed((c) => !c)}
        >
          <Icon name="chevronLeft" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ORDER.map((item, i) => {
          if (item.type === 'heading') {
            return (
              <div className="nav-heading" key={`h-${i}`}>
                {item.label}
              </div>
            );
          }
          const to = item.key === 'dashboard' ? '/' : `/${item.key}`;
          return (
            <NavLink
              key={item.key}
              to={to}
              end={item.key === 'dashboard'}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">
                <Icon name={item.icon} />
              </span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">RK</div>
          <div className="user-info">
            <div className="user-name">Ramesh Kumar</div>
            <div className="user-role">SuperAdmin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

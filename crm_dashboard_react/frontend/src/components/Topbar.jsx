/**
 * Topbar.jsx — sticky page header (port of the .topbar markup)
 * ===========================================================
 * Shows breadcrumb + page title on the left, and (optionally) a search box and
 * a primary action button on the right. The dashboard hides search/add.
 */
import React from 'react';
import { Icon } from '../config/icons.jsx';
import { useLayout } from './LayoutContext.jsx';

export function Topbar({
  breadcrumb,
  title,
  showSearch = false,
  searchValue = '',
  onSearch,
  primaryLabel,
  onPrimary,
}) {
  const { setMobileOpen } = useLayout();

  return (
    <header className="topbar">
      <button className="mobile-menu" title="Open menu" onClick={() => setMobileOpen((o) => !o)}>
        <Icon name="menu" />
      </button>

      <div className="page-heading">
        <div className="breadcrumb">
          <span>{breadcrumb}</span>
        </div>
        <h1 id="page-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <div className="search-wrap" style={{ visibility: showSearch ? 'visible' : 'hidden' }}>
          <Icon name="search" />
          <input
            type="text"
            placeholder="Search current view…"
            value={searchValue}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
        {primaryLabel && (
          <button className="btn btn-primary" onClick={onPrimary}>
            {primaryLabel}
          </button>
        )}
      </div>
    </header>
  );
}

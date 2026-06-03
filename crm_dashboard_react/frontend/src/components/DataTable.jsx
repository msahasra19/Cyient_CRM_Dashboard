/**
 * DataTable.jsx — data table + empty state (port of buildTable / emptyState)
 * =========================================================================
 * Renders the configured columns plus an actions column with edit/delete
 * buttons. Cells use each column's render() (returning JSX) or a default
 * formatter that shows a muted dash for empty values.
 */
import React from 'react';
import { Icon } from '../config/icons.jsx';

function formatCell(v) {
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>;
  return String(v);
}

export function DataTable({ cfg, rows, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {cfg.columns.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
          <th className="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {cfg.columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : formatCell(row[c.key])}</td>
            ))}
            <td className="col-actions">
              <span className="row-actions">
                <button className="btn btn-icon" title="Edit" onClick={() => onEdit(row.id)}>
                  <Icon name="edit" />
                </button>
                <button
                  className="btn btn-icon btn-icon-danger"
                  title="Delete"
                  onClick={() => onDelete(row.id)}
                >
                  <Icon name="trash" />
                </button>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <div className="icon">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 4v6" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

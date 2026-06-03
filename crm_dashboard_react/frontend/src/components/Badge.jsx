/**
 * Badge.jsx — coloured status pill (port of UI.badge)
 */
import React from 'react';
import { badgeClassFor } from '../utils/format.js';

export function Badge({ children }) {
  const text = children === null || children === undefined || children === '' ? '—' : children;
  return <span className={`badge ${badgeClassFor(children)}`}>{text}</span>;
}

/**
 * main.jsx — React entry point
 * ============================
 * Wraps the app in the router and the Toast / Confirm / Layout providers, then
 * mounts it. HashRouter keeps the original #-style URLs (e.g. #/projects) and
 * works without any server-side routing config.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { ConfirmProvider } from './components/ConfirmDialog.jsx';
import { LayoutProvider } from './components/LayoutContext.jsx';
import './styles/styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LayoutProvider>
        <ToastProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </ToastProvider>
      </LayoutProvider>
    </HashRouter>
  </React.StrictMode>
);

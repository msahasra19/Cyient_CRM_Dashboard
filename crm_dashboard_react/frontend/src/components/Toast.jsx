/**
 * Toast.jsx — toast notifications (port of UI.toast)
 * =================================================
 * Provides a <ToastProvider> and a useToast() hook returning toast(message,
 * type, duration). Renders the same .toast-container / .toast markup as the
 * original so the CSS animations apply unchanged.
 */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++idRef.current;
    setToasts((list) => [...list, { id, message, type, leaving: false }]);
    // start leave animation, then remove
    setTimeout(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 250);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}${t.leaving ? ' leaving' : ''}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

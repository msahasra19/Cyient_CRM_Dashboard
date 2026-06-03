/**
 * ConfirmDialog.jsx — promise-based confirmation modal (port of UI.confirmAction)
 * ==============================================================================
 * useConfirm() returns confirm(message, okLabel) -> Promise<boolean>. Renders
 * the same confirm modal markup as the original.
 */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ConfirmContext = createContext(() => Promise.resolve(false));
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', okLabel: 'Delete' });
  const resolverRef = useRef(null);

  const confirm = useCallback((message, okLabel = 'Delete') => {
    setState({ open: true, message, okLabel });
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = (result) => {
    setState((s) => ({ ...s, open: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close(false)}>
          <div className="modal confirm-modal">
            <header className="modal-header">
              <h3>Confirm action</h3>
            </header>
            <div className="modal-body">{state.message}</div>
            <footer className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => close(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={() => close(true)}>
                {state.okLabel}
              </button>
            </footer>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

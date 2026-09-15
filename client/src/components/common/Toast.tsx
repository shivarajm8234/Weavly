import React from 'react';
import { useUIStore, type Toast as ToastType } from '../../stores/uiStore';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ICONS: Record<ToastType['type'], React.ReactNode> = {
  success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#51cf66" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  error: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff922b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#74c0fc" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => (
  <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-lg animate-slide-in-right">
    <div className="mt-0.5">{ICONS[toast.type]}</div>
    <p className="text-sm text-[var(--color-text)] flex-1">{toast.message}</p>
    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] mt-0.5">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>
  </div>
);

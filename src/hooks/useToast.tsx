'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const success = (message: string, title?: string, duration = 4000) => 
    showToast(message, 'success', title, duration);
  
  const error = (message: string, title?: string, duration = 5000) => 
    showToast(message, 'error', title, duration);
  
  const info = (message: string, title?: string, duration = 4000) => 
    showToast(message, 'info', title, duration);
  
  const warning = (message: string, title?: string, duration = 4000) => 
    showToast(message, 'warning', title, duration);

  const tick: Record<ToastType, string> = {
    success: 'bg-up',
    error: 'bg-danger',
    warning: 'bg-sun',
    info: 'bg-ink-3',
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Toast container */}
      <div className="pointer-events-none fixed right-4 bottom-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              role={toast.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line-strong bg-surface-2 p-4"
            >
              <span className={`mt-0.5 h-4 w-[3px] shrink-0 rounded-full ${tick[toast.type]}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {toast.title && <p className="mb-1 text-sm font-semibold text-ink">{toast.title}</p>}
                <p className="text-sm text-ink-2">{toast.message}</p>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => removeToast(toast.id)}
                className="-mt-1 -mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-3 transition-colors hover:bg-hover hover:text-ink"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
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

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <Card 
                className={`max-w-sm border backdrop-blur-md ${getToastColors(toast.type)}`}
                classNames={{
                  base: "shadow-lg"
                }}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getToastIcon(toast.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {toast.title && (
                        <p className="text-sm font-semibold text-white mb-1">
                          {toast.title}
                        </p>
                      )}
                      <p className="text-sm text-white/90">
                        {toast.message}
                      </p>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => removeToast(toast.id)}
                      className="text-white/70 hover:text-white min-w-unit-6 w-6 h-6"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </CardBody>
              </Card>
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

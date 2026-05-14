"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ToastItem {
  id: number;
  message: string;
}

const ToastContext = createContext<{
  showToast: (message: string) => void;
}>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 left-0 right-0 flex flex-col items-center gap-2 z-[200] pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-[#1a1814] text-white text-[13px] px-4 py-2 rounded-full shadow-lg animate-fade-in"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

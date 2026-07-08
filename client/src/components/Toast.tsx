import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' };

const ToastContext = createContext<(message: string, type?: 'success' | 'error') => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((toast) => toast.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_32px_rgba(0,32,96,0.15)] transition-all ${
              toast.type === 'success'
                ? 'border-[#CFE6FA] bg-white text-[#002060]'
                : 'border-[#FFB3D1] bg-[#FFF0F5] text-[#DF1278]'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={16} className="shrink-0 text-[#1B90FF]" />
              : <XCircle size={16} className="shrink-0 text-[#DF1278]" />
            }
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="ml-1 rounded-full p-0.5 opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

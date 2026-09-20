import React from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      id="copy-toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700/50 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5" />
      </div>
      <span>{message}</span>
    </div>
  );
};

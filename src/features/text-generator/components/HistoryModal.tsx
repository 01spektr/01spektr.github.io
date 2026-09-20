import React from "react";
import { HistoryItem } from "../types.ts";
import { useTranslation } from "../context/LanguageContext.tsx";
import { X, Clock, Copy, Trash2, Check } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onCopyText: (text: string, label: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onCopyText,
  onClearHistory,
}) => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HistoryItem) => {
    onCopyText(item.text, item.styleName);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-heading">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t("modals.history.title")} ({history.length})
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-inter">
                {t("hero.historyTooltip")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-inter">
              <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold font-heading text-slate-600 dark:text-slate-300">
                {t("modals.history.emptyTitle")}
              </p>
              <p className="text-xs mt-1 text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                {t("modals.history.emptyDesc")}
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-heading">
                        {item.styleName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-inter">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate select-all mt-0.5 font-sans">
                      {item.text}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden xs:inline">
                      {isCopied ? t("styles.copiedBtn") : t("styles.copyBtn")}
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center font-heading">
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t("modals.history.clearHistory")}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              {t("modals.history.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();
  const [topic, setTopic] = useState<'improvement' | 'new_solver' | 'bug' | 'other'>('improvement');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = {
    ru: {
      title: 'Обратная связь',
      subtitle: 'Поделитесь идеей или сообщите об ошибке в вычислениях',
      topicLabel: 'Тема обращения',
      t1: 'Идея по улучшению',
      t2: 'Добавить формулу / раздел',
      t3: 'Ошибка в расчёте',
      t4: 'Другое',
      msgLabel: 'Сообщение',
      msgPlaceholder: 'Опишите ваше предложение или неточность в решении...',
      contactLabel: 'Ваш контакт (Telegram или Email, необязательно)',
      cancel: 'Отмена',
      send: 'Отправить',
      thanks: 'Спасибо за отзыв!',
      thanksDesc: 'Мы постоянно улучшаем математический решатель и проверяем все сообщения.',
    },
    uz: {
      title: 'Qayta aloqa',
      subtitle: 'G‘oya taklif qiling yoki hisob-kitobdagi xatolik haqida xabar bering',
      topicLabel: 'Murojaat mavzusi',
      t1: 'Yaxshilash bo‘yicha g‘oya',
      t2: 'Formula / bo‘lim qo‘shish',
      t3: 'Yechimdagi xatolik',
      t4: 'Boshqa',
      msgLabel: 'Xabar',
      msgPlaceholder: 'Taklifingizni yoki xatolikni batafsil yozing...',
      contactLabel: 'Kontakt (Telegram yoki Email, ixtiyoriy)',
      cancel: 'Bekor qilish',
      send: 'Yuborish',
      thanks: 'Fikringiz uchun rahmat!',
      thanksDesc: 'Biz matematik vositani muntazam yaxshilab boramiz.',
    },
    en: {
      title: 'Feedback',
      subtitle: 'Suggest an improvement or report a calculation issue',
      topicLabel: 'Topic',
      t1: 'Feature suggestion',
      t2: 'New formula or tool',
      t3: 'Bug / calculation error',
      t4: 'Other',
      msgLabel: 'Message',
      msgPlaceholder: 'Describe your suggestion or math question...',
      contactLabel: 'Contact info (Telegram or Email, optional)',
      cancel: 'Cancel',
      send: 'Send',
      thanks: 'Thank you for your feedback!',
      thanksDesc: 'We regularly update the symbolic engine and review all suggestions.',
    },
  }[lang] || {
    title: 'Feedback',
    subtitle: 'Suggest an improvement or report a calculation issue',
    topicLabel: 'Topic',
    t1: 'Feature suggestion',
    t2: 'New formula or tool',
    t3: 'Bug / calculation error',
    t4: 'Other',
    msgLabel: 'Message',
    msgPlaceholder: 'Describe your suggestion or math question...',
    contactLabel: 'Contact info (Telegram or Email, optional)',
    cancel: 'Cancel',
    send: 'Send',
    thanks: 'Thank you for your feedback!',
    thanksDesc: 'We regularly update the symbolic engine and review all suggestions.',
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setContact('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {t.title}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-inter">
                {t.subtitle}
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

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
              {t.thanks}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-inter">
              {t.thanksDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.topicLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'improvement', label: t.t1 },
                  { id: 'new_solver', label: t.t2 },
                  { id: 'bug', label: t.t3 },
                  { id: 'other', label: t.t4 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTopic(item.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer truncate ${
                      topic === item.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.msgLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.msgPlaceholder}
                className="w-full p-3 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.contactLabel}
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="@username / email"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.send}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { AlertNotification, Language } from '../types';
import { FlagIcon } from './FlagIcon';
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Settings,
  ShieldCheck,
  Clock,
  Info,
} from 'lucide-react';

interface AlertsCardProps {
  alerts: AlertNotification[];
  locale: Language;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onAddAlertClick: () => void;
  onEditAlertClick: (alert: AlertNotification) => void;
  t?: any;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts,
  locale,
  onToggleAlert,
  onDeleteAlert,
  onAddAlertClick,
  onEditAlertClick,
  t,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            {t?.alerts?.title || 'Уведомления о курсе'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onAddAlertClick}
          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t?.alerts?.addButton || 'Добавить'}</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mb-3 leading-tight">
        {t?.alerts?.description || 'Получайте уведомления, когда курс валюты достигает нужного значения.'}
      </p>

      {/* Notifications List */}
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {t?.alerts?.noAlerts || 'Нет активных уведомлений'}
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <FlagIcon code={alert.baseCurrency} size="sm" />
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">
                    {alert.baseCurrency} / {alert.targetCurrency}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    {t?.alerts?.whenRate || 'Когда курс'} {alert.condition} {alert.threshold.toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alert.enabled}
                    onChange={() => onToggleAlert(alert.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-7 h-4 rounded-full transition-colors relative ${
                      alert.enabled ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white shadow-2xs absolute top-0.5 transition-transform ${
                        alert.enabled ? 'left-3.5' : 'left-0.5'
                      }`}
                    />
                  </div>
                </label>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => onEditAlertClick(alert)}
                  className="text-slate-400 hover:text-blue-600 p-1 transition-colors cursor-pointer"
                  title={locale === 'en' ? 'Edit' : locale === 'uz' ? 'Tahrirlash' : 'Редактировать'}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onDeleteAlert(alert.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  title={locale === 'en' ? 'Delete' : locale === 'uz' ? 'O‘chirish' : 'Удалить'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manage Settings Link */}
      <button
        type="button"
        onClick={onAddAlertClick}
        className="mt-3 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <Settings className="w-3.5 h-3.5 text-blue-600" />
        <span>{t?.alerts?.manageAll || 'Управление всеми уведомлениями'}</span>
      </button>
    </div>
  );
};

export const DataSourceCard: React.FC<{ t?: any; updatedAt?: string }> = ({ t, updatedAt }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            {t?.dataSource?.title || 'Источник данных'}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-semibold">
          {t?.dataSource?.officialBadge || 'Официально ЦБ РУз'}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
        {t?.dataSource?.description || 'Все курсы и котировки обновляются ежедневно в соответствии с официальными данными Центрального банка Республики Узбекистан.'}
      </p>

      <a
        href="https://cbu.uz"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline transition-colors mb-3"
      >
        <span>{t?.dataSource?.goToCbu || 'Перейти на сайт cbu.uz'}</span>
        <span className="text-sm leading-none">→</span>
      </a>

      {/* Timestamps & Disclaimer */}
      <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{updatedAt ? `${String(t?.dataSource?.updatedAt || 'Обновлено').split(':')[0]}: ${updatedAt}` : (t?.dataSource?.updatedAt || 'Данные загружаются')}</span>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-tight">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {t?.dataSource?.disclaimer || 'Курсы носят информационный характер. Для проведения коммерческих операций уточняйте условия в банках.'}
          </span>
        </div>
      </div>
    </div>
  );
};

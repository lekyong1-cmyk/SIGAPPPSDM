import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench,
  Trash2
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Notifikasi & Pengingat Agenda
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
          <button
            onClick={onMarkAllAsRead}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>

          <button
            onClick={onClearNotifications}
            className="text-slate-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const isApproval = n.type === 'approval';
              const isReminder = n.type === 'reminder';
              const isMaintenance = n.type === 'maintenance';

              return (
                <div
                  key={n.id}
                  onClick={() => onSelectNotification(n)}
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !n.read ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isApproval && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {isReminder && (
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {isMaintenance && (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                          <Wrench className="w-4 h-4" />
                        </div>
                      )}
                      {!isApproval && !isReminder && !isMaintenance && (
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      {!n.read && (
                        <span className="inline-block mt-2 w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Belum ada notifikasi baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

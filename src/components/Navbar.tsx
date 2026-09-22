import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Bell, 
  ShieldCheck, 
  User, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { UserRole, AppNotification } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'catalog' | 'schedule' | 'my-bookings' | 'admin' | 'troubleshoot';
  onTabChange: (tab: 'catalog' | 'schedule' | 'my-bookings' | 'admin' | 'troubleshoot') => void;
  onOpenBookingModal: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  pendingApprovalsCount: number;
  activeIssuesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenBookingModal,
  notifications,
  onOpenNotifications,
  pendingApprovalsCount,
  activeIssuesCount,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner / Gov Brand Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 font-medium flex items-center justify-between tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>BADAN KARANTINA INDONESIA (BARANTIN) • PPSDM KARANTINA HEWAN, IKAN DAN TUMBUHAN</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-emerald-200">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-mono">{timeStr}</span>
          </div>
          <span className="text-emerald-400/50">|</span>
          <span>Gedung PPSDM KHIT Jakarta</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => onTabChange('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  SIGAP <span className="text-emerald-600 font-extrabold">PPSDM</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Sistem Agenda & Pemesanan Ruang Rapat Real-Time
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-catalog"
              onClick={() => onTabChange('catalog')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Katalog Ruangan (7)
            </button>
            <button
              id="nav-schedule"
              onClick={() => onTabChange('schedule')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'schedule'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Matriks Jadwal</span>
            </button>
            <button
              id="nav-my-bookings"
              onClick={() => onTabChange('my-bookings')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'my-bookings'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Agenda Saya</span>
            </button>
            <button
              id="nav-troubleshoot"
              onClick={() => onTabChange('troubleshoot')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'troubleshoot'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Lapor Kendala</span>
              {activeIssuesCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeIssuesCount}
                </span>
              )}
            </button>
            {currentRole === 'admin' && (
              <button
                id="nav-admin"
                onClick={() => onTabChange('admin')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kelola Fasilitas</span>
                {pendingApprovalsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Booking Button */}
            <button
              id="btn-quick-booking"
              onClick={onOpenBookingModal}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Reservasi Ruangan</span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifikasi & Pengingat"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="role-employee"
                onClick={() => onRoleChange('employee')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'employee'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pegawai</span>
              </button>
              <button
                id="role-admin"
                onClick={() => onRoleChange('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'admin'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pengelola</span>
                {pendingApprovalsCount > 0 && currentRole !== 'admin' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                )}
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => {
              onTabChange('catalog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Katalog 7 Ruang Rapat
          </button>
          <button
            onClick={() => {
              onTabChange('schedule');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Matriks Jadwal Ketersediaan
          </button>
          <button
            onClick={() => {
              onTabChange('my-bookings');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
          >
            Agenda Rapat Saya
          </button>
          <button
            onClick={() => {
              onTabChange('troubleshoot');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Pelaporan Kendala Fasilitas</span>
            {activeIssuesCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeIssuesCount}
              </span>
            )}
          </button>
          {currentRole === 'admin' && (
            <button
              onClick={() => {
                onTabChange('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-between"
            >
              <span>Panel Pengelola Fasilitas</span>
              {pendingApprovalsCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingApprovalsCount} butuh verifikasi
                </span>
              )}
            </button>
          )}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenBookingModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Reservasi Baru</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

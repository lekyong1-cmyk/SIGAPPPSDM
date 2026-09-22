import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Search,
  Layers,
  ArrowRight,
  Info,
  Wrench,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { 
  MeetingRoom, 
  Reservation, 
  TroubleReport, 
  AppNotification, 
  UserRole,
  RoomStatus,
  IssueStatus 
} from './types';
import { 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_TROUBLE_REPORTS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { RoomCard } from './components/RoomCard';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { RoomCatalogFilter } from './components/RoomCatalogFilter';
import { BookingModal } from './components/BookingModal';
import { RoomDetailModal } from './components/RoomDetailModal';
import { TroubleshootingModal } from './components/TroubleshootingModal';
import { MyReservationsView } from './components/MyReservationsView';
import { AdminPanel } from './components/AdminPanel';
import { NotificationDrawer } from './components/NotificationDrawer';
import { formatIndonesianDate } from './utils/calendarUtils';

export default function App() {
  // Persistence via LocalStorage
  const [rooms, setRooms] = useState<MeetingRoom[]>(() => {
    const saved = localStorage.getItem('sigap_ppsdm_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('sigap_ppsdm_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [troubleReports, setTroubleReports] = useState<TroubleReport[]>(() => {
    const saved = localStorage.getItem('sigap_ppsdm_trouble_reports');
    return saved ? JSON.parse(saved) : INITIAL_TROUBLE_REPORTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sigap_ppsdm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('employee');
  const [activeTab, setActiveTab] = useState<'catalog' | 'schedule' | 'my-bookings' | 'admin' | 'troubleshoot'>('catalog');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | undefined>(undefined);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);
  const [bookingStartHour, setBookingStartHour] = useState<string | undefined>(undefined);

  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<MeetingRoom | null>(null);

  const [isTroubleshootOpen, setIsTroubleshootOpen] = useState(false);
  const [troubleshootRoomId, setTroubleshootRoomId] = useState<string | undefined>(undefined);

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Search & Filter State for Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<'all' | 1 | 2>('all');
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState('Semua Fasilitas');

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('sigap_ppsdm_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('sigap_ppsdm_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('sigap_ppsdm_trouble_reports', JSON.stringify(troubleReports));
  }, [troubleReports]);

  useEffect(() => {
    localStorage.setItem('sigap_ppsdm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers
  const handleOpenBooking = (room?: MeetingRoom, date?: string, startHour?: string) => {
    setBookingRoomId(room?.id || rooms[0]?.id);
    setBookingDate(date || new Date().toISOString().split('T')[0]);
    setBookingStartHour(startHour || '09:00');
    setIsBookingModalOpen(true);
  };

  const handleSaveReservation = (
    newResData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'adminNotes'>
  ) => {
    const newReservation: Reservation = {
      ...newResData,
      id: `res-${Date.now()}`,
      status: 'pending', // Pending verification by Admin Pengelola Fasilitas
      createdAt: new Date().toLocaleString('id-ID'),
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Push notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Permohonan Reservasi Terkirim',
      message: `Pemesanan Ruang Rapat ${newResData.roomNumber} untuk "${newResData.title}" berhasil diajukan dan sedang menunggu verifikasi Pengelola.`,
      type: 'booking',
      timestamp: 'Baru saja',
      read: false,
      reservationId: newReservation.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Auto switch to My Bookings tab so user sees their new reservation
    setActiveTab('my-bookings');
  };

  const handleCancelReservation = (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
    }
  };

  const handleApproveReservation = (id: string, notes?: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'approved', adminNotes: notes || 'Disetujui Pengelola Fasilitas' } : r
      )
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Reservasi Disetujui!',
      message: `Permohonan Ruang Rapat ${target.roomNumber} ("${target.title}") telah disetujui. Petugas siap mempersiapkan ruangan.`,
      type: 'approval',
      timestamp: 'Baru saja',
      read: false,
      reservationId: target.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleRejectReservation = (id: string, notes?: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'rejected', adminNotes: notes || 'Permohonan ditolak oleh Pengelola' } : r
      )
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Reservasi Ditolak',
      message: `Permohonan Ruang Rapat ${target.roomNumber} ("${target.title}") ditolak dengan alasan: ${notes || '-'}`,
      type: 'approval',
      timestamp: 'Baru saja',
      read: false,
      reservationId: target.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
  };

  const handleSaveTroubleReport = (
    reportData: Omit<TroubleReport, 'id' | 'createdAt' | 'status' | 'technicianNotes'>
  ) => {
    const newReport: TroubleReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'reported',
      createdAt: new Date().toLocaleString('id-ID'),
    };

    setTroubleReports((prev) => [newReport, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Laporan Kerusakan Diterima',
      message: `Kendala fasilitas "${reportData.facilityItem}" di Ruang ${reportData.roomNumber} telah dicatat untuk ditindaklanjuti teknisi.`,
      type: 'maintenance',
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    alert('Laporan kerusakan berhasil dikirim ke Pengelola Sarana & Prasarana PPSDM KHIT.');
  };

  const handleUpdateTroubleStatus = (
    reportId: string,
    status: IssueStatus,
    technicianNotes?: string
  ) => {
    setTroubleReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              status,
              technicianNotes: technicianNotes || rep.technicianNotes,
              resolvedAt: status === 'resolved' ? new Date().toLocaleString('id-ID') : rep.resolvedAt,
            }
          : rep
      )
    );
  };

  // Filter Catalog Rooms
  const filteredRooms = rooms.filter((r) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = r.roomNumber.toLowerCase().includes(q);
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      if (!matchNumber && !matchName && !matchDesc) return false;
    }

    // Floor
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) {
      return false;
    }

    // Min capacity
    if (minCapacity > 0 && r.capacity < minCapacity) {
      return false;
    }

    // Facility
    if (selectedFacility !== 'Semua Fasilitas') {
      const hasFac = r.facilities.some((f) =>
        f.toLowerCase().includes(selectedFacility.toLowerCase())
      );
      if (!hasFac) return false;
    }

    return true;
  });

  const pendingApprovalsCount = reservations.filter((r) => r.status === 'pending').length;
  const activeIssuesCount = troubleReports.filter((r) => r.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Primary Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenBookingModal={() => handleOpenBooking()}
        notifications={notifications}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        activeIssuesCount={activeIssuesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Context Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-900">
              Sistem Reservasi 7 Ruang Rapat
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              Pusat Pengembangan Sumber Daya Manusia Karantina Hewan Ikan dan Tumbuhan (PPSDM KHIT)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Peran Anda:</span>
            <span className={`font-bold px-2 py-0.5 rounded-md ${
              currentRole === 'admin' 
                ? 'bg-emerald-800 text-white' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {currentRole === 'admin' ? 'Admin / Pengelola Fasilitas' : 'Pegawai / Pemohon'}
            </span>
            <button
              onClick={() => setCurrentRole(currentRole === 'admin' ? 'employee' : 'admin')}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline ml-1"
            >
              (Ganti Peran)
            </button>
          </div>
        </div>

        {/* VIEW 1: CATALOG OF 7 ROOMS */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <RoomCatalogFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFloor={selectedFloor}
              onFloorChange={setSelectedFloor}
              minCapacity={minCapacity}
              onMinCapacityChange={setMinCapacity}
              selectedFacility={selectedFacility}
              onFacilityChange={setSelectedFacility}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedFloor('all');
                setMinCapacity(0);
                setSelectedFacility('Semua Fasilitas');
              }}
            />

            {/* Quick Action Matrix Card Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Calendar className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Ingin melihat ketersediaan jam per jam tanpa bentrok?
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Buka Matriks Jadwal Real-Time untuk memantau slot waktu kosong hari ini & besok.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-900 rounded-lg text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors"
              >
                <span>Buka Matriks Jadwal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Room Cards Grid (The 7 Meeting Rooms) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Ruang Rapat PPSDM KHIT ({filteredRooms.length} Ruangan)
                </h2>
                <span className="text-xs text-slate-500">
                  Total 7 Ruangan Rapat di Gedung PPSDM KHIT
                </span>
              </div>

              {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      activeReservations={reservations}
                      onSelectForBooking={(r) => handleOpenBooking(r)}
                      onViewDetails={(r) => setSelectedRoomForDetail(r)}
                      onReportIssue={(r) => {
                        setTroubleshootRoomId(r.id);
                        setIsTroubleshootOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
                  <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="font-semibold text-slate-700">Tidak ada ruangan yang cocok dengan filter</p>
                  <p className="mt-1">Coba sesuaikan kata kunci pencarian, lantai, atau fasilitas yang dipilih.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: SCHEDULE TIMELINE MATRIX */}
        {activeTab === 'schedule' && (
          <ScheduleTimeline
            rooms={rooms}
            reservations={reservations}
            onSlotClick={(room, date, startHour) =>
              handleOpenBooking(room, date, startHour)
            }
            onViewReservation={(res) => {
              const r = rooms.find((rm) => rm.id === res.roomId);
              if (r) setSelectedRoomForDetail(r);
            }}
          />
        )}

        {/* VIEW 3: MY RESERVATIONS VIEW */}
        {activeTab === 'my-bookings' && (
          <MyReservationsView
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onOpenBookingModal={() => handleOpenBooking()}
          />
        )}

        {/* VIEW 4: ADMIN / PENGELOLA FASILITAS PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            rooms={rooms}
            reservations={reservations}
            troubleReports={troubleReports}
            onApproveReservation={handleApproveReservation}
            onRejectReservation={handleRejectReservation}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            onUpdateTroubleStatus={handleUpdateTroubleStatus}
          />
        )}

        {/* VIEW 5: TROUBLESHOOTING & INVENTORY REPORT */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
                    <Wrench className="w-5 h-5" />
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Pelaporan & Monitoring Kendala Fasilitas
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Laporkan proyektor rusak, AC tidak dingin, smart board macet, atau inventaris yang memerlukan perhatian teknisi sarana dan prasarana PPSDM KHIT.
                </p>
              </div>

              <button
                onClick={() => {
                  setTroubleshootRoomId(rooms[0]?.id);
                  setIsTroubleshootOpen(true);
                }}
                className="self-start md:self-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Laporan Kerusakan</span>
              </button>
            </div>

            {/* List of Recent Reports */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Status Penanganan Kendala Terkini ({troubleReports.length})
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {troubleReports.map((report) => {
                  const isResolved = report.status === 'resolved';
                  const isInProgress = report.status === 'in_progress';

                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-slate-900 text-white font-bold text-xs px-2.5 py-0.5 rounded-md">
                            Ruang Rapat {report.roomNumber}
                          </span>
                          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-md">
                            {report.facilityItem}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            report.priority === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : report.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Prioritas {report.priority}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          {report.description}
                        </p>

                        <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                          <span>Pelapor: {report.reporterName}</span>
                          <span>•</span>
                          <span>Waktu: {report.createdAt}</span>
                        </div>

                        {report.technicianNotes && (
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
                            <strong>Catatan Teknisi:</strong> {report.technicianNotes}
                            {report.resolvedAt && (
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                Selesai: {report.resolvedAt}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 self-start sm:self-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {isResolved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Selesai Diperbaiki</span>
                            </>
                          ) : isInProgress ? (
                            <>
                              <Wrench className="w-3.5 h-3.5 text-amber-600" />
                              <span>Sedang Ditangani</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Menunggu Pengecekan</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 text-slate-500 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SIGAP PPSDM</span>
            <span>•</span>
            <span>Pusat Pengembangan Sumber Daya Manusia Karantina Hewan Ikan dan Tumbuhan (PPSDM KHIT)</span>
          </div>
          <div>
            <span>Badan Karantina Indonesia (Barantin) © 2026</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={rooms}
        initialRoomId={bookingRoomId}
        initialDate={bookingDate}
        initialStartTime={bookingStartHour}
        existingReservations={reservations}
        onSaveReservation={handleSaveReservation}
      />

      {/* 2. Room Detail & Specs Modal */}
      <RoomDetailModal
        room={selectedRoomForDetail}
        isOpen={Boolean(selectedRoomForDetail)}
        onClose={() => setSelectedRoomForDetail(null)}
        onBookRoom={(r) => handleOpenBooking(r)}
        onReportIssue={(r) => {
          setTroubleshootRoomId(r.id);
          setIsTroubleshootOpen(true);
        }}
        roomReservations={
          selectedRoomForDetail
            ? reservations.filter((res) => res.roomId === selectedRoomForDetail.id && (res.status === 'approved' || res.status === 'pending'))
            : []
        }
      />

      {/* 3. Troubleshooting Modal */}
      <TroubleshootingModal
        isOpen={isTroubleshootOpen}
        onClose={() => setIsTroubleshootOpen(false)}
        rooms={rooms}
        preselectedRoomId={troubleshootRoomId}
        onSaveReport={handleSaveTroubleReport}
      />

      {/* 4. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearNotifications={() => setNotifications([])}
        onSelectNotification={(n) => {
          setNotifications((prev) =>
            prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
          );
          if (n.reservationId) {
            setActiveTab('my-bookings');
            setIsNotifDrawerOpen(false);
          }
        }}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  Share2, 
  Download, 
  MessageSquare, 
  Check, 
  X, 
  AlertCircle, 
  Trash2,
  ExternalLink,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { Reservation } from '../types';
import { 
  formatIndonesianDate, 
  generateGoogleCalendarUrl, 
  generateOutlookCalendarUrl, 
  downloadICalFile,
  generateWhatsAppReminderMessage,
  openWhatsAppLink
} from '../utils/calendarUtils';

interface MyReservationsViewProps {
  reservations: Reservation[];
  onCancelReservation: (id: string) => void;
  onOpenBookingModal: () => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  reservations,
  onCancelReservation,
  onOpenBookingModal,
}) => {
  const [filterTab, setFilterTab] = useState<'upcoming' | 'pending' | 'history'>('upcoming');
  const [waModalReservation, setWaModalReservation] = useState<Reservation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customPhone, setCustomPhone] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredList = reservations.filter((r) => {
    if (filterTab === 'pending') return r.status === 'pending';
    if (filterTab === 'upcoming') {
      return (r.status === 'approved' && r.date >= todayStr);
    }
    if (filterTab === 'history') {
      return r.date < todayStr || r.status === 'cancelled' || r.status === 'rejected';
    }
    return true;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agenda & Reservasi Ruangan Saya
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {reservations.length} Terdata
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola jadwal rapat kedinasan, sinkronisasi kalender digital, dan sebar pengingat WhatsApp ke peserta
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="self-start md:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          + Buat Reservasi Baru
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterTab('upcoming')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterTab === 'upcoming'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Rapat Mendatang / Aktif (
          {reservations.filter((r) => r.status === 'approved' && r.date >= todayStr).length}
          )
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterTab === 'pending'
              ? 'bg-amber-500 text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Menunggu Verifikasi</span>
          {reservations.filter((r) => r.status === 'pending').length > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {reservations.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilterTab('history')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filterTab === 'history'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Riwayat & Selesai
        </button>
      </div>

      {/* Cards List */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((res) => {
            const isApproved = res.status === 'approved';
            const isPending = res.status === 'pending';
            const isRejected = res.status === 'rejected';

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left: Meeting Info */}
                <div className="space-y-2.5 max-w-2xl">
                  {/* Status & Room badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-950 text-white font-bold text-xs px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      Ruang Rapat {res.roomNumber}
                    </span>

                    {isApproved && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Disetujui Pengelola
                      </span>
                    )}
                    {isPending && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Menunggu Verifikasi Admin
                      </span>
                    )}
                    {isRejected && (
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                        Permohonan Ditolak
                      </span>
                    )}

                    <span className="text-xs text-slate-500 font-medium">
                      Layout: {res.layout} • Konsumsi: {res.consumption}
                    </span>
                  </div>

                  {/* Title & Agenda */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {res.title}
                    </h3>
                    {res.agenda && (
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {res.agenda}
                      </p>
                    )}
                  </div>

                  {/* Date, Time, Organizer */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>{formatIndonesianDate(res.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{res.startTime} - {res.endTime} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{res.attendeeCount} Peserta</span>
                    </div>
                  </div>

                  {/* Unit Kerja & Penanggung Jawab */}
                  <div className="text-xs text-slate-500 flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    <span><strong>Unit:</strong> {res.department}</span>
                    <span>•</span>
                    <span><strong>PJ:</strong> {res.organizerName} ({res.organizerPhone})</span>
                  </div>

                  {/* Admin notes if any */}
                  {res.adminNotes && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700">
                      <strong>Catatan Pengelola:</strong> {res.adminNotes}
                    </div>
                  )}
                </div>

                {/* Right: Digital Calendar & Notification Integrations */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Google Calendar Link */}
                  <a
                    href={generateGoogleCalendarUrl(res)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    title="Tambahkan langsung ke Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* Outlook Calendar Link */}
                  <a
                    href={generateOutlookCalendarUrl(res)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    title="Tambahkan ke Microsoft Outlook"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Outlook Calendar</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* Download .ICS File */}
                  <button
                    onClick={() => downloadICalFile(res)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    title="Unduh file .ICS untuk Apple Calendar / Outlook Desktop"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Unduh File .ICS</span>
                  </button>

                  {/* WhatsApp Reminder Blast */}
                  <button
                    onClick={() => {
                      setWaModalReservation(res);
                      setCustomPhone(res.organizerPhone);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    title="Buat & Kirim Pesan Pengingat Rapat WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Pengingat WhatsApp</span>
                  </button>

                  {/* Cancel Button */}
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => onCancelReservation(res.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1 text-slate-500 hover:text-rose-600 text-xs transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Batalkan</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">
            Tidak ada reservasi pada kategori ini
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan katalog atau matriks jadwal untuk menemukan dan memesan ruang rapat sesuai kebutuhan tim Anda.
          </p>
          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
          >
            Pesan Ruang Rapat Sekarang
          </button>
        </div>
      )}

      {/* WhatsApp Modal Notification Generator */}
      {waModalReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">
                  Pengingat Otomatis WhatsApp Peserta
                </h3>
              </div>
              <button
                onClick={() => setWaModalReservation(null)}
                className="p-1 text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Tujuan WhatsApp (Peserta / Koordinator)
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxx atau kosongkan untuk broadcast umum"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Pesan bisa dikirim ke nomor tertentu atau disalin untuk dibagikan ke WhatsApp Group rapat.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pratinjau Pesan Siap Kirim:
                </label>
                <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                  {generateWhatsAppReminderMessage(waModalReservation)}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      generateWhatsAppReminderMessage(waModalReservation),
                      waModalReservation.id
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {copiedId === waModalReservation.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Pesan WA</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openWhatsAppLink(
                      customPhone,
                      generateWhatsAppReminderMessage(waModalReservation)
                    );
                    setWaModalReservation(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim via WhatsApp Web</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

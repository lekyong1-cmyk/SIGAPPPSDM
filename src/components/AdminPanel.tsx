import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Printer, 
  FileText, 
  Building2, 
  Users, 
  Layers, 
  Calendar,
  Check,
  Search,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  MeetingRoom, 
  Reservation, 
  TroubleReport, 
  RoomStatus,
  IssueStatus 
} from '../types';
import { formatIndonesianDate } from '../utils/calendarUtils';

interface AdminPanelProps {
  rooms: MeetingRoom[];
  reservations: Reservation[];
  troubleReports: TroubleReport[];
  onApproveReservation: (id: string, notes?: string) => void;
  onRejectReservation: (id: string, notes?: string) => void;
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  onUpdateTroubleStatus: (reportId: string, status: IssueStatus, technicianNotes?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  rooms,
  reservations,
  troubleReports,
  onApproveReservation,
  onRejectReservation,
  onUpdateRoomStatus,
  onUpdateTroubleStatus,
}) => {
  const [adminTab, setAdminTab] = useState<'approvals' | 'rooms' | 'maintenance' | 'reports'>('approvals');
  const [selectedNoteResId, setSelectedNoteResId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [technicianNote, setTechnicianNote] = useState<string>('');

  const pendingList = reservations.filter((r) => r.status === 'pending');
  const approvedList = reservations.filter((r) => r.status === 'approved');
  const activeIssues = troubleReports.filter((r) => r.status !== 'resolved');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.date === todayStr && r.status === 'approved');

  const handlePrintTodayAgenda = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Panel Admin Pengelola Fasilitas
              </span>
              <span className="text-xs text-slate-300">PPSDM KHIT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-2 text-white">
              Pusat Manajemen Ruangan & Verifikasi Agenda
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Verifikasi permohonan peminjaman ruang rapat, atur ketersediaan dan status pemeliharaan, serta pantau perbaikan inventaris fasilitas kedinasan.
            </p>
          </div>

          {/* Metrics Quick Counters */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
              <div className="text-2xl font-black text-amber-400">
                {pendingList.length}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Perlu Verifikasi
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
              <div className="text-2xl font-black text-rose-400">
                {activeIssues.length}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Kendala Aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('approvals')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'approvals'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Verifikasi Reservasi</span>
          {pendingList.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('rooms')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'rooms'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Status 7 Ruangan</span>
        </button>

        <button
          onClick={() => setAdminTab('maintenance')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'maintenance'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Tiket Kerusakan Fasilitas</span>
          {activeIssues.length > 0 && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {activeIssues.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'reports'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Rekapitulasi & Cetak Agenda</span>
        </button>
      </div>

      {/* TAB 1: VERIFIKASI PERMOHONAN */}
      {adminTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Daftar Permohonan Menunggu Persetujuan ({pendingList.length})
            </h2>
            <span className="text-xs text-slate-500">
              Pengelola berhak menyetujui atau menolak dengan catatan tertulis
            </span>
          </div>

          {pendingList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingList.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-amber-300/80 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-md">
                        Menunggu Verifikasi
                      </span>
                      <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                        Ruang Rapat {res.roomNumber}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        Diajukan: {res.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {res.title}
                    </h3>

                    {res.agenda && (
                      <p className="text-xs text-slate-600">
                        {res.agenda}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{formatIndonesianDate(res.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>{res.startTime} - {res.endTime} WIB</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{res.attendeeCount} Peserta</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex flex-wrap gap-2">
                      <span><strong>Pemohon:</strong> {res.organizerName} ({res.organizerNIP || 'NIP -'})</span>
                      <span>•</span>
                      <span><strong>Unit:</strong> {res.department}</span>
                      <span>•</span>
                      <span><strong>WA:</strong> {res.organizerPhone}</span>
                    </div>

                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg flex flex-wrap gap-3">
                      <span><strong>Layout:</strong> {res.layout}</span>
                      <span>•</span>
                      <span><strong>Konsumsi:</strong> {res.consumption}</span>
                      {res.specialNotes && <span>• <strong>Catatan:</strong> {res.specialNotes}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 sm:min-w-[200px]">
                    {selectedNoteResId === res.id ? (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Catatan / Instruksi Pengelola (Opsional):
                        </label>
                        <input
                          type="text"
                          placeholder="Misal: Disetujui, sound system disiapkan..."
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                        />
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onApproveReservation(res.id, approvalNote);
                              setSelectedNoteResId(null);
                              setApprovalNote('');
                            }}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg"
                          >
                            Setujui Sekarang
                          </button>
                          <button
                            onClick={() => setSelectedNoteResId(null)}
                            className="px-2 py-1.5 text-slate-600 hover:bg-slate-200 text-xs rounded-lg"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedNoteResId(res.id);
                            setApprovalNote('');
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Setujui Permohonan</span>
                        </button>

                        <button
                          onClick={() => {
                            const reason = prompt('Masukkan alasan penolakan permohonan ruangan:');
                            if (reason !== null) {
                              onRejectReservation(res.id, reason);
                            }
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Tolak Permohonan</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Semua permohonan telah diverifikasi!</p>
              <p>Tidak ada permohonan reservasi yang menunggu saat ini.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAJEMEN STATUS 7 RUANGAN */}
      {adminTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Status Operasional 7 Ruang Rapat PPSDM KHIT
            </h2>
            <span className="text-xs text-slate-500">
              Ubah status ruangan bila diperlukan maintenance atau acara khusus kedinasan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      Ruang {room.roomNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 mt-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Lantai {room.floor} • Kapasitas {room.capacity} Orang
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      room.status === 'maintenance'
                        ? 'bg-rose-100 text-rose-800'
                        : room.status === 'booked'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {room.status === 'maintenance' ? 'Perbaikan' : room.status === 'booked' ? 'Terpakai' : 'Tersedia'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Atur Status Ruangan:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onUpdateRoomStatus(room.id, 'available')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                        room.status === 'available'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Buka (Tersedia)
                    </button>
                    <button
                      onClick={() => onUpdateRoomStatus(room.id, 'maintenance')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                        room.status === 'maintenance'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Pemeliharaan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIKET KENDALA INVENTARIS */}
      {adminTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Laporan Kerusakan & Inventaris ({troubleReports.length})
            </h2>
            <span className="text-xs text-slate-500">
              Pelacakan perbaikan fasilitas oleh tim teknisi sarpras
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {troubleReports.map((ticket) => {
              const isResolved = ticket.status === 'resolved';
              const isInProgress = ticket.status === 'in_progress';

              return (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isResolved
                      ? 'border-slate-200 opacity-80'
                      : isInProgress
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                  }`}
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                        Ruang Rapat {ticket.roomNumber}
                      </span>
                      <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-md">
                        {ticket.facilityItem}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : ticket.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Prioritas: {ticket.priority}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isResolved
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {isResolved ? 'Selesai Diperbaiki' : isInProgress ? 'Sedang Dikerjakan' : 'Laporan Baru'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {ticket.description}
                    </p>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                      <span><strong>Pelapor:</strong> {ticket.reporterName} ({ticket.reporterPhone})</span>
                      <span>•</span>
                      <span><strong>Waktu Lapor:</strong> {ticket.createdAt}</span>
                    </div>

                    {ticket.technicianNotes && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
                        <strong>Catatan Penanganan Teknisi:</strong> {ticket.technicianNotes}
                        {ticket.resolvedAt && (
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            Selesai pada: {ticket.resolvedAt}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Technician status buttons */}
                  {!isResolved && (
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      {ticket.status === 'reported' && (
                        <button
                          onClick={() => {
                            const note = prompt('Catatan rencana perbaikan teknisi:') || '';
                            onUpdateTroubleStatus(ticket.id, 'in_progress', note);
                          }}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition-colors"
                        >
                          Tugaskan Teknisi
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const note = prompt('Catatan hasil perbaikan teknisi:') || 'Peralatan telah normal kembali.';
                          onUpdateTroubleStatus(ticket.id, 'resolved', note);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tandai Selesai</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: REKAPITULASI AGENDA & CETAK */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Rekapitulasi Lembar Jadwal Harian (Print-Ready)
              </h2>
              <p className="text-xs text-slate-500">
                Cetak agenda untuk papan pengumuman lobi atau meja resepsionis Gedung PPSDM KHIT
              </p>
            </div>
            <button
              onClick={handlePrintTodayAgenda}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          {/* Printable Sheet */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs print:p-0 print:border-none">
            {/* Gov Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
                BADAN KARANTINA INDONESIA (BARANTIN)
              </div>
              <div className="text-lg font-black text-slate-900 tracking-tight">
                PUSAT PENGEMBANGAN SDM KARANTINA HEWAN, IKAN DAN TUMBUHAN
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Jadwal Penggunaan Ruang Rapat • Tanggal: {formatIndonesianDate(todayStr)}
              </div>
            </div>

            {/* Agenda Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-slate-800 font-bold">
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Ruang</th>
                    <th className="p-2.5">Waktu</th>
                    <th className="p-2.5">Agenda / Topik Rapat</th>
                    <th className="p-2.5">Unit Kerja</th>
                    <th className="p-2.5">Peserta</th>
                    <th className="p-2.5">Penanggung Jawab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todayReservations.length > 0 ? (
                    todayReservations.map((res, idx) => (
                      <tr key={res.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-emerald-800">Ruang {res.roomNumber}</td>
                        <td className="p-2.5 font-mono font-semibold">{res.startTime} - {res.endTime}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{res.title}</td>
                        <td className="p-2.5 text-slate-600">{res.department}</td>
                        <td className="p-2.5">{res.attendeeCount} Orang</td>
                        <td className="p-2.5">{res.organizerName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">
                        Tidak ada agenda rapat yang disetujui untuk hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
              <span>Dicetak otomatis melalui Aplikasi SIGAP PPSDM KHIT</span>
              <span>Petugas Pengelola Sarana & Prasarana</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

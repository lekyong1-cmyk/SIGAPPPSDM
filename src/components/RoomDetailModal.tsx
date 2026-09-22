import React from 'react';
import { 
  X, 
  Users, 
  Layers, 
  Sparkles, 
  Tv, 
  Wind, 
  Wifi, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Calendar, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { MeetingRoom, Reservation } from '../types';
import { formatIndonesianDate } from '../utils/calendarUtils';

interface RoomDetailModalProps {
  room: MeetingRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onBookRoom: (room: MeetingRoom) => void;
  onReportIssue: (room: MeetingRoom) => void;
  roomReservations: Reservation[];
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  isOpen,
  onClose,
  onBookRoom,
  onReportIssue,
  roomReservations,
}) => {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Banner Header with Room Photo */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={room.image}
            alt={room.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Room Title & Specs */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                Ruang {room.roomNumber}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-300" />
                Lantai {room.floor}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-300" />
                Kapasitas {room.capacity} Orang
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {room.name}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Gedung Utama PPSDM Karantina Hewan Ikan dan Tumbuhan (KHIT)
            </p>
          </div>
        </div>

        {/* Modal Body / Scrollable Info */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Overview & Facilities */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Deskripsi Ruangan
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {room.description}
            </p>

            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Fasilitas Utama:
              </span>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((fac) => {
                  const isSmart = fac.toLowerCase().includes('smart board');
                  return (
                    <span
                      key={fac}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                        isSmart
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isSmart ? <Sparkles className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{fac}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Inventory & Equipment Transparency */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Daftar Inventaris & Fasilitas Ruangan
                </h3>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onReportIssue(room);
                }}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Lapor Kerusakan Alat</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
              {room.inventory && room.inventory.length > 0 ? (
                room.inventory.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          (Jumlah: {item.count} unit)
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Catatan: {item.notes}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        Pemeriksaan Terakhir: {item.lastInspected}
                      </p>
                    </div>

                    <div>
                      {item.condition === 'good' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Normal
                        </span>
                      )}
                      {item.condition === 'fair' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Perlu Perhatian
                        </span>
                      )}
                      {item.condition === 'broken' && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-rose-200">
                          <Wrench className="w-3 h-3 text-rose-600" />
                          Rusak
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  Data inventaris belum terdaftar.
                </div>
              )}
            </div>
          </div>

          {/* Section: Upcoming Meetings in this room */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Agenda Rapat Mendatang di {room.name}</span>
            </h3>

            {roomReservations.length > 0 ? (
              <div className="space-y-2">
                {roomReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {res.title}
                      </div>
                      <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatIndonesianDate(res.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <Clock className="w-3 h-3" />
                          {res.startTime} - {res.endTime} WIB
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        PJ: {res.organizerName} ({res.department})
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        res.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {res.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
                Belum ada jadwal rapat terdaftar untuk ruangan ini.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onReportIssue(room);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            <span>Lapor Kerusakan Alat</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onBookRoom(room);
            }}
            disabled={room.status === 'maintenance'}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Pesan Ruangan Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};

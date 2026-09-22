import React from 'react';
import { 
  Users, 
  Layers, 
  Tv, 
  Wind, 
  Wifi, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Info,
  CalendarCheck,
  Wrench
} from 'lucide-react';
import { MeetingRoom, Reservation } from '../types';

interface RoomCardProps {
  room: MeetingRoom;
  activeReservations: Reservation[];
  onSelectForBooking: (room: MeetingRoom) => void;
  onViewDetails: (room: MeetingRoom) => void;
  onReportIssue: (room: MeetingRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  activeReservations,
  onSelectForBooking,
  onViewDetails,
  onReportIssue,
}) => {
  // Find current or upcoming meeting for this room today
  const todayStr = new Date().toISOString().split('T')[0];
  const roomMeetingsToday = activeReservations
    .filter((r) => r.roomId === room.id && r.date === todayStr && (r.status === 'approved' || r.status === 'pending'))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const nextMeeting = roomMeetingsToday[0];
  const isMaintenance = room.status === 'maintenance';
  const isOccupied = roomMeetingsToday.length > 0;

  // Icon mapper helper
  const getFacilityIcon = (facility: string) => {
    const fLower = facility.toLowerCase();
    if (fLower.includes('smart board')) return <Sparkles className="w-3.5 h-3.5 text-cyan-600" />;
    if (fLower.includes('projector')) return <Tv className="w-3.5 h-3.5 text-indigo-600" />;
    if (fLower.includes('white board')) return <FileText className="w-3.5 h-3.5 text-amber-600" />;
    if (fLower.includes('ac')) return <Wind className="w-3.5 h-3.5 text-sky-600" />;
    if (fLower.includes('wifi')) return <Wifi className="w-3.5 h-3.5 text-emerald-600" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div 
      id={`room-card-${room.roomNumber}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
    >
      {/* Header Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={room.image}
          alt={room.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="bg-emerald-950/90 text-white font-bold text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs border border-emerald-500/30">
            <span className="text-emerald-400">Ruang</span> {room.roomNumber}
          </span>
          <span className="bg-black/60 text-slate-200 text-xs px-2 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-300" />
            Lantai {room.floor}
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="absolute top-3 right-3">
          {isMaintenance ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-xs">
              <Wrench className="w-3.5 h-3.5" />
              Pemeliharaan
            </span>
          ) : isOccupied ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-900 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse"></span>
              Ada Jadwal
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Tersedia
            </span>
          )}
        </div>

        {/* Room Name & Capacity Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h3 className="font-bold text-lg tracking-tight drop-shadow-sm leading-snug">
              {room.name}
            </h3>
            <p className="text-xs text-slate-200 drop-shadow-xs line-clamp-1">
              Gedung PPSDM KHIT
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-white shadow-xs">
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>{room.capacity} Orang</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {room.description}
        </p>

        {/* Facilities Pills */}
        <div>
          <div className="text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            Fasilitas Ruangan:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.facilities.map((fac) => {
              const isSmartBoard = fac.toLowerCase().includes('smart board');
              return (
                <span
                  key={fac}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    isSmartBoard
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {getFacilityIcon(fac)}
                  <span>{fac}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Agenda Status for Today */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
          {nextMeeting ? (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 truncate">
                    {nextMeeting.title}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md shrink-0">
                    {nextMeeting.startTime} - {nextMeeting.endTime}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate mt-0.5">
                  PJ: {nextMeeting.organizerName}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800">
              <CalendarCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-[11px]">
                Hari ini belum ada agenda lanjutan. Ruangan siap dipesan.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            id={`btn-detail-${room.roomNumber}`}
            onClick={() => onViewDetails(room)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Inventaris & Spek</span>
          </button>

          <button
            id={`btn-book-${room.roomNumber}`}
            onClick={() => onSelectForBooking(room)}
            disabled={isMaintenance}
            className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              isMaintenance
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Pesan Ruangan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

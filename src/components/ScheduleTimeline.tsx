import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Sparkles, 
  Users, 
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MeetingRoom, Reservation } from '../types';
import { formatIndonesianDate } from '../utils/calendarUtils';

interface ScheduleTimelineProps {
  rooms: MeetingRoom[];
  reservations: Reservation[];
  onSlotClick: (room: MeetingRoom, date: string, startHour: string) => void;
  onViewReservation: (reservation: Reservation) => void;
}

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  rooms,
  reservations,
  onSlotClick,
  onViewReservation,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [floorFilter, setFloorFilter] = useState<'all' | 1 | 2>('all');

  // Quick Date Navigation
  const handleDateChange = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const setQuickDate = (type: 'today' | 'tomorrow') => {
    const d = new Date();
    if (type === 'tomorrow') d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const filteredRooms = rooms.filter((r) => {
    if (floorFilter === 'all') return true;
    return r.floor === floorFilter;
  });

  // Helper to test if a room has a booking covering a specific hour
  const getBookingForSlot = (roomId: string, hourStr: string) => {
    const [h] = hourStr.split(':').map(Number);
    const slotMinutesStart = h * 60;
    const slotMinutesEnd = (h + 1) * 60;

    return reservations.find((res) => {
      if (res.roomId !== roomId || res.date !== selectedDate) return false;
      if (res.status === 'rejected' || res.status === 'cancelled') return false;

      const [startH, startM] = res.startTime.split(':').map(Number);
      const [endH, endM] = res.endTime.split(':').map(Number);
      const resStartMin = startH * 60 + startM;
      const resEndMin = endH * 60 + endM;

      return Math.max(slotMinutesStart, resStartMin) < Math.min(slotMinutesEnd, resEndMin);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header Bar & Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Matriks Ketersediaan Ruangan Rapat Real-Time
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Live Agenda
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau dan amankan slot ruangan rapat tanpa bentrok jadwal di PPSDM KHIT
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick buttons */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setQuickDate('today')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedDate === new Date().toISOString().split('T')[0]
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setQuickDate('tomorrow')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Besok
            </button>
          </div>

          {/* Stepper & Date Picker */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
            <button
              onClick={() => handleDateChange(-1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-l-lg transition-colors"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-hidden cursor-pointer"
              />
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-lg transition-colors"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Floor filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setFloorFilter('all')}
              className={`px-2.5 py-1 rounded-md ${
                floorFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFloorFilter(1)}
              className={`px-2.5 py-1 rounded-md ${
                floorFilter === 1
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lt. 1
            </button>
            <button
              onClick={() => setFloorFilter(2)}
              className={`px-2.5 py-1 rounded-md ${
                floorFilter === 2
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lt. 2
            </button>
          </div>
        </div>
      </div>

      {/* Date Banner Notice */}
      <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold">
            Jadwal untuk: {formatIndonesianDate(selectedDate)}
          </span>
        </div>
        <span className="text-emerald-700 hidden sm:inline">
          Tip: Klik pada slot kosong <span className="font-semibold text-emerald-800">"Tersedia"</span> untuk langsung memesan jam tersebut
        </span>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Table Header: Time Columns */}
          <div className="grid grid-cols-11 border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold">
            <div className="p-3 border-r border-slate-200 text-slate-800 flex items-center justify-between">
              <span>Ruang Rapat</span>
              <span className="text-[10px] text-slate-500 font-normal">Kapasitas</span>
            </div>
            {HOURS.map((hr) => (
              <div
                key={hr}
                className="p-2.5 text-center border-r border-slate-200 font-mono tracking-tight last:border-r-0"
              >
                {hr}
              </div>
            ))}
          </div>

          {/* Table Body: 7 Rooms Rows */}
          <div className="divide-y divide-slate-200">
            {filteredRooms.map((room) => {
              const isMaintenance = room.status === 'maintenance';

              return (
                <div
                  key={room.id}
                  className="grid grid-cols-11 hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Room Meta Left Column */}
                  <div className="p-3 border-r border-slate-200 bg-white flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          {room.roomNumber}
                        </span>
                        {room.facilities.some(f => f.toLowerCase().includes('smart board')) && (
                          <span title="Fasilitas Smart Board" className="text-cyan-600">
                            <Sparkles className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {room.capacity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
                      <span>Lantai {room.floor}</span>
                      {isMaintenance ? (
                        <span className="text-rose-600 font-bold text-[10px]">Perbaikan</span>
                      ) : (
                        <span className="text-emerald-700 font-medium text-[10px]">Aktif</span>
                      )}
                    </div>
                  </div>

                  {/* 10 Time Slot Blocks */}
                  {HOURS.map((hr) => {
                    if (isMaintenance) {
                      return (
                        <div
                          key={hr}
                          className="border-r border-slate-200 p-1 bg-rose-50/40 flex items-center justify-center text-[10px] text-rose-500 font-medium select-none last:border-r-0"
                          title="Ruangan sedang dalam pemeliharaan"
                        >
                          <span className="truncate">Perbaikan</span>
                        </div>
                      );
                    }

                    const booking = getBookingForSlot(room.id, hr);

                    if (booking) {
                      const isPending = booking.status === 'pending';
                      return (
                        <div
                          key={hr}
                          onClick={() => onViewReservation(booking)}
                          className={`border-r border-slate-200 p-1 flex flex-col justify-center cursor-pointer transition-all last:border-r-0 ${
                            isPending
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-l-2 border-l-amber-500'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-l-2 border-l-emerald-600'
                          }`}
                          title={`${booking.title} (${booking.startTime} - ${booking.endTime})\nPJ: ${booking.organizerName}`}
                        >
                          <p className="text-[11px] font-bold truncate leading-tight">
                            {booking.title}
                          </p>
                          <p className="text-[9px] text-slate-600 truncate mt-0.5">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      );
                    }

                    // Available Slot
                    return (
                      <div
                        key={hr}
                        onClick={() => onSlotClick(room, selectedDate, hr)}
                        className="border-r border-slate-200 p-1 hover:bg-emerald-50 cursor-pointer flex items-center justify-center group/slot transition-all last:border-r-0"
                        title={`Slot Tersedia: Klik untuk memesan ${room.name} jam ${hr}`}
                      >
                        <span className="opacity-0 group-hover/slot:opacity-100 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded px-1.5 py-0.5 shadow-2xs">
                          <Plus className="w-3 h-3 text-emerald-600" />
                          <span>Pesan</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Summary Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-700">Keterangan:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
            <span className="text-slate-600">Tersedia (Bisa Dipesan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400"></span>
            <span className="text-slate-600">Terpakai (Disetujui)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400"></span>
            <span className="text-slate-600">Menunggu Verifikasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300"></span>
            <span className="text-slate-600">Pemeliharaan (Maintenance)</span>
          </div>
        </div>
        <div className="text-slate-500 font-medium">
          Total: 7 Ruangan Rapat PPSDM KHIT
        </div>
      </div>
    </div>
  );
};

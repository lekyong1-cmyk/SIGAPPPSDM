import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Info,
  Send,
  Coffee,
  Grid
} from 'lucide-react';
import { 
  MeetingRoom, 
  Reservation, 
  LayoutType, 
  ConsumptionType 
} from '../types';
import { DEPARTMENTS } from '../data/initialData';
import { isTimeOverlapping, formatIndonesianDate } from '../utils/calendarUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: MeetingRoom[];
  initialRoomId?: string;
  initialDate?: string;
  initialStartTime?: string;
  existingReservations: Reservation[];
  onSaveReservation: (newReservation: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'adminNotes'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  initialRoomId,
  initialDate,
  initialStartTime,
  existingReservations,
  onSaveReservation,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialRoomId || rooms[0]?.id || ''
  );
  const [title, setTitle] = useState<string>('');
  const [agenda, setAgenda] = useState<string>('');
  const [date, setDate] = useState<string>(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState<string>(initialStartTime || '09:00');
  const [endTime, setEndTime] = useState<string>('11:00');
  const [organizerName, setOrganizerName] = useState<string>('');
  const [organizerNIP, setOrganizerNIP] = useState<string>('');
  const [organizerPhone, setOrganizerPhone] = useState<string>('');
  const [organizerEmail, setOrganizerEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [attendeeCount, setAttendeeCount] = useState<number>(15);
  const [attendeesList, setAttendeesList] = useState<string>('');
  const [layout, setLayout] = useState<LayoutType>('U-Shape');
  const [consumption, setConsumption] = useState<ConsumptionType>('snack_morning');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const [conflictReservation, setConflictReservation] = useState<Reservation | null>(null);

  // Sync props when opened or changed
  useEffect(() => {
    if (initialRoomId) setSelectedRoomId(initialRoomId);
    if (initialDate) setDate(initialDate);
    if (initialStartTime) {
      setStartTime(initialStartTime);
      const [h] = initialStartTime.split(':').map(Number);
      const endH = String(Math.min(h + 2, 17)).padStart(2, '0');
      setEndTime(`${endH}:00`);
    }
  }, [initialRoomId, initialDate, initialStartTime, isOpen]);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId);

  // Check for conflicts whenever room, date, startTime, or endTime change
  useEffect(() => {
    if (!selectedRoomId || !date || !startTime || !endTime) {
      setConflictReservation(null);
      return;
    }

    const conflict = existingReservations.find((res) => {
      if (res.roomId !== selectedRoomId || res.date !== date) return false;
      if (res.status === 'rejected' || res.status === 'cancelled') return false;
      return isTimeOverlapping(startTime, endTime, res.startTime, res.endTime);
    });

    setConflictReservation(conflict || null);
  }, [selectedRoomId, date, startTime, endTime, existingReservations]);

  if (!isOpen || !activeRoom) return null;

  const isOverCapacity = activeRoom ? attendeeCount > activeRoom.capacity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictReservation) {
      alert(`Jadwal bentrok dengan agenda: "${conflictReservation.title}". Mohon ganti jam atau pilih ruangan lain.`);
      return;
    }

    if (isOverCapacity) {
      if (!confirm(`Kapasitas ruangan ${activeRoom.name} (${activeRoom.capacity} orang) lebih kecil dari jumlah peserta (${attendeeCount} orang). Lanjutkan permohonan?`)) {
        return;
      }
    }

    onSaveReservation({
      title,
      agenda,
      roomId: activeRoom.id,
      roomNumber: activeRoom.roomNumber,
      date,
      startTime,
      endTime,
      organizerName,
      organizerNIP,
      organizerPhone,
      organizerEmail,
      department,
      attendeeCount,
      attendeesList,
      layout,
      consumption,
      specialNotes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200 border border-emerald-600/50">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Formulir Pemesanan Ruang Rapat
              </h2>
              <p className="text-xs text-emerald-200">
                Sistem Agenda SIGAP PPSDM KHIT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Room Selection & Room Spec Overview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Ruang Rapat:
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Lantai {r.floor} • Kapasitas {r.capacity} Orang)
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Quick Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Kapasitas: {activeRoom.capacity} Orang
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Lantai {activeRoom.floor}
                </span>
              </div>
            </div>

            {/* Room Facilities Quick List */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeRoom.facilities.map((fac) => (
                <span
                  key={fac}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule & Time Inputs */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Jadwal & Waktu Pelaksanaan:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Rapat *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu Mulai *
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Waktu Selesai *
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* REAL-TIME CONFLICT ALERT BANNER */}
          {conflictReservation && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-sm text-rose-950">
                  Peringatan Bentrok Jadwal!
                </p>
                <p className="mt-0.5">
                  Ruang Rapat {activeRoom.roomNumber} pada waktu tersebut sudah dibooking untuk agenda:
                </p>
                <div className="mt-1 font-semibold text-slate-900 bg-white/80 p-2 rounded-md border border-rose-200">
                  "{conflictReservation.title}" ({conflictReservation.startTime} - {conflictReservation.endTime} WIB)
                  <br />
                  <span className="font-normal text-[11px] text-slate-600">
                    Penanggung Jawab: {conflictReservation.organizerName} ({conflictReservation.department})
                  </span>
                </div>
                <p className="mt-1.5 text-rose-800">
                  Silakan ganti jam mulai/selesai atau pilih ruangan rapat lain yang masih tersedia.
                </p>
              </div>
            </div>
          )}

          {/* Capacity warning */}
          {isOverCapacity && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Jumlah peserta ({attendeeCount} orang) melebihi kapasitas standar ruangan ({activeRoom.capacity} orang).
              </span>
            </div>
          )}

          {/* Meeting Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Detail Kegiatan & Agenda:</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama / Judul Kegiatan Rapat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rapat Koordinasi Penyusunan Modul Pelatihan Karantina Ikan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agenda / Pokok Pembahasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Uraikan agenda pokok rapat yang akan dibahas..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Kerja / Kelompok Substansi *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Jumlah Peserta (Orang) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={attendeeCount}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Organizer / Penanggung Jawab */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Identitas Penanggung Jawab (Pemohon):</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Penanggung Jawab"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Pegawai
                </label>
                <input
                  type="text"
                  placeholder="19850101 201012 1 001"
                  value={organizerNIP}
                  onChange={(e) => setOrganizerNIP(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP Aktif *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890 (Untuk Notifikasi WA)"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Kedinasan
                </label>
                <input
                  type="email"
                  placeholder="nama@karantina.pertanian.go.id"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Logistics: Layout, Consumption, Attendees, Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-emerald-600" />
              <span>Kebutuhan Tata Letak & Fasilitas:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tata Letak Meja / Kursi
                </label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as LayoutType)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="U-Shape">Bentuk U (U-Shape) - Diskusi & Rapat Pleno</option>
                  <option value="Classroom">Kelas (Classroom) - Pelatihan & Diklat</option>
                  <option value="Round Table">Meja Bundar (Round Table) - Konsinyasi</option>
                  <option value="Boardroom">Boardroom - Rapat Pimpinan / Tertutup</option>
                  <option value="Theater">Theater - Audiensi / Sosialisasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kebutuhan Konsumsi
                </label>
                <select
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value as ConsumptionType)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="none">Tidak Ada Konsumsi</option>
                  <option value="snack_morning">Snack Pagi (Rehat 10.00)</option>
                  <option value="lunch">Makan Siang (12.00 - 13.00)</option>
                  <option value="snack_afternoon">Snack Sore (Rehat 15.00)</option>
                  <option value="full_day">Paket Lengkap (Snack Pagi, Siang, Sore)</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daftar Undangan / Peserta Utama (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Pisahkan nama peserta dengan tanda koma..."
                value={attendeesList}
                onChange={(e) => setAttendeesList(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Khusus Perlengkapan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Butuh setting Smart Board & Zoom hybrid, mic wireless 2 buah..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batalkan
            </button>

            <button
              type="submit"
              disabled={Boolean(conflictReservation)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all ${
                conflictReservation
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Kirim Permohonan Reservasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

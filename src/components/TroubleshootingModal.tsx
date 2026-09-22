import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  Send, 
  Camera, 
  CheckCircle2,
  Building2,
  Phone,
  User
} from 'lucide-react';
import { MeetingRoom, TroubleReport, IssuePriority } from '../types';

interface TroubleshootingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: MeetingRoom[];
  preselectedRoomId?: string;
  onSaveReport: (report: Omit<TroubleReport, 'id' | 'createdAt' | 'status' | 'technicianNotes'>) => void;
}

const COMMON_FACILITIES = [
  'Laser Projector / Kabel HDMI',
  'Smart Board & Touchscreen',
  'Pendingin Ruangan (AC) / Remot AC',
  'Akses Internet WiFi / Koneksi Lambat',
  'Sound System / Wireless Mic',
  'White Board & Spidol / Penghapus',
  'Kelistrikan / Saklar / Stop Kontak',
  'Meja & Kursi Rapat',
  'Lampu Penerangan Ruangan',
  'Lainnya',
];

export const TroubleshootingModal: React.FC<TroubleshootingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  preselectedRoomId,
  onSaveReport,
}) => {
  const [roomId, setRoomId] = useState<string>(preselectedRoomId || rooms[0]?.id || '');
  const [facilityItem, setFacilityItem] = useState<string>(COMMON_FACILITIES[0]);
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedRoomId) setRoomId(preselectedRoomId);
  }, [preselectedRoomId, isOpen]);

  if (!isOpen) return null;

  const activeRoom = rooms.find((r) => r.id === roomId) || rooms[0];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSaveReport({
      roomId: activeRoom.id,
      roomNumber: activeRoom.roomNumber,
      facilityItem,
      description,
      priority,
      reporterName,
      reporterPhone,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Lapor Kendala Fasilitas / Inventaris
              </h2>
              <p className="text-xs text-slate-400">
                Pengelolaan Sarana & Prasarana PPSDM KHIT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Room Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ruang Rapat yang Mengalami Kendala *
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Lantai {r.floor})
                </option>
              ))}
            </select>
          </div>

          {/* Facility Item Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Peralatan / Fasilitas Bermasalah *
            </label>
            <select
              value={facilityItem}
              onChange={(e) => setFacilityItem(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              {COMMON_FACILITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tingkat Prioritas Perbaikan *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  priority === 'low'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                  className="hidden"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Rendah</span>
              </label>

              <label
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'medium'}
                  onChange={() => setPriority('medium')}
                  className="hidden"
                />
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Sedang</span>
              </label>

              <label
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                  className="hidden"
                />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Mendesak</span>
              </label>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Uraian Kerusakan / Kendala Detail *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan secara spesifik gejala kerusakan, misal: 'Proyektor tidak mau menyala sama sekali walau lampu indikator berkedip merah'..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Photo Attachment (Drag-and-drop / file selector) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Foto Bukti Kerusakan (Opsional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-amber-400 transition-colors">
              {photoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-36 rounded-lg object-contain border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-1.5 py-2">
                  <Camera className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    Unggah Foto Kerusakan
                  </span>
                  <span className="text-[11px] text-slate-500">
                    JPG, PNG atau JPEG (Maks. 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Reporter Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pelapor *
              </label>
              <input
                type="text"
                required
                placeholder="Nama Anda"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / HP Aktif *
              </label>
              <input
                type="tel"
                required
                placeholder="0812xxxx (Untuk tindak lanjut)"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 text-slate-900" />
              <span>Kirim Laporan Kerusakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

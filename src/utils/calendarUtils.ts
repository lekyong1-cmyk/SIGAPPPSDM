import { Reservation } from '../types';

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end} WIB`;
}

// Check if two time intervals on the same day overlap
export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const aStart = toMinutes(startA);
  const aEnd = toMinutes(endA);
  const bStart = toMinutes(startB);
  const bEnd = toMinutes(endB);

  // Overlap occurs if one interval starts before the other ends and ends after the other starts
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

// Generate Google Calendar Link
export function generateGoogleCalendarUrl(res: Reservation): string {
  const cleanDate = res.date.replace(/-/g, '');
  const cleanStart = res.startTime.replace(':', '') + '00';
  const cleanEnd = res.endTime.replace(':', '') + '00';

  // Using Asia/Jakarta (WIB) timezone representation
  const startDateTime = `${cleanDate}T${cleanStart}`;
  const endDateTime = `${cleanDate}T${cleanEnd}`;

  const title = encodeURIComponent(`[SIGAP PPSDM] ${res.title}`);
  const details = encodeURIComponent(
    `AGENDA RAPAT PPSDM KHIT\n` +
    `--------------------------------------\n` +
    `Agenda: ${res.agenda || '-'}\n` +
    `Unit Kerja: ${res.department}\n` +
    `Penanggung Jawab: ${res.organizerName} (${res.organizerNIP || '-'})\n` +
    `Kontak: ${res.organizerPhone}\n` +
    `Jumlah Peserta: ${res.attendeeCount} Orang\n` +
    `Tata Letak: ${res.layout}\n` +
    `Konsumsi: ${res.consumption}\n` +
    `Catatan Khusus: ${res.specialNotes || '-'}\n\n` +
    `Dikelola melalui SIGAP PPSDM KHIT (Sistem Agenda & Pemesanan Ruangan)`
  );
  const location = encodeURIComponent(`${res.roomNumber ? `Ruang Rapat ${res.roomNumber}` : 'Ruang Rapat PPSDM'}, Gedung PPSDM Karantina Hewan Ikan dan Tumbuhan`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&ctz=Asia/Jakarta&details=${details}&location=${location}`;
}

// Generate Microsoft Outlook Web Calendar Link
export function generateOutlookCalendarUrl(res: Reservation): string {
  const startIso = `${res.date}T${res.startTime}:00`;
  const endIso = `${res.date}T${res.endTime}:00`;

  const subject = encodeURIComponent(`[SIGAP PPSDM] ${res.title}`);
  const body = encodeURIComponent(
    `AGENDA RAPAT PPSDM KHIT\n` +
    `Agenda: ${res.agenda || '-'}\n` +
    `Unit Kerja: ${res.department}\n` +
    `Penanggung Jawab: ${res.organizerName}\n` +
    `Ruangan: Ruang Rapat ${res.roomNumber}\n` +
    `Peserta: ${res.attendeeCount} orang\n\n` +
    `Aplikasi SIGAP PPSDM KHIT`
  );
  const location = encodeURIComponent(`Ruang Rapat ${res.roomNumber}, Gedung PPSDM KHIT`);

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${encodeURIComponent(startIso)}&enddt=${encodeURIComponent(endIso)}&body=${body}&location=${location}`;
}

// Generate and trigger download of .ics (iCalendar) file
export function downloadICalFile(res: Reservation) {
  const cleanDate = res.date.replace(/-/g, '');
  const cleanStart = res.startTime.replace(':', '') + '00';
  const cleanEnd = res.endTime.replace(':', '') + '00';

  const uid = `${res.id}-${Date.now()}@sigap-ppsdm.karantina.go.id`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SIGAP PPSDM KHIT//Sistem Agenda Rapat//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Jakarta:${cleanDate}T${cleanStart}`,
    `DTEND;TZID=Asia/Jakarta:${cleanDate}T${cleanEnd}`,
    `SUMMARY:[SIGAP PPSDM] ${res.title}`,
    `DESCRIPTION:${res.agenda ? res.agenda.replace(/\n/g, '\\n') : 'Agenda Rapat PPSDM KHIT'}\\nPenanggung Jawab: ${res.organizerName}\\nUnit Kerja: ${res.department}`,
    `LOCATION:Ruang Rapat ${res.roomNumber}\\, Gedung PPSDM KHIT`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat Rapat SIGAP PPSDM 30 Menit Lagi',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Agenda-Ruang-${res.roomNumber}-${res.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate formatted WhatsApp Reminder Broadcast text
export function generateWhatsAppReminderMessage(res: Reservation): string {
  const formattedDate = formatIndonesianDate(res.date);

  return (
    `*PENGINGAT AGENDA RAPAT - PPSDM KHIT*\n` +
    `_Sistem Informasi Agenda & Pemesanan Ruangan (SIGAP)_\n\n` +
    `Bapak/Ibu/Rekan Pegawai yang kami hormati,\n` +
    `Diberitahukan perihal jadwal kegiatan rapat kedinasan dengan rincian sbb:\n\n` +
    `📌 *Agenda:* ${res.title}\n` +
    `🏢 *Tempat:* Ruang Rapat ${res.roomNumber} (Gedung PPSDM KHIT)\n` +
    `📅 *Hari/Tanggal:* ${formattedDate}\n` +
    `⏰ *Waktu:* ${res.startTime} s.d. ${res.endTime} WIB\n` +
    `👥 *Peserta Terdaftar:* ${res.attendeeCount} Orang\n` +
    `🏛️ *Unit Kerja:* ${res.department}\n` +
    `👤 *Penanggung Jawab:* ${res.organizerName}\n` +
    `${res.agenda ? `📝 *Deskripsi Pembahasan:* ${res.agenda}\n` : ''}` +
    `${res.specialNotes ? `⚠️ *Catatan:* ${res.specialNotes}\n` : ''}\n` +
    `Mohon hadir tepat waktu 10 menit sebelum agenda dimulai. Terima kasih atas kerja sama dan kedisiplinannya.\n\n` +
    `_Pusat Pengembangan SDM Karantina Hewan Ikan dan Tumbuhan (PPSDM KHIT)_`
  );
}

export function openWhatsAppLink(phone: string, text: string) {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '').replace(/^0/, '62') : '';
  const url = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

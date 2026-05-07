'use client';

import { useMemo } from 'react';
import { BellRing, ShieldCheck, UsersRound, Megaphone, MessageCircleWarning } from 'lucide-react';
import { useDigitalRondaStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/format';

const announcements = [
  {
    id: 'an-1',
    title: 'Jadwal pos malam diperbarui',
    text: 'Regu 1 bertugas pukul 21.00, regu 2 pukul 23.00, dan regu 3 pukul 01.00.',
  },
  {
    id: 'an-2',
    title: 'Senter cadangan dan peluit sudah tersedia',
    text: 'Peralatan disimpan di loker pos utama agar mudah diambil saat pergantian shift.',
  },
  {
    id: 'an-3',
    title: 'Kampanye lingkungan aman malam hari',
    text: 'Warga diminta menyalakan lampu teras dan menutup akses gang setelah lewat jam 10 malam.',
  },
];

const members = [
  { id: 'm-1', name: 'Budi Santoso', role: 'Koordinator ronda', shift: '21.00 - 23.00' },
  { id: 'm-2', name: 'Sari Lestari', role: 'Operator laporan', shift: '23.00 - 01.00' },
  { id: 'm-3', name: 'Rizal Pratama', role: 'Patroli keliling', shift: '01.00 - 03.00' },
  { id: 'm-4', name: 'Maya Putri', role: 'Kontrol pintu gerbang', shift: '03.00 - 05.00' },
  { id: 'm-5', name: 'Deni Wicaksono', role: 'Monitoring CCTV', shift: 'Siaga malam' },
  { id: 'm-6', name: 'Fajar Hidayat', role: 'Cadangan cepat tanggap', shift: 'On call' },
];

export default function KomunitasPage() {
  const reports = useDigitalRondaStore((state) => state.reports);

  const recentReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4),
    [reports],
  );

  return (
    <div className="split-2">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Feed komunitas</p>
            <h2 className="section-title">Laporan warga dan sinyal lingkungan</h2>
          </div>
          <div className="badge">
            <BellRing size={14} />
            {reports.length} laporan aktif
          </div>
        </div>

        <div className="alert-feed" style={{ marginTop: 14 }}>
          {recentReports.map((report) => (
            <div key={report.id} className="feed-item">
              <div className="feed-main">
                <div className="feed-meta">
                  <span className="type-badge">{report.type}</span>
                  <span className={`status-badge ${report.status}`}>{report.status}</span>
                </div>
                <p className="feed-title">{report.description}</p>
                <p className="feed-subtext">
                  {report.location} • oleh {report.reportedBy}
                </p>
              </div>
              <div className="list-subtext" style={{ whiteSpace: 'nowrap' }}>
                {formatRelativeTime(report.timestamp)}
              </div>
            </div>
          ))}
        </div>

        <div className="empty-state" style={{ marginTop: 16 }}>
          <div className="badge">Kenapa feed ini penting?</div>
          <p className="note">Warga bisa melihat kejadian terbaru, status penanganan, dan siapa yang sedang bertugas di lapangan.</p>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Pengumuman</p>
            <h3 className="section-title">Info singkat yang perlu diketahui warga</h3>
          </div>
          <div className="badge">
            <Megaphone size={14} />
            Update RW
          </div>
        </div>

        <div className="alert-feed" style={{ marginTop: 14 }}>
          {announcements.map((announcement) => (
            <div key={announcement.id} className="member-item">
              <div className="member-main">
                <p className="member-name">{announcement.title}</p>
                <p className="list-subtext">{announcement.text}</p>
              </div>
              <div className="member-badge">Pengumuman</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ gridColumn: '1 / -1' }}>
        <div className="section-head">
          <div>
            <p className="eyebrow">Daftar anggota</p>
            <h3 className="section-title">Relawan dan penggerak ronda modern</h3>
          </div>
          <div className="badge">
            <UsersRound size={14} />
            {members.length} anggota
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 14 }}>
          {members.map((member) => (
            <div key={member.id} className="card">
              <div className="card-body">
                <div className="card-head">
                  <div>
                    <p className="card-title">{member.name}</p>
                    <p className="card-subtitle">{member.role}</p>
                  </div>
                  <div className="member-badge">
                    <ShieldCheck size={12} />
                    Siaga
                  </div>
                </div>
                <div className="list-subtext">Shift: {member.shift}</div>
                <div className="list-subtext">Siap menerima tugas patroli dan notifikasi darurat.</div>
              </div>
            </div>
          ))}
        </div>

        <div className="empty-state" style={{ marginTop: 16 }}>
          <div className="badge">
            <MessageCircleWarning size={14} />
            Notifikasi komunitas
          </div>
          <p className="note">Jika ada laporan baru, seluruh feed komunitas akan menampilkan status dan lokasi terkini secara otomatis.</p>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { BellRing, Flame, ShieldAlert, TriangleAlert } from 'lucide-react';
import { ReportType, useDigitalRondaStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/format';

const reportTypeMeta: Record<ReportType, { label: string; icon: typeof ShieldAlert }> = {
  keamanan: { label: 'Keamanan', icon: ShieldAlert },
  kebakaran: { label: 'Kebakaran', icon: Flame },
  kecelakaan: { label: 'Kecelakaan', icon: BellRing },
  lainnya: { label: 'Lainnya', icon: TriangleAlert },
};

const reportTypeOrder: ReportType[] = ['keamanan', 'kebakaran', 'kecelakaan', 'lainnya'];

export default function LaporPage() {
  const reports = useDigitalRondaStore((state) => state.reports);
  const submitReport = useDigitalRondaStore((state) => state.submitReport);

  const [type, setType] = useState<ReportType>('keamanan');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [toast, setToast] = useState('');

  const latestReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3),
    [reports],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();

    if (!trimmedDescription || !trimmedLocation) {
      setToast('Deskripsi dan lokasi wajib diisi.');
      window.setTimeout(() => setToast(''), 2400);
      return;
    }

    submitReport({
      type,
      description: trimmedDescription,
      location: trimmedLocation,
      reportedBy: 'Warga Digital',
      photoUrl: photoUrl.trim() || undefined,
    });

    setDescription('');
    setLocation('');
    setPhotoUrl('');
    setToast(`Laporan ${reportTypeMeta[type].label.toLowerCase()} berhasil dikirim.`);
    window.setTimeout(() => setToast(''), 2800);
  };

  return (
    <div className="grid-2">
      <section className="form-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Form laporan warga</p>
            <h2 className="section-title">Laporkan kejadian dari lingkungan sekitar</h2>
          </div>
          <div className="badge">
            <BellRing size={14} />
            Masuk ke feed komunitas
          </div>
        </div>

        <form className="grid" onSubmit={handleSubmit} style={{ marginTop: 14, gap: 14 }}>
          <div className="form-field">
            <span>Tipe kejadian</span>
            <div className="radio-grid">
              {reportTypeOrder.map((option) => {
                const meta = reportTypeMeta[option];
                const Icon = meta.icon;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`radio-option ${type === option ? 'active' : ''}`}
                    onClick={() => setType(option)}
                  >
                    <Icon size={14} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="form-field span-2">
            <span>Deskripsi kejadian</span>
            <textarea
              className="textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan apa yang terjadi dengan singkat dan jelas..."
            />
          </label>

          <label className="form-field">
            <span>Lokasi</span>
            <input
              className="input"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Contoh: Pos Ronda 3 / Gang Mawar"
            />
          </label>

          <label className="form-field">
            <span>URL foto pendukung</span>
            <input
              className="input"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              placeholder="https://..."
            />
          </label>

          <div className="form-actions span-2">
            <button type="submit" className="button">
              <ShieldAlert size={16} />
              Kirim laporan
            </button>
            <div className="note">Pelapor otomatis tercatat sebagai Warga Digital.</div>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Ringkasan</p>
            <h3 className="section-title">Laporan terbaru yang sudah tersimpan</h3>
          </div>
          <div className="badge">{reports.length} total laporan</div>
        </div>

        <div className="alert-feed" style={{ marginTop: 14 }}>
          {latestReports.map((report) => {
            const meta = reportTypeMeta[report.type];
            return (
              <div key={report.id} className="report-item">
                <div className="report-main">
                  <div className="report-meta">
                    <span className="type-badge">{meta.label}</span>
                    <span className={`status-badge ${report.status}`}>{report.status}</span>
                  </div>
                  <p className="report-title">{report.description}</p>
                  <p className="report-subtext">
                    {report.location} • {report.reportedBy}
                  </p>
                </div>
                <div className="list-subtext" style={{ whiteSpace: 'nowrap' }}>
                  {formatRelativeTime(report.timestamp)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="empty-state" style={{ marginTop: 16 }}>
          <div className="badge">Tips pelaporan</div>
          <p className="note">Sebutkan lokasi paling dekat, jelaskan kronologi singkat, dan tambahkan foto jika aman untuk diambil.</p>
        </div>
      </section>

      {toast ? (
        <div className="toast success" role="status" aria-live="polite">
          <div className="toast-badge">
            <BellRing size={14} />
            Terkirim
          </div>
          <p className="toast-title">{toast}</p>
        </div>
      ) : null}
    </div>
  );
}

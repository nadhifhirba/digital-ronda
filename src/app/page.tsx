'use client';

import { useEffect, useMemo, useState } from 'react';
import { BellRing, Clock3, Flame, MapPinned, Route, ShieldAlert, Siren, UsersRound } from 'lucide-react';
import { useDigitalRondaStore } from '@/lib/store';
import { dateTimeFormatter, formatRelativeTime } from '@/lib/format';

const reportTypeLabel: Record<string, string> = {
  keamanan: 'Keamanan',
  kebakaran: 'Kebakaran',
  kecelakaan: 'Kecelakaan',
  lainnya: 'Lainnya',
};

const reportStatusClass: Record<string, string> = {
  baru: 'baru',
  diproses: 'diproses',
  selesai: 'selesai',
};

const activeRoutes = ['Rute Utara', 'Rute Tengah', 'Rute Selatan'];

export default function DashboardPage() {
  const checkpoints = useDigitalRondaStore((state) => state.checkpoints);
  const reports = useDigitalRondaStore((state) => state.reports);
  const patrols = useDigitalRondaStore((state) => state.patrols);
  const raiseEmergency = useDigitalRondaStore((state) => state.raiseEmergency);

  const [panicSeconds, setPanicSeconds] = useState(0);
  const [panicNote, setPanicNote] = useState('Siaga penuh di area permukiman malam ini.');

  useEffect(() => {
    if (panicSeconds <= 0) return;

    const timer = setInterval(() => {
      setPanicSeconds((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [panicSeconds > 0]);

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [reports],
  );

  const activePatrols = patrols.filter((patrol) => patrol.status === 'aktif');
  const recentReports = sortedReports.slice(0, 4);
  const freshCheckpoints = checkpoints.filter(
    (checkpoint) => Date.now() - new Date(checkpoint.lastChecked).getTime() < 45 * 60 * 1000,
  );

  const mapBounds = useMemo(() => {
    const latitudes = checkpoints.map((checkpoint) => checkpoint.lat);
    const longitudes = checkpoints.map((checkpoint) => checkpoint.lng);
    return {
      latMin: Math.min(...latitudes),
      latMax: Math.max(...latitudes),
      lngMin: Math.min(...longitudes),
      lngMax: Math.max(...longitudes),
    };
  }, [checkpoints]);

  const mapMarkers = checkpoints.map((checkpoint, index) => {
    const top = 14 + ((mapBounds.latMax - checkpoint.lat) / Math.max(0.0001, mapBounds.latMax - mapBounds.latMin)) * 68;
    const left = 12 + ((checkpoint.lng - mapBounds.lngMin) / Math.max(0.0001, mapBounds.lngMax - mapBounds.lngMin)) * 76;

    return {
      ...checkpoint,
      top,
      left,
      index,
    };
  });

  const triggerPanic = () => {
    const report = raiseEmergency('Pusat Komando RW 08', 'Warga Darurat');
    setPanicSeconds(120);
    setPanicNote(`Laporan darurat #${report.id.slice(-4).toUpperCase()} terkirim dari ${report.location}.`);
  };

  const countdownMinutes = String(Math.floor(panicSeconds / 60)).padStart(2, '0');
  const countdownSeconds = String(panicSeconds % 60).padStart(2, '0');

  return (
    <div className="hero-grid">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="badge">Komunitas siaga, respons cepat</div>
          <h2>Digital Ronda untuk menjaga lingkungan tetap aman sepanjang malam.</h2>
          <p>
            Pantau pos ronda, cek patroli aktif, dan kirim laporan darurat dalam satu layar yang
            cepat dipakai di ponsel.
          </p>
        </div>

        <div className="stats-grid" style={{ marginTop: 14 }}>
          <div className="stat-card">
            <span className="stat-value">{activePatrols.length}</span>
            <span className="stat-label">Patroli aktif</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{reports.length}</span>
            <span className="stat-label">Laporan masuk</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{freshCheckpoints.length}</span>
            <span className="stat-label">Pos ronda baru dicek</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{activeRoutes.length}</span>
            <span className="stat-label">Rute siaga</span>
          </div>
        </div>
      </section>

      <section className="countdown-banner">
        <div className="countdown-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 6 }}>
              Tombol darurat
            </p>
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Siren size={18} />
              Panic button
            </h3>
          </div>
          <div className="countdown-number">{panicSeconds > 0 ? `${countdownMinutes}:${countdownSeconds}` : '00:00'}</div>
        </div>

        <p className="section-copy" style={{ lineHeight: 1.5 }}>
          {panicSeconds > 0 ? 'Bantuan sedang dalam perjalanan.' : panicNote}
        </p>

        <div className="panic-strip">
          <button type="button" className="button-danger" onClick={triggerPanic}>
            <ShieldAlert size={18} />
            Kirim sinyal panik
          </button>
          <div className="note">
            Sinyal ini membuat laporan keamanan otomatis dan mengabarkan relawan ronda terdekat.
          </div>
        </div>
      </section>

      <section className="split-2">
        <div className="panel map-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Peta checkpoint</p>
              <h3 className="section-title">Sebaran pos ronda di lingkungan</h3>
            </div>
            <div className="badge">
              <MapPinned size={14} />
              {checkpoints.length} titik aktif
            </div>
          </div>

          <div className="map-frame" aria-label="Peta checkpoint statis">
            <div className="map-grid-lines" />
            {mapMarkers.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className="map-marker"
                style={{ top: `${checkpoint.top}%`, left: `${checkpoint.left}%` }}
              >
                <div className="marker-dot" />
                <div className="marker-label">
                  <Route size={12} />
                  {checkpoint.name}
                </div>
              </div>
            ))}
          </div>

          <div className="map-legend" style={{ paddingTop: 14 }}>
            <div className="note">Koordinat dibuat statis untuk simulasi permukiman padat warga.</div>
            <div className="chip">
              <Clock3 size={14} />
              45 menit terakhir dianggap masih hangat
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Patroli aktif</p>
              <h3 className="section-title">Regu yang sedang berkeliling</h3>
            </div>
            <div className="badge">
              <UsersRound size={14} />
              {activePatrols.length} regu jalan
            </div>
          </div>

          <div className="alert-feed" style={{ marginTop: 14 }}>
            {activePatrols.map((patrol) => (
              <div key={patrol.id} className="feed-item">
                <div className="feed-main">
                  <p className="feed-title">{patrol.officer}</p>
                  <p className="feed-subtext">{patrol.route}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="status-badge aktif">Aktif</div>
                  <div className="list-subtext" style={{ marginTop: 6 }}>
                    {dateTimeFormatter.format(new Date(patrol.startTime))}
                  </div>
                </div>
              </div>
            ))}
            {activePatrols.length === 0 ? <div className="empty-state">Belum ada patroli aktif.</div> : null}
          </div>
        </div>
      </section>

      <section className="split-2">
        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Laporan terbaru</p>
              <h3 className="section-title">Keluhan dan insiden yang baru masuk</h3>
            </div>
            <div className="badge">
              <BellRing size={14} />
              Feed komunitas
            </div>
          </div>

          <div className="alert-feed" style={{ marginTop: 14 }}>
            {recentReports.map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-main">
                  <div className="report-meta">
                    <span className="type-badge">{reportTypeLabel[report.type] ?? report.type}</span>
                    <span className={`status-badge ${reportStatusClass[report.status] ?? ''}`}>{report.status}</span>
                  </div>
                  <p className="report-title">{report.description}</p>
                  <p className="report-subtext">
                    {report.location} • oleh {report.reportedBy}
                  </p>
                </div>
                <div className="list-subtext" style={{ whiteSpace: 'nowrap' }}>
                  {formatRelativeTime(report.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Feed peringatan</p>
              <h3 className="section-title">Sinyal komunitas yang perlu direspons</h3>
            </div>
            <div className="badge">
              <Flame size={14} />
              Prioritas lingkungan
            </div>
          </div>

          <div className="alert-feed" style={{ marginTop: 14 }}>
            <div className="feed-item">
              <div className="feed-main">
                <p className="feed-title">Lampu gang belakang padam</p>
                <p className="feed-subtext">Perlu inspeksi malam ini agar jalur pulang tetap aman.</p>
              </div>
              <div className="status-badge baru">Baru</div>
            </div>
            <div className="feed-item">
              <div className="feed-main">
                <p className="feed-title">Jadwal ronda putaran kedua</p>
                <p className="feed-subtext">Regu malam diharapkan cek pos 2 dan pos 4 sebelum jam 23.00.</p>
              </div>
              <div className="status-badge diproses">Diproses</div>
            </div>
            <div className="feed-item">
              <div className="feed-main">
                <p className="feed-title">Notifikasi darurat aktif</p>
                <p className="feed-subtext">Jika tombol panik ditekan, pos terdekat akan otomatis menerima sinyal.</p>
              </div>
              <div className="status-badge selesai">Siap</div>
            </div>
          </div>
        </div>
      </section>

      <p className="footer-note">Digital Ronda dirancang untuk lingkungan perumahan, kampung, dan komunitas warga yang ingin siaga tanpa ribet.</p>
    </div>
  );
}

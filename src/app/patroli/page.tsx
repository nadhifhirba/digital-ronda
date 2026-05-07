'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, PlayCircle, Route, ShieldCheck, SquarePen, UsersRound } from 'lucide-react';
import { patrolRoutes, useDigitalRondaStore } from '@/lib/store';
import { dateTimeFormatter, formatRelativeTime } from '@/lib/format';

export default function PatroliPage() {
  const patrols = useDigitalRondaStore((state) => state.patrols);
  const startPatrol = useDigitalRondaStore((state) => state.startPatrol);
  const finishPatrol = useDigitalRondaStore((state) => state.finishPatrol);
  const [officerName, setOfficerName] = useState('Regu Malam');
  const [toast, setToast] = useState('');

  const activePatrols = useMemo(() => patrols.filter((patrol) => patrol.status === 'aktif'), [patrols]);
  const completedPatrols = useMemo(() => patrols.filter((patrol) => patrol.status === 'selesai'), [patrols]);

  const handleStart = (route: string) => {
    const safeOfficer = officerName.trim() || 'Regu Malam';
    startPatrol(route, safeOfficer);
    setToast(`Patroli dimulai oleh ${safeOfficer}.`);
    window.setTimeout(() => setToast(''), 2400);
  };

  const handleFinish = (patrolId: string, officer: string) => {
    finishPatrol(patrolId);
    setToast(`Patroli ${officer} ditandai selesai.`);
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="grid-2">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="badge">Rute ronda dan log tugas</div>
          <h2>Kelola patroli malam, mulai rute, dan pantau status regu dengan cepat.</h2>
          <p>
            Tetapkan nama regu, pilih rute yang tersedia, lalu catat perjalanan ronda dalam log
            yang mudah dibaca di ponsel.
          </p>
        </div>

        <div className="stats-grid" style={{ marginTop: 14 }}>
          <div className="stat-card">
            <span className="stat-value">{activePatrols.length}</span>
            <span className="stat-label">Patroli aktif</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{completedPatrols.length}</span>
            <span className="stat-label">Patroli selesai</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{patrolRoutes.length}</span>
            <span className="stat-label">Rute siap pakai</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Mode siaga</span>
          </div>
        </div>
      </section>

      <section className="form-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Pengaturan regu</p>
            <h3 className="section-title">Siapa yang turun malam ini?</h3>
          </div>
          <div className="badge">
            <UsersRound size={14} />
            {patrols.length} entri log
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 14 }}>
          <label className="form-field span-2">
            <span>Nama regu / petugas</span>
            <input
              className="input"
              value={officerName}
              onChange={(event) => setOfficerName(event.target.value)}
              placeholder="Contoh: Regu Beringin"
            />
          </label>
        </div>

        <div className="note" style={{ marginTop: 12 }}>
          Nama ini dipakai otomatis saat patroli baru dimulai.
        </div>
      </section>

      <section className="panel" style={{ gridColumn: '1 / -1' }}>
        <div className="section-head">
          <div>
            <p className="eyebrow">Rute aktif</p>
            <h3 className="section-title">Pilih jalur ronda yang ingin dijalankan</h3>
          </div>
          <div className="badge">
            <Route size={14} />
            3 rute utama
          </div>
        </div>

        <div className="route-grid" style={{ marginTop: 14 }}>
          {patrolRoutes.map((route) => (
            <div key={route.id} className="route-card">
              <div className="card-head">
                <div>
                  <strong>{route.name}</strong>
                  <p className="card-subtitle">{route.route}</p>
                </div>
                <div className="route-badge">
                  <Clock3 size={12} />
                  {route.duration}
                </div>
              </div>
              <div className="list-subtext">Jarak: {route.distance}</div>
              <div className="list-subtext">Fokus: {route.focus}</div>
              <button type="button" className="button" onClick={() => handleStart(route.route)}>
                <PlayCircle size={16} />
                Mulai patroli
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Patroli aktif</p>
            <h3 className="section-title">Regu yang sedang berjalan</h3>
          </div>
          <div className="badge">
            <ShieldCheck size={14} />
            Respons siaga
          </div>
        </div>

        <div className="patrol-log" style={{ marginTop: 14 }}>
          {activePatrols.map((patrol) => (
            <div key={patrol.id} className="log-item">
              <div className="log-main">
                <p className="log-title">{patrol.officer}</p>
                <p className="log-subtext">{patrol.route}</p>
                <div className="log-meta">
                  <span className="status-badge aktif">Aktif</span>
                  <span className="time-badge">Mulai {formatRelativeTime(patrol.startTime)}</span>
                </div>
              </div>
              <button type="button" className="button-secondary" onClick={() => handleFinish(patrol.id, patrol.officer)}>
                <CheckCircle2 size={16} />
                Selesai
              </button>
            </div>
          ))}
          {activePatrols.length === 0 ? <div className="empty-state">Belum ada patroli yang sedang aktif.</div> : null}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Log patroli</p>
            <h3 className="section-title">Riwayat perjalanan ronda</h3>
          </div>
          <div className="badge">
            <SquarePen size={14} />
            Catatan terurut
          </div>
        </div>

        <div className="patrol-log" style={{ marginTop: 14 }}>
          {[...patrols]
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .map((patrol) => (
              <div key={patrol.id} className="log-item">
                <div className="log-main">
                  <p className="log-title">{patrol.officer}</p>
                  <p className="log-subtext">{patrol.route}</p>
                  <div className="log-meta">
                    <span className={`status-badge ${patrol.status}`}>{patrol.status}</span>
                    <span className="time-badge">{dateTimeFormatter.format(new Date(patrol.startTime))}</span>
                  </div>
                </div>
                <div className="list-subtext" style={{ whiteSpace: 'nowrap' }}>
                  {formatRelativeTime(patrol.startTime)}
                </div>
              </div>
            ))}
        </div>
      </section>

      {toast ? (
        <div className="toast success" role="status" aria-live="polite">
          <div className="toast-badge">
            <CheckCircle2 size={14} />
            Sukses
          </div>
          <p className="toast-title">{toast}</p>
        </div>
      ) : null}
    </div>
  );
}

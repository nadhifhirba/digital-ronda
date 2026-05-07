'use client';

import { useEffect, useMemo, useState } from 'react';
import { BellRing, Clock3, Flame, MapPinned, Route, ShieldAlert, Siren, UsersRound, Radio } from 'lucide-react';
import { useDigitalRondaStore } from '@/lib/store';
import { dateTimeFormatter, formatRelativeTime } from '@/lib/format';

const reportTypeLabel: Record<string, string> = {
  keamanan: 'Keamanan', kebakaran: 'Kebakaran', kecelakaan: 'Kecelakaan', lainnya: 'Lainnya',
};

export default function DashboardPage() {
  const checkpoints = useDigitalRondaStore((state) => state.checkpoints);
  const reports = useDigitalRondaStore((state) => state.reports);
  const patrols = useDigitalRondaStore((state) => state.patrols);
  const raiseEmergency = useDigitalRondaStore((state) => state.raiseEmergency);

  const [panicSeconds, setPanicSeconds] = useState(0);
  const [panicNote, setPanicNote] = useState('Siaga penuh di area permukiman malam ini.');

  useEffect(() => {
    if (panicSeconds <= 0) return;
    const timer = setInterval(() => setPanicSeconds((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(timer);
  }, [panicSeconds > 0]);

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [reports],
  );

  const activePatrols = patrols.filter((p) => p.status === 'aktif');
  const recentReports = sortedReports.slice(0, 4);
  const freshCheckpoints = checkpoints.filter(
    (c) => Date.now() - new Date(c.lastChecked).getTime() < 45 * 60 * 1000,
  );

  return (
    <div className="space-y-5">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[#0F2414] px-4 py-2.5 text-xs border border-[#22C55E]/5">
        <span className="status-indicator">
          <span className="status-dot green" />
          SYSTEM ACTIVE
        </span>
        <span className="text-[#64748B]">|</span>
        <span className="data-mono text-[#94A3B8]">
          {activePatrols.length} PATROLS · {freshCheckpoints.length}/{checkpoints.length} CHECKPOINTS FRESH
        </span>
        <span className="ml-auto data-mono text-[#64748B] uppercase">
          {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
        </span>
      </div>

      {/* Emergency button */}
      <section>
        {panicSeconds > 0 ? (
          <div className="tactical-panel border-[#DC2626]/50 bg-[#1A0A0A] p-6 text-center">
            <Siren size={32} className="mx-auto mb-3 text-[#DC2626]" />
            <p className="data-mono text-xl font-bold text-[#DC2626] uppercase tracking-[0.2em]">PANIC ACTIVE</p>
            <p className="mt-2 data-mono text-3xl text-[#F59E0B]">{panicSeconds}s</p>
            <p className="mt-1 text-xs text-[#94A3B8]">{panicNote}</p>
          </div>
        ) : (
          <button
            onClick={() => {
              raiseEmergency(panicNote);
              setPanicSeconds(30);
            }}
            className="emergency-btn"
          >
            <Siren size={22} />
            AKTIFKAN DARURAT
          </button>
        )}
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Patroli Aktif', value: activePatrols.length, icon: Route, color: '#22C55E' },
          { label: 'Checkpoint Fresh', value: freshCheckpoints.length, icon: MapPinned, color: '#F59E0B' },
          { label: 'Laporan Baru', value: reports.filter(r => r.status === 'baru').length, icon: BellRing, color: '#3B82F6' },
          { label: 'Total Warga', value: '847', icon: UsersRound, color: '#94A3B8' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="tactical-panel p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: stat.color }} />
                <span className="text-[10px] text-[#64748B] uppercase tracking-[0.12em]">{stat.label}</span>
              </div>
              <span className="data-mono text-2xl font-bold text-[#E2E8F0]">{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* Active patrols */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#22C55E]" style={{ fontFamily: "var(--font-rajdhani)" }}>
          <Radio size={14} className="inline mr-2" />
          Active Patrol Routes
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {['Rute Utara', 'Rute Tengah', 'Rute Selatan'].map((route, i) => {
            const isActive = i < activePatrols.length;
            return (
              <div key={route} className={`checkpoint-card ${isActive ? 'border-l-2 border-l-[#22C55E]' : 'border-l-2 border-l-[#64748B]/30'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ fontFamily: "var(--font-rajdhani)" }}>
                    {route}
                  </span>
                  <span className={`status-dot ${isActive ? 'green' : ''}`} style={!isActive ? { background: '#64748B', boxShadow: 'none' } : {}} />
                </div>
                <p className="mt-1 data-mono text-[10px] text-[#64748B]">
                  {isActive ? 'ON PATROL' : 'STANDBY'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent reports */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#F59E0B]" style={{ fontFamily: "var(--font-rajdhani)" }}>
          <BellRing size={14} className="inline mr-2" />
          Recent Reports
        </h2>
        <div className="space-y-2">
          {recentReports.length === 0 ? (
            <div className="tactical-panel p-6 text-center">
              <ShieldAlert size={24} className="mx-auto mb-2 text-[#22C55E]" />
              <p className="data-mono text-xs text-[#64748B]">NO REPORTS — AREA SECURE</p>
            </div>
          ) : (
            recentReports.map((report) => (
              <div key={report.id} className="tactical-panel flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <span className={`status-dot mt-1.5 ${report.status === 'baru' ? 'red' : report.status === 'diproses' ? 'amber' : 'green'}`} />
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-rajdhani)" }}>
                      {reportTypeLabel[report.type] || 'Lainnya'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#94A3B8]">{report.note}</p>
                  </div>
                </div>
                <span className="data-mono shrink-0 text-[10px] text-[#64748B]">
                  {formatRelativeTime(report.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

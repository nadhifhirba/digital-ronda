'use client';

import { create } from 'zustand';

export type ReportType = 'keamanan' | 'kebakaran' | 'kecelakaan' | 'lainnya';
export type ReportStatus = 'baru' | 'diproses' | 'selesai';
export type PatrolStatus = 'aktif' | 'selesai';

export type Checkpoint = {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  lastChecked: string;
  checkedBy: string;
};

export type Report = {
  id: string;
  type: ReportType;
  description: string;
  location: string;
  reportedBy: string;
  timestamp: string;
  status: ReportStatus;
  photoUrl?: string;
};

export type Patrol = {
  id: string;
  officer: string;
  route: string;
  startTime: string;
  status: PatrolStatus;
};

type SubmitReportInput = {
  type: ReportType;
  description: string;
  location: string;
  reportedBy: string;
  photoUrl?: string;
};

type DigitalRondaStore = {
  checkpoints: Checkpoint[];
  reports: Report[];
  patrols: Patrol[];
  submitReport: (input: SubmitReportInput) => Report;
  raiseEmergency: (location: string, officer?: string) => Report;
  startPatrol: (route: string, officer: string) => Patrol;
  finishPatrol: (patrolId: string) => void;
  markCheckpointChecked: (checkpointId: string, checkedBy: string) => void;
};

const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60 * 1000).toISOString();

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

export const initialCheckpoints: Checkpoint[] = [
  {
    id: 'cp-1',
    name: 'Pos Ronda 1',
    location: 'Jl. Melati Raya Blok A',
    lat: -6.2148,
    lng: 106.8454,
    lastChecked: minutesAgo(18),
    checkedBy: 'Budi',
  },
  {
    id: 'cp-2',
    name: 'Pos Ronda 2',
    location: 'Jl. Kenanga 02',
    lat: -6.2162,
    lng: 106.8471,
    lastChecked: minutesAgo(7),
    checkedBy: 'Rizal',
  },
  {
    id: 'cp-3',
    name: 'Pos Ronda 3',
    location: 'Gang Dahlia Timur',
    lat: -6.2181,
    lng: 106.8447,
    lastChecked: minutesAgo(33),
    checkedBy: 'Deni',
  },
  {
    id: 'cp-4',
    name: 'Pos Ronda 4',
    location: 'Perum Cempaka Indah',
    lat: -6.2129,
    lng: 106.8489,
    lastChecked: minutesAgo(12),
    checkedBy: 'Sari',
  },
  {
    id: 'cp-5',
    name: 'Pos Ronda 5',
    location: 'Jl. Mawar Asri Ujung',
    lat: -6.2194,
    lng: 106.8428,
    lastChecked: minutesAgo(24),
    checkedBy: 'Fajar',
  },
];

export const initialReports: Report[] = [
  {
    id: 'rp-1',
    type: 'keamanan',
    description: 'Motor tanpa plat mondar-mandir di sekitar gerbang komplek setelah jam 1 pagi.',
    location: 'Gerbang Utama RW 08',
    reportedBy: 'Rina',
    timestamp: minutesAgo(14),
    status: 'diproses',
  },
  {
    id: 'rp-2',
    type: 'kebakaran',
    description: 'Terlihat percikan dari kabel lampu teras rumah kosong di blok C.',
    location: 'Blok C-12',
    reportedBy: 'Andi',
    timestamp: minutesAgo(41),
    status: 'selesai',
  },
  {
    id: 'rp-3',
    type: 'kecelakaan',
    description: 'Pengendara terpeleset di jalan basah dekat tikungan pos 3.',
    location: 'Tikungan Pos 3',
    reportedBy: 'Maya',
    timestamp: minutesAgo(64),
    status: 'diproses',
  },
  {
    id: 'rp-4',
    type: 'lainnya',
    description: 'Lampu jalan padam di jalur belakang sehingga area terasa gelap.',
    location: 'Jalur Belakang RT 04',
    reportedBy: 'Warga RT 04',
    timestamp: minutesAgo(89),
    status: 'baru',
  },
];

export const initialPatrols: Patrol[] = [
  {
    id: 'pt-1',
    officer: 'Budi & Fajar',
    route: 'Rute Utara: Pos 1 → Pos 3 → Pos 5',
    startTime: minutesAgo(22),
    status: 'aktif',
  },
  {
    id: 'pt-2',
    officer: 'Rizal',
    route: 'Rute Tengah: Pos 2 → Pos 4 → Pos 2',
    startTime: minutesAgo(58),
    status: 'aktif',
  },
  {
    id: 'pt-3',
    officer: 'Sari & Deni',
    route: 'Rute Selatan: Keliling gang timur',
    startTime: minutesAgo(110),
    status: 'selesai',
  },
];

export const patrolRoutes = [
  {
    id: 'route-1',
    name: 'Rute Utara',
    route: 'Pos Ronda 1 → Pos Ronda 3 → Pos Ronda 5',
    distance: '2,8 km',
    duration: '35 menit',
    focus: 'Jalur perumahan padat dan gerbang utama',
  },
  {
    id: 'route-2',
    name: 'Rute Tengah',
    route: 'Pos Ronda 2 → Pos Ronda 4 → Pos Ronda 2',
    distance: '1,9 km',
    duration: '25 menit',
    focus: 'Jalan kecil dan titik lampu jalan',
  },
  {
    id: 'route-3',
    name: 'Rute Selatan',
    route: 'Pos Ronda 5 → Gang Dahlia → Perum Cempaka',
    distance: '3,1 km',
    duration: '40 menit',
    focus: 'Area belakang dan akses sepi',
  },
];

export const useDigitalRondaStore = create<DigitalRondaStore>((set) => ({
  checkpoints: initialCheckpoints,
  reports: initialReports,
  patrols: initialPatrols,
  submitReport: ({ type, description, location, reportedBy, photoUrl }) => {
    const report: Report = {
      id: createId('rp'),
      type,
      description,
      location,
      reportedBy,
      photoUrl,
      timestamp: new Date().toISOString(),
      status: 'baru',
    };

    set((state) => ({ reports: [report, ...state.reports] }));
    return report;
  },
  raiseEmergency: (location, officer = 'Sistem Panic') => {
    const report: Report = {
      id: createId('panic'),
      type: 'keamanan',
      description: 'Tombol panik ditekan. Mohon respons cepat ke lokasi warga.',
      location,
      reportedBy: officer,
      timestamp: new Date().toISOString(),
      status: 'baru',
    };

    set((state) => ({ reports: [report, ...state.reports] }));
    return report;
  },
  startPatrol: (route, officer) => {
    const patrol: Patrol = {
      id: createId('pt'),
      officer,
      route,
      startTime: new Date().toISOString(),
      status: 'aktif',
    };

    set((state) => ({ patrols: [patrol, ...state.patrols] }));
    return patrol;
  },
  finishPatrol: (patrolId) => {
    set((state) => ({
      patrols: state.patrols.map((patrol) =>
        patrol.id === patrolId ? { ...patrol, status: 'selesai' } : patrol,
      ),
    }));
  },
  markCheckpointChecked: (checkpointId, checkedBy) => {
    set((state) => ({
      checkpoints: state.checkpoints.map((checkpoint) =>
        checkpoint.id === checkpointId
          ? { ...checkpoint, checkedBy, lastChecked: new Date().toISOString() }
          : checkpoint,
      ),
    }));
  },
}));

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'DIGITAL_RONDA',
  description: 'Digital Ronda (Kentongan Modern) - community safety system untuk patroli, laporan, dan alert warga.',
};

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/patroli', label: 'Patroli' },
  { href: '/lapor', label: 'Lapor' },
  { href: '/komunitas', label: 'Komunitas' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand-row">
              <div className="brand-mark">DR</div>
              <div className="brand-copy">
                <p className="eyebrow">Kentongan modern untuk warga siaga</p>
                <h1 className="brand-title">DIGITAL_RONDA</h1>
              </div>
            </div>
            <nav className="nav-row" aria-label="Navigasi utama">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="page-stack">{children}</main>
        </div>
      </body>
    </html>
  );
}

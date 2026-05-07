import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Rajdhani, Share_Tech_Mono } from 'next/font/google';
import { Shield } from 'lucide-react';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani', display: 'swap',
});

const shareTech = Share_Tech_Mono({
  subsets: ['latin'], weight: ['400'],
  variable: '--font-share-tech', display: 'swap',
});

export const metadata: Metadata = {
  title: 'DIGITAL_RONDA — Community Security System',
  description: 'Kentongan modern. Patroli, laporan, dan alert warga real-time.',
};

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/patroli', label: 'Patroli' },
  { href: '/lapor', label: 'Lapor' },
  { href: '/komunitas', label: 'Komunitas' },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${rajdhani.variable} ${shareTech.variable}`}>
        <div className="radar-bg min-h-screen">
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-5 sm:py-4">
            <header className="sticky top-2 z-40 mb-5 flex flex-col gap-3 rounded-lg border border-[#22C55E]/10 bg-[#0F2414]/95 px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-[#22C55E]/15 text-[#22C55E]">
                  <Shield size={18} />
                </div>
                <div>
                  <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E2E8F0]" style={{ fontFamily: "var(--font-rajdhani)" }}>
                    DIGITAL<span className="text-[#22C55E]">_RONDA</span>
                  </h1>
                  <p className="text-[9px] text-[#64748B] uppercase tracking-[0.25em]">Community Security System</p>
                </div>
              </Link>
              <nav className="flex flex-wrap gap-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded px-3 py-1.5 text-xs font-semibold text-[#94A3B8] transition-all hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

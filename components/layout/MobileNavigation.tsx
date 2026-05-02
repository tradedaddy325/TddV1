'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Lock, Radio, Plus, MoreHorizontal } from 'lucide-react';

export default function MobileNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/vault', icon: Lock, label: 'Vault' },
    { href: '/journal', icon: Plus, label: 'Journal', isCenter: true },
    { href: '/signals', icon: Radio, label: 'Signals' },
    { href: '/profile', icon: MoreHorizontal, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 px-4 pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-8"
                >
                  <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition ${
                  isActive
                    ? 'text-emerald-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

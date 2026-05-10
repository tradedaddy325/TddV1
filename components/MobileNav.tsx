"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  Lock,
  Plus,
  User,
  Grid,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

interface MobileNavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isCenter?: boolean;
}

/**
 * Mobile Navigation Items
 * Layout: Dashboard | Signals | +AddTrade | Profile
 * 
 * Matches the design from IMG_9602.jpg:
 * - Grid icon (Dashboard)
 * - TrendingUp icon (Signals) 
 * - + button centered and highlighted (Add Trade)
 * - Three dots (Profile/More)
 */
const navItems: MobileNavItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: TrendingUp,
    label: "Signals",
    href: "/signals",
  },
  {
    icon: Plus,
    label: "Add Trade",
    href: "/journal",
    isCenter: true,
  },
  {
    icon: MoreVertical,
    label: "Profile",
    href: "/profile",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleCenterButtonClick = () => {
    router.push("/journal");
  };

  return (
    <>
      {/* Mobile-only bottom nav - hidden on desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50">
        <nav className="flex items-center justify-around h-24 px-2 relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            // Center button (Add Trade)
            if (item.isCenter) {
              return (
                <div key={item.label} className="flex-1 flex justify-center">
                  <button
                    onClick={handleCenterButtonClick}
                    className="relative flex flex-col items-center justify-center -mt-6 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl hover:shadow-2xl hover:shadow-green-500/50 transition-all active:scale-95 z-40"
                    title={item.label}
                    aria-label={item.label}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              );
            }

            // Regular nav items
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors relative ${
                  isActive
                    ? "text-green-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon 
                  className={`w-6 h-6 transition-all ${
                    isActive ? "fill-current scale-110" : ""
                  }`}
                  strokeWidth={isActive ? 3 : 2}
                />
                <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  isActive ? "text-green-400" : "text-gray-400"
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-1 bg-green-400 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Padding for mobile nav - increased for center button */}
      <div className="md:hidden h-24" />
    </>
  );
}

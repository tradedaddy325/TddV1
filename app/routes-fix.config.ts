/**
 * Route Fixes Configuration
 * Maps broken Quick Access routes to correct paths
 */
export const ROUTE_FIXES = {
  // Original broken routes → Fixed routes
  '/traders-talk': '/chatbot',  // Renamed from Traders Talk Room
  '/market-psychology': '/dashboard/market-psychology',
  '/predictive-markets': '/dashboard/predictive-markets',
  '/terminal': '/dashboard/terminal',
  '/portfolio': '/dashboard/portfolio',
  '/education': '/vault/education',  // Premium feature
  '/signals': '/signals',
  '/journal': '/journal',
  '/chatbot': '/chatbot',  // Trade Daddy Chatbot
  '/support': '/profile/support',
};

export const PREMIUM_ROUTES = [
  '/vault',
  '/vault/education',
  '/vault/advanced-tools',
  '/vault/premium-signals',
];

// Validate if route requires premium access
export function requiresPremium(pathname: string): boolean {
  return PREMIUM_ROUTES.some(route => pathname.startsWith(route));
}

// Get corrected route
export function getFixedRoute(pathname: string): string {
  return ROUTE_FIXES[pathname as keyof typeof ROUTE_FIXES] || pathname;
}

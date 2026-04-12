export function useFeatureAccess(userId: string, feature: string) {
  return {
    unlocked: true,
    loading: false,
    creditsAvailable: 100,
    creditsRequired: 33,
    message: "Access granted",
    expiresAt: null,
    unlock: () => {},
    renew: () => {},
  };
}

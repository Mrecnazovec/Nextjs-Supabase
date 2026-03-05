export const CACHE_TAGS = {
  dashboardEmailByUser: (userId: string) => `dashboard-email:${userId}`,
} as const;

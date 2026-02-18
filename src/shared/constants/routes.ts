export const ROUTES = {
  home: '/',
  about: '/about',
  guide: '/guide',
  publications: '/publications',
  externalResources: '/external-resources',
  support: '/support',
  profile: '/profile',
  downloadHistory: '/download-history',
  statistics: '/statistics',
  adminPanel: '/admin',
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
  },
  errors: {
    accessDenied: '/401',
    notFound: '/404',
  },
} as const;

export type AppRouteKey = keyof typeof ROUTES;

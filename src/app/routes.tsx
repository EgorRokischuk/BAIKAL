import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { MainLayout } from './layout/MainLayout';
import { AuthPageLayout } from './layout/AuthPageLayout';
import { RequireAdmin, RequireAuth, RequireGuest } from './routes.guards';
import { ROUTES } from '@/shared/constants/routes';
import { RouteSkeleton } from '@/shared/ui/feedback/RouteSkeleton';

const MapPage = lazy(() => import('@/modules/map/ui/MapPage').then((module) => ({ default: module.MapPage })));
const GuidePage = lazy(() => import('@/modules/guide/GuidePage').then((module) => ({ default: module.GuidePage })));
const PublicationsPage = lazy(() =>
  import('@/modules/publications/ui/PublicationsPage').then((module) => ({ default: module.PublicationsPage })),
);
const ExternalResourcesPage = lazy(() =>
  import('@/modules/external-resources/ui/ExternalResourcesPage').then((module) => ({ default: module.ExternalResourcesPage })),
);
const SupportPage = lazy(() => import('@/modules/support/ui/SupportPage').then((module) => ({ default: module.SupportPage })));
const ProfilePage = lazy(() => import('@/modules/auth/ui/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const DownloadHistoryPage = lazy(() =>
  import('@/modules/auth/ui/DownloadHistoryPage').then((module) => ({ default: module.DownloadHistoryPage })),
);
const AdminPanelPage = lazy(() =>
  import('@/modules/admin/ui/AdminPanelPage').then((module) => ({ default: module.AdminPanelPage })),
);
const AboutPage = lazy(() => import('@/modules/about/ui/AboutPage').then((module) => ({ default: module.AboutPage })));
const LoginPage = lazy(() => import('@/modules/auth/ui/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/modules/auth/ui/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const NotFoundPage = lazy(() =>
  import('@/modules/system/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);
const AccessDeniedPage = lazy(() =>
  import('@/modules/system/AccessDeniedPage').then((module) => ({ default: module.AccessDeniedPage })),
);

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<RouteSkeleton />}>
    {node}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: withSuspense(<MapPage />) },
          { path: ROUTES.about, element: withSuspense(<AboutPage />) },
          { path: ROUTES.guide, element: withSuspense(<GuidePage />) },
          { path: ROUTES.publications, element: withSuspense(<PublicationsPage />) },
          { path: ROUTES.externalResources, element: withSuspense(<ExternalResourcesPage />) },
          {
            path: ROUTES.profile,
            element: <RequireAuth>{withSuspense(<ProfilePage />)}</RequireAuth>,
          },
          {
            path: ROUTES.support,
            element: <RequireAuth>{withSuspense(<SupportPage />)}</RequireAuth>,
          },
          {
            path: ROUTES.downloadHistory,
            element: <RequireAuth>{withSuspense(<DownloadHistoryPage />)}</RequireAuth>,
          },
          {
            path: ROUTES.adminPanel,
            element: <RequireAdmin>{withSuspense(<AdminPanelPage />)}</RequireAdmin>,
          },
          { path: ROUTES.errors.accessDenied, element: withSuspense(<AccessDeniedPage />) },
          { path: ROUTES.errors.notFound, element: withSuspense(<NotFoundPage />) },
        ],
      },
      {
        path: ROUTES.auth.root,
        element: (
          <RequireGuest>
            <AuthPageLayout />
          </RequireGuest>
        ),
        children: [
          { path: 'login', element: withSuspense(<LoginPage />) },
          { path: 'register', element: withSuspense(<RegisterPage />) },
        ],
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
]);

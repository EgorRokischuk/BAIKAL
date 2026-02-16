import { Outlet } from 'react-router-dom';
import { AppShell } from '@/shared/ui/layout/AppShell';
import { ROUTES } from '@/shared/constants/routes';

const navItems = [
  { label: 'Продукты и данные', to: ROUTES.home },
  { label: 'Руководство', to: ROUTES.guide },
  { label: 'Публикации', to: ROUTES.publications },
  { label: 'Внешние ресурсы', to: ROUTES.externalResources },
  { label: 'О проекте', to: ROUTES.about },
];

export const MainLayout = () => {
  return (
    <AppShell navItems={navItems}>
      <Outlet />
    </AppShell>
  );
};

import { Box, Typography } from '@mui/material';
import type { ComponentProps } from 'react';
import { env } from '@/shared/config/env';
import { UserMenu } from '@/modules/auth/ui/UserMenu';
import { SideNav } from './SideNav';
import styles from './TopHeader.module.scss';

interface TopHeaderProps {
  navItems: ComponentProps<typeof SideNav>['items'];
}

export const TopHeader = ({ navItems }: TopHeaderProps) => {
  return (
    <header className={styles.shell}>
      <a className={styles.logo} href={env.organizationUrl} aria-label="Перейти на сайт ФИЦ ИВТ">
        <img src="/logo.png" alt="Логотип ФИЦ ИВТ" />
      </a>

      <Box className={styles.titleBlock}>
        <Typography variant="h1">Информационная система Байкал</Typography>
      </Box>

      <div className={styles.navWrap}>
        <SideNav items={navItems} />
      </div>

      <div className={styles.userWrap}>
        <UserMenu />
      </div>
    </header>
  );
};

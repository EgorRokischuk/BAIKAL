import { Box, Container } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';
import { TopHeader } from './TopHeader';
import { GlobalSnackbar } from '../feedback/GlobalSnackbar';
import styles from './AppShell.module.scss';

interface AppShellProps extends PropsWithChildren {
  navItems: { label: string; to: string }[];
  rightPanel?: ReactNode;
}

export const AppShell = ({ navItems, rightPanel, children }: AppShellProps) => {
  return (
    <Box className={styles.page}>
      <TopHeader navItems={navItems} />

      <Container
        maxWidth={false}
        disableGutters
        className={`${styles.mainWrap} ${rightPanel ? styles.mainWrapWithAside : ''}`}
      >
        <main className={styles.main}>{children}</main>
        {rightPanel && <aside className={styles.aside}>{rightPanel}</aside>}
      </Container>

      <GlobalSnackbar />
    </Box>
  );
};

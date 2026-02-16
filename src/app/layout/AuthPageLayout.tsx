import { Box, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { GlobalSnackbar } from '@/shared/ui/feedback/GlobalSnackbar';
import styles from './AuthPageLayout.module.scss';

export const AuthPageLayout = () => {
  return (
    <Box className={styles.page}>
      <Paper className={styles.card}>
        <Outlet />
      </Paper>
      <GlobalSnackbar />
    </Box>
  );
};

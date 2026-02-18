import { Box, Typography } from '@mui/material';
import { DownloadStatisticsBuilder } from './DownloadStatisticsBuilder';
import styles from './StatisticsPage.module.scss';

export const StatisticsPage = () => {
  return (
    <Box className={styles.page}>
      <Typography className={styles.pageTitle} variant="h2">
        Статистика
      </Typography>
      <DownloadStatisticsBuilder />
    </Box>
  );
};

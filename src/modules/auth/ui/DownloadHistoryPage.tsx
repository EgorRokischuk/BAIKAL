import { Box, Paper, Typography } from '@mui/material';
import styles from './DownloadHistoryPage.module.scss';

interface DownloadHistoryItem {
  id: number;
  date: string;
  product: string;
  period: string;
  format: string;
  size: string;
}

const MOCK_DOWNLOAD_HISTORY: DownloadHistoryItem[] = [
  {
    id: 1,
    date: '2026-02-14 18:22',
    product: 'Температура поверхности (VIIRS)',
    period: '2025-07',
    format: 'GeoTIFF',
    size: '58 MB',
  },
  {
    id: 2,
    date: '2026-02-12 09:40',
    product: 'Температура поверхности (MODIS Terra)',
    period: '2025-12',
    format: 'GeoTIFF',
    size: '61 MB',
  },
  {
    id: 3,
    date: '2026-02-08 14:07',
    product: 'Хлорофилл (Sentinel-2)',
    period: '08',
    format: 'GeoTIFF',
    size: '21 MB',
  },
  {
    id: 4,
    date: '2026-02-03 11:31',
    product: 'Landsat LST',
    period: '2024-08-15',
    format: 'GeoTIFF',
    size: '93 MB',
  },
  {
    id: 5,
    date: '2026-01-28 20:03',
    product: 'Среднемесячное многолетнее (Aqua)',
    period: '01',
    format: 'GeoTIFF',
    size: '49 MB',
  },
];

export const DownloadHistoryPage = () => {
  return (
    <Box className={styles.page}>
      <Paper className={styles.card}>
        <Typography variant="h2">История скачиваний</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
          Пока используется моковая история. После добавления методов бэка данные будут загружаться с сервера.
        </Typography>

        <Box className={styles.historyWrap}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Продукт</th>
                <th>Период</th>
                <th>Формат</th>
                <th>Размер</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DOWNLOAD_HISTORY.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.product}</td>
                  <td>{item.period}</td>
                  <td>{item.format}</td>
                  <td>{item.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
};

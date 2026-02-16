import { Box, Paper, Stack, Typography } from '@mui/material';
import { env } from '@/shared/config/env';
import { useGetAboutRecordsQuery } from '@/modules/about/aboutApi';
import styles from './AboutPage.module.scss';

export const AboutPage = () => {
  const { data: records = [], isFetching } = useGetAboutRecordsQuery();

  return (
    <Box className={styles.page}>
      <Paper className={styles.hero}>
        <span className={styles.heroBadge}>Информационная система</span>
        <Typography variant="h2">О проекте «Байкал»</Typography>
        <Typography variant="body1" className={styles.heroText}>
          Платформа объединяет спутниковые и наземные наблюдения акватории озера Байкал, чтобы
          поддерживать научный анализ, визуализацию и работу с геопространственными продуктами.
        </Typography>
        <a href={env.organizationUrl} target="_blank" rel="noreferrer" className={styles.link}>
          Сайт ФИЦ ИВТ: {env.organizationUrl}
        </a>
      </Paper>

      <Paper className={styles.content}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={styles.headingRow}>
          <Typography variant="h3">Материалы раздела</Typography>
          <span className={styles.counter}>Записей: {records.length}</span>
        </Stack>

        {isFetching && <Typography color="text.secondary">Загрузка...</Typography>}

        {!isFetching && !records.length && (
          <Typography color="text.secondary">Записи пока отсутствуют.</Typography>
        )}

        {!!records.length && (
          <div className={styles.records}>
            {records.map((item, index) => (
              <Paper key={item.id} className={styles.record}>
                <div className={styles.recordIndex}>{String(index + 1).padStart(2, '0')}</div>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </div>
        )}
      </Paper>
    </Box>
  );
};

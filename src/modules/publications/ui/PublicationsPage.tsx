import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState, type KeyboardEvent } from 'react';
import { env } from '@/shared/config/env';
import { useGetPublicationsQuery } from '@/modules/publications/publicationsApi';
import { MOCK_PUBLICATIONS } from '@/modules/publications/model/mockPublications';
import styles from './PublicationsPage.module.scss';

const normalizeText = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .trim();

export const PublicationsPage = () => {
  const [search, setSearch] = useState('');

  const { data = [], isFetching } = useGetPublicationsQuery(search || undefined, {
    skip: env.useMocks,
  });

  const sourcePublications = env.useMocks ? MOCK_PUBLICATIONS : data;

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sourcePublications
      .map((item, index) => ({
        ...item,
        index: index + 1,
        normalized: normalizeText(`${item.title} ${item.authors} ${item.description}`).toLowerCase(),
      }))
      .filter((item) => !normalizedSearch || item.normalized.includes(normalizedSearch));
  }, [search, sourcePublications]);

  const openPublication = (title: string, url?: string) => {
    window.open(url || `https://www.google.com/search?q=${encodeURIComponent(title)}`, '_blank');
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, title: string, url?: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPublication(title, url);
    }
  };

  return (
    <Box className={styles.page}>
      <Paper className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.headCellTitle}>
                <Typography variant="h2" className={styles.title}>
                  Публикации
                </Typography>
                <Typography className={styles.subtitle}>
                  Подборка публикаций по спутниковому мониторингу и исследованию озера Байкал.
                </Typography>
              </th>
              <th className={styles.headCellSearch}>
                <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  size="small"
                  placeholder="Поиск по публикациям"
                  className={styles.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: 'rgba(230, 241, 255, 0.92)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" spacing={0.7} className={styles.metaRow}>
                  <span className={styles.metaBadge}>Всего: {sourcePublications.length}</span>
                  <span className={styles.metaBadge}>Показано: {filtered.length}</span>
                </Stack>
              </th>
            </tr>
          </thead>

          <tbody className={styles.tableBody}>
            {isFetching && (
              <tr>
                <td colSpan={2} className={styles.emptyCell}>
                  Загрузка публикаций...
                </td>
              </tr>
            )}

            {!isFetching && !filtered.length && (
              <tr>
                <td colSpan={2} className={styles.emptyCell}>
                  Публикации не найдены
                </td>
              </tr>
            )}

            {!isFetching &&
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className={styles.tableRow}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPublication(item.title, item.url)}
                  onKeyDown={(event) => handleRowKeyDown(event, item.title, item.url)}
                >
                  <td className={styles.tableCell} colSpan={2}>
                    <div className={styles.tableCellContent}>
                      <span className={styles.tableIndex}>
                        {String(item.index).padStart(2, '0')}
                      </span>

                      <div className={styles.tableText}>
                        <Typography className={styles.itemTitle}>{item.title}</Typography>
                        {Boolean(item.authors) && (
                          <Typography className={styles.itemAuthors}>{item.authors}</Typography>
                        )}
                        {Boolean(item.description) && (
                          <Typography className={styles.itemDescription}>{item.description}</Typography>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};


import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { env } from '@/shared/config/env';
import { useGetExternalResourcesQuery } from '@/modules/external-resources/externalResourcesApi';
import { MOCK_EXTERNAL_RESOURCES } from '@/modules/external-resources/model/mockExternalResources';
import styles from './ExternalResourcesPage.module.scss';

const fallbackImageByIndex = (index: number) =>
  `/mock/external-resources/resource-${String((index % 10) + 1).padStart(2, '0')}.svg`;

type CarouselCardPosition = 'farLeft' | 'left' | 'center' | 'right' | 'farRight';

interface CarouselCardModel {
  position: CarouselCardPosition;
  resourceIndex: number;
}

const getRelativeDistance = (index: number, active: number, length: number) => {
  if (!length) {
    return 0;
  }

  const forward = (index - active + length) % length;
  const backward = (active - index + length) % length;
  return forward <= backward ? forward : -backward;
};

export const ExternalResourcesPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data = [], isFetching } = useGetExternalResourcesQuery(
    { page: 1, limit: 200 },
    { skip: env.useMocks },
  );

  const resources = useMemo(() => {
    if (env.useMocks) {
      return MOCK_EXTERNAL_RESOURCES;
    }

    return data.map((item, index) => ({
      ...item,
      imageUrl: item.imageUrl || fallbackImageByIndex(index),
    }));
  }, [data]);

  useEffect(() => {
    if (!resources.length) {
      if (activeIndex !== 0) {
        setActiveIndex(0);
      }
      return;
    }

    if (activeIndex >= resources.length) {
      setActiveIndex(resources.length - 1);
    }
  }, [activeIndex, resources.length]);

  const carouselCards = useMemo<CarouselCardModel[]>(() => {
    if (!resources.length) {
      return [];
    }

    return resources
      .map((_, resourceIndex) => {
        const distance = getRelativeDistance(resourceIndex, activeIndex, resources.length);

        if (distance < -2 || distance > 2) {
          return null;
        }

        let position: CarouselCardPosition = 'center';
        if (distance === -2) position = 'farLeft';
        else if (distance === -1) position = 'left';
        else if (distance === 1) position = 'right';
        else if (distance === 2) position = 'farRight';

        return { position, resourceIndex, distance };
      })
      .filter((item): item is CarouselCardModel & { distance: number } => item !== null)
      .sort((a, b) => a.distance - b.distance)
      .map(({ position, resourceIndex }) => ({ position, resourceIndex }));
  }, [activeIndex, resources]);

  const goToPrev = () => {
    if (!resources.length) return;
    setActiveIndex((prev) => (prev - 1 + resources.length) % resources.length);
  };

  const goToNext = () => {
    if (!resources.length) return;
    setActiveIndex((prev) => (prev + 1) % resources.length);
  };

  const onOpenResource = (index: number) => {
    const resource = resources[index];
    if (!resource) return;

    window.open(resource.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box className={styles.page}>
      <Paper className={styles.panel}>
        <Box className={styles.header}>
          <Typography variant="h2" className={styles.title}>
            Внешние ресурсы
          </Typography>
          <Typography variant="body2" color="text.secondary" className={styles.subtitle}>
            Карусель тематических порталов и сервисов по озеру Байкал.
          </Typography>
          <span className={styles.counter}>Ресурсов: {resources.length}</span>
        </Box>

        {isFetching && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Загрузка ресурсов...
          </Typography>
        )}

        {!isFetching && !resources.length && (
          <Box className={styles.emptyState}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Ресурсы отсутствуют
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Список внешних ресурсов будет отображен после загрузки данных.
            </Typography>
          </Box>
        )}

        {!isFetching && resources.length > 0 && (
          <Box className={styles.slider}>
            <div className={styles.carousel}>
              {carouselCards.map((card) => {
                const resource = resources[card.resourceIndex];
                if (!resource) return null;

                const positionClass =
                  card.position === 'center'
                    ? styles.cardCenter
                    : card.position === 'left'
                      ? styles.cardLeft
                      : card.position === 'right'
                        ? styles.cardRight
                        : card.position === 'farLeft'
                          ? styles.cardFarLeft
                          : styles.cardFarRight;

                return (
                  <button
                    key={`${resource.id}-${card.resourceIndex}`}
                    type="button"
                    className={`${styles.card} ${positionClass}`}
                    onClick={() => onOpenResource(card.resourceIndex)}
                    onDragStart={(event) => event.preventDefault()}
                    draggable={false}
                    aria-label={`Открыть ресурс: ${resource.title}`}
                  >
                    <img
                      src={resource.imageUrl || fallbackImageByIndex(card.resourceIndex)}
                      alt={resource.title}
                      className={styles.cardImage}
                      onDragStart={(event) => event.preventDefault()}
                      draggable={false}
                    />

                    <div className={styles.cardOverlay}>
                      <Typography className={styles.cardTitle}>{resource.title}</Typography>
                      <Typography className={styles.cardLink}>{resource.link}</Typography>
                    </div>
                  </button>
                );
              })}
            </div>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={styles.controls}
            >
              <IconButton
                className={styles.navButton}
                aria-label="Предыдущий ресурс"
                onClick={goToPrev}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>

              <Typography className={styles.positionLabel}>
                {activeIndex + 1} / {resources.length}
              </Typography>

              <IconButton className={styles.navButton} aria-label="Следующий ресурс" onClick={goToNext}>
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

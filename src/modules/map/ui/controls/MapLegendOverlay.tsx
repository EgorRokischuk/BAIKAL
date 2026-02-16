import { Box, Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { selectLegend, selectTileOptions } from '@/store/slices/mapSelectors';
import styles from './MapLegendOverlay.module.scss';

const LST_GRADIENT = [
  '#070038',
  '#0a0049',
  '#0f0047',
  '#140060',
  '#1a0080',
  '#003399',
  '#0066cc',
  '#0099ff',
  '#00ccff',
  '#00ffff',
  '#33ff99',
  '#99ff33',
  '#ccff00',
  '#ffff00',
  '#ffcc00',
  '#ff9900',
  '#ff6600',
  '#ff3300',
  '#800000',
  '#6e0000',
  '#330000',
];

const CHL_GRADIENT = ['#e5f9e7', '#b7e4c7', '#74c69d', '#40916c', '#1b4332'];

const formatLegendValue = (value: number) => {
  if (Math.abs(value) < 1) {
    return value.toFixed(2);
  }

  return value.toFixed(1);
};

export const MapLegendOverlay = () => {
  const legend = useAppSelector(selectLegend);
  const tileOptions = useAppSelector(selectTileOptions);

  if (!legend.visible || legend.min === null || legend.max === null) {
    return null;
  }

  const gradient = tileOptions.parameter === 'chlorophyll' ? CHL_GRADIENT : LST_GRADIENT;
  const gradientStyle = {
    background: `linear-gradient(180deg, ${gradient.join(', ')})`,
  };

  return (
    <Box className={styles.legend}>
      <Box className={styles.scale}>
        <Typography variant="caption" className={styles.valueTop}>
          {formatLegendValue(legend.max)}
        </Typography>

        <Box className={styles.gradient} style={gradientStyle} />

        <Typography variant="caption" className={styles.valueBottom}>
          {formatLegendValue(legend.min)}
        </Typography>
      </Box>
    </Box>
  );
};

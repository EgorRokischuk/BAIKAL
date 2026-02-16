import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Stack } from '@mui/material';
import { useMap, useMapEvent } from 'react-leaflet';
import { useAppDispatch } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import styles from './ZoomButtons.module.scss';

interface ZoomButtonsProps {
  disabled?: boolean;
}

export const ZoomButtons = ({ disabled = false }: ZoomButtonsProps) => {
  const dispatch = useAppDispatch();
  const map = useMap();

  useMapEvent('zoomend', () => {
    dispatch(mapActions.setZoom(map.getZoom()));
  });

  const handleZoom = (delta: number) => {
    if (disabled) return;

    const nextZoom = map.getZoom() + delta;
    map.setZoom(nextZoom);
    dispatch(mapActions.setZoom(nextZoom));
  };

  return (
    <Stack className={`${styles.block} ${disabled ? styles.disabled : ''}`} spacing={0.5}>
      <IconButton size="small" onClick={() => handleZoom(1)} disabled={disabled}>
        <AddIcon />
      </IconButton>
      <IconButton size="small" onClick={() => handleZoom(-1)} disabled={disabled}>
        <RemoveIcon />
      </IconButton>
    </Stack>
  );
};

import { Box } from '@mui/material';
import { useMapEvent } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mapActions } from '@/store/slices/mapSlice';
import { selectMapLocation } from '@/store/slices/mapSelectors';
import { toDms } from '@/shared/lib/location';
import styles from './CoordinatesOverlay.module.scss';

export const CoordinatesOverlay = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectMapLocation);

  useMapEvent('mousemove', ({ latlng }) => {
    dispatch(mapActions.setLocation({ lat: latlng.lat, lng: latlng.lng }));
  });

  return (
    <Box className={styles.block}>
      <span>{toDms(location.lat, false)}</span>
      <span>{toDms(location.lng, true)}</span>
    </Box>
  );
};

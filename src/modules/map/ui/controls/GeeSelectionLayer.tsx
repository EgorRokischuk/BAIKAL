import { useMapEvent } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { geeActions } from '@/store/slices/geeSlice';
import { selectGeeType } from '@/store/slices/geeSelectors';
import { selectIsLoading } from '@/store/slices/appSelectors';
import { selectTileOptionByKey } from '@/store/slices/mapSelectors';

export const GeeSelectionLayer = () => {
  const dispatch = useAppDispatch();
  const geeType = useAppSelector(selectGeeType);
  const isLoading = useAppSelector(selectIsLoading);
  const productType = useAppSelector(selectTileOptionByKey('productType'));

  useMapEvent('click', ({ latlng }) => {
    if (productType !== 'gee' || isLoading) return;

    if (geeType === 'point') {
      dispatch(geeActions.setPoint({ lat: latlng.lat, lng: latlng.lng }));
    } else {
      dispatch(geeActions.appendShapePoint({ lat: latlng.lat, lng: latlng.lng }));
    }
  });

  return null;
};

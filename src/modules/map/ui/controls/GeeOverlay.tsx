import L from 'leaflet';
import { Marker, Polygon, Popup } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectGee } from '@/store/slices/geeSelectors';
import { geeActions } from '@/store/slices/geeSlice';
import { selectTileOptionByKey } from '@/store/slices/mapSelectors';
import { toDms } from '@/shared/lib/location';
import redPoint from '@/modules/map/data/redpoint.png';

const pointIcon = L.icon({
  iconUrl: redPoint,
  iconSize: [10, 10],
});

export const GeeOverlay = () => {
  const dispatch = useAppDispatch();
  const gee = useAppSelector(selectGee);
  const productType = useAppSelector(selectTileOptionByKey('productType'));

  if (productType !== 'gee') {
    return null;
  }

  return (
    <>
      {gee.shape.length > 0 && <Polygon pathOptions={{ color: '#1f4f93' }} positions={gee.shape} />}

      {gee.point.length === 2 && (
        <>
          <Marker position={{ lat: gee.point[0], lng: gee.point[1] }} icon={pointIcon} />

          {typeof gee.value === 'number' && (
            <Popup
              position={{ lat: gee.point[0], lng: gee.point[1] }}
              eventHandlers={{
                remove: () => dispatch(geeActions.clearPoint()),
              }}
            >
              {`Lat: ${toDms(gee.point[0], false)}`}
              <br />
              {`Lon: ${toDms(gee.point[1], true)}`}
              <br />
              {`Value: ${gee.value.toFixed(2)}`}
            </Popup>
          )}
        </>
      )}
    </>
  );
};

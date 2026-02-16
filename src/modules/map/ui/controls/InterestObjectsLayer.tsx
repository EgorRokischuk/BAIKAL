import { latLngBounds } from 'leaflet';
import { Polygon, Tooltip, useMap } from 'react-leaflet';
import { useAppSelector } from '@/store/hooks';
import { selectMapZoom } from '@/store/slices/mapSelectors';
import { INTEREST_OBJECTS } from '@/modules/map/data/interestObjects';

const defaultPathOptions = {
  color: '#4b5563',
  opacity: 0.75,
  weight: 1.75,
  fillOpacity: 0,
};

export const InterestObjectsLayer = () => {
  const map = useMap();
  const zoom = useAppSelector(selectMapZoom);

  return (
    <>
      {INTEREST_OBJECTS.filter((object) => zoom <= object.visibilityMaxZoom).map((object) => {
        const bounds = latLngBounds(object.polygon);

        return (
          <Polygon
            key={object.id}
            positions={object.polygon}
            pathOptions={defaultPathOptions}
            eventHandlers={{
              click: () => {
                map.fitBounds(bounds, {
                  padding: [24, 24],
                  maxZoom: object.focusMaxZoom ?? 9,
                });
              },
            }}
          >
            <Tooltip sticky direction="center">
              {object.name}
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};

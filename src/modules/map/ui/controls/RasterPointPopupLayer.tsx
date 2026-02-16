import { useState } from 'react';
import { Popup, useMapEvent } from 'react-leaflet';
import { useAppSelector } from '@/store/hooks';
import {
  selectTileLink,
  selectTileOptionByKey,
  selectTileOptions,
} from '@/store/slices/mapSelectors';
import {
  useGetLandsatPointMutation,
  useGetMonthlyAvgManyYearsPointMutation,
  useGetMonthlyAvgPointMutation,
} from '@/modules/map/mapApi';
import {
  mapLandsatParams,
  mapMonthlyAvgManyYearsParams,
  mapMonthlyAvgParams,
} from '@/modules/map/model/mappers';
import { toDms } from '@/shared/lib/location';

export const RasterPointPopupLayer = () => {
  const tileLink = useAppSelector(selectTileLink);
  const tileOptions = useAppSelector(selectTileOptions);
  const productType = useAppSelector(selectTileOptionByKey('productType'));

  const [location, setLocation] = useState<[number, number] | null>(null);
  const [value, setValue] = useState('');

  const [getLandsatPoint, landsatState] = useGetLandsatPointMutation();
  const [getMonthlyAvgPoint, monthlyState] = useGetMonthlyAvgPointMutation();
  const [getMonthlyAvgManyYearsPoint, monthlyManyYearsState] =
    useGetMonthlyAvgManyYearsPointMutation();

  const isLoading = landsatState.isLoading || monthlyState.isLoading || monthlyManyYearsState.isLoading;

  useMapEvent('click', async ({ latlng }) => {
    if (!tileLink || productType !== 'baikalRiver') return;

    const point: [number, number] = [latlng.lat, latlng.lng];
    setLocation(point);

    let response: { data?: string } | null = null;

    switch (tileOptions.type) {
      case 'landsat':
        response = await getLandsatPoint({
          ...mapLandsatParams(tileOptions),
          lat: point[0],
          lon: point[1],
        });
        break;
      case 'monthlyAvg':
        response = await getMonthlyAvgPoint({
          ...mapMonthlyAvgParams(tileOptions),
          lat: point[0],
          lon: point[1],
        });
        break;
      case 'monthlyAvgManyYears':
        response = await getMonthlyAvgManyYearsPoint({
          ...mapMonthlyAvgManyYearsParams(tileOptions),
          lat: point[0],
          lon: point[1],
        });
        break;
      default:
        response = null;
    }

    setValue(String(response?.data ?? ''));
  });

  if (!location || !value || isLoading) return null;

  return (
    <Popup position={location}>
      {`Широта: ${toDms(location[0], false)}`}
      <br />
      {`Долгота: ${toDms(location[1], true)}`}
      <br />
      {`Значение: ${value}`}
    </Popup>
  );
};

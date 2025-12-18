import { useEffect, useMemo } from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { getTileOptionByKey, getTileOptions } from '../../../model/selectors';
import { mapActions } from '../../../model/slices';
import { useGetMonthlyAvgDatesQuery, useGetMonthlyAvgManyYearsDatesQuery } from '../../../api/mapApi';
import { deviceDictionary, parameterDictionary, photoTimeDictionary, typeDictionary } from '../../../config/dictionaries';
import * as s from './RadioDayNight.module.scss';

type PhotoTime = keyof typeof photoTimeDictionary;

const usePhotoTimeAvailability = (photoTime: PhotoTime) => {
        const tileOptions = useAppSelector(getTileOptions);

        const queryArgs = useMemo(
                () => ({
                        data_type: typeDictionary[tileOptions.productType],
                        device: deviceDictionary[tileOptions.source],
                        parameter: parameterDictionary[tileOptions.parameter],
                        time_of_day: photoTimeDictionary[photoTime],
                        silent: true,
                }),
                [photoTime, tileOptions.parameter, tileOptions.productType, tileOptions.source],
        );

        const shouldSkipQuery =
                tileOptions.parameter !== 'temperature' || !tileOptions.source || !tileOptions.productType;

        const { data: monthlyAvgDates, isFetching: isMonthlyAvgLoading } = useGetMonthlyAvgDatesQuery(queryArgs, {
                skip: shouldSkipQuery,
        });
        const { data: monthlyAvgManyYearsDates, isFetching: isMonthlyAvgManyYearsLoading } =
                useGetMonthlyAvgManyYearsDatesQuery(queryArgs, {
                        skip: shouldSkipQuery,
                });

        const isAvailable = Boolean(monthlyAvgDates?.length || monthlyAvgManyYearsDates?.length);
        const isLoading = isMonthlyAvgLoading || isMonthlyAvgManyYearsLoading;

        return { isAvailable, isLoading };
};

const RadioDayNight: React.FC = () => {
        const dispatch = useAppDispatch();
        const selectedRadio = useAppSelector(getTileOptionByKey('photoTime'));
        const { isAvailable: isDailyAvailable, isLoading: isDailyLoading } = usePhotoTimeAvailability('daily');
        const { isAvailable: isNightlyAvailable, isLoading: isNightlyLoading } =
                usePhotoTimeAvailability('nightly');
        const { isAvailable: isDiurnalAvailable, isLoading: isDiurnalLoading } =
                usePhotoTimeAvailability('diurnal');

        const availableOptions = useMemo(
                () => [
                        { value: 'daily', label: 'дневные', isAvailable: isDailyAvailable },
                        { value: 'nightly', label: 'ночные', isAvailable: isNightlyAvailable },
                        { value: 'diurnal', label: 'суточные', isAvailable: isDiurnalAvailable },
                ].filter(({ isAvailable }) => isAvailable),
                [isDailyAvailable, isDiurnalAvailable, isNightlyAvailable],
        );

        const isLoadingAvailability = isDailyLoading || isNightlyLoading || isDiurnalLoading;

        useEffect(() => {
                if (isLoadingAvailability) return;

                const hasSelected = availableOptions.some(({ value }) => value === selectedRadio);
                const nextValue = availableOptions[0]?.value ?? null;

                if (!hasSelected && selectedRadio !== nextValue) {
                        dispatch(mapActions.setTileOptions({ key: 'photoTime', value: nextValue }));
                }
        }, [availableOptions, dispatch, isLoadingAvailability, selectedRadio]);

        const onValueChange = (_: unknown, value: string) => {
                dispatch(mapActions.setTileOptions({ key: 'photoTime', value }));
        };

        return (
                <div className={s.radio_group}>
                        <RadioGroup value={selectedRadio} onChange={onValueChange}>
                                {availableOptions.map(({ value, label }) => (
                                        <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                                ))}
                        </RadioGroup>
                </div>
        );
};

export { RadioDayNight };

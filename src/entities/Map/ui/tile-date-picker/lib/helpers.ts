import {
	useGetGroundDataAvailableDatesQuery,
	useGetLandsatDatesQuery,
	useGetMonthlyAvgDatesQuery,
	useGetMonthlyAvgManyYearsDatesQuery,
} from '@/entities/Map/api/mapApi';
import { getTileOptions } from '@/entities/Map/model/selectors';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import {
	adaptGetLandsatAvailableDates,
	adaptGetMonthlyAvgAvailableDates,
	adaptGetMonthlyAvgManyYearsAvailableDates,
} from './mappers';

const CHLOROPHYLL_AVAILABLE_DATES = [
        //'2024-06-17', // Временно для тестирования отображения
];

export const useDateHelper = (type: string) => {
        const isShouldDisableYear = ['landsat', 'monthlyAvg', 'groundData', 'chlorophyll'].includes(type);
        const isShouldDisableMonth = [
                'landsat',
                'monthlyAvg',
                'monthlyAvgManyYears',
                'groundData',
                'chlorophyll',
        ].includes(type);
        const isShouldDisableDay = ['landsat', 'groundData', 'chlorophyll'].includes(type);

	return { isShouldDisableYear, isShouldDisableMonth, isShouldDisableDay };
};

export const useGetAvailableDate = (type: string) => {
	const tileOptions = useAppSelector(getTileOptions);

	const { data: landsat, isFetching: isLandsatLoading } = useGetLandsatDatesQuery(
		adaptGetLandsatAvailableDates(tileOptions),
		{
			skip: tileOptions.type !== 'landsat',
		},
	);
	const { data: monthlyAvg, isFetching: isMonthlyAvgLoading } = useGetMonthlyAvgDatesQuery(
		adaptGetMonthlyAvgAvailableDates(tileOptions),
		{
			skip: tileOptions.type !== 'monthlyAvg' || !tileOptions.photoTime,
		},
	);
	const { data: monthlyAvgManyYears, isFetching: isMonthlyAvgManyYearsLoading } =
		useGetMonthlyAvgManyYearsDatesQuery(adaptGetMonthlyAvgManyYearsAvailableDates(tileOptions), {
			skip: tileOptions.type !== 'monthlyAvgManyYears' || !tileOptions.photoTime,
		});

        const { data: groundData, isFetching: isGroundDataLoading } = useGetGroundDataAvailableDatesQuery(
                undefined,
                {
                        skip: tileOptions.type !== 'groundData',
                },
        );

        if (type === 'chlorophyll') {
                return { data: CHLOROPHYLL_AVAILABLE_DATES, isLoading: false };
        }

		switch (type) {
		case 'landsat':
				return { data: landsat, isLoading: isLandsatLoading };
		case 'monthlyAvg':
				return { data: monthlyAvg, isLoading: isMonthlyAvgLoading };
		case 'monthlyAvgManyYears':
			return { data: monthlyAvgManyYears, isLoading: isMonthlyAvgManyYearsLoading };
		case 'groundData':
			return { data: groundData, isLoading: isGroundDataLoading };
		default:
			return { data: [], isLoading: false };
	}
};

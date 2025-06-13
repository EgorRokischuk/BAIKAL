import {
	adaptGetLandsatData,
	adaptGetMonthlyAvgData,
	adaptGetMonthlyAvgManyYearsData,
	getTileOptions,
	useGetLandsatPointMutation,
	useGetMonthlyAvgManyYearsPointMutation,
	useGetMonthlyAvgPointMutation,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetPoint = () => {
	const tileOptions = useAppSelector(getTileOptions);

	const [getLandsatPoint, { isLoading: isLadnsatFetching }] = useGetLandsatPointMutation();
	const [getMonthlyAvgPoint, { isLoading: isMonthlyAvgFetching }] = useGetMonthlyAvgPointMutation();
	const [getMonthlyAvgManyYearsPoint, { isLoading: isMonthlyAvgManyYearsFetching }] =
		useGetMonthlyAvgManyYearsPointMutation();

	const getPointMutation = async (location: [number, number]) => {
		switch (tileOptions.type) {
			case 'landsat':
				return await getLandsatPoint({
					...adaptGetLandsatData(tileOptions),
					lat: Number(location[0].toFixed(4)),
					lon: Number(location[1].toFixed(4)),
				});
			case 'monthlyAvg':
				return await getMonthlyAvgPoint({
					...adaptGetMonthlyAvgData(tileOptions),
					lat: Number(location[0].toFixed(4)),
					lon: Number(location[1].toFixed(4)),
				});
			case 'monthlyAvgManyYears':
				return await getMonthlyAvgManyYearsPoint({
					...adaptGetMonthlyAvgManyYearsData(tileOptions),
					lat: Number(location[0].toFixed(4)),
					lon: Number(location[1].toFixed(4)),
				});
		}
	};

	const isLoading = () => {
		switch (tileOptions.type) {
			case 'landsat':
				return isLadnsatFetching;
			case 'monthlyAvg':
				return isMonthlyAvgFetching;
			case 'monthlyAvgManyYears':
				return isMonthlyAvgManyYearsFetching;
		}
	};

	return { getPointMutation, isLoading };
};

import {
	getTileOptions,
	useGetLandsatFileMutation,
	useGetMonthlyAvgFileMutation,
	useGetMonthlyAvgManyYearsFileMutation,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetFile = () => {
	const tileOptions = useAppSelector(getTileOptions);

	const [getLandsatFile, { isLoading: isLadnsatFetching }] = useGetLandsatFileMutation();
	const [getMonthlyAvgFile, { isLoading: isMonthlyAvgFetching }] = useGetMonthlyAvgFileMutation();
	const [getMonthlyAvgManyYearsFile, { isLoading: isMonthlyAvgManyYearsFetching }] =
		useGetMonthlyAvgManyYearsFileMutation();

	const getFileMutation = async () => {
		switch (tileOptions.type) {
			case 'landsat':
				return await getLandsatFile(tileOptions);
			case 'monthlyAvg':
				return await getMonthlyAvgFile(tileOptions);
			case 'monthlyAvgManyYears':
				return await getMonthlyAvgManyYearsFile(tileOptions);
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

	return { getFileMutation, isLoading };
};

import {
        getTileOptions,
        useGetLandsatFileMutation,
        useGetMonthlyAvgFileMutation,
        useGetMonthlyAvgManyYearsFileMutation,
        useGetChlorophyllFileMutation,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetFile = () => {
        const tileOptions = useAppSelector(getTileOptions);

        const [getLandsatFile, { isLoading: isLadnsatFetching }] = useGetLandsatFileMutation();
        const [getMonthlyAvgFile, { isLoading: isMonthlyAvgFetching }] = useGetMonthlyAvgFileMutation();
        const [getMonthlyAvgManyYearsFile, { isLoading: isMonthlyAvgManyYearsFetching }] =
                useGetMonthlyAvgManyYearsFileMutation();
        const [getChlorophyllFile, { isLoading: isChlorophyllFetching }] = useGetChlorophyllFileMutation();

	const getFileMutation = async () => {
		switch (tileOptions.type) {
			case 'landsat':
				return await getLandsatFile(tileOptions);
			case 'monthlyAvg':
				return await getMonthlyAvgFile(tileOptions);
                        case 'monthlyAvgManyYears':
                                return await getMonthlyAvgManyYearsFile(tileOptions);
                        case 'chlorophyll':
                                return await getChlorophyllFile(tileOptions);
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
                        case 'chlorophyll':
                                return isChlorophyllFetching;
                }
        };

	return { getFileMutation, isLoading };
};

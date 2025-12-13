import {
        getTileOptions,
        useGetLandsatTileLinkMutation,
        useGetMonthlyAvgManyYearsTileLinkMutation,
        useGetMonthlyAvgTileLinkMutation,
        useGetChlorophyllTileLinkMutation,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetTileLink = () => {
        const tileOptions = useAppSelector(getTileOptions);

        const [getLandsatTileLink, { isLoading: isLadnsatFetching }] = useGetLandsatTileLinkMutation();
        const [getMonthlyAvgTileLink, { isLoading: isMonthlyAvgFetching }] =
                useGetMonthlyAvgTileLinkMutation();
        const [getMonthlyAvgManyYearsTileLink, { isLoading: isMonthlyAvgManyYearsFetching }] =
                useGetMonthlyAvgManyYearsTileLinkMutation();
        const [getChlorophyllTileLink, { isLoading: isChlorophyllLoading }] =
                useGetChlorophyllTileLinkMutation();

	const getTileLinkMutation = async () => {
		switch (tileOptions.type) {
			case 'landsat':
				await getLandsatTileLink(tileOptions);
				break;
			case 'monthlyAvg':
				await getMonthlyAvgTileLink(tileOptions);
				break;
                        case 'monthlyAvgManyYears':
                                await getMonthlyAvgManyYearsTileLink(tileOptions);
                                break;
                        case 'chlorophyll':
                                await getChlorophyllTileLink(tileOptions);
                                break;
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
                                return isChlorophyllLoading;
                }
        };

	return { getTileLinkMutation, isLoading };
};

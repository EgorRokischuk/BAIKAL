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

	const shouldDisable = () => {
		const hasBaseSelection = Boolean(
			tileOptions.productType && tileOptions.parameter && tileOptions.source,
		);

		if (!hasBaseSelection) return true;

		switch (tileOptions.type) {
			case 'landsat':
				return !tileOptions.startDate;
			case 'monthlyAvg':
				return !tileOptions.photoTime || !tileOptions.startDate;
			case 'monthlyAvgManyYears':
				return !tileOptions.photoTime || !tileOptions.startDate;
			case 'chlorophyll':
				return !tileOptions.startDate;
			default:
				return true;
		}
	};

	return { getTileLinkMutation, isLoading, shouldDisable };
};

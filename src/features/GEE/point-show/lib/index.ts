import {
	getGeeState,
	useLazyGetPointValuePeriodQuery,
	useLazyGetPointValueQuery,
	useLazyGetPolygonValuePeriodQuery,
	useLazyGetPolygonValueQuery,
} from '@/entities/GEE';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetPointValue = () => {
	const options = useAppSelector(getGeeState);

	const [getPointValue] = useLazyGetPointValueQuery();
	const [getPointValuePeriod] = useLazyGetPointValuePeriodQuery();
	const [getPolygonValue] = useLazyGetPolygonValueQuery();
	const [getPolygonValuePeriod] = useLazyGetPolygonValuePeriodQuery();

	const getValue = async () => {
		switch (options.type) {
			case 'point':
				if (!options.dateEnd) return await getPointValue(options);
				else return await getPointValuePeriod(options);
			case 'polygon':
				if (!options.dateEnd) return await getPolygonValue(options);
				else return await getPolygonValuePeriod(options);
		}
	};

	const shouldDisable = () => {
		switch (options.type) {
			case 'point':
				return !options.dateStart || options.point.length !== 2;
			case 'polygon':
				return !options.dateStart || options.shape.length !== 4;
		}
	};

	return { getValue, shouldDisable };
};

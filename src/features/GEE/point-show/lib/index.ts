import {
	getGeeState,
	useLazyGetPointValuePeriodQuery,
	useLazyGetPointValueQuery,
} from '@/entities/GEE';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const useGetPointValue = () => {
	const options = useAppSelector(getGeeState);

	const [getPointValue] = useLazyGetPointValueQuery();
	const [getPointValuePeriod] = useLazyGetPointValuePeriodQuery();

	const getValue = async () => {
		switch (options.type) {
			case 'point':
				if (!options.dateEnd) await getPointValue(options);
				else await getPointValuePeriod(options);
				break;
		}
	};

	const shouldDisable = () => {
		switch (options.type) {
			case 'point':
				return !options.dateStart || options.point.length !== 2;
		}
	};

	return { getValue, shouldDisable };
};

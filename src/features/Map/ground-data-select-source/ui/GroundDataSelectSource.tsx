import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Select } from '@mui/material';
import { useMemo } from 'react';
import {
	getGroundDataOptions,
	getTileOptionByKey,
	mapActions,
	useGetGroundDataSourcesQuery,
} from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { GroundDataSelectSourceSkeleton } from './GroundDataSelectSource.skeleton';

export const GroundDataSelectSource: React.FC = () => {
	const dispatch = useAppDispatch();
	const groundDataParams = useAppSelector(getGroundDataOptions);
	const source = useAppSelector(getTileOptionByKey('source'));

	const isAvailable = useMemo(
		() => !!groundDataParams.startDate && !!groundDataParams.parameter,
		[groundDataParams.startDate, groundDataParams.parameter],
	);

	const { data, isFetching } = useGetGroundDataSourcesQuery(
		{
			parameter: groundDataParams.parameter,
			startDate: convertToDateInput(groundDataParams.startDate),
			endDate: convertToDateInput(groundDataParams.endDate),
		},
		{ skip: !isAvailable },
	);

	return (
		<Accordion disabled={!isAvailable}>
			<AccordionSummary>{'Источник'}</AccordionSummary>
			<AccordionDetails>
				{isFetching && <GroundDataSelectSourceSkeleton />}
				{!isFetching && (
					<Select
						fullWidth
						value={source}
						disabled={isFetching}
						onChange={(e) =>
							dispatch(mapActions.setTileOptions({ key: 'source', value: e.target.value }))
						}
					>
						{data?.map((value) => (
							<MenuItem key={value} value={value}>
								{value}
							</MenuItem>
						))}
					</Select>
				)}
			</AccordionDetails>
		</Accordion>
	);
};

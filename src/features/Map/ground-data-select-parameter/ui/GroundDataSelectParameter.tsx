import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Select } from '@mui/material';
import {
	getGroundDataOptions,
	getTileOptionByKey,
	mapActions,
	useGetGroundDataParametersQuery,
} from '@/entities/Map';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { GroundDataSelectParameterSkeleton } from './GroundDataSelectParameter.skeleton';

export const GroundDataSelectParameter = () => {
	const dispatch = useAppDispatch();
	const parameter = useAppSelector(getTileOptionByKey('parameter'));
	const groundDataParams = useAppSelector(getGroundDataOptions);

	const { data, isFetching } = useGetGroundDataParametersQuery(
		{
			startDate: convertToDateInput(groundDataParams.startDate),
			endDate: convertToDateInput(groundDataParams.endDate),
		},
		{ skip: !groundDataParams.startDate },
	);

	return (
		<Accordion disabled={!groundDataParams.startDate}>
			<AccordionSummary>{'Параметр'}</AccordionSummary>
			<AccordionDetails>
				{isFetching && <GroundDataSelectParameterSkeleton />}
				{!isFetching && (
					<Select
						fullWidth
						value={parameter}
						disabled={isFetching}
						onChange={(e) =>
							dispatch(mapActions.setTileOptions({ key: 'parameter', value: e.target.value }))
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

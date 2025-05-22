import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import {
	getGroundDataOptions,
	getIsPointsVisible,
	useGetGroundDataPointsQuery,
} from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { convertToDateInput } from '@/shared/lib/datetimeFormat';
import { ExportToExcel } from '@/shared/ui/ExportToExcel';
import { headers } from '../config/excelHeaders';
import { adaptExportGroundDataPoint } from '../lib';

export const GroundDataExport: React.FC = () => {
	const isPointsVisible = useAppSelector(getIsPointsVisible);
	const groundDataParams = useAppSelector(getGroundDataOptions);

	const { data } = useGetGroundDataPointsQuery(
		{
			...groundDataParams,
			startDate: convertToDateInput(groundDataParams.startDate),
			endDate: convertToDateInput(groundDataParams.endDate),
		},
		{ skip: !isPointsVisible },
	);

	if (!data || !isPointsVisible)
		return (
			<Button variant="contained" disabled>
				<DownloadIcon />
			</Button>
		);

	return (
		<ExportToExcel headers={headers} exportData={adaptExportGroundDataPoint(data)}>
			<DownloadIcon />
		</ExportToExcel>
	);
};

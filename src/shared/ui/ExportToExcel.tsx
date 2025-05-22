import { globalActions } from '@/app/providers/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { exportDataToExcel } from '../lib/excelExport';
import { IExportHeaderItem } from '../types';
import { Button } from './Button';

interface IExportToExcelProps {
	children?: React.ReactNode;
	headers: Array<IExportHeaderItem>;
	exportData: Array<Record<string, unknown>>;
	fileName?: string;
	sheetName?: string;
}

export const ExportToExcel: React.FC<IExportToExcelProps> = ({
	children,
	headers,
	exportData,
	fileName = 'data',
	sheetName = 'Sheet1',
}) => {
	const dispatch = useAppDispatch();

	const onExportClick = async () => {
		dispatch(globalActions.setLoading(true));
		await exportDataToExcel(headers, exportData, fileName, sheetName);
		dispatch(globalActions.setLoading(false));
	};

	return (
		<Button variant="contained" onClick={onExportClick}>
			{children ?? 'Export'}
		</Button>
	);
};

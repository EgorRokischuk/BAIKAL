import { DownloadTile } from '@/features/Map/download-tile';
import { ExportGroundData } from '@/features/Map/ground-data-export';
import { ShowGroundData } from '@/features/Map/ground-data-show';
import { ShowTile } from '@/features/Map/show-tile';
import { getTileOptionByKey } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

export const MenuActions: React.FC = () => {
	const dataType = useAppSelector(getTileOptionByKey('productType'));

	return (
		<>
			{dataType !== 'groundData' ? <DownloadTile /> : <ExportGroundData />}
			{dataType !== 'groundData' ? <ShowTile /> : <ShowGroundData />}
		</>
	);
};

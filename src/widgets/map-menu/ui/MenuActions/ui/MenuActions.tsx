import { Box } from '@mui/material';
import { ShowPoint } from '@/features/GEE/point-show';
import { DownloadTile } from '@/features/Map/download-tile';
import { ShowGroundData } from '@/features/Map/ground-data-show';
import { ShowTile } from '@/features/Map/show-tile';
import { getTileOptionByKey } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

const ShowButton: React.FC<{ type: string }> = ({ type }) => {
	switch (type) {
		case 'baikalRiver':
			return <ShowTile />;
		case 'groundData':
			return <ShowGroundData />;
		case 'gee':
			return <ShowPoint />;
		default:
			return null;
	}
};

export const MenuActions: React.FC = () => {
	const dataType = useAppSelector(getTileOptionByKey('productType'));

	return (
		<>
			{dataType === 'baikalRiver' ? <DownloadTile /> : <Box />}
			<ShowButton type={dataType} />
		</>
	);
};

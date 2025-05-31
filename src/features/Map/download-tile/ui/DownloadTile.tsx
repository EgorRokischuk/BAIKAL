import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { getTileLink } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useGetFile } from '../lib/helpers';

const DownloadTile: React.FC = () => {
	const tileLink = useAppSelector(getTileLink);
	const { getFileMutation, isLoading } = useGetFile();

	const handleDownload = async () => {
		const response = await getFileMutation();
		window.open(`${process.env.TILE_API_URL}${response.data}`, '_blank');
	};

	return (
		<Button variant="contained" disabled={!tileLink || isLoading()} onClick={handleDownload}>
			<DownloadIcon />
		</Button>
	);
};

export { DownloadTile };

import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { getIsTileVisible, getTileOptions, useGetTifFileLinkMutation } from '@/entities/Map';
import { useAppSelector } from '@/shared/hooks/useAppSelector';

const DownloadTile: React.FC = () => {
	const isTileVisible = useAppSelector(getIsTileVisible);
	const tileOptions = useAppSelector(getTileOptions);
	const [getTifFileLinkMutation, { isLoading }] = useGetTifFileLinkMutation();

	const handleDownload = async () => {
		const response = await getTifFileLinkMutation(tileOptions);

		window.open(`${process.env.TILE_API_URL}${response.data}`, '_blank');
	};

	return (
		<Button variant="contained" disabled={!isTileVisible || isLoading} onClick={handleDownload}>
			<DownloadIcon />
		</Button>
	);
};

export { DownloadTile };

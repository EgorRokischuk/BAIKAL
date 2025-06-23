import LanguageIcon from '@mui/icons-material/Language';
import { Button } from '@/shared/ui/Button';
import { btnStyle } from '../config/sxStyles';

interface IPublicationReirectProps {
	url: string;
}

export const PublicationRedirect: React.FC<IPublicationReirectProps> = ({ url }) => {
	const handleRedirect = () => {
		window.open(url, '_blank');
	};

	return (
		<>
			<Button sx={btnStyle} onClick={handleRedirect}>
				<LanguageIcon fontSize="inherit" />
			</Button>
		</>
	);
};

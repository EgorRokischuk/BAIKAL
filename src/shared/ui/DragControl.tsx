import { useMapDragging } from '@/shared/hooks/useMapDragging';
import { PropsWithChildren } from 'react';
import { useMap } from 'react-leaflet';

interface IProps {
	className: string;
}

const DragControl: React.FC<PropsWithChildren<IProps>> = ({ className, children }) => {
	const map = useMap();
	const { enableMapDragging, disableMapDragging } = useMapDragging(map);

	return (
		<div className={className} onMouseLeave={enableMapDragging} onMouseDown={disableMapDragging}>
			{children}
		</div>
	);
};

export { DragControl };

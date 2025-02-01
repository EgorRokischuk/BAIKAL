import { Map as MapContainer } from '@/widgets/map';
import { MapMenu } from '@/widgets/map-menu';
import * as s from './Map.module.scss';

const Map: React.FC = () => {
	return (
		<>
			<MapContainer />
			<div className={s.menu_container}>
				<MapMenu />
			</div>
		</>
	);
};

export { Map };

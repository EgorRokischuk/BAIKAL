import { Map as MapContainer } from '@/widgets/map';
import { MapMenu } from '@/widgets/mapMenu';
import * as s from './Map.module.scss';

function Map() {
	return (
		<>
			<MapContainer />
			<div className={s.menu_container}>
				<MapMenu />
			</div>
		</>
	);
}

export { Map };

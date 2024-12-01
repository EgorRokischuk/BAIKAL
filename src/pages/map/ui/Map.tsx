import { Map as MapContainer } from '@/widgets/map';
import * as s from './Map.module.scss'
import Menu from "@/entities/map/ui/Menu";

function Map() {
	return (
		<div>
			<MapContainer />
					<div className={s.menu_container}>
				<Menu />
			</div>
		</div>
	);
}

export { Map };

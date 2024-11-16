import * as s from './Map.module.scss'
import Menu from "@/entities/map/ui/Menu";

function Map() {
	return (
		<div>
			<h1>Map</h1>
					<div className={s.menu_container}>
				<Menu />
			</div>
		</div>
	);
}

export { Map };

import { useCallback } from 'react';
import { Map } from 'leaflet';

const useMapDragging = (map: Map) => {
	const disableMapDragging = useCallback(() => {
		map.dragging.disable();
	}, [map]);

	const enableMapDragging = useCallback(() => {
		map.dragging.enable();
	}, [map]);

	return { disableMapDragging, enableMapDragging };
};

export { useMapDragging };

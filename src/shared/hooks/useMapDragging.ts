import { Map } from 'leaflet';
import { useCallback } from 'react';

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

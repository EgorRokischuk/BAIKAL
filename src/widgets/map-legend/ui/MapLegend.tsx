import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './MapLegend.module.scss';

const LST_GRADIENT = [
	'#070038', '#0a0049', '#0f0047', '#140060', '#1a0080',
	'#003399', '#0066cc', '#0099ff', '#00ccff', '#00ffff',
	'#33ff99', '#99ff33', '#ccff00', '#ffff00', '#ffcc00',
	'#ff9900', '#ff6600', '#ff3300', '#800000', '#6e0000',
	'#330000',
];

const CHL_GRADIENT = [
	'#e5f9e7',
	'#b7e4c7',
	'#74c69d',
	'#40916c',
	'#1b4332',
];

export const MapLegend: React.FC = () => {
	const { legend, tileOptions } = useAppSelector((s) => s.map);

	if (!legend.visible || legend.min === null || legend.max === null) return null;

	const gradient =
		tileOptions.parameter === 'chlorophyll' ? CHL_GRADIENT : LST_GRADIENT;

	return (
		<div className={s.legend}>
			<div className={s.value}>{legend.max.toFixed(1)}</div>

			<div className={s.gradient}>
				{gradient.map((color, i) => (
					<div key={i} style={{ backgroundColor: color }} />
				))}
			</div>

			<div className={s.value}>{legend.min.toFixed(1)}</div>
		</div>
	);
};

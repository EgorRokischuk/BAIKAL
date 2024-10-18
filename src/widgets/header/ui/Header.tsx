import { memo } from 'react';

import Satellite from '@/shared/assets/header/satellite.png';
import Lake from '@/shared/assets/header/lake.png';

import * as s from './Header.module.scss';

const MemoHeader = () => {
	return (
		<div className={s.header}>
			<div className={s.header__image}>
				<img src={Satellite} alt="satellite" />
			</div>
			<div className={s.header__title}>
				<span>
					{'ИС анализа Байкальской природной'}
					<br />
					{' зоны с помощью спутниковых снимков'}
				</span>
			</div>

			<div className={s.header__image}>
				<img src={Lake} alt="lake" />
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);

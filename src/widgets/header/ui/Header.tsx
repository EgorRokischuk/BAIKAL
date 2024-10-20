import { memo } from 'react';

import * as s from './Header.module.scss';

const MemoHeader = () => {
	return (
		<div className={s.header}>
			<div className={s.header__title}>
				<span>
					{'ИС анализа Байкальской природной'}
					<br />
					{' зоны с помощью спутниковых снимков'}
				</span>
			</div>
		</div>
	);
};

export const Header = memo(MemoHeader);

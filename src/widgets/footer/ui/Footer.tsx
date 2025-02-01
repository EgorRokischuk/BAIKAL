import { memo } from 'react';
import * as s from './Footer.module.scss';

const MemoFooter: React.FC = () => {
	return (
		<div className={s.block}>
			<span>{'© 2024 ФИЦ ИВТ. Все права защищены'}</span>
		</div>
	);
};

export const Footer = memo(MemoFooter);

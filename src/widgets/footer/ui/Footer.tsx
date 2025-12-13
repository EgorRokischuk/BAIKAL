import { memo } from 'react';
import * as s from './Footer.module.scss';

interface IFooterProps {
	useLightText: boolean;
}

const MemoFooter: React.FC<IFooterProps> = ({ useLightText }) => {
	return (
		<div className={s.block}>
			<span className={useLightText ? s.block__text_light : s.block__text_dark}>
				{'© 2025 ФИЦ ИВТ. Все права защищены'}
			</span>
		</div>
	);
};

export const Footer = memo(MemoFooter);

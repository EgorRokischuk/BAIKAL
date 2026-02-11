import clsx from 'classnames';
import { memo } from 'react';
import * as s from './Footer.module.scss';

interface IFooterProps {
	useLightText: boolean;
	isFloating?: boolean;
}

const MemoFooter: React.FC<IFooterProps> = ({ useLightText, isFloating = true }) => {
	return (
		<div className={clsx(s.block, isFloating ? s.blockFloating : s.blockStatic)}>
			<span className={useLightText ? s.block__text_light : s.block__text_dark}>
				{'© 2026 ФИЦ ИВТ. Все права защищены'}
			</span>
		</div>
	);
};

export const Footer = memo(MemoFooter);

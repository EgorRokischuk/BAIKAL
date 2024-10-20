import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IMenuItem } from '../../model/types';

import classNames from 'classnames';
import * as s from './MenuItem.module.scss';

interface IMenuItemProps {
	menuItem: IMenuItem;
}

const MenuItem = ({ menuItem }: IMenuItemProps) => {
	const location = useLocation();

	const [active, setActive] = useState(location.pathname.endsWith(menuItem.route));

	const handleActive = () => {
		setActive((prev) => !prev);
	};

	return (
		<div className={s.block}>
			<NavLink to={menuItem.route} end>
				<button
					className={classNames({ [s.block__btn]: true, [s.block__btn_active]: active })}
					onClick={handleActive}
				>
					{menuItem.name}
				</button>
			</NavLink>
		</div>
	);
};

export { MenuItem };

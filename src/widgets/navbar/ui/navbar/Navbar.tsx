import { IMenuItem } from '../../model/types';
import { MenuItem } from '../menu-item/MenuItem';
import * as s from './Navbar.module.scss';

interface INavbarProps {
	menuItems: IMenuItem[];
}

const Navbar: React.FC<INavbarProps> = ({ menuItems }) => {
	return (
		<div className={s.block}>
			{menuItems.map((item: IMenuItem, index: number) => (
				<MenuItem key={index} menuItem={item} />
			))}
		</div>
	);
};

export { Navbar };

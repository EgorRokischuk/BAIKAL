import { Typography } from '@mui/material';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { globalActions } from '@/app/providers/store';
import { IMenuItem } from '@/widgets/navbar/model/types';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import * as s from './MenuItem.module.scss';

interface IMenuItemProps {
	menuItem: IMenuItem;
}

const MenuItem: React.FC<IMenuItemProps> = ({ menuItem }) => {
	const dispatch = useAppDispatch();
	const currentPage = useAppSelector(({ global }) => global.currentPage);

	const handleClick = () => dispatch(globalActions.setCurrentPage(menuItem.route));

	return (
		<div className={s.block}>
			<NavLink to={menuItem.route} end>
				<button
					className={classNames({
						[s.block__btn]: true,
						[s.block__btn_active]: currentPage.endsWith(menuItem.route),
					})}
					onClick={handleClick}
				>
					<Typography variant="h5">{menuItem.name}</Typography>
				</button>
			</NavLink>
		</div>
	);
};

export { MenuItem };

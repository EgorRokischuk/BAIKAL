import type { CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import styles from './SideNav.module.scss';

interface SideNavProps {
  items: { label: string; to: string }[];
}

export const SideNav = ({ items }: SideNavProps) => {
  const dispatch = useAppDispatch();
  const navStyle = { '--nav-items-count': String(Math.max(items.length, 1)) } as CSSProperties;

  return (
    <nav className={styles.nav} style={navStyle}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
          onClick={() => dispatch(appActions.setCurrentPath(item.to))}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

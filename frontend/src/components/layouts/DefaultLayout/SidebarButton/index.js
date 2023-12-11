import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import styles from './SidebarButton.module.scss';

const cx = classNames.bind(styles);

function SidebarButton({ icon, title, to }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive ? cx('navlink', 'active') : cx('navlink')
            }
        >
            <div className={cx('wrapper-icon')}>
                <div className={cx('icon')}>{icon}</div>
            </div>
            <div className={cx('title')}>{title}</div>
        </NavLink>
    );
}

export default SidebarButton;

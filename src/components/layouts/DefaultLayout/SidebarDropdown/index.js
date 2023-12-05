import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';
import { Collapse } from '@mui/material';
import styles from './SidebarDropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function SidebarDropdown({ icon, title, items, state }) {
    const [isExpand, setIsExpand] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const listItems = useRef();

    const handleExpand = () => {
        setIsExpand((preIsExpand) => !preIsExpand);
    };

    useEffect(() => {
        for (const item of listItems.current.children) {
            if (item.classList.contains(cx('active'))) {
                setIsActive(true);
                break;
            } else {
                setIsActive(false);
            }
        }
    }, [state]);

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('inner', { active: isActive })}
                onClick={handleExpand}
            >
                <div className={cx('wrapper-icon')}>
                    <div className={cx('icon')}>{icon}</div>
                </div>
                <div className={cx('title')}>{title}</div>
                <div className={cx('expand-icon', { active: isExpand })}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </div>
            </div>

            <Collapse in={isExpand}>
                <div className={cx('list-item')}>
                    <div className={cx('df')} ref={listItems}>
                        {items.map((item, index) => (
                            <NavLink
                                to={item.to}
                                key={index}
                                className={({ isActive }) => {
                                    return isActive
                                        ? cx('item', 'active')
                                        : cx('item');
                                }}
                            >
                                {item.title}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

export default SidebarDropdown;

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faCashRegister,
    faChartSimple,
    faClipboardUser,
    faClockRotateLeft,
    faHouse,
    faPercent,
    faReceipt,
    faUser,
} from '@fortawesome/free-solid-svg-icons';

import AppLogo from '~/assets/images/AppLogo.svg';
import styles from './Sidebar.module.scss';
import SidebarDropdown from '../SidebarDropdown';
import SidebarButton from '../SidebarButton';
import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

function SideBar({ className, title }) {
    const [routes, setRoutes] = useState([]);
    const [role, setRole] = useState('admin');

    useEffect(() => {
        const roleInLocalStorage = getLocalStorage().user.role;
        setRole(roleInLocalStorage);

        if (roleInLocalStorage === 'sales') {
            setRoutes([
                {
                    title: 'Danh sách sản phẩm',
                    to: '/products',
                },
            ]);
        } else {
            setRoutes([
                {
                    title: 'Danh sách sản phẩm',
                    to: '/products',
                },
                {
                    title: 'Nhập hàng',
                    to: '/imports',
                },
                // {
                //     title: 'Kiểm hàng',
                //     to: '/checks',
                // },
                {
                    title: 'Nhà cung cấp',
                    to: '/suppliers',
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <img src={AppLogo} alt="" className={cx('logo')} />
                    <div className={cx('app-name')}>Triple K</div>
                </div>
                <hr className={cx('divider')} />
                <div className={cx('content')}>
                    {role === 'admin' &&
                        <SidebarButton
                            to={'/overview'}
                            title={'Tổng quan'}
                            icon={<FontAwesomeIcon icon={faHouse} />}
                        />
                    }
                    {(role === 'sales' || role === 'admin') &&
                        <SidebarDropdown
                            state={title}
                            icon={<FontAwesomeIcon icon={faReceipt} />}
                            title={'Đơn hàng'}
                            items={[
                                {
                                    title: 'Danh sách đơn hàng',
                                    to: '/orders',
                                },
                                {
                                    title: 'Khách trả hàng',
                                    to: '/return',
                                },
                            ]}
                        />
                    }
                    <SidebarDropdown
                        state={title}
                        icon={<FontAwesomeIcon icon={faBox} />}
                        title={'Sản phẩm'}
                        items={routes}
                    />
                    {(role === 'sales' || role === 'admin') &&
                        <SidebarButton
                            to={'/customers'}
                            title={'Khách hàng'}
                            icon={<FontAwesomeIcon icon={faUser} />}
                        />
                    }
                    {role === 'admin' &&
                        <SidebarDropdown
                            state={title}
                            icon={<FontAwesomeIcon icon={faChartSimple} />}
                            title={'Báo cáo'}
                            items={[
                                {
                                    title: 'Báo cáo bán hàng',
                                    to: '/reports/sell',
                                },
                            ]}
                        />
                    }
                    {(role === 'sales' || role === 'admin') &&
                        <SidebarButton
                            to={'/sales'}
                            title={'Bán tại quầy'}
                            icon={<FontAwesomeIcon icon={faCashRegister} />}
                        />
                    }
                    {role === 'admin' &&
                        <SidebarButton
                            to={'/discounts'}
                            title={'Khuyến mãi'}
                            icon={<FontAwesomeIcon icon={faPercent} />}
                        />
                    }
                    {role === 'admin' &&
                        <SidebarButton
                            to={'/staffs'}
                            title={'Quản lý nhân viên'}
                            icon={<FontAwesomeIcon icon={faClipboardUser} />}
                        />
                    }
                    {role === 'admin' &&
                        <SidebarButton
                            to={'/activity'}
                            title={'Nhật ký hoạt động'}
                            icon={<FontAwesomeIcon icon={faClockRotateLeft} />}
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default SideBar;

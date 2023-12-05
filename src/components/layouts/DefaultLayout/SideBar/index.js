import { useState } from 'react';
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

const cx = classNames.bind(styles);

function SideBar({ className }) {
    const [state, setState] = useState(false);

    const handleState = () => {
        setState(!state);
    };

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
                <div className={cx('content')} onClick={handleState}>
                    <SidebarButton
                        to={'/typeproduct'}
                        title={'Tổng quan'}
                        icon={<FontAwesomeIcon icon={faHouse} />}
                    />
                    <SidebarDropdown
                        state={state}
                        icon={<FontAwesomeIcon icon={faReceipt} />}
                        title={'Đơn hàng'}
                        items={[
                            {
                                title: 'Danh sách đơn hàng',
                                to: '/listproduct',
                            },
                            {
                                title: 'Khách trả hàng',
                                to: '/typeproduct',
                            },
                        ]}
                    />
                    <SidebarDropdown
                        state={state}
                        icon={<FontAwesomeIcon icon={faBox} />}
                        title={'Sản phẩm'}
                        items={[
                            {
                                title: 'Danh sách sản phẩm',
                                to: '/listproduct',
                            },
                            {
                                title: 'Nhập hàng',
                                to: '/',
                            },
                            {
                                title: 'Kiểm hàng',
                                to: '/',
                            },
                            {
                                title: 'Nhà cung cấp',
                                to: '/',
                            },
                        ]}
                    />
                    <SidebarDropdown
                        state={state}
                        icon={<FontAwesomeIcon icon={faUser} />}
                        title={'Khách hàng'}
                        items={[
                            {
                                title: 'Danh sách khách hàng',
                                to: '/listproduct',
                            },
                            {
                                title: 'Nhóm khách hàng',
                                to: '/',
                            },
                        ]}
                    />
                    <SidebarDropdown
                        state={state}
                        icon={<FontAwesomeIcon icon={faChartSimple} />}
                        title={'Báo cáo'}
                        items={[
                            {
                                title: 'Báo cáo doanh thu',
                                to: '/listproduct',
                            },
                            {
                                title: 'Báo cáo lợi nhuận',
                                to: '/',
                            },
                        ]}
                    />
                    <SidebarButton
                        to={'/typeproduct'}
                        title={'Bán tại quầy'}
                        icon={<FontAwesomeIcon icon={faCashRegister} />}
                    />
                    <SidebarButton
                        to={'/typeproduct'}
                        title={'Khuyến mãi'}
                        icon={<FontAwesomeIcon icon={faPercent} />}
                    />
                    <SidebarButton
                        to={'/typeproduct'}
                        title={'Quản lý nhân viên'}
                        icon={<FontAwesomeIcon icon={faClipboardUser} />}
                    />
                    <SidebarButton
                        to={'/typeproduct'}
                        title={'Nhật ký hoạt động'}
                        icon={<FontAwesomeIcon icon={faClockRotateLeft} />}
                    />
                </div>
            </div>
        </div>
    );
}

export default SideBar;

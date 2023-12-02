import classNames from 'classnames/bind';
import styles from './NewSideBar.Module.scss';
import {
    Sidebar,
    Menu,
    MenuItem,
    SubMenu,
    menuClasses,
    MenuItemStyles,
    sidebarClasses,
} from 'react-pro-sidebar';
import logo from '../../assets/images/white-logo.png';
import { AiFillHome } from 'react-icons/ai';
import {
    FaShoppingCart,
    FaDatabase,
    FaUser,
    FaChartBar,
    FaUsers,
} from 'react-icons/fa';
import { FaWallet, FaBookAtlas } from 'react-icons/fa6';
import { IoIosPricetags } from 'react-icons/io';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function NewSideBar() {
    return (
        <div className={cx('sidebar-container')}>
            <Sidebar
                rtl
                // collapsed
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        backgroundColor: '#0b2948',
                        color: 'white',
                    },
                }}
                className={cx('sidebar')}
            >
                <div className={cx('sidebar-header')}>
                    <h1
                        style={{
                            fontSize: '30px',
                        }}
                    >
                        Triple K
                    </h1>
                    <img className={cx('sidebar-logo')} src={logo}></img>
                </div>
                <Menu
                    style={{ fontSize: '16px' }}
                    rootStyles={{
                        color: 'white',
                    }}
                    menuItemStyles={{
                        button: {
                            '&:hover': {
                                backgroundColor: '#00458b',
                                color: '#b6c8d9',
                            },
                        },
                        icon: {
                            color: '#59d0ff',
                        },
                        subMenuContent: {
                            backgroundColor: '#082440',
                        },
                    }}
                >
                    <MenuItem className={cx('menu-item')} icon={<AiFillHome />}>
                        Tổng quan
                    </MenuItem>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Đơn hàng"
                        icon={<FaShoppingCart />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Sản phẩm"
                        icon={<FaDatabase />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Danh sách sản phẩm
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Quản lý kho
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Kiểm hàng
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Nhà cung cấp
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Khách hàng"
                        icon={<FaUser />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Sổ quỹ"
                        icon={<FaWallet />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Báo cáo"
                        icon={<FaChartBar />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Quản lý khuyến mãi"
                        icon={<IoIosPricetags />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Quản lý nhân viên"
                        icon={<FaUsers />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        className={cx('sub-menu')}
                        label="Nhật ký hoạt động"
                        icon={<FaBookAtlas />}
                    >
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                        <MenuItem className={cx('menu-item')}>
                            Nhập hàng
                        </MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default NewSideBar;

import classNames from 'classnames/bind';
import styles from './NewHeader.module.scss';
import { FaBell } from 'react-icons/fa';
import avt from '../../assets/images/minimal-morning-landscape-8k-gx-scaled.jpg';
import { CgProfile } from 'react-icons/cg';
import logo from '../../assets/images/logo.png';
import { FaStore } from 'react-icons/fa';

const cx = classNames.bind(styles);

function NewHeader() {
    return (
        <div className={cx('header')}>
            <div className={cx('header-content')}>
                <div className={cx('logo-container')}>
                    <img className={cx('logo')} src={logo}></img>
                </div>
                <div className={cx('tab-container')}>
                    <a className={cx('profile-tag')} href="/profile">
                        <CgProfile className={cx('profile-icon')}></CgProfile>
                        <p>Trang cá nhân</p>
                    </a>
                    <a className={cx('store-tag')} href="/storeinfo">
                        <FaStore className={cx('profile-icon')}></FaStore>
                        <p>Thông tin CH</p>
                    </a>
                </div>
                <div className={cx('noti-and-avt')}>
                    <FaBell className={cx('noti-button')}></FaBell>
                    <div
                        className={cx('profile-img')}
                        style={{ backgroundImage: `url(${avt})` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default NewHeader;

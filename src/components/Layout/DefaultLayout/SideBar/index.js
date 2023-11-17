import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function SideBar() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
            </div>
        </div>
    );
}

export default SideBar;

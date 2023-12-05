import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from './Header';
import SideBar from './SideBar';

const cx = classNames.bind(styles);

function DefaultLayout({ children, title, back }) {
    return (
        <div className={cx('wrapper')}>
            <SideBar className={cx('dn')} title={title} />
            <div className={cx('container')}>
                <Header title={title} back={back} />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;

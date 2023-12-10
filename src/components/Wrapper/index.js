import classNames from 'classnames/bind';
import styles from './Wrapper.module.scss';

const cx = classNames.bind(styles);

function Wrapper({ children, title, className }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <div className={cx('title')}>{title}</div>
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default Wrapper;

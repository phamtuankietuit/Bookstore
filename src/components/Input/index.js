import classNames from 'classnames/bind';
import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function Input({ title, error, value, onChange, required, ...passProps }) {
    const props = {
        ...passProps,
    };

    return (
        <div className={cx('wapper')}>
            <div className={cx('title')}>
                {title}
                {required && <span className={cx('required')}> *</span>}
            </div>
            <input
                className={cx({ input: true, 'error-border': error })}
                value={value}
                onChange={onChange}
                {...props}
            />
            {error && <div className={cx('error')}>{error}</div>}
        </div>
    );
}

export default Input;

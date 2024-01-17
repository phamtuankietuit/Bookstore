import classNames from "classnames/bind";
import styles from './ValueComp.module.scss';

const cx = classNames.bind(styles);
const addCommas = (num) => {
    if (num !== undefined) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

function ValueComp({ title, value, percentComponent, className }) {
    const classes = cx('today', {
        [className]: className,
    })

    return (
        <div className={classes}>
            <div className={cx('today-title')}>{title}</div>
            <div className={cx('today-content')}>
                <div className={cx('today-num')}>{addCommas(value)}</div>
                {percentComponent}
            </div>
        </div>
    );
}

export default ValueComp;
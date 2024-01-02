import classNames from 'classnames/bind';
import styles from './SellItem.module.scss';
import memoize from 'memoize-one';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const SellItem = memoize(handleClick => [
    {
        name: 'STT',
        minWidth: '50px',
        center: true,
        cell: (row) => (
            <div className={cx('font')}>
                {row.index + 1}
            </div>
        ),
    },
    {
        cell: (row) => (
            <button onClick={handleClick}>click me</button>
        ),
    },
]);

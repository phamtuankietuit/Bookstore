import classNames from 'classnames/bind';
import styles from './SellItem.module.scss';
import memoize from 'memoize-one';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');



export const SellItem = memoize(() => {
    return [
        {
            name: 'STT',
            width: '50px',
            center: true,
            cell: (row) => (
                <div className={cx('font')}>
                    {row.index + 1}
                </div>
            ),
        },
        {
            width: '50px',
            center: true,
            cell: (row) => (
                <FontAwesomeIcon className={cx('icon')} icon={faTrashCan} />
            ),
        },
        {
            name: 'Ảnh',
            width: '80px',
            center: true,
            cell: (row) => (
                <div
                    className={cx('product-img')}
                    style={{
                        backgroundImage: `url('${row.featureImageUrl}')`,
                    }}
                ></div>
            ),
        },
        {
            name: 'Tên sản phẩm',
            center: true,
            grow: 2,
            cell: (row) => (
                <div className={cx('font', 'product-name')}>
                    {row.name}
                </div>
            ),
        },
        {
            name: 'Số lượng',
            center: true,
            cell: (row) => (
                <div className={cx('padding')}>
                    <input type='number' min={1} />
                </div>
            ),
        },
        {
            name: 'Đơn giá',
            center: true,
            cell: (row) => (
                <div className={cx('font')}>
                    {addCommas(row.salePrice)}
                </div>
            ),
        },
        {
            name: 'Thành tiền',
            center: true,
            cell: (row) => (
                <div className={cx('font')}>
                    {addCommas(row.totalPrice)}
                </div>
            ),
        },
    ]
});

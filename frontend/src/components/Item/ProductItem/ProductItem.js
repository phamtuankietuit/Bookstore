import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ProductItem.module.scss';
import noImage from '~/assets/images/no-image.png';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const ProductItem = [
    {
        name: 'Mã sản phẩm',
        grow: 2,
        minWidth: '250px',
        cell: (row) => (
            <div
                key={row.productId}
                className={cx('product-code-container')}
                data-tag="allowRowEvents"
            >
                <div
                    className={cx('product-img')}
                    style={{
                        backgroundImage: `url('${row.images[0] ? row.images[0] : noImage}')`,
                    }}
                    data-tag="allowRowEvents"
                ></div>
                <div
                    className={cx('product-id-name')}
                    data-tag="allowRowEvents"
                >
                    <div className={cx('product-id')} data-tag="allowRowEvents">
                        {row.productId}
                    </div>
                    <div
                        className={cx('product-name')}
                        data-tag="allowRowEvents"
                    >
                        {row.name}
                    </div>
                </div>
            </div>
        ),
    },
    {
        name: 'Trạng thái',
        center: true,
        minWidth: '180px',
        cell: (row) => (
            <div
                className={cx({
                    'product-state-container': true,
                    'state-0': row.isActive === true ? false : true,
                })}
                data-tag="allowRowEvents"
            >
                <FontAwesomeIcon
                    className={cx('product-state-icon')}
                    icon={row.isActive === true ? faCheck : faXmark}
                    data-tag="allowRowEvents"
                />
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.isActive === true ? 'Đang giao dịch' : 'Ngừng giao dịch'}
                </div>
            </div>
        ),
    },
    {
        name: 'Loại sản phẩm',
        center: true,
        minWidth: '180px',
        cell: (row) => (
            <div
                className={cx('product-type-container')}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-type')} data-tag="allowRowEvents">
                    {row.categoryText}
                </div>
            </div>
        ),
    },
    {
        name: 'Giá bán',
        text: 'salePrice',
        sortable: true,
        center: true,
        cell: (row) => (
            <div
                className={cx('product-value-container')}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-value')} data-tag="allowRowEvents">
                    {addCommas(row.salePrice)}
                </div>
            </div>
        ),
    },
    {
        name: 'Giá vốn',
        text: 'purchasePrice',
        sortable: true,
        center: true,
        cell: (row) => (
            <div
                className={cx('product-value-container')}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-value')} data-tag="allowRowEvents">
                    {addCommas(row.purchasePrice)}
                </div>
            </div>
        ),
    },
    {
        name: 'Tồn kho',
        text: 'currentStock',
        sortable: true,
        center: true,
        cell: (row) => (
            <div
                className={cx('product-value-container')}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-value')} data-tag="allowRowEvents">
                    {addCommas(row.currentStock)}
                </div>
            </div>
        ),
    },
];

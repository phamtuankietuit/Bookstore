import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './ModalProduct.module.scss';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const Item = [
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
                        backgroundImage: `url('${row.images[0]}')`,
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
        name: 'Giá nhập',
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

export default Item
import classNames from 'classnames/bind';
import styles from './DiscountItem.module.scss';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const DiscountItem = [
    {
        name: 'Mã khuyến mãi',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.id}
            </div>
        ),
    },
    {
        name: 'Tên khuyến mãi',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.name}
            </div>
        ),
    },
    {
        name: 'Số phiếu còn lại',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {addCommas(row.remainQuantity)}
            </div>
        ),
    },
    {
        name: 'Ngày bắt đầu',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.startAt}
            </div>
        ),
    },
    {
        name: 'Ngày kết thúc',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.closeAt}
            </div>
        ),
    },
    {
        name: 'Trạng thái',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div
                className={cx({
                    'product-state-container': true,
                    'state-1': row.status === 'paused' ? true : false,
                    'state-2': row.status === 'canceled' ? true : false,
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.status === 'running'
                        ? 'Đang chạy'
                        : row.status === 'paused'
                            ? 'Tạm ngừng'
                            : 'Đã hủy'}
                </div>
            </div>
        ),
    },
];

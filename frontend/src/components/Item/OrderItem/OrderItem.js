import classNames from 'classnames/bind';
import styles from './OrderItem.module.scss';

const cx = classNames.bind(styles);
// const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const OrderItem = [
    {
        name: 'Mã đơn hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.salesOrderId}
            </div>
        ),
    },
    {
        name: 'Ngày tạo đơn',
        minWidth: '180px',
        center: true,
        sortable: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.createdAt}
            </div>
        ),
    },
    {
        name: 'Tên khách hàng',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.customerName}
            </div>
        ),
    },
    {
        name: 'Khách phải trả',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.totalAmount}
            </div>
        ),
    },
    {
        name: 'Nhân viên tạo',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.staffCreated}
            </div>
        ),
    },
];

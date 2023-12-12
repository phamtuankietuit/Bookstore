import classNames from 'classnames/bind';
import styles from './ReturnItem.module.scss';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const ReturnItem = [
    {
        name: 'Mã đơn trả hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.id}
            </div>
        ),
    },
    {
        name: 'Mã đơn hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.idOrder}
            </div>
        ),
    },
    {
        name: 'Khách hàng',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.customerName}
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
                    'state-1': row.isReturnProduct === 1 ? true : false,
                    'state-2': row.isReturnProduct === 2 ? true : false,
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.isReturnProduct === 0
                        ? 'Đã nhận hàng'
                        : row.isReturnProduct === 1
                        ? 'Chưa nhận hàng'
                        : 'Đã hủy'}
                </div>
            </div>
        ),
    },
    {
        name: 'Hoàn tiền',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div
                className={cx({
                    'product-state-container': true,
                    'state-0': !row.isReturnMoney,
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.isReturnMoney ? 'Đã hoàn tiền' : 'Chưa hoàn tiền'}
                </div>
            </div>
        ),
    },
    {
        name: 'Tổng tiền',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {addCommas(row.money)}
            </div>
        ),
    },
    {
        name: 'Ngày nhận hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.dateRecieved}
            </div>
        ),
    },
    {
        name: 'Lý do trả hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.reason}
            </div>
        ),
    },
];

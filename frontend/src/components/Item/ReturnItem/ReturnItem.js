import classNames from 'classnames/bind';
import { format } from 'date-fns';
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
                {row.returnOrderId}
            </div>
        ),
    },
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
        name: 'Khách hàng',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.customerName}
            </div>
        ),
    },
    {
        name: 'Tổng tiền',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {addCommas(row.totalAmount)}
            </div>
        ),
    },
    {
        name: 'Ngày trả hàng',
        text: 'createdAt',
        sortable: true,
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {format(new Date(row.createdAt), 'dd/MM/yyyy - HH:mm')}
            </div>
        ),
    },
];

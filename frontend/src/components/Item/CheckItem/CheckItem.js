import classNames from 'classnames/bind';
import { format } from 'date-fns';
import styles from './CheckItem.module.scss';

const cx = classNames.bind(styles);

export const CheckItem = [
    {
        name: 'Mã đơn kiểm hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.adjustmentTicketId}
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
                    'state-1': row.status === 'unadjusted',
                    'state-2': row.status === 'cancelled',
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.status === 'adjusted'
                        ? 'Đã cân bằng'
                        : row.status === 'unadjusted'
                            ? 'Đang kiểm kho'
                            : 'Đã xóa'}
                </div>
            </div>
        ),
    },
    {
        name: 'Ngày tạo',
        sortable: true,
        text: 'createdAt',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {format(new Date(row.createdAt), 'dd/MM/yyyy - HH:mm')}
            </div>
        ),
    },
    {
        name: 'Ngày cân bằng',
        sortable: true,
        text: 'adjustmentBalance.createdAt',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row?.adjustmentBalance?.createdAt
                    && format(new Date(row?.adjustmentBalance?.createdAt), 'dd/MM/yyyy - HH:mm')}
            </div>
        ),
    },
    {
        name: 'Nhân viên tạo',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.staffName}
            </div>
        ),
    },
    {
        name: 'Nhân viên cân bằng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.adjustedStaffName}
            </div>
        ),
    },
];

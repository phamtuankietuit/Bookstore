import classNames from 'classnames/bind';
import styles from './CheckItem.module.scss';

const cx = classNames.bind(styles);

export const CheckItem = [
    {
        name: 'Mã đơn kiểm hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.id}
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
                    'state-1': row.status === 1 ? true : false,
                    'state-2': row.status === 2 ? true : false,
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.status === 0
                        ? 'Đã cân bằng'
                        : row.status === 1
                        ? 'Đang kiểm kho'
                        : 'Đã xóa'}
                </div>
            </div>
        ),
    },
    {
        name: 'Ngày tạo',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.dateCreated}
            </div>
        ),
    },
    {
        name: 'Ngày cân bằng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.dateBalanced}
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
    {
        name: 'Nhân viên cân bằng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.staffBalanced}
            </div>
        ),
    },
];

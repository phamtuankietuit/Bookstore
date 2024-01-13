import classNames from 'classnames/bind';
import styles from './ActivityItem.module.scss';
import format from 'date-fns/format'
const cx = classNames.bind(styles);
const convertISOtoDDMMYYYY = (isoDateString) => {
    let date = new Date(isoDateString);

    return format(date, 'dd/MM/yyyy - HH:mm');
}
export const ActivityItem = [
    {
        name: 'Người thao tác',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font', 'bold')} data-tag="allowRowEvents">
                {row.staffName}
            </div>
        ),
    },
    {
        name: 'Thời gian',
        text: 'createdAt',
        sortable: true,
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {convertISOtoDDMMYYYY(row.createdAt)}
            </div>
        ),
    },
    {
        name: 'Thao tác',
        minWidth: '180px',
        cell: (row) => (
            <div
                className={cx({
                    'product-state-container': true,
                    'state-1': row.activityType === 'update',
                    'state-2': row.activityType === 'delete',
                    'state-3': row.activityType === 'log_in',
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.activityType === 'create'
                        ? 'Thêm mới'
                        : row.activityType === 'update'
                            ? 'Cập nhật'
                            : row.activityType === 'delete'
                                ? 'Đã xóa'
                                : 'Đăng nhập'
                    }
                </div>
            </div>
        ),
    },
    {
        name: 'Nội dung',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.activityName}
            </div>
        ),
    },
];

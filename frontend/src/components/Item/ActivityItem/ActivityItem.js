import classNames from 'classnames/bind';
import styles from './ActivityItem.module.scss';

const cx = classNames.bind(styles);

export const ActivityItem = [
    {
        name: 'Người thao tác',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font', 'bold')} data-tag="allowRowEvents">
                {row.name}
            </div>
        ),
    },
    {
        name: 'Thời gian',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.createAt}
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
                    'state-1': row.operate === 'update',
                    'state-2': row.operate === 'remove',
                    'state-3': row.operate === 'login',
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.operate === 'create'
                        ? 'Thêm mới'
                        : row.operate === 'update'
                            ? 'Cập nhật'
                            : row.operate === 'remove'
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
                {row.content}
            </div>
        ),
    },
];

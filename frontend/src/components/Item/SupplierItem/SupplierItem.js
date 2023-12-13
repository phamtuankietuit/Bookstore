import classNames from 'classnames/bind';
import styles from './SupplierItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export const SupplierItem = [
    {
        name: 'Mã nhà cung cấp',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.id}
            </div>
        ),
    },
    {
        name: 'Tên nhà cung cấp',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.name}
            </div>
        ),
    },
    {
        name: 'Nhóm nhà cung cấp',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.group}
            </div>
        ),
    },
    {
        name: 'Email',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.email}
            </div>
        ),
    },
    {
        name: 'Số điện thoại',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.phone}
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
                    'state-0': !row.isActive,
                })}
                data-tag="allowRowEvents"
            >
                <FontAwesomeIcon
                    className={cx('product-state-icon')}
                    icon={row.isActive ? faCheck : faXmark}
                    data-tag="allowRowEvents"
                />
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.isActive ? 'Đang giao dịch' : 'Ngừng giao dịch'}
                </div>
            </div>
        ),
    },
];

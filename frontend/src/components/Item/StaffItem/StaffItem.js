import classNames from 'classnames/bind';
import styles from './StaffItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const StaffItem = [
    {
        name: 'Mã nhân viên',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.id}
            </div>
        ),
    },
    {
        name: 'Tên nhân viên',
        sortable: true,
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.name}
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
        name: 'Email',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.email}
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
                    {row.isActive ? 'Đang làm việc' : 'Đã nghỉ việc'}
                </div>
            </div>
        ),
    },
    {
        name: 'Vai trò',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {row.role}
            </div>
        ),
    },
];

import classNames from 'classnames/bind';
import styles from './CustomerItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const CustomerItem = [
    {
        name: 'Mã khách hàng',
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.customerId}
            </div>
        ),
    },
    {
        name: 'Tên khách hàng',
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
                {row.phoneNumber}
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
    {
        name: 'Tổng chi tiêu',
        text: 'salesOrderInformation.totalPay',
        center: true,
        sortable: true,
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {addCommas(row.salesOrderInformation.totalPay)}
            </div>
        ),
    },
    {
        name: 'Tổng đơn hàng',
        text: 'salesOrderInformation.purchasedOrder',
        center: true,
        sortable: true,
        minWidth: '180px',
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {addCommas(row.salesOrderInformation.purchasedOrder)}
            </div>
        ),
    },
];

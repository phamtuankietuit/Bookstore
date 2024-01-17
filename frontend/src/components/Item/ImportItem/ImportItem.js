import classNames from 'classnames/bind';
import styles from './ImportItem.module.scss';
import { format } from 'date-fns';
const cx = classNames.bind(styles);
const convertISOtoDDMMYYYY = (isoDateString) => {
    let date = new Date(isoDateString);
    return format(date, 'dd/MM/yyyy - HH:mm');
}
export const ImportItem = [
    {
        name: 'Mã đơn nhập hàng',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'id')} data-tag="allowRowEvents">
                {row.purchaseOrderId}
            </div>
        ),
    },
    {
        name: 'Ngày nhập hàng',
        text: 'createdAt',
        minWidth: '180px',
        center: true,
        sortable: true,
        cell: (row) => (
            <div className={cx('font')} data-tag="allowRowEvents">
                {convertISOtoDDMMYYYY(row.createdAt)}
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
                    'state-0': !(row.paymentDetails.status === 'paid'),
                })}
                data-tag="allowRowEvents"
            >
                <div className={cx('product-state')} data-tag="allowRowEvents">
                    {row.paymentDetails.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </div>
            </div>
        ),
    },
    {
        name: 'Nhà cung cấp',
        minWidth: '180px',
        center: true,
        cell: (row) => (
            <div className={cx('font', 'overflow')} data-tag="allowRowEvents">
                {row.supplierName}
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
];

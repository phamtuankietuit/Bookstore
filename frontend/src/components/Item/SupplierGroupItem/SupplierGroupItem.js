import classNames from 'classnames/bind';
import styles from './SupplierGroupItem.module.scss';

const cx = classNames.bind(styles);

export const SupplierGroupItem = [
    {
        name: 'Tên nhóm',
        minWidth: '180px',
        cell: (row) => <div className={cx('type')}>{row.name}</div>,
    },
    {
        name: 'Mã nhóm',
        minWidth: '180px',
        cell: (row) => <div className={cx('type')}>{row.id}</div>,
    },
];

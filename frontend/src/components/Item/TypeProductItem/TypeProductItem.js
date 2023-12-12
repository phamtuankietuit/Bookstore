import classNames from 'classnames/bind';
import styles from './TypeProductItem.module.scss';

const cx = classNames.bind(styles);

export const TypeProductItem = [
    {
        name: 'Tên loại sản phẩm',
        minWidth: '180px',
        cell: (row) => <div className={cx('type')}>{row.name}</div>,
    },
    {
        name: 'Mã loại',
        minWidth: '180px',
        cell: (row) => <div className={cx('type')}>{row.id}</div>,
    },
];

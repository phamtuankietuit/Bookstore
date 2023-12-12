import classNames from 'classnames/bind';
import styles from './TypeProductItem.module.scss';

const cx = classNames.bind(styles);

export const TypeProductItem = [
    {
        name: 'Tên loại sản phẩm',
        cell: (row) => <div className={cx('type')}>{row.name}</div>,
    },
    {
        name: 'Mã loại',
        cell: (row) => <div className={cx('type')}>{row.id}</div>,
    },
];

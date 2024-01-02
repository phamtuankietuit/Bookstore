import React from 'react';
import classNames from 'classnames/bind';
import styles from './ListImportProduct.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function ListImportProduct({ list }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('columns')}>
                <div className={cx('columns-item-1')}>STT</div>
                <div className={cx('columns-item-1')}>Ảnh</div>
                <div className={cx('columns-item-2')}>Tên sản phẩm</div>
                <div className={cx('columns-item-3')}>Số lượng nhập</div>
                <div className={cx('columns-item-3')}>Đơn giá</div>
                <div className={cx('columns-item-3')}>Thành tiền</div>
            </div>
            <div className={cx('list-import')}>
                {list.map((item, index) => (
                    <div className={`${cx('item')}`} key={item.productId}>
                        <div className={cx('columns-item-1')}>{index + 1}</div>
                        <div className={cx('columns-item-1')}>
                            <img src={item.featureImageUrl} className={cx('img')} />
                        </div>
                        <div className={cx('columns-item-2')}>
                            <div className={cx('item_name')}>{item.name}</div>
                            <div>{item.sku}</div>
                        </div>
                        <div className={cx('columns-item-3')}>{item.orderQuantity}</div>
                        <div className={cx('columns-item-3')}>
                            <div>{addCommas(item.purchasePrice ? item.purchasePrice : 0)}</div>
                        </div>
                        <div className={cx('columns-item-3')}>
                            {addCommas(item.totalPrice ? item.totalPrice : 0)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListImportProduct;

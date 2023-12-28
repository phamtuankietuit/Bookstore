import React from 'react';
import classNames from 'classnames/bind';
import styles from './ListBillProduct.module.scss';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function ListBillProduct({ list }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('table-firstRow')}>
                <div className={cx('table-column-1')}>STT</div>
                <div className={cx('table-column-1')}>Ảnh</div>
                <div className={cx('table-column-2')}>Tên sản phẩm</div>
                <div className={cx('table-column-3')}>Số lượng</div>
                <div className={cx('table-column-3')}>Đơn giá</div>
                <div className={cx('table-column-3')}>Chiết khấu</div>
                <div className={cx('table-column-4')}>Thành tiền</div>
            </div>
            <div className={cx('list-product')}>
                {list.map((item, index) => (
                    <div className={`${cx('item')}`} key={item.productId}>
                        <div className={cx('table-column-1')}>{index + 1}</div>
                        <div className={cx('table-column-1')}>
                            <img src={item.featureImageUrl} className={cx('img')} alt="" />
                        </div>
                        <div className={cx('table-column-2')}>
                            <div>{item.name}</div>
                            <div>{item.sku}</div>
                        </div>
                        <div className={cx('table-column-3')}>{item.quantity}</div>
                        <div className={cx('table-column-3')}>
                            <div>{addCommas(item.salePrice)}</div>
                        </div>
                        <div className={cx('table-column-3')}>
                            <div>{addCommas(0)}</div>
                        </div>
                        <div className={cx('table-column-4')}>
                            {addCommas(item.totalPrice)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListBillProduct;

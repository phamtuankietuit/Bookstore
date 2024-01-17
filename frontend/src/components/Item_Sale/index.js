import React from 'react';
import classNames from 'classnames/bind';
import styles from './Item_Sale.module.scss';
import { FaTrashCan } from "react-icons/fa6";
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function Item_Sale({ product, index, funtion, update }) {
    const [obj, setObj] = useState();
    const [total, setTotal] = useState(0);
    useEffect(() => {

        setObj(product)
        setTotal(product.salePrice)

    }, [obj]);

    const totalValue = () => {
        let newObj = obj;
        newObj['totalPrice'] = newObj['quantity'] * newObj['salePrice'];
        setTotal(newObj['quantity'] * newObj['salePrice']);
        setObj(newObj)
        update()
    }

    const ChangreNums = (value) => {
        let newObj = obj;
        newObj['quantity'] = parseInt(value);
        setObj(newObj)
        totalValue()
    }
    return (
        <div className={`align-items-center ${cx('item')}`}>
            <div className={cx('properties-1')}>
                {index}
            </div>
            <div className={cx('properties-1')}>
                <img src={product.featureImageUrl} className={cx('img')} />
            </div>
            <div className={cx('properties-1')}>
                <div>{product.sku}</div>
            </div>
            <div className={cx('properties-2')}>
                <div className='fs-6'>{product.name}</div>
            </div>
            <div className={`${cx('properties-3')}`}>

                <input className={cx('textfield')} type="number" min={1} max={product.stock} defaultValue={product.quantity} onChange={(e) => {
                    if (e.target.value > product.stock) e.target.value = product.stock;
                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;

                    ChangreNums(e.target.value)
                }} inputMode='numeric' />
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(product.salePrice)}</div>
            </div>

            <div className={cx('properties-3')}>
                {addCommas(total)}
            </div>
            <div className={cx('properties-1')}>
                <FaTrashCan className={cx('icon')} onClick={(e) => funtion(product.productId, index)} />
            </div>

        </div>
    );
}

export default Item_Sale;
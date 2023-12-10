import React from 'react';
import classNames from 'classnames/bind';
import styles from './Item_Return.module.scss';
import { FaX } from "react-icons/fa6";
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function Item_Return({ product, index, update }) {

    const [obj, setObj] = useState();
    useEffect(() => {
        setObj(product)
    }, [obj]);

    const [total, setTotal] = useState(0)
    const totalValue = () => {
        let newObj = obj;
        newObj['total'] = newObj['nums'] * newObj['cost'];
        setObj(newObj)
        setTotal(newObj['nums'] * newObj['cost'])
        update()
    }

    const ChangreNums = (value) => {
        let newObj = obj;
        newObj['nums'] = parseInt(value);
        setObj(newObj)
        totalValue()
    }
    return (
        <div className={`align-items-center ${cx('item')}`}>
            <div className={cx('properties-1')}>
                {index}
            </div>
            <div className={cx('properties-1')}>
                <img src={product.img} className={cx('img')} />
            </div>
            <div className={cx('properties-2')}>
                <div className='fs-6'>{product.name}</div>
                <div>{product.sku}</div>
            </div>
            <div className={`${cx('properties-3')}`}>
                <input className={cx('textfield')} defaultValue={0} type="number" onChange={(e) => {
                    if (e.target.value > product.maxnums) e.target.value = product.maxnums;
                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;
                    ChangreNums(e.target.value)

                }} inputMode='numeric' />/{product.maxnums}
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(product.cost)}</div>
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(total)}</div>
            </div>
        </div>
    );
}

export default Item_Return;
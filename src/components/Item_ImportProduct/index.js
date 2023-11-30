import React from 'react';
import classNames from 'classnames/bind';
import styles from './Item_ImportProduct.module.scss';
import { FaX } from "react-icons/fa6";
import { useEffect, useState } from 'react';


const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function Item_import({ product, index, funtion, update }) {
    const [obj, setObj] = useState();
    useEffect(() => {

        setObj(product)

    }, [obj]);


    const totalValue = () => {
        let newObj = obj;
        newObj['total'] = newObj['nums'] * newObj['cost'];
        setObj(newObj)
        update()
    }

    const ChangreNums = (value) => {
        let newObj = obj;
        newObj['nums'] = value;
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
                <input className={cx('textfield')} type="number" min={0} max={100} onChange={(e) => {
                    if (e.target.value > 100) e.target.value = 100;
                    else if (e.target.value < 0) e.target.value = 0;
                    ChangreNums(e.target.value)
                }} inputMode='numeric' />
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(product.cost)}</div>
            </div>

            <div className={cx('properties-3')}>
                {addCommas(product.total)}
            </div>
            <div className={cx('properties-1')}>
                <FaX className={cx('icon')} onClick={(e) => funtion(product.id, index)} />
            </div>

        </div>
    );
}

export default Item_import;
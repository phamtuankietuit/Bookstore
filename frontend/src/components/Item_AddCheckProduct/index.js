import React from 'react';
import classNames from 'classnames/bind';
import styles from './Item_AddCheckProduct.module.scss';
import { FaX } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

const cx = classNames.bind(styles);

function Item_Check({ product, index, funtion }) {
    const [obj, setObj] = useState();

    const [adjustedQuantity, setAdjustedQuantity] = useState();

    useEffect(() => {
        setObj(product);
        setAdjustedQuantity(product.adjustedQuantity);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [obj]);

    const ChangeNum = (value) => {
        let newObj = obj;
        newObj['quantity'] = parseInt(value);
        newObj['adjustedQuantity'] = parseInt(value) - obj.currentStock;
        setAdjustedQuantity(parseInt(value) - obj.currentStock);
        setObj(newObj);
    }

    const ChangeNote = (value) => {
        let newObj = obj;
        newObj['reason'] = value;
        setObj(newObj);
    }

    return (
        <div className={`align-items-center ${cx('item')}`}>
            <div className={cx('properties-1')}>
                {index}
            </div>
            <div className={cx('properties-1')}>
                <img src={product.featureImageUrl} className={cx('img')} alt='' />
            </div>
            <div className={cx('properties-2')}>
                <div className='fs-6'>{product.productName}</div>
                <div>{product.productId}</div>
            </div>
            <div className={`${cx('properties-3')}`}>
                <input
                    className={cx('textfield')}
                    type="number"
                    inputMode='numeric'
                    min={0}
                    defaultValue={product.quantity}
                    onChange={(e) => {
                        if (e.target.value < 0 || e.target.value === '') e.target.value = 0;

                        ChangeNum(e.target.value);
                    }}
                />
            </div>

            <div className={` ${cx('properties-1')}`}>
                {product.currentStock}
            </div>

            <div className={cx('properties-3')}>
                {adjustedQuantity}
            </div>
            <div className={cx('properties-3')}>
                <Form.Control type="text" className={`w-75 ${cx('form')}`} placeholder='Nhập lý do' onChange={(e) => ChangeNote(e.target.value)} defaultValue={product.reason} />
            </div>
            <div className={cx('properties-1')}>
                <FaX className={cx('icon')} onClick={(e) => funtion(product.productId, index)} />
            </div>
        </div>
    );
}

export default Item_Check;
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Item_AddCheckProduct.module.scss';
import { FaX } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

const cx = classNames.bind(styles);
function Item_Check({ product, index, funtion }) {
    const [obj, setObj] = useState();
    useEffect(() => {
        setObj(product)
    }, [obj]);


    const ChangreNums = (value) => {
        let newObj = obj;
        newObj['actualexistence'] = parseInt(value);
        setObj(newObj)
    }
    const ChangreNote = (value) => {
        let newObj = obj;
        newObj['note'] = value;
        setObj(newObj)
    }

    const ChangreReason = (value) => {
        let newObj = obj;
        newObj['reason'] = value;
        setObj(newObj)
    }
    return (
        <div className={`align-items-center ${cx('item')}`}>
            <div className={cx('properties-1')}>
                {index}
            </div>
            <div className={cx('properties-1')}>
                <img src={product.featureImageUrl} className={cx('img')} />
            </div>
            <div className={cx('properties-2')}>
                <div className='fs-6'>{product.name}</div>
                <div>{product.sku}</div>
            </div>
            <div className={`${cx('properties-3')}`}>
                <input className={cx('textfield')} type="number" min={0} defaultValue={product.actualexistence} onChange={(e) => {
                    if (e.target.value < 0 || e.target.value === '') e.target.value = 0;
                    ChangreNums(e.target.value)
                }} inputMode='numeric' />
            </div>

            <div className={` ${cx('properties-3')}`}>
                <Form.Select aria-label="Default select example" className={`w-75 ${cx('form')}`} onChange={(e) => ChangreReason(e.target.value)} defaultValue={product.reason}>
                    <option value="Khác">Khác</option>
                    <option value="Hư hỏng">Hư hỏng</option>
                    <option value="Hao mòn">Hao mòn</option>
                    <option value="Trả hàng">Trả hàng</option>
                    <option value="Chuyển hàng">Chuyển hàng</option>
                    <option value="Sản xuất sản phẩm">Sản xuất sản phẩm</option>
                </Form.Select>
            </div>

            <div className={cx('properties-3')}>
                <Form.Control type="text" className={`w-75 ${cx('form')}`} placeholder='Nhập ghi chú' onChange={(e) => ChangreNote(e.target.value)} defaultValue={product.note} />
            </div>
            <div className={cx('properties-1')}>
                <FaX className={cx('icon')} onClick={(e) => funtion(product.productId, index)} />
            </div>

        </div>
    );
}

export default Item_Check;
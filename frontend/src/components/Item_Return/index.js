import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Item_Return.module.scss';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

function Item_Return({ product, index, key, changeTotalPrice }) {

    const [obj, setObj] = useState();
    const [total, setTotal] = useState(0);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setObj(product);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [obj]);


    const changeTotal = (value) => {
        changeTotalPrice(index - 1, value, value * obj.salePrice);
        setObj(
            {
                ...obj,
                totalPrice: value * obj.salePrice,
            }
        );

        setTotal(value * obj.salePrice);
    }

    const changeQuantity = (value) => {
        setObj(
            {
                ...obj,
                quantity: value,
            }
        );

        setQuantity(value);
        changeTotal(value);
    }

    return (
        <div key={key} className={`align-items-center ${cx('item')}`}>
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
                <input
                    className={cx('textfield')}
                    value={quantity}
                    onChange={(e) => {
                        let value = removeNonNumeric(e.target.value);
                        if (value > obj.maxQuantity) {
                            value = quantity;
                        }
                        changeQuantity(value);
                    }}
                />/{product.maxQuantity}
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(product.salePrice)}</div>
            </div>

            <div className={cx('properties-3')}>
                <div>{addCommas(total)}</div>
            </div>
        </div>
    );
}

export default Item_Return;
import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import classNames from 'classnames/bind';
import styles from './item.module.scss';
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const cx = classNames.bind(styles);
function item({ product }) {
    return (
        <div className={cx('item')}>
            <Row>
                <Col xs={4} md={1} lg={1} className='d-flex align-items-center'>
                    <img src={product.featureImageUrl ? product.featureImageUrl : product.images[0]} className={`${cx('pr-img')}  mx-auto my-auto d-block`} />
                </Col>
                <Col xs={6} md={6} lg={6}>
                    <p className={cx('item_name')}>{product.name}</p>
                    <p>{product.sku}</p>
                </Col>
                <Col xs md={5} lg={5}>
                    <p>Giá nhập : {addCommas(product.purchasePrice)}</p>
                    <p>Tồn kho : {product.currentStock}</p>
                </Col>

            </Row>

        </div>
    );
}

export default item;
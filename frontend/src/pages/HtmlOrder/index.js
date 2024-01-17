import React from 'react';
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from './HtmlOrder.module.scss';
import { format } from 'date-fns';

import * as locationServices from '~/apiServices/locationServices';

const cx = classNames.bind(styles);

const addCommas = (num) => {
    if (num !== undefined && num !== null) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}


const HtmlOrder = React.forwardRef(({ object, customer }, ref) => {

    const [store, setStore] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const response = await locationServices.getStore()
                .catch((error) => {
                    console.log(error);
                });

            if (response) {
                // console.log(response.data[0]);
                setStore(response.data[0]);
            }
        }

        fetch();
    }, []);

    console.log(object);

    return (
        <div className={cx('wrapper')} ref={ref}>
            <div className={cx('inner')}>

                <div className={cx('section1')}>
                    <div className={cx('name')}>
                        {store?.name}
                    </div>
                    <div className={cx('address')}>
                        {store?.address}
                    </div>
                    <div className={cx('phone')}>
                        {store?.contact?.phone}
                    </div>
                </div>

                <div className={cx('break')}></div>

                <div className={cx('section2')}>
                    <div className={cx('title')}>
                        HÓA ĐƠN BÁN HÀNG
                    </div>
                    <div className={cx('space')}>
                        <div className={cx('id')}>
                            Mã: {object?.salesOrderId}
                        </div>
                        <div className={cx('time')}>
                            Ngày: {object?.createdAt && format(new Date(object?.createdAt), 'dd/MM/yyyy - HH:mm')}
                        </div>
                    </div>
                </div>

                <div className={cx('break')}></div>

                <div className={cx('section3')}>
                    <div className={cx('cus-name')}>
                        Khách hàng: <b>{customer?.name}</b>
                    </div>
                    <div className={cx('cus-phone')}>
                        Số điện thoại: {customer?.phoneNumber}
                    </div>
                    <div className={cx('cus-address')}>
                        Địa chỉ: {customer?.address}
                    </div>
                </div>

                <div className={cx('break')}></div>

                <div className={cx('section4')}>
                    <div className={cx('header')}>
                        Đơn giá
                    </div>
                    <div className={cx('header')}>
                        Số lượng
                    </div>
                    <div className={cx('header')}>
                        Thành tiền
                    </div>
                </div>

                <div className={cx('break')}></div>

                <div className={cx('section5')}>
                    {object?.items.map((item, index) =>
                    (
                        <div
                            className={cx('wrapper-item')}
                            key={index}
                        >
                            <div className={cx('name-item')}><b>{item.name}</b></div>
                            <div className={cx('space-item')}>
                                <div>{addCommas(item.salePrice)}</div>
                                <div>{addCommas(item.quantity)}</div>
                                <div>{addCommas(item.totalPrice)}</div>
                            </div>
                        </div>
                    ))
                    }
                </div>

                <div className={cx('break')}></div>

                <div className={cx('section6')}>
                    <div className={cx('space-6')}>
                        <div>Tổng tiển hàng</div>
                        <div>{addCommas(object?.subtotal)}</div>
                    </div>
                    <div className={cx('space-6')}>
                        <div>Chiết khấu thường</div>
                        <div>{
                            addCommas(
                                (object?.discountItems
                                    ?.find((element) => element.source === 'manual')
                                    ||
                                    { amount: 0 }).amount
                            )
                        }</div>
                    </div>
                    <div className={cx('space-6')}>
                        <div>Chiết khấu khuyến mãi</div>
                        <div>{
                            addCommas(
                                (object
                                    ?.discountItems
                                    ?.find((element) => element?.source === 'promotion')
                                    ||
                                    { amount: 0 }).amount
                            )
                        }</div>
                    </div>
                    <div className={cx('space-6')}>
                        <div><b>Khách phải trả</b></div>
                        <div><b>{addCommas(object?.totalAmount)}</b></div>
                    </div>
                    <div className={cx('space-6')}>
                        <div>Tiền khách đưa</div>
                        <div>{addCommas(object?.paymentDetails?.paidAmount)}</div>
                    </div>
                    <div className={cx('space-6')}>
                        <div>Trả lại:</div>
                        <div>{addCommas(Math.abs(object?.paymentDetails?.remainAmount))}</div>
                    </div>
                </div>

                <div className={cx('section7')}>
                    Cảm ơn quý khách. Hẹn gặp lại!
                </div>

            </div>
        </div>
    );
});

export default HtmlOrder;
import styles from './BillInfo.module.scss';
import classNames from 'classnames/bind';
import { GrPrint } from 'react-icons/gr';
import { FaRegCopy } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import ListBillProduct from '~/components/ListBillProduct';
import React, { useEffect, useState } from 'react';
import { data } from './/data';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function BillInfo() {
    return (
        <div className={cx('container')}>
            <div className={cx('MainInfo-and-Status')}>
                <div className={cx('MainInfo')}>
                    <div className={cx('BillCode')}>
                        <p>HD001</p>
                        <div className={cx('BillStatus')}>
                            <p>Hoàn thành</p>
                        </div>
                    </div>
                    <div className={cx('Print-and-Copy')}>
                        <div className={cx('Print-btn')}>
                            <GrPrint className={cx('Print-icon')}></GrPrint>
                            <p>In đơn hàng</p>
                        </div>
                        <div className={cx('Copy-btn')}>
                            <FaRegCopy className={cx('Copy-icon')}></FaRegCopy>
                            <p>Sao chép</p>
                        </div>
                        <div className={cx('Staff-info')}>
                            <IoPerson className={cx('staff-icon')}></IoPerson>
                            <p>Bán bởi: </p>
                            <p>Quân</p>
                        </div>
                        <div className={cx('Date-info')}>
                            <FaCalendarAlt
                                className={cx('Date-icon')}
                            ></FaCalendarAlt>
                            <p>Ngày bán: </p>
                            <p>12/11/2023</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('Bill-Content')}>
                <div className={cx('Content-grid1')}>
                    <div className={cx('Customer-Info')}>
                        <div className={cx('title')}>
                            <p>Thông tin khách hàng</p>
                        </div>
                        <div className={cx('Info')}>
                            <div className={cx('Info-name-phone')}>
                                <span className={cx('name')}>Khách lẻ</span>
                                <span>-</span>
                                <span className={cx('phone')}>0905564417</span>
                            </div>
                            <div className={cx('Info-contact')}>
                                <p>LIÊN HỆ</p>
                                <div className={cx('input-container')}>
                                    <input
                                        type="text"
                                        readOnly
                                        className={cx('input-text')}
                                        value={'Email'}
                                    ></input>
                                    <input
                                        type="text"
                                        readOnly
                                        className={cx('input-text')}
                                        value={'0905564417'}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('Content-grid2')}>
                    <div className={cx('Bill-Note')}>
                        <div className={cx('title')}>
                            <p>Ghi chú</p>
                        </div>
                        <div className={cx('Note-content')}>
                            <p>Chưa có ghi chú</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('List-Product')}>
                <div className={cx('List-content')}>
                    <div className={cx('title')}>
                        <p>Thông tin sản phẩm</p>
                    </div>
                    <ListBillProduct list={data.list} />
                    <div className={cx('list-sum')}>
                        <div className={cx('list-sum-content')}>
                            <div className={cx('list-sum-content1')}>
                                <p>Tổng tiền</p>
                                <p>VAT</p>
                                <p>Chiết khấu</p>
                                <p>
                                    <b>Khách phải trả</b>
                                </p>
                            </div>
                            <div className={cx('list-sum-content2')}>
                                <p>{addCommas(data.total)}</p>
                                <p>{data.vat}</p>
                                <p>{data.discount}</p>
                                <p>{addCommas(data.paid)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('button-container')}>
                <a href="/editbillinfo" className={cx('edit-btn')}>
                    Sửa
                </a>
            </div>
        </div>
    );
}

export default BillInfo;
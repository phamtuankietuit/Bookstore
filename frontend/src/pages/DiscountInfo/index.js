import styles from './DiscountInfo.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { BiSolidDiscount } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function DiscountInfo() {
    const navigate = useNavigate();
    return (
        <div className={cx('container')}>
            <div className={cx('discount-container')}>
                <div className={cx('tag-and-time')}>
                    <div className={cx('discount-tag')}>
                        <div className={cx('left-tag')}>
                            <span className={cx('left-tag-circle1')}></span>
                            <span className={cx('left-tag-circle2')}></span>
                        </div>
                        <div className={cx('discount-tag-content')}>
                            <div className={cx('content')}>
                                <h4>20% Off</h4>
                                <p>Siêu giảm giá</p>
                                <p>Ngày kết thúc: 17/12/2023</p>
                            </div>
                            <div className={cx('logo')}></div>
                        </div>
                        <div className={cx('right-tag')}>
                            <span className={cx('right-tag-circle1')}></span>
                            <span className={cx('right-tag-circle2')}></span>
                        </div>
                    </div>
                    <div className={cx('available-date')}>
                        <div className={cx('div-title')}>
                            <p>Thông tin áp dụng</p>
                        </div>
                        <div className={cx('date-content')}>
                            <div className={cx('date-content-content-grid1')}>
                                <div className={cx('first-column')}>
                                    <p>Ngày bắt đầu</p>
                                </div>
                                <div className={cx('split')}>
                                    <p>:</p>
                                </div>
                                <div className={cx('second-column')}>
                                    <p>7/12/2023</p>
                                </div>
                            </div>
                            <div className={cx('date-content-content-grid1')}>
                                <div className={cx('first-column')}>
                                    <p>Ngày kết thúc</p>
                                </div>
                                <div className={cx('split')}>
                                    <p>:</p>
                                </div>
                                <div className={cx('second-column')}>
                                    <p>17/12/2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('discount-title')}>
                    <BiSolidDiscount
                        className={cx('title-icon')}
                    ></BiSolidDiscount>
                    <p>Thông tin chương trình</p>
                </div>
                <div className={cx('main-info')}>
                    <div className={cx('div-title')}>
                        <p>Thông tin chung</p>
                    </div>
                    <div className={cx('main-info-content')}>
                        <div className={cx('main-info-content-grid1')}>
                            <div className={cx('first-column')}>
                                <p>Tên khuyến mãi</p>
                                <p>Phương thức khuyến mãi</p>
                            </div>
                            <div className={cx('split')}>
                                <p>:</p>
                                <p>:</p>
                            </div>
                            <div className={cx('second-column')}>
                                <p>Siêu giảm giá</p>
                                <p>Chiết khấu theo tổng giá trị đơn hàng</p>
                            </div>
                        </div>
                        <div className={cx('main-info-content-grid1')}>
                            <div className={cx('first-column')}>
                                <p>Mã khuyến mãi</p>
                                <p>Mô tả</p>
                            </div>
                            <div className={cx('split')}>
                                <p>:</p>
                                <p>:</p>
                            </div>
                            <div className={cx('second-column')}>
                                <p>SS501</p>
                                <p>Siêu giảm giá tuần lễ vàng</p>
                            </div>
                        </div>
                        <div className={cx('main-info-content-grid1')}>
                            <div className={cx('first-column')}>
                                <p>Thời gian còn lại</p>
                            </div>
                            <div className={cx('split')}>
                                <p>:</p>
                            </div>
                            <div className={cx('second-column')}>
                                <p>10 ngày</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('discount-condition')}>
                    <div className={cx('div-title')}>
                        <p>Điều kiện khuyến mãi</p>
                    </div>
                    <div className={cx('condition-content')}>
                        <div className={cx('first-row')}>
                            <p>Giá trị từ</p>
                        </div>
                        <div className={cx('first-row')}>
                            <p>Giá trị đến</p>
                        </div>
                        <div className={cx('first-row')}>
                            <p>Chiết khấu</p>
                        </div>
                        <div className={cx('second-row')}>
                            <p>500000</p>
                        </div>
                        <div className={cx('second-row')}>
                            <p>5000000</p>
                        </div>
                        <div className={cx('second-row')}>
                            <p>10</p>
                        </div>
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <button
                        className={cx('edit-btn')}
                        onClick={() => navigate('/discounts/update/KH0001')}
                    >
                        Sửa
                    </button>
                    <button className={cx('stop-btn')}>Tạm ngừng</button>
                </div>
            </div>
        </div>
    );
}

export default DiscountInfo;

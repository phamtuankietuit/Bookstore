import styles from './EditDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState } from 'react';

const cx = classNames.bind(styles);

function EditDiscount() {
    const [disable, SetDisable] = useState(false);

    const DisableInputText = () => {
        SetDisable(!disable);
    };

    return (
        <div className={cx('container')}>
            <div className={cx('grid1')}>
                <div className={cx('grid1-maininfo')}>
                    <div className={cx('title')}>
                        <p>Thông tin chung</p>
                    </div>
                    <div className={cx('input-text-container')}>
                        <div className={cx('input-text')}>
                            <div>
                                <p>Tên khuyến mãi</p>
                                <input
                                    type="text"
                                    placeholder="Nhập tên của khuyến mãi"
                                ></input>
                            </div>
                        </div>
                        <div className={cx('input-text')}>
                            <div>
                                <p>Mã khuyến mãi</p>
                                <input
                                    type="text"
                                    placeholder="Nhập mã khuyến mãi"
                                ></input>
                            </div>
                        </div>
                        <div className={cx('input-text')}>
                            <div>
                                <p>Số lượng áp dụng</p>
                                <input
                                    type="text"
                                    placeholder="Nhập số lượng áp dụng"
                                    disabled={disable}
                                ></input>
                            </div>
                        </div>
                        <div className={cx('input-text')}>
                            <div>
                                <p>Mô tả</p>
                                <input
                                    type="text"
                                    placeholder="Nhập mô tả cho khuyến mãi"
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className={cx('checkbox-wrapper')}>
                        <input
                            onClick={DisableInputText}
                            id="cb"
                            type="checkbox"
                        ></input>
                        <label htmlFor="cb">Không giới hạn số lượng</label>
                    </div>
                </div>
                <div className={cx('grid1-discount-info')}>
                    <div className={cx('title')}>
                        <p>Thông tin khuyến mãi</p>
                    </div>
                    <div className={cx('discount-content')}>
                        <p>Phương thức khuyến mãi</p>
                        <div className={cx('table')}>
                            <div className={cx('table-FirstRow')}>
                                <p>Chiết khấu theo tổng giá trị đơn hàng</p>
                            </div>
                            <div className={cx('table-SecondAndThirdRow')}>
                                <div className={cx('table-SecondRow')}>
                                    <p>Giá trị từ</p>
                                </div>
                                <div className={cx('table-SecondRow')}>
                                    <p>Giá trị đến</p>
                                </div>
                                <div className={cx('table-SecondRow')}>
                                    <p>Chiết khấu</p>
                                </div>
                                <div className={cx('table-ThirdRow')}>
                                    <input type="text"></input>
                                </div>
                                <div className={cx('table-ThirdRow')}>
                                    <input type="text"></input>
                                </div>
                                <div className={cx('table-ThirdRow')}>
                                    <input type="text"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('grid2')}>
                <div className={cx('grid2-AvailableDate')}>
                    <div className={cx('title')}>
                        <p>Thời gian áp dụng</p>
                    </div>
                    <div className={cx('daterange-container')}>
                        <DateRange></DateRange>
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <button className={cx('cancel-but')}>Huỷ</button>
                    <button className={cx('save-but')}>Lưu</button>
                </div>
            </div>
        </div>
    );
}

export default EditDiscount;

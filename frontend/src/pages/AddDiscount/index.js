import styles from './AddDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState } from 'react';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

const percent = (num) => {
    if (num < 0) return '0';
    if (num > 100) return '100';
    return num.toString();
};

function AddDiscount() {
    const [disable, SetDisable] = useState(false);

    const DisableInputText = () => {
        SetDisable(!disable);
    };

    const [dateString, setDateString] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [discount, setDiscount] = useState('');

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
                                    <input
                                        type="text"
                                        value={start}
                                        onChange={(e) =>
                                            setStart(
                                                addCommas(
                                                    removeNonNumeric(
                                                        e.target.value,
                                                    ),
                                                ),
                                            )
                                        }
                                    ></input>
                                </div>
                                <div className={cx('table-ThirdRow')}>
                                    <input
                                        type="text"
                                        value={end}
                                        onChange={(e) =>
                                            setEnd(
                                                addCommas(
                                                    removeNonNumeric(
                                                        e.target.value,
                                                    ),
                                                ),
                                            )
                                        }
                                    ></input>
                                </div>
                                <div className={cx('table-ThirdRow')}>
                                    <input
                                        type="text"
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(
                                                percent(
                                                    removeNonNumeric(
                                                        e.target.value,
                                                    ),
                                                ),
                                            )
                                        }
                                    ></input>
                                    <span>%</span>
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
                        <DateRange
                            dateString={dateString}
                            setDateString={setDateString}
                        />
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <button className={cx('save-but')}>Lưu</button>
                    <button className={cx('save-add-but')}>
                        Lưu và kích hoạt
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddDiscount;

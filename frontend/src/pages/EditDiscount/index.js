import styles from './EditDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as PromotionsServices from '~/apiServices/promotionServices';
import Spinner from 'react-bootstrap/Spinner';
const cx = classNames.bind(styles);

function EditDiscount() {
    const [disable, SetDisable] = useState(false);

    const DisableInputText = () => {
        SetDisable(!disable);
    };
    const promotiontid = useParams();
    const [obj, setObj] = useState(null);
    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await PromotionsServices.getPromotion(promotiontid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);

        }

        fetchApi();

    }, []);
    return (
        <div>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
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
                                            defaultValue={obj.name}
                                            placeholder="Nhập tên của khuyến mãi"
                                        ></input>
                                    </div>
                                </div>
                                <div className={cx('input-text')}>
                                    <div>
                                        <p>Mã khuyến mãi</p>
                                        <input
                                            type="text"
                                            defaultValue={obj.promotionId}
                                            disabled
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
                                            defaultValue={obj.applyToQuantity}
                                            disabled={disable}
                                        ></input>
                                    </div>
                                </div>
                                <div className={cx('input-text')}>
                                    <div>
                                        <p>Mô tả</p>
                                        <input
                                            type="text"
                                            defaultValue={obj.type}
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
                                            <input type="text" defaultValue={obj.applyFromAmount}></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input type="text" defaultValue={obj.applyToAmount}></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input type="text" defaultValue={obj.discountRate}></input>
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
                                <DateRange dateString={obj.startAt + "   " + obj.closeAt}></DateRange>
                            </div>
                        </div>
                        <div className={cx('button-container')}>
                            <button className={cx('cancel-but')}>Huỷ</button>
                            <button className={cx('save-but')}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
}

export default EditDiscount;

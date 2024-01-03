import styles from './EditDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import * as PromotionsServices from '~/apiServices/promotionServices';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import format from 'date-fns/format'
const cx = classNames.bind(styles);

function EditDiscount() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const [disable, SetDisable] = useState(false);

    const convertISOtoDDMMYYYY = (isoDateString) => {
        let date = new Date(isoDateString);

        return format(date, 'dd/MM/yyyy');;
    }
    const DisableInputText = () => {
        SetDisable(!disable);
    };
    const promotiontid = useParams();
    const [obj, setObj] = useState(null);
    const [changeDate, setChangeDate] = useState(false)
    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await PromotionsServices.getPromotion(promotiontid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);
            setDateString(convertISOtoDDMMYYYY(result.startAt) + "-" + convertISOtoDDMMYYYY(result.closeAt))
        }

        fetchApi();

    }, []);

    const [dateString, setDateString] = useState('');

    const submit = () => {
        setLoading(true);
        const fetchApi = async () => {
            // console.log(productid.id)
            if (changeDate === true) {
                const date = dateString.split('–')
                console.log(date)
                const newobj = obj
                newobj.startAt = new Date(date[0]).toISOString()
                newobj.closeAt = new Date(date[1]).toISOString()
                setObj(newobj)
            }

            console.log(obj)
            const result = await PromotionsServices.UpdatePromotion(promotiontid.id, obj)
                .catch((err) => {
                    console.log(err);
                });
            if (result) {
                setTimeout(() => {
                    setLoading(false);
                    toastContext.notify('error', 'Đã có lỗi');
                }, 2000);
            }
            else {
                setTimeout(() => {
                    setLoading(false);
                    toastContext.notify('success', 'Đã lưu khuyến mãi');
                }, 2000);
            }

        }

        fetchApi();
    }

    const setDate = (value) => {
        setDateString(value)
        setChangeDate(false)
    }
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
                                            onChange={(e) => {
                                                const newobj = obj;
                                                newobj.name = e.target.value
                                                setObj(newobj)
                                            }}
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
                                            defaultValue={obj.remainQuantity}
                                            disabled={disable}
                                            onChange={(e) => {
                                                const newobj = obj;
                                                newobj.remainQuantity = e.target.value
                                                setObj(newobj)
                                            }}
                                        ></input>
                                    </div>
                                </div>
                                <div className={cx('input-text')}>
                                    <div>
                                        <p>Mô tả</p>
                                        <input
                                            type="text"
                                            defaultValue={obj.typeName}
                                            placeholder="Nhập mô tả cho khuyến mãi"
                                            onChange={(e) => {
                                                const newobj = obj;
                                                newobj.typeName = e.target.value
                                                setObj(newobj)
                                            }}
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
                                                type="number"
                                                defaultValue={obj.applyFromAmount}
                                                onChange={(e) => {
                                                    if (e.target.value < 0 || e.target.value === '') e.target.value = 0
                                                    const newobj = obj;
                                                    newobj.applyFromAmount = e.target.value
                                                    setObj(newobj)
                                                }}
                                                inputMode='numeric'
                                            ></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input
                                                type="number"
                                                defaultValue={obj.applyToAmount}
                                                onChange={(e) => {
                                                    if (e.target.value < obj.applyFromAmount || e.target.value === '') e.target.value = obj.applyFromAmount
                                                    const newobj = obj;
                                                    newobj.applyToAmount = e.target.value
                                                    setObj(newobj)
                                                }}
                                                inputMode='numeric'
                                            ></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input
                                                type="number"
                                                defaultValue={obj.discountRate}
                                                onChange={(e) => {
                                                    if (e.target.value > 100) e.target.value = 100
                                                    else if (e.target.value <= 0 || e.target.value === '') e.target.value = 0
                                                    const newobj = obj;
                                                    newobj.discountRate = e.target.value
                                                    setObj(newobj)
                                                }}
                                                inputMode='numeric'
                                            ></input>
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
                                    setDateString={setDate}
                                    bottom
                                    future
                                ></DateRange>
                            </div>
                        </div>
                        <div className={cx('button-container')}>
                            <button className={cx('cancel-but')}>Huỷ</button>
                            <button className={cx('save-but')} onClick={() => submit()}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>


    );
}

export default EditDiscount;

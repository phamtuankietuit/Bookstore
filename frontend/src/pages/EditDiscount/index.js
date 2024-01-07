import styles from './EditDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PromotionsServices from '~/apiServices/promotionServices';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import format from 'date-fns/format';
import { getLocalStorage } from '~/store/getLocalStorage';

import { ConvertISO } from '~/components/ConvertISO';
const cx = classNames.bind(styles);

function EditDiscount() {
    const navigate = useNavigate();
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
    const [changeDate, setChangeDate] = useState(false);

    const [dateString, setDateString] = useState('');
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {

        const fetchApi = async () => {
            const result = await PromotionsServices.getPromotion(promotiontid.id)
                .catch((err) => {
                    console.log(err);
                });

            if (result) {
                setObj(result);
                setDateString(convertISOtoDDMMYYYY(result.startAt) + " – " + convertISOtoDDMMYYYY(result.closeAt));
                setName(result.name);
                setStart(result.applyFromAmount);
                setEnd(result.applyToAmount);
                setQuantity(result.remainQuantity);
                setDiscount(result.discountRate);
            }
        }

        fetchApi();

    }, []);

    const submit = () => {
        if (name === '') {
            setLoading(false);
            toastContext.notify('error', 'Chưa nhập tên');
        } else if (quantity === '') {
            setLoading(false);
            toastContext.notify('error', 'Cần chọn số lượng áp dụng');
        } else if (dateString === '') {
            setLoading(false);
            toastContext.notify('error', 'Chưa chọn ngày');
        } else if (parseInt(discount) === 0) {
            setLoading(false);
            toastContext.notify('error', 'Chưa chọn phần trăm chiết khấu');
        } else {
            setLoading(true);

            let isSuccess = true;

            const fetchApi = async () => {

                let endValue = null;
                if (Number(end) > 0) {
                    endValue = Number(end);
                }

                const newObj = {
                    ...obj,
                    name: name,
                    remainQuantity: Number(quantity),
                    applyFromAmount: Number(start),
                    applyToAmount: endValue,
                    discountRate: Number(discount),
                    startAt: ConvertISO(dateString).startDate,
                    closeAt: ConvertISO(dateString).endDate,
                }

                console.log(newObj);

                const result = await PromotionsServices.UpdatePromotion(promotiontid.id, newObj)
                    .catch((err) => {
                        console.log(err);
                        isSuccess = false;
                        setLoading(false);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (isSuccess) {
                    setLoading(false);
                    toastContext.notify('success', 'Cập nhật khuyến mãi thành công');
                }
            }

            fetchApi();
        }

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
                                            defaultValue={name}
                                            placeholder="Nhập tên của khuyến mãi"
                                            onChange={(e) => setName(e.target.value)}
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
                                            value={quantity}
                                            disabled={disable}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                {/* <div className={cx('input-text')}>
                                    <div>
                                        <p>Mô tả</p>
                                        <input
                                            type="text"
                                            defaultValue={obj.typeName}
                                            placeholder="Nhập mô tả cho khuyến mãi"
                                            onChange={(e) => {
                                                const newobj = obj;
                                                newobj.typeName = e.target.value;
                                                setObj(newobj);
                                            }}
                                        ></input>
                                    </div>
                                </div> */}
                            </div>
                            {/* <div className={cx('checkbox-wrapper')}>
                                <input
                                    onClick={DisableInputText}
                                    id="cb"
                                    type="checkbox"
                                ></input>
                                <label htmlFor="cb">Không giới hạn số lượng</label>
                            </div> */}
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
                                                defaultValue={start}
                                                onChange={(e) => setStart(e.target.value)}
                                                inputMode='numeric'
                                            ></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input
                                                type="number"
                                                defaultValue={end}
                                                onChange={(e) => setEnd(e.target.value)}
                                                inputMode='numeric'
                                            ></input>
                                        </div>
                                        <div className={cx('table-ThirdRow')}>
                                            <input
                                                type="number"
                                                defaultValue={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                                inputMode='numeric'
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
                                    setDateString={setDate}
                                    bottom
                                    future
                                ></DateRange>
                            </div>
                        </div>
                        <div className={cx('button-container')}>
                            <button className={cx('cancel-but')} onClick={() => navigate(-1)}>Huỷ</button>
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

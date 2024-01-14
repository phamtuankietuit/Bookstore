import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import format from 'date-fns/format';
import Spinner from 'react-bootstrap/Spinner';

import styles from './EditDiscount.module.scss';
import DateRange from '~/components/DateRange';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import { ConvertISO } from '~/components/ConvertISO';

import { getLocalStorage } from '~/store/getLocalStorage';

import * as PromotionsServices from '~/apiServices/promotionServices';

const cx = classNames.bind(styles);

const addCommas = (num) => {
    if (num === null) return;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

function EditDiscount() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const promotionId = useParams();
    const [obj, setObj] = useState(null);

    const [dateString, setDateString] = useState('');
    const [start, setStart] = useState('0');
    const [end, setEnd] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {

        const fetchApi = async () => {
            const result = await PromotionsServices.getPromotion(promotionId.id)
                .catch((err) => {
                    console.log(err);
                });

            if (result) {
                setObj(result);
                setDateString(format(new Date(result.startAt), 'dd/MM/yyyy') + " – " + format(new Date(result.closeAt), 'dd/MM/yyyy'));
                setName(result.name);
                setStart(addCommas(result?.applyFromAmount));
                setEnd(addCommas(result?.applyToAmount));
                setQuantity(result.remainQuantity);
                setDiscount(result.discountRate);
            }
        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        } else if (parseInt(discount) === 0 || discount === '') {
            setLoading(false);
            toastContext.notify('error', 'Chưa chọn phần trăm chiết khấu');
        } else {
            setLoading(true);

            let isSuccess = true;

            const fetchApi = async () => {

                let endValue = null;
                if (Number(end?.replace(/,/g, '')) > 0) {
                    endValue = Number(end.replace(/,/g, ''));
                }

                let startValue = 0;
                if (Number(start?.replace(/,/g, '')) >= 0) {
                    startValue = Number(start.replace(/,/g, ''));
                }

                const newObj = {
                    ...obj,
                    name: name,
                    remainQuantity: Number(quantity),
                    applyFromAmount: startValue,
                    applyToAmount: endValue,
                    discountRate: Number(discount),
                    startAt: ConvertISO(dateString).startDate,
                    closeAt: ConvertISO(dateString).endDate,
                }

                console.log(newObj);

                const result = await PromotionsServices.UpdatePromotion(promotionId.id, newObj)
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
                                            placeholder="Nhập số lượng áp dụng"
                                            value={quantity}
                                            onChange={(e) => setQuantity(
                                                removeNonNumeric(
                                                    e.target.value,
                                                )
                                            )}
                                        ></input>
                                    </div>
                                </div>
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
                                                value={discount}
                                                onChange={(e) => {
                                                    let value = removeNonNumeric(e.target.value);
                                                    if (value > 100) {
                                                        value = discount;
                                                    }
                                                    setDiscount(value);
                                                }}
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

import styles from './AddDiscount.module.scss';
import classNames from 'classnames/bind';
import DateRange from '~/components/DateRange';
import { useState, useContext } from 'react';
import * as PromotionsServices from '~/apiServices/promotionServices';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import { useNavigate } from 'react-router-dom';
import { getLocalStorage } from '~/store/getLocalStorage';

import { ConvertISO } from '~/components/ConvertISO';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

function AddDiscount() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);


    const [dateString, setDateString] = useState('');
    const [start, setStart] = useState('0');
    const [end, setEnd] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);

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
            const fetchApi = async () => {

                let endValue = null;
                if (Number(end.replace(/,/g, '')) > 0) {
                    endValue = Number(end.replace(/,/g, ''));
                }

                const obj = {
                    name: name,
                    remainQuantity: Number(quantity),
                    applyFromAmount: Number(start.replace(/,/g, '')),
                    applyToAmount: endValue,
                    discountRate: Number(discount),
                    startAt: ConvertISO(dateString).startDate,
                    closeAt: ConvertISO(dateString).endDate,
                    status: "running",
                    staffId: getLocalStorage().user.staffId,
                }

                console.log(obj);

                const result = await PromotionsServices.CreatePromotion(obj)
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (result) {
                    setLoading(false);
                    toastContext.notify('success', 'Tạo khuyến mãi thành công');
                    navigate('/discounts/detail/' + result.promotionId);
                }
            }

            fetchApi();
        }
    }

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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div className={cx('input-text')}>
                            <div>
                                <p>Số lượng áp dụng</p>
                                <input
                                    placeholder="Nhập số lượng áp dụng"
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(
                                            removeNonNumeric(
                                                e.target.value,
                                            )
                                        )
                                    }}
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
                        />
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <button className={cx('save-but')} onClick={() => submit()}>Lưu</button>
                </div>
            </div>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default AddDiscount;

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import format from 'date-fns/format'
import { BiSolidDiscount } from 'react-icons/bi';
import Spinner from 'react-bootstrap/Spinner';

import styles from './DiscountInfo.module.scss';
import ModalLoading from '~/components/ModalLoading';
import Button from '~/components/Button';

import { ToastContext } from '~/components/ToastContext';

import * as PromotionsServices from '~/apiServices/promotionServices';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function DiscountInfo() {
    const promotionId = useParams();
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    const [loading, setLoading] = useState(false);
    const [updatePage, setUpdatePage] = useState(new Date());
    const [obj, setObj] = useState(null);

    const [show, setShow] = useState(true);

    // GET PROMOTION
    useEffect(() => {
        const fetchApi = async () => {
            const result = await PromotionsServices.getPromotion(promotionId.id)
                .catch((err) => {
                    console.log(err);
                });

            if (result) {
                console.log(result);
                setObj(result);
                if (result.status === 'stopped') {
                    setShow(false);
                }
            }
        }

        fetchApi();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage]);

    const submit = () => {
        setLoading(true);

        const fetchApi = async () => {
            let isSuccess = true;

            const newObj = {
                ...obj,
                status: 'paused',
            }

            const result = await PromotionsServices.UpdatePromotion(promotionId.id, newObj)
                .catch((err) => {
                    console.log(err);
                    isSuccess = false;
                    setLoading(false);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (isSuccess) {
                setLoading(false);
                toastContext.notify('success', 'Đã tạm ngừng khuyến mãi');
                setUpdatePage(new Date());
            }
        }

        fetchApi();
    }

    const handleActive = () => {
        setLoading(true);

        const fetchApi = async () => {
            let isSuccess = true;

            const newObj = {
                ...obj,
                status: 'running',
            }

            const result = await PromotionsServices.UpdatePromotion(promotionId.id, newObj)
                .catch((err) => {
                    console.log(err);
                    isSuccess = false;
                    setLoading(false);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (isSuccess) {
                setLoading(false);
                toastContext.notify('success', 'Đã kích hoạt khuyến mãi');
                setUpdatePage(new Date());
            }
        }

        fetchApi();
    }

    const handleCancel = () => {
        setLoading(true);
        const fetchApi = async () => {
            let isSuccess = true;

            const newObj = {
                ...obj,
                status: 'stopped',
            }

            const result = await PromotionsServices.UpdatePromotion(promotionId.id, newObj)
                .catch((err) => {
                    console.log(err);
                    isSuccess = false;
                    setLoading(false);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (isSuccess) {
                setLoading(false);
                toastContext.notify('success', 'Đã hủy khuyến mãi');
                setUpdatePage(new Date());
            }
        }

        fetchApi();
    }


    return (
        <div className={cx('container')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div className={cx('discount-container')}>
                    <div className={cx('tag-and-time')}>
                        <div className={cx('discount-tag')}>
                            <div className={cx('left-tag')}>
                                <span className={cx('left-tag-circle1')}></span>
                                <span className={cx('left-tag-circle2')}></span>
                            </div>
                            <div className={cx('discount-tag-content')}>
                                <div className={cx('content')}>
                                    <h4>{obj.discountRate}% Off</h4>
                                    <p>Siêu giảm giá</p>
                                    <p>Ngày kết thúc: {format(new Date(obj.closeAt), 'dd/MM/yyyy')}</p>
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
                                        <p>{format(new Date(obj.startAt), 'dd/MM/yyyy')}</p>
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
                                        <p>{format(new Date(obj.closeAt), 'dd/MM/yyyy')}</p>
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
                                    <p>{obj.name}</p>
                                    <p>{obj.typeName}</p>
                                </div>
                            </div>
                            <div className={cx('main-info-content-grid1')}>
                                <div className={cx('first-column')}>
                                    <p>Mã khuyến mãi</p>
                                    <p>Số lượng còn lại</p>
                                </div>
                                <div className={cx('split')}>
                                    <p>:</p>
                                    <p>:</p>
                                </div>
                                <div className={cx('second-column')}>
                                    <p>{obj.promotionId}</p>
                                    <p>{obj.remainQuantity}</p>
                                </div>
                            </div>
                            <div className={cx('main-info-content-grid1')}>
                                <div className={cx('first-column')}>
                                    <p>Trạng thái</p>
                                </div>
                                <div className={cx('split')}>
                                    <p>:</p>
                                </div>
                                <div className={cx('second-column')}>
                                    <p>
                                        {obj.status === 'running' && 'Đang chạy'}
                                        {obj.status === 'paused' && 'Tạm dừng'}
                                        {obj.status === 'stopped' && 'Đã hủy'}
                                    </p>
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
                                <p>{addCommas(obj.applyFromAmount)} đ</p>
                            </div>
                            <div className={cx('second-row')}>
                                <p>{obj.applyToAmount === null ? 'không giới hạn' : addCommas(obj.applyToAmount) + ' đ'} </p>
                            </div>
                            <div className={cx('second-row')}>
                                <p>{obj.discountRate}%</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('button-container')}>
                        {show &&
                            <div>
                                <Button outlineRed className={cx('m-r')} onClick={handleCancel}>
                                    Hủy
                                </Button>
                                <button
                                    className={cx('edit-btn')}
                                    onClick={() => navigate('/discounts/update/' + promotionId.id)}
                                >
                                    Sửa
                                </button>
                                <button className={cx('stop-btn')} onClick={() => submit()}>Tạm ngừng</button>
                                <button className={cx('stop-btn')} onClick={() => handleActive()}>Kích hoạt</button>
                            </div>
                        }
                    </div>
                    <ModalLoading open={loading} title={'Đang tải'} />
                </div>)
            }
        </div>
    );
}

export default DiscountInfo;

import styles from './DiscountInfo.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect, useContext } from 'react';
import { BiSolidDiscount } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as PromotionsServices from '~/apiServices/promotionServices';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function DiscountInfo() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [obj, setObj] = useState(null);
    const promotiontid = useParams();
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

    const submit = () => {
        setLoading(true);
        const fetchApi = async () => {
            // console.log(productid.id)
            const newobj = obj
            newobj.status = 'paused'
            const result = await PromotionsServices.UpdatePromotion(promotiontid.id, newobj)
                .catch((err) => {
                    console.log(err);
                });
            if (result) {
                setTimeout(() => {
                    setLoading(false);
                    toastContext.notify('success', 'Đã lưu khuyến mãi');
                }, 2000);
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
                                    <p>Ngày kết thúc: {obj.closeAt}</p>
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
                                        <p>{obj.startAt}</p>
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
                                        <p>{obj.closeAt}</p>
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
                                    <p>Mô tả</p>
                                </div>
                                <div className={cx('split')}>
                                    <p>:</p>
                                    <p>:</p>
                                </div>
                                <div className={cx('second-column')}>
                                    <p>{obj.promotionId}</p>
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
                                <p>{addCommas(obj.applyFromAmount)} đ</p>
                            </div>
                            <div className={cx('second-row')}>
                                <p>{addCommas(obj.applyToAmount)} đ</p>
                            </div>
                            <div className={cx('second-row')}>
                                <p>{obj.discountRate}</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('button-container')}>
                        <button
                            className={cx('edit-btn')}
                            onClick={() => navigate('/discounts/update/' + promotiontid.id)}
                        >
                            Sửa
                        </button>
                        <button className={cx('stop-btn')} onClick={() => submit()}>Tạm ngừng</button>
                    </div>
                    <ModalLoading open={loading} title={'Đang tải'} />
                </div>

            )
            }

        </div>
    );
}

export default DiscountInfo;

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { format } from 'date-fns';
import { IoPerson } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';

import styles from './EditBillInfo.module.scss';
import ListBillProduct from '~/components/ListBillProduct';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function EditBillInfo() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const saleOrderId = useParams();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchApi = async () => {

            const responseOrder = await saleServices.getSalesOrder(saleOrderId.id)
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (responseOrder) {
                console.log(responseOrder);
                setOrder(responseOrder);
                setNote(responseOrder.note);
            }

            const responseCustomer = await customerServices.getCustomer(responseOrder?.customerId)
                .catch((err) => {
                    console.log(err);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (responseCustomer) {
                setCustomer(responseCustomer);
            }

        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        setLoading(true);

        let isSuccess = true;

        const newObj = {
            ...order,
            note: note,
        };

        console.log(newObj);

        const fetchApi = async () => {
            const result = await saleServices.UpdateSalesOrder(newObj.salesOrderId, newObj)
                .catch((err) => {
                    isSuccess = false;
                    console.log(err);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (isSuccess) {
                toastContext.notify('success', 'Cập nhật đơn hàng thành công');
            }

            setLoading(false);
        }

        fetchApi();
    }


    return (
        <div>
            {order === null && customer === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div> <div className={cx('container')}>
                <div className={cx('MainInfo-and-Status')}>
                    <div className={cx('MainInfo')}>
                        <div className={cx('BillCode')}>
                            <p>Chỉnh sửa hoá đơn {order.orderId}</p>
                        </div>
                        <div className={cx('Print-and-Copy')}>
                            {/* <div className={cx('Print-btn')}>
                        <GrPrint className={cx('Print-icon')}></GrPrint>
                        <p>In đơn hàng</p>
                    </div>
                    <div className={cx('Copy-btn')}>
                        <FaRegCopy className={cx('Copy-icon')}></FaRegCopy>
                        <p>Sao chép</p>
                    </div> */}
                            <div className={cx('Staff-info')}>
                                <IoPerson className={cx('staff-icon')}></IoPerson>
                                <p>Bán bởi: </p>
                                <p>{order.staffName}</p>
                            </div>
                            <div className={cx('Date-info')}>
                                <FaCalendarAlt
                                    className={cx('Date-icon')}
                                ></FaCalendarAlt>
                                <p>Ngày bán: </p>
                                <p>{format(new Date(order.createdAt), 'dd/MM/yyyy - HH:mm')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('Bill-Content')}>
                    <div className={cx('Content-grid1')}>
                        <div className={cx('Customer-Info')}>
                            <div className={cx('title')}>
                                <p>Thông tin khách hàng</p>
                            </div>
                            <div className={cx('Info')}>
                                <div className={cx('Info-name-phone')}>
                                    <span className={cx('name')}>{customer?.name}</span>
                                    <span>-</span>
                                    <span className={cx('phone')}>{customer?.phoneNumber}</span>
                                </div>
                                <div className={cx('Info-contact')}>
                                    <p>LIÊN HỆ</p>
                                    <div className={cx('input-container')}>
                                        <input
                                            type="text"
                                            readOnly
                                            className={cx('input-text')}
                                            value={customer?.email}
                                        ></input>
                                        <input
                                            type="text"
                                            readOnly
                                            className={cx('input-text')}
                                            value={customer?.phoneNumber}
                                        ></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Content-grid2')}>
                        <div className={cx('Bill-Note')}>
                            <div className={cx('title')}>
                                <p>Ghi chú</p>
                            </div>
                            <div className={cx('Note-content')}>
                                <textarea
                                    className={cx('Note-textarea')}
                                    placeholder="VD: Hàng đặt gói riêng"
                                    defaultValue={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('List-Product')}>
                    <div className={cx('List-content')}>
                        <div className={cx('title')}>
                            <p>Thông tin sản phẩm</p>
                        </div>
                        <ListBillProduct list={order.items} />
                        <div className={cx('list-sum')}>
                            <div className={cx('list-sum-content')}>
                                <div className={cx('list-sum-content1')}>
                                    <p>Tổng tiền</p>
                                    <p>VAT</p>
                                    <p>Chiết khấu</p>
                                    <p>
                                        <b>Khách phải trả</b>
                                    </p>
                                </div>
                                <div className={cx('list-sum-content2')}>
                                    <p>{addCommas(order.subtotal)}</p>
                                    <p>0</p>
                                    <p>{addCommas(order.discountAmount)}</p>
                                    <p>{addCommas(order.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <button className={cx('save-btn')} onClick={() => submit()}>Lưu</button>
                </div>

                <ModalLoading open={loading} title={'Đang tải'} />
            </div> </div>)}
        </div>
    );
}

export default EditBillInfo;

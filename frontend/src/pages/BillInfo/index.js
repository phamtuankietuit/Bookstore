import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { GrPrint } from 'react-icons/gr';
import { IoPerson } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import Spinner from 'react-bootstrap/Spinner';
import { format } from 'date-fns';

import styles from './BillInfo.module.scss';
import ListBillProduct from '~/components/ListBillProduct';

import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';

import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

const addCommas = (num) => {
    if (num !== null) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

function BillInfo() {
    const toastContext = useContext(ToastContext);
    const salesOrderId = useParams();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            const responseOrder = await saleServices.getSalesOrder(salesOrderId.id)
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (responseOrder) {
                console.log(responseOrder);
                setOrder(responseOrder);

                const responseCustomer = await customerServices.getCustomer(responseOrder.customerId)
                    .catch((err) => {
                        console.log(err);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (responseCustomer) {
                    setCustomer(responseCustomer);
                }
            }
        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={cx('container')}>

            {(order === null && customer === null) ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div>
                <div className={cx('MainInfo-and-Status')}>
                    <div className={cx('MainInfo')}>
                        <div className={cx('BillCode')}>
                            <p>{order.salesOrderId}</p>
                            <div className={cx('BillStatus')}>
                                <p>Hoàn thành</p>
                            </div>
                        </div>
                        <div className={cx('Print-and-Copy')}>
                            <div className={cx('Print-btn')}>
                                <GrPrint className={cx('Print-icon')}></GrPrint>
                                <p>In đơn hàng</p>
                            </div>
                            <div className={cx('Staff-info')}>
                                <IoPerson className={cx('staff-icon')}></IoPerson>
                                <p>Bán bởi: </p>
                                <p>{order?.staffName}</p>
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
                                    <span className={cx('name')}>{order.customerName}</span>
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
                                <p>{order.note}</p>
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
                                    <p>Chiết khấu thường</p>
                                    <p>Chiết khấu khuyến mãi</p>
                                    <p>
                                        <b>Khách phải trả</b>
                                    </p>
                                </div>
                                <div className={cx('list-sum-content2')}>
                                    <p>{addCommas(order?.subtotal)}</p>
                                    <p>{0}</p>
                                    <p>{
                                        addCommas(
                                            order?.discountItems
                                                ?.find((element) => element.source === 'manual')
                                                ?.amount
                                        )
                                    }</p>
                                    <p>{
                                        addCommas(
                                            (order
                                                ?.discountItems
                                                ?.find((element) => element?.source === 'promotion')
                                                ||
                                                { amount: 0 }
                                            ).amount
                                        )
                                    }</p>
                                    <p><b>{addCommas(order?.totalAmount)}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <Link to={"/return/add/" + salesOrderId.id} className={cx('edit-btn', 'm-r')}>
                        Trả hàng
                    </Link>
                    <Link to={"/orders/update/" + salesOrderId.id} className={cx('edit-btn')}>
                        Sửa
                    </Link>
                </div>
            </div>)}

        </div>
    );
}

export default BillInfo;

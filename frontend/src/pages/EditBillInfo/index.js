import styles from './EditBillInfo.module.scss';
import classNames from 'classnames/bind';
import { IoPerson } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import ListBillProduct from '~/components/ListBillProduct';
import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import { format } from 'date-fns';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


function EditBillInfo() {
    const saleorderid = useParams();
    const [obj, setObj] = useState(null);

    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null)
    const convertISOtoDDMMYYYY = (isoDateString) => {
        let date = new Date(isoDateString);
        return format(date, 'MM/dd/yyyy - HH:mm');
    }
    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await saleServices.getSalesOrder(saleorderid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);
            const resultCus = await customerServices.getCustomer(result.customerId)
                .catch((err) => {
                    console.log(err);
                });

            if (resultCus) {
                setCustomer(resultCus)
            }

        }

        fetchApi();

    }, []);

    const updateNote = (value) => {
        let newobj = obj;
        newobj.note = value;
        if (newobj.discounts === null) newobj.discounts = {
            name: "string",
            value: 0
        }
        setObj(newobj)
    }

    const submit = () => {
        console.log(obj)
        setLoading(true);
        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await saleServices.UpdateSalesOrder(saleorderid.id, obj)
                .catch((err) => {
                    console.log(err);
                });
            if (result) {

            }
            else {
                setTimeout(() => {
                    setLoading(false);
                    toastContext.notify('success', 'Đã lưu đơn');
                }, 2000);
            }

        }

        fetchApi();
    }
    return (
        <div>
            {obj === null && customer === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div> <div className={cx('container')}>
                <div className={cx('MainInfo-and-Status')}>
                    <div className={cx('MainInfo')}>
                        <div className={cx('BillCode')}>
                            <p>Chỉnh sửa hoá đơn {obj.orderId}</p>
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
                                <p>Quân</p>
                            </div>
                            <div className={cx('Date-info')}>
                                <FaCalendarAlt
                                    className={cx('Date-icon')}
                                ></FaCalendarAlt>
                                <p>Ngày bán: </p>
                                <p>{convertISOtoDDMMYYYY(obj.createdAt)}</p>
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
                                    defaultValue={obj.note}
                                    onChange={(e) => updateNote(e.target.value)}
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
                        <ListBillProduct list={obj.items} />
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
                                    <p>{addCommas(obj.subtotal)}</p>
                                    <p>0</p>
                                    <p>{addCommas(obj.discountAmount)}</p>
                                    <p>{addCommas(obj.totalAmount)}</p>
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

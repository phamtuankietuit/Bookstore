import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { GrPrint } from 'react-icons/gr';
import { FaRegCopy } from 'react-icons/fa6';
import { IoPerson } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './BillInfo.module.scss';
import ListBillProduct from '~/components/ListBillProduct';
import { data } from './/data';
import Spinner from 'react-bootstrap/Spinner';
import * as saleServices from '~/apiServices/saleServices';
import { useParams } from 'react-router-dom';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function BillInfo() {
    const saleorderid = useParams();
    const [obj, setObj] = useState(null);

    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await saleServices.getSalesOrder(saleorderid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);

        }

        fetchApi();

    }, []);
    return (
        <div className={cx('container')}>

            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div>
                <div className={cx('MainInfo-and-Status')}>
                    <div className={cx('MainInfo')}>
                        <div className={cx('BillCode')}>
                            <p>{obj.orderId}</p>
                            <div className={cx('BillStatus')}>
                                <p>Hoàn thành</p>
                            </div>
                        </div>
                        <div className={cx('Print-and-Copy')}>
                            <div className={cx('Print-btn')}>
                                <GrPrint className={cx('Print-icon')}></GrPrint>
                                <p>In đơn hàng</p>
                            </div>
                            <div className={cx('Copy-btn')}>
                                <FaRegCopy className={cx('Copy-icon')}></FaRegCopy>
                                <p>Sao chép</p>
                            </div>
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
                                <p>{obj.createdAt}</p>
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
                                    <span className={cx('name')}>Khách lẻ</span>
                                    <span>-</span>
                                    <span className={cx('phone')}>0905564417</span>
                                </div>
                                <div className={cx('Info-contact')}>
                                    <p>LIÊN HỆ</p>
                                    <div className={cx('input-container')}>
                                        <input
                                            type="text"
                                            readOnly
                                            className={cx('input-text')}
                                            value={'Email'}
                                        ></input>
                                        <input
                                            type="text"
                                            readOnly
                                            className={cx('input-text')}
                                            value={'0905564417'}
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
                                <p>{obj.note}</p>
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
                                    <p>{addCommas(obj.totalAmount)}</p>
                                    <p>{data.vat}</p>
                                    <p>{obj.discounts === null ? 0 : obj.discounts.value}</p>
                                    <p>{addCommas(data.paid)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('button-container')}>
                    <Link to="/orders/update/HD0001" className={cx('edit-btn')}>
                        Sửa
                    </Link>
                </div>
            </div>)}

        </div>
    );
}

export default BillInfo;

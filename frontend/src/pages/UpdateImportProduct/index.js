import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateImportProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Properties from '~/components/Properties';
import { data } from '../InfoImportProduct/data';
import ListImportProduct from '~/components/ListImportProduct';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function UpdateImportProduct() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const { importid } = useParams()
    let navigate = useNavigate();
    const [obj, setObj] = useState(null)
    useEffect(() => {
        setObj(data)
    }, [obj]);
    const v = [
        {
            id: 1,
            title: 'Nợ hiện tại',
            value: '0',
        },
        {
            id: 2,
            title: 'Tổng đơn nhập',
            value: '3',
        },
        {
            id: 3,
            title: 'Trả hàng',
            value: '0',
        }
    ]

    const updateNote = (value) => {
        let newobj = obj;
        newobj.note = value;
        setObj(newobj)
    }

    const submit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toastContext.notify('success', 'Đã lưu đơn');
        }, 2000);
        console.log(obj)
    }
    return (
        <div className={cx('wrapper')}>
            {
                obj === null ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <div className={cx('inner')}>
                        <div className={cx('frame')}>
                            <p className={cx('title')}>Thông tin nhà cung cấp</p>
                            < div >
                                <Row>
                                    <Col lg={8}>

                                        <div className='d-flex'>
                                            <p className='me-4'>
                                                <NavLink to='/' className='fs-5 text-decoration-none' >
                                                    A

                                                </NavLink>
                                            </p>

                                        </div>
                                        <div>
                                            Địa chỉ:
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className={cx('tag-debt')}>
                                            <Properties props={v} stype={0} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className={cx('frame')}>
                            <p className={cx('title')}>Thông tin sản phẩm</p>
                            <ListImportProduct list={obj.list} />
                            <hr />
                            <Row>
                                <Col lg={7} className={cx('title')}>
                                    <p>
                                        Ghi chú
                                    </p>
                                    <textarea
                                        defaultValue={obj.note}
                                        style={{
                                            fontSize: '13px',
                                            marginTop: '0px',
                                            color: '#55555',
                                            minWidth: '70%',
                                            height: '140px',
                                        }}
                                        onChange={(e) => updateNote(e.target.value)}
                                    ></textarea>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs md lg={8}>
                                            Số lượng
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {obj.list.length}
                                        </Col>
                                    </Row>

                                    <Row className='mt-3'>
                                        <Col xs md lg={8}>
                                            Tổng tiền
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {addCommas(obj.total)}
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>

                                        <Col xs md lg={8}>

                                            Chiết khấu

                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {
                                                obj.typediscount ? (
                                                    <div>
                                                        {obj.discount} %
                                                    </div>
                                                ) : (
                                                    <div>{addCommas(obj.discount)}</div>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col xs md lg={8} className='fw-bold'>
                                            Đã thanh toán
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {addCommas(obj.paid)}
                                        </Col>
                                    </Row>
                                    <hr className={cx('divider')} />
                                    <Row className='mt-3'>
                                        <Col xs md lg={8} className='fw-bold'>
                                            Còn phải trả
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {addCommas(obj.unpaid)}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col className='mt-4 text-end me-4'>
                                    <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                                    <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Lưu</Button>

                                </Col>
                            </Row>
                        </div>

                    </div>
                )
            }


            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default UpdateImportProduct;
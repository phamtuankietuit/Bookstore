import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './InfoImportProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Properties from '~/components/Properties';
import { data } from './data';
import ListImportProduct from '~/components/ListImportProduct';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function InfoImportProduct() {
    const importid = useParams();
    let navigate = useNavigate();
    const [obj, setObj] = useState(null);
    const [showpaid, setShowpaid] = useState(false);
    const [paid, setPaid] = useState(0);

    const handleClosepaid = () => setShowpaid(false);
    const handleShowpaid = () => setShowpaid(true);
    const handleSubmitpaid = () => {
        let newobj = obj;
        newobj.paid = newobj.paid + paid;
        newobj.unpaid = newobj.total - newobj.paid;
        setObj(newobj);
        console.log(obj);
        setShowpaid(false);
    };
    useEffect(() => {
        setObj(data);
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
        },
    ];
    return (
        <div className={cx('wrapper')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div className={cx('inner')}>
                    <div className={cx('frame')}>
                        <p className={` mb-5 ${cx('title')}`}>
                            Thông tin nhà cung cấp
                        </p>
                        <div>
                            <Row>
                                <Col lg={8}>
                                    <div className="d-flex">
                                        <p className="me-4">
                                            <NavLink
                                                to="/"
                                                className="fs-5 text-decoration-none"
                                            >
                                                A
                                            </NavLink>
                                        </p>
                                    </div>
                                    <div>Địa chỉ:</div>
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
                        <div className="d-flex align-items-center mb-3">
                            <p className={`w-50 ${cx('title')}`}>
                                Đơn nhập hàng thanh toán một phần
                            </p>
                            <div className="text-end w-50">
                                <Button
                                    className={`m-1 ${cx('my-btn')}`}
                                    variant="primary"
                                    onClick={handleShowpaid}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </div>

                        <hr />
                        <Row className={`w-100 ${cx('bg')} p-3`}>
                            <Col lg={4} className="d-flex mb-1">
                                Tiền cần trả nhà cung cấp :{' '}
                                <span className="fw-bold ms-1">
                                    {' '}
                                    {addCommas(obj.total)}
                                </span>
                            </Col>
                            <Col lg={4} className="mb-1">
                                Đã trả :{' '}
                                <span className="fw-bold ms-1">
                                    {' '}
                                    {addCommas(obj.paid)}
                                </span>
                            </Col>
                            <Col lg={4} className="mb-1">
                                Còn phải trả :{' '}
                                <span className="text-danger">
                                    {addCommas(obj.unpaid)}
                                </span>
                            </Col>
                        </Row>
                    </div>
                    <div className={cx('frame')}>
                        <p className={` mb-5 ${cx('title')}`}>
                            Thông tin sản phẩm
                        </p>
                        <ListImportProduct list={obj.list} />
                        <hr />
                        <Row>
                            <Col lg={7} className="mb-3">
                                <p className={cx('title')}>Ghi chú</p>
                                <p className="mt-2">{obj.note}</p>
                            </Col>
                            <Col lg={5}>
                                <Row>
                                    <Col xs md lg={8}>
                                        Số lượng
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {obj.list.length}
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs md lg={8}>
                                        Tổng tiền
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.total)}
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col xs md lg={8}>
                                        Chiết khấu
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {obj.typediscount ? (
                                            <div>{obj.discount} %</div>
                                        ) : (
                                            <div>{addCommas(obj.discount)}</div>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col xs md lg={8} className="fw-bold">
                                        Đã thanh toán
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.paid)}
                                    </Col>
                                </Row>
                                <hr className={cx('divider')} />
                                <Row className="mt-3">
                                    <Col xs md lg={8} className="fw-bold">
                                        Còn phải trả
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.unpaid)}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mt-4 text-end me-4">
                                <Button
                                    className={`m-1 ${cx('my-btn')}`}
                                    variant="outline-primary"
                                    onClick={() => navigate(-1)}
                                >
                                    Thoát
                                </Button>
                                <Button
                                    className={`m-1 ${cx('my-btn')}`}
                                    variant="outline-primary"
                                >
                                    <NavLink
                                        to={'/imports/update/' + importid.id}
                                        className={`text-decoration-none ${cx(
                                            'nav-link',
                                        )}`}
                                    >
                                        Sửa đơn
                                    </NavLink>
                                </Button>

                                {/* <Button className={`m-1 ${cx('my-btn')}`} variant="primary" >Hoàn trả</Button> */}
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
            <Modal
                show={showpaid}
                onHide={handleClosepaid}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col xs md lg={8} className="fw-bold">
                        Thanh toán nhà cung cấp
                    </Col>
                    <Col xs md lg={4} className="text-end pe-5">
                        <input
                            className={`${cx('textfield')} `}
                            type="number"
                            inputMode="numeric"
                            onChange={(e) => {
                                if (e.target.value > obj.unpaid)
                                    e.target.value = obj.unpaid;
                                else if (
                                    e.target.value < 0 ||
                                    e.target.value === ''
                                )
                                    e.target.value = 0;
                                setPaid(parseInt(e.target.value));
                            }}
                        />
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosepaid}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmitpaid}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InfoImportProduct;

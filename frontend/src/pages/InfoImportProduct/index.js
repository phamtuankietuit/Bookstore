import { useState, useEffect, useContext } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';

import styles from './InfoImportProduct.module.scss';
import Properties from '~/components/Properties';
import ListImportProduct from '~/components/ListImportProduct';
import * as PurchaseOrdersServices from '~/apiServices/purchaseOrderServices';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function InfoImportProduct() {
    const toastContext = useContext(ToastContext);
    const importid = useParams();
    let navigate = useNavigate();
    const [obj, setObj] = useState(null);
    const [showpaid, setShowpaid] = useState(false);
    const [paid, setPaid] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleClosepaid = () => setShowpaid(false);
    const handleShowpaid = () => setShowpaid(true);
    const handleSubmitpaid = () => {
        let newobj = obj;
        obj.paymentDetails.paidAmount = obj.paymentDetails.paidAmount + paid;
        obj.paymentDetails.remainAmount = obj.totalAmount - obj.paymentDetails.paidAmount;
        setObj(newobj);
        console.log(obj);
        setShowpaid(false);
        setLoading(true);
        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await PurchaseOrdersServices.UpdatePurchaseOrder(importid.id, obj)
                .catch((err) => {
                    console.log(err);
                });
            if (result) {
                setLoading(false);
                toastContext.notify('error', 'Lưu không thành công');
            }
            else {
                setLoading(false);
                toastContext.notify('success', 'Đã lưu đơn');
            }
        }

        fetchApi();
    };
    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await PurchaseOrdersServices.getPurchaseOrder(importid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);
            console.log(result)

        }

        fetchApi();

    }, []);
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
                                                {obj.supplierName}
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
                        <p className={` mb-5 ${cx('title')}`}>
                            Thông tin sản phẩm
                        </p>
                        <ListImportProduct list={obj.items} />
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
                                        {obj.items.length}
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs md lg={8}>
                                        Tổng tiền
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.totalAmount)}
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col xs md lg={8}>
                                        Chiết khấu
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj?.discountAmount)}
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col xs md lg={8} className="fw-bold">
                                        Đã thanh toán
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.paymentDetails.paidAmount)}
                                    </Col>
                                </Row>
                                <hr className={cx('divider')} />
                                <Row className="mt-3">
                                    <Col xs md lg={8} className="fw-bold">
                                        Còn phải trả
                                    </Col>
                                    <Col xs md lg={4} className="text-end pe-5">
                                        {addCommas(obj.paymentDetails.remainAmount)}
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
                                if (e.target.value > obj.paymentDetails.remainAmount)
                                    e.target.value = obj.paymentDetails.remainAmount;
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
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default InfoImportProduct;

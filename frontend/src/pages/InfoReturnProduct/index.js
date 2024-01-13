import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';

import styles from './InfoReturnProduct.module.scss';
import Properties from '~/components/Properties';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as returnServices from '~/apiServices/returnServices';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function InfoReturn() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const returnOrderId = useParams();
    const [obj, setObj] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const response = await returnServices.getReturn(returnOrderId.id)
                .catch((error) => {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (response) {
                console.log(response);
                setObj(response);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {
                    obj === null ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (<div>
                        <div className={cx('frame')}>
                            {/* <div className='d-flex mb-2'>
                                <p className='fs-5 me-4'>{obj.sku}</p>
                                {
                                    obj.received ? (
                                        <div className={cx('status-1')}>Đã nhận</div>
                                    ) : (
                                        <div className={cx('status-2')}>Chưa nhân hàng</div>
                                    )
                                }
                            </div> */}
                            {/* <div className='my-4'>
                                <Button variant="secondary" onClick={() => handleShow()}>
                                    <FaPrint className='me-2' />
                                    In đơn trả hàng
                                </Button>
                            </div> */}
                            <p className={`mt-4 mb-1 ${cx('title')}`}>Thông tin phiếu</p>
                            <hr />
                            <Row>
                                <Col lg={6} className='mb-2'>
                                    <Properties props={[
                                        {
                                            id: 0,
                                            title: 'Mã đơn hàng',
                                            value: obj.salesOrderId,
                                        },
                                        {
                                            id: 1,
                                            title: 'Tên khách hàng',
                                            value: obj.customerName,
                                        },
                                        {
                                            id: 2,
                                            title: 'Tên nhân viên',
                                            value: obj.staffName,
                                        },
                                    ]} stype={0} />
                                </Col>
                                <Col lg={6} className='mb-2'>
                                    {/* <p className='fw-bold fs-6'>Lý do trả hàng : </p>
                                    <p className='mb-2'>{obj.reason}</p> */}
                                    <p className='fw-bold fs-6'>Ghi chú :</p>
                                    <p className='mb-2'>{obj.note}</p>
                                </Col>
                            </Row>
                        </div>
                        <div className={cx('frame')}>
                            <p className={`mt-4 mb-1 ${cx('title')}`}>Sản phẩm trả</p>
                            <div className={cx('content-check')}>
                                <div className={cx('row')}>
                                    <div className={cx('columns-1')}>STT</div>
                                    <div className={cx('columns-1')}>Ảnh</div>
                                    <div className={cx('columns-2')}>Tên sản phẩm</div>
                                    <div className={cx('columns-3')}>Số lượng</div>
                                    <div className={cx('columns-3')}>Đơn giá trả</div>
                                    <div className={cx('columns-3')}>Thành tiền</div>

                                </div>
                                <div className={cx('list-import')}>
                                    {
                                        obj.items.map((item, index) => (
                                            <div className={`${cx('item')}`} key={item.id}>
                                                <div className={cx('columns-1')}>{index + 1}</div>
                                                <div className={cx('columns-1')}><img src={item.featureImageUrl} className={cx('img')} /></div>
                                                <div className={cx('columns-2')}>
                                                    <div className='fs-6'>{item.name}</div>
                                                    <div>{item.sku}</div>
                                                </div>
                                                <div className={cx('columns-3')}>{item.returnQuantity}</div>
                                                <div className={cx('columns-3')}>{addCommas(item.salePrice)}</div>
                                                <div className={cx('columns-3')}>{addCommas(item.refund)}</div>
                                            </div>
                                        ))
                                    }
                                </div>


                            </div>
                            <Row className='text-end'>
                                <Row className='mb-3'>
                                    <Col xs md lg={8} >
                                        Số lượng trả {obj.totalItem} sản phẩm
                                    </Col>
                                    <Col xs md lg={4} className='text-end pe-5'>
                                        {obj.totalQuantity}
                                    </Col>
                                </Row>
                                {/* <Row className='mb-3'>
                                    <Col xs md lg={8}>
                                        Cần hoàn tiền hàng trả
                                    </Col>
                                    <Col xs md lg={4} className='text-end pe-5'>
                                        {addCommas(obj.total)}
                                    </Col>
                                </Row> */}
                                <Row className='mb-3'>
                                    <Col xs md lg={8} className='fw-bold'>
                                        Tổng tiền cần hoàn trả khách
                                    </Col>
                                    <Col xs md lg={4} className='text-end pe-5'>
                                        {addCommas(obj.totalAmount)}
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                        {/* {
                            obj.received ? (
                                <div className={`${cx('frame')} ${cx('title')} d-flex align-items-center `}>
                                    <FaCircleCheck className={`me-2 ${cx('success')}`} />
                                    Đã nhận hàng trả lại
                                </div>
                            ) : (
                                <div className={`${cx('frame')} ${cx('title')} d-flex align-items-center `}>
                                    <FaCircleXmark className={`me-2 ${cx('danger')}`} />
                                    Chưa nhận hàng
                                    <div className='text-end w-75'>
                                        <Button className={`m-1 ${cx('btn-inframe')}`} variant="primary" onClick={() => handleShowreceived()}>Nhận hàng hoàn trả</Button>
                                    </div>
                                </div>
                            )
                        } */}

                        <div className={`${cx('frame')} `}>
                            {/* {
                                obj.total - obj.paid === 0 ? (
                                    <div className={` ${cx('title')} d-flex align-items-center `}>
                                        <FaCircleCheck className={`me-2 ${cx('success')}`} />
                                        Đã hoàn tiền
                                    </div>
                                ) : (
                                    <div className={`${cx('title')} d-flex align-items-center `}>
                                        <FaCircleXmark className={`me-2 ${cx('danger')}`} />
                                        Chưa hoàn tiền
                                        <div className='text-end w-75'>
                                            <Button className={`m-1 ${cx('btn-inframe')}`} variant="primary" onClick={() => setShowpaid(true)}>Hoàn tiền</Button>
                                        </div>
                                    </div>
                                )
                            } */}
                            {/* <hr />
                            <Row className={`w-100 ${cx('bg')} p-3`}>
                                <Col lg={4} className='d-flex mb-1'>
                                    Cần trả khách: <span className='fw-bold ms-1'> {addCommas(obj.total)}</span>
                                </Col>
                                <Col lg={4} className='mb-1'>
                                    Đã hoàn trả: <span className='fw-bold ms-1'> {addCommas(obj.paid)}</span>
                                </Col>
                                <Col lg={4} className='mb-1'>
                                    Còn phải trả : <span className='text-danger'>{addCommas(obj.unpaid)}</span>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col className='mt-4 text-end me-4'>
                                    <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                                    {/* {
                                        obj.received ? (<Button className={`m-1 ${cx('my-btn')}`} variant="secondary" disabled>Hủy đơn trả hàng</Button>) : (<Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger" onClick={() => deleteform()}>Hủy đơn trả hàng</Button>)
                                    } */}
                                    {/* {
                                        obj.total - obj.paid === 0 ? (<div></div>) : (<Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => setShowpaid(true)}>Hoàn tiền</Button>)
                                    } */}
                                </Col>
                            </Row>
                        </div>
                    </div>)
                }


            </div>
            {/* <Modal
                show={showpaid}
                onHide={handleClosepaid}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col xs md lg={8} className='fw-bold'>
                        Hoàn trả khách
                    </Col>
                    <Col xs md lg={4} className='text-end pe-5'>
                        <input className={`${cx('textfield')} `} type="number" inputMode="numeric" onChange={(e) => {

                            if (e.target.value > (obj.unpaid)) e.target.value = obj.unpaid;
                            else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;
                            setPaid(parseInt(e.target.value))

                        }} />
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosepaid}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmitpaid}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>In đơn trả hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p >Hệ thống đang xử lý yêu cầu xuất file của bạn !</p>
                    <p>Bạn có thể tải file dữ liệu tại:</p>
                    <div className='ms-2 mb-3'>
                        <li>Cập nhật email để nhận file về email trong lần xuất dữ liệu sau</li>
                        <li>Danh sách các file đã được xuất tại phần Thông tin cá nhân -{'>'} Xuất nhập file</li>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className={`m-1 ${cx('my-btn')}`} onClick={() => submit()}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showreceived}
                onHide={handleClosereceived}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Nhập hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Xác nhận nhân hàng vào kho
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosereceived}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleReceived}>Xác nhận</Button>
                </Modal.Footer>
            </Modal> */}
            <ModalLoading open={loading} title={'Đang tải'} />
        </div >
    );
}

export default InfoReturn;
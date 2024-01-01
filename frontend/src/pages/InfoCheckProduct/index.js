import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './InfoCheckProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { data } from './data';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { FaDownload } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
function InfoCheckProduct() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const checkproductid = useParams()
    const [obj, setObj] = useState(null)
    const [list, setList] = useState([])
    useEffect(() => {
        setObj(data)
        setList(data.list)
    });



    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)

    };
    const handleShow = () => setShow(true);

    const submit = () => {
        handleClose()
    }

    const submitform = () => {

        setLoading(true);
        setTimeout(() => {
            const newobj = obj
            newobj.status = 1
            setObj(newobj)
            setLoading(false);
            toastContext.notify('success', 'Đã cân bằng kho');
        }, 2000);



    }

    const deleteform = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toastContext.notify('success', 'Đã xóa phiếu');
        }, 2000);
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('frame')}>
                    {
                        obj === null ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <div>
                                <div className='d-flex mb-2'>
                                    <p className='fs-5 me-4'>{obj.sku}</p>
                                    {
                                        obj.status === 1 ? (
                                            <div className={cx('status-1')}>Đã cân bằng </div>
                                        ) : (
                                            <div className={cx('status-2')}>Đang kiểm hàng </div>
                                        )
                                    }

                                </div>
                                <div className='my-4'>
                                    <Button variant="secondary" onClick={() => handleShow()}>
                                        <FaDownload className='me-2' />
                                        Xuất file
                                    </Button>
                                </div>
                                <p className={`mt-4 mb-1 ${cx('title')}`}>Tất cả</p>
                                <div className={cx('content-check')}>
                                    <div className={cx('row')}>
                                        <div className={cx('columns-1')}>STT</div>
                                        <div className={cx('columns-1')}>Ảnh</div>
                                        <div className={cx('columns-2')}>Tên sản phẩm</div>
                                        <div className={cx('columns-3')}>Tồn thực tế</div>
                                        <div className={cx('columns-3')}>Lý do</div>
                                        <div className={cx('columns-3')}>Ghi chú</div>

                                    </div>
                                    <div className={cx('list-import')}>
                                        {
                                            list.map((item, index) => (
                                                <div className={`${cx('item')}`} key={item.id}>
                                                    <div className={cx('columns-1')}>{index + 1}</div>
                                                    <div className={cx('columns-1')}><img src={item.img} className={cx('img')} /></div>
                                                    <div className={cx('columns-2')}>
                                                        <div className='fs-6'>{item.name}</div>
                                                        <div>{item.sku}</div>
                                                    </div>
                                                    <div className={cx('columns-3')}>{item.actualexistence}</div>
                                                    <div className={cx('columns-3')}><div>{item.reason}</div></div>
                                                    <div className={cx('columns-3')}>{item.note}</div>
                                                </div>
                                            ))
                                        }
                                    </div>


                                </div>

                                {
                                    obj.status === 1 ? (<div>

                                    </div>) : (
                                        <Row>
                                            <Col className='mt-4 text-end me-4'>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger" onClick={() => deleteform()}>Xóa</Button>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary">
                                                    <NavLink to={"/checks/update/" + checkproductid.id} className={`text-decoration-none ${cx('nav-link')}`} >
                                                        Sửa
                                                    </NavLink>
                                                </Button>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submitform()}>Cân bằng kho</Button>

                                            </Col>
                                        </Row>
                                    )
                                }

                            </div>
                        )
                    }

                </div>
                <Modal size="lg" show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Nhập file danh sách sản phẩm kiểm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p >Hệ thống đang xử lý yêu cầu xuất file của bạn !</p>
                        <p>Bạn có thể tải file dữ liệu tại:</p>
                        <div className='ms-2 mb-3'>
                            <li>Cập nhật email để nhận file về email trong lần xuất dữ liệu sau</li>
                            <li>Danh sách các file đã được xuất tại phần Thông tin cá nhân -{'>'} Xuất nhập file</li>
                        </div>
                        Lưu ý: Sapo giới hạn tối đa 20,000 dòng dữ liệu cho mỗi lần xuất file
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className={`m-1 ${cx('my-btn')}`} onClick={() => submit()}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ModalLoading open={loading} title={'Đang tải'} />
            </div>
        </div >
    );
}

export default InfoCheckProduct;
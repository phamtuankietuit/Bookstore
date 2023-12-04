import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './InfoCheckProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { data } from './data';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { FaDownload } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
const cx = classNames.bind(styles);
function InfoCheckProduct() {
    const checkproductid = useParams()
    const [obj, setObj] = useState(null)
    const [list, setList] = useState([])
    useEffect(() => {
        setObj(data)
        setList(data.list)
        console.log(checkproductid)
    });

    const [PerPage, setPerPage] = useState(20);
    const [currentPage, setcurrentPage] = useState(1);

    const numofTotalPage = Math.ceil(list.length / PerPage);
    const pages = [...Array(numofTotalPage + 1).keys()].slice(1);

    const indexOflastPd = currentPage * PerPage;
    const indexOffirstPd = indexOflastPd - PerPage;

    const visible = list.slice(indexOffirstPd, indexOflastPd);
    const prevPage = () => {
        if (currentPage !== 1) setcurrentPage(currentPage - 1);
    }

    const nextPage = () => {
        if (currentPage !== numofTotalPage) setcurrentPage(currentPage + 1);
    }

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)

    };
    const handleShow = () => setShow(true);

    const submit = () => {
        handleClose()
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
                                            visible.map((item, index) => (
                                                <div className={`${cx('item')}`} key={item.id}>
                                                    <div className={cx('columns-1')}>{item.id}</div>
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
                                <Row className='mt-3 me-3'>
                                    <Col xs md={8} className='d-flex  justify-content-end'>

                                        <p className='mt-2 me-2'>Hiển thị</p>
                                        <Form.Select aria-label="Default select example" placeholder='Loai san pham' className={cx('form-select')}
                                            onChange={(e) => {
                                                setPerPage(parseInt(e.target.value))
                                            }}>

                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </Form.Select>


                                    </Col>
                                    <Col xs md={4}>
                                        <Pagination className=' justify-content-end'>
                                            <Pagination.Prev onClick={prevPage} />
                                            {
                                                pages.map(page => (
                                                    <Pagination.Item
                                                        key={page}
                                                        onClick={() => setcurrentPage(page)}
                                                        className={(currentPage === page) ? "active" : ""}>
                                                        {page}</Pagination.Item>
                                                ))
                                            }
                                            <Pagination.Next onClick={nextPage} />
                                        </Pagination>
                                    </Col>
                                </Row>
                                {
                                    obj.status === 1 ? (<div>

                                    </div>) : (
                                        <Row>
                                            <Col className='mt-4 text-end me-4'>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger" >Xóa</Button>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary">
                                                    <NavLink to={"/updatecheckproduct/" + checkproductid.id} className={`text-decoration-none ${cx('nav-link')}`} >
                                                        Sửa
                                                    </NavLink>
                                                </Button>
                                                <Button className={`m-1 ${cx('my-btn')}`} variant="primary" >Cân bằng kho</Button>

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
            </div>
        </div >
    );
}

export default InfoCheckProduct;
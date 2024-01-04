import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './InfoProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from '@mui/material/Switch';
import Properties from '~/components/Properties';
import Specifications from '~/components/Specifications';
import SliderImage from '~/components/SliderImage';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import noImage from '~/assets/images/no-image.png';
import * as ProductServices from '~/apiServices/productServices';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Barcode from 'react-barcode';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function InfoProduct() {
    const toastContext = useContext(ToastContext);
    const svgRef = useRef();

    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [price, setprice] = useState([])

    const [details, setdetails] = useState([])

    const [instock, setInstock] = useState([])

    const productid = useParams();

    const [product, setProduct] = useState(null);



    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
    };

    const submitdelete = () => {
        setLoading(true);

        const result = ProductServices.deleteProducts([{ productId: product.productId }])
            .catch((error) => {

                setLoading(false);
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        setLoading(false);
        toastContext.notify('success', 'Đã xóa sản phẩm');
        navigate('/products');

        console.log(result);
    }
    useEffect(() => {

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await ProductServices.getProduct(productid.id)
                .catch((err) => {
                    console.log(err);
                });

            setProduct(result)
            const price = [
                {
                    id: 1,
                    title: 'Giá bán',
                    value: addCommas(result.salePrice),
                },
                {
                    id: 2,
                    title: 'Giá vốn',
                    value: addCommas(result.purchasePrice),
                },
            ];
            setprice(price)


            const detail = [
                {
                    id: 1,
                    title: 'Nhà cung cấp',
                    value: result.supplierName,
                },
                {
                    id: 2,
                    title: 'Năm sản xuất',
                    value: result.details.publishYear,
                },
                {
                    id: 3,
                    title: 'Tác giả',
                    value: result.details.author,
                },
                {
                    id: 4,
                    title: 'Nhà xuất bản',
                    value: result.details.publisher,
                },
            ]
            setdetails(detail)


            const stock = [
                {
                    id: 1,
                    title: 'Mã sản phẩm',
                    value: result.productId,
                },
                {
                    id: 2,
                    title: 'Tồn kho',
                    value: result.currentStock,
                },
                {
                    id: 3,
                    title: 'Có thể bán',
                    value: result.currentStock,
                },
            ]
            setInstock(stock)
        }

        fetchApi();

    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {
                    product === null ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <div className={cx('content')}>
                            <Row className="w-100 mb-3">
                                <Col lg={8}>
                                    <div className={` ${cx('frame')} h-100`}>
                                        <p className={cx('title')}>
                                            Thông tin sản phẩm
                                        </p>
                                        <Row>
                                            <Col lg={5}>
                                                <SliderImage list={product.images.length > 0 ? product.images : [noImage,]} />
                                                <div className="d-flex justify-content-center">
                                                    <Barcode ref={svgRef} value={product.barcode} className={cx('barcode')} />
                                                </div>
                                            </Col>
                                            <Col lg={7}>
                                                <p className={`w-100 ${cx('name')}`}>
                                                    {product.name}
                                                </p>
                                                <p className={`mb-4 ${cx('name')}`}>
                                                    {addCommas(product.salePrice)} <sup>đ</sup>
                                                </p>
                                                <div className="mb-4">
                                                    Loại sản phẩm :  {product.categoryText}
                                                </div>
                                                <div className="mb-4">
                                                    <Specifications props={details} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className={` ${cx('frame')} h-100`}>
                                        <p className={cx('title')}>Mô tả sản phẩm</p>
                                        <div>
                                            <p className="mb-3">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="w-100">
                                <Col lg={8}>
                                    <div className={cx('frame')}>
                                        <p className={cx('title')}>Giá bán</p>
                                        <div className="d-flex">
                                            <Properties props={price} stype={1} />
                                        </div>
                                    </div>
                                    <div className={`${cx('frame')} mb-3`}>
                                        <p className={cx('title')}>Trạng thái</p>
                                        <div className="d-flex">
                                            <p>Cho phép bán</p>
                                            <Switch disabled checked={product.isActive} />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className={`${cx('frame')} h-100`}>
                                        <p className={cx('title')}>Thông tin bổ sung</p>
                                        <Properties props={instock} stype={0} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-4 text-end me-4">
                                    <ReactToPrint
                                        trigger={() => <Button
                                            className={`m-1 ${cx('my-btn')}`}
                                            variant="outline-primary"
                                        >
                                            In barcode
                                        </Button>}
                                        content={() => svgRef.current}
                                    />
                                    <Button
                                        className={`m-1 ${cx('my-btn')}`}
                                        variant="outline-primary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Thoát
                                    </Button>
                                    <Button
                                        className={`m-1 ${cx('my-btn')}`}
                                        variant="outline-danger"
                                        onClick={() => handleShow()}
                                    >
                                        Xóa
                                    </Button>
                                    <Button
                                        className={`m-1 ${cx('my-btn')}`}
                                        variant="primary"
                                    >
                                        <NavLink
                                            to={'/products/update/' + productid.id}
                                            className="text-decoration-none text-white"
                                        >
                                            Sửa sản phẩm
                                        </NavLink>
                                    </Button>{' '}
                                </Col>
                            </Row>
                        </div>
                    )
                }

                <Modal size="lg" show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className={`m-1 ${cx('my-btn')}`} onClick={handleClose}>
                            Thoát
                        </Button>
                        <Button variant="danger" className={`m-1 ${cx('my-btn')}`} onClick={submitdelete}>
                            Xóa
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ModalLoading open={loading} title={'Đang tải'} />
            </div>
        </div>
    );
}

export default InfoProduct;

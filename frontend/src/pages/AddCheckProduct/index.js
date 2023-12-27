import React from 'react';
import classNames from 'classnames/bind';
import styles from './AddCheckProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchResult from '~/components/SearchResult';
import MultiSelectModal from '~/components/MultiSelectModal';
import { FaBoxOpen } from "react-icons/fa";
import Item_Check from '~/components/Item_AddCheckProduct';
import { FaArrowUpFromBracket } from "react-icons/fa6";
import Modal from 'react-bootstrap/Modal';
import { FaCloudArrowDown } from "react-icons/fa6";
import { options2 } from '../ImportProduct/data';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import * as ProductServices from '~/apiServices/productServices';
const cx = classNames.bind(styles);
function AddCheckProduct(props) {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const [list, setList] = useState([])
    const [arr, setArr] = useState([])

    const [show, setShow] = useState(false);

    const [filename, setFilename] = useState('')
    const [urlfile, setUrl] = useState('')
    const handleClose = () => {
        setShow(false)
        setFilename('')
        setUrl('')
    };
    const handleShow = () => setShow(true);
    const addarr = (value) => {

        const isFound = arr.some(element => {
            if (element.sku === value.sku) {
                return true;
            }

            return false;
        });
        const obj = {
            productId: value.productId,
            sku: value.sku,
            name: value.name,
            featureImageUrl: value.images[0],
            actualexistence: 0,
            reason: 'Khác',
            note: '',
        }

        if (isFound === false) {
            setArr(arr => [...arr, obj]);
        }
    }

    const handleMultiSelected = (obj) => {
        obj.map((item, index) => (
            addarr(item)
        ))
    }
    const deletearr = (productId, index) => {
        setArr(arr.filter(items => items.productId !== productId));
    }

    const submit = () => {
        if (arr.length === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('error', 'Chưa chọn sản phẩm');
            }, 2000);
        }
        else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('success', 'Đã cân bằng kho');
            }, 2000);
            console.log(arr)
        }

    }

    const create = () => {
        if (arr.length === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('error', 'Chưa chọn sản phẩm');
            }, 2000);
        }
        else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('success', 'Đã tạo phiếu kiểm');
            }, 2000);
            console.log(arr)
        }
    }

    useEffect(() => {

        const fetchApi = async () => {
            const result = await ProductServices.getAllProducts()
                .catch((err) => {
                    console.log(err);
                });

            setList(result)
            // console.log(result)
        }

        fetchApi();

    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('frame')}>
                    <div className='d-flex'>
                        <p className={` w-50 ${cx('title')}`}>Tất cả</p>
                        <div className='w-50 text-end me-5'>
                            <span className={`me-2 ${cx('enterfile')}`} onClick={() => handleShow()} >
                                <FaArrowUpFromBracket className={`me-2 `} />
                                Nhập file
                            </span>
                        </div>
                    </div>

                    <Row>
                        <Col md={10} lg={10} className='p-0'>
                            <SearchResult stypeid={1} setValue={addarr} list={list} />
                        </Col>

                        <Col md={2} lg={2} className='p-0'>
                            <MultiSelectModal funtion={handleMultiSelected} list={list} />
                        </Col>

                    </Row>







                    <div className={`${cx('import-content')}`} >
                        <div className={cx('columns')}>
                            <div className={cx('columns-item-1')}>STT</div>
                            <div className={cx('columns-item-1')}>Ảnh</div>
                            <div className={cx('columns-item-2')}>Tên sản phẩm</div>
                            <div className={`text-center ${cx('columns-item-3')}`}>Tồn thực tế</div>
                            <div className={cx('columns-item-3')}>Lý do</div>
                            <div className={cx('columns-item-3')}>Ghi chú</div>

                        </div>
                        <Row className={cx('list-import')}>
                            {
                                arr.length === 0 ? (
                                    <div className={cx('no-product')}>
                                        <FaBoxOpen className={cx('icon')} />
                                        <p className='text-center w-100'>Phiếu kiểm hàng của bạn chưa có sản phẩm nào</p>
                                        <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => handleShow()}>Nhập file</Button>
                                    </div>
                                ) : (

                                    arr.map((item, index) => (
                                        <div key={item.id}>
                                            <Item_Check product={item} index={index + 1} funtion={deletearr} />

                                        </div>

                                    )

                                    )

                                )

                            }
                        </Row>

                    </div>
                    <hr />
                    <Row>
                        <Col className='mt-4 text-end me-4'>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => create()}>Tạo phiếu kiểm</Button>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Cân bằng kho</Button>

                        </Col>
                    </Row>
                </div>
            </div>

            <Modal size="lg" show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập file danh sách sản phẩm kiểm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-danger'>Chú ý : </p>
                    <div className='ms-2 mb-3'>
                        <li>Tải file mẫu nhập file tại đây(cập nhật ngày 31/11/2022)</li>
                        <li>File nhập có dung lượng tối đa là 3MB và 5000 bản ghi</li>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <form className={` ${cx('my-form')}`} onClick={() => document.querySelector(".input_field").click()}>
                            <input type='file' accept=".xlsx, .xls" className={`m-1 ${cx('input_field')}`} hidden
                                onChange={({ target: { files } }) => {
                                    files[0] && setFilename(files[0].name)
                                    if (files) {
                                        setUrl(URL.createObjectURL(files[0]))
                                    }
                                }} />
                            <FaCloudArrowDown className={cx('icon')} />
                            {
                                filename === '' ? (
                                    <span>
                                        Kéo thả file vào đây hoặc tải lên từ thiết bị
                                    </span>
                                ) : (
                                    <span>
                                        {filename}
                                    </span>
                                )
                            }
                        </form>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className={`m-1 ${cx('my-btn')}`} onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="primary" className={`m-1 ${cx('my-btn')}`} onClick={handleClose}>
                        Nhập file
                    </Button>
                </Modal.Footer>
            </Modal>

            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default AddCheckProduct;
import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './UpdateCheckProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { data } from '../InfoCheckProduct/data';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Item_Check from '~/components/Item_AddCheckProduct';
import SearchResult from '~/components/SearchResult';
import MultiSelectModal from '~/components/MultiSelectModal';
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { FaCloudArrowDown } from "react-icons/fa6";
import { options2 } from '../ImportProduct/data';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);



function UpdateCheckProduct() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const checkproductid = useParams()
    const [obj, setObj] = useState(data)
    const [list, setList] = useState(obj.list)
    const [PerPage, setPerPage] = useState(20);
    const [currentPage, setcurrentPage] = useState(1);



    const [show, setShow] = useState(false);
    const handleClose = () => {
        setFilename('')
        setUrl('')
        setShow(false)

    };
    const handleShow = () => setShow(true);

    const submit = () => {
        if (list.length === 0) {
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
            let newobj = obj;
            newobj.list = list;
            setObj(newobj)
            console.log(obj)
        }

    }

    const deleteform = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toastContext.notify('success', 'Đã xóa phiếu');
        }, 2000);
    }
    const addarr = (value) => {

        const isFound = list.some(element => {
            if (element.sku === value.sku) {
                return true;
            }

            return false;
        });
        const obj = {
            id: value.id,
            sku: value.sku,
            name: value.name,
            img: value.img,
            actualexistence: 0,
            reason: 'Khác',
            note: '',
        }

        if (isFound === false) {
            setList(list => [...list, obj]);
        }
    }
    const handleMultiSelected = (obj) => {
        obj.map((item, index) => (
            addarr(item)
        ))
    }

    const deletearr = (id, index) => {
        setList([...list.filter(i => i.id !== id)]);
    }

    const [filename, setFilename] = useState('')
    const [urlfile, setUrl] = useState('')
    return (
        <div>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('frame')}>
                        {
                            obj.sku === '' ? (
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

                                    <div className='d-flex mt-5'>
                                        <p className={` w-50 ${cx('title')}`}>Tất cả</p>
                                        <div className='w-50 text-end me-5'>
                                            <span className={`me-2 ${cx('enterfile')}`} onClick={() => handleShow()} >
                                                <FaArrowUpFromBracket className={`me-2 `} />
                                                Nhập file
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='d-flex mx-3'>
                                        <div className='flex-grow-1'><SearchResult stypeid={1} setValue={addarr} list={options2} /></div>

                                        <MultiSelectModal funtion={handleMultiSelected} list={options2} />


                                    </div>
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
                                                        <Item_Check product={item} index={index + 1} funtion={deletearr} />
                                                    </div>
                                                ))
                                            }
                                        </div>


                                    </div>

                                    <Row>
                                        <Col className='mt-4 text-end me-4'>
                                            <Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger" onClick={() => deleteform()}>Xóa</Button>
                                            <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Cân bằng kho</Button>

                                        </Col>
                                    </Row>


                                </div>
                            )
                        }

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
            </div >
        </div>
    );
}

export default UpdateCheckProduct;
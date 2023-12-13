import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import Item from '~/components/Item_SearchBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import SearchBar from '~/components/SearchBar';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ModalProduct.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaX } from "react-icons/fa6";
const cx = classNames.bind(styles);
function ModalProduct({ list, handleClose, handlesubmit }) {

    const [data, setdata] = useState([])
    const [submitlist, setSubmit] = useState(data.filter(items => items.checked === true))
    const [search, setSearch] = useState('');
    const [fullchecked, setFullchecked] = useState(false)

    useEffect(() => {
        setdata(list)
        // console.log(list)
    }, [data]);
    const prevPage = () => {
        if (currentPage !== 1) setcurrentPage(currentPage - 1);
    }

    const nextPage = () => {
        if (currentPage !== numofTotalPage) setcurrentPage(currentPage + 1);
    }




    const renderproductlist = data.filter(product => (
        search === '' || product.name.includes(search) || product.sku.includes(search)
    ));

    const PerPage = 5;
    const [currentPage, setcurrentPage] = useState(1);

    const numofTotalPage = Math.ceil(renderproductlist.length / PerPage);

    const indexOflastPd = currentPage * PerPage;
    const indexOffirstPd = indexOflastPd - PerPage;
    const visible = renderproductlist.slice(indexOffirstPd, indexOflastPd);

    const handlechecked = (index) => {
        let newArr = [...renderproductlist];
        newArr[index]['checked'] = !newArr[index]['checked'];

        setdata(newArr)
        setSubmit(renderproductlist.filter(items => items.checked === true));
        if (submitlist.length === renderproductlist.length) setFullchecked(true);
    }
    const handleSearch = (value) => {
        setSearch(value)
        setcurrentPage(1)
    }
    const handleFullChecked = (value) => {
        if (value === false) {
            let newArr = [...renderproductlist];
            newArr.map(item => (
                item.checked = true
            ))
            setdata(newArr)
            setSubmit(renderproductlist.filter(items => items.checked === true));
            setFullchecked(true)
        }
        else {

            let newArr = [...renderproductlist];
            newArr.map(item => (
                item.checked = false
            ))
            setdata(newArr)
            setSubmit(renderproductlist.filter(items => items.checked === true));
            setFullchecked(false)

        }


    }
    const ModalhandleClose = () => {
        handleClose()
        ResetArr()
    }


    const ResetArr = () => {
        let newArr = [...data];
        newArr.map(item => (
            item.checked = false
        ))
        setdata(newArr)
    }
    const ModalhandleSubmit = () => {
        setSubmit(renderproductlist.filter(items => items.checked === true));
        ResetArr()

        handlesubmit(submitlist)
    }
    return (
        <div className='mt-3 mx-3'>
            <Row>
                <Col xs md lg={11}>
                    <p className='fw-bold fs-4 '>Chọn nhanh sản phẩm</p>
                </Col>
                <Col xs md lg={1}>
                    <FaX className={cx('icon')} onClick={ModalhandleClose} />
                </Col>
            </Row>

            <hr />
            <div >
                <SearchBar placeholder={'Tìm kiếm theo tên, mã sản phẩm'} setInput={handleSearch} />
                <div className='mt-3 d-flex'>
                    <Form.Check aria-label="option 1" checked={fullchecked} onChange={() => handleFullChecked(fullchecked)} />
                    <p className='ms-2'>Đã chọn {submitlist.length} sản phẩm </p>
                </div>
                <div className={cx('list')}>
                    {
                        visible.map((option, index) => (
                            <div className={cx('list-item')} key={option.id} >
                                <Row>
                                    <Col xs={1} md={1} lg={1} className='m-0'>
                                        <Form.Check aria-label="option 1" checked={option.checked} onChange={() => handlechecked(index + (currentPage - 1) * 5)} />
                                    </Col>
                                    <Col xs={11} md={11} lg={11} className='m-0' onClick={() => handlechecked(index + (currentPage - 1) * 5)}>
                                        <Item product={option} />
                                    </Col>

                                </Row>





                            </div>

                        ))
                    }




                </div>
                <Pagination className={`justify-content-end `}>
                    <Pagination.Prev onClick={prevPage} />
                    <Pagination.Next onClick={nextPage} />
                </Pagination>
            </div>
            <hr />
            <Row>
                <Col className='mt-4 text-end me-4'>
                    <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={ModalhandleClose}>Thoát</Button>
                    <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={ModalhandleSubmit}>Xác nhận</Button>

                </Col>
            </Row>
        </div>
    );
}

export default ModalProduct;
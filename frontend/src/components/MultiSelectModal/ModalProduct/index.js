import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Item from './Item'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ModalProduct.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaX } from "react-icons/fa6";
import * as ProductServices from '~/apiServices/productServices';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function ModalProduct({ handleClose, handlesubmit, list }) {

    const [data, setdata] = useState([])
    const [submitlist, setSubmit] = useState([])

    useEffect(() => {

        setdata(list)
        setNumofTotal(data.length)

    });



    const [currentPage, setcurrentPage] = useState(1);

    const [numofTotalPage, setNumofTotal] = useState(0)

    const ModalhandleClose = () => {
        handleClose()
    }



    const ModalhandleSubmit = () => {
        console.log(submitlist)
        handlesubmit(submitlist)
    }
    return (
        <div className='mt-3 mx-3'>
            <Row>
                <Col xs={11} md={11} lg={11}>
                    <p className='fw-bold fs-4 '>Chọn nhanh sản phẩm</p>
                </Col>
                <Col xs={1} md={1} lg={1}>
                    <FaX className={cx('icon')} onClick={ModalhandleClose} />
                </Col>
            </Row>

            <hr />
            <div >
                <div className={cx('list')}>
                    <DataTable
                        columns={Item}
                        data={data}
                        selectableRows
                        onSelectedRowsChange={(e) => setSubmit(e.selectedRows)}
                        pagination
                        fixedHeader
                        paginationPerPage={7}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Hiển thị: ',
                            rangeSeparatorText: 'trên',
                            noRowsPerPage: false,
                            selectAllRowsItem: false,
                            selectAllRowsItemText: 'Tất cả',
                        }}
                        paginationRowsPerPageOptions={[7]}
                        noDataComponent={
                            <div className={cx('no-data-comp')}>
                                <FontAwesomeIcon
                                    className={cx('no-data-icon')}
                                    icon={faMagnifyingGlass}
                                />
                                <div className={cx('no-data-title')}>
                                    Không có dữ liệu
                                </div>
                            </div>
                        }
                    >

                    </DataTable>






                </div>
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
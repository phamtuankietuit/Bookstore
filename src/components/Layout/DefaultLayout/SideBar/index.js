import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaHouse } from 'react-icons/fa6'
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";
import { FaBuffer } from 'react-icons/fa6'
import { FaWallet } from 'react-icons/fa6'
import { FaChartSimple } from 'react-icons/fa6'
import { FaBusinessTime } from 'react-icons/fa6'
import { FaCartShopping } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'
import { FaUsers } from 'react-icons/fa6'
import Collapse from 'react-bootstrap/Collapse';
import logo from '../../../../assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
const cx = classNames.bind(styles);

function SideBar() {


    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
    const [open8, setOpen8] = useState(false);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('SideBar inner')}>

                <div className='d-flex align-items-center mb-3'>
                    <img src={logo} alt="" className={cx('my-icon')}></img>
                    <p className={cx('name')}> Triple K</p>
                </div>




                <p className={`text-wrap w-100 ms-2`} href='#'>
                    <NavLink to="/ListProduc" className={(navData) => navData.isActive ?
                        `btn bg-primary text-white ps-1 text-start ${cx('overview')}` :
                        `btn text-start ps-1 ${cx('overview')}`} >
                        <Row className='ps-2'>
                            <Col xs="2" md="2">
                                <FaHouse />
                            </Col>

                            <Col xs="10" md="10" >
                                Tổng quan
                            </Col>
                        </Row>

                    </NavLink>



                </p>

                <div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open1 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen1(!open1)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open1}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaCartShopping />
                                </Col>

                                <Col xs="10" md="10">
                                    Đơn hàng
                                </Col>


                            </Row>
                            <div>
                                {
                                    open1 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open1}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open2 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen2(!open2)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open2}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaBuffer />
                                </Col>

                                <Col xs="10" md="10" >
                                    Sản phẩm
                                </Col>


                            </Row>
                            <div>
                                {
                                    open2 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open2}>
                            <div className={cx('accor-content')}>
                                <NavLink to="/ListProduct" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`} >
                                    <li className={cx('my-li')}>Danh sách sản phẩm</li>

                                </NavLink>
                                <NavLink to="/3" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Quản lý kho</li>
                                </NavLink>
                                <NavLink to="/4" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>

                                </NavLink>
                                <NavLink to="/5" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Kiểm hàng</li>

                                </NavLink>
                                <NavLink to="/6" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhà cung cấp</li>

                                </NavLink>
                            </div>

                        </Collapse>

                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open3 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen3(!open3)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open3}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaUser />
                                </Col>

                                <Col xs="10" md="10" >
                                    Khách hàng
                                </Col>
                            </Row>
                            <div>
                                {
                                    open3 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open3}>
                            <div className={cx('accor-content')}>
                                <NavLink to="/ListProduct" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`} >
                                    <li className={cx('my-li')}>Danh sách sản phẩm</li>

                                </NavLink>
                                <NavLink to="/3" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Quản lý kho</li>
                                </NavLink>
                                <NavLink to="/4" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>

                                </NavLink>
                                <NavLink to="/5" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Kiểm hàng</li>

                                </NavLink>
                                <NavLink to="/6" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhà cung cấp</li>

                                </NavLink>
                            </div>

                        </Collapse>

                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open4 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen4(!open4)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open4}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaWallet />
                                </Col>

                                <Col xs="10" md="10">
                                    Sổ quỹ
                                </Col>


                            </Row>
                            <div>
                                {
                                    open4 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open4}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open5 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen5(!open5)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open5}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaChartSimple />
                                </Col>

                                <Col xs="10" md="10" >
                                    Báo cáo
                                </Col>


                            </Row>
                            <div>
                                {
                                    open5 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open5}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open6 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen6(!open6)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open6}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaBuffer />
                                </Col>

                                <Col xs="10" md="10" >
                                    Quản lý khuyến mãi
                                </Col>


                            </Row>
                            <div>
                                {
                                    open6 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open6}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open7 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen7(!open7)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open7}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaUsers />
                                </Col>

                                <Col xs="10" md="10" >
                                    Quản lý nhân viên
                                </Col>


                            </Row>
                            <div>
                                {
                                    open7 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open7}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>
                    <div className={cx('accor-item')}>
                        <Button
                            variant='light'
                            className={open8 ?
                                `text-start d-flex bg-primary text-white ${cx('accor-header')}  ` :
                                `text-start d-flex bg-white ${cx('accor-header')}`}
                            onClick={() => setOpen8(!open8)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open8}

                        >
                            <Row className='w-100'>
                                <Col xs="2" md="2" className='pe-0'>
                                    < FaBusinessTime />
                                </Col>

                                <Col xs="10" md="10">
                                    Nhật ký hoạt động
                                </Col>


                            </Row>
                            <div>
                                {
                                    open8 === false ? (
                                        <FaCaretRight />
                                    ) : (
                                        <FaCaretDown />
                                    )
                                }
                            </div>
                        </Button>
                        <Collapse in={open8}>
                            <div className={cx('accor-content')}>
                                < NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </div>

                        </Collapse>
                    </div>



                </div >

            </div >
        </div >
    );
}

export default SideBar;

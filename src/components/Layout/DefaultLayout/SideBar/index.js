import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaHouse } from 'react-icons/fa6'
import { FaBuffer } from 'react-icons/fa6'
import { FaWallet } from 'react-icons/fa6'
import { FaChartSimple } from 'react-icons/fa6'
import { FaBusinessTime } from 'react-icons/fa6'
import { FaCartShopping } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'
import { FaUsers } from 'react-icons/fa6'
import Accordion from 'react-bootstrap/Accordion';
import logo from '../../../../assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
const cx = classNames.bind(styles);

function SideBar() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('Menubar inner')}>

                <div className='d-flex align-items-center '>
                    <img src={logo} alt="" className={cx('my-icon')}></img>
                    <p className={cx('name')}> Triple K</p>
                </div>




                <p class="text-wrap ms-2" href='#'>
                    <NavLink to="/overview" className={(navData) => navData.isActive ?
                        'btn bg-primary text-white w-100 text-start' :
                        'btn w-100 text-start'} >
                        <Row>
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
                    <Accordion alwaysOpen>

                        <Accordion.Item eventKey="0">
                            <Accordion.Header ><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaCartShopping />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Đơn hàng
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>

                                <NavLink to="/2" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>


                        <Accordion.Item eventKey="1" >
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaBuffer />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Sản phẩm
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100' >
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



                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaUser />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Khách hàng
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/7" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/8" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaWallet />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Sổ quỹ
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/9" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/10" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaChartSimple />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Báo cáo
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/11" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/12" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="5">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaBuffer />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Quản lý khuyến mãi
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/13" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/14" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="6">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2">
                                    < FaUsers />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Quản lý nhân viên
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/15" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/16" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="7">
                            <Accordion.Header><Row className='w-100'>
                                <Col xs="2" md="2" className='pe-0'>
                                    < FaBusinessTime />
                                </Col>

                                <Col xs="10" md="10" className={cx('accor-header')}>
                                    Nhật ký hoạt động
                                </Col>


                            </Row>
                            </Accordion.Header>
                            <Accordion.Body className='p-0 w-100'>
                                <NavLink to="/17" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                                <NavLink to="/18" className={(navData) => navData.isActive ?
                                    `btn bg-primary text-white ${cx('my-navlink')}` :
                                    `btn ${cx('my-navlink')}`}>
                                    <li className={cx('my-li')}>Nhập hàng</li>
                                </NavLink>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </div>

            </div>
        </div>
    );
}

export default SideBar;

import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { FaBell } from 'react-icons/fa6'
import { FaAngleLeft } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

Header.propTypes = {
    info: PropTypes.element.isRequired
};
const cx = classNames.bind(styles);

function Header(info) {
    let navigate = useNavigate();
    return (
        <div className={cx('wrapper')}>
            <Container className={cx('header')}>
                <Row className='w-100 h-100'>
                    <Col xs md={8}>
                        {
                            info.info.title === 'Quay lại' ? (
                                <a className={`${cx('title-return')} text-start d-flex align-items-center h-100`} href='#' onClick={() => navigate(-1)}>
                                    <FaAngleLeft className='me-2' />
                                    Quay lại
                                </a>
                            ) : (
                                <p className={`${cx('title')} text-start d-flex align-items-center`}>
                                    {info.info.title}
                                </p>
                            )
                        }

                    </Col>
                    <Col xs md={4} className='align-items-center'>
                        <Row >
                            <Col xs md={4} className='text-end d-flex justify-content-end align-items-center'>
                                <FaBell className={cx('header-icon')} />
                            </Col>
                            <Col xs md={8} >
                                <Row className='text-end'>
                                    <Col xs md={3}>
                                        <Image src={info.info.img} roundedCircle fluid className={`${cx('avatar')} p-1`} />
                                    </Col >
                                    <Col xs md={9} className='text-start d-flex align-items-center'>
                                        {info.info.name}
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>




        </div>
    );
}

export default Header;

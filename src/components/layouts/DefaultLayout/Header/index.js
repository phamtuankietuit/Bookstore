import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { FaBell } from 'react-icons/fa6';
import { FaAngleLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const cx = classNames.bind(styles);

function Header({ info }) {
    let navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <Container className={` ${cx('header')}`}>
                <Row className="w-100 h-100">
                    <Col xs md={8}>
                        {info.title === 'Quay lại' ? (
                            <a
                                className={`${cx(
                                    'title-return',
                                )} text-start d-flex align-items-center h-100`}
                                href="#"
                                onClick={() => navigate(-1)}
                            >
                                <FaAngleLeft className="me-2" />
                                Quay lại
                            </a>
                        ) : (
                            <p
                                className={`${cx(
                                    'title',
                                )} text-start d-flex align-items-center`}
                            >
                                {info.title}
                            </p>
                        )}
                    </Col>
                    <Col xs md={4} className="d-flex align-items-center">
                        <Row className="w-100">
                            <Col
                                xs
                                md={6}
                                className="text-end d-flex justify-content-end align-items-center"
                            >
                                <FaBell className={cx('header-icon')} />
                            </Col>
                            <Col xs md={6}>
                                <NavLink
                                    to="/123"
                                    className="text-black text-decoration-none"
                                >
                                    <Row className="text-end">
                                        <Col xs md={3}>
                                            <Image
                                                src={info.img}
                                                roundedCircle
                                                fluid
                                                className={`${cx('avatar')}`}
                                            />
                                        </Col>
                                        <Col
                                            xs
                                            md={9}
                                            className="text-start d-flex align-items-center"
                                        >
                                            {info.name}
                                        </Col>
                                    </Row>
                                </NavLink>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Header;

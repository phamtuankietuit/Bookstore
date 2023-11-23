import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Specifications.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
Specifications.propTypes = {

};
const cx = classNames.bind(styles);
function Specifications({ props }) {
    const [list, Setlist] = useState([])

    useEffect(() => {
        Setlist(props)
    })
    return (
        <div>
            <div className={`${cx('wrapper')}`}>
                <div className='p-1'>
                    {
                        list.map(item => (
                            <Col key={item.id} className='m-2'>
                                <Row>
                                    <Col className={cx('title')}> {item.title} </Col>
                                    <Col xs={1} md={1}> : </Col>
                                    <Col className={cx('value')} xs={5} md={5}> {item.value}</Col>
                                    <Col xs={1} md={1}>  </Col>
                                </Row>

                            </Col>
                        ))
                    }
                </div>

            </div>
        </div>
    );
}

export default Specifications;
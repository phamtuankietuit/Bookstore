import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Properties.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';
Properties.propTypes = {

};
const cx = classNames.bind(styles);
function Properties({ props, stype }) {
    const [list, Setlist] = useState([])

    useEffect(() => {
        Setlist(props)
    })
    return (
        <div className={stype === 1 ? `d-flex ${cx('wrapper')}` : `${cx('wrapper')}`}>
            {
                list.map(item => (
                    <Col key={item.id} className='mb-2'>
                        <Row>
                            <Col className={cx('title')}> {item.title} </Col>
                            <Col>: {item.value}</Col>
                        </Row>

                    </Col>
                ))
            }
        </div>
    );
}

export default Properties;
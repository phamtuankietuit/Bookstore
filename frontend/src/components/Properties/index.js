import classNames from 'classnames/bind';
import styles from './Properties.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cx = classNames.bind(styles);
function Properties({ props, stype }) {
    return (
        <div className={stype === 1 ? `d-flex ${cx('wrapper')}` : `${cx('wrapper')}`}>
            {
                props.map(item => (
                    <Col key={item.id} className='mb-2'>
                        <Row>
                            <Col className={cx('title')}> {item.title} </Col>
                            <Col>:</Col>
                            <Col> {item.value}</Col>
                        </Row>

                    </Col>
                ))
            }
        </div>
    );
}

export default Properties;
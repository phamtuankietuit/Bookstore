import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AddReturnProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Item_Return from '~/components/Item_Return';
import { data } from './data';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function AddReturnProduct() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate()
    const [obj, setObj] = useState(null)
    const [isset, setIsset] = useState(false)
    useEffect(() => {
        setObj(data)
        if (isset === false && obj !== null) {
            AddArr(obj.list)
            setIsset(true)
        }
    });
    const [total, setTotal] = useState(0)
    const [note, setNote] = useState('')
    const [nums, setNums] = useState(0)
    const [paid, setPaid] = useState(0)

    const update = () => {
        let newcost = 0;
        let newnums = 0;
        if (arr.length !== 0) {
            arr.map(item => {
                newcost += item.total
                newnums += item.nums
            })
        }
        setNums(newnums)
        setTotal(newcost)

    }
    const AddArr = (value) => {
        value.map((item) => {
            let newitem = {
                id: item.id,
                name: item.name,
                sku: item.sku,
                img: item.img,
                nums: 0,
                maxnums: item.nums,
                cost: item.cost,
                total: 0,
            }

            setArr(arr => [...arr, newitem]);
        })

    }
    const [arr, setArr] = useState([])


    const [Return, setReturn] = useState(true)


    const submit = () => {
        const newarr = arr.filter(arr => arr.nums > 0)
        if (nums === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('error', 'Chưa trả sản phẩm nào');
            }, 2000);
        }
        else {
            setLoading(true);
            setTimeout(() => {
                console.log(newarr)
                setLoading(false);
                toastContext.notify('success', 'Đã tạo đơn trả');
            }, 2000);
        }
    }
    const returnid = useParams()
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {
                    obj === null ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <div>
                            <div className={` ${cx('frame')}`}>
                                <p className={`mt-4 mb-1 ${cx('title')}`}>Thông tin phiếu</p>
                                <hr />
                                <Row className='mb-4'>
                                    <Col lg={6} className='mb-2'>
                                        <p>Khách hàng  </p>
                                        <p>Anh Lê Võ Duy Khiêm - 0333333333</p>
                                    </Col>
                                    <Col lg={6} className='mb-2'>
                                        <p>Mã đơn hàng  </p>
                                        <p>{returnid.id}</p>
                                    </Col>
                                </Row>



                            </div>

                            <div className={cx('frame')}>
                                <p className={`mt-4 mb-1 ${cx('title')}`}>Sản phẩm trả </p>
                                <hr />
                                <div className={cx('content-check')}>
                                    <div className={cx('row')}>
                                        <div className={cx('columns-1')}>STT</div>
                                        <div className={cx('columns-1')}>Ảnh</div>
                                        <div className={cx('columns-2')}>Tên sản phẩm</div>
                                        <div className={cx('columns-3')}>Số lượng</div>
                                        <div className={cx('columns-3')}>Đơn giá trả</div>
                                        <div className={cx('columns-3')}>Thành tiền</div>

                                    </div>
                                    <div className={cx('list')}>
                                        {
                                            arr.map((item, index) => (
                                                <Item_Return product={item} index={index + 1} key={item.id} update={update} />
                                            ))
                                        }
                                    </div>


                                </div>
                                <Row className='text-end'>
                                    <Row className='mb-3'>
                                        <Col xs md lg={8} >
                                            Số lượng trả {arr.length} sản phẩm
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {nums}
                                        </Col>
                                    </Row>

                                    <Row className='mb-3'>
                                        <Col xs md lg={8} className='fw-bold'>
                                            Cần hoàn tiền trả hàng
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {addCommas(total)}
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                            <div className={cx('frame')}>
                                <Row>
                                    <Col lg={8}>
                                        <p className={`mt-4 mb-1 ${cx('title')}`}>Nhận hàng trả lại</p>
                                    </Col>
                                    <Col lg={4} className='d-flex'>
                                        <Button className={Return ? `${cx('return-true')}` : `${cx('return-false')}`} onClick={() => setReturn(true)}>Đã nhận và nhập kho </Button>
                                        <Button className={Return ? `${cx('return-false')}` : `${cx('return-true')}`} onClick={() => setReturn(false)}>Chưa nhận hàng</Button>
                                    </Col>
                                </Row>

                            </div>
                            <div className={cx('frame')}>
                                <p className={`mt-4 mb-1 ${cx('title')}`}>Hoàn tiền</p>
                                <Row className='mb-4'>
                                    <Col lg={6} className='mb-2'>
                                        <p className='mb-2'>Ghi chú </p>
                                        <textarea

                                            style={{
                                                fontSize: '13px',
                                                marginTop: '0px',
                                                color: '#55555',
                                                minWidth: '70%',
                                                height: '140px',
                                            }}

                                        ></textarea>
                                    </Col>
                                    <Col lg={6} className='mb-2'>
                                        <Row className='mt-3'>
                                            <Col xs md lg={8} className='fw-bold'>
                                                Tiền cần trả
                                            </Col>
                                            <Col xs md lg={4} className='text-end pe-5'>
                                                {
                                                    addCommas(total)

                                                }
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col xs md lg={8} className='fw-bold'>
                                                Hoàn trả khách
                                            </Col>
                                            <Col xs md lg={4} className='text-end pe-5'>
                                                <input className={`${cx('textfield')} `} type="number" inputMode="numeric" onChange={(e) => {

                                                    if (e.target.value > total) e.target.value = total;
                                                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;
                                                    setPaid(parseInt(e.target.value))

                                                }} />
                                            </Col>
                                        </Row>
                                        <hr className={cx('divider')} />
                                        <Row className='mt-3'>
                                            <Col xs md lg={8} className='fw-bold'>
                                                Còn phải trả
                                            </Col>
                                            <Col xs md lg={4} className='text-end pe-5'>
                                                {

                                                    (total - paid) < 0 ? (0) :

                                                        addCommas(total - paid)
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mt-4 text-end me-4'>
                                        <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                                        <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Tạo đơn trả hàng</Button>

                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )
                }
                <ModalLoading open={loading} title={'Đang tải'} />
            </div>
        </div>
    );
}

export default AddReturnProduct;
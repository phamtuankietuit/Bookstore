import React from 'react';
import classNames from 'classnames/bind';
import styles from './ImportProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchResult from '~/components/SearchResult';
import MultiSelectModal from '~/components/MultiSelectModal';
import Properties from '~/components/Properties';
import { FaDeleteLeft } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Item_import from '~/components/Item_ImportProduct';
import { FaBoxOpen } from "react-icons/fa";
import { options, options2, options3 } from './data';
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function ImportProduct() {
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const [producer, set] = useState(
        null
    );

    const [list, setList] = useState([])
    const [cost, setCost] = useState(0)
    const [arr, setarr] = useState([]);
    const [discount, setDiscount] = useState(0)
    const [typediscount, setType] = useState(true)
    const [paid, setPaid] = useState(0)
    const [open, setOpen] = useState(false)
    const [total, setTotal] = useState(0)
    const [note, setNote] = useState('')
    const [nums, setNums] = useState(0)

    const v = [
        {
            id: 1,
            title: 'Nợ hiện tại',
            value: '0',
        },
        {
            id: 2,
            title: 'Tổng đơn nhập',
            value: '3',
        },
        {
            id: 3,
            title: 'Trả hàng',
            value: '0',
        }
    ]

    const setproducer = (value) => {
        set(value)
        setList(options2)

    }

    const addarr = (value) => {
        // console.log(value)
        const isFound = arr.some(element => {
            if (element.sku === value.sku) {
                return true;
            }

            return false;
        });
        const obj = {
            id: value.id,
            sku: value.sku,
            name: value.name,
            img: value.img,
            cost: value.cost,
            nums: 0,
            total: 0,
        }

        if (isFound === false) {
            setarr(arr => [...arr, obj]);
        }

    }


    const deletearr = (id, index) => {
        let newcost = cost - arr[index - 1]['total'];
        let newnums = nums - arr[index - 1]['nums']
        setCost(newcost)
        setNums(newnums)

        if (typediscount === true) setTotal(newcost * (1 - discount / 100))
        else setTotal(newcost - discount)

        setarr(arr.filter(items => items.id !== id));


    }

    const handleMultiSelected = (obj) => {
        // console.log(obj)
        obj.map((item, index) => (
            addarr(item)
        ))

    }


    const update = () => {
        let newcost = 0;
        let newnums = 0;
        if (arr.length !== 0) {
            arr.map(item => {
                newcost += item.total
                newnums += item.nums
            })
        }

        setCost(newcost)
        setNums(newnums)

        if (typediscount === true) setTotal(newcost * (1 - discount / 100))
        else setTotal(newcost - discount)

    }

    const submit = () => {
        if (producer === null) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('error', 'Chưa chọn nhà sản xuất');
            }, 2000);
        }
        else if (arr.length === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('error', 'Chưa chọn sản phẩm');
            }, 2000);
        }
        else {
            const value = {
                producer: producer,
                nums: nums,
                discount: discount,
                paid: paid,
                total: total,
                unpaid: (total - paid) < 0 ? 0 : (total - paid),
                list_product: arr,
                note: note,
                status: total - paid === 0 ? true : false,

            }
            console.log(value)
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify('success', 'Đã nhập hàng');
            }, 2000);
        }

    }


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('frame')}>
                    <p className={cx('title')}>Thông tin nhà cung cấp</p>
                    {
                        producer === null ? (
                            <div>
                                <SearchResult setValue={setproducer} stypeid={0} list={options} />

                                <div className={cx('no-info')}>
                                    <p className='text-center w-100'>Chưa có thông tin nhà cung cấp</p>
                                </div>

                            </div>
                        ) : (

                            < div >
                                <Row>
                                    <Col lg={8}>

                                        <div className='d-flex'>
                                            <p className='me-4'>
                                                <NavLink to='/' className='fs-5 text-decoration-none' >
                                                    {producer.name}

                                                </NavLink>
                                            </p>
                                            <FaDeleteLeft onClick={(e) => {
                                                setLoading(true);
                                                setTimeout(() => {
                                                    setLoading(false);
                                                    set(null)
                                                    setList([])
                                                    setarr([])
                                                    setNums(0)
                                                    setCost(0)
                                                    setTotal(0)
                                                }, 1000);


                                            }} className={cx('icon')} />
                                        </div>
                                        <div>
                                            Địa chỉ: {producer.address}
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className={cx('tag-debt')}>
                                            <Properties props={v} stype={0} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                </div>

                <div className={cx('frame')}>
                    <p className={cx('title')}>Thông tin sản phẩm</p>
                    <Row>
                        <Col md={10} lg={10} className='p-0'>
                            <SearchResult stypeid={1} setValue={addarr} list={list} />
                        </Col>

                        <Col md={2} lg={2} className='p-0'>
                            <MultiSelectModal funtion={handleMultiSelected} list={list} />
                        </Col>

                    </Row>





                    <div className={`${cx('import-content')}`} >
                        <div className={cx('columns')}>
                            <div className={cx('columns-item-1')}>STT</div>
                            <div className={cx('columns-item-1')}>Ảnh</div>
                            <div className={cx('columns-item-2')}>Tên sản phẩm</div>
                            <div className={cx('columns-item-3')}>Số lượng nhập</div>
                            <div className={cx('columns-item-3')}>Đơn giá</div>
                            <div className={cx('columns-item-3')}>Thành tiền</div>

                        </div>
                        <Row className={cx('list-import')}>
                            {
                                arr.length === 0 ? (
                                    <div className={cx('no-product')}>
                                        <FaBoxOpen className={cx('icon')} />
                                        <p className='text-center w-100'>Đơn hàng của bạn chưa có sản phẩm nào</p>
                                    </div>
                                ) : (
                                    arr.map((item, index) => (
                                        <div key={item.id}>
                                            <Item_import product={item} index={index + 1} funtion={deletearr} update={update} />

                                        </div>

                                    )

                                    )
                                )

                            }
                        </Row>

                    </div>
                    <hr />
                    <Row>
                        <Col lg={7} className='mb-3'>
                            <p>
                                Ghi chú
                            </p>
                            <textarea
                                style={{
                                    fontSize: '13px',
                                    marginTop: '0px',
                                    color: '#55555',
                                    minWidth: '70%',
                                    height: '140px',
                                }}
                                onChange={(e) => setNote(e.target.value)}
                            ></textarea>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <Col xs md lg={8}>
                                    Số lượng
                                </Col>
                                <Col xs md lg={4} className='text-end pe-5'>
                                    {nums}
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <Col xs md lg={8}>


                                    Tổng tiền
                                </Col>
                                <Col xs md lg={4} className='text-end pe-5'>
                                    {addCommas(cost)}
                                </Col>
                            </Row>
                            <Row className='mt-3'>

                                <Col xs md lg={8} className={cx('on_click')}>
                                    <span onClick={() => setOpen(!open)}>
                                        Chiết khấu
                                    </span>

                                    {
                                        open ? (
                                            <div className={`d-flex ${cx('choose_type')}`}>
                                                <Button className={typediscount ? `${cx('btn_active')}` : `${cx('btn')}`} onClick={() => {
                                                    setType(true)
                                                    setDiscount(0)
                                                    setTotal(cost)
                                                }}>%</Button>
                                                <Button className={typediscount ? `${cx('btn')}` : `${cx('btn_active')}`} onClick={() => {
                                                    setType(false)
                                                    setDiscount(0)
                                                    setTotal(cost)
                                                }}>Giá trị</Button>
                                                <input className={`ms-3 me-5 w-25 ${cx('textfield')}`} value={discount} type="number" min={0} max={100} onChange={(e) => {

                                                    if (typediscount === true) {
                                                        if (e.target.value > 100) e.target.value = 100;
                                                        else if (e.target.value < 0) e.target.value = 0;
                                                        setTotal(cost * (1 - e.target.value / 100))
                                                    }

                                                    else {
                                                        if (e.target.value > cost) e.target.value = cost;
                                                        else if (e.target.value < 0) e.target.value = 0;
                                                        setTotal(cost - e.target.value)
                                                    }


                                                    setDiscount(parseInt(e.target.value));

                                                }} inputMode='numeric' />
                                            </div>
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </Col>
                                <Col xs md lg={4} className='text-end pe-5'>
                                    {typediscount === true ? discount : addCommas(discount)}
                                </Col>
                            </Row>
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
                                    Thanh toán nhà cung cấp
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
                            <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Nhập hàng</Button>

                        </Col>
                    </Row>
                </div>
            </div>


            <ModalLoading open={loading} title={'Đang tải'} />
        </div >
    );
}

export default ImportProduct;
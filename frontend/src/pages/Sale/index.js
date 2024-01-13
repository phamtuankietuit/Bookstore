import React from 'react';
import classNames from 'classnames/bind';
import styles from './Sale.module.scss';
import SearchResult from '~/components/SearchResult';
import { FaHouseChimney } from "react-icons/fa6";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useContext } from 'react';
import { FaBoxOpen } from "react-icons/fa6";
import Item_Sale from '~/components/Item_Sale';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaRegCircleXmark } from "react-icons/fa6";
import { ToastContext } from '~/components/ToastContext';
import ModalLoading from '~/components/ModalLoading';
import { useNavigate } from 'react-router-dom';
import Input from '~/components/Input';
import Barcode from '~/pages/Barcode';
import { Switch } from '@mui/material';

import * as productServices from '~/apiServices/productServices';
import * as PromotionServices from '~/apiServices/promotionServices';
import * as SaleServices from '~/apiServices/saleServices';

import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);
const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');


function Sale() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [isRateDiscount, setType] = useState(true)
    const [newset, setNewset] = useState(true)

    // update
    const [updatePage, setUpdatePage] = useState(new Date());

    //create obj
    const [arr, setArr] = useState([])
    const [nums, setNums] = useState(0)
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [paid, setPaid] = useState(0)
    const [customer, setCustomer] = useState(null)
    const [note, setNote] = useState('')
    const [coupon, setCoupon] = useState(null)
    const [totalAmount, setTotalAmout] = useState(0)

    //choose promo
    const [option, setOption] = useState([])
    const [call, setCall] = useState(false)
    const [items, setItems] = useState([])
    const [promo, setPromo] = useState('')



    const addarr = (value) => {

        const isFound = arr.some((element, index) => {
            if (element.sku === value.sku) {
                return true;
            }
            return false;
        });

        if (isFound === false) {
            const obj = {
                productId: value.productId,
                sku: value.sku,
                name: value.name,
                featureImageUrl: value.images[0],
                salePrice: value.salePrice,
                stock: value.currentStock,
                quantity: 1,
                totalPrice: value.salePrice,
            }
            setArr(arr => [...arr, obj]);
        }

        setPromo('')
        setCoupon(null)
    }

    useEffect(() => {
        update()
        updateAmount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arr, total, updatePage])

    useEffect(() => {
        updateAmount()
    }, [newset])
    const updateAmount = () => {
        const discountAmount = (isRateDiscount === true ? (total * (discount + (coupon === null ? 0 : coupon.discountRate)) / 100) : (total * (coupon === null ? 0 : coupon.discountRate / 100) + discount))
        setTotalAmout(total - discountAmount)

    }

    const update = () => {
        let newcost = 0;
        let newnums = 0;
        if (arr.length !== 0) {
            arr.map(item => {
                newcost += item.totalPrice
                newnums += item.quantity
            })
        }

        setTotal(newcost);
        setNums(newnums);

        setCall(false)
        setPromo('')
        setCoupon(null)

        updateAmount()
    }

    const addCustomer = (value) => {
        setCustomer(value)

    }



    const deletearr = (productId, index) => {
        let newcost = total - arr[index - 1]['totalPrice'];
        let newnums = nums - arr[index - 1]['quantity']
        setTotal(newcost)
        setNums(newnums)

        setPromo('')
        setCoupon(null)
        setCall(false)
        setDiscount(0)
        setArr(arr.filter(items => items.productId !== productId));

    }

    const handleShow = () => setOpen(true)


    const handleClose = () => {
        setOpen(false)

    }

    const submit = () => {
        if (customer === null) {
            setLoading(true);
            setLoading(false);
            toastContext.notify('error', 'Chưa chọn khách hàng');
        }
        else
            if (arr.length === 0 || nums === 0) {
                setLoading(true);
                setLoading(false);
                toastContext.notify('error', 'Chưa chọn sản phẩm');
            } else if (Number(paid) < Number(totalAmount)) {
                toastContext.notify('error', 'Tiền khách đưa chưa đủ');
            } else {
                const discountItems = [];

                if (coupon !== null) {
                    discountItems.push({
                        rate: coupon.discountRate,
                        value: 0,
                        amount: parseInt(coupon.discountRate * total / 100),
                        source: 'promotion',
                        promotionId: coupon.promotionId,
                    });
                }


                if (discount !== 0) {
                    let rate = isRateDiscount ? discount : 0;
                    let value = isRateDiscount ? 0 : discount;
                    let amount = isRateDiscount ? parseInt(rate * total / 100) : parseInt(total - value);

                    discountItems.push({
                        rate: rate,
                        value: value,
                        amount: amount,
                        source: 'manual',
                        promotionId: null,
                    });
                }


                setLoading(true);
                const discountAmount = isRateDiscount === true ? (total * (discount + (coupon === null ? 0 : coupon.discountRate)) / 100) : (total * (coupon === null ? 0 : coupon.discountRate) / 100 + discount);
                const totalAmount = total - discountAmount;


                const obj = {
                    customerId: customer.customerId,
                    customerName: customer.name,
                    items: arr,
                    subtotal: total,
                    discountItems: discountItems,
                    discountRate: isRateDiscount === true ? (discount + (coupon === null ? 0 : coupon.discountRate)) : (coupon === null ? 0 : coupon.discountRate),
                    discountValue: isRateDiscount === true ? 0 : discount,
                    discountAmount: discountAmount,
                    totalAmount: totalAmount,
                    tax: 0,
                    paymentDetails: {
                        remainAmount: totalAmount - paid,
                        paidAmount: parseInt(paid),
                        paymentMethod: "cash",
                        status: 'paid',
                    },
                    status: 'paid',
                    note: note,
                    staffId: getLocalStorage().user.staffId,
                    staffName: getLocalStorage().user.name,
                };

                console.log(obj);

                const fetchApi = async () => {
                    const result = await SaleServices.CreateSalesOrders(obj)
                        .catch((err) => {
                            setLoading(false);
                            toastContext.notify('error', 'Có lỗi xảy ra');
                            console.log(err);
                        });


                    console.log(result);
                    if (result) {


                        setLoading(false);
                        toastContext.notify('success', 'Thêm hóa đơn thành công');
                    }
                }

                fetchApi();
            }

    }


    useEffect(() => {
        if (call === false) {
            const fetchApi = async () => {
                const result = await PromotionServices.getPromotionsForSale(total)
                    .catch((err) => {
                        console.log(err);
                    });
                if (result) {
                    console.log(result)
                    setOption(result.data)
                    setItems([])
                    arrItems(result.data)
                }
                else {
                    setOption([])
                    setItems([])

                }
                setCall(true)
                // console.log(result)
            }
            fetchApi();
        }

    }, [total])

    const arrItems = (value) => {
        value.map(e => {
            let obj = {
                label: e.name + ' ' + e.discountRate + '%',
                value: e.name,
            }
            setItems(i => [...i, obj])
        })
        console.log(items)
    }
    const onChangeCoupon = (value) => {
        setPromo(value.value);
        setCoupon(null);
        option.map(e => {
            if (e.name === value.value) {
                setCoupon(e);
            }
        })

        setNewset(!newset);
    }

    const [showScanner, setShowScanner] = useState(false);

    const handleScanner = async (id) => {
        const response = await productServices.getProduct(id)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            addarr(response);
        }
    }

    const handleBackHome = () => {
        const role = getLocalStorage().user.role;

        if (role === 'admin') {
            navigate('/overview');
        } else if (role === 'warehouse') {
            navigate('/products');
        } else {
            navigate('/orders');
        }
    }

    return (
        <div className={` ${cx('wrapper')}`}>
            <div className={`${cx('header')} d-flex align-items-center`}>
                <p className={` ${cx('title')} d-flex `}>Tạo đơn mới</p>
                <div className={` ${cx('search-bar')} me-auto`}>
                    <SearchResult stypeid={2} setValue={addarr} />
                </div>
                <div className={`text-end me-4`}>
                    <span>Hiển thị Scanner</span>
                    <Switch
                        checked={showScanner}
                        onChange={() => setShowScanner(!showScanner)}
                    />
                    <FaHouseChimney className={` ${cx('icon')}`} onClick={handleBackHome} />
                </div>
            </div>
            <Row>
                <Col lg={9} className='p-0'>
                    <div className={` ${cx('frame')}`}>
                        {
                            arr.length === 0 ? (
                                <div >
                                    <div className={`text-center w-100 mt-5`}>
                                        <FaBoxOpen className={`${cx('icon-empty')}`} />
                                        <p className='fs-5'>Đơn hàng của bạn chưa có sản phẩm nào</p>
                                    </div>

                                </div>
                            ) : (
                                <div className={cx('content')}>
                                    <div className={cx('columns')}>
                                        <div className={cx('properties-1')}>STT</div>
                                        <div className={cx('properties-1')}>Ảnh</div>
                                        <div className={cx('properties-1')}>Mã Sku</div>
                                        <div className={cx('properties-2')}>Tên sản phẩm</div>
                                        <div className={cx('properties-3')}>Số lượng mua</div>
                                        <div className={cx('properties-3')}>Đơn giá</div>
                                        <div className={cx('properties-3')}>Thành tiền</div>

                                    </div>
                                    {
                                        arr.map((item, index) => (
                                            <div key={item.productId}>
                                                <Item_Sale product={item} index={index + 1} funtion={deletearr} update={update} />

                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                        <div className={cx('barcode', {
                            'show': showScanner,
                        })}> <Barcode handleScanner={handleScanner} /></div>
                    </div>
                </Col>
                <Col lg={3} >
                    <div className={` ${cx('frame')} d-flex flex-column justify-content-between`}>
                        <div><div className={` `}>
                            {
                                customer === null ? (
                                    <SearchResult stypeid={3} setValue={addCustomer} />
                                ) : (
                                    <Row>
                                        <Col lg={1}>
                                            <img src={customer.img} className={cx('img')} />
                                        </Col>
                                        <Col lg={8} >
                                            <p className='ms-3'><span className='fs-6'>{customer.name}</span> - {customer.phoneNumber}</p>
                                        </Col>
                                        <Col lg={3} className='text-end'>
                                            <FaRegCircleXmark className={cx('icon-delete')} onClick={() => setCustomer(null)} />
                                        </Col>
                                    </Row>
                                )
                            }

                        </div>
                            <hr />
                            <Row className='mt-3'>
                                <Col xs md lg={6}>
                                    Tổng tiền ({nums} sản phẩm)
                                </Col>
                                <Col xs md lg={6} className='text-end'>
                                    {addCommas(total)}
                                </Col>

                            </Row>
                            <Row className='mt-3'>
                                <Col xs md lg={6} className='align-self-center'>
                                    <p >Chiết khấu</p>
                                </Col>
                                <Col xs md lg={6} className='text-end'>
                                    <input className={`${cx('textfield')} `} onClick={() => handleShow()} />
                                </Col>

                            </Row>
                            <Row className='mt-3'>
                                <Col xs md lg={6}>
                                    <p className='ms-3'>Chiết khấu thường</p>
                                </Col>
                                <Col xs md lg={6} className='text-end'>
                                    {
                                        isRateDiscount ? discount + '%' : addCommas(discount) + 'đ'
                                    }
                                </Col>

                            </Row>
                            <Row className='mt-3'>
                                <Col xs md lg={6}>
                                    <p className='ms-3 d-flex align-items-center h-100 '>Mã giảm giá  - {coupon === null ? 0 : coupon.discountRate + '%'}</p>
                                </Col>
                                <Col xs md lg={6} >
                                    <Input
                                        className={cx('m-b')}
                                        items={items}
                                        value={promo}
                                        // onChange={onChangeCoupon}
                                        handleClickAction={onChangeCoupon}
                                    />
                                </Col>

                            </Row>
                            <Row className='mt-4'>
                                <Col xs md lg={6} className='fw-bold'>
                                    KHÁCH PHẢI TRẢ
                                </Col>
                                <Col xs md lg={6} className='text-end'>

                                    {
                                        addCommas(totalAmount)
                                    } đ
                                </Col>

                            </Row>
                            <Row className='mt-4'>
                                <Col xs md lg={6} className='fw-bold'>
                                    Tiền khách đưa
                                </Col>
                                <Col xs md lg={6} className='text-end'>
                                    <input className={`${cx('textfield')} pe-2 `} type="number" inputMode='numeric'
                                        onChange={(e) => {



                                            if (e.target.value < 0 || e.target.value === '') e.target.value = 0


                                            setPaid(parseInt(e.target.value))
                                        }} />
                                </Col>

                            </Row>
                            <hr />
                            <Row className='mt-4'>
                                <Col xs md lg={6} className='fw-bold'>
                                    Tiền thừa trả khách
                                </Col>
                                <Col xs md lg={6} className='text-end'>
                                    {
                                        paid - totalAmount < 0 ? 0 : paid - totalAmount

                                    } đ
                                </Col>

                            </Row>

                        </div>

                        <div className={``}>
                            <Form.Control type="text" placeholder='Nhập ghi chú' onChange={(e) => setNote(e.target.value)} />
                            <hr />
                            <div className='text-center'>
                                <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>THANH TOÁN</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal size="lg" show={open} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Chiết khấu đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-between'>
                        <p className='align-self-center'>Chiết khấu thường</p>
                        <div className={`d-flex w-75`}>
                            <Button className={isRateDiscount ? `${cx('btn_active')}` : `${cx('btn')}`} onClick={() => {
                                setType(true)
                                setDiscount(0)
                                setNewset(!newset)

                            }}>%</Button>
                            <Button className={isRateDiscount ? `${cx('btn')}` : `${cx('btn_active')}`} onClick={() => {
                                setType(false)
                                setDiscount(0)
                                setNewset(!newset)

                            }}>Giá trị</Button>
                            <input className={`ms-3 me-5 w-50 ${cx('textfield-1')}`} type="number" min={0} max={100} value={discount} onChange={(e) => {

                                if (isRateDiscount === true) {
                                    if (e.target.value > 100) e.target.value = 100;
                                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;

                                }

                                else {
                                    if (e.target.value > total) e.target.value = total;
                                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;

                                }
                                setDiscount(parseInt(e.target.value));
                                setNewset(!newset)
                            }} inputMode='numeric' />
                        </div>
                    </div>

                    <hr />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleClose}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default Sale;
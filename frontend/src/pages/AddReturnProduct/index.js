import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './AddReturnProduct.module.scss';
import Item_Return from '~/components/Item_Return';
import ModalLoading from '~/components/ModalLoading';
import Input from '~/components/Input';

import { ToastContext } from '~/components/ToastContext';

import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';
import * as returnServices from '~/apiServices/returnServices';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function AddReturnProduct() {
    const navigate = useNavigate();
    const salesOrderId = useParams();
    const toastContext = useContext(ToastContext);

    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);

    const [total, setTotal] = useState(0);
    const [note, setNote] = useState('');
    const [productsReturn, setProductsReturn] = useState([]);

    const [numberItem, setNumberItem] = useState(0);
    const [numberQuantity, setNumberQuantity] = useState(0);


    useEffect(() => {
        const fetch = async () => {
            const responseOrder = await returnServices.getNewReturn(salesOrderId.id)
                .catch((error) => {
                    console.log(error);
                    if (error?.response?.status === 403) {
                        toastContext.notify('error', 'Đơn hàng đã trả hoặc hết hạn');
                    } else {
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    }
                    navigate(-1);
                });

            if (responseOrder) {
                console.log(responseOrder);
                setOrder(responseOrder);
                setArray(responseOrder.items);

                const responseCustomer = await customerServices.getCustomer(responseOrder.customerId)
                    .catch((err) => {
                        console.log(err);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (responseCustomer) {
                    console.log(responseCustomer);
                    setCustomer(responseCustomer);
                }
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setArray = (products) => {
        const newArray = products.map((product) => {
            return {
                productId: product.productId,
                name: product.name,
                sku: product.sku,
                featureImageUrl: product.featureImageUrl,
                quantity: 0,
                maxQuantity: product.soldQuantity,
                salePrice: product.refund,
                totalPrice: 0,
                sale: product.salePrice,
            };
        });

        setProductsReturn(newArray);
    }

    const changeTotalPrice = (index, quantity, totalPrice) => {
        const newArray = productsReturn;

        newArray[index].quantity = Number(quantity);
        newArray[index].totalPrice = totalPrice;

        setProductsReturn(newArray);
        changeTotal(newArray);
    }

    const changeTotal = (array) => {
        let sum = 0;
        let numItem = 0;
        let numQuantity = 0;

        array.forEach(product => {
            sum += product.totalPrice;
            if (product.quantity > 0) {
                numItem += 1;
                numQuantity += product.quantity;
            }
        });

        setTotal(sum);
        setNumberQuantity(numQuantity);
        setNumberItem(numItem);
    }


    const submit = async () => {
        if (numberItem === 0) {
            toastContext.notify('error', 'Chưa thêm sản phẩm trả');
        } else {
            const items = productsReturn.map(product => ({
                productId: product.productId,
                sku: product.sku,
                name: product.name,
                featureImageUrl: product.featureImageUrl,
                soldQuantity: product.maxQuantity,
                salePrice: product.sale,
                returnQuantity: product.quantity,
                refund: product.salePrice,
                totalRefund: product.totalPrice,
            }));

            const newObj = {
                ...order,
                items: items,
                totalItem: numberItem,
                totalQuantity: numberQuantity,
                totalAmount: total,
                note: note,
            };

            setLoading(true);

            const response = await returnServices.createReturn(newObj)
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (response) {
                console.log(response);
                toastContext.notify('success', 'Tạo đơn trả hàng thành công');
                navigate('/return/detail/' + response.returnOrderId);
            }

            setLoading(false);
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {
                    (order === null || customer === null) ? (
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
                                        <p>{customer.name} {customer?.phoneNumber}</p>
                                    </Col>
                                    <Col lg={6} className='mb-2'>
                                        <p>Mã đơn hàng  </p>
                                        <p>{salesOrderId.id}</p>
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
                                        {productsReturn.map((product, index) =>
                                        (<Item_Return
                                            key={product.id}
                                            product={product}
                                            index={index + 1}
                                            changeTotalPrice={changeTotalPrice}
                                        />))
                                        }
                                    </div>


                                </div>
                                <Row className='text-end'>
                                    <Row className='mb-3'>
                                        <Col xs md lg={8} >
                                            {/* Số lượng trả {arr.length} sản phẩm */}
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {/* {nums} */}
                                        </Col>
                                    </Row>

                                    {/* <Row className='mb-3'>
                                        <Col xs md lg={8} className='fw-bold'>
                                            Cần hoàn tiền trả hàng
                                        </Col>
                                        <Col xs md lg={4} className='text-end pe-5'>
                                            {addCommas(total)}
                                        </Col>
                                    </Row> */}
                                </Row>
                            </div>
                            {/* <div className={cx('frame')}>
                                <Row>
                                    <Col lg={8}>
                                        <p className={`mt-4 mb-1 ${cx('title')}`}>Nhận hàng trả lại</p>
                                    </Col>
                                    <Col lg={4} className='d-flex'>
                                        <Button className={Return ? `${cx('return-true')}` : `${cx('return-false')}`} onClick={() => setReturn(true)}>Đã nhận và nhập kho </Button>
                                        <Button className={Return ? `${cx('return-false')}` : `${cx('return-true')}`} onClick={() => setReturn(false)}>Chưa nhận hàng</Button>
                                    </Col>
                                </Row>

                            </div> */}
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
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        ></textarea>
                                    </Col>
                                    <Col lg={6} className='mb-2'>
                                        <Row className='mt-3'>
                                            <Col xs md lg={8} >
                                                Số lượng trả ({numberItem} sản phẩm)
                                            </Col>
                                            <Col xs md lg={4} className='text-end pe-5'>
                                                {
                                                    numberQuantity
                                                }
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col xs md lg={8} className='fw-bold'>
                                                Tiền cần trả
                                            </Col>
                                            <Col xs md lg={4} className='fw-bold text-end pe-5'>
                                                {
                                                    addCommas(total)
                                                }
                                            </Col>
                                        </Row>
                                        {/* <Row className='mt-3'>
                                            <Col xs md lg={6} className='fw-bold'>
                                                Hoàn trả khách
                                            </Col>
                                            <Col xs md lg={6} className='text-end pe-5'>
                                                <input className={`${cx('textfield')} `} type="number" inputMode="numeric" onChange={(e) => {

                                                    if (e.target.value > total) e.target.value = total;
                                                    else if (e.target.value < 0 || e.target.value === '') e.target.value = 0;
                                                    setPaid(parseInt(e.target.value))

                                                }} />
                                                <Input
                                                    className={cx('refund')}
                                                    money
                                                    value={refund}
                                                    onChangeMoney={onChangeRefund}
                                                />
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
                                        </Row> */}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mt-4 text-end me-4'>
                                        <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                                        <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => submit()}>Hoàn trả</Button>

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
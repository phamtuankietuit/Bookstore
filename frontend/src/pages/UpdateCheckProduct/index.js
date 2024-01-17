import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FaBoxOpen } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './UpdateCheckProduct.module.scss';
import SearchResult from '~/components/SearchResult';
import Item_Check from '~/components/Item_AddCheckProduct';
import ModalLoading from '~/components/ModalLoading';
import { getLocalStorage } from '~/store/getLocalStorage';
import { CircularProgress } from '@mui/material';

import { ToastContext } from '~/components/ToastContext';

import * as checkServices from '~/apiServices/checkServices';
import * as productServices from '~/apiServices/productServices';

const cx = classNames.bind(styles);

function UpdateCheckProduct() {
    const checkProductId = useParams();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [entireObject, setEntireObject] = useState(null);
    const [obj, setObj] = useState(null);
    const [arr, setArr] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const response = await checkServices.getCheck(checkProductId.id)
                .catch((error) => {
                    toastContext.notify('error', 'Có lỗi xảy ra');

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
                console.log(response);
                setEntireObject(response);
                setObj(response.adjustmentTicketDTO);
                handleSetDataArray(response.adjustmentItemDTOs);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetDataArray = async (items) => {
        items.map(async (item) => {
            const response = await productServices.getProduct(item.productId)
                .catch((error) => {
                    console.log(error);
                });

            if (response) {
                const newItem = {
                    ...response,
                    adjustedQuantity: item.quantity - response.currentStock,
                    quantity: item.quantity,
                    reason: item.reason,
                };

                addArray(newItem);
            }
        });
    }

    const addArray = (value) => {
        const isFound = arr.some(element => {
            if (element.productId === value.productId) {
                return true;
            }
            return false;
        });

        let obj = {};

        if (value.quantity) {
            obj = {
                staffId: value.staffId,
                adjustedQuantity: value.adjustedQuantity,
                quantity: value.quantity,
                reason: value.reason,
                productId: value.productId,
                productName: value.name,
                currentStock: value.currentStock,
                featureImageUrl: value.images[0],
            }
        } else {
            obj = {
                staffId: value.staffId,
                adjustedQuantity: 0,
                quantity: value.currentStock,
                reason: '',
                productId: value.productId,
                productName: value.name,
                currentStock: value.currentStock,
                featureImageUrl: value.images[0],
            }
        }


        if (isFound === false) {
            setArr(arr => [...arr, obj]);
        }
    }

    const deleteArray = (productId, index) => {
        setArr(arr.filter(items => items.productId !== productId));
    }

    const handleSave = async () => {
        if (arr.length === 0) {
            toastContext.notify('error', 'Chưa chọn sản phẩm');
        } else {
            const newObj = {
                ...entireObject,
                adjustmentTicketDTO: {
                    note: '',
                    tags: [],
                    adjustmentTicketId: obj.adjustmentTicketId,
                    staffId: getLocalStorage().user.staffId,
                    staffName: getLocalStorage().user.name,
                    status: 'unadjusted',
                    totalItemsToAdjust: arr.length,
                },
                adjustmentItemDTOs: [
                    ...arr
                ]
            };

            console.log(newObj);

            // setLoading(true);

            // let isSuccess = true;

            // const response = await checkServices.updateCheck(obj.adjustmentTicketId, newObj)
            //     .catch((error) => {
            //         if (error.response) {
            //             console.log(error.response.data);
            //             console.log(error.response.status);
            //             console.log(error.response.headers);
            //         } else if (error.request) {
            //             console.log(error.request);
            //         } else {
            //             console.log('Error', error.message);
            //         }
            //         console.log(error.config);
            //         isSuccess = false;
            //         toastContext.notify('error', 'Có lỗi xảy ra');
            //     });

            // if (isSuccess) {
            //     toastContext.notify('success', 'Lưu kiểm hàng thành công');
            // }

            // setLoading(false);
        }
    }

    return (
        <div className={cx('wrapper')}>
            {(entireObject === null || obj === null)
                ?
                <CircularProgress color="primary" />
                :
                <div className={cx('inner')}>
                    <div className={cx('frame')}>
                        <div className='d-flex'>
                            <p className={` w-50 ${cx('title')}`}>{obj.adjustmentTicketId}</p>
                            <div className='w-50 text-end me-5'>
                            </div>
                        </div>

                        <Row>
                            <Col md={12} lg={12} className='p-0'>
                                <SearchResult stypeid={2} setValue={addArray} />
                            </Col>

                        </Row>
                        <div className={`${cx('import-content')}`} >
                            <div className={cx('columns')}>
                                <div className={cx('columns-item-1')}>STT</div>
                                <div className={cx('columns-item-1')}>Ảnh</div>
                                <div className={cx('columns-item-2')}>Tên sản phẩm</div>
                                <div className={`text-center ${cx('columns-item-3')}`}>Tồn thực tế</div>
                                <div className={cx('columns-item-3')}>Tồn hệ thống</div>
                                <div className={cx('columns-item-3')}>Lệch</div>
                                <div className={cx('columns-item-3')}>Lý do</div>

                            </div>
                            <Row className={cx('list-import')}>
                                {
                                    arr.length === 0 ? (
                                        <div className={cx('no-product')}>
                                            <FaBoxOpen className={cx('icon')} />
                                            <p className='text-center w-100'>Phiếu kiểm hàng của bạn chưa có sản phẩm nào</p>
                                        </div>
                                    ) : (

                                        arr.map((item, index) => (
                                            <div key={item.productId}>
                                                <Item_Check product={item} index={index + 1} funtion={deleteArray} />
                                            </div>
                                        ))
                                    )
                                }
                            </Row>
                        </div>
                        <hr />
                        <Row>
                            <Col className='mt-4 text-end me-4'>
                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                                <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => handleSave()}>Lưu phiếu kiểm</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            }
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default UpdateCheckProduct;
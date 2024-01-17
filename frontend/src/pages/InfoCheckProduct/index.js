import { useEffect, useState, useContext } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from './InfoCheckProduct.module.scss';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as checkServices from '~/apiServices/checkServices';
import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

function InfoCheckProduct() {
    const checkProductId = useParams();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(false);

    const [updatePage, setUpdatePage] = useState(new Date());

    const [entireObject, setEntireObject] = useState(null);

    const [obj, setObj] = useState(null);
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const response = await checkServices.getCheck(checkProductId.id)
                .catch((error) => {
                    console.log(error);
                });

            if (response) {
                console.log(response);
                setEntireObject(response);
                setObj(response.adjustmentTicketDTO);
                setList(response.adjustmentItemDTOs);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePage]);

    const handleBalanced = async () => {
        setLoading(true);

        let isSuccess = true;

        const newObj = {
            ...entireObject,
            adjustmentTicketDTO: {
                ...obj,
                status: 'adjusted',
                adjustedStaffId: getLocalStorage().user.staffId,
                adjustedStaffName: getLocalStorage().user.name,
                adjustmentBalance: {
                    adjustedQuantity: 0,
                    afterQuantity: 0,
                },
            }
        };

        console.log('NEW OBJECT', newObj);

        // const response = await checkServices.updateCheck(obj.adjustmentTicketId, newObj)
        //     .catch((error) => {
        //         isSuccess = false;
        //         toastContext.notify('error', 'Có lỗi xảy ra');

        //         if (error.response) {
        //             // The request was made and the server responded with a status code
        //             // that falls out of the range of 2xx
        //             console.log(error.response.data);
        //             console.log(error.response.status);
        //             console.log(error.response.headers);
        //         } else if (error.request) {
        //             // The request was made but no response was received
        //             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //             // http.ClientRequest in node.js
        //             console.log(error.request);
        //         } else {
        //             // Something happened in setting up the request that triggered an Error
        //             console.log('Error', error.message);
        //         }
        //         console.log(error.config);
        //     });

        // if (isSuccess) {
        //     toastContext.notify('success', 'Cân bằng kho thành công');
        //     setUpdatePage(new Date());
        // }

        // setLoading(false);
    }

    const handleDelete = async () => {
        setLoading(true);

        let isSuccess = true;

        const newObj = {
            ...entireObject,
            adjustmentTicketDTO: {
                ...obj,
                status: 'cancelled',
            }
        };

        console.log('NEW OBJECT', newObj);

        const response = await checkServices.updateCheck(obj.adjustmentTicketId, newObj)
            .catch((error) => {
                isSuccess = false;
                toastContext.notify('error', 'Có lỗi xảy ra');

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (isSuccess) {
            toastContext.notify('success', 'Xóa đơn kiểm hàng thành công');
            setUpdatePage(new Date());
        }

        setLoading(false);
    }


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('frame')}>
                    {
                        obj === null ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <div>
                                <div className='d-flex mb-2'>
                                    <p className='fs-5 me-4'>{obj.adjustmentTicketId}</p>
                                    {obj.status === 'unadjusted' &&
                                        <div className={cx('status-2')}>Đang kiểm kho </div>}
                                    {obj.status === 'adjusted' &&
                                        <div className={cx('status-1')}>Đã cân bằng </div>}
                                    {obj.status === 'cancelled' &&
                                        <div className={cx('status-2')}>Đã xóa </div>}

                                </div>
                                <p className={`mt-4 mb-1 ${cx('title')}`}>Tất cả</p>
                                <div className={cx('content-check')}>
                                    <div className={cx('row')}>
                                        <div className={cx('columns-1')}>STT</div>
                                        <div className={cx('columns-2')}>Tên sản phẩm</div>
                                        <div className={cx('columns-3')}>Tồn thực tế</div>
                                        <div className={cx('columns-3')}>Tồn hệ thống</div>
                                        <div className={cx('columns-3')}>Lệch</div>
                                        <div className={cx('columns-3')}>Lý do</div>

                                    </div>
                                    <div className={cx('list-import')}>
                                        {
                                            list.map((item, index) => (
                                                <div className={`${cx('item')}`} key={item.productId}>
                                                    <div className={cx('columns-1')}>{index + 1}</div>
                                                    <div className={cx('columns-2')}>
                                                        <div className='fs-6'>{item.productName}</div>
                                                        <div>{item.productId}</div>
                                                    </div>
                                                    <div className={cx('columns-3')}>{item.quantity}</div>
                                                    <div className={cx('columns-3')}>{item.quantity - item.adjustedQuantity}</div>
                                                    <div className={cx('columns-3')}>{item.adjustedQuantity}</div>
                                                    <div className={cx('columns-3')}>{item.reason}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {
                                    obj.status === 1 ? (<div>

                                    </div>) : (
                                        <Row>
                                            <Col className='mt-4 text-end me-4'>
                                                {obj.status === 'unadjusted' &&
                                                    <Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger" onClick={() => handleDelete()}>Xóa</Button>
                                                }
                                                {obj.status === 'unadjusted' &&
                                                    <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary">
                                                        <NavLink to={"/checks/update/" + checkProductId.id} className={`text-decoration-none ${cx('nav-link')}`} >
                                                            Sửa
                                                        </NavLink>
                                                    </Button>}
                                                {obj.status === 'unadjusted' &&
                                                    <Button className={`m-1 ${cx('my-btn')}`} variant="primary" onClick={() => handleBalanced()}>Cân bằng kho</Button>
                                                }
                                            </Col>
                                        </Row>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <ModalLoading open={loading} title={'Đang tải'} />
            </div>
        </div >
    );
}

export default InfoCheckProduct;
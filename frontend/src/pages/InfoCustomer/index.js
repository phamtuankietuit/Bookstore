import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-bootstrap/Spinner';

import styles from './InfoCustomer.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import { OrderItem } from '~/components/Item';
import Table from '~/components/Table';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as CustomerServices from '~/apiServices/customerServices';
import * as saleServices from '~/apiServices/saleServices';

const cx = classNames.bind(styles);

function InfoCustomer() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    const customerId = useParams();
    const [obj, setObj] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await CustomerServices.getCustomer(customerId.id)
                .catch((err) => {
                    console.log(err);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (result) {
                setObj(result);
                console.log(result);
            }
        }

        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleExit = () => {
        navigate(-1);
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/orders/detail/' + row.salesOrderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            setPending(true);

            const response = await saleServices.getAllSalesOrders(
                {
                    pageNumber: 1,
                    pageSize: 999999,
                    customerIds: [customerId.id],
                }
            )
                .catch((error) => {
                    if (error.response.status === 404) {
                        setRows([]);
                    } else {
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    }
                });

            if (response) {
                console.log(response.data);
                setRows(response.data);
            }

            setPending(false);
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL DELETE
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleValidation = async () => {
        setLoading(true);
        let isSuccess = true;
        const response = await CustomerServices.deleteCustomer([{ customerId: customerId.id }])
            .catch((error) => {
                isSuccess = false;
                console.log(error);
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (isSuccess) {
            toastContext.notify('success', 'Xóa khách hàng thành công');
            navigate('/customers');
        }

        setLoading(false);
    };


    return (
        <div className={cx('wrapper')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div>
                <div className={cx('inner')}>
                    <div className={cx('content')}>
                        <Wrapper
                            title={'Thông tin khách hàng'}
                            className={cx('m-b')}
                        >
                            <div className={cx('twocols')}>
                                <div className={cx('col1')}>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Mã khách hàng
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.customerId}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Tên khách hàng
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.name}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Tình trạng
                                        </div>
                                        <div className={cx('label-content', 'fit')}>
                                            <div
                                                className={cx({
                                                    'product-state-container': true,
                                                    'state-0': !obj.isActive,
                                                })}
                                            >
                                                <FontAwesomeIcon
                                                    className={cx(
                                                        'product-state-icon',
                                                    )}
                                                    icon={
                                                        obj.isActive
                                                            ? faCheck
                                                            : faXmark
                                                    }
                                                />
                                                <div
                                                    className={cx('product-state')}
                                                >
                                                    {obj.isActive
                                                        ? 'Đang giao dịch'
                                                        : 'Ngừng giao dịch'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('col2')}>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Số điện thoại
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.phoneNumber}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Email
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.email}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Địa chỉ
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                        <Wrapper title={'Lịch sử mua hàng'} className={cx('m-b')}>
                            <div className={cx('table-wrapper')}>
                                <Table
                                    itemComponent={OrderItem}
                                    data={rows}
                                    pending={pending}
                                    onRowClicked={onRowClicked}
                                />
                            </div>
                        </Wrapper>
                    </div>

                    <div className={cx('action')}>
                        <Button outlineBlue onClick={handleExit}>
                            Thoát
                        </Button>
                        <Button
                            solidRed
                            className={cx('margin')}
                            onClick={handleOpenModal}
                        >
                            Xóa
                        </Button>
                        <Button
                            solidBlue
                            className={cx('margin')}
                            onClick={() =>
                                navigate('/customers/update/' + customerId.id)
                            }
                        >
                            Sửa
                        </Button>
                    </div>
                </div>

                <ModalComp
                    open={openModal}
                    handleClose={handleCloseModal}
                    title={'Xóa khách hàng'}
                    actionComponent={
                        <div>
                            <Button
                                className={cx('btn-cancel')}
                                outlineRed
                                onClick={handleCloseModal}
                            >
                                Hủy
                            </Button>
                            <Button
                                className={cx('btn-ok', 'm-l-10')}
                                solidRed
                                onClick={handleValidation}
                            >
                                Xóa
                            </Button>
                        </div>
                    }
                >
                    <div className={cx('info')}>
                        Bạn có chắc chắn muốn xóa khách hàng
                        <strong> {obj.name}</strong>?
                    </div>
                </ModalComp>
                <ModalLoading open={loading} title={'Đang tải'} />
            </div>)}

        </div>
    );
}

export default InfoCustomer;

import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-bootstrap/Spinner';

import styles from './InfoSupplier.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import { ImportItem } from '~/components/Item';
import Table from '~/components/Table';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

import * as supplierServices from '~/apiServices/supplierServices';
import * as purchaseOrderServices from '~/apiServices/purchaseOrderServices';

const cx = classNames.bind(styles);

function InfoSupplier() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const supplierId = useParams();
    const [obj, setObj] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {

            const response = await supplierServices.getSupplier(supplierId.id)
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (response) {
                setObj(response);

                const responsePurchaseOrder = await purchaseOrderServices.getAllPurchaseOrders(
                    {
                        pageNumber: 1,
                        pageSize: 50,
                        supplierIds: [supplierId.id],
                    }
                )
                    .catch((err) => {
                        console.log(err);
                    });

                if (responsePurchaseOrder) {
                    console.log(responsePurchaseOrder);
                    setRows(responsePurchaseOrder.data);
                    setPending(false);
                }
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
        navigate('/imports/detail/' + row.purchaseOrderId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState(null);

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL DELETE
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleValidation = () => {
        setLoading(true);

        const fetchApi = async () => {

            let isSuccess = true;

            const result = await supplierServices.deleteSupplier([
                {
                    supplierId: supplierId.id,
                },
            ])
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    isSuccess = false;
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (isSuccess) {
                setLoading(false);
                handleCloseModal();
                toastContext.notify('success', 'Xóa nhà cung cấp thành công');
                navigate('/suppliers');
            }
        }

        fetchApi();
    };

    return (
        <div className={cx('wrapper')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div className={cx('inner')}>
                    <div className={cx('content')}>
                        <Wrapper
                            title={'Thông tin nhà cung cấp'}
                            className={cx('m-b')}
                        >
                            <div className={cx('twocols')}>
                                <div className={cx('col1')}>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Mã nhà cung cấp
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.supplierId}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Tên nhà cung cấp
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.name}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Nhóm nhà cung cấp
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.supplierGroupName}
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
                                            {obj.contact.phone}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Email
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.contact.email}
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
                        {
                            rows === null ? (
                                <div> </div>
                            ) : (
                                <Wrapper title={'Lịch sử nhập hàng'} className={cx('m-b')}>
                                    <div className={cx('table-wrapper')}>
                                        <Table
                                            itemComponent={ImportItem}
                                            data={rows}
                                            pending={pending}
                                            onRowClicked={onRowClicked}
                                        />
                                    </div>
                                </Wrapper>
                            )
                        }
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
                                navigate('/suppliers/update/' + supplierId.id)
                            }
                        >
                            Sửa
                        </Button>
                    </div>
                    <ModalComp
                        open={openModal}
                        handleClose={handleCloseModal}
                        title={'Xóa nhà cung cấp'}
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
                            Bạn có chắc chắn muốn xóa nhà cung cấp
                            <strong> {obj.name}</strong>?
                        </div>
                    </ModalComp>
                </div>


            )}


            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default InfoSupplier;

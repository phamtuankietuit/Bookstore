import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './InfoSupplier.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import { ImportItem } from '~/components/Item';
import { data3 } from '~/components/Table/sample';
import Table from '~/components/Table';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as SuppliersServices from '~/apiServices/supplierServices';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
const cx = classNames.bind(styles);

const supplier = {
    id: 'NNC0001',
    name: 'Văn phòng phẩm An Khang',
    phone: '0253669787',
    email: 'ankhang@gmail.com',
    group: 'Văn phòng phẩm',
    address: '255 An Dương Vương, Phường 8, Quận 11, TPHCM',
    isActive: true,
};


function InfoSupplier() {
    const toastContext = useContext(ToastContext);
    const [obj, setObj] = useState(null);
    const suppliertid = useParams();
    useEffect(() => {
        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await SuppliersServices.getSupplier(suppliertid.id)
                .catch((err) => {
                    console.log(err);
                });
            setObj(result);

        }

        fetchApi();
    }, []);

    // PROPS
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();
    const handleExit = () => {
        navigate(-1);
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/imports/detail/' + row.id);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data3);
            setPending(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL DELETE
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleValidation = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleCloseModal();
            toastContext.notify('success', 'Xóa nhà cung cấp thành công');
        }, 2000);
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
                                            Văn phòng phẩm
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
                                                    'state-0': !supplier.isActive,
                                                })}
                                            >
                                                <FontAwesomeIcon
                                                    className={cx(
                                                        'product-state-icon',
                                                    )}
                                                    icon={
                                                        supplier.isActive
                                                            ? faCheck
                                                            : faXmark
                                                    }
                                                />
                                                <div
                                                    className={cx('product-state')}
                                                >
                                                    {supplier.isActive
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
                                navigate('/suppliers/update/' + suppliertid.id)
                            }
                        >
                            Sửa
                        </Button>
                    </div>
                </div>)}

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
                    <strong> {supplier.name}</strong>?
                </div>
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default InfoSupplier;

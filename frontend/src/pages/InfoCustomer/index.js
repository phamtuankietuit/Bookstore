import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './InfoCustomer.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import { OrderItem } from '~/components/Item';
import { data5 } from '~/components/Table/sample';
import Table from '~/components/Table';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const customer = {
    id: 'KH0001',
    name: 'Nguyễn Văn A',
    phone: '0235556963',
    email: 'hello@example.com',
    address: '252 Hai Bà Trưng, Bình Thạnh, TPHCM',
    totalSpending: 2500000,
    totalOrder: 25,
    isActive: true,
};

function InfoCustomer() {
    const toastContext = useContext(ToastContext);

    useEffect(() => {
        setName(customer.name);
        setPhone(customer.phone);
        setEmail(customer.email);
        setAddress(customer.address);
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
            setRows(data5);
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
            toastContext.notify('success', 'Xóa khách hàng thành công');
        }, 2000);
    };

    return (
        <div className={cx('wrapper')}>
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
                                        {customer.id}
                                    </div>
                                </div>
                                <div className={cx('label', 'm-b')}>
                                    <div className={cx('label-title')}>
                                        Tên khách hàng
                                    </div>
                                    <div className={cx('label-content')}>
                                        {customer.name}
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
                                                'state-0': !customer.isActive,
                                            })}
                                        >
                                            <FontAwesomeIcon
                                                className={cx(
                                                    'product-state-icon',
                                                )}
                                                icon={
                                                    customer.isActive
                                                        ? faCheck
                                                        : faXmark
                                                }
                                            />
                                            <div
                                                className={cx('product-state')}
                                            >
                                                {customer.isActive
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
                                        {customer.phone}
                                    </div>
                                </div>
                                <div className={cx('label', 'm-b')}>
                                    <div className={cx('label-title')}>
                                        Email
                                    </div>
                                    <div className={cx('label-content')}>
                                        {customer.email}
                                    </div>
                                </div>
                                <div className={cx('label', 'm-b')}>
                                    <div className={cx('label-title')}>
                                        Địa chỉ
                                    </div>
                                    <div className={cx('label-content')}>
                                        {customer.address}
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
                            navigate('/customers/update/' + 'NCC0001')
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
                    <strong> {customer.name}</strong>?
                </div>
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default InfoCustomer;

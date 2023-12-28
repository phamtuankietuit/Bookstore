import { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';

import styles from './UpdateSupplier.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
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

function UpdateSupplier() {
    useEffect(() => {
        setName(supplier.name);
        setPhone(supplier.phone);
        setEmail(supplier.email);
        setGroup(supplier.group);
        setAddress(supplier.address);
        setIsActive(supplier.isActive);
    }, []);

    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState('');
    const [address, setAddress] = useState('');
    const [isActive, setIsActive] = useState(true);


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


            setName(result.name)
            setPhone(result.contact.phone)
            setEmail(result.contact.email)
            setAddress(result.address)
        }

        fetchApi();
    }, []);
    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else {
            // CALL API
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                toastContext.notify(
                    'success',
                    'Cập nhật nhà cung cấp thành công',
                );


                console.log(obj)
            }, 2000);
        }
    };

    const handleExit = () => {
        navigate(-1);
    };

    // MODAL ADD GROUP
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [nameGroup, setNameGroup] = useState('');
    const [errorGroup, setErrorGroup] = useState('');

    const handleValidation = () => {
        if (nameGroup === '') {
            setErrorGroup('Không được bỏ trống');
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setNameGroup('');
                setErrorGroup('');
                handleClose();
                toastContext.notify(
                    'success',
                    'Thêm nhóm nhà cung cấp thành công',
                );
            }, 2000);
        }
    };

    const handleCloseModal = () => {
        setNameGroup('');
        setErrorGroup('');
        handleClose();
    };

    return (
        <div className={cx('wrapper')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div>
                    <div className={cx('inner')}>
                        <div className={cx('content')}>
                            <Wrapper
                                title={'Thông tin nhà cung cấp'}
                                className={cx('m-b')}
                            >
                                <div className={cx('twocols')}>
                                    <div className={cx('col1')}>
                                        <Input
                                            title={'Mã nhà cung cấp'}
                                            value={obj.supplierId}
                                            className={cx('m-b')}
                                            readOnly
                                        />
                                        <Input
                                            title={'Tên nhà cung cấp'}
                                            required
                                            value={name}
                                            onChange={(value) => {
                                                setName(value)

                                            }}
                                            className={cx('m-b')}
                                            error={errorName}
                                        />
                                        <Input
                                            title={'Địa chỉ'}
                                            value={address}
                                            onChange={(value) => {
                                                setAddress(value)


                                            }}
                                            className={cx('m-b')}
                                        />
                                        <div className={cx('m-b')}>
                                            <div className={cx('status')}>
                                                Trạng thái giao dịch
                                            </div>
                                            <Switch
                                                checked={isActive}
                                                onChange={() => setIsActive(!isActive)}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('col2')}>
                                        <Input
                                            title={'Số điện thoại'}
                                            value={phone}
                                            number
                                            onChangeNumber={(number) => {
                                                setPhone(number)


                                            }


                                            }
                                            className={cx('m-b')}
                                        />
                                        <div className={cx('two-cols', 'm-b')}>
                                            <Input
                                                title={'Nhóm nhà cung cấp'}
                                                items={['Sách', 'Khác']}
                                                value={group}
                                                onChange={(value) => setGroup(value)}
                                                readOnly
                                            />
                                            <Button
                                                className={cx('btn-add')}
                                                solidBlue
                                                leftIcon={
                                                    <FontAwesomeIcon icon={faPlus} />
                                                }
                                                onClick={handleOpen}
                                            ></Button>
                                        </div>
                                        <Input
                                            title={'Email'}
                                            value={email}
                                            onChange={(value) => {
                                                setEmail(value)


                                            }}
                                            className={cx('m-b')}
                                        />
                                    </div>
                                </div>
                            </Wrapper>
                        </div>

                        <div className={cx('action')}>
                            <Button outlineBlue onClick={handleExit}>
                                Thoát
                            </Button>
                            <Button
                                solidBlue
                                className={cx('margin')}
                                onClick={handleSubmit}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                    <ModalComp
                        open={open}
                        handleClose={handleCloseModal}
                        title={'Thêm nhóm nhà cung cấp'}
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
                                    className={cx('btn-ok')}
                                    solidBlue
                                    onClick={handleValidation}
                                >
                                    Thêm
                                </Button>
                            </div>
                        }
                    >
                        <Input
                            title={'Tên nhóm nhà cung cấp'}
                            value={nameGroup}
                            onChange={(value) => setNameGroup(value)}
                            error={errorGroup}
                            required
                        />
                    </ModalComp>
                    <ModalLoading open={loading} title={'Đang tải'} />
                </div>
            )}

        </div>
    );
}

export default UpdateSupplier;

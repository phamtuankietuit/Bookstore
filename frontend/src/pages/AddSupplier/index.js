import { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import styles from './AddSupplier.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { getLocalStorage } from '~/store/getLocalStorage';

import { ToastContext } from '~/components/ToastContext';

import * as supplierServices from '~/apiServices/supplierServices';
import * as supplierGroupServices from '~/apiServices/supplierGroupServices';

const cx = classNames.bind(styles);

const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

function AddSupplier() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [group, setGroup] = useState('');
    const [address, setAddress] = useState('');

    const [optionsSupplierGroups, setOptionsSupplierGroups] = useState([]);
    const [selectedSupplierGroups, setSelectedSupplierGroups] = useState();

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    const handleExit = () => {
        navigate(-1);
    };

    // MODAL ADD GROUP
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [nameGroup, setNameGroup] = useState('');
    const [errorGroup, setErrorGroup] = useState('');

    const handleValidation = async () => {
        if (nameGroup === '') {
            setErrorGroup('Không được bỏ trống');
        } else {
            setLoading(true);

            const result = await supplierGroupServices.CreateSupplierGroup
                (
                    {
                        name: nameGroup,
                        staffId: getLocalStorage().user.staffId,
                        staffName: getLocalStorage().user.name,
                    }
                )
                .catch((error) => {
                    setLoading(false);
                    if (error.response.status === 409) {
                        toastContext.notify('error', 'Nhóm nhà cung cấp đã tồn tại');
                    } else {
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    }
                });

            if (result) {
                setLoading(false);
                toastContext.notify('success', 'Thêm nhóm nhà cung cấp thành công');
                handleCloseModal();
                getSupGroup();
            }
        }
    };

    const handleCloseModal = () => {
        setNameGroup('');
        setErrorGroup('');
        handleClose();
    };

    // GET SUPPLIER GROUP
    const getSupGroup = async () => {
        const response = await supplierGroupServices.getSupplierGroups(
            {
                pageNumber: 1,
                pageSize: -1,
            }
        )
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
            const data = await response.data.map((item) => ({ label: item.name, value: item.supplierGroupId }));
            setOptionsSupplierGroups(data);
        }
    }

    useEffect(() => {
        getSupGroup();
    }, []);

    const handleSubmit = async () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else if (email !== '' && !filter.test(email)) {
            setErrorEmail('Vui lòng nhập đúng định dạng email');
        } else {
            const obj = {
                name: name,
                ...(selectedSupplierGroups
                    ? { supplierGroupId: selectedSupplierGroups.value }
                    : { supplierGroupId: 'supg00000' }
                ),
                ...(selectedSupplierGroups
                    ? { supplierGroupName: selectedSupplierGroups.label }
                    : { supplierGroupName: 'Khác' }
                ),
                contact: {
                    phone: phone,
                    email: email,
                },
                address: address,
                isActive: true,
                staffId: getLocalStorage().user.staffId,
                staffName: getLocalStorage().user.name,
            };

            setLoading(true);

            const response = await supplierServices.CreateSuppliers(obj)
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (response) {
                setLoading(false);
                toastContext.notify('success', 'Thêm nhà cung cấp thành công');
                navigate('/suppliers/detail/' + response.supplierId);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <Wrapper
                        title={'Thông tin nhà cung cấp'}
                        className={cx('m-b')}
                    >
                        <div className={cx('twocols')}>
                            <div className={cx('col1')}>
                                <Input
                                    title={'Tên nhà cung cấp'}
                                    required
                                    value={name}
                                    onChange={(value) => setName(value)}
                                    className={cx('m-b')}
                                    error={errorName}
                                />
                                <Input
                                    title={'Email'}
                                    value={email}
                                    onChange={(value) => setEmail(value)}
                                    className={cx('m-b')}
                                    error={errorEmail}
                                />
                                <Input
                                    title={'Địa chỉ'}
                                    value={address}
                                    onChange={(value) => setAddress(value)}
                                    className={cx('m-b')}
                                />
                            </div>
                            <div className={cx('col2')}>
                                <Input
                                    title={'Số điện thoại'}
                                    value={phone}
                                    number
                                    onChangeNumber={(number) =>
                                        setPhone(number)
                                    }
                                    className={cx('m-b')}
                                />
                                <div className={cx('two-cols', 'm-b')}>
                                    <Input
                                        title={'Nhóm nhà cung cấp'}
                                        items={optionsSupplierGroups}
                                        value={group}
                                        handleClickAction={(item) => {
                                            setGroup(item.label);
                                            setSelectedSupplierGroups(item);
                                        }}
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
    );
}

export default AddSupplier;

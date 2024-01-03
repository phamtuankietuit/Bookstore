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
import { ToastContext } from '~/components/ToastContext';
import * as SuppliersServices from '~/apiServices/supplierServices';
const cx = classNames.bind(styles);

function AddSupplier() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState('');
    const [address, setAddress] = useState('');
    const [option, setOption] = useState([])
    const [groupIDlist, setGroupIDlist] = useState([])
    const [groupID, setGroupID] = useState('')
    const [call, setCall] = useState(false)
    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else {
            // CALL API
            const obj = {
                name: name,
                supplierGroupId: groupID,
                supplierGroupName: group,
                contact: {
                    phone: phone,
                    email: email
                },
                address: address,
                description: null,
            }
            // setLoading(true);


            const fetchApi = async () => {
                const result = await SuppliersServices.CreateSuppliers(obj)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm nhà cung cấp thành công');
                    }, 2000);
                }

                else {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify('error', 'Đã có lỗi');
                    }, 2000);
                }
                console.log(obj)
            }

            fetchApi();


        }
    };

    const handleExit = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (call === false) {
            const fetchApi = async () => {
                const result = await SuppliersServices.getAllSupplierGroups(1, -1)
                    .catch((err) => {
                        console.log(err);
                    });

                console.log(result.data)
                result.data.map((e) => {
                    if (call === false) {
                        setOption(op => [...op, e.name])
                        setGroupIDlist(op => [...op, e.supplierGroupId])
                    }
                    setCall(true)


                })

            }
            fetchApi()
        }
    }, [option]);

    const onChoosegroup = (value) => {
        option.map((e, index) => {
            if (e === value) setGroupID(groupIDlist[index])
        })
        setGroup(value)
    }

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
                                        items={option}
                                        value={group}
                                        onChange={(value) => onChoosegroup(value)}
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

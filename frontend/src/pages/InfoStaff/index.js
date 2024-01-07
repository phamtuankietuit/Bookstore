import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { Switch } from '@mui/material';

import styles from './InfoStaff.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Input from '~/components/Input';
import * as StaffServices from '~/apiServices/staffServices';
import Spinner from 'react-bootstrap/Spinner';
const cx = classNames.bind(styles);

function InfoStaff() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const staffId = useParams();
    const [obj, setObj] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await StaffServices.getStaff(staffId.id)
                .catch((err) => {
                    console.log(err);
                });


            setObj(result);
            setIsActive(result.isActive);

            if (result.role === 'warehouse') {
                setRole({ label: 'Nhân viên kho', value: 'warehouse' });
            } else {
                setRole({ label: 'Nhân viên bán hàng', value: 'sale' });
            }
        }

        fetchApi();
    }, []);

    const [isActive, setIsActive] = useState(true);
    const [role, setRole] = useState({});
    const [errorRole, setErrorRole] = useState('');

    const handleExit = () => {
        navigate(-1);
    };

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL DELETE
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleValidation = async () => {
        setLoading(true);
        let isSuccess = true;

        const response = await StaffServices.deleteStaffs([obj])
            .catch((error) => {
                setLoading(false);
                isSuccess = false;
                toastContext.notify('error', 'Xóa nhân viên không thành công');
            });

        if (isSuccess) {
            setLoading(false);
            toastContext.notify('success', 'Xóa nhân viên thành công');
            navigate('/staffs');
            handleCloseModal();
        }
    };



    const handleSubmit = async () => {
        let isSuccess = true;

        const newObj = {
            ...obj,
            isActive: isActive,
            role: role.value,
        };

        setLoading(true);

        const response = await StaffServices.updateStaff(obj.staffId, newObj)
            .catch((error) => {
                isSuccess = false;
                setLoading(false);
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (isSuccess) {
            setLoading(false);
            toastContext.notify('success', 'Cập nhật nhân viên thành công');
        }
    };

    const setNewRole = (obj) => {
        setRole(obj);
    }

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
                            title={'Thông tin nhân viên'}
                            className={cx('m-b')}
                        >
                            <div className={cx('twocols')}>
                                <div className={cx('col1')}>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Mã nhân viên
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.staffId}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Tên nhân viên
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.name}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title')}>
                                            Tình trạng
                                        </div>
                                        <div
                                            className={cx(
                                                'label-content',
                                                'fit',
                                                'm-b',
                                            )}
                                        >
                                            <div
                                                className={cx({
                                                    'product-state-container': true,
                                                    'state-0': !isActive,
                                                })}
                                            >
                                                <FontAwesomeIcon
                                                    className={cx(
                                                        'product-state-icon',
                                                    )}
                                                    icon={
                                                        isActive ? faCheck : faXmark
                                                    }
                                                />
                                                <div
                                                    className={cx('product-state')}
                                                >
                                                    {isActive
                                                        ? 'Đang làm việc'
                                                        : 'Đã nghỉ việc'}
                                                </div>
                                            </div>
                                            <Switch
                                                checked={isActive}
                                                onChange={() =>
                                                    setIsActive(!isActive)
                                                }
                                            />
                                        </div>
                                        <Input
                                            title={'Vai trò'}
                                            items={[
                                                {
                                                    label: 'Nhân viên kho',
                                                    value: 'warehouse'
                                                },
                                                {
                                                    label: 'Nhân viên bán hàng',
                                                    value: 'sales'
                                                },
                                            ]}
                                            value={role.label}
                                            handleClickAction={setNewRole}
                                            required
                                            error={errorRole}
                                            className={cx('m-b')}
                                        />
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
                                    <div className={cx('label', 'm-b', 'm-bb')}>
                                        <div className={cx('label-title')}>
                                            Địa chỉ
                                        </div>
                                        <div className={cx('label-content')}>
                                            {obj.address}
                                        </div>
                                    </div>
                                    <div className={cx('label', 'm-b')}>
                                        <div className={cx('label-title', 'red')}>
                                            Lưu ý
                                        </div>
                                        <div className={cx('label-content')}>
                                            Để cập nhật thông tin nhân viên, bạn vui
                                            lòng báo nhân viên Cập nhật thông tin
                                            tài khoản trên website
                                        </div>
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
                            solidRed
                            className={cx('margin')}
                            onClick={handleOpenModal}
                        >
                            Xóa
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
                    open={openModal}
                    handleClose={handleCloseModal}
                    title={'Xóa nhân viên'}
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
                        Bạn có chắc chắn muốn xóa nhân viên
                        <strong> {obj.name}</strong>?
                    </div>
                </ModalComp>
                <ModalLoading open={loading} title={'Đang tải'} />
            </div>)}

        </div>
    );
}

export default InfoStaff;

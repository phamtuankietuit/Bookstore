import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './AddStaff.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import * as StaffServices from '~/apiServices/staffServices';
import Spinner from 'react-bootstrap/Spinner';
const cx = classNames.bind(styles);

function AddStaff() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [errorPhone, setErrorPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [role, setRole] = useState('');
    const [errorRole, setErrorRole] = useState('');

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '' || phone === '' || email === '' || role === '') {
            if (name === '') {
                setErrorName('Không được bỏ trống');
            }

            if (phone === '') {
                setErrorPhone('Không được bỏ trống');
            }

            if (email === '') {
                setErrorEmail('Không được bỏ trống');
            }

            if (role === '') {
                setErrorRole('Không được bỏ trống');
            }
        } else {
            // CALL API
            setLoading(true);
            const fetchApi = async () => {
                // console.log(productid.id)




                const obj = {
                    name: name,
                    contact: {
                        phone: phone,
                        email: email
                    },
                    role: role,
                }
                console.log(obj)
                const result = await StaffServices.createStaff(obj)
                    .catch((err) => {
                        console.log(err);
                    });
                console.log(result)
                if (result) {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify('success', 'Đã thêm nhân viên');
                        navigate('/staffs');
                    }, 2000);
                }
                else {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify('error', 'Đã có lỗi xảy rồi');
                    }, 2000);
                }
            }

            fetchApi();
        }
    };

    const handleExit = () => {
        navigate(-1);
    };
    const setNewRole = (obj) => {
        setRole(obj.value)
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <Wrapper
                        title={'Thông tin nhân viên'}
                        className={cx('m-b')}
                    >
                        <div className={cx('twocols')}>
                            <div className={cx('col1')}>
                                <Input
                                    title={'Tên nhân viên'}
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
                                    required
                                    error={errorEmail}
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
                                    required
                                    error={errorPhone}
                                />
                                <Input
                                    title={'Vai trò'}
                                    items={[
                                        {
                                            label: 'warehouse',
                                            value: 'warehouse'
                                        },
                                        {
                                            label: 'sale',
                                            value: 'sale'
                                        },

                                    ]}
                                    value={role}
                                    handleClickAction={setNewRole}
                                    readOnly
                                    required
                                    error={errorRole}
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
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default AddStaff;

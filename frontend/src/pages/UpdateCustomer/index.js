import { useState, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { Switch } from '@mui/material';

import styles from './UpdateCustomer.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as customerServices from '~/apiServices/customerServices';

const cx = classNames.bind(styles);



function UpdateCustomer() {
    const customerId = useParams();
    const [obj, setObj] = useState('');

    useEffect(() => {
        const fetchApi = async () => {
            const result = await customerServices.getCustomer(customerId.id)
                .catch((err) => {
                    console.log(err);
                });

            if (result) {
                setName(result.name);
                setPhone(result.phoneNumber);
                setEmail(result.email);
                setAddress(result.address);
                setObj(result);
                setIsActive(result.isActive);
            }
            else {
                setLoading(false);
                toastContext.notify('error', 'Không thành công');
            }
        }

        fetchApi();
    }, []);

    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [isActive, setIsActive] = useState(true);


    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else {
            setLoading(true);

            const newObj = {
                ...obj,
                name: name,
                phoneNumber: phone,
                email: email,
                isActive: isActive,
            };

            console.log(newObj);

            let isSuccess = true;

            const fetchApi = async () => {
                const result = await customerServices.updateCustomer(customerId.id, newObj)
                    .catch((err) => {
                        isSuccess = false;
                        console.log(err);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (isSuccess) {
                    toastContext.notify('success', 'Cập nhật khách hàng thành công');
                }

                setLoading(false);
            }

            fetchApi();

        }
    };

    const handleExit = () => {
        navigate(-1);
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
                                <Input
                                    title={'Mã khách hàng'}
                                    value={customerId.id}
                                    className={cx('m-b')}
                                    readOnly
                                />
                                <Input
                                    title={'Tên khách hàng'}
                                    required
                                    value={name}
                                    onChange={(value) => setName(value)}
                                    className={cx('m-b')}
                                    error={errorName}
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
                                <Input
                                    title={'Email'}
                                    value={email}
                                    onChange={(value) => setEmail(value)}
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

export default UpdateCustomer;

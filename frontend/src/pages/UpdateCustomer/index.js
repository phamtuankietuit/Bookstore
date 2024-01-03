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
import * as CustommerServices from '~/apiServices/customerServices'
import Spinner from 'react-bootstrap/Spinner';
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

function UpdateCustomer() {
    const customerid = useParams();
    const [obj, setObj] = useState('')
    useEffect(() => {
        const fetchApi = async () => {
            const result = await CustommerServices.getCustomer(customerid.id)
                .catch((err) => {
                    console.log(err);
                });

            if (result) {
                setName(result.name);
                setPhone(result.phoneNumber);
                setEmail(result.email);
                setAddress(result.address.address);
                setID(result.customerId)
                setObj(result)
                // setIsActive(customer.isActive);

            }
            else {
                setTimeout(() => {
                    setLoading(false);
                    toastContext.notify('error', 'Không thành công');
                }, 2000);
            }
        }

        fetchApi();
        // setName(customer.name);
        // setPhone(customer.phone);
        // setEmail(customer.email);
        // setAddress(customer.address);
        // setIsActive(customer.isActive);
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
    const [ID, setID] = useState('')
    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else {
            // CALL API
            setLoading(true);
            const newobj = obj
            newobj.name = name
            newobj.phoneNumber = phone
            newobj.email = email
            newobj.address.address = address
            newobj.address.phoneNumber = phone
            newobj.address.email = email
            newobj.address.name = name
            const fetchApi = async () => {
                const result = await CustommerServices.updateCustomer(customerid.id, newobj)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify('error', 'Không thành công');
                    }, 2000);

                }
                else {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify(
                            'success',
                            'Cập nhật khách hàng thành công',
                        );
                        console.log(newobj)
                    }, 2000);
                }
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
                                    value={ID}
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

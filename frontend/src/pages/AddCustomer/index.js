import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './AddCustomer.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as customerServices from '~/apiServices/customerServices';

import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

function AddCustomer() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // PROPS
    const [name, setName] = useState('');
    const [errorName, setErrorName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [address, setAddress] = useState('');

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // FROM
    const handleSubmit = () => {
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else if (email !== '' && !filter.test(email)) {
            setErrorEmail('Vui lòng nhập đúng định dạng email');
        } else {
            const obj = {
                name: name,
                email: email,
                phoneNumber: phone,
                address: address,
                isActive: true,
                staffId: getLocalStorage().user.staffId,
                staffName: getLocalStorage().user.name,
            }

            console.log(obj);

            const fetchApi = async () => {
                setLoading(true);
                const result = await customerServices.CreateCustomer(obj)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    console.log(result);
                    setLoading(false);
                    toastContext.notify('success', 'Thêm mới khách hàng thành công');
                    navigate('/customers/detail/' + result.customerId);
                }
                else {
                    setLoading(false);
                    toastContext.notify('error', 'Có lỗi xảy ra');
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
                                    error={errorEmail}
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

export default AddCustomer;

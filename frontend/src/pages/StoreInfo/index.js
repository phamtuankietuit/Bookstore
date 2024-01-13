import { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './StoreInfo.module.scss';
import NewHeader from '~/components/NewHeader';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as locationServices from '~/apiServices/locationServices';

const cx = classNames.bind(styles);

function StoreInfo() {
    const toastContext = useContext(ToastContext);

    const [loading, setLoading] = useState(false);
    const [obj, setObj] = useState();

    const handleSave = async () => {
        setLoading(true);

        const newObj = {
            ...obj,
            name: name,
            contact: {
                email: email,
                phone: phone,
            },
            address: address,
        };

        let isSuccess = true;

        const response = await locationServices.updateStore(obj.locationId, newObj)
            .catch((error) => {
                isSuccess = false;
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (isSuccess) {
            toastContext.notify('success', 'Cập nhật thông tin thành công');
        }

        setLoading(false);
    };

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        setLoading(true);

        const fetch = async () => {
            const response = await locationServices.getStore()
                .catch((error) => {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (response) {
                setName(response.data[0].name);
                setEmail(response.data[0].contact.email);
                setPhone(response.data[0].contact.phone);
                setAddress(response.data[0].address);
                setObj(response.data[0]);
            }

            setLoading(false);
        }

        fetch();
    }, []);


    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <NewHeader tab1={false} tab2={true}></NewHeader>
            </div>
            <div className={cx('header-and-content')}>
                <div className={cx('content')}>
                    <div className={cx('content1')}>
                    </div>
                    <div className={cx('content2')}>
                        <h3>Thông tin cửa hàng</h3>
                        <p className={cx('details')}>
                            Các thông tin cơ bản của cửa hàng
                        </p>
                        <div className={cx('input-text-container')}>
                            <div className={cx('grid-content')}>
                                <p>Tên cửa hàng</p>
                                <input
                                    className={cx('text-inp')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className={cx('grid-content')}>
                                <p>SĐT</p>
                                <input
                                    className={cx('text-inp')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Email</p>
                                <input
                                    className={cx('text-inp')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Địa chỉ</p>
                                <input
                                    className={cx('text-inp')}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            {/* <div className={cx('grid-content')}>
                                <p>Phường/Xã</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    value={''}
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Quận/Huyện</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                ></input>
                            </div> */}
                        </div>
                        <div className={cx('btn-c')}>
                            <button onClick={handleSave}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreInfo;

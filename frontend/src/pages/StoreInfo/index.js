import classNames from 'classnames/bind';
import styles from './StoreInfo.module.scss';
import NewHeader from '~/components/NewHeader';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { FaPhoneAlt } from 'react-icons/fa';
import { useContext, useState } from 'react';
import avt from '../../assets/images/minimal-morning-landscape-8k-gx-scaled.jpg';
import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

function StoreInfo() {
    const toastContext = useContext(ToastContext);

    const [image, setImage] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(event.target.files[0]);
    };

    const handleSave = () => {
        toastContext.notify('success', 'Cập nhật thông tin thành công!');
    };
    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <NewHeader tab1={false} tab2={true}></NewHeader>
            </div>
            <div className={cx('header-and-content')}>
                <div className={cx('content')}>
                    <div className={cx('content1')}>
                        {/* <h3>Thông tin liên hệ</h3>
                        <p className={cx('details')}>
                            Thông tin được sử dụng để liên lạc với cửa hàng
                        </p> */}
                        <div className={cx('profile-card')}>
                            {image ? (
                                <img
                                    className={cx('profile-avt')}
                                    src={URL.createObjectURL(image)}
                                    alt=""
                                />
                            ) : (
                                <img
                                    className={cx('profile-avt')}
                                    src={avt}
                                    alt=""
                                />
                            )}
                        </div>
                        <div className={cx('infor-card')}>
                            <div className={cx('input-file')}>
                                <FaCloudUploadAlt
                                    className={cx('icon-cloud')}
                                ></FaCloudUploadAlt>
                                <p>Tải ảnh lên</p>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                ></input>
                            </div>
                        </div>
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
                                    type="text"
                                    value={'TripleK'}
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>SĐT</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    value={'0961826917'}
                                    readOnly
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Email</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    value={'khiem6112003@gmail.com'}
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Địa chỉ</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
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
                            </div>
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

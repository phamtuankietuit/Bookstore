import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import NewHeader from '~/components/NewHeader';
import avt from '../../assets/images/minimal-morning-landscape-8k-gx-scaled.jpg';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { FaPhoneAlt } from 'react-icons/fa';
import { useState, useRef } from 'react';
import DatePicker from '~/components/DatePicker';

const cx = classNames.bind(styles);

function Profile() {
    //đổi ảnh đại diện
    const [image, setImage] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(event.target.files[0]);
    };
    //đổi giới tính
    const [gender, SetGender] = useState('');
    //mở tắt dropdown

    const [showDropdown, setShowDropDown] = useState(false);

    //mở, tắt đổi mật khẩu
    const [show, setShow] = useState(false);
    return (
        <div className={cx('container')}>
            <div className={cx('header-and-content')}>
                <div className={cx('header')}>
                    <NewHeader></NewHeader>
                </div>
                <div className={cx('content')}>
                    <div className={cx('content1')}>
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

                            <div className={cx('infor-card')}>
                                <h1>Duy Khiêm</h1>
                                <p>Cập nhật Avatar</p>
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
                        <div className={cx('profile-tag')}>
                            <IoIosMail className={cx('icon-mail')}></IoIosMail>
                            <p>khiem6112003@gmail.com</p>
                        </div>
                        <div className={cx('profile-tag')}>
                            <FaPhoneAlt
                                className={cx('icon-phone')}
                            ></FaPhoneAlt>
                            <p>0961826917</p>
                        </div>
                    </div>
                    <div className={cx('content2')}>
                        <h3>Thông tin tài khoản</h3>
                        <p className={cx('details')}>
                            Các thông tin cơ bản của tài khoản đang đăng nhập
                            vào hệ thống
                        </p>
                        <div className={cx('input-text-container')}>
                            <div className={cx('grid-content')}>
                                <p>Họ và tên</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    value={'Lê Võ Duy Khiêm'}
                                ></input>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>SĐT</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    disabled
                                    value={'0961826917'}
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
                                <p>Ngày sinh</p>
                                {/* <input
                                    className={cx('text-inp')}
                                    type="text"
                                ></input> */}
                                <DatePicker></DatePicker>
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Giới tính</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                    value={gender}
                                    readOnly
                                    onClick={() =>
                                        setShowDropDown(!showDropdown)
                                    }
                                ></input>
                                {showDropdown && (
                                    <div className={cx('options')}>
                                        <ul>
                                            <li
                                                onClick={() => SetGender('Nam')}
                                            >
                                                Nam
                                            </li>
                                            <li onClick={() => SetGender('Nữ')}>
                                                Nữ
                                            </li>
                                            <li
                                                onClick={() =>
                                                    SetGender('Khác')
                                                }
                                            >
                                                Khác
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className={cx('grid-content')}>
                                <p>Địa chỉ</p>
                                <input
                                    className={cx('text-inp')}
                                    type="text"
                                ></input>
                            </div>
                        </div>
                        <div className={cx('changepass-container')}>
                            <p onClick={() => setShow(true)}>
                                <b>Đổi mật khẩu</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div className={cx('changepass-form')}>
                    <h3>Đổi mật khẩu</h3>
                    <div className={cx('changepass-content')}>
                        <div className={cx('grid-content')}>
                            <p>Mật khẩu hiện tại</p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>SĐT</p>
                            <input
                                className={cx('text-inp')}
                                type="text"
                                disabled
                                value={'0961826917'}
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>Nhập mật khẩu mới</p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>Nhập lại mật khẩu mới</p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                    </div>
                    <p>
                        <b style={{ color: 'red' }}>Lưu ý:</b> Mật khẩu cần thoả
                        mãn các điều kiện sau
                    </p>
                    <p>- Độ dài ít nhất 8 kí tự.</p>
                    <p>
                        - Chứa ít nhất 1 kí tự số, 1 kí tự chữ và 1 kí tự đặc
                        biệt
                    </p>
                    <div className={cx('but-container')}>
                        <button
                            className={cx('cancel-but')}
                            onClick={() => setShow(false)}
                        >
                            Huỷ
                        </button>
                        <button className={cx('accept-but')}>Lưu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;

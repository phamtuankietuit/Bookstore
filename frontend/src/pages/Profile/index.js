import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import NewHeader from '~/components/NewHeader';
import avt from '../../assets/images/minimal-morning-landscape-8k-gx-scaled.jpg';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { FaPhoneAlt } from 'react-icons/fa';
import { useState, useRef, useContext } from 'react';
import DatePicker from '~/components/DatePicker';
import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

function Profile() {
    const toastContext = useContext(ToastContext);
    //xử lý đổi mật khẩu
    const [currentPass, setcurrentPass] = useState('');
    const [newPass, setnewPass] = useState('');
    const [renewPass, setrenewPass] = useState('');

    const onChangeCurrentPass = (e) => {
        setcurrentPass(e.target.value);
    };
    const onChangeNewPass = (e) => {
        setnewPass(e.target.value);
    };
    const onChangeReNewPass = (e) => {
        setrenewPass(e.target.value);
    };
    //kiểm tra điều kiện
    const [message, setMessage] = useState();

    const [showMessage, setShowMessage] = useState(false);

    const [checklogin, setchecklogin] = useState();

    const onclickChangePass = () => {
        if (currentPass === '' || newPass === '' || renewPass === '') {
            setShowMessage(true);
            setMessage('Vui lòng nhập đủ thông tin!');
            setchecklogin(false);
        } else {
            if (
                currentPass.length >= 8 &&
                newPass.length >= 8 &&
                newPass === renewPass
            ) {
                toastContext.notify('success', 'Đổi mật khẩu thành công!');
                setShow(false);
            } else {
                if (newPass.length < 8) {
                    setShowMessage(true);
                    setMessage('Mật khẩu mới phải có độ dài ít nhất 8 kí tự');
                } else if (newPass !== renewPass) {
                    setShowMessage(true);
                    setMessage('Xác nhận mật khẩu mới không trùng khớp');
                }
            }
        }
    };
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

    const handleOpenChangePass = () => {
        setchecklogin(true);
        setShowMessage(false);
        setShow(true);
    };
    //Lưu chỉnh sửa
    const handleSave = () => {
        toastContext.notify('success', 'Cập nhật thông tin thành công!');
    };
    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <NewHeader tab1={true} tab2={false}></NewHeader>
            </div>
            <div className={cx('header-and-content')}>
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
                        </div>
                        {/* <div className={cx('profile-tag')}>
                            <IoIosMail className={cx('icon-mail')}></IoIosMail>
                            <p>khiem6112003@gmail.com</p>
                        </div>
                        <div className={cx('profile-tag')}>
                            <FaPhoneAlt
                                className={cx('icon-phone')}
                            ></FaPhoneAlt>
                            <p>0961826917</p>
                        </div> */}
                        <div className={cx('infor-card')}>
                            {/* <h1>Duy Khiêm</h1> */}
                            {/* <p>Cập nhật Avatar</p> */}
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
                                    className={cx('text-inp', { gd: true })}
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
                                                onClick={() => {
                                                    SetGender('Nam');
                                                    setShowDropDown(
                                                        !showDropdown,
                                                    );
                                                }}
                                            >
                                                Nam
                                            </li>
                                            <li
                                                onClick={() => {
                                                    SetGender('Nữ');
                                                    setShowDropDown(
                                                        !showDropdown,
                                                    );
                                                }}
                                            >
                                                Nữ
                                            </li>
                                            <li
                                                onClick={() => {
                                                    SetGender('Khác');
                                                    setShowDropDown(
                                                        !showDropdown,
                                                    );
                                                }}
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
                            <p onClick={handleOpenChangePass}>
                                <b>Đổi mật khẩu</b>
                            </p>
                        </div>
                        <div className={cx('btn-c')}>
                            <button onClick={handleSave}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div className={cx('changepass-form')}>
                    <h3>Đổi mật khẩu</h3>

                    {showMessage && (
                        <div className={cx('m-cp-c')}>
                            <p className={cx('m-cp')}>{message}</p>
                        </div>
                    )}
                    <div className={cx('changepass-content')}>
                        <div className={cx('grid-content')}>
                            <p>Mật khẩu hiện tại</p>
                            <input
                                className={cx('text-inp', {
                                    red: !checklogin
                                        ? currentPass === ''
                                            ? true
                                            : false
                                        : false,
                                })}
                                type="password"
                                value={currentPass}
                                onChange={onChangeCurrentPass}
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>SĐT</p>
                            <input
                                className={cx('text-inp', {
                                    red: !checklogin
                                        ? newPass === ''
                                            ? true
                                            : false
                                        : false,
                                })}
                                type="text"
                                disabled
                                value={'0961826917'}
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>Nhập mật khẩu mới</p>
                            <input
                                className={cx('text-inp', {
                                    red: !checklogin
                                        ? renewPass === ''
                                            ? true
                                            : false
                                        : false,
                                })}
                                type="password"
                                value={newPass}
                                onChange={onChangeNewPass}
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p>Nhập lại mật khẩu mới</p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                                value={renewPass}
                                onChange={onChangeReNewPass}
                            ></input>
                        </div>
                    </div>
                    <p>
                        <b style={{ color: 'red' }}>Lưu ý:</b> Mật khẩu cần thoả
                        mãn các điều kiện sau
                    </p>
                    <p>- Độ dài ít nhất 8 kí tự.</p>
                    <p>
                        - Xác nhận lại mật khẩu phải trùng khớp với mật khẩu mới
                    </p>
                    <div className={cx('but-container')}>
                        <button
                            className={cx('cancel-but')}
                            onClick={() => setShow(false)}
                        >
                            Huỷ
                        </button>
                        <button
                            className={cx('accept-but')}
                            onClick={onclickChangePass}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;

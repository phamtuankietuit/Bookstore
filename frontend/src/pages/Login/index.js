import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Login.module.scss';
import Logo from '~/assets/images/logo.png';
import ModalComp from '~/components/ModalComp';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as loginServices from '~/apiServices/loginServices';
import * as staffServices from '~/apiServices/staffServices';

const cx = classNames.bind(styles);

function Login() {

    const toastContext = useContext(ToastContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // CHECK IS LOGIN
    useEffect(() => {
        const isLogin = window.localStorage.getItem('isLogin');

        if (isLogin) {
            const object = JSON.parse(window.localStorage.getItem('object'));

            if (object) {
                const fetch = async () => {
                    const response = await staffServices.getStaff(object.user.staffId)
                        .catch((error) => {
                            setLoading(false);
                            console.log(error);
                        });

                    if (response) {
                        if (response.isActive === false) {
                            setLoading(false);
                        } else {
                            if (response.role === 'admin') {
                                navigate('overview');
                            } else if (response.role === 'warehouse') {
                                navigate('/products');
                            } else {
                                navigate('orders');
                            }
                        }
                    }
                }

                fetch();
            } else {
                setLoading(false);
            }

        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    // MODAL
    const [titleModal, setTitleModal] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => {
        setTitleModal('Quên mật khẩu');
        setOpen(true);
        setStep({ step1: true, step2: false, step3: false });
    };

    const handleCloseModal = () => {
        setForgetEmail('');
        setOTP('');
        setNewPass('');
        setReNewPass('');
        setErrorEmail('');
        setErrorOTP('');
        setErrorNewPass('');
        setErrorReNewPass('');
        setEqual(false);
        setOpen(false);
    };

    // MODAL PROPS
    const [step, setStep] = useState({
        step1: true,
        step2: false,
        step3: false,
    });

    // RESET EMAIL
    const [currentUser, setCurrentUser] = useState();

    // MODAL FORGOT EMAIL
    const [forgetEmail, setForgetEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    // MODAL OTP
    const [OTP, setOTP] = useState('');
    const [errorOTP, setErrorOTP] = useState('');

    // MODAL NEW PASSWORD
    const [newPass, setNewPass] = useState('');
    const [errorNewPass, setErrorNewPass] = useState('');

    const [renewPass, setReNewPass] = useState('');
    const [errorReNewPass, setErrorReNewPass] = useState('');

    const [equal, setEqual] = useState(false);

    const handleValidation = () => {
        if (step.step1) {
            handleValidationStep1();
        } else if (step.step2) {
            handleValidationStep2();
        } else {
            handleValidationStep3();
        }
    };

    const handleValidationStep1 = () => {
        if (forgetEmail === '') {
            setErrorEmail('Không được bỏ trống');
        } else {
            const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (!filter.test(forgetEmail)) {
                setErrorEmail('Email sai định dạng!');
            } else {
                setLoading(true);
                let isSuccess = true;
                const fetch = async () => {
                    // eslint-disable-next-line no-unused-vars
                    const response = await loginServices.forgotPassword({ email: forgetEmail })
                        .catch((error) => {
                            setLoading(false);
                            isSuccess = false;
                            toastContext.notify('error', 'Vui lòng kiểm tra lại email');
                        });

                    if (isSuccess) {
                        setLoading(false);
                        toastContext.notify('success', 'Mật khẩu mới đã được cấp qua email. Vui lòng kiểm tra');
                        handleCloseModal();
                    }
                }

                fetch();
            }
        }
    };

    const handleValidationStep2 = () => {
        if (OTP === '') {
            setErrorOTP('Không được bỏ trống');
        } else {
            setStep({ step1: false, step2: false, step3: true });
        }
    };

    const handleValidationStep3 = () => {
        if (renewPass === '' || newPass === '') {
            if (newPass === '') {
                setErrorNewPass('Không được bỏ trống');
            }
            if (renewPass === '') {
                setErrorReNewPass('Không được bỏ trống');
            }
        } else if (newPass === renewPass) {

            setLoading(true);
            const fetch = async () => {
                let isSuccess = true;

                const newObj = {
                    email: currentUser.email,
                    newPassword: newPass,
                    oldPassword: currentUser.password,
                };

                const response = await loginServices.updatePassword(newObj, currentUser.staffId)
                    .catch((error) => {
                        isSuccess = false;
                        console.log(error);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (isSuccess) {
                    toastContext.notify('success', 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại');
                    handleCloseModal();
                }

                setLoading(false);
            }

            fetch();
        } else {
            setEqual(true);
        }
    };

    // LOGIN PROPS
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState();
    const [isValid, setIsValid] = useState(false);

    const handleLogin = () => {
        if (email === '' || password === '') {
            setIsValid('error');
            setMessage('Vui lòng điền đủ thông tin!');
        } else {
            const filter =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email)) {
                setMessage('Vui lòng nhập đúng định dạng email');
            } else {
                setIsValid(false);
                setLoading(true);

                const fetchApi = async () => {
                    const obj = {
                        email: email,
                        password: password,
                    }

                    console.log(obj);

                    const result = await loginServices.login(obj)
                        .catch((error) => {
                            if (error.response) {
                                if (error.response.status === 400) {
                                    toastContext.notify('error', 'Vui lòng kiểm tra lại email hoặc mật khẩu');
                                } else if (error.response.status === 403) {
                                    toastContext.notify('error', 'Tài khoản đã bị vô hiệu hóa');
                                }
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });


                    if (result) {

                        if (result.needReset === true) {
                            setCurrentUser({
                                staffId: result.user.staffId,
                                email: result.user.contact.email,
                                password: password,
                            });
                            setTitleModal('Đặt lại mật khẩu');
                            setOpen(true);
                            setStep({ step1: false, step2: false, step3: true });
                        } else {
                            window.localStorage.setItem('object', JSON.stringify(result));
                            window.localStorage.setItem('isLogin', true);

                            if (result.user.role === 'admin') {
                                navigate('/overview');
                            } else if (result.user.role === 'warehouse') {
                                navigate('/products');
                            } else {
                                navigate('/orders');
                            }
                        }
                    }

                    setLoading(false);
                }

                fetchApi();
            }
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('login-form')}>
                <div className={cx('form-logo')}>
                    <img src={Logo} className={cx('logo')} alt='' />
                    <h1>Triple K</h1>
                </div>
                <p
                    style={{
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        textAlign: 'center',
                        width: '100%',
                        height: 'fit-content',
                        marginBottom: '2%',
                    }}
                >
                    Đăng nhập vào cửa hàng của bạn
                </p>
                {isValid && <p className={cx('login-message')}>{message}</p>}
                <div className={cx('login-text')}>
                    <input
                        type="text"
                        placeholder="Số điện thoại hoặc email"
                        id="account"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    <div
                        className={cx('input-border', {
                            red: isValid
                                ? email === ''
                                    ? true
                                    : false
                                : false,
                        })}
                    ></div>
                </div>
                <div className={cx('login-text')}>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    <div
                        className={cx('input-border', {
                            red: isValid
                                ? password === ''
                                    ? true
                                    : false
                                : false,
                        })}
                    ></div>
                </div>
                <div className={cx('forgot-pass')}>
                    <p onClick={() => handleOpenModal()}>Quên mật khẩu?</p>
                </div>
                <button className={cx('login-btn')} onClick={handleLogin}>
                    ĐĂNG NHẬP
                </button>
            </div>
            <ModalComp
                open={open}
                handleClose={handleCloseModal}
                title={titleModal}
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
                            {step.step1 && 'Tiếp tục'}
                            {step.step2 && 'Tiếp tục'}
                            {step.step3 && 'Xác nhận'}
                        </Button>
                    </div>
                }
            >
                {step.step1 && (
                    <Input
                        title={'Email'}
                        value={forgetEmail}
                        onChange={(value) => setForgetEmail(value)}
                        error={errorEmail}
                        required
                    />
                )}
                {step.step2 && (
                    <Input
                        title={'OTP'}
                        value={OTP}
                        onChange={(value) => setOTP(value)}
                        error={errorOTP}
                        required
                    />
                )}
                {step.step3 && (
                    <div className={cx('renew-container')}>
                        {equal && (
                            <p className={cx('login-message')}>
                                Mật khẩu không khớp. Vui lòng nhập lại
                            </p>
                        )}
                        <Input
                            title={'Nhập mật khẩu mới'}
                            value={newPass}
                            onChange={(value) => setNewPass(value)}
                            error={errorNewPass}
                            required
                            className={cx('m-b')}
                            password
                        />
                        <Input
                            title={'Nhập lại mật khẩu mới'}
                            value={renewPass}
                            onChange={(value) => setReNewPass(value)}
                            error={errorReNewPass}
                            required
                            password
                        />
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default Login;

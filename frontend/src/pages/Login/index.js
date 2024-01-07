import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import logo from '../../assets/images/logo.png';
import { useState, useContext, useEffect } from 'react';
import ModalComp from '~/components/ModalComp';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { ToastContext } from '~/components/ToastContext';
import { useNavigate } from 'react-router-dom';
import ModalLoading from '~/components/ModalLoading';

import * as LoginServices from '~/apiServices/loginServices';
import * as staffServices from '~/apiServices/staffServices';

const cx = classNames.bind(styles);
function Login() {
    const [loading, setLoading] = useState(true);

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
    }, []);

    //toast context
    const toastContext = useContext(ToastContext);
    const navigate = useNavigate();

    //Modal Comp
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setStep({ step1: true, step2: false, step3: false });
    };
    const handleClose = () => setOpen(false);

    const [forgetEmail, setForgetEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const [OTP, setOTP] = useState('');
    const [errorOTP, setErrorOTP] = useState('');

    const [newPass, setNewPass] = useState('');
    const [errorNewPass, setErrorrNewPass] = useState('');

    const [renewPass, setReNewPass] = useState('');
    const [errorReNewPass, setErrorrReNewPass] = useState('');

    const [equal, setEqual] = useState(false);


    //Forget Pass Step
    const [step, setStep] = useState({
        step1: true,
        step2: false,
        step3: false,
    });

    const handleCloseModal = () => {
        handleClose();
        setForgetEmail('');
        setOTP('');
        setNewPass('');
        setReNewPass('');
        setErrorEmail('');
        setErrorOTP('');
        setErrorrNewPass('');
        setErrorrReNewPass('');
        setEqual(false);
    };

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
            const filter =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(forgetEmail)) {
                setErrorEmail('Email sai định dạng!');
            } else {
                setLoading(true);
                let isSuccess = true;
                const fetch = async () => {
                    const response = await LoginServices.forgotPassword({ email: forgetEmail })
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
                // setStep({ step1: false, step2: true, step3: false });
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
                setErrorrNewPass('Không được bỏ trống');
            }
            if (renewPass === '') {
                setErrorrReNewPass('Không được bỏ trống');
            }
        } else {
            if (newPass === renewPass) {
                toastContext.notify('success', 'Đổi mật khẩu mới thành công!');
                handleCloseModal();
            } else {
                setEqual(true);
            }
        }
    };

    const [email, setEmail] = useState('');

    const [password, SetPassword] = useState('');

    const OnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const OnChangePass = (e) => {
        SetPassword(e.target.value);
    };

    const [message, setMessage] = useState();

    const [checklogin, setCheckLogin] = useState(false);

    const OnClickLogin = () => {
        if (email === '' || password === '') {
            setCheckLogin('error');
            setMessage('Vui lòng điền đủ thông tin!');
        } else {
            const filter =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(email)) {
                setMessage('Vui lòng nhập đúng định dạng email');
            } else {
                setCheckLogin(false);
                setLoading(true);

                const fetchApi = async () => {
                    const obj = {
                        email: email,
                        password: password,
                    }

                    const result = await LoginServices.Login(obj)
                        .catch((error) => {
                            if (error.response) {
                                if (error.response.status === 400) {
                                    toastContext.notify('error', 'Vui lòng kiểm tra lại email hoặc mật khẩu');
                                }
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });

                    console.log(result);

                    if (result) {
                        if (result.user.isActive === true) {
                            window.localStorage.setItem('object', JSON.stringify(result));
                            window.localStorage.setItem('isLogin', true);

                            if (result.user.role === 'admin') {
                                navigate('overview');
                            } else if (result.user.role === 'warehouse') {
                                navigate('/products');
                            } else {
                                navigate('orders');
                            }
                        } else {
                            toastContext.notify('error', 'Tài khoản đã bị vô hiệu hóa');
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
                    <img src={logo} className={cx('logo')}></img>
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
                {checklogin && <p className={cx('login-message')}>{message}</p>}
                <div className={cx('login-text')}>
                    <input
                        type="text"
                        placeholder="Số điện thoại hoặc email"
                        id="account"
                        value={email}
                        onChange={OnChangeEmail}
                    ></input>
                    <div
                        className={cx('input-border', {
                            red: checklogin
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
                        onChange={OnChangePass}
                    ></input>
                    <div
                        className={cx('input-border', {
                            red: checklogin
                                ? password === ''
                                    ? true
                                    : false
                                : false,
                        })}
                    ></div>
                </div>
                <div className={cx('forgot-pass')}>
                    <p onClick={() => handleOpen()}>Quên mật khẩu?</p>
                </div>
                <button className={cx('login-btn')} onClick={OnClickLogin}>
                    ĐĂNG NHẬP
                </button>
            </div>
            <ModalComp
                open={open}
                handleClose={handleCloseModal}
                title={'Quên mật khẩu'}
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

import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import logo from '../../assets/images/logo.png';

const cx = classNames.bind(styles);
function Login() {
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
                <div className={cx('login-text')}>
                    <input
                        type="text"
                        placeholder="Số điện thoại hoặc email"
                        id="account"
                    ></input>
                    <div className={cx('input-border')}></div>
                </div>
                <div className={cx('login-text')}>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        id="password"
                    ></input>
                    <div className={cx('input-border')}></div>
                </div>
                <div className={cx('forgot-pass')}>
                    <p>Quên mật khẩu</p>
                </div>
                <button className={cx('login-btn')}>ĐĂNG NHẬP</button>
            </div>
        </div>
    );
}

export default Login;

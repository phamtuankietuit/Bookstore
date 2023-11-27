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
                    <h1
                        style={{
                            fontSize: '40px',
                            fontWeight: '700',
                        }}
                    >
                        Triple K
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: '24px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    Đăng nhập vào cửa hàng của bạn
                </p>
                <div className={cx('login-text')}>
                    <input
                        type="text"
                        placeholder="Số điện thoại hoặc email"
                    ></input>
                    <div className={cx('input-border')}></div>
                </div>
                <div className={cx('login-text')}>
                    <input type="password" placeholder="Mật khẩu"></input>
                    <div className={cx('input-border')}></div>
                </div>
                <p className={cx('forgot-pass')}>Quên mật khẩu</p>
                <button className={cx('login-btn')}>ĐĂNG NHẬP</button>
            </div>
        </div>
    );
}

export default Login;

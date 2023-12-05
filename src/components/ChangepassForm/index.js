import classNames from 'classnames/bind';
import styles from './ChangepassForm.module.scss';
import { useState } from 'react';
const cx = classNames.bind(styles);

function ChangepassForm() {
    const [show, setShow] = useState(true);
    return (
        <div>
            {show && (
                <div className={cx('changepass-form')}>
                    <h3
                        style={{
                            height: 'fit-content',
                            fontSize: '20px',
                            marginTop: '5px',
                            textIndent: '10px',
                            width: '100%',
                        }}
                    >
                        Đổi mật khẩu
                    </h3>
                    <div className={cx('changepass-content')}>
                        <div className={cx('grid-content')}>
                            <p
                                style={{
                                    fontSize: '16px',
                                    height: 'fit-content',
                                    width: '100%',
                                }}
                            >
                                Mật khẩu hiện tại
                            </p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p
                                style={{
                                    fontSize: '16px',
                                    height: 'fit-content',
                                    width: '100%',
                                }}
                            >
                                SĐT
                            </p>
                            <input
                                className={cx('text-inp')}
                                type="text"
                                value={'0961826917'}
                                readOnly
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p
                                style={{
                                    fontSize: '16px',
                                    height: 'fit-content',
                                    width: '100%',
                                }}
                            >
                                Nhập mật khẩu mới
                            </p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                        <div className={cx('grid-content')}>
                            <p
                                style={{
                                    fontSize: '16px',
                                    height: 'fit-content',
                                    width: '100%',
                                }}
                            >
                                Nhập lại mật khẩu mới
                            </p>
                            <input
                                className={cx('text-inp')}
                                type="password"
                            ></input>
                        </div>
                    </div>
                    <p style={{ width: '90%', height: 'fit-content' }}>
                        <b style={{ color: 'red' }}>Lưu ý:</b> Mật khẩu cần thoả
                        mãn các điều kiện sau
                    </p>
                    <p style={{ width: '90%', height: 'fit-content' }}>
                        - Độ dài ít nhất 8 kí tự.
                    </p>
                    <p style={{ width: '90%', height: 'fit-content' }}>
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

export default ChangepassForm;

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { FaFilePen, FaPrint, FaListUl, FaCirclePlus } from 'react-icons/fa6';
import classNames from 'classnames/bind';
import styles from './Toolbar.module.scss';

const cx = classNames.bind(styles);

function ToolBar({ array }) {
    const [arraybtn, Setarraybtn] = useState([]);

    useEffect(() => {
        Setarraybtn(array);
    });
    return (
        <div className={cx('toolbar')}>
            <Button variant="primary" className="me-3 mb-2">
                <FaFilePen className="me-2" />
                Nhập file
            </Button>

            <Button variant="primary" className="me-3 mb-2">
                <FaPrint className="me-2" />
                Xuất file
            </Button>
            {arraybtn.length === 0 ? (
                <div />
            ) : (
                arraybtn.map((btn, index) => (
                    <NavLink
                        key={index}
                        to={btn.link}
                        className="btn bg-primary text-white m-2 mt-0 d-flex justify-content-end align-items-center"
                    >
                        {btn.type === 1 ? (
                            <FaListUl className="me-2" />
                        ) : (
                            <FaCirclePlus className="me-2" />
                        )}
                        {btn.title}
                    </NavLink>
                ))
            )}
        </div>
    );
}

export default ToolBar;

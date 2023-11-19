import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaFilePen } from 'react-icons/fa6'
import { FaPrint } from 'react-icons/fa6'
import { FaListUl } from 'react-icons/fa6'
import { FaCirclePlus } from 'react-icons/fa6'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import classNames from 'classnames/bind';
import styles from './Toolbar.module.scss';
import { useEffect, useState } from 'react';
ToolBar.propTypes = {
    array: PropTypes.array
};
const cx = classNames.bind(styles);
function ToolBar({ array, page }) {
    const [arraybtn, Setarraybtn] = useState([])

    useEffect(() => {
        Setarraybtn(array)
    })
    return (
        <div className={cx('toolbar')}>
            <Button variant="primary" className='me-3 mb-2'>
                <FaFilePen className='me-2' />
                Nhập file
            </Button>


            <Button variant="primary" className='me-3 mb-2'>
                <FaPrint className='me-2' />
                Xuất file
            </Button>
            {
                arraybtn.length === 0 ? (
                    <div />
                ) : (
                    arraybtn.map(btn => (

                        <NavLink to={btn.link} className="btn bg-primary text-white m-2 mt-0" >
                            {
                                btn.type === 1 ? (
                                    <FaListUl className='me-2' />
                                ) : (
                                    <FaCirclePlus className='me-2' />
                                )
                            }
                            {btn.title}
                        </NavLink>
                    ))
                )
            }

        </div>
    );
}

export default ToolBar;
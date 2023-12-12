import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchableDropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import { options, options2 } from './data';
import Item from '../Item_SearchBar';
import { FaCirclePlus } from "react-icons/fa6";


const cx = classNames.bind(styles);
function SearchResult({ setValue, stypeid }) {

    const placeholder = 'Tìm kiếm theo mã sản phẩm tên sản phẩm';

    const [input, setInput] = useState('');
    const [data, setdata] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (stypeid === 0) setdata(options)
        else setdata(options2)
    });

    const handleOnCharge = (value) => {
        setInput(value);
    }
    const prevPage = () => {
        if (currentPage !== 1) setcurrentPage(currentPage - 1);
    }

    const nextPage = () => {
        if (currentPage !== numofTotalPage) setcurrentPage(currentPage + 1);
    }
    const renderproductlist = data.filter(product => input === '' || product.name.includes(input) || product.sku.includes(input));
    const [PerPage, setPerPage] = useState(5);
    const [currentPage, setcurrentPage] = useState(1);

    const numofTotalPage = Math.ceil(data.length / PerPage);

    const indexOflastPd = currentPage * PerPage;
    const indexOffirstPd = indexOflastPd - PerPage;

    const visible = renderproductlist.slice(indexOffirstPd, indexOflastPd);

    const handleClick = (obj) => {
        setValue(obj);
        setOpen(false)
    }
    return (
        <div >
            <div
                className={cx('search-bar')}
            >
                <FontAwesomeIcon className={cx('search-bar-icon')} icon={faMagnifyingGlass} />

                <input
                    className={cx('search-bar-input')}
                    placeholder={placeholder}
                    onChange={(e) => handleOnCharge(e.target.value)}
                    onClick={() => {
                        setOpen(!open)
                        setcurrentPage(1)
                    }

                    }
                />

            </div>
            {
                open && (
                    <div className={cx('search-result')}>
                        <div className='mt-2 '>
                            <div className={`text-center text-primary ${cx('result-item')}`}>
                                <FaCirclePlus className='me-2' />
                                thêm mới
                            </div>
                            {
                                visible.map(option => (
                                    <div className={cx('result-item')} onClick={(e) => handleClick(option)} key={option.id}>
                                        {(() => {
                                            switch (stypeid) {
                                                case 0:
                                                    return <div >{option.name}</div>;
                                                case 1:
                                                    return <Item product={option} />
                                                default:
                                                    return null;
                                            }
                                        })()}

                                    </div>


                                ))
                            }
                        </div>




                        <Pagination className={`justify-content-end mt-3`}>
                            <Pagination.Prev onClick={prevPage} />
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>

                    </div>

                )
            }





        </div>
    );
}

export default SearchResult;
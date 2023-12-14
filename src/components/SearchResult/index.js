import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchableDropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import Item from '../Item_SearchBar';
import { FaCirclePlus } from "react-icons/fa6";
import Spinner from 'react-bootstrap/Spinner';

const cx = classNames.bind(styles);
function SearchResult({ setValue, stypeid, list }) {

    const [placeholder, setPlaceholder] = useState('');

    const [input, setInput] = useState('');
    const [data, setdata] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (stypeid === 0) {
            setdata(list)
            setPlaceholder('Tìm kiếm theo tên nhà cung cấp')
        }
        else if (stypeid === 1) {
            setdata(list)
            setPlaceholder('Tìm kiếm theo mã sản phẩm tên sản phẩm')
        }
        else {
            setdata(list)
            setPlaceholder('Thêm khách hàng vào đơn')
        }

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
        <div className={cx('search-with-result')}>
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
                                data.length === 0 ? (
                                    <div className='text-center mt-3'>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : (
                                    <div>
                                        {
                                            visible.map(option => (
                                                <div className={cx('result-item')} onClick={(e) => handleClick(option)} key={option.id}>
                                                    {(() => {
                                                        switch (stypeid) {
                                                            case 0:
                                                                return <div >{option.name}</div>;
                                                            case 1:
                                                                return <Item product={option} />;
                                                            case 2:
                                                                return <div>
                                                                    <p className='fs-6'>{option.name}</p>
                                                                    <p className={cx('color-gray')}>{option.phone}</p>
                                                                </div>;

                                                            default:
                                                                return null;
                                                        }
                                                    })()}

                                                </div>


                                            ))
                                        }
                                    </div>
                                )
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
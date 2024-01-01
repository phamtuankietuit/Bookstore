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
import * as ProductServices from '~/apiServices/productServices';
import * as SuppliersServices from '~/apiServices/supplierServices';

const cx = classNames.bind(styles);
function SearchResult({ setValue, stypeid, suppliername }) {

    const [placeholder, setPlaceholder] = useState('');

    const [input, setInput] = useState('');
    const [open, setOpen] = useState(false);
    const [iscall, setIscall] = useState(0)

    const [list, setList] = useState([])
    const handleOnCharge = (value) => {
        setInput(value);
    }
    const prevPage = () => {
        if (currentPage !== 1) {
            setcurrentPage(currentPage - 1);
            setIscall(0)
        }

    }

    const nextPage = () => {
        if (currentPage !== numofTotalPage) {
            setcurrentPage(currentPage + 1);
            setIscall(0)
        }

    }
    const renderproductlist = list.filter(product => input === "" || product.name.includes(input) || product.sku.includes(input));
    // 
    const [currentPage, setcurrentPage] = useState(1);

    const [numofTotalPage, setNumofTotal] = useState(0)


    const handleClick = (obj) => {
        setValue(obj);
        setOpen(false)
        setcurrentPage(1)
        setIscall(0)
        console.log(obj);
    }


    useEffect(() => {
        if (iscall === 0) {
            if (stypeid === 0) {
                const fetchApi = async () => {
                    const result = await SuppliersServices.getAllSuppliers(currentPage, 5)
                        .catch((err) => {
                            console.log(err);
                        });

                    if (result) {
                        setList(result.data);
                        console.log(result.data)
                        if (numofTotalPage === '') setNumofTotal(result.metadata.count)
                    }
                    // console.log(result)
                }
                setIscall(1)
                fetchApi();
                setPlaceholder('Tìm kiếm theo tên nhà cung cấp')
            }
            else if (stypeid === 1) {

                if (suppliername === null) {
                    const fetchApi = async () => {
                        const result = await ProductServices.getAllProducts(currentPage, 5)
                            .catch((err) => {
                                console.log(err);
                            });

                        if (result) {
                            setList(result.data);
                            console.log(result.data)
                            if (numofTotalPage === '') setNumofTotal(result.metadata.count)
                        }
                        // console.log(result)
                    }
                    fetchApi();
                }
                else if (suppliername !== '') {

                    const fetchApi = async () => {
                        const result = await ProductServices.getProductsOfSupplier(currentPage, 5, suppliername)
                            .catch((err) => {
                                console.log(err);
                            });

                        if (result) {
                            setList(result.data);
                            console.log(result.data)
                            if (numofTotalPage === '') setNumofTotal(result.metadata.count)
                        }
                        // console.log(result)
                    }
                    fetchApi();
                }


                setPlaceholder('Tìm kiếm theo mã sản phẩm tên sản phẩm')
                setIscall(1)
            }
            else {

                setPlaceholder('Thêm khách hàng vào đơn')
            }
        }


    });


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
                        setIscall(0)
                    }

                    }
                />

            </div>
            {
                open && (
                    <div className={cx('search-result')}>
                        <div className='mt-2 '>
                            {
                                list.length === 0 ? (
                                    <div className='text-center mt-3'>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : (
                                    <div>
                                        {
                                            renderproductlist.map((option, index) => (
                                                <div className={cx('result-item')} onClick={() => handleClick(option)} key={index}>
                                                    {(() => {
                                                        switch (stypeid) {
                                                            case 0:
                                                                return <div className={cx('item_provider')}>{option.name}</div>;
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
                            <Pagination.Prev onClick={prevPage} disabled={currentPage === 1 ? true : false} />
                            <Pagination.Next onClick={nextPage} disabled={currentPage === numofTotalPage ? true : false} />
                        </Pagination>

                    </div>

                )
            }





        </div>
    );
}

export default SearchResult;
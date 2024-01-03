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
import * as CustomerServices from '~/apiServices/customerServices'
const cx = classNames.bind(styles);
function SearchResult({ setValue, stypeid, supplierID }) {

    const [placeholder, setPlaceholder] = useState('');

    const [input, setInput] = useState('');
    const [open, setOpen] = useState(false);

    const [list, setList] = useState([])
    const handleOnCharge = (value) => {
        setInput(value);
    }
    const prevPage = () => {
        if (currentPage !== 1) {
            setcurrentPage(currentPage - 1);

        }

    }

    const nextPage = () => {
        if (currentPage !== numofTotalPage) {
            setcurrentPage(currentPage + 1);
        }

    }
    const renderproductlist = list.filter(product => input === "" || product.name.includes(input) || product.sku.includes(input));
    // 
    const [currentPage, setcurrentPage] = useState(1);

    const [numofTotalPage, setNumofTotal] = useState(0)
    const PerPage = 5
    const indexOflastPd = currentPage * PerPage;
    const indexOffirstPd = indexOflastPd - PerPage;

    const visible = renderproductlist.slice(indexOffirstPd, indexOflastPd);

    const handleClick = (obj) => {
        setValue(obj);
        setOpen(false)
        setcurrentPage(1)
    }


    useEffect(() => {
        if (stypeid === 0) {
            const fetchApi = async () => {
                const result = await SuppliersServices.getAllSuppliers(currentPage, -1)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    setList(result.data);
                    if (numofTotalPage === '') setNumofTotal(result.metadata.count / 5)
                }
                // console.log(result)
            }
            fetchApi();
            setPlaceholder('Tìm kiếm theo tên nhà cung cấp')
        }
        else if (stypeid === 1) {
            if (supplierID !== '') {
                const fetchApi = async () => {
                    const result = await ProductServices.getProductsOfSupplier(currentPage, -1, supplierID)
                        .catch((err) => {
                            console.log(err);
                        });

                    if (result) {
                        setList(result.data);
                        if (numofTotalPage === '') setNumofTotal(result.metadata.count / 5)
                    }
                    // console.log(result)
                }
                fetchApi();
            }
            else {
                setList([]);
                setNumofTotal(0)
            }
            setPlaceholder('Tìm kiếm theo mã sản phẩm tên sản phẩm')
        }
        else if (stypeid === 2) {
            const fetchApi = async () => {

                const result = await ProductServices.getAllProductsTwo(currentPage, -1)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    setList(result.data);
                    if (numofTotalPage === '') setNumofTotal(result.metadata.count / 5)
                }
                // console.log(result)
            }
            fetchApi();
        }
        else {
            const fetchApi = async () => {

                const result = await CustomerServices.getAllCustomerTwo(currentPage, -1)
                    .catch((err) => {
                        console.log(err);
                    });

                if (result) {
                    setList(result.data);
                    if (numofTotalPage === '') setNumofTotal(result.metadata.count / 5)
                }
                // console.log(result)
            }
            fetchApi();
            setPlaceholder('Thêm khách hàng vào đơn')
        }

        if (supplierID === '') setOpen(false)

    }, [open, supplierID]);


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
                                            visible.map((option, index) => (
                                                <div className={cx('result-item')} onClick={() => handleClick(option, index)} key={index}>
                                                    {(() => {
                                                        switch (stypeid) {
                                                            case 0:
                                                                return <div className={cx('item_provider')}>{option.name}</div>;
                                                            case 1:
                                                                return <Item product={option} />;
                                                            case 2:
                                                                return <Item product={option} />;
                                                            case 3:
                                                                return <div>
                                                                    <p className='fs-6'>{option.name}</p>
                                                                    <p className={cx('color-gray')}>{option.phoneNumber}</p>
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
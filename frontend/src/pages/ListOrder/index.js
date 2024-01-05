import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

import styles from './ListOrder.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { OrderItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import { ToastContext } from '~/components/ToastContext';

import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';
import * as staffServices from '~/apiServices/staffServices';


const cx = classNames.bind(styles);

function ListOrder() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        startDate,
        endDate,
        customerIds,
        staffIds,
    ) => {

        console.log('object pass', {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(customerIds && { customerIds }),
            ...(staffIds && { staffIds }),
        });

        return {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(customerIds && { customerIds }),
            ...(staffIds && { staffIds }),
        };
    }

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('salesOrderId');
    const [orderBy, setOrderBy] = useState('asc');

    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER OPTIONS
    const [optionsCustomer, setOptionsCustomer] = useState([]);
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedCustomer, setSelectedCustomer] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedCustomer([]);
        setSelectedStaff([]);
        setDateCreated('');
    };

    const convertDate = (dateString) => {
        let dateParts = dateString.split('/');
        let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        return date.toISOString();
    }

    const handleFilter = async () => {
        setPageNumber(1);

        if (dateCreated) {
            const startDate = convertDate(dateCreated.split(' – ')[0]);
            const endDate = convertDate(dateCreated.split(' – ')[1]);

            getList(
                await createObjectQuery(
                    1,
                    pageSize,
                    sortBy,
                    orderBy,
                    startDate,
                    endDate,
                    selectedCustomer.length > 0 && returnArray(selectedCustomer),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                )
            );
        } else {
            getList(
                await createObjectQuery(
                    1,
                    pageSize,
                    sortBy,
                    orderBy,
                    selectedCustomer.length > 0 && returnArray(selectedCustomer),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                )
            );
        }

        handleCloseFilter();
    };

    // GET DATA CUSTOMER
    const getCus = async () => {
        const response = await customerServices.getAllCustomerTwo(1, -1)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.data.map((cus, index) => ({ label: cus.name, value: cus.customerId }));
            setOptionsCustomer(data);
        }
    };

    // GET DATA STAFF
    const getStaff = async () => {
        const response = await staffServices.getAllStaffs({ pageNumber: 1, pageSize: -1 })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.data.map((staff, index) => ({ label: staff.name, value: staff.staffId }));
            setOptionsStaff(data);
        }
    };

    // GET DATA FOR FILTER
    useEffect(() => {
        getCus();
        getStaff();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const handleSetDate = (str) => {
        if (str.includes(' - ')) {
            const arr = str.split(' - ');

            setStartDate((new Date(arr[0])).toISOString());
            setEndDate((new Date(arr[1])).toISOString());
        }
        setDateCreated(str);
    }

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/orders/detail/' + row.salesOrderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const getList = async (obj) => {
        setPending(true);

        const response = await saleServices.getAllSalesOrders(obj)
            .catch((error) => {
                setPending(false);

                if (error.response.status === 404) {
                    setRows([]);
                    setTotalRows(0);
                } else {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                }
            });

        if (response) {
            console.log(response.data);
            setPending(false);
            setRows(response.data);
            setTotalRows(response.metadata.count);
        }
    }

    // SORT
    const handleSort = async (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(
            await createObjectQuery(
                1,
                pageSize,
                column.text,
                sortDirection,
                startDate && startDate,
                endDate && endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
            )
        );

    };


    // PAGINATION
    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPageSize(newPerPage);
        setPageNumber(pageNumber);

        getList(
            await createObjectQuery(
                pageNumber,
                newPerPage,
                sortBy,
                orderBy,
                startDate && startDate,
                endDate && endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
            )
        );

    }

    const handlePageChange = async (pageNumber) => {
        setPageNumber(pageNumber);

        getList(
            await createObjectQuery(
                pageNumber,
                pageSize,
                sortBy,
                orderBy,
                startDate && startDate,
                endDate && endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
            )
        );

    }

    useEffect(() => {
        const fetch = async () => {
            getList(
                await createObjectQuery(
                    pageNumber,
                    pageSize,
                    sortBy,
                    orderBy,
                    startDate && startDate,
                    endDate && endDate,
                    selectedCustomer.length > 0 && returnArray(selectedCustomer),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faUpload} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Nhập file
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faDownload} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Xuất file
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}></div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn hàng, tên, số điện thoại khách hàng'
                    }
                    search={search}
                    handleSearch={handleSearch}
                    filterComponent={
                        <Filter
                            open={openFilter}
                            handleClose={handleCloseFilter}
                            handleOpen={handleOpenFilter}
                            handleClearFilter={handleClearFilter}
                            handleFilter={handleFilter}
                        >
                            <DateRange
                                title={'Ngày tạo'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={handleSetDate}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsCustomer}
                                placeholder={'Khách hàng'}
                                selected={selectedCustomer}
                                setSelected={setSelectedCustomer}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsStaff}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedStaff}
                                setSelected={setSelectedStaff}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    pagination
                    onRowClicked={onRowClicked}
                    itemComponent={OrderItem}
                    data={rows}
                    pending={pending}
                    // PAGINATION
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                    SORT
                    handleSort={handleSort}
                />
            </div>
        </div>
    );
}

export default ListOrder;

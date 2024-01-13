import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ListOrder.module.scss';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { OrderItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

import { ToastContext } from '~/components/ToastContext';

import * as saleServices from '~/apiServices/saleServices';
import * as customerServices from '~/apiServices/customerServices';
import * as staffServices from '~/apiServices/staffServices';

import { ConvertISO } from '~/components/ConvertISO';

const cx = classNames.bind(styles);

function ListOrder() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('salesOrderId');
    const [orderBy, setOrderBy] = useState('asc');

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
        query,
    ) => {

        console.log({
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(customerIds && { customerIds }),
            ...(staffIds && { staffIds }),
            ...(query && { query }),
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
            ...(query && { query }),
        };
    }

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }


    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            setPageNumber(1);
            getList(
                await createObjectQuery(
                    1,
                    pageSize,
                    sortBy,
                    orderBy,
                    dateCreated && ConvertISO(dateCreated).startDate,
                    dateCreated && ConvertISO(dateCreated).endDate,
                    selectedCustomer.length > 0 && returnArray(selectedCustomer),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }
    }

    // FILTER OPTIONS
    const [optionsCustomer, setOptionsCustomer] = useState([]);
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedCustomer, setSelectedCustomer] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    const handleSetDate = (str) => {
        setDateCreated(str);
    }

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedCustomer([]);
        setSelectedStaff([]);
        setDateCreated('');
    };

    const handleFilter = async () => {
        setPageNumber(1);
        getList(
            await createObjectQuery(
                1,
                pageSize,
                sortBy,
                orderBy,
                dateCreated && ConvertISO(dateCreated).startDate,
                dateCreated && ConvertISO(dateCreated).endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
            ));


        handleCloseFilter();
    };

    // GET DATA CUSTOMER
    const getCus = async () => {
        const response = await customerServices.getAllCustomers({ pageNumber: 1, pageSize: -1 })
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


    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/orders/detail/' + row.salesOrderId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const getList = async (obj) => {
        setPending(true);

        const response = await saleServices.getAllSalesOrders(obj)
            .catch((error) => {
                if (error.response.status === 404) {
                    setRows([]);
                    setTotalRows(0);
                } else {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                }
            });

        if (response) {
            console.log(response.data);
            setRows(response.data);
            setTotalRows(response.metadata.count);
        }

        setPending(false);
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
                dateCreated && ConvertISO(dateCreated).startDate,
                dateCreated && ConvertISO(dateCreated).endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
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
                dateCreated && ConvertISO(dateCreated).startDate,
                dateCreated && ConvertISO(dateCreated).endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
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
                dateCreated && ConvertISO(dateCreated).startDate,
                dateCreated && ConvertISO(dateCreated).endDate,
                selectedCustomer.length > 0 && returnArray(selectedCustomer),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
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
                    dateCreated && ConvertISO(dateCreated).startDate,
                    dateCreated && ConvertISO(dateCreated).endDate,
                    selectedCustomer.length > 0 && returnArray(selectedCustomer),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {/* <div className={cx('tool-bar')}>
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
                </div> */}

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn hàng, tên khách hàng'
                    }
                    search={search}
                    handleSearch={handleSearch}
                    handleKeyDown={handleKeyDown}
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

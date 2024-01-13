import { useCallback, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ListReturn.module.scss';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ReturnItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

import { ToastContext } from '~/components/ToastContext';

import * as returnServices from '~/apiServices/returnServices';
import * as staffServices from '~/apiServices/staffServices';

import { ConvertISO } from '~/components/ConvertISO';

const cx = classNames.bind(styles);

function ListReturn() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('returnOrderId');
    const [orderBy, setOrderBy] = useState('asc');

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        startDate,
        endDate,
        staffIds,
        query,
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(staffIds && { staffIds }),
            ...(query && { query }),
        };
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
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }
    }

    // FILTER OPTIONS
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedStaff, setSelectedStaff] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
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
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
            )
        );

        handleCloseFilter();
    };

    // GET DATA MANUFACTURERS
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
        getStaff();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/return/detail/' + row.returnOrderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const getList = async (obj) => {
        setPending(true);

        const response = await returnServices.getAllReturns(obj)
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
                dateCreated && ConvertISO(dateCreated).startDate,
                dateCreated && ConvertISO(dateCreated).endDate,
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
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }

        setPending(true);
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {/* <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faDownload} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Xuất file
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/return/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn trả hàng
                        </Button>
                    </div>
                </div> */}

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn trả hàng, mã đơn hàng'
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
                                setDateString={setDateCreated}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsStaff}
                                placeholder={'Nhà cung cấp'}
                                selected={selectedStaff}
                                setSelected={setSelectedStaff}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    onRowClicked={onRowClicked}
                    pagination
                    itemComponent={ReturnItem}
                    data={rows}
                    pending={pending}
                    // PAGINATION
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                    // SORT
                    handleSort={handleSort}
                />
            </div>
        </div>
    );
}

export default ListReturn;

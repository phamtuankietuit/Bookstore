import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';

import styles from './ActivityHistory.module.scss';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ActivityItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import { ConvertISO } from '~/components/ConvertISO';

import * as ActivityServices from '~/apiServices/ActivityServices';
import * as staffServices from '~/apiServices/staffServices';

import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đăng nhập', value: 'log_in' },
    { label: 'Thêm mới', value: 'create' },
    { label: 'Cập nhật', value: 'update' },
    { label: 'Đã xóa', value: 'delete' },
];

function ActivityHistory() {
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        startDate,
        endDate,
        activityTypes,
        staffIds,
        query,
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(activityTypes && { activityTypes }),
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
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }
    }

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // FILTER OPTIONS
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);


    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
            )
        );

        handleCloseFilter();
    };

    // GET DATA STAFFS
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


    // TABLE
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [orderBy, setOrderBy] = useState('desc');

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const getList = async (obj) => {
        setPending(true);

        const response = await ActivityServices.getAllActivity(obj)
            .catch((error) => {
                setPending(false);

                if (error?.response?.status === 404) {
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
                selectedTT.length > 0 && returnArray(selectedTT),
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
            )
        )
    }

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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedStaff.length > 0 && returnArray(selectedStaff),
                search,
            )
        );
    };


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
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedStaff.length > 0 && returnArray(selectedStaff),
                    search,
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo người thao tác, mã chứng từ'}
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
                                title={'Thời gian'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsStaff}
                                placeholder={'Người thao tác'}
                                selected={selectedStaff}
                                setSelected={setSelectedStaff}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Thao tác'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    itemComponent={ActivityItem}
                    data={rows}
                    pending={pending}
                    pagination
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

export default ActivityHistory;

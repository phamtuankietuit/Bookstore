import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListCheck.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { CheckItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import { ConvertISO } from '~/components/ConvertISO';

import { ToastContext } from '~/components/ToastContext';

import * as checkServices from '~/apiServices/checkServices';
import * as staffServices from '~/apiServices/staffServices';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã cân bằng', value: 'adjusted' },
    { label: 'Đang kiểm kho', value: 'unadjusted' },
    { label: 'Đã xóa', value: 'cancelled' },
];

function ListCheck() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('');
    const [orderBy, setOrderBy] = useState('');

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        query,
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
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
            setSortBy('');
            setOrderBy('');

            getList(
                await createObjectQuery(
                    1,
                    pageSize,
                    '',
                    '',
                    dateCreated && ConvertISO(dateCreated).startDate,
                    dateCreated && ConvertISO(dateCreated).endDate,
                    dateBalanced && ConvertISO(dateBalanced).startDate,
                    dateBalanced && ConvertISO(dateBalanced).endDate,
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                    selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
                    search,
                )
            );
        }
    }

    // FILTER OPTIONS
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedCreatedStaff, setSelectedCreatedStaff] = useState([]);
    const [selectedBalancedStaff, setSelectedBalancedStaff] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // DATE BALANCED
    const [dateBalanced, setDateBalanced] = useState('');


    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedCreatedStaff([]);
        setSelectedBalancedStaff([]);
        setDateCreated('');
        setDateBalanced('');
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
                dateBalanced && ConvertISO(dateBalanced).startDate,
                dateBalanced && ConvertISO(dateBalanced).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
                search,
            )
        );

        handleCloseFilter();
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
            const data = await response.data.map((staff) => ({ label: staff.name, value: staff.staffId }));
            setOptionsStaff(data);
        }
    };

    // GET DATA FOR FILTER
    useEffect(() => {
        getStaff();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/checks/detail/' + row.adjustmentTicketId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const getList = async (obj) => {
        setPending(true);

        const response = await checkServices.getChecks(obj)
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
                dateBalanced && ConvertISO(dateBalanced).startDate,
                dateBalanced && ConvertISO(dateBalanced).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
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
                dateBalanced && ConvertISO(dateBalanced).startDate,
                dateBalanced && ConvertISO(dateBalanced).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
                search,
            )
        );
    }

    // SORT
    const handleSort = async (column, sortDirection) => {
        if (column.text === undefined || sortDirection === undefined) {
            return;
        }

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
                dateBalanced && ConvertISO(dateBalanced).startDate,
                dateBalanced && ConvertISO(dateBalanced).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
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
                    dateBalanced && ConvertISO(dateBalanced).startDate,
                    dateBalanced && ConvertISO(dateBalanced).endDate,
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedCreatedStaff.length > 0 && returnArray(selectedCreatedStaff),
                    selectedBalancedStaff.length > 0 && returnArray(selectedBalancedStaff),
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
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}></div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/checks/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn kiểm hàng
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo mã đơn kiểm hàng'}
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
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                            <DateRange
                                title={'Ngày tạo'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                                bottom
                            />
                            <DateRange
                                title={'Ngày cân bằng'}
                                className={cx('m-b')}
                                dateString={dateBalanced}
                                setDateString={setDateBalanced}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsStaff}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedCreatedStaff}
                                setSelected={setSelectedCreatedStaff}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsStaff}
                                placeholder={'Nhân viên cân bằng'}
                                selected={selectedBalancedStaff}
                                setSelected={setSelectedBalancedStaff}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    onRowClicked={onRowClicked}
                    itemComponent={CheckItem}
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

export default ListCheck;

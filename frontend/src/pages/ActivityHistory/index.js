import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ActivityHistory.module.scss';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ActivityItem } from '~/components/Item';
import { data12 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import * as ActivityServices from '~/apiServices/ActivityServices';
import { ToastContext } from '~/components/ToastContext';
const cx = classNames.bind(styles);

const optionsNVT = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: 'staf00000' },
    { label: 'Ngô Trung Quân', value: 'staf00001' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

const optionsTT = [
    { label: 'Đăng nhập', value: 'log_in' },
    { label: 'Thêm mới', value: 'create' },
    { label: 'Cập nhật', value: '2' },
    { label: 'Đã xóa', value: 'delete' },
];

function ActivityHistory() {
    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedNVT([]);
        setSelectedTT([]);
        setDateCreated('');
    };

    const handleFilter = async () => {
        setPageNumber(1)
        getList(
            await createObjectQuery(
                1,
                pageSize,
                sortBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedNVT.length > 0 && returnArray(selectedNVT),

            )
        );
        handleCloseFilter();
    };

    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNVT, setSelectedNVT] = useState([]);
    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // TABLE
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('activityId');
    const [orderBy, setOrderBy] = useState('asc');
    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        activityTypes,
        staffIds
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
            ...(activityTypes && { activityTypes }),
            ...(staffIds && { staffIds }),
        };
    }

    const getList = async (obj) => {
        setPending(true);

        const response = await ActivityServices.getAllActivity(obj)
            .catch((error) => {
                setPending(false);

                if (error.response.status === 404) {
                    setRows([]);
                    setTotalRows(0);
                    setClear(false);
                } else {
                    // toastContext.notify('error', 'Có lỗi xảy ra');
                }
            });

        if (response) {
            console.log(response.data);
            setPending(false);
            setRows(response.data);
            setTotalRows(response.metadata.count);
            setClear(false);
        }
    }

    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPageSize(newPerPage);
        setPageNumber(pageNumber);

        getList(
            await createObjectQuery(
                pageNumber,
                pageSize,
                sortBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedNVT.length > 0 && returnArray(selectedNVT),


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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedNVT.length > 0 && returnArray(selectedNVT),

            )
        )
    }
    const handleSort = (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(1, pageSize, column.text, sortDirection);
    };
    useEffect(() => {
        const fetch = async () => {
            getList(await createObjectQuery(pageNumber, pageSize));
        }

        fetch();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo người thao tác, mã chứng từ'}
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
                                title={'Thời gian'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVT}
                                placeholder={'Người thao tác'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
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

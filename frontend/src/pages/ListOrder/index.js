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
import * as SaleServices from '~/apiServices/saleServices';
import { ToastContext } from '~/components/ToastContext';
const cx = classNames.bind(styles);

const optionsNVT = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

const optionsKH = [
    { label: 'Nguyễn Thị Cẩm Nhung', value: '0' },
    { label: 'Phạm Văn Thái', value: '1' },
    { label: 'Cẩm Lệ', value: '2' },
    { label: 'Chu Văn Sa', value: '3' },
];

function ListOrder() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext)

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
        setSelectedNVT([]);
        setSelectedKH([]);
        setDateCreated('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedNVT, setSelectedNVT] = useState([]);
    const [selectedKH, setSelectedKH] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/orders/detail/' + row.salesOrderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    // TABLE
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('salesOrderId');
    const [orderBy, setOrderBy] = useState('asc');

    const getList = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
    ) => {
        const props = {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
        };

        if (!sortBy) {
            setSortBy('salesOrderId');
        }

        if (!orderBy) {
            setOrderBy('asc');
        }

        setPending(true);

        const response = await SaleServices.getAllSalesOrders(props)
            .catch((error) => {
                setPending(false);

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
                toastContext.notify('error', 'Có lỗi xảy ra');
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

        getList(pageNumber, newPerPage, sortBy, orderBy);
    }

    const handlePageChange = (pageNumber) => {
        setPageNumber(pageNumber);

        getList(pageNumber, pageSize, sortBy, orderBy);
    }

    const handleSort = (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(1, pageSize, column.text, sortDirection);
    };

    useEffect(() => {
        getList(pageNumber, pageSize);
    }, []);
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
                                setDateString={setDateCreated}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsKH}
                                placeholder={'Khách hàng'}
                                selected={selectedKH}
                                setSelected={setSelectedKH}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVT}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
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
                    // SORT
                    handleSort={handleSort}
                />
            </div>
        </div>
    );
}

export default ListOrder;

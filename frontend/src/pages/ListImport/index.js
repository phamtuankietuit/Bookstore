import { useCallback, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListImport.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ImportItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import * as PurchaseorderServices from '~/apiServices/purchaseorderServies';
import { ToastContext } from '~/components/ToastContext';
const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã thanh toán', value: '0' },
    { label: 'Chưa thanh toán', value: '1' },
];

const optionsNCC = [
    { label: 'Văn phòng phẩm Khê Lương', value: '0' },
    { label: 'Nhà sách An Hòa Phát', value: '1' },
    { label: 'Thiên Long', value: '2' },
    { label: 'Thiết bị văn phòng Nguyễn An', value: '3' },
];

const optionsNV = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

function ListImport() {
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
        setSelectedTT([]);
        setSelectedNCC([]);
        setSelectedNV([]);
        setDateString('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNCC, setSelectedNCC] = useState([]);
    const [selectedNV, setSelectedNV] = useState([]);

    // DATE RANGE PICKER
    const [dateString, setDateString] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/imports/detail/' + row.purchaseOrderId);
    }, []);

    // TABLE
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('purchaseOrderId');
    const [orderBy, setOrderBy] = useState('asc');


    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    const getList = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        supplierIds,
    ) => {
        const props = {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(supplierIds && { supplierIds }),
        };

        if (!sortBy) {
            setSortBy('purchaseOrderId');
        }

        if (!orderBy) {
            setOrderBy('asc');
        }

        setPending(true);

        const response = await PurchaseorderServices.getAllPurchaseOrders(props)
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
                    <div className={cx('tool-bar-left')}></div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/imports/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn nhập hàng
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn nhập, mã nhà cung cấp'
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
                                title={'Ngày nhập hàng'}
                                className={cx('m-b')}
                                dateString={dateString}
                                setDateString={setDateString}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNCC}
                                placeholder={'Nhà cung cấp'}
                                selected={selectedNCC}
                                setSelected={setSelectedNCC}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNV}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNV}
                                setSelected={setSelectedNV}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    pagination
                    onRowClicked={onRowClicked}
                    itemComponent={ImportItem}
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

export default ListImport;

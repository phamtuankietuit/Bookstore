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
import { ToastContext } from '~/components/ToastContext';

import * as PurchaseorderServices from '~/apiServices/purchaseorderServies';
import * as supplierServices from '~/apiServices/supplierServices';
import * as staffServices from '~/apiServices/staffServices';
import { ConvertISO } from '~/components/ConvertISO';
const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã thanh toán', value: 'paid' },
    { label: 'Chưa thanh toán', value: 'unpaid' },
];

function ListImport() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('purchaseOrderId');
    const [orderBy, setOrderBy] = useState('asc');

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        startDate,
        endDate,
        status,
        supplierIds,
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
            ...(status && { status }),
            ...(supplierIds && { supplierIds }),
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
                    dateString && ConvertISO(dateString).startDate,
                    dateString && ConvertISO(dateString).endDate,
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedSupplier.length > 0 && returnArray(selectedTT),
                    selectedTT.length > 0 && returnArray(selectedTT),
                    search,
                )
            );
        }
    }

    // FILTER OPTIONS
    const [optionsSupplier, setOptionsSupplier] = useState([]);
    const [optionsStaff, setOptionsStaff] = useState([]);

    // FILTER SELECTED
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState([]);

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedSupplier([]);
        setSelectedStaff([]);
        setDateString('');
    };

    const handleFilter = async () => {
        setPageNumber(1);

        getList(
            await createObjectQuery(
                1,
                pageSize,
                sortBy,
                orderBy,
                dateString && ConvertISO(dateString).startDate,
                dateString && ConvertISO(dateString).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplier.length > 0 && returnArray(selectedTT),
                selectedTT.length > 0 && returnArray(selectedTT),
                search,
            )
        );

        handleCloseFilter();
    };

    // GET DATA SUPPLIERS
    const getSup = async () => {
        const response = await supplierServices.getAllSuppliers(1, -1)
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
            const data = await response.data.map((sup) => ({ label: sup.name, value: sup.supplierId }));
            setOptionsSupplier(data);
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
            const data = await response.data.map((staff) => ({ label: staff.name, value: staff.staffId }));
            setOptionsStaff(data);
        }
    };

    // GET DATA FOR FILTER
    useEffect(() => {
        getSup();
        getStaff();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);

    // DATE RANGE PICKER
    const [dateString, setDateString] = useState('');


    const handleSetDate = (str) => {
        setDateString(str);
    }


    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/imports/detail/' + row.purchaseOrderId);
    }, []);

    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const getList = async (obj) => {

        console.log('run getList', obj);

        setPending(true);

        const response = await PurchaseorderServices.getAllPurchaseOrders(obj)
            .catch((error) => {
                setPending(false);

                if (error.response.status === 404) {
                    setRows([]);
                    setTotalRows(0);
                    setClear(false);
                } else {
                    toastContext.notify('error', 'Có lỗi xảy ra');
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
                newPerPage,
                sortBy,
                orderBy,
                dateString && ConvertISO(dateString).startDate,
                dateString && ConvertISO(dateString).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplier.length > 0 && returnArray(selectedTT),
                selectedTT.length > 0 && returnArray(selectedTT),
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
                dateString && ConvertISO(dateString).startDate,
                dateString && ConvertISO(dateString).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplier.length > 0 && returnArray(selectedTT),
                selectedTT.length > 0 && returnArray(selectedTT),
                search,
            )
        );
    }

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const handleSort = async (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(
            await createObjectQuery(
                pageNumber,
                pageSize,
                column.text,
                sortDirection,
                dateString && ConvertISO(dateString).startDate,
                dateString && ConvertISO(dateString).endDate,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplier.length > 0 && returnArray(selectedTT),
                selectedTT.length > 0 && returnArray(selectedTT),
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
                    dateString && ConvertISO(dateString).startDate,
                    dateString && ConvertISO(dateString).endDate,
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedSupplier.length > 0 && returnArray(selectedTT),
                    selectedTT.length > 0 && returnArray(selectedTT),
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
                                title={'Ngày nhập hàng'}
                                className={cx('m-b')}
                                dateString={dateString}
                                setDateString={(str) => handleSetDate(str)}
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
                                options={optionsSupplier}
                                placeholder={'Nhà cung cấp'}
                                selected={selectedSupplier}
                                setSelected={setSelectedSupplier}
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
                    clearSelectedRows={clear}
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

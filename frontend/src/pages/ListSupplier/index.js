import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faListUl,
    faPlus,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './ListSupplier.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { SupplierItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as supplierServices from '~/apiServices/supplierServices';
import * as supplierGroupServices from '~/apiServices/supplierGroupServices';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang giao dịch', value: true },
    { label: 'Ngừng giao dịch', value: false },
];

function ListSupplier() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [orderBy, setOrderBy] = useState('');

    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        isActive,
        supplierGroupId,
        query,
    ) => {

        clearSubHeader();

        let arr = [];
        if (isActive) {
            if (isActive.length < 2) {
                arr = [...isActive];
            }
        }

        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
            ...(isActive && { isActive: arr }),
            ...(supplierGroupId && { supplierGroupId }),
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
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
                    search,
                )
            );
        }
    }

    // FILTER OPTIONS
    const [optionsSupplierGroups, setOptionsSupplierGroups] = useState([]);
    // FILTER SELECTED
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedSupplierGroups, setSelectedSupplierGroups] = useState([]);
    // FILTER  
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedSupplierGroups([]);
    };

    const handleFilter = async () => {
        setPageNumber(1);

        getList(
            await createObjectQuery(
                1,
                pageSize,
                sortBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
                search,
            )
        );

        handleCloseFilter();
    };

    // GET SUPPLIER GROUPS
    const getSupGroup = async () => {
        const response = await supplierGroupServices.getSupplierGroups(
            {
                pageNumber: 1,
                pageSize: -1,
            }
        )
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
            const data = await response.data.map((item) => ({ label: item.name, value: item.supplierGroupId }));
            setOptionsSupplierGroups(data);
        }
    };

    // GET DATA FILTER
    useEffect(() => {
        getSupGroup();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);


    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    const [showSubHeader, setShowSubHeader] = useState(false);
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedDelRows, setSelectedDelRows] = useState();

    const handleSelectedProducts = ({
        allSelected,
        selectedCount,
        selectedRows,
    }) => {
        selectedCount > 0 ? setShowSubHeader(true) : setShowSubHeader(false);
        setSelectedRow(selectedCount);
        setSelectedDelRows(selectedRows);
    };

    // CLEAR SUB HEADER
    const clearSubHeader = () => {
        setShowSubHeader(false);
        setSelectedRow(0);
        setClear(true);
    }

    // SUB HEADER
    const onClickAction = (value) => {
        if (value === 'Đang giao dịch') {
            onOpenModal('Cập nhật trạng thái?');
        } else if (value === 'Ngừng giao dịch') {
            onOpenModal('Ngừng giao dịch?');
        } else {
            onOpenModal('Xóa nhà cung cấp?');
        }
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/suppliers/detail/' + row.supplierId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL
    const [titleModal, setTitleModal] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleValidation = async () => {
        if (titleModal === 'Xóa nhà cung cấp?') {

            setLoading(true);

            let isSuccess = true;

            const response = await supplierServices.deleteSupplier(selectedDelRows)
                .catch((error) => {
                    setLoading(false);
                    isSuccess = false;
                    toastContext.notify('error', 'Có lỗi xảy ra');

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

            if (isSuccess) {
                setLoading(false);
                toastContext.notify('success', 'Xóa nhà cung cấp thành công');
                handleCloseModal();
                clearSubHeader();
                setUpdateList(new Date());
            }
        }
    };

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };

    const getList = async (obj) => {
        setPending(true);

        const response = await supplierServices.getSuppliers(obj)
            .catch((error) => {
                setPending(false);

                if (error?.response?.status === 404) {
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

    // REMOTE PAGINATION
    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPageSize(newPerPage);
        setPageNumber(pageNumber);

        getList(
            await createObjectQuery(
                pageNumber,
                newPerPage,
                sortBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
                search,
            )
        );
    }

    // REMOTE SORT
    const handleSort = async (column, sortDirection) => {
        if (column.text === undefined || sortDirection === undefined) {
            return;
        }
        setPageNumber(1);
        setSortBy(column.text);
        setOrderBy(sortDirection);

        getList(
            await createObjectQuery(
                1,
                pageSize,
                column.text,
                sortDirection,
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
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
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedSupplierGroups.length > 0 && returnArray(selectedSupplierGroups),
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
                    <div className={cx('tool-bar-left')}>
                        {/* <Button
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
                        </Button> */}
                        <Button
                            to="/suppliers/group"
                            leftIcon={<FontAwesomeIcon icon={faListUl} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Nhóm nhà cung cấp
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/suppliers/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Thêm nhà cung cấp
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã, tên nhà cung cấp'
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
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsSupplierGroups}
                                placeholder={'Nhóm nhà cung cấp'}
                                selected={selectedSupplierGroups}
                                setSelected={setSelectedSupplierGroups}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    clearSelectedRows={clear}
                    selectableRows
                    pagination
                    onRowClicked={onRowClicked}
                    showSubHeader={showSubHeader}
                    itemComponent={SupplierItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'nhà cung cấp'}
                            onClickAction={onClickAction}
                            items={[
                                'Xóa nhà cung cấp',
                            ]}
                        />
                    }
                    // PAGINATION
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                    // SORT
                    handleSort={handleSort}
                />
            </div>
            <ModalComp
                open={openModal}
                handleClose={handleCloseModal}
                title={titleModal}
                actionComponent={
                    <div>
                        <Button
                            className={cx('btn-cancel')}
                            outlineBlue={titleModal !== 'Xóa nhà cung cấp?'}
                            outlineRed={titleModal === 'Xóa nhà cung cấp?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa nhà cung cấp?'}
                            solidRed={titleModal === 'Xóa nhà cung cấp?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Xóa nhà cung cấp?' ? 'Xóa' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Cập nhật trạng thái?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ cập nhật trạng thái đang giao dịch cho
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
                {titleModal === 'Ngừng giao dịch?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ ngừng giao dịch cho
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
                {titleModal === 'Xóa nhà cung cấp?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}
export default ListSupplier;

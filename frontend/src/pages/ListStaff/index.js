import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './ListStaff.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { StaffItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

import * as StaffServices from '~/apiServices/staffServices';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang làm việc', value: true },
    { label: 'Đã nghỉ việc', value: false },
];

const optionsVT = [
    { label: 'Nhân viên bán hàng', value: 'sale' },
    { label: 'Nhân viên kho', value: 'warehouse' },
    { label: 'Quản lý', value: 'admin' },
];

function ListStaff() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('staffId');
    const [orderBy, setOrderBy] = useState('asc');

    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
        };
    }

    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedVT, setSelectedVT] = useState([]);

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedVT([]);
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
                selectedVT.length > 0 && returnArray(selectedVT),

            )
        );
        handleCloseFilter();
    };

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const [showSubHeader, setShowSubHeader] = useState(true);
    const [selectedRow, setSelectedRow] = useState(0);

    const handleSelectedProducts = ({
        allSelected,
        selectedCount,
        selectedRows,
    }) => {
        selectedCount > 0 ? setShowSubHeader(true) : setShowSubHeader(false);
        setSelectedRow(selectedCount);
        setSelectedDelRows(selectedRows);
    };

    // SUB HEADER
    const onClickAction = (value) => {
        if (value === 'Đang làm việc') {
            onOpenModal('Cập nhật trạng thái?');
        } else if (value === 'Đã nghỉ việc') {
            onOpenModal('Đã nghỉ việc?');
        } else {
            onOpenModal('Xóa nhân viên?');
        }
    };

    const [selectedDelRows, setSelectedDelRows] = useState();

    // CLEAR SUB HEADER
    const clearSubHeader = () => {
        setShowSubHeader(false);
        setSelectedRow(0);
        setClear(true);
    }

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        if (row.role !== 'admin') {
            navigate('/staffs/detail/' + row.staffId);
        }
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

    const handleValidation = () => {
        if (titleModal === 'Xóa nhân viên?') {
            let isSuccess = true;

            // XÓA NHÂN VIÊN
            const fetchApi = async () => {
                setLoading(true);

                const result = await StaffServices.deleteStaffs(selectedDelRows)
                    .catch((error) => {
                        isSuccess = false;
                        setLoading(false);
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);

                            if (error.response.status === 403) {
                                toastContext.notify('error', 'Không thể xóa admin');
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        } else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    });

                if (result) {
                    setLoading(false);
                    result.map((staff) => {
                        if (staff.status === 204) {
                            toastContext.notify('success', 'Xóa thành công nhân viên ' + staff.data.name);
                        } else if (staff.status === 403) {
                            toastContext.notify('error', 'Không thể xóa admin ' + staff.data.name);
                        } else {
                            toastContext.notify('error', 'Có lỗi xảy ra khi xóa nhân viên ' + staff.data.name);
                        }
                    });
                } else if (isSuccess) {
                    setLoading(false);
                    handleCloseModal();
                    toastContext.notify('success', 'Xóa nhân viên thành công');
                    clearSubHeader();
                    setUpdateList(new Date());
                }
            }
            fetchApi();
        }
    };

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };


    const getList = async (obj) => {
        setPending(true);

        const response = await StaffServices.getAllStaffs(obj)
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedVT.length > 0 && returnArray(selectedVT),
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
                selectedVT.length > 0 && returnArray(selectedVT),
            )
        );
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedVT.length > 0 && returnArray(selectedVT),
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
                    selectedVT.length > 0 && returnArray(selectedVT),
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);


    const selectableRowDisabled = (row) => row.role === 'admin';

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}></div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/staffs/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Thêm nhân viên
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã, tên, số điện thoại nhân viên'
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
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsVT}
                                placeholder={'Vai trò'}
                                selected={selectedVT}
                                setSelected={setSelectedVT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    selectableRows
                    pagination
                    onRowClicked={onRowClicked}
                    showSubHeader={showSubHeader}
                    itemComponent={StaffItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'nhân viên'}
                            onClickAction={onClickAction}
                            items={[
                                'Xóa nhân viên',
                            ]}
                        />
                    }
                    clearSelectedRows={clear}
                    // PAGINATION
                    totalRows={totalRows}
                    handlePerRowsChange={handlePerRowsChange}
                    handlePageChange={handlePageChange}
                    // SORT
                    handleSort={handleSort}
                    // 
                    selectableRowDisabled={selectableRowDisabled}
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
                            outlineBlue={titleModal !== 'Xóa nhân viên?'}
                            outlineRed={titleModal === 'Xóa nhân viên?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa nhân viên?'}
                            solidRed={titleModal === 'Xóa nhân viên?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Xóa nhân viên?' ? 'Xóa' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Cập nhật trạng thái?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ cập nhật trạng thái{' '}
                        <strong>đang làm việc</strong> cho
                        <strong> {selectedRow}</strong> nhân viên bạn đã chọn
                    </div>
                )}
                {titleModal === 'Đã nghỉ việc?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ <strong>đã nghỉ việc</strong> cho
                        <strong> {selectedRow}</strong> nhân viên bạn đã chọn
                    </div>
                )}
                {titleModal === 'Xóa nhân viên?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ <strong>xóa</strong>
                        <strong> {selectedRow}</strong> nhân viên bạn đã chọn
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}
export default ListStaff;

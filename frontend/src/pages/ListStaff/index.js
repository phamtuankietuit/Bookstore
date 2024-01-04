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
import { data11 } from '~/components/Table/sample';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import * as StaffServices from '~/apiServices/staffServices';
import { ToastContext } from '~/components/ToastContext';
const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang làm việc', value: '0' },
    { label: 'Đã nghỉ việc', value: '1' },
];

const optionsVT = [
    { label: 'Nhân viên bán hàng', value: 'sale' },
    { label: 'Nhân viên kho', value: 'warehouse' },
    { label: 'Quản lý', value: 'admin' },
];

function ListStaff() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext)
    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('promotionId');
    const [orderBy, setOrderBy] = useState('asc');
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
    useEffect(() => {
        const fetch = async () => {
            getList(await createObjectQuery(pageNumber, pageSize));
        }

        fetch();
    }, []);


    const getList = async (obj) => {
        setPending(true);

        const response = await StaffServices.getAllStaff(obj)
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

            )
        );
    }

    const handleSort = (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(1, pageSize, column.text, sortDirection);
    };

    const [showSubHeader, setShowSubHeader] = useState(true);
    const [selectedRow, setSelectedRow] = useState(0);

    const handleSelectedProducts = ({
        allSelected,
        selectedCount,
        selectedRows,
    }) => {
        selectedCount > 0 ? setShowSubHeader(true) : setShowSubHeader(false);
        setSelectedRow(selectedCount);
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

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/staffs/detail/' + row.staffId);
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

    const handleValidation = () => { };

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };

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
                                'Đang làm việc',
                                'Đã nghỉ việc',
                                'Xóa nhân viên',
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

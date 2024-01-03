import { useState, useEffect, useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faPlus,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './ListCustomer.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { CustomerItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as customerServices from '~/apiServices/customerServices';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang giao dịch', value: true },
    { label: 'Ngừng giao dịch', value: false },
];

function ListCustomer() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortsBy, setSortsBy] = useState('customerId');
    const [orderBy, setOrderBy] = useState('asc');


    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        isActives,
    ) => {
        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
            ...(isActives && { isActives }),
        };
    }



    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [selectedTT, setSelectedTT] = useState([]);

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
    };

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const handleFilter = async () => {
        setPageNumber(1)
        getList(
            await createObjectQuery(
                1,
                pageSize,
                sortsBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
            )
        );

        handleCloseFilter();
    };

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

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
        if (value === 'Đang giao dịch') {
            onOpenModal('Cập nhật trạng thái?');
        } else if (value === 'Ngừng giao dịch') {
            onOpenModal('Ngừng giao dịch?');
        } else {
            onOpenModal('Xóa khách hàng?');
        }
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/customers/detail/' + row.customerId);
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

    const getList = async (obj) => {
        setPending(true);

        const response = await customerServices.getAllCustomers(obj)
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

    // SORT
    const handleSort = async (column, sortDirection) => {
        setSortsBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(
            await createObjectQuery(
                pageNumber,
                pageSize,
                column.text,
                sortDirection,
                selectedTT.length > 0 && returnArray(selectedTT),
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
                pageSize,
                sortsBy,
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
                sortsBy,
                orderBy,
                selectedTT.length > 0 && returnArray(selectedTT),
            )
        );

    }

    useEffect(() => {
        const fetch = async () => {
            getList(await createObjectQuery(pageNumber, pageSize));
        }

        fetch();
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
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/customers/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Thêm khách hàng
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã, tên, số điện thoại khách hàng'
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
                        </Filter>
                    }
                    // TABLE
                    selectableRows
                    pagination
                    onRowClicked={onRowClicked}
                    showSubHeader={showSubHeader}
                    itemComponent={CustomerItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'khách hàng'}
                            onClickAction={onClickAction}
                            items={[
                                'Xóa khách hàng',
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
                            outlineBlue={titleModal !== 'Xóa khách hàng?'}
                            outlineRed={titleModal === 'Xóa khách hàng?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa khách hàng?'}
                            solidRed={titleModal === 'Xóa khách hàng?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Xóa khách hàng?' ? 'Xóa' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Cập nhật trạng thái?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ cập nhật trạng thái đang giao dịch cho
                        <strong> {selectedRow}</strong> khách hàng bạn đã chọn
                    </div>
                )}
                {titleModal === 'Ngừng giao dịch?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ ngừng giao dịch cho
                        <strong> {selectedRow}</strong> khách hàng bạn đã chọn
                    </div>
                )}
                {titleModal === 'Xóa khách hàng?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> khách hàng bạn đã chọn
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}
export default ListCustomer;

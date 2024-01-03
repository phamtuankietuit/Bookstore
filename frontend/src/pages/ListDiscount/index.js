import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListDiscount.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { DiscountItem } from '~/components/Item';
import { data7 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import * as PromotionServices from '~/apiServices/promotionServices';
import { ToastContext } from '~/components/ToastContext';
const cx = classNames.bind(styles);

const optionsHL = [
    { label: 'Còn hiệu lực', value: '0' },
    { label: 'Hết hiệu lực', value: '1' },
];

const optionsTT = [
    { label: 'Đang chạy', value: '0' },
    { label: 'Tạm ngừng', value: '1' },
    { label: 'Đã hủy', value: '2' },
];

function ListDiscount() {
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
        setSelectedHL([]);
        setSelectedTT([]);
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedHL, setSelectedHL] = useState([]);
    const [selectedTT, setSelectedTT] = useState([]);

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/discounts/detail/' + row.promotionId);
    }, []);

    // TABLE
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('promotionId');
    const [orderBy, setOrderBy] = useState('asc');

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setRows(data7);
    //         setPending(false);
    //     }, 500);
    //     return () => clearTimeout(timeout);
    // }, []);
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
            setSortBy('promotionId');
        }

        if (!orderBy) {
            setOrderBy('asc');
        }

        setPending(true);

        const response = await PromotionServices.getAllPromotions(props)
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
        if (value === 'Kích hoạt') {
            onOpenModal('Kích hoạt khuyến mãi');
        } else if (value === 'Tạm ngừng') {
            onOpenModal('Tạm ngừng khuyến mãi');
        } else {
            onOpenModal('Hủy khuyến mãi?');
        }
    };

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
                            to="/discounts/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo khuyến mãi
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo mã, tên khuyến mãi'}
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
                                className={cx('m-b')}
                                options={optionsHL}
                                placeholder={'Hiệu lực thời gian'}
                                selected={selectedHL}
                                setSelected={setSelectedHL}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Tình trạng'}
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
                    itemComponent={DiscountItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'khuyến mãi'}
                            onClickAction={onClickAction}
                            items={['Kích hoạt', 'Tạm ngừng', 'Hủy']}
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
                            outlineBlue={titleModal !== 'Hủy khuyến mãi?'}
                            outlineRed={titleModal === 'Hủy khuyến mãi?'}
                            onClick={handleCloseModal}
                        >
                            Thoát
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Hủy khuyến mãi?'}
                            solidRed={titleModal === 'Hủy khuyến mãi?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Hủy khuyến mãi?' ? 'Hủy' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Kích hoạt khuyến mãi' && (
                    <div className={cx('info')}>
                        Bạn có muốn kích hoạt
                        <strong> {selectedRow}</strong> chương trình khuyến mãi
                        đã chọn?
                    </div>
                )}
                {titleModal === 'Tạm ngừng khuyến mãi' && (
                    <div className={cx('info')}>
                        Bạn có muốn tạm ngừng
                        <strong> {selectedRow}</strong> chương trình khuyến mãi
                        đã chọn? <br />
                        <span className={cx('red')}>Lưu ý:</span> chỉ tạm ngừng
                        các khuyến mãi đang chạy.
                    </div>
                )}
                {titleModal === 'Hủy khuyến mãi?' && (
                    <div className={cx('info')}>
                        Bạn có muốn hủy
                        <strong> {selectedRow}</strong> chương trình khuyến mãi
                        đã chọn?
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default ListDiscount;

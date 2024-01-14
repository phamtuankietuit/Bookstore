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
import MultiSelectComp from '~/components/MultiSelectComp';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import * as PromotionServices from '~/apiServices/promotionServices';

import { ToastContext } from '~/components/ToastContext';

const cx = classNames.bind(styles);

const optionsHL = [
    { label: 'Còn hiệu lực', value: false },
    { label: 'Hết hiệu lực', value: true },
];

const optionsTT = [
    { label: 'Đang chạy', value: 'running' },
    { label: 'Tạm ngừng', value: 'paused' },
    { label: 'Đã hủy', value: 'stopped' },
];

function ListDiscount() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [sortBy, setSortBy] = useState('');
    const [orderBy, setOrderBy] = useState('');

    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const createObjectQuery = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        statuses,
        isOutdated,
        query,
    ) => {

        let arr = [];
        if (isOutdated) {
            if (isOutdated.length < 2) {
                arr = [...isOutdated];
            }
        }

        return {
            pageNumber,
            pageSize,
            ...(orderBy && { orderBy }),
            ...(sortBy && { sortBy }),
            ...(statuses && { statuses }),
            ...(isOutdated && { isOutdated: arr }),
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
            setSortBy('');
            setOrderBy('');

            getList(
                await createObjectQuery(
                    1,
                    pageSize,
                    '',
                    '',
                    selectedTT.length > 0 && returnArray(selectedTT),
                    selectedHL.length > 0 && returnArray(selectedHL),
                    search,
                )
            );
        }
    }

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

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);
    const [showSubHeader, setShowSubHeader] = useState(false);
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

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/discounts/detail/' + row.promotionId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const [selectedHL, setSelectedHL] = useState([]);
    const [selectedTT, setSelectedTT] = useState([]);

    const handleClearFilter = () => {
        setSelectedHL([]);
        setSelectedTT([]);
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
                selectedHL.length > 0 && returnArray(selectedHL),
                search,
            )
        );

        handleCloseFilter();
    };

    // GET DATA
    const getList = async (obj) => {
        setPending(true);

        const response = await PromotionServices.getAllPromotions(obj)
            .catch((error) => {
                setPending(false);

                if (error?.response?.status === 404) {
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

    // REMOTE PAGINATION
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
                selectedHL.length > 0 && returnArray(selectedHL),
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
                selectedHL.length > 0 && returnArray(selectedHL),
                search,
            )
        );
    }

    // REMOTE SORT
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
                selectedTT.length > 0 && returnArray(selectedTT),
                selectedHL.length > 0 && returnArray(selectedHL),
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
                    selectedHL.length > 0 && returnArray(selectedHL),
                    search,
                ));
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
                            items={['Hủy']}
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
                        Bạn có muốn kích hoạt <b> {selectedRow}</b> chương trình khuyến mãi đã chọn?
                    </div>
                )}
                {titleModal === 'Tạm ngừng khuyến mãi' && (
                    <div className={cx('info')}>
                        Bạn có muốn tạm ngừng <b> {selectedRow}</b> chương trình khuyến mãi đã chọn? <br />
                        <span className={cx('red')}>Lưu ý:</span> chỉ tạm ngừng
                        các khuyến mãi đang chạy.
                    </div>
                )}
                {titleModal === 'Hủy khuyến mãi?' && (
                    <div className={cx('info')}>
                        Bạn có muốn hủy <b> {selectedRow}</b> chương trình khuyến mãi đã chọn?
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default ListDiscount;

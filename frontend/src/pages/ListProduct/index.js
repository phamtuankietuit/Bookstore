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

import styles from './ListProduct.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { ProductItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as productServices from '~/apiServices/productServices';
import * as typeProductServices from '~/apiServices/typeProductServices';
import * as supplierServices from '~/apiServices/supplierServices';


const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang giao dịch', value: true },
    { label: 'Ngừng giao dịch', value: false },
];

const optionsPriceRange = [
    { label: '0đ - 150,000đ', value: '0-150000' },
    { label: '150,000đ - 300,000đ', value: '150000-300000' },
    { label: '300,000đ - 500,000đ', value: '300000-500000' },
    { label: '500,000đ - 700,000đ', value: '500000-700000' },
    { label: '700,000đ - Trở lên', value: '700000-50000000' },
];

function ListProduct() {

    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);
    const [sortBy, setSortBy] = useState('productId');
    const [orderBy, setOrderBy] = useState('asc');

    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [optionsLSP, setOptionsLSP] = useState([]);
    const [optionsSupplier, setOptionsSupplier] = useState([]);
    const [optionsPublisher, setOptionsPublisher] = useState([]);
    const [optionsAuthor, setOptionsAuthor] = useState([]);
    const [optionsManufacturer, setOptionsManufacturer] = useState([]);

    // FILTER SELECTED
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState([]);
    const [selectedLSP, setSelectedLSP] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedPublisher, setSelectedPublisher] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState([]);

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedPriceRange([]);
        setSelectedLSP([]);
        setSelectedSupplier([]);
        setSelectedPublisher([]);
        setSelectedAuthor([]);
        setSelectedManufacturer([]);
    };


    const returnArray = (arr) => {
        return arr.map((obj) => obj.value);
    }

    const handleFilter = () => {
        getList(
            pageNumber,
            pageSize,
            sortBy,
            orderBy,
            selectedTT.length > 0 && returnArray(selectedTT),
            selectedPriceRange.length > 0 && returnArray(selectedPriceRange),
            selectedLSP.length > 0 && returnArray(selectedLSP),
            selectedSupplier.length > 0 && returnArray(selectedSupplier),
            selectedPublisher.length > 0 && returnArray(selectedPublisher),
            selectedAuthor.length > 0 && returnArray(selectedAuthor),
            selectedManufacturer.length > 0 && returnArray(selectedManufacturer),
        );

        console.log(selectedPriceRange);
    };

    // GET DATA CATES
    const getCate = async () => {
        const response = await typeProductServices.getAllProductTypes(1, -1)
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
            const data = await response.data.map((cate) => ({ label: cate.text, value: cate.categoryId }));
            setOptionsLSP(data);
        }
    }

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

    // GET DATA PUBLISHERS
    const getPub = async () => {
        const response = await productServices.getDetails('publisher')
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
            const data = await response.map((pub, index) => ({ label: pub, value: index }));
            setOptionsPublisher(data);
        }
    };

    // GET DATA AUTHORS
    const getAuth = async () => {
        const response = await productServices.getDetails('author')
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
            const data = await response.map((auth, index) => ({ label: auth, value: index }));
            setOptionsAuthor(data);
        }
    };

    // GET DATA MANUFACTURERS
    const getManu = async () => {
        const response = await productServices.getDetails('manufacturer')
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
            const data = await response.map((manu, index) => ({ label: manu, value: index }));
            setOptionsManufacturer(data);
        }
    };

    // GET DATA FOR FILTER
    useEffect(() => {
        getCate();
        getSup();
        getPub();
        getAuth();
        getManu();
        // eslint-disable-next-line no-use-before-define
    }, [openFilter]);


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
            onOpenModal('Xóa sản phẩm?');
        }
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/products/detail/' + row.productId);
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

    const getList = async (
        pageNumber,
        pageSize,
        sortBy,
        orderBy,
        isActives,
        priceRanges,
        categoryIds,
        supplierIds,
        publisherIds,
        authorIds,
        manufacturerIds,
    ) => {
        const props = {
            pageNumber,
            pageSize,
            ...(sortBy && { sortBy }),
            ...(orderBy && { orderBy }),
            ...(isActives && { isActives }),
            ...(priceRanges && { priceRanges }),
            ...(categoryIds && { categoryIds }),
            ...(supplierIds && { supplierIds }),
            ...(publisherIds && { publisherIds }),
            ...(authorIds && { authorIds }),
            ...(manufacturerIds && { manufacturerIds }),
        };

        if (!sortBy) {
            setSortBy('productId');
        }

        if (!orderBy) {
            setOrderBy('asc');
        }

        setPending(true);

        const response = await productServices.getAllProducts(props)
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

    // SORT
    const handleSort = (column, sortDirection) => {
        setSortBy(column.text);
        setOrderBy(sortDirection);
        setPageNumber(1);

        getList(1, pageSize, column.text, sortDirection);
    };

    // PAGINATION
    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPageSize(newPerPage);
        setPageNumber(pageNumber);

        getList(pageNumber, newPerPage, sortBy, orderBy);
    }

    const handlePageChange = (pageNumber) => {
        setPageNumber(pageNumber);

        getList(pageNumber, pageSize, sortBy, orderBy);
    }

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
                        <Button
                            to="/products/type"
                            leftIcon={<FontAwesomeIcon icon={faListUl} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Loại sản phẩm
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/products/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Thêm sản phẩm
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã sản phẩm, tên sản phẩm'
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
                                options={optionsPriceRange}
                                placeholder={'Giá bán'}
                                selected={selectedPriceRange}
                                setSelected={setSelectedPriceRange}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsLSP}
                                placeholder={'Loại sản phẩm'}
                                selected={selectedLSP}
                                setSelected={setSelectedLSP}
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
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsSupplier}
                                placeholder={'Nhà cung cấp'}
                                selected={selectedSupplier}
                                setSelected={setSelectedSupplier}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsManufacturer}
                                placeholder={'Thương hiệu'}
                                selected={selectedManufacturer}
                                setSelected={setSelectedManufacturer}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsPublisher}
                                placeholder={'Nhà xuất bản'}
                                selected={selectedPublisher}
                                setSelected={setSelectedPublisher}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsAuthor}
                                placeholder={'Tác giả'}
                                selected={selectedAuthor}
                                setSelected={setSelectedAuthor}
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
                    itemComponent={ProductItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'sản phẩm'}
                            onClickAction={onClickAction}
                            items={[
                                'Đang giao dịch',
                                'Ngừng giao dịch',
                                'Xóa sản phẩm',
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
                            outlineBlue={titleModal !== 'Xóa sản phẩm?'}
                            outlineRed={titleModal === 'Xóa sản phẩm?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa sản phẩm?'}
                            solidRed={titleModal === 'Xóa sản phẩm?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Xóa sản phẩm?' ? 'Xóa' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Cập nhật trạng thái?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ cập nhật trạng thái đang giao dịch cho
                        <strong> {selectedRow}</strong> sản phẩm bạn đã chọn
                    </div>
                )}
                {titleModal === 'Ngừng giao dịch?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ ngừng giao dịch cho
                        <strong> {selectedRow}</strong> sản phẩm bạn đã chọn
                    </div>
                )}
                {titleModal === 'Xóa sản phẩm?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> sản phẩm bạn đã chọn
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}
export default ListProduct;

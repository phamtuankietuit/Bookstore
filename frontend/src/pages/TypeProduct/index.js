import { useEffect, useState, useContext, useCallback } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './TypeProduct.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import { TypeProductItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import * as typeProductServices from '~/apiServices/typeProductServices';
import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

function TypeProduct() {
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());
    const [clear, setClear] = useState(false);

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
        query,
    ) => {

        clearSubHeader();

        return {
            pageNumber,
            pageSize,
            ...(query && { query }),
        };
    }

    // MODAL
    const [titleModal, setTitleModal] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);

    const handleCloseModal = () => {
        setErrorType('');
        setNameType('');
        setOpenModal(false);
    };

    const handleValidation = () => {
        if (titleModal === 'Thêm loại sản phẩm') {
            if (nameType === '') {
                setErrorType('Không được bỏ trống');
            } else {
                //    THÊM LOẠI SẢN PHẨM
                const fetchApi = async () => {
                    setLoading(true);

                    const result = await typeProductServices.createProductType(
                        {
                            text: nameType,
                            staffId: getLocalStorage().user.staffId,
                        }
                    )
                        .catch((error) => {
                            setLoading(false);
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
                            if (error.response.status === 409) {
                                toastContext.notify('error', 'Loại sản phẩm đã tồn tại');
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });

                    if (result) {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm loại sản phẩm thành công');
                        handleCloseModal();
                        clearSubHeader();
                        setUpdateList(new Date());
                    }
                }
                fetchApi();
            }
        } else if (titleModal === 'Xóa loại sản phẩm?') {

            let isSuccess = true;

            // XÓA LOẠI SẢN PHẨM
            const fetchApi = async () => {
                setLoading(true);

                const result = await typeProductServices.deleteProductType(selectedDelRows)
                    .catch((error) => {
                        isSuccess = false;
                        setLoading(false);
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);

                            if (error.response.status === 403) {
                                toastContext.notify('error', 'Không thể xóa loại sản phẩm mặc định');
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
                    result.map((type) => {
                        if (type.status === 204) {
                            toastContext.notify('success', 'Xóa thành công loại sản phẩm ' + type.data.text);
                        } else if (type.status === 403) {
                            toastContext.notify('error', 'Không thể xóa loại sản phẩm mặc định ' + type.data.text);
                        } else {
                            toastContext.notify('error', 'Có lỗi xảy ra khi xóa loại sản phẩm ' + type.data.text);
                        }
                    });
                } else if (isSuccess) {
                    setLoading(false);
                    handleCloseModal();
                    toastContext.notify('success', 'Xóa loại sản phẩm thành công');
                    clearSubHeader();
                    setUpdateList(new Date());
                }
            }
            fetchApi();
        } else {
            if (nameType === '') {
                setErrorType('Không được bỏ trống');
            } else {
                // CẬP NHẬT LOẠI SẢN PHẨM
                const fetchApi = async () => {
                    setLoading(true);

                    let isSuccess = true;

                    const result = await typeProductServices
                        .updateProductType(clickedRow.categoryId,
                            {
                                ...clickedRow,
                                text: nameType,
                            }
                        )
                        .catch((error) => {
                            setLoading(false);
                            isSuccess = false;
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
                            if (error.response.status === 409) {
                                toastContext.notify('error', 'Loại sản phẩm đã tồn tại');
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });

                    if (isSuccess) {
                        setLoading(false);
                        handleCloseModal();
                        toastContext.notify('success', 'Cập nhật loại sản phẩm thành công');
                        clearSubHeader();
                        setUpdateList(new Date());
                    }
                }

                fetchApi();
            }
        }
    };

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };

    const [nameType, setNameType] = useState('');
    const [errorType, setErrorType] = useState('');

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

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
                    search,
                )
            );
        }
    }

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
    const onClickAction = (index) => {
        onOpenModal('Xóa loại sản phẩm?');
    };

    // CLICK ROW
    const [clickedRow, setClickedRow] = useState();

    const onRowClicked = useCallback((row) => {
        if (Number(row.categoryId.slice(-5)) > 10) {
            setNameType(row.text);
            onOpenModal('Cập nhật loại sản phẩm');
            setClickedRow(row);
        }
    }, []);


    // FETCH 
    const getList = async (obj) => {
        setPending(true);

        const response = await typeProductServices.getAllProductTypes(obj)
            .catch((error) => {
                setPending(false);

                console.log(error);

                if (error?.response?.status === 404) {
                    setRows([]);
                    setTotalRows(0);
                    setClear(false);
                } else {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                }
            });

        if (response) {
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
                search,
            )
        );
    }

    useEffect(() => {
        const fetch = async () => {
            getList(
                await createObjectQuery(
                    pageNumber,
                    pageSize,
                    search,
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);

    const selectableRowDisabled = (row) => {
        return Number(row.categoryId.slice(-5)) <= 10;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <Button
                        solidBlue
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => onOpenModal('Thêm loại sản phẩm')}
                    >
                        Thêm loại sản phẩm
                    </Button>
                </div>
                <div className={cx('table')}>
                    <List
                        searchVisibility={true}
                        placeholderSearch={
                            'Tìm kiếm loại sản phẩm theo tên, mã loại'
                        }
                        search={search}
                        handleSearch={handleSearch}
                        handleKeyDown={handleKeyDown}
                        // TABLE
                        clearSelectedRows={clear}
                        onRowClicked={onRowClicked}
                        selectableRows
                        pagination
                        showSubHeader={showSubHeader}
                        itemComponent={TypeProductItem}
                        data={rows}
                        pending={pending}
                        handleSelectedItems={handleSelectedProducts}
                        subHeaderComponent={
                            <SubHeader
                                count={selectedRow}
                                itemName={'loại sản phẩm'}
                                onClickAction={onClickAction}
                                items={['Xóa loại sản phẩm']}
                            />
                        }
                        // PAGINATION REMOTE 
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}
                        // 
                        selectableRowDisabled={selectableRowDisabled}
                    />
                </div>
            </div>
            <ModalComp
                open={openModal}
                handleClose={handleCloseModal}
                title={titleModal}
                actionComponent={
                    <div>
                        <Button
                            className={cx('btn-cancel')}
                            outlineBlue={titleModal !== 'Xóa loại sản phẩm?'}
                            outlineRed={titleModal === 'Xóa loại sản phẩm?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa loại sản phẩm?'}
                            solidRed={titleModal === 'Xóa loại sản phẩm?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Thêm loại sản phẩm' && 'Thêm'}
                            {titleModal === 'Xóa loại sản phẩm?' && 'Xóa'}
                            {titleModal === 'Cập nhật loại sản phẩm' && 'Cập nhật'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Thêm loại sản phẩm' && (
                    <Input
                        title={'Tên loại sản phẩm'}
                        value={nameType}
                        onChange={(value) => setNameType(value)}
                        error={errorType}
                        required
                    />
                )}
                {titleModal === 'Xóa loại sản phẩm?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> loại sản phẩm bạn đã chọn
                    </div>
                )}
                {titleModal === 'Cập nhật loại sản phẩm' && (
                    <Input
                        title={'Tên loại sản phẩm'}
                        value={nameType}
                        onChange={(value) => setNameType(value)}
                        error={errorType}
                        required
                    />
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default TypeProduct;

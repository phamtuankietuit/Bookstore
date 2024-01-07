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

const cx = classNames.bind(styles);

function TypeProduct() {
    const [updateList, setUpdateList] = useState(new Date());

    const toastContext = useContext(ToastContext);

    // CLEAR SELECTED ROWS TABLE
    const [clear, setClear] = useState(false);

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

                    const result = await typeProductServices.createProductType({ text: nameType })
                        .catch((error) => {
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                // The request was made but no response was received
                                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                // http.ClientRequest in node.js
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            console.log(error.config);
                            if (error.response.status === 409) {
                                setLoading(false);
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

                    const result = await typeProductServices
                        .updateProductType(clickedRow.categoryId, { categoryId: clickedRow.categoryId, text: nameType })
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
                            toastContext.notify('error', 'Có lỗi xảy ra');
                        });

                    setLoading(false);
                    handleCloseModal();
                    toastContext.notify('success', 'Cập nhật loại sản phẩm thành công');
                    clearSubHeader();
                    setUpdateList(new Date());
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
            setPending(true);
            const response = await typeProductServices.getAllProductTypes(1, pageSize, search)
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
                setPending(false);
                setRows(response.data);
                setTotalRows(response.metadata.count);
                setClear(false);
            }
        }
    }

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    const [showSubHeader, setShowSubHeader] = useState(true);
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
    const getList = async (pageNumber) => {
        setPending(true);
        const response = await typeProductServices.getAllProductTypes(pageNumber, pageSize, '')
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
            setPending(false);
            setRows(response.data);
            setTotalRows(response.metadata.count);
            setClear(false);
        }
    }

    // PAGINATION REMOTE 
    const [totalRows, setTotalRows] = useState(0);

    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPending(true);
        const response = await typeProductServices.getAllProductTypes(pageNumber, newPerPage, '')
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
            setPending(false);
            setRows(response.data);
            setTotalRows(response.metadata.count);
            setPageSize(newPerPage);
            setClear(false);
        }
    }

    const handlePageChange = (pageNumber) => {
        getList(pageNumber);
    }

    const [pageSize, setPageSize] = useState(12);

    // CALL API
    useEffect(() => {
        getList(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);

    const selectableRowDisabled = (row) => {
        if (Number(row.categoryId.slice(-5)) <= 10) {
            return true;
        }
        return false;
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

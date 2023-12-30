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
                // POST

                const fetchApi = async () => {
                    setLoading(true);

                    const result = await typeProductServices.createProductType({ text: nameType })
                        .catch((error) => {
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
            // DELETE
            const fetchApi = async () => {
                setLoading(true);

                const result = await typeProductServices.deteleProductType(selectedDelRows)
                    .catch((error) => {
                        setLoading(false);
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
                    });

                if (result) {
                    setLoading(false);
                    Object.keys(result).forEach(function (key, index) {

                        const name = rows.find(obj => obj.categoryId === key).text;

                        if (result[key].includes('aborted')) {
                            toastContext.notify('error', 'Không thể xóa loại sản phẩm mặc định ' + name);
                        } else {
                            toastContext.notify('success', 'Xóa thành công loại sản phẩm ' + name);
                        }
                    });
                    handleCloseModal();
                    clearSubHeader();
                    setUpdateList(new Date());
                }
            }
            fetchApi();
        } else {
            // UPDATE
            console.log('update');
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

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        setNameType(row.text);
        onOpenModal('Cập nhật loại sản phẩm');
    }, []);


    // FETCH 
    const getList = async (pageNumber, pageSize) => {
        const response = await typeProductServices.getAllProductTypes(pageNumber, pageSize)
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
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (response) {
            setPending(false);
            setRows(response.result);
            setTotalRows(response.count);
            setClear(false);
        }
    }

    // PAGINATION REMOTE 
    const [totalRows, setTotalRows] = useState(0);

    const handlePerRowsChange = async (newPerPage, pageNumber) => {

        console.log(newPerPage, pageNumber);

        const response = await typeProductServices.getAllProductTypes(pageNumber, newPerPage)
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
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (response) {
            setPending(false);
            setRows(response.result);
            setTotalRows(response.count);
            setClear(false);
        }
    }

    const handlePageChange = (pageNumber) => {
        getList(pageNumber);
    }

    // CALL API
    useEffect(() => {
        getList(1, 12);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);

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
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
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

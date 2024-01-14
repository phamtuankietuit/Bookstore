import { useEffect, useState, useContext, useCallback } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListSupplierGroup.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import { SupplierGroupItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

import * as SuppliersServices from '~/apiServices/supplierServices';
import * as supplierGroupsServices from '~/apiServices/supplierGroupServices';

import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

function ListSupplierGroup() {
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);


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

    const [nameGroup, setNameGroup] = useState('');
    const [errorGroup, setErrorGroup] = useState('');

    const handleOpenModal = () => setOpenModal(true);

    const handleCloseModal = () => {
        setErrorGroup('');
        setNameGroup('');
        setOpenModal(false);
    };

    // CLEAR SUB HEADER
    const clearSubHeader = () => {
        setShowSubHeader(false);
        setSelectedRow(0);
        setClear(true);
    }

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };

    const handleValidation = () => {
        if (titleModal === 'Thêm nhóm nhà cung cấp') {
            if (nameGroup === '') {
                setErrorGroup('Không được bỏ trống');
            } else {
                //    THÊM NHÓM NHÀ CUNG CẤP
                const fetchApi = async () => {
                    setLoading(true);

                    const result = await supplierGroupsServices.CreateSupplierGroup
                        (
                            {
                                name: nameGroup,
                                staffId: getLocalStorage().user.staffId,
                                staffName: getLocalStorage().user.name,
                            }
                        )
                        .catch((error) => {
                            setLoading(false);
                            if (error.response.status === 409) {
                                toastContext.notify('error', 'Nhóm nhà cung cấp đã tồn tại');
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });

                    if (result) {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm nhóm nhà cung cấp thành công');
                        handleCloseModal();
                        clearSubHeader();
                        setUpdateList(new Date());
                    }
                }
                fetchApi();
            }
        } else if (titleModal === 'Xóa nhóm nhà cung cấp?') {
            let isSuccess = true;

            // XÓA NHÀ CUNG CẤP
            const fetchApi = async () => {
                setLoading(true);

                const result = await supplierGroupsServices.deleteSupplierGroups(selectedDelRows)
                    .catch((error) => {
                        isSuccess = false;
                        setLoading(false);
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);

                            if (error.response.status === 403) {
                                toastContext.notify('error', 'Không thể xóa nhóm nhà cung cấp mặc định');
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
                            toastContext.notify('success', 'Xóa thành công nhóm nhà cung cấp ' + type.data.name);
                        } else if (type.status === 403) {
                            toastContext.notify('error', 'Không thể xóa nhóm nhà cung cấp mặc định ' + type.data.name);
                        } else {
                            toastContext.notify('error', 'Có lỗi xảy ra khi xóa nhóm nhà cung cấp ' + type.data.name);
                        }
                    });
                } else if (isSuccess) {
                    setLoading(false);
                    handleCloseModal();
                    toastContext.notify('success', 'Xóa nhóm nhà cung cấp thành công');
                    clearSubHeader();
                    setUpdateList(new Date());
                }
            }
            fetchApi();
        } else {
            // CẬP NHẬT

            const fetchApi = async () => {
                setLoading(true);

                let isSuccess = true;

                const result = await supplierGroupsServices
                    .updateSupplierGroup(clickedRow.supplierGroupId,
                        {
                            ...clickedRow,
                            name: nameGroup,
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
                        isSuccess = false;
                        if (error.response.status === 409) {
                            toastContext.notify('error', 'Nhóm nhà cung cấp đã tồn tại');
                        } else {
                            toastContext.notify('error', 'Có lỗi xảy ra');
                        }
                    });

                if (isSuccess) {
                    setLoading(false);
                    handleCloseModal();
                    toastContext.notify('success', 'Cập nhật nhóm nhà cung cấp thành công');
                    clearSubHeader();
                    setUpdateList(new Date());
                }
            }

            fetchApi();
        }
    };

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

    // SUB HEADER
    const onClickAction = (index) => {
        onOpenModal('Xóa nhóm nhà cung cấp?');
    };


    const getList = async (obj) => {
        setPending(true);

        const response = await supplierGroupsServices.getSupplierGroups(obj)
            .catch((error) => {
                setPending(false);

                if (error.response.status === 404) {
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

    // PAGINATION
    const handlePerRowsChange = async (newPerPage, pageNumber) => {
        setPageSize(newPerPage);
        setPageNumber(pageNumber);

        console.log('handlePerRowsChange', newPerPage, pageNumber);

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
        if (Number(row.supplierGroupId.slice(-5)) === 0) {
            return true;
        }
        return false;
    }

    // CLICK ROW
    const [clickedRow, setClickedRow] = useState();

    const onRowClicked = useCallback((row) => {
        if (Number(row.supplierGroupId.slice(-5)) > 0) {
            setNameGroup(row.name);
            onOpenModal('Cập nhật nhóm nhà cung cấp');
            setClickedRow(row);
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <Button
                        solidBlue
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => onOpenModal('Thêm nhóm nhà cung cấp')}
                    >
                        Thêm nhóm nhà cung cấp
                    </Button>
                </div>
                <div className={cx('table')}>
                    <List
                        searchVisibility={true}
                        placeholderSearch={
                            'Tìm kiếm nhóm nhà cung cấp theo tên, mã nhóm'
                        }
                        search={search}
                        handleSearch={handleSearch}
                        // TABLE
                        selectableRows
                        pagination
                        showSubHeader={showSubHeader}
                        itemComponent={SupplierGroupItem}
                        onRowClicked={onRowClicked}
                        data={rows}
                        pending={pending}
                        handleSelectedItems={handleSelectedProducts}
                        subHeaderComponent={
                            <SubHeader
                                count={selectedRow}
                                itemName={'nhóm nhà cung cấp'}
                                onClickAction={onClickAction}
                                items={['Xóa nhóm nhà cung cấp']}
                            />
                        }
                        // 
                        clearSelectedRows={clear}
                        // PAGINATION REMOTE 
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}
                        selectableRowDisabled={selectableRowDisabled}
                        handleKeyDown={handleKeyDown}
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
                            outlineBlue={titleModal !== 'Xóa nhóm nhà cung cấp?'}
                            outlineRed={titleModal === 'Xóa nhóm nhà cung cấp?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok')}
                            solidBlue={titleModal !== 'Xóa nhóm nhà cung cấp?'}
                            solidRed={titleModal === 'Xóa nhóm nhà cung cấp?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Thêm nhóm nhà cung cấp' && 'Thêm'}
                            {titleModal === 'Xóa nhóm nhà cung cấp?' && 'Xóa'}
                            {titleModal === 'Cập nhật nhóm nhà cung cấp' && 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Thêm nhóm nhà cung cấp' && (
                    <Input
                        title={'Tên nhóm nhà cung cấp'}
                        value={nameGroup}
                        onChange={(value) => setNameGroup(value)}
                        error={errorGroup}
                        required
                    />
                )}
                {titleModal === 'Xóa nhóm nhà cung cấp?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> nhóm nhà cung cấp bạn đã chọn
                    </div>
                )}
                {titleModal === 'Cập nhật nhóm nhà cung cấp' && (
                    <Input
                        title={'Tên nhóm nhà cung cấp'}
                        value={nameGroup}
                        onChange={(value) => setNameGroup(value)}
                        error={errorGroup}
                        required
                    />
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default ListSupplierGroup;

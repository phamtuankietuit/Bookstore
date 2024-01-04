import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListSupplierGroup.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import { data9 } from '~/components/Table/sample';
import { SupplierGroupItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

import * as SuppliersServices from '~/apiServices/supplierServices';
import * as supplierGroupsServices from '~/apiServices/supplierGroupServices';

const cx = classNames.bind(styles);

function ListSupplierGroup() {
    const toastContext = useContext(ToastContext);
    const [updateList, setUpdateList] = useState(new Date());

    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        pageNumber,
        pageSize,
    ) => {
        return {
            pageNumber,
            pageSize,
        };
    }

    // API PROPS
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalRows, setTotalRows] = useState(0);
    const [clear, setClear] = useState(false);

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

                    const result = await supplierGroupsServices.CreateSupplierGroup({ staffId: 'staf00000', name: nameGroup })
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
        } else {
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
        }
    };

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

    // SUB HEADER
    const onClickAction = (index) => {
        onOpenModal('Xóa nhóm nhà cung cấp?');
    };


    const getList = async (obj) => {
        setPending(true);

        const response = await supplierGroupsServices.getAllSupplierGroups(obj)
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
            )
        );

    }

    const handlePageChange = async (pageNumber) => {
        setPageNumber(pageNumber);

        console.log('handlePageChange', pageNumber);

        getList(
            await createObjectQuery(
                pageNumber,
                pageSize,
            )
        );
    }

    useEffect(() => {
        const fetch = async () => {
            getList(
                await createObjectQuery(
                    pageNumber,
                    pageSize,
                )
            );
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateList]);

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
                            {titleModal === 'Thêm nhóm nhà cung cấp' ? 'Thêm' : 'Xóa'}
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
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default ListSupplierGroup;

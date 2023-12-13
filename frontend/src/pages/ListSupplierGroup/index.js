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

const cx = classNames.bind(styles);

function ListSupplierGroup() {
    const toastContext = useContext(ToastContext);

    // MODAL ADD PRODUCT TYPE
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [nameType, setNameType] = useState('');
    const [errorType, setErrorType] = useState('');

    const handleValidation = () => {
        if (nameType === '') {
            setErrorType('Không được bỏ trống');
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setNameType('');
                setErrorType('');
                handleClose();
                toastContext.notify(
                    'success',
                    'Thêm nhóm nhà cung cấp thành công',
                );
            }, 2000);
        }
    };

    const handleCloseModal = () => {
        setNameType('');
        setErrorType('');
        handleClose();
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data9);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
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
    const onClickAction = (index) => {};

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <Button
                        solidBlue
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={handleOpen}
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
                    />
                </div>
            </div>
            <ModalComp
                open={open}
                handleClose={handleCloseModal}
                title={'Thêm nhóm nhà cung cấp'}
                actionComponent={
                    <div>
                        <Button
                            className={cx('btn-cancel')}
                            outlineRed
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok')}
                            solidBlue
                            onClick={handleValidation}
                        >
                            Thêm
                        </Button>
                    </div>
                }
            >
                <Input
                    title={'Tên nhóm nhà cung cấp'}
                    value={nameType}
                    onChange={(value) => setNameType(value)}
                    error={errorType}
                    required
                />
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default ListSupplierGroup;

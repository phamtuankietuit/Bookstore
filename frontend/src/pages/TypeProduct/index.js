import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './TypeProduct.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import { data2 } from '~/components/Table/sample';
import { TypeProductItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import Input from '~/components/Input';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';

import * as typeProductServices from '~/apiServices/typeProductServices';

const cx = classNames.bind(styles);

function TypeProduct() {
    // CALL API
    useEffect(() => {

        const fetchApi = async () => {
            const result = await typeProductServices.getAllProductTypes()
                .catch((err) => {
                    console.log(err);
                });

            setPending(false);
            setRows(result);
        }

        fetchApi();

    }, []);

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
                toastContext.notify('success', 'Thêm loại sản phẩm thành công');
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

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setRows(data2);
    //         setPending(false);
    //     }, 2000);
    //     return () => clearTimeout(timeout);
    // }, []);

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
    const onClickAction = (index) => { };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <Button
                        solidBlue
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={handleOpen}
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
                    />
                </div>
            </div>
            <ModalComp
                open={open}
                handleClose={handleCloseModal}
                title={'Thêm loại sản phẩm'}
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
                    title={'Tên loại sản phẩm'}
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

export default TypeProduct;

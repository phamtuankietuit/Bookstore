import { useEffect, useState, useContext } from 'react';
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
                    // setLoading(true);

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
                        });

                    if (result) {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm loại sản phẩm thành công');
                    }
                }
                fetchApi();
            }
        } else {
            // DELETE
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

    const handleSelectedProducts = ({
        allSelected,
        selectedCount,
        selectedRows,
    }) => {
        selectedCount > 0 ? setShowSubHeader(true) : setShowSubHeader(false);
        setSelectedRow(selectedCount);
    };

    // SUB HEADER
    const onClickAction = (index) => {
        onOpenModal('Xóa loại sản phẩm?');
    };

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
                            {titleModal === 'Xóa loại sản phẩm?' ? 'Xóa' : 'Lưu'}
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

            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default TypeProduct;

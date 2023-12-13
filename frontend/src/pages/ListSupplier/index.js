import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faListUl,
    faPlus,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import styles from './ListSupplier.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { SupplierItem } from '~/components/Item';
import { data8 } from '~/components/Table/sample';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đang giao dịch', value: '0' },
    { label: 'Ngừng giao dịch', value: '1' },
];

const optionsNNCC = [
    { label: 'Sách', value: '0' },
    { label: 'Vở', value: '1' },
    { label: 'Bút', value: '2' },
];

function ListSupplier() {
    const navigate = useNavigate();
    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNNCC, setSelectedNNCC] = useState([]);

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedNNCC([]);
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data8);
            setPending(false);
        }, 500);
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
    const onClickAction = (value) => {
        if (value === 'Đang giao dịch') {
            onOpenModal('Cập nhật trạng thái?');
        } else if (value === 'Ngừng giao dịch') {
            onOpenModal('Ngừng giao dịch?');
        } else {
            onOpenModal('Xóa nhà cung cấp?');
        }
    };

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/suppliers/detail/' + row.id);
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

    const handleValidation = () => {};

    const onOpenModal = (value) => {
        setTitleModal(value);
        handleOpenModal();
    };

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
                            to="/suppliers/group"
                            leftIcon={<FontAwesomeIcon icon={faListUl} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Nhóm nhà cung cấp
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/suppliers/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Thêm nhà cung cấp
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã nhà cung cấp, tên, số điện thoại nhà cung cấp'
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
                                options={optionsNNCC}
                                placeholder={'Nhóm nhà cung cấp'}
                                selected={selectedNNCC}
                                setSelected={setSelectedNNCC}
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
                        </Filter>
                    }
                    // TABLE
                    selectableRows
                    pagination
                    onRowClicked={onRowClicked}
                    showSubHeader={showSubHeader}
                    itemComponent={SupplierItem}
                    data={rows}
                    pending={pending}
                    handleSelectedItems={handleSelectedProducts}
                    subHeaderComponent={
                        <SubHeader
                            count={selectedRow}
                            itemName={'nhà cung cấp'}
                            onClickAction={onClickAction}
                            items={[
                                'Đang giao dịch',
                                'Ngừng giao dịch',
                                'Xóa nhà cung cấp',
                            ]}
                        />
                    }
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
                            outlineBlue={titleModal !== 'Xóa nhà cung cấp?'}
                            outlineRed={titleModal === 'Xóa nhà cung cấp?'}
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue={titleModal !== 'Xóa nhà cung cấp?'}
                            solidRed={titleModal === 'Xóa nhà cung cấp?'}
                            onClick={handleValidation}
                        >
                            {titleModal === 'Xóa nhà cung cấp?' ? 'Xóa' : 'Lưu'}
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Cập nhật trạng thái?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ cập nhật trạng thái đang giao dịch cho
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
                {titleModal === 'Ngừng giao dịch?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ ngừng giao dịch cho
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
                {titleModal === 'Xóa nhà cung cấp?' && (
                    <div className={cx('info')}>
                        Thao tác này sẽ xóa
                        <strong> {selectedRow}</strong> nhà cung cấp bạn đã chọn
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}
export default ListSupplier;

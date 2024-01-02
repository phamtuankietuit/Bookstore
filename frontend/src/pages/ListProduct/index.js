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

import styles from './ListProduct.module.scss';
import List from '~/components/List';
import Button from '~/components/Button';
import Filter from '~/components/Filter';
import MultiSelectComp from '~/components/MultiSelectComp';
import { ProductItem } from '~/components/Item';
import SubHeader from '~/components/SubHeader';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import * as ProductServices from '~/apiServices/productServices';
const cx = classNames.bind(styles);

const optionsLSP = [
    { label: 'Sách Thiếu Nhi', value: '0' },
    { label: 'Giáo Khoa - Tham Khảo', value: '1' },
    { label: 'Tiểu Thuyết', value: '2' },
    { label: 'Truyện Ngắn', value: '3' },
    { label: 'Light Novel', value: '4' },
    { label: 'Tâm Lý - Kỹ Năng Sống', value: '5' },
    { label: 'Sách Học Ngoại Ngữ', value: '6' },
    { label: 'Văn phòng phẩm', value: '7' },
    { label: 'Đồ chơi', value: '8' },
    { label: 'Quà lưu niệm', value: '9' },
];

const optionsTT = [
    { label: 'Đang giao dịch', value: '0' },
    { label: 'Ngừng giao dịch', value: '1' },
];

const optionsPriceRange = [
    { label: '0đ - 150,000đ', value: '0-150000' },
    { label: '150,000đ - 300,000đ', value: '1' },
    { label: '300,000đ - 500,000đ', value: '2' },
    { label: '500,000đ - 700,000đ', value: '3' },
    { label: '700,000đ - Trở lên', value: '4' },
];

const optionsSupplier = [
    { label: 'Công ty Kim Lương', value: '0' },
    { label: 'Trung tâm giấy An Nghĩa', value: '1' },
    { label: 'Công ty sách Thịnh Gia', value: '2' },
    { label: 'Văn phòng phẩm An Phát', value: '3' },
    { label: 'Đồ chơi Vĩnh Hoàn', value: '4' },
];

const optionsBrand = [
    { label: 'Thiên Long', value: '0' },
    { label: 'Hồng Hà', value: '1' },
    { label: 'Bến Nghé', value: '2' },
    { label: 'Campus', value: '3' },
    { label: 'Deli', value: '4' },
];

function ListProduct() {

    const navigate = useNavigate();
    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [selectedLSP, setSelectedLSP] = useState([]);
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState([]);

    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedLSP([]);
        setSelectedTT([]);
        setSelectedPriceRange([]);
        setSelectedSupplier([]);
        setSelectedBrand([]);
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {

        const fetchApi = async () => {
            const result = await ProductServices.getAllProducts(1, 20)
                .catch((err) => {
                    console.log(err);
                });

            setPending(false);
            setRows(result.data);
            console.log(result)
        }

        fetchApi();

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




    // CALL API
    useEffect(() => {
        console.log(encodeURIComponent('Đắc Nhân Tâm Phạm Tuấn Kiệt Đắc Nhân Tâm Phạm Tuấn Kiệt Đắc Nhân Tâm Phạm Tuấn Kiệt '));
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
                                options={optionsBrand}
                                placeholder={'Thương hiệu'}
                                selected={selectedBrand}
                                setSelected={setSelectedBrand}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsBrand}
                                placeholder={'Nhà xuất bản'}
                                selected={selectedBrand}
                                setSelected={setSelectedBrand}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('margin-bottom')}
                                options={optionsBrand}
                                placeholder={'Tác giả'}
                                selected={selectedBrand}
                                setSelected={setSelectedBrand}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
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

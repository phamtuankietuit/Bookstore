import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListImport.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ImportItem } from '~/components/Item';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import * as PurchaseorderServices from '~/apiServices/purchaseorderServies';
const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã thanh toán', value: '0' },
    { label: 'Chưa thanh toán', value: '1' },
];

const optionsNCC = [
    { label: 'Văn phòng phẩm Khê Lương', value: '0' },
    { label: 'Nhà sách An Hòa Phát', value: '1' },
    { label: 'Thiên Long', value: '2' },
    { label: 'Thiết bị văn phòng Nguyễn An', value: '3' },
];

const optionsNV = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

function ListImport() {
    const navigate = useNavigate();

    // SEARCH
    const [search, setSearch] = useState('');
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // FILTER
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);

    const handleClearFilter = () => {
        setSelectedTT([]);
        setSelectedNCC([]);
        setSelectedNV([]);
        setDateString('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNCC, setSelectedNCC] = useState([]);
    const [selectedNV, setSelectedNV] = useState([]);

    // DATE RANGE PICKER
    const [dateString, setDateString] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/imports/detail/' + row.purchaseOrderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {

        const fetchApi = async () => {
            const result = await PurchaseorderServices.getAllPurchaseOrders()
                .catch((err) => {
                    console.log(err);
                });

            setPending(false);
            setRows(result);
            // console.log(result)
        }

        fetchApi();

    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}></div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/imports/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn nhập hàng
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn nhập, mã nhà cung cấp'
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
                            <DateRange
                                title={'Ngày nhập hàng'}
                                className={cx('m-b')}
                                dateString={dateString}
                                setDateString={setDateString}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNCC}
                                placeholder={'Nhà cung cấp'}
                                selected={selectedNCC}
                                setSelected={setSelectedNCC}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNV}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNV}
                                setSelected={setSelectedNV}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    pagination
                    onRowClicked={onRowClicked}
                    itemComponent={ImportItem}
                    data={rows}
                    pending={pending}
                />
            </div>
        </div>
    );
}

export default ListImport;

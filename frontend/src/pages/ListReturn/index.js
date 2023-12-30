import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListReturn.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ReturnItem } from '~/components/Item';
import { data6 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã nhận hàng', value: '0' },
    { label: 'Chưa nhận hàng', value: '1' },
    { label: 'Đã hủy', value: '2' },
];

const optionsHT = [
    { label: 'Đã hoàn tiền', value: '0' },
    { label: 'Chưa hoàn tiền', value: '1' },
];

const optionsNVT = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

const optionsKH = [
    { label: 'Nguyễn Thị Cẩm Nhung', value: '0' },
    { label: 'Phạm Văn Thái', value: '1' },
    { label: 'Cẩm Lệ', value: '2' },
    { label: 'Chu Văn Sa', value: '3' },
];

function ListReturn() {
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
        setSelectedKH([]);
        setSelectedNVT([]);
        setDateNH('');
        setDateHT('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedKH, setSelectedKH] = useState([]);
    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedHT, setSelectedHT] = useState([]);
    const [selectedNVT, setSelectedNVT] = useState([]);

    // DATE RANGE PICKER
    const [dateNH, setDateNH] = useState('');
    const [dateHT, setDateHT] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/return/detail/' + row.id);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data6);
            setPending(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faDownload} />}
                            solidBlue
                            className={cx('margin')}
                        >
                            Xuất file
                        </Button>
                    </div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/return/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn trả hàng
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
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsKH}
                                placeholder={'Khách hàng'}
                                selected={selectedKH}
                                setSelected={setSelectedKH}
                                hasSelectAll={true}
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
                                options={optionsHT}
                                placeholder={'Hoàn tiền'}
                                selected={selectedHT}
                                setSelected={setSelectedHT}
                                hasSelectAll={true}
                            />
                            <DateRange
                                title={'Ngày nhận hàng'}
                                className={cx('m-b')}
                                dateString={dateNH}
                                setDateString={setDateNH}
                                bottom
                            />
                            <DateRange
                                title={'Ngày hoàn tiền'}
                                className={cx('m-b')}
                                dateString={dateHT}
                                setDateString={setDateHT}
                                bottom
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVT}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    onRowClicked={onRowClicked}
                    pagination
                    itemComponent={ReturnItem}
                    data={rows}
                    pending={pending}
                />
            </div>
        </div>
    );
}

export default ListReturn;

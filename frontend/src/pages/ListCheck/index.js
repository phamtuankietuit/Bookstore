import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ListCheck.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { CheckItem } from '~/components/Item';
import { data4 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

const cx = classNames.bind(styles);

const optionsTT = [
    { label: 'Đã cân bằng', value: '0' },
    { label: 'Đang kiểm kho', value: '1' },
    { label: 'Đã xóa', value: '2' },
];

const optionsNVT = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

const optionsNVCB = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

function ListCheck() {
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
        setSelectedNVT([]);
        setSelectedNVCB([]);
        setDateCreated('');
        setDateBalanced('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNVT, setSelectedNVT] = useState([]);
    const [selectedNVCB, setSelectedNVCB] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // DATE BALANCED
    const [dateBalanced, setDateBalanced] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/checks/detail/' + row.id);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data4);
            setPending(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <div className={cx('tool-bar-left')}></div>
                    <div className={cx('tool-bar-right')}>
                        <Button
                            to="/checks/add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            solidBlue
                        >
                            Tạo đơn kiểm hàng
                        </Button>
                    </div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo mã đơn kiểm hàng'}
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
                                options={optionsTT}
                                placeholder={'Trạng thái'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                            <DateRange
                                title={'Ngày tạo'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                            />
                            <DateRange
                                title={'Ngày cân bằng'}
                                className={cx('m-b')}
                                dateString={dateBalanced}
                                setDateString={setDateBalanced}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVT}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVCB}
                                placeholder={'Nhân viên cân bằng'}
                                selected={selectedNVCB}
                                setSelected={setSelectedNVCB}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    onRowClicked={onRowClicked}
                    itemComponent={CheckItem}
                    data={rows}
                    pending={pending}
                    pagination
                />
            </div>
        </div>
    );
}

export default ListCheck;

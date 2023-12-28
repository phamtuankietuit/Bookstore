import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ActivityHistory.module.scss';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { ActivityItem } from '~/components/Item';
import { data12 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

const cx = classNames.bind(styles);

const optionsNVT = [
    { label: 'Lê Võ Duy Khiêm', value: '0' },
    { label: 'Phạm Tuấn Kiệt', value: '1' },
    { label: 'Ngô Trung Quân', value: '2' },
    { label: 'Nguyễn Trung Kiên', value: '3' },
];

const optionsTT = [
    { label: 'Đăng nhập', value: '0' },
    { label: 'Thêm mới', value: '1' },
    { label: 'Cập nhật', value: '2' },
    { label: 'Đã xóa', value: '3' },
];

function ActivityHistory() {
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
        setSelectedTT([]);
        setDateCreated('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedTT, setSelectedTT] = useState([]);
    const [selectedNVT, setSelectedNVT] = useState([]);
    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');


    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data12);
            setPending(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <List
                    searchVisibility={true}
                    placeholderSearch={'Tìm kiếm theo người thao tác, mã chứng từ'}
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
                                title={'Thời gian'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsNVT}
                                placeholder={'Người thao tác'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
                                hasSelectAll={true}
                            />
                            <MultiSelectComp
                                className={cx('m-b')}
                                options={optionsTT}
                                placeholder={'Thao tác'}
                                selected={selectedTT}
                                setSelected={setSelectedTT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    itemComponent={ActivityItem}
                    data={rows}
                    pending={pending}
                    pagination
                />
            </div>
        </div>
    );
}

export default ActivityHistory;

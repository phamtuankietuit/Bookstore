import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

import styles from './ListOrder.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import Filter from '~/components/Filter';
import { OrderItem } from '~/components/Item';
import { data5 } from '~/components/Table/sample';
import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';
import * as SaleServices from '~/apiServices/saleServices';
const cx = classNames.bind(styles);

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

function ListOrder() {
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
        setSelectedNVT([]);
        setSelectedKH([]);
        setDateCreated('');
    };

    const handleFilter = () => {
        handleCloseFilter();
    };

    const [selectedNVT, setSelectedNVT] = useState([]);
    const [selectedKH, setSelectedKH] = useState([]);

    // DATE CREATED
    const [dateCreated, setDateCreated] = useState('');

    // ON ROW CLICKED
    const onRowClicked = useCallback((row) => {
        navigate('/orders/detail/' + row.orderId);
    }, []);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setRows(data5);
    //         setPending(false);
    //     }, 500);
    //     return () => clearTimeout(timeout);
    // }, []);
    useEffect(() => {

        const fetchApi = async () => {
            const result = await SaleServices.getAllSalesOrders()
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
                    </div>
                    <div className={cx('tool-bar-right')}></div>
                </div>

                <List
                    searchVisibility={true}
                    placeholderSearch={
                        'Tìm kiếm theo mã đơn hàng, tên, số điện thoại khách hàng'
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
                                title={'Ngày tạo'}
                                className={cx('m-b')}
                                dateString={dateCreated}
                                setDateString={setDateCreated}
                                bottom
                            />
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
                                options={optionsNVT}
                                placeholder={'Nhân viên tạo'}
                                selected={selectedNVT}
                                setSelected={setSelectedNVT}
                                hasSelectAll={true}
                            />
                        </Filter>
                    }
                    // TABLE
                    pagination
                    onRowClicked={onRowClicked}
                    itemComponent={OrderItem}
                    data={rows}
                    pending={pending}
                />
            </div>
        </div>
    );
}

export default ListOrder;

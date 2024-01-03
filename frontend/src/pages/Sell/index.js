import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faHouse } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from '@mui/material';

import styles from './Sell.module.scss';
import SearchBar from "~/components/SearchBar";
import Table from "~/components/Table";
import { SellItem } from '~/components/Item';
import { data } from '~/components/Table/sample';

const cx = classNames.bind(styles);

function Sell() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [noData, setNoData] = useState(false);

    // TABLE
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const handleClick = () => {
        console.log('oke');
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data.map((row, index) => ({
                productId: row.id,
                sku: row.id,
                name: row.name,
                featureImageUrl: row.image[0],
                quantity: 0,
                salePrice: 0,
                totalPrice: 0,
                index,
            })));
            setPending(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <div className={cx('left-side')}>
                        <span className={cx('title')}>Tạo đơn mới</span>
                        <SearchBar
                            className={cx('search')}
                            placeholder={'Tìm kiếm theo mã, tên sản phẩm'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={cx('right-side')}>
                        <Tooltip title='Trở về trang quản trị'>
                            <FontAwesomeIcon
                                className={cx('icon-home')}
                                icon={faHouse}
                                onClick={() => navigate('/products')}
                            />
                        </Tooltip>
                    </div>
                </div>
                <div className={cx('content')}>
                    <div className={cx('left-row')}>
                        {noData &&
                            <div className={cx('no-data')}>
                                <FontAwesomeIcon className={cx('icon-box')} icon={faBoxOpen} />
                                <div className={cx('no-data-title')}>Đơn hàng của bạn chưa có sản phẩm nào</div>
                            </div>
                        }
                        {
                            <div className={cx('table-wrapper')}>
                                <Table
                                    itemComponent={SellItem(handleClick)}
                                    data={rows}
                                    pending={pending}
                                />
                            </div>
                        }
                    </div>
                    <div className={cx('center-row')}></div>
                    <div className={cx('right-row')}></div>
                </div>
            </div>
        </div>
    );
}

export default Sell;
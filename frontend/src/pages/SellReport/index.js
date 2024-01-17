import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { CircularProgress } from '@mui/material';

import styles from './SellReport.module.scss';
import Wrapper from '~/components/Wrapper';
import ModalLoading from '~/components/ModalLoading';
import DateRange from '~/components/DateRange';
import Input from '~/components/Input';
import ChartComp from '~/components/ChartComp';
import Percent from '~/components/Percent';
import ValueComp from '~/components/ValueComp';
import Button from '~/components/Button';
import { ConvertISO } from '~/components/ConvertISO';

import { ToastContext } from '~/components/ToastContext';

import * as reportServices from '~/apiServices/reportServices';

const cx = classNames.bind(styles);

const thousandBreakOptions = {
    scales: {
        y: {
            ticks: {
                callback(value) {
                    return Number(value).toLocaleString('en')
                }
            }
        }
    }
};

const topProductsOptions = {
    plugins: {
        legend: {
            position: 'right',
        },
    },
    indexAxis: 'y',
    scales: {
        x: {
            ticks: {
                callback(value) {
                    return Number(value).toLocaleString('en')
                }
            }
        }
    }
};

function SellReport() {
    const toastContext = useContext(ToastContext);

    // TODAY
    const [today, setToday] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const responseToday = await reportServices.getToday()
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (responseToday) {
                console.log(responseToday);
                setToday(responseToday);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MONEY
    const [loadingMoney, setLoadingMoney] = useState(false);
    const [dateMoney, setDateMoney] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [groupMoney, setGroupMoney] = useState({ label: 'Ngày', value: 'day' });
    const [chartType, setChartType] = useState({ label: 'Biểu đồ cột', value: 'bar' });

    const [moneyLabels, setMoneyLabels] = useState([]);
    const [invests, setInvests] = useState([]);
    const [profits, setProfits] = useState([]);
    const [revenues, setRevenues] = useState([]);

    const moneyDatasets = [
        {
            label: 'Doanh thu',
            data: revenues,
        },
        {
            label: 'Lợi nhuận',
            data: profits,
        },
        {
            label: 'Tiền vốn',
            data: invests,
        }
    ];


    // CREATE OBJECT QUERY
    const createObjectQuery = async (
        startDate,
        endDate,
        groupBy,
    ) => {
        return {
            startDate,
            endDate,
            groupBy,
        };
    }

    const handleGetMoney = async (obj) => {
        setLoadingMoney(true);

        const responseMoney = await reportServices.getMoney(obj)
            .catch((error) => {
                console.log(error);
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (responseMoney) {
            console.log(responseMoney);
            setMoneyLabels(responseMoney.dates);
            setInvests(responseMoney.invests);
            setProfits(responseMoney.profits);
            setRevenues(responseMoney.revenues);
        }

        setLoadingMoney(false);
    };

    const handleViewMoney = async () => {
        handleGetMoney(
            await createObjectQuery(
                dateMoney && ConvertISO(dateMoney).startDate,
                dateMoney && ConvertISO(dateMoney).endDate,
                groupMoney.value
            )
        );
    }

    useEffect(() => {
        const fetch = async () => {
            handleGetMoney(
                await createObjectQuery(
                    dateMoney && ConvertISO(dateMoney).startDate,
                    dateMoney && ConvertISO(dateMoney).endDate,
                    groupMoney.value
                )
            );
        };

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ORDER COUNT
    const [loadingOrderCounts, setLoadingOrderCounts] = useState(false);
    const [dateOrderCounts, setDateOrderCounts] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [groupOrderCounts, setGroupOrderCounts] = useState({ label: 'Ngày', value: 'day' });
    const [orderCountsLabels, setOrderCountsLabels] = useState([]);

    const [orderCounts, setOrderCounts] = useState([]);

    const orderCountsDatasets = [
        {
            label: 'Số lượng',
            data: orderCounts,
            backgroundColor: '#34c9a2',
            borderColor: '#34c9a2',
        }
    ];

    const handleGetOrderCounts = async (obj) => {
        setLoadingOrderCounts(true);

        const responseOrderCounts = await reportServices.getOrderCounts(obj)
            .catch((error) => {
                console.log(error);
                toastContext.notify('error', 'Có lỗi xảy ra');
            });

        if (responseOrderCounts) {
            console.log(responseOrderCounts);
            setOrderCountsLabels(responseOrderCounts.dates);
            setOrderCounts(responseOrderCounts.orderCounts);
        }

        setLoadingOrderCounts(false);
    };

    const handleViewOrderCounts = async () => {
        handleGetOrderCounts(
            await createObjectQuery(
                dateOrderCounts && ConvertISO(dateOrderCounts).startDate,
                dateOrderCounts && ConvertISO(dateOrderCounts).endDate,
                groupOrderCounts.value
            )
        );
    }

    useEffect(() => {
        const fetch = async () => {
            handleGetOrderCounts(
                await createObjectQuery(
                    dateOrderCounts && ConvertISO(dateOrderCounts).startDate,
                    dateOrderCounts && ConvertISO(dateOrderCounts).endDate,
                    groupOrderCounts.value
                )
            );
        };

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TOP PRODUCTS
    const [topProductsLabels, setTopProductsLabels] = useState([]);
    const [topProductsQuantity, setTopProductsQuantity] = useState([]);

    const topProductsDatasets = [
        {
            label: 'Số lượng',
            data: topProductsQuantity,
            backgroundColor: "#3a57e8",
            borderColor: '#3a57e8',
        },
    ];

    useEffect(() => {
        const fetch = async () => {
            const now = new Date();

            const responseTopProducts = await reportServices.getTopProducts(
                {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                }
            )
                .catch((error) => {
                    console.log(error);
                    toastContext.notify('error', 'Có lỗi xảy ra');
                });

            if (responseTopProducts) {
                console.log(responseTopProducts);
                setTopProductsLabels(responseTopProducts.productNames);
                setTopProductsQuantity(responseTopProducts.quantities);
            }
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div>
                    <Wrapper
                        title={'HÔM NAY'}
                        className={cx('m-b')}
                    >
                        <div className={cx('today-wrapper')}>
                            <ValueComp
                                className={cx('bg0')}
                                title={'Số lượng đơn hàng'}
                                value={today.count}
                                percentComponent={
                                    <Percent
                                        percent={Math.abs(today.countPercent)}
                                        up={today.countPercent >= 0}
                                    />
                                }
                            />
                            <ValueComp
                                className={cx('m-l', 'bg1')}
                                title={'Doanh thu'}
                                value={today.revenue}
                                percentComponent={
                                    <Percent
                                        percent={Math.abs(today.revenuePercent)}
                                        up={today.revenuePercent >= 0}
                                    />
                                }
                            />
                            <ValueComp
                                className={cx('m-l', 'bg2')}
                                title={'Lợi nhuận'}
                                value={today.profit}
                                percentComponent={
                                    <Percent
                                        percent={Math.abs(today.profitPercent)}
                                        up={today.profitPercent >= 0}
                                    />
                                }
                            />
                        </div>
                    </Wrapper>

                    <Wrapper
                        title={'BÁO CÁO DOANH THU, LỢI NHUẬN, TIỀN VỐN'}
                        className={cx('m-b', 'm-h')}
                        classNameContent={cx('height')}
                    >
                        <div className={cx('toolbar')}>
                            <DateRange
                                title={'Khoảng thời gian'}
                                dateString={dateMoney}
                                setDateString={setDateMoney}
                                bottom
                            />
                            <Input
                                className={cx('m-l', 'm-w-group')}
                                title={'Nhóm theo'}
                                items={
                                    [
                                        { label: 'Ngày', value: 'day' },
                                        { label: 'Tháng', value: 'month' },
                                        { label: 'Năm', value: 'year' },
                                    ]
                                }
                                value={groupMoney.label}
                                handleClickAction={(item) => setGroupMoney(item)}
                                readOnly
                            />
                            <Input
                                className={cx('m-l', 'm-w-type')}
                                title={'Loại biểu đồ'}
                                items={
                                    [
                                        { label: 'Biểu đồ cột', value: 'bar' },
                                        { label: 'Biểu đồ đường', value: 'line' }
                                    ]
                                }
                                value={chartType.label}
                                handleClickAction={(item) => setChartType(item)}
                                readOnly
                            />
                            <Button
                                className={cx('m-l', 'm-w-type')}
                                solidBlue
                                leftIcon={<FontAwesomeIcon icon={faEye} />}
                                onClick={handleViewMoney}
                            >
                                Xem báo cáo
                            </Button>
                            {loadingMoney && <CircularProgress
                                className={cx('m-l', 'm-w-type')}
                                color="primary"
                            />}
                        </div>
                        <ChartComp type={chartType.value}
                            labels={moneyLabels}
                            datasets={moneyDatasets}
                            options={thousandBreakOptions}
                        />
                    </Wrapper>

                    <Wrapper
                        title={'BÁO CÁO SỐ LƯỢNG ĐƠN HÀNG'}
                        className={cx('m-b', 'm-h')}
                        classNameContent={cx('height')}
                    >
                        <div className={cx('toolbar')}>
                            <DateRange
                                title={'Khoảng thời gian'}
                                dateString={dateOrderCounts}
                                setDateString={setDateOrderCounts}
                                bottom
                            />
                            <Input
                                className={cx('m-l', 'm-w-group')}
                                title={'Nhóm theo'}
                                items={
                                    [
                                        { label: 'Ngày', value: 'day' },
                                        { label: 'Tháng', value: 'month' },
                                        { label: 'Năm', value: 'year' },
                                    ]
                                }
                                value={groupOrderCounts.label}
                                handleClickAction={(item) => setGroupOrderCounts(item)}
                                readOnly
                            />
                            <Button
                                className={cx('m-l', 'm-w-type')}
                                solidBlue
                                leftIcon={<FontAwesomeIcon icon={faEye} />}
                                onClick={handleViewOrderCounts}
                            >
                                Xem báo cáo
                            </Button>
                            {loadingOrderCounts && <CircularProgress
                                className={cx('m-l', 'm-w-type')}
                                color="primary"
                            />}
                        </div>
                        <ChartComp type={'bar'}
                            labels={orderCountsLabels}
                            datasets={orderCountsDatasets}
                            options={thousandBreakOptions}
                        />
                    </Wrapper>

                    <Wrapper
                        title={'TOP 10 SẢN PHẨM BÁN CHẠY THÁNG NÀY'}
                        className={cx('m-b', 'height-not-toolbar')}
                    >
                        <ChartComp type={'bar'}
                            labels={topProductsLabels}
                            datasets={topProductsDatasets}
                            options={topProductsOptions}
                        />
                    </Wrapper>
                </div>
            </div>
        </div>
    );
}

export default SellReport;

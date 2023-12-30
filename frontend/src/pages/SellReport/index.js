import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './SellReport.module.scss';
import Wrapper from '~/components/Wrapper';
import ModalLoading from '~/components/ModalLoading';
import DateRange from '~/components/DateRange';
import Input from '~/components/Input';
import ChartComp from '~/components/ChartComp';
import Percent from '~/components/Percent';
import ValueComp from '~/components/ValueComp';


const cx = classNames.bind(styles);

const lineLabels = [
    '01/2023',
    '02/2023',
    '03/2023',
    '04/2023',
    '05/2023',
    '06/2023',
    '07/2023',
    '08/2023',
    '09/2023',
    '10/2023',
    '11/2023',
    '12/2023',
];
const lineDatasets = [
    {
        label: 'Doanh thu',
        data: [1500000, 5000000, 10000000, 15000000, 8000000, 2500000, 1500000, 20000000, 30000000, 40000000, 50000000, 25000000],
    },
    {
        label: 'Lợi nhuận',
        data: [500000, 1500000, 5000000, 10000000, 3500000, 1000000, 500000, 10000000, 17500000, 32500000, 39100000, 10000000],
    },
    {
        label: 'Tiền vốn',
        data: [1000000, 3500000, 5000000, 5000000, 4500000, 1500000, 1000000, 10000000, 12500000, 7500000, 10900000, 15000000],
    }
];

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

const topProductsLabels = [
    'Đắc nhân tâm',
    'Vì cậu là bạn nhỏ của tớ',
    'Nhà giả kim',
    'Tuổi trẻ đáng giá bao nhiêu',
    'Hai đứa trẻ',
    'Lão hạc',
    'Thiên tài bên trái, kẻ điên bên phải',
    'Số đỏ',
    'Người lái đò sông Đà',
    'Nam Việt',
];

const topProductsDatasets = [
    {
        label: 'Số lượng',
        data: [10, 500, 100, 2, 300, 425, 723, 111, 6, 1000],
        backgroundColor: "#3a57e8",
        borderColor: '#3a57e8',
    },
];

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

const totalOrderLabels = [
    '11/12/2023',
    '12/12/2023',
    '13/12/2023',
    '14/12/2023',
    '15/12/2023',
    '16/12/2023',
    '17/12/2023',
    '18/12/2023',
];

const totalOrderDatasets = [
    {
        label: 'Số lượng',
        data: [10, 500, 100, 2, 300, 425, 723, 111],
        backgroundColor: '#34c9a2',
        borderColor: '#34c9a2',
    }
];


function SellReport() {
    const [dateString, setDateString] = useState('');
    const [group, setGroup] = useState('Tháng');
    const [chartType, setChartType] = useState({ type: 'bar', title: 'Biểu đồ cột' });

    const handleChangeType = (value) => {
        if (value === 'Biểu đồ đường') {
            setChartType({ type: 'line', title: 'Biểu đồ đường' });
        } else {
            setChartType({ type: 'bar', title: 'Biểu đồ cột' });
        }
    }

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
                                value={325}
                                percentComponent={<Percent percent={'26,25'} up />}
                            />
                            <ValueComp
                                className={cx('m-l', 'bg1')}
                                title={'Doanh thu'}
                                value={5225000}
                                percentComponent={<Percent percent={'10,25'} up />}
                            />
                            <ValueComp
                                className={cx('m-l', 'bg2')}
                                title={'Lợi nhuận'}
                                value={1327000}
                                percentComponent={<Percent percent={'50,36'} up />}
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
                                dateString={dateString}
                                setDateString={setDateString}
                                bottom
                            />
                            <Input
                                className={cx('m-l', 'm-w-group')}
                                title={'Nhóm theo'}
                                items={['Ngày', 'Tháng', 'Năm']}
                                value={group}
                                onChange={(value) => setGroup(value)}
                                readOnly
                            />
                            <Input
                                className={cx('m-l', 'm-w-type')}
                                title={'Loại biểu đồ'}
                                items={['Biểu đồ cột', 'Biểu đồ đường']}
                                value={chartType.title}
                                onChange={(value) => handleChangeType(value)}
                                readOnly
                            />
                        </div>
                        <ChartComp type={chartType.type}
                            labels={lineLabels}
                            datasets={lineDatasets}
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
                                dateString={dateString}
                                setDateString={setDateString}
                                bottom
                            />
                        </div>
                        <ChartComp type={'bar'}
                            labels={totalOrderLabels}
                            datasets={totalOrderDatasets}
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

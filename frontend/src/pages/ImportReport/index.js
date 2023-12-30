import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ImportReport.module.scss';
import Wrapper from '~/components/Wrapper';
import ChartComp from '~/components/ChartComp';
import DateRange from '~/components/DateRange';

const cx = classNames.bind(styles);

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
    'Nam Việt',
    'Nam Việt',
    'Nam Việt',
];

const topProductsDatasets = [
    {
        label: 'Số lượng',
        data: [10, 500, 100, 2, 300, 425, 723, 111, 6, 1000, 120, 200, 100],
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

function ImportReport() {
    const [dateString, setDateString] = useState('');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div>
                    <Wrapper
                        title={'BÁO CÁO NHẬP HÀNG'}
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

export default ImportReport;

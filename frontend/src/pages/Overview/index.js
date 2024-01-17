import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import format from 'date-fns/format';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Overview.module.scss';
import Wrapper from '~/components/Wrapper';
import Percent from '~/components/Percent';
import ValueComp from '~/components/ValueComp';
import Button from '~/components/Button';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as activityServices from '~/apiServices/activityServices';
import * as reportServices from '~/apiServices/reportServices';

const cx = classNames.bind(styles);

function Overview() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [today, setToday] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const response = await activityServices
                .getAllActivity({ pageNumber: 1, pageSize: 20, })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        setActivities([]);
                    } else {
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    }
                });

            if (response) {
                setActivities(response.data);
            }

            setLoading(false);
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            setLoading(false);
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
                        title={'HOẠT ĐỘNG GẦN ĐÂY'}
                        className={'m-b'}
                    >
                        <div>
                            {activities.map((activity) => {
                                return <div key={activity.activityId} className={cx('ac-wrapper')}>
                                    <div className={cx('dot-wrapper')}>
                                        <div className={cx('dot')}></div>
                                        <div className={cx('dash')}></div>
                                    </div>
                                    <div className={cx('content')}>
                                        <div className={cx('title')}>{activity.staffName} {activity.activityName}</div>
                                        <div className={cx('time')}>{format(new Date(activity.createdAt), 'dd/MM/yyyy - HH:mm')}</div>
                                    </div>
                                </div>
                            })}
                            <Button
                                outlineBlue
                                className={cx('m-t')}
                                rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
                                onClick={() => navigate('/activity')}
                            >
                                Nhật ký hoạt động
                            </Button>
                        </div>
                    </Wrapper>
                </div>
            </div>
            <ModalLoading open={loading} title={'Đang tải...'} />
        </div>
    );
}

export default Overview;

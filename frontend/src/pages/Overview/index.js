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

import { ToastContext } from '~/components/ToastContext';

import * as activityServices from '~/apiServices/ActivityServices'

const cx = classNames.bind(styles);

function Overview() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetch = async () => {

            const response = await activityServices
                .getAllActivity({ pageNumber: 1, pageSize: 20, sortBy: 'createdAt', orderBy: 'desc' })
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
        }

        fetch();
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
        </div>
    );
}

export default Overview;

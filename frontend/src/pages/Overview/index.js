import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './Overview.module.scss';
import Wrapper from '~/components/Wrapper';
import Percent from '~/components/Percent';
import ValueComp from '~/components/ValueComp';
import { data12 } from '~/components/Table/sample';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Overview() {
    const navigate = useNavigate();

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
                            {data12.map((activity) => {
                                return <div key={activity.id} className={cx('ac-wrapper')}>
                                    <div className={cx('dot-wrapper')}>
                                        <div className={cx('dot')}></div>
                                        <div className={cx('dash')}></div>
                                    </div>
                                    <div className={cx('content')}>
                                        <div className={cx('title')}>{activity.name} vừa {activity.content}</div>
                                        <div className={cx('time')}>{activity.createAt}</div>
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

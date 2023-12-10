import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './ListCheck.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ListCheck() {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Button solidBlue onClick={() => navigate('/checks/add')}>
                    Tạo đơn kiểm hàng
                </Button>
                <Button solidBlue onClick={() => navigate('/checks/detail')}>
                    Chi tiết đơn kiểm hàng
                </Button>
                <Button solidBlue onClick={() => navigate('/checks/update')}>
                    Chỉnh sửa đơn kiểm hàng
                </Button>
            </div>
        </div>
    );
}

export default ListCheck;

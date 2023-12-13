import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './ListImport.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ListImport() {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Button solidBlue onClick={() => navigate('/imports/add')}>
                    Tạo đơn nhập hàng
                </Button>
                <Button solidBlue onClick={() => navigate('/imports/detail/123')}>
                    Chi tiết đơn nhập hàng
                </Button>
                <Button solidBlue onClick={() => navigate('/imports/update/123')}>
                    Chỉnh sửa đơn nhập hàng
                </Button>
            </div>
        </div>
    );
}

export default ListImport;

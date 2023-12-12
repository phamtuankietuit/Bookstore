import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './ListDiscount.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ListDiscount() {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Button solidBlue onClick={() => navigate('/discounts/add')}>
                    Thêm khuyến mãi
                </Button>
            </div>
        </div>
    );
}

export default ListDiscount;

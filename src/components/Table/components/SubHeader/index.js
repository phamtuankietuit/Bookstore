import classNames from 'classnames/bind';
import styles from './SubHeader.module.scss';
import ActionDropdown from '~/components/ActionDropdown';

const cx = classNames.bind(styles);

const arrs = ['Đang giao dịch', 'Ngừng giao dịch', 'Xóa sản phẩm'];

function SubHeader({ props }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('description')}>
                Đã chọn {props?.count} {props?.item_name} trên trang này
            </div>
            <div className={cx('action-dropdown')}>
                <ActionDropdown arrs={arrs} />
            </div>
        </div>
    );
}

export default SubHeader;

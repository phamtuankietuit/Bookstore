import classNames from 'classnames/bind';
import styles from './SubHeader.module.scss';
import ActionDropdown from '~/components/ActionDropdown';

const cx = classNames.bind(styles);

function SubHeader({ items, count, itemName, onClickAction }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('description')}>
                Đã chọn {count} {itemName} trên trang này
            </div>
            <div className={cx('action-dropdown')}>
                <ActionDropdown items={items} onClickAction={onClickAction} />
            </div>
        </div>
    );
}

export default SubHeader;

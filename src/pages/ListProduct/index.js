import classNames from 'classnames/bind';
import styles from './ListProduct.module.scss';

import List from '~/components/List';

const cx = classNames.bind(styles);

function ListProduct() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <List />
            </div>
        </div>
    );
}
export default ListProduct;

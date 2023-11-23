import classNames from 'classnames/bind';
import styles from './TypeProduct.module.scss';
import Button from '~/components/Button';
import List from '~/components/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function TypeProduct() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('tool-bar')}>
                    <Button
                        solidBlue
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Thêm loại sản phẩm
                    </Button>
                </div>
                <div className={cx('table')}>
                    <List />
                </div>
            </div>
        </div>
    );
}

export default TypeProduct;

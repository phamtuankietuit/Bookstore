import classNames from 'classnames/bind';
import styles from './ListProduct.module.scss';
import ToolBar from '~/components/ToolBar';
const cx = classNames.bind(styles);

function ListProduct() {
    // const toolbar = [
    //     {
    //         id: 1,
    //         type: 2,
    //         link: '/addproduct',
    //         title: 'Them san pham'
    //     },
    //     {
    //         id: 2,
    //         type: 1,
    //         link: '/product_type',
    //         title: 'Danh sach san pham'
    //     }
    // ]
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {/* <ToolBar array={toolbar} /> */}
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
                <div className={cx('sth')}></div>
            </div>
        </div>
    );
}
export default ListProduct;

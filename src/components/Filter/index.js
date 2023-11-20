import { useState, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Filter.module.scss';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';

import MultiSelectComp from '~/components/MultiSelectComp';
import DateRange from '~/components/DateRange';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '0',
    right: '0',
    width: 420,
    height: '100vh',
    bgcolor: 'white',
    border: 'none',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
};

const options1 = [
    { label: 'Sách', value: '0' },
    { label: 'Văn phòng phẩm', value: '1' },
    { label: 'Quà lưu niệm', value: '2' },
    { label: 'Đồ chơi trẻ em', value: '3' },
    { label: 'Bánh kẹo', value: '4', disabled: true },
];

const options2 = [
    { label: 'Đang giao dịch', value: '0' },
    { label: 'Ngừng giao dịch', value: '1' },
];

function Filter() {
    const [selected1, setSelected1] = useState([]);
    const [selected2, setSelected2] = useState([]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClearFilter = () => {
        setSelected1([]);
        setSelected2([]);
    };

    const handleFilter = () => {
        // do something

        setOpen(false);
    };

    // console.log('Filter re-render');

    return (
        <div>
            <div className={cx('filter-btn')} onClick={handleOpen}>
                <FontAwesomeIcon
                    className={cx('filter-btn-icon')}
                    icon={faFilter}
                />
                <div className={cx('filter-btn-name')}>Bộ lọc</div>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Slide direction="left" in={open}>
                    <Box sx={style}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>Bộ lọc</div>
                            <div
                                onClick={handleClose}
                                className={cx('btn-close')}
                            >
                                <FontAwesomeIcon
                                    className={cx('btn-close-icon')}
                                    icon={faXmark}
                                />
                            </div>
                        </div>

                        <Divider />

                        <div className={cx('content')}>
                            <div className={cx('multi-select')}>
                                <MultiSelectComp
                                    options={options1}
                                    placeholder={'Loại sản phẩm'}
                                    selected={selected1}
                                    setSelected={setSelected1}
                                />
                            </div>
                            <div className={cx('multi-select')}>
                                <MultiSelectComp
                                    options={options2}
                                    placeholder={'Trạng thái'}
                                    selected={selected2}
                                    setSelected={setSelected2}
                                />
                            </div>
                            <div className={cx('multi-select')}>
                                <DateRange />
                            </div>
                        </div>

                        <Divider />

                        <div className={cx('actions')}>
                            <div
                                className={cx('clear')}
                                onClick={handleClearFilter}
                            >
                                Xóa bộ lọc
                            </div>
                            <div
                                className={cx('submit')}
                                onClick={handleFilter}
                            >
                                Lọc
                            </div>
                        </div>
                    </Box>
                </Slide>
            </Modal>
        </div>
    );
}

export default memo(Filter);

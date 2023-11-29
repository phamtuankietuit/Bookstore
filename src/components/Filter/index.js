import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Filter.module.scss';
import { Modal, Box, Slide } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button';

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

function Filter({
    children,
    open,
    handleOpen,
    handleClose,
    handleClearFilter,
    handleFilter,
}) {
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

                        <hr className={cx('divider')} />

                        <div className={cx('content')}>{children}</div>

                        <hr className={cx('divider')} />

                        <div className={cx('actions')}>
                            <Button
                                className={cx('clear')}
                                outlineRed
                                onClick={handleClearFilter}
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button
                                className={cx('submit')}
                                solidBlue
                                onClick={handleFilter}
                            >
                                Lọc
                            </Button>
                        </div>
                    </Box>
                </Slide>
            </Modal>
        </div>
    );
}

export default memo(Filter);

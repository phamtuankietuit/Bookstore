import classNames from 'classnames/bind';
import { Modal, Box, CircularProgress } from '@mui/material';
import styles from './ModalLoading.module.scss';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'white',
    border: 'none',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
};

function ModalLoading({ open, title }) {
    return (
        <Modal open={open}>
            <Box sx={style}>
                <div className={cx('wrapper')}>
                    <CircularProgress color="primary" />
                    <div className={cx('title')}>{title}...</div>
                </div>
            </Box>
        </Modal>
    );
}

export default ModalLoading;

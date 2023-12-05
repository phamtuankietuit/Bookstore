import classNames from 'classnames/bind';
import { Modal, Box, Fade } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './ModalComp.module.scss';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 650,
    minWidth: 300,
    maxHeight: '90vh',
    bgcolor: 'white',
    border: 'none',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
    boxShadow: '0px 10px 13px 0px rgba(17, 38, 146, 0.05)',
};

function ModalComp({ open, handleClose, children, actionComponent, title }) {
    return (
        <Modal open={open}>
            <Fade in={open}>
                <Box sx={style}>
                    <div className={cx('wrapper')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{title}</div>
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
                        {actionComponent && (
                            <div className={cx('action')}>
                                {actionComponent}
                            </div>
                        )}
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}

export default ModalComp;

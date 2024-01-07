import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faArrowRightFromBracket,
    faBars,
    faGear,
} from '@fortawesome/free-solid-svg-icons';
import { Modal, Box, Slide } from '@mui/material';
import styles from './Header.module.scss';
import Button from '~/components/Button';
import SideBar from '../SideBar';
import noImage from '~/assets/images/no-image.png';

import { getLocalStorage } from '~/store/getLocalStorage';

import * as staffServices from '~/apiServices/staffServices';

const cx = classNames.bind(styles);

const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: 250,
    height: '100vh',
    bgcolor: 'white',
    border: 'none',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
};

function Header({ title, back }) {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [image, setImage] = useState();

    useEffect(() => {
        const object = getLocalStorage();

        const fetch = async () => {
            const response = await staffServices.getStaff(object.user.staffId)
                .catch((error) => {
                    console.log(error);
                });

            if (response) {
                setName(response.name);
                setImage(response.profileImage);
            }
        }

        fetch();
    }, []);

    const handleLogOut = () => {
        window.localStorage.removeItem('object');
        window.localStorage.setItem('isLogin', false);
        navigate('/');
    };



    // POPPER
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    // SIDEBAR
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('wrapper-action')}>
                    <div className={cx('btn-sidebar')} onClick={handleOpen}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    {back && (
                        <div
                            className={cx('btn-back')}
                            onClick={() => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                    )}
                    <div className={cx('title')}>{title}</div>
                </div>
                <Tippy
                    visible={visible}
                    interactive={true}
                    onClickOutside={hide}
                    placement="bottom"
                    render={(attrs) => (
                        <div className={cx('popper')} tabIndex="-1" {...attrs}>
                            <div className={cx('content')}>
                                <Button
                                    leftIcon={<FontAwesomeIcon icon={faGear} />}
                                    popperStyle
                                    className={cx('margin')}
                                    to={'/profile'}
                                >
                                    Cài đặt
                                </Button>
                                <Button
                                    leftIcon={
                                        <FontAwesomeIcon
                                            icon={faArrowRightFromBracket}
                                        />
                                    }
                                    popperStyle
                                    onClick={handleLogOut}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        </div>
                    )}
                >
                    <div
                        className={cx('wrapper-info')}
                        onClick={visible ? hide : show}
                    >
                        <img src={image ? image : noImage} className={cx('avt')} />
                        <div className={cx('name')}>{name}</div>
                    </div>
                </Tippy>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Slide direction="right" in={open}>
                    <Box sx={style}>
                        <SideBar className={cx('custom')} />
                    </Box>
                </Slide>
            </Modal>
        </div>
    );
}

export default Header;

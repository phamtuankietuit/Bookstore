import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';
import classNames from 'classnames/bind';
import styles from './MultiSelectModal.module.scss';
import { Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalProduct from './ModalProduct';
import * as ProductServices from '~/apiServices/productServices';

const cx = classNames.bind(styles);

function MultiSelectModal({ funtion, supplierID }) {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([])
    const [iscall, setIscall] = useState(0)
    useEffect(() => {

        if (iscall === 0) {
            if (supplierID === 'none') {
                const fetchApi = async () => {

                    const result = await ProductServices.getAllProductsTwo(7, -1)
                        .catch((err) => {
                            console.log(err);
                        });

                    if (result) {
                        setList(result.data);
                    }
                    // console.log(result)
                }
                fetchApi();
                setIscall(1)
            }
            else if (supplierID !== '') {

                const fetchApi = async () => {
                    const result = await ProductServices.getProductsOfSupplier(7, -1, supplierID)
                        .catch((err) => {
                            console.log(err);
                        });

                    if (result) {
                        setList(result.data);
                    }
                    // console.log(result)
                }
                fetchApi();
                setIscall(1)
            }
            else {
                setList([]);
            }
        }
    }, [supplierID]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setIscall(0)
    };

    const handlesubmit = (value) => {
        handleClose()
        funtion(value)
    }


    return (
        <div>
            <div onClick={handleOpen} className={`justify-content-center align-items-center d-flex ${cx('multi-open')}`}>
                Chọn nhiều
            </div>

            <Modal open={open} onClose={handleClose}>
                <Slide in={open}>
                    <Box className={cx('box')}>
                        {
                            open === true ? (
                                <ModalProduct list={list} handleClose={handleClose} handlesubmit={handlesubmit} />

                            ) : (
                                <div>

                                </div>
                            )
                        }

                    </Box>

                </Slide>
            </Modal>
        </div >
    );
}

export default MultiSelectModal;
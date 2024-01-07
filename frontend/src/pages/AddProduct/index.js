import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { faCircleXmark, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './AddProduct.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';

import { ToastContext } from '~/components/ToastContext';

import * as productServices from '~/apiServices/productServices';
import * as typeProductServices from '~/apiServices/typeProductServices';
import * as supplierServices from '~/apiServices/supplierServices';
import * as supplierGroupServices from '~/apiServices/supplierGroupServices';

import { getLocalStorage } from '~/store/getLocalStorage';

const cx = classNames.bind(styles);

function AddProduct() {
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // OPTIONS
    const [optionsLSP, setOptionsLSP] = useState([]);
    const [optionsSupplier, setOptionsSupplier] = useState([]);
    const [optionsPublisher, setOptionsPublisher] = useState([]);
    const [optionsAuthor, setOptionsAuthor] = useState([]);
    const [optionsManufacturer, setOptionsManufacturer] = useState([]);
    const [optionsSupplierGroups, setOptionsSupplierGroups] = useState([]);

    // SELECTED
    const [selectedLSP, setSelectedLSP] = useState();
    const [selectedSupplier, setSelectedSupplier] = useState();
    const [selectedPublisher, setSelectedPublisher] = useState();
    const [selectedAuthor, setSelectedAuthor] = useState();
    const [selectedManufacturer, setSelectedManufacturer] = useState();
    const [selectedSupplierGroups, setSelectedSupplierGroups] = useState();

    // GET DATA CATES
    const getCate = async () => {
        const response = await typeProductServices.getAllProductTypes(1, -1)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.data.map((cate) => ({ label: cate.text, value: cate.categoryId, obj: cate }));
            setOptionsLSP(data);
        }
    }

    // GET DATA SUPPLIERS
    const getSup = async () => {
        const response = await supplierServices.getAllSuppliers(1, -1)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.data.map((sup) => ({ label: sup.name, value: sup.supplierId, obj: sup }));
            setOptionsSupplier(data);
        }
    };

    // GET DATA PUBLISHERS
    const getPub = async () => {
        const response = await productServices.getDetails('publisher')
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.map((pub, index) => ({ label: pub, value: index }));
            setOptionsPublisher(data);
        }
    };

    // GET DATA AUTHORS
    const getAuth = async () => {
        const response = await productServices.getDetails('author')
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.map((auth, index) => ({ label: auth, value: index }));
            setOptionsAuthor(data);
        }
    };

    // GET DATA MANUFACTURERS
    const getManu = async () => {
        const response = await productServices.getDetails('manufacturer')
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.map((manu, index) => ({ label: manu, value: index }));
            setOptionsManufacturer(data);
        }
    };

    // GET SUPPLIER GROUPS
    const getSupGroup = async () => {
        const response = await supplierGroupServices.getAllSupplierGroups(1, -1)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            const data = await response.data.map((supgroup) => ({ label: supgroup.name, value: supgroup.supplierGroupId }));
            setOptionsSupplierGroups(data);
        }
    };

    // GET DATA FOR FILTER
    useEffect(() => {
        getCate();
        getSup();
        getPub();
        getAuth();
        getManu();
        getSupGroup();
        // eslint-disable-next-line no-use-before-define
    }, []);

    // URL IMAGE
    const [images, setImages] = useState([]);

    // IMAGES
    const [files, setFiles] = useState([]);
    const [fileRemove, setFileRemove] = useState();
    const [filesError, setFilesError] = useState(false);

    const uploadImages = async (files) => {
        const formData = new FormData();

        files.map((file) => {
            formData.append('files', file);
        });

        console.log(formData.getAll('files'));

        const fetch = async () => {
            const response = await productServices.uploadImage(formData)
                .catch((error) => {
                    toastContext.notify('error', 'Có lỗi xảy ra');
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });

            if (response) {
                setImages(response.data);
            }
        }

        fetch();
    }

    const handleAddImages = (e) => {
        if (e.target.files.length + files.length < 6) {
            const arr = Array.from(e.target.files).map((file) => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setFiles((prev) => {

                uploadImages([...arr, ...prev]);

                return [...arr, ...prev];
            });

        } else {
            setFilesError(true);
        }

        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        console.log(files[index], images[index]);

        setFileRemove(files[index]);
        const newFiles = files;
        files.splice(index, 1);
        setFiles(newFiles);


        const a = images[index].split('/');
        deleteImages(a[a.length - 1]);
    };

    const deleteImages = async (blobName) => {
        const response = await productServices.deleteImage(blobName)
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        if (response) {
            console.log(response);
        }
    }

    useEffect(() => {
        return () => {
            fileRemove && URL.revokeObjectURL(fileRemove.preview);
        };
    }, [fileRemove]);

    // NAME
    const [name, setName] = useState('');
    const onChangeName = (value) => {
        setName(value);
    };
    const [errorName, setErrorName] = useState('');

    // DISCRIPTION
    const [desc, setDesc] = useState('');
    const onChangeDesc = (value) => {
        setDesc(value);
    };

    // COST
    const [cost, setCost] = useState('0');
    const onChangeCost = (number) => {
        setCost(number);
    };

    // PRICE
    const [price, setPrice] = useState('0');
    const onChangePrice = (number) => {
        setPrice(number);
    };

    // STORE
    const [store, setStore] = useState('0');
    const onChangeStore = (number) => {
        setStore(number);
    };

    // PUBLISH YEAR
    const [publishYear, setPublishYear] = useState('');
    const onChangeYear = (number) => {
        setPublishYear(number);
    };

    // MANUFACTURER
    const [manufacturer, setManufacturer] = useState('');

    // AUTHOR
    const [author, setAuthor] = useState('');

    // PUBLISHER
    const [publisher, setPublisher] = useState('');

    // SUPPLIER
    const [supplier, setSupplier] = useState('');
    const [errorSupplier, setErrorSupplier] = useState('');

    // PRODUCT TYPE
    const [productType, setProductType] = useState('');
    const onChangeProductType = (item) => {
        setProductType(item.label);
        setSelectedLSP(item);

        if (Number(item.obj.categoryId.slice(-5)) === 0) {
            setBookProps(true);
            setRestProps(true);
        } else if (Number(item.obj.categoryId.slice(-5)) <= 7) {
            setRestProps(false);
            setBookProps(true);
        } else {
            setBookProps(true);
            setRestProps(true);
        }
    };

    // STATUS
    const [status, setStatus] = useState(true);

    // VISIBILITY PROPS
    const [bookProps, setBookProps] = useState(true);
    const [restProps, setRestProps] = useState(true);

    // MODAL LOADING
    const [loading, setLoading] = useState(false);

    // MODAL
    const [titleModal, setTitleModal] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);

    const handleCloseModal = () => {
        if (titleModal === 'Thêm loại sản phẩm') {
            handleClearType();
        } else {
            handleClearSup();
        }
        setOpenModal(false);
    };

    // ADD TYPE
    const handleOpenType = () => {
        setTitleModal('Thêm loại sản phẩm');
        handleOpenModal();
    };

    const handleClearType = () => {
        setNameType('');
        setErrorType('');
    };

    const [nameType, setNameType] = useState('');
    const [errorType, setErrorType] = useState('');

    // ADD SUPPLIER
    const handleOpenSupplier = () => {
        setTitleModal('Thêm nhà cung cấp');
        handleOpenModal();
    };

    const handleClearSup = () => {
        setNameSup('');
        setErrorSup('');
        setPhoneSup('');
        setEmailSup('');
        setAddressSup('');
        setGroupSup('');
    };

    const [nameSup, setNameSup] = useState('');
    const [errorSup, setErrorSup] = useState('');
    const [phoneSup, setPhoneSup] = useState('');
    const [emailSup, setEmailSup] = useState('');
    const [addressSup, setAddressSup] = useState('');
    const [groupSup, setGroupSup] = useState('');

    // VALIDATION
    const handleValidation = () => {
        if (titleModal === 'Thêm loại sản phẩm') {
            if (nameType === '') {
                setErrorType('Không được bỏ trống');
            } else {
                //    THÊM LOẠI SẢN PHẨM
                const fetchApi = async () => {
                    setLoading(true);

                    const result = await typeProductServices.createProductType({ text: nameType })
                        .catch((error) => {
                            if (error.response.status === 409) {
                                setLoading(false);
                                toastContext.notify('error', 'Loại sản phẩm đã tồn tại');
                            } else {
                                toastContext.notify('error', 'Có lỗi xảy ra');
                            }
                        });

                    if (result) {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm loại sản phẩm thành công');
                        handleCloseModal();
                        getCate();
                    }
                }
                fetchApi();
            }
        } else {
            if (nameSup === '') {
                setErrorSup('Không được bỏ trống');
            } else {
                setLoading(true);
                //    THÊM NHÀ CUNG CẤP
                const fetchApi = async () => {
                    setLoading(true);

                    const result = await supplierServices
                        .CreateSuppliers({
                            name: nameSup,
                            supplierGroupId: selectedSupplierGroups ? selectedSupplierGroups.supplierGroupId : 'supg00000',
                            supplierGroupName: selectedSupplierGroups ? selectedSupplierGroups.name : 'Khác',
                            contact: {
                                phone: phoneSup,
                                email: emailSup,
                            },
                            address: addressSup,
                            isActive: true,
                        })
                        .catch((error) => {
                            toastContext.notify('error', 'Có lỗi xảy ra');
                        });

                    if (result) {
                        setLoading(false);
                        toastContext.notify('success', 'Thêm nhà cung cấp thành công');
                        handleCloseModal();
                        getSup();
                    }
                }
                fetchApi();
            }
        }
    };

    // CREATE OBJECT PRODUCT
    const createObjectProduct = async () => {
        const data = props.filter(prop => {
            if (prop.propName !== '' && prop.value !== '') {
                return ({ name: prop.propName, value: prop.value });
            }
        }).map(prop => ({ name: prop.propName, value: prop.value }));

        const object = {
            categoryId: selectedLSP ? selectedLSP.obj.categoryId : 'cate00000',
            categoryName: selectedLSP ? selectedLSP.obj.name : 'khac',
            categoryText: selectedLSP ? productType : 'Khác',
            supplierId: selectedSupplier.obj.supplierId,
            supplierName: selectedSupplier.obj.name,
            name,
            currentStock: Number(store.replace(/,/g, '')),
            description: desc,
            salePrice: Number(price.replace(/,/g, '')),
            purchasePrice: Number(cost.replace(/,/g, '')),
            details: {
                ...(author && { author }),
                ...(publishYear && { publishYear }),
                ...(publisher && { publisher }),
                ...(manufacturer && { manufacturer }),
            },
            optionalDetails: [
                ...data,
            ],
            isActive: status,
            images: [
                ...images,
            ],
            staffId: getLocalStorage().user.staffId,
        }

        if (bookProps === true && restProps === false) {
            delete object.details.manufacturer;
        } else if (bookProps === false && restProps === true) {
            delete object.details.publisher;
            delete object.details.publishYear;
            delete object.details.author;
        }

        return object;
    }

    // FROM
    const handleSubmit = () => {
        if (name === '' || supplier === '') {
            if (name === '')
                setErrorName('Không được bỏ trống');

            if (supplier === '')
                setErrorSupplier('Không được bỏ trống');

            toastContext.notify('error', 'Chưa điền các trường bắt buộc');
        } else {
            // ADD PRODUCT
            setLoading(true);

            const fetch = async () => {
                const obj = await createObjectProduct();

                console.log('OBJECT', obj);

                const response = await productServices.createProduct(obj)
                    .catch((error) => {
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                        setLoading(false);
                        toastContext.notify('error', 'Có lỗi xảy ra');
                    });

                if (response) {
                    setLoading(false);
                    console.log(response);
                    toastContext.notify('success', 'Thêm sản phẩm thành công');
                    navigate('/products/detail/' + response.productId);
                }
            }

            fetch();
        }
    };

    const handleExit = () => {
        navigate(-1);
    };

    // ADD PROPS
    const [props, setProps] = useState([]);

    const addProps = () => {
        setProps(pre => [...pre, {
            propName: '',
            value: '',
        }]);
    }

    const deleteProps = (index) => {
        const newProps = [...props];

        newProps.splice(index, 1);

        setProps(newProps);
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <div className={cx('col1')}>
                        <Wrapper title={'Ảnh sản phẩm'} className={cx('m-b')}>
                            <div className={cx('list-img')}>
                                <input
                                    id="addImg"
                                    type="file"
                                    className={cx('input')}
                                    accept="image/png,image/gif,image/jpeg"
                                    multiple
                                    onChange={handleAddImages}
                                />
                                <label
                                    htmlFor="addImg"
                                    className={cx('add-img')}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </label>
                                {files.map((file, index) => (
                                    <div key={index} className={cx('img-box')}>
                                        <div
                                            className={cx('del-img')}
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                className={cx('del-icon')}
                                                icon={faXmark}
                                            />
                                        </div>
                                        <img
                                            className={cx('img')}
                                            src={file.preview}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                            {filesError && (
                                <div className={cx('warning')}>
                                    * Tối đa 5 ảnh
                                </div>
                            )}
                        </Wrapper>

                        <Wrapper
                            title={'Thông tin chung'}
                            className={cx('m-b')}
                        >
                            <Input
                                title={'Tên sản phẩm'}
                                required
                                value={name}
                                onChange={onChangeName}
                                className={cx('m-b')}
                                error={errorName}
                            />

                            <Input
                                title={'Mô tả sản phẩm'}
                                value={desc}
                                onChange={onChangeDesc}
                                textarea
                                rows={5}
                            />
                        </Wrapper>

                        <Wrapper title={'Giá sản phẩm'} className={cx('m-b')}>
                            <div className={cx('price-cost', 'm-b')}>
                                <Input
                                    title={'Giá nhập'}
                                    className={cx('cost')}
                                    required
                                    money
                                    value={cost}
                                    onChangeMoney={onChangeCost}
                                />
                                <Input
                                    title={'Giá bán'}
                                    className={cx('price')}
                                    required
                                    money
                                    value={price}
                                    onChangeMoney={onChangePrice}
                                />
                            </div>
                        </Wrapper>

                        <Wrapper title={'Kho hàng'} className={cx('m-b')}>
                            <Input
                                title={'Tồn kho'}
                                className={cx('m-b')}
                                required
                                money
                                value={store}
                                onChangeMoney={onChangeStore}
                            />
                        </Wrapper>

                        <Wrapper title={'Thuộc tính'} className={cx('m-b')}>
                            {restProps && (
                                <Input
                                    className={cx('m-b')}
                                    title={'Thương hiệu'}
                                    items={optionsManufacturer}
                                    value={manufacturer}
                                    onChange={(value) => {
                                        setManufacturer(value);
                                    }}
                                    handleClickAction={(item) => {
                                        setManufacturer(item.label);
                                        setSelectedManufacturer(item);
                                    }}
                                />
                            )}
                            {bookProps && (
                                <div>
                                    <Input
                                        className={cx('m-b')}
                                        title={'Năm xuất bản'}
                                        number
                                        value={publishYear}
                                        onChangeNumber={onChangeYear}
                                    />
                                    <Input
                                        className={cx('m-b')}
                                        title={'Tác giả'}
                                        items={optionsAuthor}
                                        value={author}
                                        onChange={(value) => {
                                            setAuthor(value);
                                        }}
                                        handleClickAction={(item) => {
                                            setAuthor(item.label);
                                            setSelectedAuthor(item);
                                        }}
                                    />
                                    <Input
                                        className={cx('m-b')}
                                        title={'Nhà xuất bản'}
                                        items={optionsPublisher}
                                        value={publisher}
                                        onChange={(value) => {
                                            setPublisher(value);
                                        }}
                                        handleClickAction={(item) => {
                                            setPublisher(item.label);
                                            setSelectedPublisher(item);
                                        }}
                                    />
                                </div>
                            )}
                            {props.map((prop, index) => (
                                <div key={index} className={cx('two', 'm-b')}>
                                    <Input
                                        className={cx('first')}
                                        title={'Tên thuộc tính'}
                                        onChange={(value) => { prop.propName = value; }}
                                    />
                                    <Input
                                        className={cx('second')}
                                        title={'Giá trị'}
                                        onChange={(value) => { prop.value = value; }}
                                    />
                                    <FontAwesomeIcon
                                        className={cx('two-icon')}
                                        icon={faCircleXmark}
                                        onClick={() => deleteProps(index)}
                                    />
                                </div>
                            ))}
                            <Button
                                solidBlue
                                onClick={addProps}
                            >
                                Thêm thuộc tính
                            </Button>
                        </Wrapper>
                    </div>
                    <div className={cx('col2')}>
                        <Wrapper
                            title={'Thông tin bổ sung'}
                            className={cx('m-b')}
                        >
                            <div className={cx('two-cols', 'm-b')}>
                                <Input
                                    title={'Loại sản phẩm'}
                                    items={optionsLSP}
                                    value={productType}
                                    handleClickAction={onChangeProductType}
                                    readOnly
                                />
                                <Button
                                    className={cx('btn-add')}
                                    solidBlue
                                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                    onClick={handleOpenType}
                                ></Button>
                            </div>

                            <div className={cx('two-cols', 'm-b')}>
                                <Input
                                    title={'Nhà cung cấp'}
                                    items={optionsSupplier}
                                    value={supplier}
                                    handleClickAction={(item) => {
                                        setSupplier(item.label);
                                        setSelectedSupplier(item);
                                    }}
                                    error={errorSupplier}
                                    readOnly
                                    required
                                />
                                <Button
                                    className={cx('btn-add')}
                                    solidBlue
                                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                    onClick={handleOpenSupplier}
                                ></Button>
                            </div>
                        </Wrapper>

                        <Wrapper title={'Trạng thái'}>
                            <div className={cx('status-wrapper')}>
                                <div>Cho phép bán</div>
                                <Switch
                                    checked={status}
                                    onChange={() => setStatus(!status)}
                                />
                            </div>
                        </Wrapper>
                    </div>
                </div>
                <div className={cx('action')}>
                    <Button outlineBlue onClick={handleExit}>
                        Thoát
                    </Button>
                    <Button
                        solidBlue
                        className={cx('margin')}
                        onClick={handleSubmit}
                    >
                        Lưu
                    </Button>
                </div>
            </div>

            <ModalComp
                open={openModal}
                handleClose={handleCloseModal}
                title={titleModal}
                actionComponent={
                    <div>
                        <Button
                            className={cx('btn-cancel')}
                            outlineRed
                            onClick={handleCloseModal}
                        >
                            Hủy
                        </Button>
                        <Button
                            className={cx('btn-ok', 'm-l-10')}
                            solidBlue
                            onClick={handleValidation}
                        >
                            Thêm
                        </Button>
                    </div>
                }
            >
                {titleModal === 'Thêm loại sản phẩm' && (
                    <Input
                        title={'Tên loại sản phẩm'}
                        value={nameType}
                        onChange={(value) => setNameType(value)}
                        error={errorType}
                        required
                    />
                )}
                {titleModal === 'Thêm nhà cung cấp' && (
                    <div>
                        <div className={cx('wrapper-sup', 'm-b')}>
                            <div className={cx('col-1')}>
                                <Input
                                    className={cx('m-b')}
                                    title={'Tên nhà cung cấp'}
                                    required
                                    error={errorSup}
                                    value={nameSup}
                                    onChange={(value) => setNameSup(value)}
                                />
                                <Input
                                    title={'Email'}
                                    value={emailSup}
                                    onChange={(value) => setEmailSup(value)}
                                />
                            </div>
                            <div className={cx('col-2')}>
                                <Input
                                    className={cx('m-b')}
                                    title={'Số điện thoại'}
                                    number
                                    value={phoneSup}
                                    onChangeNumber={(number) =>
                                        setPhoneSup(number)
                                    }
                                />
                                <Input
                                    title={'Nhóm nhà cung cấp'}
                                    items={optionsSupplierGroups}
                                    readOnly
                                    value={groupSup}
                                    handleClickAction={(item) => {
                                        setGroupSup(item.label);
                                        setSelectedSupplierGroups(item);
                                    }}
                                />
                            </div>
                        </div>
                        <Input
                            title={'Địa chỉ'}
                            value={addressSup}
                            onChange={(value) => setAddressSup(value)}
                        />
                    </div>
                )}
            </ModalComp>
            <ModalLoading open={loading} title={'Đang tải'} />
        </div>
    );
}

export default AddProduct;

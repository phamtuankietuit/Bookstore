import { useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import styles from './UpdateProduct.module.scss';
import Wrapper from '~/components/Wrapper';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ModalComp from '~/components/ModalComp';
import ModalLoading from '~/components/ModalLoading';
import { ToastContext } from '~/components/ToastContext';
import * as ProductServices from '~/apiServices/productServices';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
const cx = classNames.bind(styles);

const product = {
    id: 'SP0001',
    name: 'Hoa hồng giả',
    images: [
        'https://thpthvnbinhduong.edu.vn/wp-content/uploads/2023/02/hoa-hong-do.jpg',
        'https://cdn.tgdd.vn/Files/2021/01/19/1321035/hieu-ro-y-nghia-hoa-hong-giup-ban-chinh-phuc-nang-.jpg',
    ],
};

function UpdateProduct() {
    const productid = useParams();
    const [obj, setObj] = useState(null)
    useEffect(() => {
        // CALL API

        const fetchApi = async () => {
            // console.log(productid.id)
            const result = await ProductServices.getProduct(productid.id)
                .catch((err) => {
                    console.log(err);

                });
            setObj(result)
            setName(result.name)
            setDesc(result.description)
            setCost(result.salePrice)
            setPrice(result.purchasePrice)
            setStore(result.currentStock)
            setYear(result.details.publishYear)
            setManufacturer(result.details.supplierName)
            setAuthor(result.details.author)
            setPublisher(result.details.publisher)
            setStatus(result.isActive)
            setProductType(result.categoryName)
            setFiles(result.images)

        }

        fetchApi();

    }, []);

    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    // IMAGES
    const [files, setFiles] = useState([]);
    const [fileRemove, setFileRemove] = useState();
    const [filesError, setFilesError] = useState(false);

    const handleAddImages = (e) => {
        if (e.target.files.length + files.length < 6) {
            const arr = Array.from(e.target.files).map((file) => {
                file.preview = URL.createObjectURL(file);
                return file;
            });

            setFiles((prev) => [...arr, ...prev]);
        } else {
            setFilesError(true);
        }

        e.target.value = null;
    };

    const handleRemoveImage = (index) => {
        setFileRemove(files[index]);
        const newFiles = files;
        files.splice(index, 1);
        setFiles(newFiles);
    };

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
    const [cost, setCost] = useState(0);
    const onChangeCost = (number) => {
        setCost(number);
    };

    // PRICE
    const [price, setPrice] = useState(0);
    const onChangePrice = (number) => {
        setPrice(number);
    };

    // STORE
    const [store, setStore] = useState(0);
    const onChangeStore = (number) => {
        setStore(number);
    };

    // PUBLISH YEAR
    const [year, setYear] = useState('');
    const onChangeYear = (number) => {
        setYear(number);
    };

    // MANUFACTURER
    const [manufacturer, setManufacturer] = useState('');
    const onChangeManufacturer = (value) => {
        setManufacturer(value);
    };

    // AUTHOR
    const [author, setAuthor] = useState('');
    const onChangeAuthor = (value) => {
        setAuthor(value);
    };

    // PUBLISHER
    const [publisher, setPublisher] = useState('');
    const onChangePublisher = (value) => {
        setPublisher(value);
    };

    // SUPPLIER
    const [supplier, setSupplier] = useState('');
    const onChangeSupplier = (value) => {
        setSupplier(value);
    };

    // PRODUCT TYPE
    const [productType, setProductType] = useState('');
    const onChangeProductType = (value) => {
        setProductType(value);
        if (
            value === 'Sách Thiếu Nhi' ||
            value === 'Sách Giáo Khoa - Tham Khảo' ||
            value === 'Tiểu Thuyết' ||
            value === 'Truyện Ngắn' ||
            value === 'Light Novel' ||
            value === 'Sách Tâm Lý - Kỹ Năng Sống' ||
            value === 'Sách Học Ngoại Ngữ'
        ) {
            setRestProps(false);
            setBookProps(true);
        } else if (
            value === 'Văn phòng phẩm' ||
            value === 'Đồ chơi' ||
            value === 'Quà lưu niệm'
        ) {
            setBookProps(false);
            setRestProps(true);
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
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    handleCloseModal();
                }, 2000);
            }
        } else {
            if (nameSup === '') {
                setErrorSup('Không được bỏ trống');
            } else {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    handleCloseModal();
                }, 2000);
            }
        }
    };

    // FROM
    const handleSubmit = () => {
        const newobj = {
            productId: obj.productId,
            categoryId: obj.categoryId,
            categoryName: obj.categoryName,
            barcode: obj.barcode,
            sku: obj.sku,
            name: name,
            currentStock: store,
            minStock: obj.minStock,
            maxStock: obj.maxStock,
            description: desc,
            salePrice: price,
            purchasePrice: cost,
            attributes: obj.attributes,
            details: {
                supplierName: supplier,
                publishYear: year,
                author: author,
                publisher: publisher
            },
            isActive: status,
            createdAt: obj.createdAt,
            status: obj.status,
            images: files,
            tags: obj.tags
        }
        if (name === '') {
            setErrorName('Không được bỏ trống');
        } else {
            // CALL API
            setLoading(true);

            const fetchApi = async () => {
                // console.log(productid.id)
                const result = await ProductServices.UpdateProduct(newobj)
                    .catch((err) => {
                        console.log(err);
                    });
                if (result) {
                    setTimeout(() => {
                        setLoading(false);
                        toastContext.notify(
                            'success',
                            'Cập nhật sản phẩm thành công',
                        );


                        // console.log(obj)
                    }, 2000);
                }

            }

            fetchApi();


        }
    };

    const handleExit = () => {
        navigate(-1);
    };

    return (
        <div className={cx('wrapper')}>
            {obj === null ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (<div>
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
                                                src={file.preview || file}
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
                                    title={'Mã sản phẩm'}
                                    value={obj.productId}
                                    className={cx('m-b')}
                                    readOnly
                                />
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
                                        items={[
                                            'Thiên Long',
                                            'Deli',
                                            'Hồng Hà',
                                            'Campus',
                                        ]}
                                        value={manufacturer}
                                        onChange={onChangeManufacturer}
                                    />
                                )}
                                {bookProps && (
                                    <div>
                                        <Input
                                            className={cx('m-b')}
                                            title={'Năm xuất bản'}
                                            number
                                            value={year}
                                            onChangeNumber={onChangeYear}
                                        />
                                        <Input
                                            className={cx('m-b')}
                                            title={'Tác giả'}
                                            items={[
                                                'Kim Lân',
                                                'Xuân Diệu',
                                                'Tố Hữu',
                                                'Đoàn Thị Điểm',
                                            ]}
                                            value={author}
                                            onChange={onChangeAuthor}
                                        />
                                        <Input
                                            className={cx('m-b')}
                                            title={'Nhà xuất bản'}
                                            items={[
                                                'Kim Đồng',
                                                'Nguyễn Huy Phát',
                                                'Đại học Quốc gia TPHCM',
                                                'Bộ GD và ĐT',
                                            ]}
                                            value={publisher}
                                            onChange={onChangePublisher}
                                        />
                                    </div>
                                )}
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
                                        items={[
                                            'Sách Thiếu Nhi',
                                            'Sách Giáo Khoa - Tham Khảo',
                                            'Tiểu Thuyết',
                                            'Truyện Ngắn',
                                            'Light Novel',
                                            'Sách Tâm Lý - Kỹ Năng Sống',
                                            'Sách Học Ngoại Ngữ',
                                            'Văn phòng phẩm',
                                            'Đồ chơi',
                                            'Quà lưu niệm',
                                        ]}
                                        value={productType}
                                        onChange={onChangeProductType}
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
                                        items={[
                                            'Văn phòng phẩm Kim Sơn',
                                            'Thiên Long',
                                            'Nhà sách Nguyễn Văn Cừ',
                                            'Sách Nguyễn An',
                                        ]}
                                        value={supplier}
                                        onChange={onChangeSupplier}
                                        readOnly
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
                                        items={['Khác']}
                                        readOnly
                                        value={groupSup}
                                        onChange={(value) => setGroupSup(value)}
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
            </div>)}

        </div>
    );
}

export default UpdateProduct;

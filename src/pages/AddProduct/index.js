import styles from './AddProduct.Module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import { useState, useRef } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import AddImg from 'src/assets/images/add-photo-icon.png';
import { FaCaretDown } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';

const cx = classNames.bind(styles);

function AddProduct() {
    //Dropdown
    const [isActive, setIsActive] = useState(false);
    const [isActive2, setIsActive2] = useState(false);
    //Xử lý thêm ảnh
    const [images, setImages] = useState([]);
    const [isDraggging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    const selectFiles = () => {
        fileInputRef.current.click();
    };
    const onFileSelect = (event) => {
        const files = event.target.files;
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] != 'image') continue;
            if (!images.some((e) => e.name === files[i].name)) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },
                ]);
            }
        }
    };
    //Xoá ảnh
    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    //Render thuộc tính
    const [AttributeList, SetAttributeList] = useState([{ attribute: '' }]);

    const AddAttribute = () => {
        SetAttributeList([...AttributeList, { attribute: '' }]);
    };
    return (
        <div className={cx('add-container')}>
            <div className={cx('add-container-image')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                        width: 'fit-content',
                    }}
                >
                    Ảnh sản phẩm
                </h2>
                <div className={cx('choose-img-container')}>
                    <div
                        className={cx('choose-image')}
                        style={{
                            backgroundImage: `url(${AddImg})`,
                        }}
                    >
                        <input
                            name="file"
                            type="file"
                            className={cx('file')}
                            multiple
                            ref={fileInputRef}
                            onChange={onFileSelect}
                        ></input>
                        <p
                            style={{
                                fontSize: '10px',
                                width: '100%',
                                height: 'fit-content',
                                position: 'absolute',
                            }}
                        >
                            Kéo thả hoặc chọn ảnh
                        </p>
                    </div>
                    <div className={cx('img-container')}>
                        {images.map((images, index) => (
                            <div className={cx('image')} key={index}>
                                <span
                                    className={cx('img-delete')}
                                    onClick={() => deleteImage(index)}
                                >
                                    &times;
                                </span>
                                <img src={images.url} alt={images.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cx('add-container-info')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                    }}
                >
                    Thông tin sản phẩm
                </h2>
                <p
                    style={{
                        fontSize: '10px',
                        marginLeft: '26px',
                        marginTop: '10px',
                        color: '#555555',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    Tên sản phẩm
                </p>
                <input
                    className={cx('input-text')}
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    style={{
                        fontSize: '13px',
                        marginLeft: '26px',
                        marginTop: '0px',
                        color: '#55555',
                        width: '535px',
                        height: '40px',
                    }}
                ></input>
                <p
                    style={{
                        fontSize: '10px',
                        marginLeft: '26px',
                        marginTop: '5px',
                        color: '#555555',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    Vị trí sản phẩm
                </p>
                <input
                    className={cx('input-text')}
                    type="text"
                    placeholder="Nhập vị trí sản phẩm"
                    style={{
                        fontSize: '13px',
                        marginLeft: '26px',
                        marginTop: '0px',
                        color: '#55555',
                        width: '535px',
                        height: '40px',
                    }}
                ></input>
                <p
                    style={{
                        fontSize: '10px',
                        marginLeft: '26px',
                        marginTop: '5px',
                        color: '#555555',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    Mô tả sản phẩm
                </p>
                <textarea
                    style={{
                        fontSize: '13px',
                        marginLeft: '26px',
                        marginTop: '0px',
                        color: '#55555',
                        width: '535px',
                        height: '140px',
                    }}
                ></textarea>
            </div>
            {/* Thuộc tính */}
            <div className={cx('add-container-attribute')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                    }}
                >
                    Thuộc tính
                </h2>
                {AttributeList.map((singleAttribute, index) => (
                    <div key={index} className={cx('attribute-group')}>
                        <p
                            style={{
                                fontSize: '14px',
                                top: '0px',
                                position: 'absolute',
                                left: '20px',
                            }}
                        >
                            Tên thuộc tính
                        </p>
                        <input
                            className={cx('input-text')}
                            id="attributeName"
                            name="attributeName"
                            type="text"
                            style={{
                                fontSize: '14px',
                                position: 'absolute',
                                top: '30px',
                                width: '153px',
                                height: '35px',
                                left: '20px',
                            }}
                        ></input>
                        <p
                            style={{
                                fontSize: '14px',
                                top: '0px',
                                position: 'absolute',
                                left: '190px',
                            }}
                        >
                            Giá trị thuộc tính
                        </p>
                        <input
                            className={cx('input-text')}
                            id="attributeValue"
                            name="attributeValue"
                            type="text"
                            style={{
                                fontSize: '14px',
                                position: 'absolute',
                                left: '190px',
                                top: '30px',
                                width: '360px',
                                height: '35px',
                            }}
                        ></input>
                        {AttributeList.length - 1 === index &&
                            AttributeList.length < 4 && (
                                <div
                                    style={{
                                        position: 'relative',
                                        top: '75px',
                                        left: '20px',
                                    }}
                                >
                                    <span className={cx('add-attribute-btn')}>
                                        <BsFillPlusCircleFill
                                            style={{
                                                position: 'absolute',
                                                marginTop: '5px',
                                                color: '#6699FF',
                                            }}
                                        ></BsFillPlusCircleFill>
                                    </span>
                                    <p
                                        onClick={AddAttribute}
                                        style={{
                                            fontSize: '14px',
                                            marginTop: '5px',
                                            position: 'absolute',
                                            left: '25px',
                                            color: '#6699FF',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Thêm thuộc tính khác
                                    </p>
                                </div>
                            )}
                    </div>
                ))}
            </div>
            {/* Thông tin bổ sung */}
            <div className={cx('add-container-bonusinfo')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                    }}
                >
                    Thông tin bổ sung
                </h2>
                <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '0px',
                        height: 'fit-content',
                    }}
                >
                    Loại sản phẩm
                </p>
                <div className={cx('dropdown')}>
                    <div
                        className={cx('dropdown-btn')}
                        onClick={(e) => setIsActive(!isActive)}
                    >
                        Chọn loại sản phẩm
                        <FaCaretDown className={cx('caret-down')}></FaCaretDown>
                    </div>
                    {/* {isActive && <div className={cx('dropdown-content')}></div>} */}
                    {isActive && (
                        <div className={cx('dropdown-content')}>
                            <div className={cx('search-container')}>
                                <IoSearch
                                    className={cx('search-icon')}
                                ></IoSearch>
                                <input
                                    type="text"
                                    className={cx('searchbar')}
                                    placeholder="Tìm kiếm"
                                ></input>
                            </div>
                            <div className={cx('add-type-container')}>
                                <BsFillPlusCircleFill
                                    style={{
                                        position: 'absolute',
                                        marginLeft: '50px',
                                    }}
                                />
                                <p
                                    style={{
                                        height: 'fit-content',
                                        marginLeft: '70px',
                                    }}
                                >
                                    Thêm mới loại sản phẩm
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '0px',
                        height: 'fit-content',
                    }}
                >
                    Nhóm sản phẩm
                </p>
                <div className={cx('dropdown')}>
                    <div
                        className={cx('dropdown-btn')}
                        onClick={(e) => setIsActive2(!isActive2)}
                    >
                        Chọn nhóm sản phẩm
                        <FaCaretDown className={cx('caret-down')}></FaCaretDown>
                    </div>
                    {/* {isActive && <div className={cx('dropdown-content')}></div>} */}
                    {isActive2 && (
                        <div className={cx('dropdown-content2')}>
                            <div className={cx('search-container')}>
                                <IoSearch
                                    className={cx('search-icon')}
                                ></IoSearch>
                                <input
                                    type="text"
                                    className={cx('searchbar')}
                                    placeholder="Tìm kiếm"
                                ></input>
                            </div>
                            <div className={cx('add-type-container')}>
                                <BsFillPlusCircleFill
                                    style={{
                                        position: 'absolute',
                                        marginLeft: '50px',
                                    }}
                                />
                                <p
                                    style={{
                                        height: 'fit-content',
                                        marginLeft: '70px',
                                    }}
                                >
                                    Thêm mới nhóm sản phẩm
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '0px',
                        height: 'fit-content',
                    }}
                >
                    Nhóm sản phẩm
                </p> */}
            </div>
            <div className={cx('add-container-price')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                    }}
                >
                    Giá bán
                </h2>
                <div className={cx('price-group')}>
                    <p
                        style={{
                            fontSize: '14px',
                            top: '10px',
                            position: 'absolute',
                        }}
                    >
                        Giá bán tại cửa hàng
                    </p>
                    <input
                        className={cx('input-text')}
                        type="text"
                        placeholder="0"
                        style={{
                            fontSize: '14px',
                            position: 'absolute',
                            top: '35px',
                            width: '136px',
                            height: '35px',
                        }}
                    ></input>
                    <p
                        style={{
                            fontSize: '14px',
                            top: '10px',
                            position: 'absolute',
                            left: '170px',
                        }}
                    >
                        Giá vốn
                    </p>
                    <input
                        className={cx('input-text')}
                        type="text"
                        placeholder="0"
                        style={{
                            fontSize: '14px',
                            position: 'absolute',
                            left: '170px',
                            top: '35px',
                            width: '136px',
                            height: '35px',
                        }}
                    ></input>
                </div>
            </div>
            <div className={cx('add-container-status')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '5px',
                    }}
                >
                    Trạng thái
                </h2>
                <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '0px',
                        width: 'fit-content',
                        height: 'fit-content',
                    }}
                >
                    Cho phép bán
                </p>
                <div class="checkbox-wrapper-3">
                    <input type="checkbox" id="cbx-3" />
                    <label for="cbx-3" class="toggle">
                        <span></span>
                    </label>
                </div>
            </div>
            <div className={cx('add-container-newproduct')}>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '5px',
                    }}
                >
                    Khởi tạo kho hàng
                </h2>
                <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '5px',
                    }}
                >
                    Tồn kho ban đầu
                </p>
                <input
                    className={cx('input-text')}
                    type="text"
                    placeholder="0"
                    style={{
                        fontSize: '14px',
                        position: 'absolute',
                        left: '190px',
                        top: '30px',
                        width: '136px',
                        height: '28px',
                    }}
                ></input>
            </div>
            <button
                className={cx('white-btn')}
                style={{
                    marginLeft: '1127px',
                    marginTop: '745px',
                }}
            >
                Thoát
            </button>
            <button className={cx('white-btn')}>Lưu và in mã vạch</button>
            <button className={cx('blue-btn')}>Lưu</button>
        </div>
    );
}

export default AddProduct;

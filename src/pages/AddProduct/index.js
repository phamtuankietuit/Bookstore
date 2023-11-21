import styles from './AddProduct.Module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import { useState, useRef } from 'react';
import { AiOutlineInfoCircle, AiFillCaretDown } from 'react-icons/ai';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import AddImg from './images/add-photo-icon-vector-line-260nw-1039350133.webp';

const cx = classNames.bind(styles);

function AddProduct() {
    const inputRef = useRef(null);

    const [image, setImage] = useState('');

    const [AttributeList, SetAttributeList] = useState([{ attribute: '' }]);

    const AddAttribute = () => {
        SetAttributeList([...AttributeList, { attribute: '' }]);
    };

    const HandleImageClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setImage(event.target.files[0]);
    };
    return (
        <div className={cx('add-container')}>
            <div className={cx('add-container-image')}>
                <div className={cx('tooltip-container')}>
                    <span className={cx('tooltip')}>
                        <AiOutlineInfoCircle id="infor-icon" />
                    </span>
                    <div className={cx('tooltip-content')}>
                        <p>
                            Thêm ảnh cho sản phẩm của bạn
                            <br></br>
                            Lưu ý: Có thể thêm tối đa 5 ảnh
                        </p>
                    </div>
                </div>
                <h2
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginTop: '12px',
                    }}
                >
                    Ảnh sản phẩm
                </h2>
                <div className={cx('choose-img-container')}>
                    <div
                        className={cx('choose-image')}
                        onClick={HandleImageClick}
                        onChange={handleImageChange}
                    >
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt=""
                                style={{
                                    position: 'absolute',
                                    height: '65px',
                                    width: '65px',
                                    left: '-1px',
                                    top: '-1px',
                                }}
                            />
                        ) : (
                            <img
                                src="./add-photo-icon-vector-line-260nw-1039350133.webp"
                                alt=""
                            />
                        )}
                        <input
                            className={cx('inputfile')}
                            type="file"
                            ref={inputRef}
                        />
                    </div>
                    <div className={cx('choose-image')}></div>
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
                    }}
                >
                    Tên sản phẩm
                </p>
                <div
                    className={cx('tooltip-container')}
                    style={{
                        marginTop: '-90px',
                        marginLeft: '90px',
                    }}
                >
                    <span className={cx('tooltip')}>
                        <AiOutlineInfoCircle id="infor-icon" />
                    </span>
                    <div className={cx('tooltip-content')}>
                        <p>
                            Tên sản phẩm không bao gồm các giá trị như kích
                            thước, màu sắc,...
                        </p>
                    </div>
                </div>
                <input
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
                    }}
                >
                    Vị trí sản phẩm
                </p>
                <div
                    className={cx('tooltip-container')}
                    style={{
                        marginTop: '-90px',
                        marginLeft: '95px',
                    }}
                >
                    <span className={cx('tooltip')}>
                        <AiOutlineInfoCircle id="infor-icon" />
                    </span>
                    <div className={cx('tooltip-content')}>
                        <p>
                            Nhập vị trí của sản phẩm.
                            <br></br>
                            VD: Tầng 1, kệ A,...
                        </p>
                    </div>
                </div>
                <input
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
                {/* <div className={cx('attribute-group')}>
                <p style={{
                fontSize: '14px',
                top: '-10px',
                position: 'absolute',
                }}>Tên thuộc tính</p>
                <input id='attributeName' name='attributeName' type='text' style={{
                fontSize: '14px',
                position: 'absolute',
                top: '30px',
                width: '153px',
                height: '35px'
                }}></input>
                <p style={{
                fontSize: '14px',
                top: '-10px',
                position: 'absolute',
                left: '170px'
                }}>Giá trị thuộc tính</p>
                <input id='attributeValue' name='attributeValue' type='text' style={{
                fontSize: '14px',
                position: 'absolute',
                left: '170px',
                top: '30px',
                width: '360px',
                height: '35px'
                }}></input>
            </div> */}
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
                    }}
                >
                    Loại sản phẩm
                </p>
                {/* <div className={cx("dropdown-menu")}>
          <div className={cx("dropdown")} onClick={ToggleDropdown}>
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              Chọn loại sản phẩm
            </span>
          </div>
          <div className={cx("options")}></div>
          <div></div>
        </div> */}
                <p
                    style={{
                        fontSize: '14px',
                        marginLeft: '20px',
                        marginTop: '0px',
                    }}
                >
                    Nhóm sản phẩm
                </p>
                <select className={cx('dropdown-menu')}>
                    <option value="Bút">Bút</option>
                    <option value="Vở">Vở</option>
                    <option value="Sách">Sách</option>
                    <option value="Thước">Thước</option>
                </select>
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
                    }}
                >
                    Cho phép bán
                </p>
                <div className="checkbox-wrapper-3">
                    <input type="checkbox" id="cbx-3" />
                    <label htmlFor="cbx-3" className="toggle">
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

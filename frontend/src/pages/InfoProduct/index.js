import React from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './InfoProduct.module.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from '@mui/material/Switch';
import Properties from '~/components/Properties';
import Specifications from '~/components/Specifications';
import SliderImage from '~/components/SliderImage';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
function InfoProduct() {
    let navigate = useNavigate();
    const gia = [
        {
            id: 1,
            title: 'Giá bán tại cửa hàng',
            value: '919.000'
        },
        {
            id: 2,
            title: 'Giá vốn',
            value: '900.000'
        }
    ]
    const thongso = [
        {
            id: 1,
            title: 'Mã sản phẩm',
            value: 'SP001'
        },
        {
            id: 2,
            title: 'Tồn kho',
            value: '50'
        },
        {
            id: 3,
            title: 'Có thể bán',
            value: '50'
        },
    ]
    const loai = [
        {
            id: 1,
            title: 'Loại sản phẩm',
            value: 'Bút bi lông'
        }
    ]
    const spe = [
        {
            id: 1,
            title: 'Kích thước',
            value: '180 x 150 x 25mm',
        },
        {
            id: 2,
            title: 'Trọng lượng',
            value: '120 gam',
        },
        {
            id: 3,
            title: 'Chất liệu',
            value: 'Thép không gỉ',
        }
    ]

    const listimg = [
        {
            id: 1,
            source: 'https://cdn.vn.alongwalk.info/wp-content/uploads/2023/01/05132418/image-20-hinh-nen-chill-da-dang-va-loi-cuon-cho-cuoc-song-ef0da9d9feb34e98852f691caf004d1a.jpg'
        },
        {
            id: 2,
            source: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9xhn3VRd3InusQcNNIoQ5iASqRmP1zYk0Z6c6wjozowO4T4tepgMY3Ip97PZX8hkmCgA&usqp=CAU'
        },
        {
            id: 3,
            source: 'https://vapa.vn/wp-content/uploads/2022/12/hinh-nen-chill-004.jpg'
        },
        {
            id: 4,
            source: 'https://vapa.vn/wp-content/uploads/2022/12/hinh-nen-chill-007.jpg'
        },
        {
            id: 5,
            source: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDo1qylqBjc7YcUPdULWqTVlLq-DhVF1wgqDpXaZBSpbd-4D1ccyV_IZ2ZWbF9hc3kOkA&usqp=CAU'
        },
        {
            id: 6,
            source: 'https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg'
        },
    ]
    const { productid } = useParams()
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <Row className='w-100 mb-3'>
                        <Col lg={8}>
                            <div className={` ${cx('frame')} h-100`}>
                                <p className={cx('title')}>Thông tin sản phẩm</p>
                                <Row >
                                    <Col lg={5} >
                                        <SliderImage list={listimg} />
                                        <div className='d-flex justify-content-center'><img src='https://bizweb.dktcdn.net/100/319/535/files/screenshot-3-03c05975-1f8e-463e-aec6-9eb87890bd48.png?v=1569317007339' className={cx('barcode')} /></div>

                                    </Col>
                                    <Col lg={7}>
                                        <p className={`w-100 ${cx('name')}`}>Bút lông bi cao cấp Parker IM X-Black CT TB4-1975575</p>
                                        <p>Đã bán 9</p>
                                        <p className={`mb-4 ${cx('name')}`}>919.000 <sup>d</sup></p>
                                        <div className='mb-4'>
                                            <Properties props={loai} stype={0} />
                                        </div>
                                        <div className='mb-4'>
                                            <Specifications props={spe} />
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className={` ${cx('frame')} h-100`}>
                                <p className={cx('title')}>Mô tả sản phẩm</p>
                                <div>

                                    <p className='mb-3'>Là đối tác lý tưởng với tiềm năng vô hạn, sở hữu thiết kế hiện đại, Parker IM khơi nguồn cảm hứng sáng tạo cho những người đang tìm kiếm ý tưởng mới trên con đường khởi nghiệp. Với ngòi thép không gỉ và hoàn thiện theo di sản Parker, mỗi chi tiết được tinh chế để đem đến trải nghiệm viết đáng tin cậy.</p>


                                    <p >Xuất xứ: Trung Quốc</p>
                                    <p >Thương hiệu: Parker</p>
                                    <p >Màu mực: Xanh</p>
                                    <p >Màu thân: Đen</p>
                                    <p >Bảo hành: 24 tháng</p>
                                </div>

                            </div>

                        </Col>
                    </Row>
                    <Row className='w-100'>
                        <Col lg={8}>

                            <div className={cx('frame')}>
                                <p className={cx('title')}>Giá bán</p>
                                <div className='d-flex'>
                                    <Properties props={gia} stype={1} />
                                </div>
                            </div>
                            <div className={`${cx('frame')} mb-3`}>
                                <p className={cx('title')}>Trạng thái</p>
                                <div className='d-flex'>
                                    <p>Cho phép bán</p>
                                    <Switch disabled />
                                </div>
                            </div>
                        </Col>
                        <Col lg={4} >
                            <div className={`${cx('frame')} h-100`}>
                                <p className={cx('title')}>Thông tin bổ sung</p>
                                <Properties props={thongso} stype={0} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='mt-4 text-end me-4'>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="outline-primary" onClick={() => navigate(-1)}>Thoát</Button>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="outline-danger">Xóa</Button>
                            <Button className={`m-1 ${cx('my-btn')}`} variant="primary"><NavLink to={"/product/update/" + productid} className="text-decoration-none text-white" >Sửa sản phẩm</NavLink></Button>{' '}
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
    );
}

export default InfoProduct;
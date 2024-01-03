import React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SliderImage.module.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const cx = classNames.bind(styles);

function SliderImage({ list }) {
    const [imgs, setimgs] = useState([]);
    const [main, setmain] = useState('')
    var settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    useEffect(() => {
        setimgs(list);

        console.log(list);

        if (main === '') setmain(list[0])
    });

    return (
        <div>
            <div className={`d-flex justify-content-center ${cx('main')}`}>

                <img src={main} className={cx('img_main')} />
            </div>

            <div className='d-flex justify-content-center'>
                <Slider {...settings} className={cx('my-slider')}>
                    {
                        imgs.map((img, index) => (
                            <div key={index} className={`m-2 d-flex justify-content-center `}>
                                <img src={img} onClick={() => setmain(img)} className={img.source === main ? `${cx('img-acitve')}` : `${cx('img_small')}`} />
                            </div>
                        ))
                    }

                </Slider>
            </div>
        </div>
    );
}

export default SliderImage;
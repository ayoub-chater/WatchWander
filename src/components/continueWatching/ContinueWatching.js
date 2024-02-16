import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './continueWatching.css';

function ContinueWatching() {
    const [data, setData] = useState([
        { name: 'The Batman' },
        { name: 'Moon Knight' },
    ]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    return (
        <div className="continueWatching">
            <h2>Continue Watching</h2>
        <Slider {...settings}>
            {/* {data.map((item, index) => {
            return ( */}
                <div className="slide">
                {/* {item.name} */}
                    The Batman
                </div>
                <div className="slide2">
                {/* {item.name} */}
                    Moon Knight
                </div>
                <div className="slide">
                {/* {item.name} */}
                    Moon Knight
                </div>
                <div className="slide2">
                {/* {item.name} */}
                    Moon Knight
                </div>
            {/* );
            })} */}
        </Slider>
        </div>
    );
}

export default ContinueWatching;

// ** React Imports
import {Fragment, useEffect, useState} from 'react'

// ** Third Party Components
import classnames from 'classnames'
import { Star } from 'react-feather'
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// ** Reactstrap Imports
import { CardText } from 'reactstrap'


// ** Styles
import '@styles/react/libs/swiper/swiper.scss'
import axios from "axios";

const RelatedProducts = () => {
  SwiperCore.use([Navigation])

  // ** Related products Slides


  const [slides, setSlides] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/products');
      setSlides(response.data.results);
    };

    fetchData();
  }, []);

  // ** Slider params
  const params = {
    className: 'swiper-responsive-breakpoints swiper-container px-4 py-2',
    slidesPerView: 5,
    spaceBetween: 55,
    navigation: true,
    breakpoints: {
      1600: {
        slidesPerView: 4,
        spaceBetween: 55
      },
      1300: {
        slidesPerView: 3,
        spaceBetween: 55
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 55
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 55
      }
    }
  }

  return (
    <Fragment>
      <div className='mt-4 mb-2 text-center'>
        <h4>Related Products</h4>
        <CardText>People also search for this items</CardText>
      </div>
      <Swiper {...params}>
        {slides.map(slide => {
          return (
            <SwiperSlide key={slide.name}>
              <a href='/' onClick={e => e.preventDefault()}>
                <div className='item-heading'>
                  <h5 className='text-truncate mb-0'>{slide.name}</h5>
                  <small className='text-body'>by {slide.brand}</small>
                </div>
                <div className='img-container w-50 mx-auto py-75'>
                  <img src={slide.image} alt='swiper 1' className='img-fluid' />
                </div>
                <div className='item-meta'>
                  <ul className='unstyled-list list-inline mb-25'>
                    {new Array(5).fill().map((listItem, index) => {
                      return (
                        <li key={index} className='ratings-list-item me-25'>
                          <Star
                            className={classnames({
                              'filled-star': index + 1 <= slide.ratings,
                              'unfilled-star': index + 1 > slide.ratings
                            })}
                          />
                        </li>
                      )
                    })}
                  </ul>
                  <CardText className='text-primary mb-0'>${slide.price}</CardText>
                </div>
              </a>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Fragment>
  )
}

export default RelatedProducts

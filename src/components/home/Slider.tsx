import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { LoginModal } from '../auth/LoginModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Slider = () => {
    const [showMobileAuth, setShowMobileAuth] = useState(false);
    const categoryVar = useSelector((state: RootState) => state.category)
    return (
        <section className=" pt-4 md:py-12">
            <div className="container mx-auto px-4 md:px-6">
                <Swiper
                    spaceBetween={10}
                    centeredSlides={false}
                    slidesPerView={1.3}
                    loop={true}
                    speed={1000}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    pagination={false}
                    navigation={false}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    {
                        categoryVar.categoryData.map((item, index) => (
                            <SwiperSlide key={index} onClick={() => setShowMobileAuth(true)}><img src={item.image} alt="slider_image" loading='lazy' className='h-44 w-full object-cover rounded-lg' /></SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

            <LoginModal
                isOpen={showMobileAuth}
                onClose={() => setShowMobileAuth(false)}
                onLoginSuccess={() => { }}
                isMobile={true}
            />
        </section>
    )
}

export default Slider
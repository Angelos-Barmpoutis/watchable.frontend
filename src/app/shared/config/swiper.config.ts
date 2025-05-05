import { SwiperOptions } from 'swiper/types';

export const SWIPER_CONFIG: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    speed: 500,
    freeMode: {
        sticky: true,
        enabled: true,
    },
    navigation: {
        nextEl: '.nav-next',
        prevEl: '.nav-prev',
    },
};

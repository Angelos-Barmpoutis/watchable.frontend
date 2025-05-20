import { SwiperOptions } from 'swiper/types';

import { DEFAULT } from '../constants/defaults.constant';

export const SWIPER_CONFIG: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 12,
    speed: DEFAULT.carouselAnimationDuration,
    freeMode: {
        sticky: true,
        enabled: true,
    },
    navigation: {
        nextEl: '.nav-next',
        prevEl: '.nav-prev',
    },
};

import { AfterViewInit, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

import { DEFAULT } from '../constants/defaults.constant';

let carouselId = 0;

@Directive()
export abstract class BaseCarouselComponent<T> implements AfterViewInit {
    @ViewChild('swiperEl') readonly swiperEl!: ElementRef<SwiperContainer>;
    @Input() isLoading: boolean = false;
    @Input()
    set items(newItems: Array<T>) {
        this._items = newItems;

        if (newItems && newItems.length > 0) {
            // Wait for next CD cycle
            setTimeout(() => this.initializeSwiper());
        }
    }

    get items(): Array<T> {
        return this._items;
    }

    private _items: Array<T> = [];
    readonly carouselId = carouselId++;
    readonly itemsPerPage = DEFAULT.itemsPerPage;
    readonly swiperOptions: SwiperOptions = {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: true,
        speed: 400,
        freeMode: {
            sticky: true,
            enabled: true,
        },
        navigation: {
            nextEl: `.${this.nextButtonClass}`,
            prevEl: `.${this.prevButtonClass}`,
        },
    };

    ngAfterViewInit(): void {
        this.initializeSwiper();
    }

    protected get skeletonArray(): Array<number> {
        return Array(this.itemsPerPage)
            .fill(0)
            .map((_, index) => index);
    }

    protected get prevButtonClass(): string {
        return `nav-prev-${this.carouselId}`;
    }

    protected get nextButtonClass(): string {
        return `nav-next-${this.carouselId}`;
    }

    protected trackByIndex(index: number): number {
        return index;
    }

    protected initializeSwiper(): void {
        if (this.swiperEl && this.swiperEl.nativeElement) {
            // Use updated selector references
            const updatedOptions = {
                ...this.swiperOptions,
                navigation: {
                    nextEl: `.${this.nextButtonClass}`,
                    prevEl: `.${this.prevButtonClass}`,
                },
            };

            Object.assign(this.swiperEl.nativeElement, updatedOptions);

            // Check if swiper is already initialized
            if (this.swiperEl.nativeElement.swiper) {
                this.swiperEl.nativeElement.swiper.update();
            } else {
                this.swiperEl.nativeElement.initialize();
            }
        }
    }
}

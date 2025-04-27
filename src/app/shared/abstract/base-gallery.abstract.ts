import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { register, SwiperContainer } from 'swiper/element';

import { DEFAULT } from '../constants/defaults.constant';

register();

@Directive()
export abstract class BaseGalleryComponent implements OnChanges {
    @Input() selectedIndex?: number;
    @Output() closeViewer = new EventEmitter<void>();
    @ViewChild('viewerStrip') viewerStrip?: ElementRef<SwiperContainer>;
    @ViewChild('previewStrip') previewStrip?: ElementRef<SwiperContainer>;

    readonly DEFAULT = DEFAULT;
    showViewer = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedIndex']) {
            if (changes['selectedIndex'].currentValue !== undefined) {
                this.showViewer = true;
                this.onSelectedIndexChange();
                this.scrollToActiveItem();
            } else {
                this.showViewer = false;
            }
        }
    }

    emitCloseViewer(): void {
        this.closeViewer.emit();
    }

    selectItem(index: number): void {
        this.selectedIndex = index;
        this.onSelectedIndexChange();
        this.scrollToActiveItem();
    }

    onViewerSlideChange(event: Event): void {
        const swiper = (event.target as SwiperContainer).swiper;
        this.selectedIndex = swiper.activeIndex;
        this.onSelectedIndexChange();
        this.scrollToActiveItem();
    }

    protected scrollToActiveItem(): void {
        requestAnimationFrame(() => {
            if (this.previewStrip?.nativeElement?.swiper && this.viewerStrip?.nativeElement?.swiper) {
                const previewSwiper = this.previewStrip.nativeElement.swiper;
                const viewerSwiper = this.viewerStrip.nativeElement.swiper;
                previewSwiper.slideTo(this.selectedIndex ?? 0, DEFAULT.carouselAnimationDuration);
                viewerSwiper.slideTo(this.selectedIndex ?? 0, DEFAULT.carouselAnimationDuration);
            }
        });
    }

    protected abstract onSelectedIndexChange(): void;
}

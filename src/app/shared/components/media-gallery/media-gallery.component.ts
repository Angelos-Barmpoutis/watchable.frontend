import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BACKDROP_SIZE } from '../../enumerations/backdrop-size.enum';
import { Backdrop } from '../../models/media.model';

register();

@Component({
    selector: 'app-media-gallery',
    standalone: true,
    imports: [CommonModule, BackdropPathDirective, FadeInDirective],
    templateUrl: './media-gallery.component.html',
    styleUrls: ['./media-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MediaGalleryComponent implements OnChanges {
    @Input() images: Array<Backdrop> = [];
    @Input() selectedImageIndex?: number;
    @Output() closeViewer = new EventEmitter<void>();
    @ViewChild('viewerStrip') viewerStrip?: ElementRef<SwiperContainer>;
    @ViewChild('previewStrip') previewStrip?: ElementRef<SwiperContainer>;

    readonly BACKDROP_SIZE = BACKDROP_SIZE;
    readonly DEFAULT = DEFAULT;
    showViewer = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedImageIndex']) {
            if (changes['selectedImageIndex'].currentValue !== undefined) {
                this.showViewer = true;
                this.scrollToActiveImage();
            } else {
                this.showViewer = false;
            }
        }
    }

    emitCloseViewer(): void {
        this.closeViewer.emit();
    }

    selectImage(index: number): void {
        this.selectedImageIndex = index;
        this.scrollToActiveImage();
    }

    onViewerSlideChange(event: Event): void {
        const swiper = (event.target as SwiperContainer).swiper;

        this.selectedImageIndex = swiper.activeIndex;
        this.scrollToActiveImage();
    }

    private scrollToActiveImage(): void {
        requestAnimationFrame(() => {
            if (this.previewStrip?.nativeElement?.swiper && this.viewerStrip?.nativeElement?.swiper) {
                const previewSwiper = this.previewStrip.nativeElement.swiper;
                const viewerSwiper = this.viewerStrip.nativeElement.swiper;
                previewSwiper.slideTo(this.selectedImageIndex ?? 0, DEFAULT.carouselAnimationDuration);
                viewerSwiper.slideTo(this.selectedImageIndex ?? 0, DEFAULT.carouselAnimationDuration);
            }
        });
    }
}

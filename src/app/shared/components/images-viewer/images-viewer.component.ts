import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BACKDROP_SIZE } from '../../enumerations/backdrop-size.enum';

interface Image {
    file_path: string;
}

@Component({
    selector: 'app-images-viewer',
    standalone: true,
    imports: [CommonModule, BackdropPathDirective, FadeInDirective],
    templateUrl: './images-viewer.component.html',
    styleUrls: ['./images-viewer.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesViewerComponent {
    @Input() images: Array<Image> = [];
    @Input() isLoading = false;
    @ViewChild('viewerStrip') viewerStrip?: ElementRef<SwiperContainer>;
    @ViewChild('previewStrip') previewStrip?: ElementRef<SwiperContainer>;

    selectedImageIndex = 0;
    showViewer = false;
    readonly BACKDROP_SIZE = BACKDROP_SIZE;
    readonly DEFAULT = DEFAULT;

    openViewer(index: number): void {
        this.selectedImageIndex = index;
        this.showViewer = true;

        requestAnimationFrame(() => {
            if (this.previewStrip?.nativeElement?.swiper !== undefined) {
                this.scrollToActiveImage();
            }
        });
    }

    closeViewer(): void {
        this.showViewer = false;
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
        if (this.previewStrip?.nativeElement?.swiper && this.viewerStrip?.nativeElement?.swiper) {
            const previewSwiper = this.previewStrip.nativeElement.swiper;
            const viewerSwiper = this.viewerStrip.nativeElement.swiper;
            previewSwiper.slideTo(this.selectedImageIndex, 500);
            viewerSwiper.slideTo(this.selectedImageIndex, 500);
        }
    }

    get skeletonArray(): Array<number> {
        return Array(6)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

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
    @ViewChild('previewStrip') previewStrip?: ElementRef<SwiperContainer>;

    selectedImage: Image | null = null;
    selectedImageIndex = 0;
    showViewer = false;
    readonly BACKDROP_SIZE = BACKDROP_SIZE;
    readonly DEFAULT = DEFAULT;

    openViewer(image: Image, index: number, isCounter = false): void {
        this.selectedImage = image;
        this.selectedImageIndex = isCounter ? 5 : index;
        this.showViewer = true;

        requestAnimationFrame(() => {
            if (this.previewStrip?.nativeElement?.swiper !== undefined) {
                this.scrollToActiveThumbnail();
            }
        });
    }

    closeViewer(): void {
        this.showViewer = false;
        this.selectedImage = null;
    }

    prevImage(): void {
        if (this.selectedImageIndex > 0) {
            this.selectedImageIndex--;
            this.selectedImage = this.images[this.selectedImageIndex];
            this.scrollToActiveThumbnail();
        }
    }

    nextImage(): void {
        if (this.selectedImageIndex < this.images.length - 1) {
            this.selectedImageIndex++;
            this.selectedImage = this.images[this.selectedImageIndex];
            this.scrollToActiveThumbnail();
        }
    }

    selectImage(image: Image, index: number): void {
        this.selectedImage = image;
        this.selectedImageIndex = index;
        this.scrollToActiveThumbnail();
    }

    onSlideChange(event: Event): void {
        const swiper = (event.target as SwiperContainer).swiper;
        this.selectedImageIndex = swiper.activeIndex;
        this.selectedImage = this.images[this.selectedImageIndex];
        this.scrollToActiveThumbnail();
    }

    private scrollToActiveThumbnail(): void {
        if (this.previewStrip?.nativeElement?.swiper) {
            const swiper = this.previewStrip.nativeElement.swiper;
            // Ensure the slide is visible by scrolling to it
            swiper.slideTo(this.selectedImageIndex, 0, false);

            // If on mobile, ensure the slide is centered
            if (window.innerWidth <= 768) {
                const slideWidth = swiper.slides[0]?.offsetWidth || 0;
                const containerWidth = swiper.el.offsetWidth;
                const scrollPosition = slideWidth * this.selectedImageIndex - (containerWidth - slideWidth) / 2;
                swiper.wrapperEl.style.transform = `translate3d(${-scrollPosition}px, 0, 0)`;
            }
        }
    }

    get skeletonArray(): Array<number> {
        return Array(6)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

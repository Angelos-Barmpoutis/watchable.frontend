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
        this.scrollToActiveThumbnail();
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
        if (this.previewStrip?.nativeElement) {
            this.previewStrip.nativeElement.swiper.slideTo(this.selectedImageIndex);
        }
    }

    get skeletonArray(): Array<number> {
        return Array(6)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

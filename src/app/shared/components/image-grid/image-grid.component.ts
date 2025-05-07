import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';
import { Backdrop } from '../../models/media.model';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';

@Component({
    selector: 'app-image-grid',
    standalone: true,
    imports: [CommonModule, BackdropPathDirective, FadeInDirective, ImageGalleryComponent],
    templateUrl: './image-grid.component.html',
    styleUrls: ['./image-grid.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGridComponent {
    @Input() images: Array<Backdrop> = [];
    @Input() isLoading = false;
    @Input() aspectRatio: '16/9' | '3/4' = '16/9';
    @Input() imagesCount = DEFAULT.imagesCount;

    selectedImageIndex?: number;
    readonly backdropSize = BackdropSize;
    readonly default = DEFAULT;

    openViewer(index: number, event: Event): void {
        event.stopPropagation();
        this.selectedImageIndex = index;
    }

    closeViewer(): void {
        this.selectedImageIndex = undefined;
    }

    get skeletonArray(): Array<number> {
        return Array(this.imagesCount)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

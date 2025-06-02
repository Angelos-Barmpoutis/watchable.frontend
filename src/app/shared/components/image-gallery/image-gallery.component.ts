import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { BaseGalleryComponent } from '../../abstract/base-gallery.abstract';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { AspectRatio } from '../../enumerations/aspect-ratio.enum';
import { BackdropSize } from '../../enumerations/backdrop-size.enum';
import { Backdrop } from '../../models/media.model';

@Component({
    standalone: true,
    selector: 'app-image-gallery',
    imports: [CommonModule, BackdropPathDirective, FadeInDirective],
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageGalleryComponent extends BaseGalleryComponent implements AfterViewInit {
    @Input() images: Array<Backdrop> = [];
    @Input() aspectRatio: AspectRatio = AspectRatio['16/9'];
    readonly backdropSize = BackdropSize;
    readonly aspectRatioEnum = AspectRatio;

    ngAfterViewInit(): void {
        // Initialize swipers with optimized settings
        requestAnimationFrame(() => {
            if (this.viewerStrip?.nativeElement) {
                const viewerSwiper = this.viewerStrip.nativeElement;
                Object.assign(viewerSwiper.swiper.params, {
                    preloadImages: false,
                    updateOnWindowResize: true,
                    watchSlidesProgress: true,
                    resistance: false,
                });
                viewerSwiper.swiper.update();
            }

            if (this.previewStrip?.nativeElement) {
                const previewSwiper = this.previewStrip.nativeElement;
                Object.assign(previewSwiper.swiper.params, {
                    preloadImages: false,
                    updateOnWindowResize: true,
                    watchSlidesProgress: true,
                    resistance: false,
                });
                previewSwiper.swiper.update();
            }
        });
    }

    protected override onSelectedIndexChange(): void {
        // No additional logic needed for image gallery
    }
}

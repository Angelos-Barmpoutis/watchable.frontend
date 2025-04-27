import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { BaseGalleryComponent } from '../../abstract/base-gallery.abstract';
import { BackdropPathDirective } from '../../directives/backdrop-path.directive';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { BACKDROP_SIZE } from '../../enumerations/backdrop-size.enum';
import { Backdrop } from '../../models/media.model';

@Component({
    selector: 'app-image-gallery',
    standalone: true,
    imports: [CommonModule, BackdropPathDirective, FadeInDirective],
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageGalleryComponent extends BaseGalleryComponent {
    @Input() images: Array<Backdrop> = [];
    readonly BACKDROP_SIZE = BACKDROP_SIZE;

    protected override onSelectedIndexChange(): void {
        // No additional logic needed for media gallery
    }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { BaseGalleryComponent } from '../../abstract/base-gallery.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { getVideoUrl } from '../../helpers/video-url.helper';
import { Video } from '../../models/media.model';

@Component({
    selector: 'app-video-gallery',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './video-gallery.component.html',
    styleUrls: ['./video-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoGalleryComponent extends BaseGalleryComponent {
    @Input() videos: Array<Video> = [];
    videoUrl: SafeResourceUrl | null = null;

    constructor(private sanitizer: DomSanitizer) {
        super();
    }

    protected override onSelectedIndexChange(): void {
        if (this.selectedIndex !== undefined && this.videos[this.selectedIndex]) {
            this.videoUrl = getVideoUrl(this.videos[this.selectedIndex], this.sanitizer);
        }
    }
}

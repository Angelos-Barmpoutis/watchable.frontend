import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { Video } from '../../models/media.model';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

@Component({
    standalone: true,
    selector: 'app-video-grid',
    imports: [CommonModule, FadeInDirective, VideoGalleryComponent],
    templateUrl: './video-grid.component.html',
    styleUrls: ['./video-grid.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGridComponent {
    @Input() videos: Array<Video> = [];
    @Input() isLoading = false;
    @Input() videosCount = DEFAULT.videosCount;

    selectedIndex?: number;
    readonly default = DEFAULT;

    openViewer(index: number, event: Event): void {
        event.stopPropagation();
        this.selectedIndex = index;
    }

    closeViewer(): void {
        this.selectedIndex = undefined;
    }

    get skeletonArray(): Array<number> {
        return Array(this.videosCount)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

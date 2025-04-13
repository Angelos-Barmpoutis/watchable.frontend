import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SwiperContainer } from 'swiper/element';

import { DEFAULT } from '../../constants/defaults.constant';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { getVideoUrl } from '../../helpers/video-url.helper';
import { Video } from '../../models/media.model';

@Component({
    selector: 'app-videos-viewer',
    standalone: true,
    imports: [CommonModule, FadeInDirective],
    templateUrl: './videos-viewer.component.html',
    styleUrls: ['./videos-viewer.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosViewerComponent {
    @Input() videos: Array<Video> = [];
    @Input() isLoading = false;
    @ViewChild('previewStrip') previewStrip?: ElementRef<SwiperContainer>;

    selectedVideo: Video | null = null;
    selectedVideoIndex = 0;
    showViewer = false;
    videoUrl: SafeResourceUrl | null = null;
    readonly DEFAULT = DEFAULT;

    constructor(private sanitizer: DomSanitizer) {}

    openViewer(video: Video, index: number, isCounter = false): void {
        this.selectedVideo = video;
        this.selectedVideoIndex = isCounter ? 5 : index;
        this.showViewer = true;
        this.videoUrl = getVideoUrl(this.selectedVideo, this.sanitizer);
        this.scrollToActiveThumbnail();
    }

    closeViewer(): void {
        this.showViewer = false;
        this.selectedVideo = null;
        this.videoUrl = null;
    }

    prevVideo(): void {
        if (this.selectedVideoIndex > 0) {
            this.selectedVideoIndex--;
            this.selectedVideo = this.videos[this.selectedVideoIndex];
            this.videoUrl = getVideoUrl(this.selectedVideo, this.sanitizer);
            this.scrollToActiveThumbnail();
        }
    }

    nextVideo(): void {
        if (this.selectedVideoIndex < this.videos.length - 1) {
            this.selectedVideoIndex++;
            this.selectedVideo = this.videos[this.selectedVideoIndex];
            this.videoUrl = getVideoUrl(this.selectedVideo, this.sanitizer);
            this.scrollToActiveThumbnail();
        }
    }

    selectVideo(video: Video, index: number): void {
        this.selectedVideo = video;
        this.selectedVideoIndex = index;
        this.videoUrl = getVideoUrl(this.selectedVideo, this.sanitizer);
        this.scrollToActiveThumbnail();
    }

    onSlideChange(event: Event): void {
        const swiper = (event.target as SwiperContainer).swiper;
        this.selectedVideoIndex = swiper.activeIndex;
        this.selectedVideo = this.videos[this.selectedVideoIndex];
        this.videoUrl = getVideoUrl(this.selectedVideo, this.sanitizer);
        this.scrollToActiveThumbnail();
    }

    private scrollToActiveThumbnail(): void {
        if (this.previewStrip?.nativeElement) {
            this.previewStrip.nativeElement.swiper.slideTo(this.selectedVideoIndex);
        }
    }

    get skeletonArray(): Array<number> {
        return Array(6)
            .fill(0)
            .map((_, index) => index + 1);
    }
}

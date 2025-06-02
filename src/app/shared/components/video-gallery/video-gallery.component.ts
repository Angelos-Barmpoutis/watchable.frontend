import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { BaseGalleryComponent } from '../../abstract/base-gallery.abstract';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { getYoutubeVideoUrl } from '../../helpers/youtube-video-url.helper';
import { Video } from '../../models/media.model';

interface YouTubeEvent {
    event: string;
    info: number;
}

@Component({
    standalone: true,
    selector: 'app-video-gallery',
    imports: [CommonModule, FadeInDirective],
    templateUrl: './video-gallery.component.html',
    styleUrls: ['./video-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoGalleryComponent extends BaseGalleryComponent implements AfterViewInit {
    @Input() videos: Array<Video> = [];
    @ViewChild('videoIframe') videoIframe?: ElementRef<HTMLIFrameElement>;
    videoUrl: SafeResourceUrl | null = null;

    constructor(private sanitizer: DomSanitizer) {
        super();
    }

    ngAfterViewInit(): void {
        window.addEventListener('message', (event: MessageEvent<string>) => {
            const iframe = this.videoIframe?.nativeElement;
            if (iframe && event.source === iframe.contentWindow) {
                const data = JSON.parse(event.data) as YouTubeEvent;
                if (data.event === 'onStateChange' && data.info === 1) {
                    this.handleVideoPlay();
                }
            }
        });
    }

    protected override onSelectedIndexChange(): void {
        if (this.selectedIndex !== undefined && this.videos[this.selectedIndex]) {
            this.videoUrl = getYoutubeVideoUrl(this.videos[this.selectedIndex], this.sanitizer);
        }
    }

    private handleVideoPlay(): void {
        const iframe = this.videoIframe?.nativeElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*');
        }
    }
}

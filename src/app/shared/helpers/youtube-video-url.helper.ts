import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Video } from '../models/media.model';

export function getYoutubeVideoUrl(video: Video | null, sanitizer: DomSanitizer): SafeResourceUrl | null {
    if (!video) return null;

    return sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.key}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=0`,
    );
}

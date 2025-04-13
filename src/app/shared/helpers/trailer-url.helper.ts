import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Video {
    type: string;
    site: string;
    key: string;
}

export function getTrailerUrl(videos: Array<Video> | undefined, sanitizer: DomSanitizer): SafeResourceUrl | null {
    if (!videos?.length) return null;

    const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    if (!trailer) return null;

    return sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${trailer.key}`);
}

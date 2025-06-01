import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Video } from '../models/media.model';

/**
 * YouTube video URL utilities for media playback
 * Generates secure YouTube embed URLs with custom parameters
 */

/**
 * Converts a Video object to a safe YouTube embed URL
 * @param video - The video object containing YouTube key
 * @param sanitizer - Angular DomSanitizer for secure URL handling
 * @returns SafeResourceUrl for YouTube embed or null if no video
 */
export function getYoutubeVideoUrl(video: Video | null, sanitizer: DomSanitizer): SafeResourceUrl | null {
    if (!video) return null;

    return sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.key}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=0`,
    );
}

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Video } from '../models/media.model';

/**
 * YouTube video URL utilities for media playback
 * Generates secure YouTube embed URLs with custom parameters
 */

/**
 * Detects if the current device is an iOS device (iPhone, iPad, iPod)
 * Also checks for iOS Safari specifically
 */
function isIOSDevice(): boolean {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && 'ontouchend' in document);
}

/**
 * Converts a Video object to a safe YouTube embed URL
 * @param video - The video object containing YouTube key
 * @param sanitizer - Angular DomSanitizer for secure URL handling
 * @returns SafeResourceUrl for YouTube embed or null if no video
 */
export function getYoutubeVideoUrl(video: Video | null, sanitizer: DomSanitizer): SafeResourceUrl | null {
    if (!video) return null;

    const isIOS = isIOSDevice();
    let videoUrl = `https://www.youtube.com/embed/${video.key}?`;

    // Common parameters for all devices
    const commonParams = [
        'autoplay=1',
        'modestbranding=1',
        'rel=0',
        'showinfo=0',
        'enablejsapi=1',
        'origin=' + window.location.origin,
        'playerapiid=ytplayer',
        'version=3',
        'suggestedQuality=highres',
        'quality=highres',
    ];

    if (isIOS) {
        // iOS requires muted start and needs controls
        commonParams.push('mute=1', 'playsinline=1', 'controls=1');
    } else {
        // Non-iOS devices start with sound and no controls
        commonParams.push('mute=0', 'controls=0');
    }

    videoUrl += commonParams.join('&');
    return sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
}

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
 *
 * Note: iOS Safari requires user interaction before autoplay works, even with mute=1.
 * The video gallery component should handle user clicks to trigger playback.
 */
export function getYoutubeVideoUrl(video: Video | null, sanitizer: DomSanitizer): SafeResourceUrl | null {
    if (!video) return null;

    // For iOS devices, we need to use muted autoplay and additional parameters
    // to work around iOS autoplay restrictions
    const isIOS = isIOSDevice();

    let videoUrl = `https://www.youtube.com/embed/${video.key}?`;

    if (isIOS) {
        // iOS-specific parameters for autoplay compatibility
        // mute=1 is required for autoplay on iOS
        // playsinline=1 prevents fullscreen on iPhone
        // enablejsapi=1 allows programmatic control
        videoUrl += 'autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0&showinfo=0&controls=1&enablejsapi=1';
    } else {
        // Standard parameters for non-iOS devices
        videoUrl += 'autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=0';
    }

    return sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
}

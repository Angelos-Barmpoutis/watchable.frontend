import { Video } from '../models/media.model';

/**
 * Trailer video utilities for finding and filtering video content
 * Extracts trailer videos from media video collections
 */

/**
 * Finds the first YouTube trailer video from a collection of videos
 * @param videos - Array of video objects to search through
 * @returns The first trailer video found, or null if none exists
 */
export function getTrailerVideo(videos: Array<Video>): Video | null {
    const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    if (!trailer) return null;

    return trailer;
}

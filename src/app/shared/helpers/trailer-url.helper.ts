import { Video } from '../models/media.model';

export function getTrailerVideo(videos: Array<Video>): Video | null {
    const trailer = videos.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
    if (!trailer) return null;

    return trailer;
}

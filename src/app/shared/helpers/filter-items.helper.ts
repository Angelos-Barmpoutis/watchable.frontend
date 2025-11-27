import { Movie } from '../models/movie.model';
import { Person } from '../models/people.model';
import { TvShow } from '../models/tv-show.model';

/**
 * Content filtering utilities for media items
 * Filters out items without required visual assets for better UX
 */

/**
 * Filters media items to include only those with poster images
 * @param mediaItems - Array of movies or TV shows
 * @returns Filtered array containing only items with poster_path
 */
export function filterMediaItems<T extends Array<Movie | TvShow>>(mediaItems: T): T {
    return mediaItems.filter((item) => item.poster_path) as T;
}

/**
 * Filters person items to include only those with profile images
 * @param mediaItems - Array of person objects
 * @returns Filtered array containing only persons with profile_path
 */
export function filterPersonItems(mediaItems: Array<Person>): Array<Person> {
    return mediaItems.filter((item) => item.profile_path);
}

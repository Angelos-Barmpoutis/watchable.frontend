import { Genre } from '../models/genre.model';
import { Movie, MovieItem } from '../models/movie.model';
import { TvShow, TvShowItem } from '../models/tv-show.model';

/**
 * Genre mapping utilities for movies and TV shows
 * Transforms genre IDs to full genre objects and handles genre display formatting
 */

/**
 * Maps movies with their corresponding genre objects
 * @param movies - Array of movie objects with genre_ids
 * @param genres - Array of all available genres
 * @returns Array of MovieItems with populated genre objects
 */
export function mapMoviesWithGenres(movies: Array<Movie>, genres: Array<Genre>): Array<MovieItem> {
    return movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids
            .map((id) => genres.find((g) => g.id === id))
            .filter((genre): genre is Genre => genre !== undefined),
    }));
}

/**
 * Maps TV shows with their corresponding genre objects
 * @param tvShows - Array of TV show objects with genre_ids
 * @param genres - Array of all available genres
 * @returns Array of TvShowItems with populated genre objects
 */
export function mapTvShowsWithGenres(tvShows: Array<TvShow>, genres: Array<Genre>): Array<TvShowItem> {
    return tvShows.map((tvShow) => ({
        ...tvShow,
        genres: tvShow.genre_ids
            .map((id) => genres.find((g) => g.id === id))
            .filter((genre): genre is Genre => genre !== undefined),
    }));
}

/**
 * Converts genre IDs to a formatted string of genre names
 * @param genreIds - Array of genre ID numbers (optional)
 * @param allGenres - Array of all available genres
 * @returns Comma-separated string of genre names (max 3 genres)
 */
export function mapGenres(genreIds: Array<number> = [], allGenres: Array<Genre>): string {
    return genreIds
        .map((id) => allGenres.find((g) => g.id === id))
        .filter((genre): genre is Genre => genre !== undefined)
        .map((g) => g.name)
        .slice(0, 3)
        .join(', ');
}

import { Genre } from '../models/genre.model';
import { Movie, MovieItem } from '../models/movie.model';
import { TvShow, TvShowItem } from '../models/tv-show.model';

export function mapMoviesWithGenres(movies: Array<Movie>, genres: Array<Genre>): Array<MovieItem> {
    return movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids
            .map((id) => genres.find((g) => g.id === id))
            .filter((genre): genre is Genre => genre !== undefined),
    }));
}

export function mapTvShowsWithGenres(tvShows: Array<TvShow>, genres: Array<Genre>): Array<TvShowItem> {
    return tvShows.map((tvShow) => ({
        ...tvShow,
        genres: tvShow.genre_ids
            .map((id) => genres.find((g) => g.id === id))
            .filter((genre): genre is Genre => genre !== undefined),
    }));
}

export function mapGenres(genreIds: Array<number> = [], allGenres: Array<Genre>): string {
    return genreIds
        .map((id) => allGenres.find((g) => g.id === id))
        .filter((genre): genre is Genre => genre !== undefined)
        .map((g) => g.name)
        .slice(0, 3)
        .join(', ');
}

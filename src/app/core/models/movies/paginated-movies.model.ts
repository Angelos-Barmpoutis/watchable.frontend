import { Movie } from './movie.model';

export interface PaginatedMovies {
    dates?: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: Array<Movie>;
    total_pages: number;
    total_results: number;
}

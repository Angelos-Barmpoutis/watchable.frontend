import { Movie } from '../movie.model';

export interface TrendingResponse {
    page: number;
    results: Array<Movie>;
    total_pages: number;
    total_results: number;
}

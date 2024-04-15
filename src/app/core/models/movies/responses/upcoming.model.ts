import { Movie } from '../movie.model';

export interface UpcomingResponse {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: Array<Movie>;
    total_pages: number;
    total_results: number;
}

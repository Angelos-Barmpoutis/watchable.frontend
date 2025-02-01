import { TvSeries } from './tv-series.model';

export interface PaginatedTvSeries {
    page: number;
    results: Array<TvSeries>;
    total_pages: number;
    total_results: number;
}

import { Review } from './review.model';

export interface PaginatedReviewItems {
    page: number;
    results: Array<Review>;
    total_pages: number;
    total_results: number;
}

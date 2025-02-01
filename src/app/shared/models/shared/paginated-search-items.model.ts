import { SearchItem } from './search-item.model';

export interface PaginatedSearchItems {
    page: number;
    results: Array<SearchItem>;
    total_pages: number;
    total_results: number;
}

import { Person } from './person.model';

export interface PaginatedPeople {
    dates?: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: Array<Person>;
    total_pages: number;
    total_results: number;
}

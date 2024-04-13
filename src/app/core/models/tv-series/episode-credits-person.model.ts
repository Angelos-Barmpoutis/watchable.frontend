import { Person } from '../people/person.model';

export interface TvSeriesEpisodeCreditsPerson extends Person {
    character: string;
    credit_id: string;
    order: number;
}

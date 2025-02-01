import { Person } from '../people/person.model';
import { PersonRole } from '../people/role.model';

export interface TvSeriesCreditsPerson extends Person {
    roles: Array<PersonRole>;
    total_episode_count: number;
    order: number;
}

import { Person } from '../people/person.model';

export interface MovieCreditsPerson extends Person {
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

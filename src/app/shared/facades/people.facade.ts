import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DEFAULT } from '../constants/defaults.constant';
import { PeopleGateway } from '../gateways/people.gateway';
import { PaginatedPeople, PersonDetails } from '../models/people.model';

@Injectable({
    providedIn: 'root',
})
export class PeopleFacade {
    constructor(private peopleGateway: PeopleGateway) {}

    public getPopular(page: number = DEFAULT.page): Observable<PaginatedPeople> {
        return this.peopleGateway.getPopular(page);
    }

    public getPersonDetails(id: number): Observable<PersonDetails> {
        return this.peopleGateway.getPersonDetails(id);
    }
}

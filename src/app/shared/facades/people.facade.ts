import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { PeopleGateway } from '../gateways/people.gateway';

@Injectable({
    providedIn: 'root',
})
export class PeopleFacade {
    constructor(private peopleGateway: PeopleGateway) {}

    public getPopular(): Observable<PaginatedPeople> {
        return this.peopleGateway.getPopular();
    }
}

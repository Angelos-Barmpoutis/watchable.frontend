import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { UrlService } from '../../core/services/url.service';
import { PeopleDriver } from '../drivers/people.driver';

@Injectable({
    providedIn: 'root',
})
export class PeopleGateway {
    constructor(
        private peopleDriver: PeopleDriver,
        private urlService: UrlService,
    ) {}

    getPopular(page: number): Observable<PaginatedPeople> {
        return this.peopleDriver.getPopularPeople(this.urlService.urlFor(['person', `popular?page=${page}`]));
    }
}

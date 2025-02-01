import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PeopleDriver } from '../drivers/people.driver';
import { PaginatedPeople } from '../models/people/paginated-people.model';
import { UrlService } from '../services/url.service';

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

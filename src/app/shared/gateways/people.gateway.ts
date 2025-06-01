import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PeopleDriver } from '../drivers/people.driver';
import { PaginatedPeople, PersonDetails } from '../models/people.model';
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
        return this.peopleDriver.getPopularPeople(this.urlService.createUrlForTMDB(['person', `popular?page=${page}`]));
    }

    getPersonDetails(id: number): Observable<PersonDetails> {
        return this.peopleDriver.getPersonDetails(
            this.urlService.createUrlForTMDB(['person', `${id}`], {
                append_to_response: 'images,external_ids,movie_credits,tv_credits',
            }),
        );
    }
}

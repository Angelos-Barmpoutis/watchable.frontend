import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedPeople, PersonDetails } from '../models/people.model';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class PeopleDriver {
    constructor(private httpService: HttpService) {}

    getPopularPeople(url: string): Observable<PaginatedPeople> {
        return this.httpService.get(url);
    }

    getPersonDetails(url: string): Observable<PersonDetails> {
        return this.httpService.get(url);
    }
}

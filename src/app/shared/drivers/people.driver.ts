import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedPeople } from '../../core/models/people/paginated-people.model';
import { HttpService } from '../../core/services/http.service';

@Injectable({
    providedIn: 'root',
})
export class PeopleDriver {
    constructor(private httpService: HttpService) {}

    getPopularPeople(url: string): Observable<PaginatedPeople> {
        return this.httpService.get(url);
    }
}

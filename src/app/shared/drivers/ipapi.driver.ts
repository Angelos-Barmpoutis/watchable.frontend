import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root',
})
export class IpapiDriver {
    constructor(private httpService: HttpService) {}

    getUserCountryCode(url: string): Observable<string> {
        return this.httpService.get(url);
    }
}

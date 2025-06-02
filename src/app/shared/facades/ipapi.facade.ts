import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IpapiGateway } from '../gateways/ipapi.gateway';

@Injectable({
    providedIn: 'root',
})
export class IpapiFacade {
    constructor(private ipapiGateway: IpapiGateway) {}

    public getMovieGenres(): Observable<string> {
        return this.ipapiGateway.getUserCountryCode();
    }
}

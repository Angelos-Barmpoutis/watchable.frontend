import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IpapiDriver } from '../drivers/ipapi.driver';

@Injectable({
    providedIn: 'root',
})
export class IpapiGateway {
    constructor(private ipapiDriver: IpapiDriver) {}

    getUserCountryCode(): Observable<string> {
        return this.ipapiDriver.getUserCountryCode(environment.ipapiUrl);
    }
}

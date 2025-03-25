import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UrlService {
    private TMDBBaseUrl = environment.TMDBBaseUrl;

    createUrlForTMDB(path: Array<string>, queryParams?: { [key: string]: string | number }): string {
        let url = this.TMDBBaseUrl + path.join('/');

        if (queryParams) {
            const params = new URLSearchParams();
            for (const key in queryParams) {
                if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
                    // Convert number values to strings
                    const value = queryParams[key].toString();
                    params.set(key, value);
                }
            }
            url += '?' + params.toString();
        }

        return url;
    }
}

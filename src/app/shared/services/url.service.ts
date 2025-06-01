import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

/**
 * URL construction service for TMDB API endpoints
 * Generates properly formatted URLs with query parameters
 */
@Injectable({
    providedIn: 'root',
})
export class UrlService {
    private TMDBBaseUrl = environment.TMDBBaseUrl;

    /**
     * Creates a complete URL for TMDB API requests
     * @param path - Array of path segments to join
     * @param queryParams - Optional query parameters object
     * @returns Complete URL string for TMDB API request
     * @example
     * ```typescript
     * // Creates: "https://api.themoviedb.org/3/movie/popular?api_key=xxx&page=1"
     * createUrlForTMDB(['movie', 'popular'], { api_key: 'xxx', page: 1 })
     * ```
     */
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

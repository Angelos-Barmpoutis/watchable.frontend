import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * HTTP service wrapper for common HTTP operations
 * Provides type-safe HTTP methods with simplified interface
 */
@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    /**
     * Performs a GET request with type safety
     * @param url - The URL to send the GET request to
     * @returns Observable of typed response data
     * @template T - Expected type of the response data
     */
    get<T>(url: string): Observable<T> {
        return this.http.get<T>(url);
    }

    /**
     * Performs a POST request with type safety
     * @param url - The URL to send the POST request to
     * @param body - The request body data
     * @returns Observable of typed response data
     * @template T - Expected type of the response data
     */
    post<T>(url: string, body: unknown): Observable<T> {
        return this.http.post<T>(url, body);
    }
}

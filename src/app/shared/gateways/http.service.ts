import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    get<T>(url: string, params?: Record<string, string | number | boolean>): Observable<T> {
        const httpParams = new HttpParams({ fromObject: params || {} });
        return this.http.get<T>(url, { params: httpParams });
    }

    post<T>(url: string, body: Record<string, string | number | boolean>): Observable<T> {
        return this.http.post<T>(url, body);
    }

    put<T>(url: string, body: Record<string, string | number | boolean>): Observable<T> {
        return this.http.put<T>(url, body);
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url);
    }
}

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    handleError(error: unknown): void {
        console.error('An error occurred:', error);
    }
}

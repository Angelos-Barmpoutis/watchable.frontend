import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SnackbarService } from './snackbar.service';

interface ErrorResponse {
    message?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor(private snackbarService: SnackbarService) {}

    /**
     * Handle HTTP errors and display appropriate messages
     */
    handleError(error: HttpErrorResponse): void {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            switch (error.status) {
                case 400:
                    errorMessage = 'Bad request. Please check your input.';
                    break;
                case 401:
                    errorMessage = 'Unauthorized. Please sign in again.';
                    break;
                case 403:
                    errorMessage = "Access forbidden. You don't have permission to perform this action.";
                    break;
                case 404:
                    errorMessage = 'Resource not found.';
                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later.';
                    break;
                default:
                    errorMessage = (error.error as ErrorResponse)?.message || errorMessage;
            }
        }

        this.snackbarService.error(errorMessage);
    }

    /**
     * Handle general application errors
     */
    handleApplicationError(error: Error): void {
        this.snackbarService.error(error.message || 'An unexpected error occurred');
    }

    /**
     * Handle validation errors
     */
    handleValidationError(errors: Record<string, Array<string>>): void {
        const errorMessage = Object.values(errors).flat().join(', ');
        this.snackbarService.error(errorMessage);
    }

    /**
     * Handle network errors
     */
    handleNetworkError(): void {
        this.snackbarService.error('Network error. Please check your internet connection.');
    }
}

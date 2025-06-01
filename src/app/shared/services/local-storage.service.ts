import { Injectable } from '@angular/core';

/**
 * Local storage service with type safety and error handling
 * Provides a wrapper around browser localStorage with JSON serialization
 */
@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    /**
     * Stores data in localStorage with JSON serialization
     * @param key - The storage key identifier
     * @param data - The data to store (will be JSON stringified)
     * @template T - Type of data being stored
     */
    setItem<T>(key: string, data: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error storing data', error);
        }
    }

    /**
     * Retrieves and parses data from localStorage
     * @param key - The storage key identifier
     * @returns The parsed data or null if not found/invalid
     * @template T - Expected type of the retrieved data
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (error) {
            console.error('Error retrieving data', error);
            return null;
        }
    }

    /**
     * Removes a specific item from localStorage
     * @param key - The storage key identifier to remove
     */
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clears all data from localStorage
     * @warning This will remove all localStorage data for the domain
     */
    clear(): void {
        localStorage.clear();
    }
}

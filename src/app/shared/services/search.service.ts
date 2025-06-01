import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Search service for managing global search state and navigation
 * Handles search query persistence and URL synchronization
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private searchQuery$ = new BehaviorSubject<string>('');
    private previousUrl: string = '/';

    constructor(private router: Router) {
        // Initialize with current URL query param if any
        this.initializeFromUrl();

        // Track navigation for previous URL
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const currentUrl = event.url;
                if (!currentUrl.includes('/search')) {
                    this.previousUrl = currentUrl;
                } else {
                    // Update query from URL on navigation to search
                    this.updateQueryFromUrl(currentUrl);
                }
            }
        });
    }

    /**
     * Initializes search query from current URL if on search page
     * @private
     */
    private initializeFromUrl(): void {
        const currentUrl = this.router.url;
        if (currentUrl.includes('/search')) {
            this.updateQueryFromUrl(currentUrl);
        }
    }

    /**
     * Extracts and updates search query from URL parameters
     * @param url - The URL to parse for search query
     * @private
     */
    private updateQueryFromUrl(url: string): void {
        const query = new URLSearchParams(url.split('?')[1]).get('q') || '';
        this.searchQuery$.next(query);
    }

    /**
     * Gets the current search query as an observable
     * @returns Observable stream of search query strings
     */
    getSearchQuery(): Observable<string> {
        return this.searchQuery$.asObservable();
    }

    /**
     * Updates the search query and navigates to search page or previous page
     * @param query - The new search query string
     */
    updateSearchQuery(query: string): void {
        this.searchQuery$.next(query);

        if (query?.trim() !== '') {
            this.router.navigate(['/search'], {
                queryParams: { q: query },
                replaceUrl: true,
            });
        } else if (this.router.url.includes('/search')) {
            this.router.navigate([this.previousUrl], { replaceUrl: true });
        }
    }
}

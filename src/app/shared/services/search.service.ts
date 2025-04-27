import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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

    private initializeFromUrl(): void {
        const currentUrl = this.router.url;
        if (currentUrl.includes('/search')) {
            this.updateQueryFromUrl(currentUrl);
        }
    }

    private updateQueryFromUrl(url: string): void {
        const query = new URLSearchParams(url.split('?')[1]).get('q') || '';
        this.searchQuery$.next(query);
    }

    getSearchQuery(): Observable<string> {
        return this.searchQuery$.asObservable();
    }

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

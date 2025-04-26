import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private previousUrl: string = '';

    constructor(private router: Router) {
        this.getPreviousUrl();
    }

    private getPreviousUrl(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (!event.url.includes('/search')) {
                    this.previousUrl = event.url;
                }
            }
        });
    }

    private navigateToSearchPage(query: string): void {
        this.router.navigate(['/search'], { queryParams: { q: query } });
    }

    private navigateToPreviousPage(): void {
        this.router.navigate([this.previousUrl]);
    }

    handleSearchQuery(query: string): void {
        if (query?.trim() !== '') {
            this.navigateToSearchPage(query);
        } else {
            this.navigateToPreviousPage();
        }
    }
}

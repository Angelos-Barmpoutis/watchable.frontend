import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private isSearchOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isSearchOpen$: Observable<boolean> = this.isSearchOpen.asObservable();

    constructor() {}

    toggleSearch(): void {
        this.isSearchOpen.next(!this.isSearchOpen.value);
    }
}

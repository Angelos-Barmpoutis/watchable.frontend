import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime } from 'rxjs';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, FadeInDirective],
})
export class HeaderComponent implements OnInit {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @HostListener('document:click', ['$event'])
    onDocumentClick(): void {
        if (this.isProfileDropdownOpen) {
            this.isProfileDropdownOpen = false;
        }
    }

    isProfileDropdownOpen = false;
    isSearchVisible = false;
    searchForm!: FormGroup;

    constructor(
        private searchService: SearchService,
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.initSearchForm();
        this.onSearch();
    }

    get searchQueryFormField(): FormControl {
        return this.searchForm.get('searchQuery') as FormControl;
    }

    private focusSearchInput(): void {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 200);
    }

    private initSearchForm(): void {
        this.searchForm = this.fb.group({
            searchQuery: [''],
        });
    }

    toggleProfileDropdown(event: Event): void {
        event.stopPropagation();
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }

    toggleSearch(event: Event): void {
        event.stopPropagation();
        this.isSearchVisible = !this.isSearchVisible;

        if (this.isSearchVisible) {
            this.focusSearchInput();
        }
    }

    closeSearch(): void {
        this.isSearchVisible = false;
        this.searchForm.reset();
    }

    clearSearch(): void {
        this.searchQueryFormField.setValue('');
        const query = this.searchQueryFormField.value as string;
        this.searchService.handleSearchQuery(query);
    }

    private onSearch(): void {
        this.searchQueryFormField.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300))
            .subscribe((value: string) => {
                this.searchService.handleSearchQuery(value);
            });
    }
}

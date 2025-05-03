import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NAVIGATION_LINKS, NavigationLink } from '../../config/navigation.config';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SearchService } from '../../services/search.service';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, FadeInDirective, ButtonComponent],
})
export class HeaderComponent implements OnInit {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @HostListener('document:click', ['$event'])
    onDocumentClick(): void {
        if (this.isProfileDropdownOpen) {
            this.isProfileDropdownOpen = false;
        }
    }

    readonly buttonType = ButtonType;
    readonly navigationLinks = NAVIGATION_LINKS;

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
        this.initializeSearchState();
        this.setupSearchSubscription();
    }

    get searchQueryFormField(): FormControl {
        return this.searchForm.get('searchQuery') as FormControl;
    }

    private initializeSearchState(): void {
        this.searchService
            .getSearchQuery()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((query) => {
                this.searchQueryFormField.setValue(query);
            });
    }

    private setupSearchSubscription(): void {
        this.searchQueryFormField.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300), distinctUntilChanged())
            .subscribe((value: string) => {
                this.searchService.updateSearchQuery(value);
            });
    }

    private focusSearchInput(): void {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 300);
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
    }

    trackByLink(index: number, link: NavigationLink): string {
        return link.path;
    }
}

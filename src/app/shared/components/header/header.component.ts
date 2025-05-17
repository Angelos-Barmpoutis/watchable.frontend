import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NAVIGATION_LINKS, NavigationLink } from '../../config/navigation.config';
import { DropdownAnimationDirective } from '../../directives/dropdown-animation.directive';
import { DialogService } from '../../services/dialog.service';
import { SearchService } from '../../services/search.service';
import { ButtonComponent } from '../button/button.component';
import { ButtonType } from '../button/enumerations/button-type.enum';
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        RouterLinkActive,
        DropdownAnimationDirective,
        ButtonComponent,
    ],
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
    isLoggedIn = false;
    searchForm!: FormGroup;

    constructor(
        private searchService: SearchService,
        private fb: FormBuilder,
        private destroyRef: DestroyRef,
        private dialogService: DialogService,
    ) {}

    ngOnInit(): void {
        this.initSearchForm();
    }

    private initSearchForm(): void {
        this.searchForm = this.fb.group({
            searchQuery: [''],
        });

        this.searchQueryFormField.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                this.searchService.updateSearchQuery(value);
            });
    }

    get searchQueryFormField(): FormControl {
        return this.searchForm.get('searchQuery') as FormControl;
    }

    toggleSearch(event: Event): void {
        event.stopPropagation();
        this.isSearchVisible = !this.isSearchVisible;

        if (this.isSearchVisible) {
            setTimeout(() => {
                this.searchInput.nativeElement.focus();
            }, 100);
        }
    }

    clearSearch(): void {
        this.searchQueryFormField.setValue('');
    }

    toggleProfileDropdown(event: Event): void {
        event.stopPropagation();
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }

    openSignInDialog(): void {
        this.dialogService.open(SignInDialogComponent);
        this.isProfileDropdownOpen = false;
    }

    trackByLink(index: number, link: NavigationLink): string {
        return link.path;
    }
}

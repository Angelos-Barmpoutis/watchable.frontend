import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, FadeInDirective],
})
export class HeaderComponent {
    @HostListener('document:click')
    onDocumentClick(): void {
        if (this.isProfileDropdownOpen) {
            this.isProfileDropdownOpen = false;
        }
    }

    isProfileDropdownOpen = false;

    constructor(private searchService: SearchService) {}

    toggleProfileDropdown(event: Event): void {
        event.stopPropagation();
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }

    toggleSearch(): void {
        this.searchService.toggleSearch();
        this.isProfileDropdownOpen = false;
    }
}

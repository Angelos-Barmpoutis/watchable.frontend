import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { NAVIGATION_LINKS, NavigationLink } from '../../config/navigation.config';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    standalone: true,
    selector: 'app-mobile-navigation',
    imports: [CommonModule, RouterLink, RouterLinkActive, FadeInDirective],
    templateUrl: './mobile-navigation.component.html',
    styleUrl: './mobile-navigation.component.scss',
})
export class MobileNavigationComponent {
    readonly navigationLinks = NAVIGATION_LINKS;

    constructor(private router: Router) {}

    isLinkActive(path: string): boolean {
        return this.router.url.includes(path);
    }

    trackByLink(index: number, link: NavigationLink): string {
        return link.path;
    }
}

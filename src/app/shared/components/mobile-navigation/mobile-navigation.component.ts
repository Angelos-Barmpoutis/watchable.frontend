import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAVIGATION_LINKS, NavigationLink } from '../../config/navigation.config';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-mobile-navigation',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, FadeInDirective],
    templateUrl: './mobile-navigation.component.html',
    styleUrl: './mobile-navigation.component.scss',
})
export class MobileNavigationComponent {
    readonly navigationLinks = NAVIGATION_LINKS;

    trackByLink(index: number, link: NavigationLink): string {
        return link.path;
    }
}

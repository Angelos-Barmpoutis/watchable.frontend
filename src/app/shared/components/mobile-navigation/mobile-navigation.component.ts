import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
    selector: 'app-mobile-navigation',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, FadeInDirective],
    templateUrl: './mobile-navigation.component.html',
    styleUrl: './mobile-navigation.component.scss',
})
export class MobileNavigationComponent {}
